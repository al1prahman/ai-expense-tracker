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

@app.post("/extract")
async def extract_receipt(file: UploadFile = File(...)):
    try:
        # Ekstrak teks mentah dari gambar
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        raw_text = pytesseract.image_to_string(image)

        # Instruksi untuk AI
        prompt = f"""
        Kamu adalah asisten keuangan pintar. Ekstrak informasi dari teks struk belanja hasil OCR berikut.
        Teksnya mungkin berantakan. Rapikan dan ambil data berikut:
        - items: daftar barang yang dibeli (name) dan harganya (price).
        - total: total harga keseluruhan (angka integer, tanpa simbol Rp/koma).
        - date: tanggal transaksi (format YYYY-MM-DD, tebak jika formatnya berbeda).
        - category: tebak kategori belanja (contoh: Makanan, Transportasi, Kebutuhan Harian, dll).

        Teks OCR:
        {raw_text}
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