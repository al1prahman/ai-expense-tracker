import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
import pytesseract
from PIL import Image
import io
import json
import os
from dotenv import load_dotenv

# Load variabel dari file .env
load_dotenv()

# Import library Gemini versi terbaru
from google import genai
from google.genai import types

# 1. Lokasi instalasi Tesseract kamu
pytesseract.pytesseract.tesseract_cmd = r'D:\tesseract\tesseract.exe'

# 2. Konfigurasi Gemini API (Sekarang mengambil dari file .env secara rahasia)
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AI Expense Tracker Service is running dengan SDK Baru!"}

def preprocess_receipt(image_bytes):
    # 1. Konversi byte gambar mentah menjadi array NumPy agar bisa dibaca OpenCV
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 2. Ubah gambar menjadi Grayscale (Hitam Putih)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. Terapkan Adaptive Thresholding 
    # (Ini sangat ampuh untuk nota yang bayangannya tidak rata atau terlipat)
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # 4. Kembalikan lagi ke format byte agar bisa dikirim ke Gemini
    is_success, buffer = cv2.imencode(".jpg", thresh)
    return buffer.tobytes()

@app.post("/extract")
async def extract_receipt(file: UploadFile = File(...)):
    try:
        # Baca gambar mentah
        raw_image_bytes = await file.read()
        
        # PROSES MAGIC COMPUTER VISION DI SINI ✨
        cleaned_image_bytes = preprocess_receipt(raw_image_bytes)

        # Ubah gambar yang sudah bersih menjadi objek PIL Image untuk Gemini
        image = Image.open(io.BytesIO(cleaned_image_bytes))

        # Ekstrak teks mentah dari gambar
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        raw_text = pytesseract.image_to_string(image)

        # Instruksi untuk AI
        prompt = """
        Anda adalah sistem Data Extraction ahli. Tugas Anda HANYA membaca struk belanja ini dan mengembalikan output murni dalam format JSON. JANGAN tambahkan teks Markdown, JANGAN gunakan blok ```json, langsung kembalikan objek JSON-nya.

        Aturan ketat:
        1. "category" hanya boleh diisi salah satu dari: "Makanan", "Transportasi", "Pakaian", "Kesehatan", atau "Lainnya".
        2. "date" harus berformat YYYY-MM-DD.
        3. Semua "price" dan "total" harus berupa angka (integer), buang semua titik/koma/Rp.

        Struktur JSON wajib:
        {
            "items": [{"name": "Nama Barang", "price": 10000}],
            "total": 50000,
            "date": "2024-05-08",
            "category": "Makanan"
        }
        """

        # Memanggil model Gemini menggunakan SDK baru
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        # Mengubah response JSON string menjadi Python Dictionary
        parsed_data = json.loads(response.text)

        return {
            "status": "success",
            "filename": file.filename,
            "raw_text": raw_text,
            "parsed_data": parsed_data
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}