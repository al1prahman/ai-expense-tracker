<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Expense;

class ExpenseController extends Controller
{
    // =====================================================================
    // 1. Fungsi untuk mengambil semua data (untuk History/Dashboard Next.js)
    // =====================================================================
    public function index()
    {
        try {
            // Mengambil semua data pengeluaran, diurutkan dari yang terbaru
            $expenses = Expense::orderBy('date', 'desc')->get();
            return response()->json($expenses, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengambil data: ' . $e->getMessage()], 500);
        }
    }

    // =====================================================================
    // 2. Fungsi untuk menerima gambar, kirim ke AI, dan simpan ke DB
    // =====================================================================
    public function extractAndSave(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'receipt' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $file = $request->file('receipt');

        try {
            set_time_limit(300);

            // 2. Kirim gambar ke Python AI Service
            $response = Http::timeout(120)->attach(
                'file', file_get_contents($file), $file->getClientOriginalName()
            )->post('http://127.0.0.1:8000/extract');

            if ($response->failed()) {
                return response()->json(['error' => 'Gagal terhubung ke AI Service'], 500);
            }

            $aiData = $response->json();

            if (isset($aiData['status']) && $aiData['status'] !== 'success') {
                return response()->json(['error' => 'AI gagal: ' . ($aiData['message'] ?? 'Kesalahan tidak diketahui')], 500);
            }

            // Ambil data JSON yang sudah dirapikan AI
            $parsedData = $aiData['parsed_data'];

            // =========================================================
            // FITUR BARU: SATPAM PENCEGAH DUPLIKAT
            // =========================================================
            // Cek apakah ada struk di tanggal yang sama & total harga yang sama
            $isDuplicate = Expense::where('date', $parsedData['date'])
                                  ->where('total', $parsedData['total'])
                                  ->exists();

            if ($isDuplicate) {
                // Jika duplikat, hentikan proses dan kembalikan error 409 (Conflict)
                return response()->json([
                    'error' => 'Gagal: Struk ini sepertinya sudah pernah di-scan sebelumnya (Data Duplikat).'
                ], 409);
            }
            // =========================================================

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
}