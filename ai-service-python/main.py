import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
import json
import os
from dotenv import load_dotenv

# Import library Gemini versi terbaru
from google import genai
from google.genai import types

# Load variabel dari file .env
load_dotenv()

# Konfigurasi Gemini API
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AI Expense Tracker Service is running dengan SDK Baru!"}

@app.post("/extract")
async def extract_receipt(file: UploadFile = File(...)):
    try:
        raw_image_bytes = await file.read()
        
        # --- [MULAI] BULLETPROOF IMAGE PROCESSING ---
        nparr = np.frombuffer(raw_image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is not None:
            # Jika OpenCV berhasil baca: Bersihkan gambar (Grayscale & Thresholding)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            thresh = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            # Transfer langsung pikselnya ke PIL Image
            image = Image.fromarray(thresh)
        else:
            # Jika OpenCV gagal (efek kompresi WhatsApp), paksa PIL membacanya
            image = Image.open(io.BytesIO(raw_image_bytes)).convert("RGB")
        # --- [SELESAI] BULLETPROOF IMAGE PROCESSING ---

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

        # PERBAIKAN: Mengirim prompt DAN image ke Gemini!
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, image],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        # Mengubah response JSON string menjadi Python Dictionary
        parsed_data = json.loads(response.text)

        # PERBAIKAN: Menghapus raw_text yang membuat error
        return {
            "status": "success",
            "filename": file.filename,
            "parsed_data": parsed_data
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}