<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Expense;

class ExpenseController extends Controller
{
    // Fungsi untuk menerima gambar, kirim ke AI, dan simpan ke DB
    public function extractAndSave(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'receipt' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $file = $request->file('receipt');

        try {
            // Matikan batas waktu bawaan PHP
            set_time_limit(300);

            // 2. Kirim gambar ke Python AI Service (Cukup SATU KALI saja dengan timeout)
            $response = Http::timeout(120)->attach(
                'file', file_get_contents($file), $file->getClientOriginalName()
            )->post('http://127.0.0.1:8000/extract');

            // Cek jika Python service mati atau error
            if ($response->failed()) {
                return response()->json(['error' => 'Gagal terhubung ke AI Service'], 500);
            }

            $aiData = $response->json();

            $parsedData = $aiData['parsed_data'];

            // 3. Simpan hasil cerdas dari AI ke Database Supabase
            $expense = Expense::create([
                'items' => $parsedData['items'],
                'total' => $parsedData['total'],
                'date' => $parsedData['date'],
                'category' => $parsedData['category']
            ]);

            // 4. Kembalikan data yang sudah tersimpan ke Frontend
            return response()->json([
                'message' => 'Struk berhasil diproses dan disimpan!',
                'data' => $expense
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }

    // Fungsi tambahan untuk mengambil semua data (untuk grafik di Next.js nanti)
    public function index()
    {
        $expenses = Expense::orderBy('date', 'desc')->get();
        return response()->json($expenses);
    }
}