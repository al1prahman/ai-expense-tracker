<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Expense;

class ExpenseController extends Controller
{
    // =====================================================================
    // 1. AMBIL RIWAYAT (Untuk Dashboard)
    // =====================================================================
    public function index()
    {
        try {
            $expenses = Expense::orderBy('date', 'desc')->get();
            return response()->json($expenses, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengambil data: ' . $e->getMessage()], 500);
        }
    }

    // =====================================================================
    // 2. EKSTRAK AI SAJA (Jangan simpan ke DB dulu)
    // =====================================================================
    public function extract(Request $request)
    {
        $request->validate([
            'receipt' => 'required|image|mimes:jpeg,png,jpg|max:15360',
        ]);

        $file = $request->file('receipt');

        try {
            set_time_limit(300);

            // Kirim ke Python AI
            $response = Http::timeout(120)->attach(
                'file', file_get_contents($file), $file->getClientOriginalName()
            )->post('http://127.0.0.1:8000/extract');

            if ($response->failed()) {
                return response()->json(['error' => 'Gagal terhubung ke AI Service'], 500);
            }

            $aiData = $response->json();

            if (isset($aiData['status']) && $aiData['status'] !== 'success') {
                return response()->json(['error' => 'AI gagal: ' . ($aiData['message'] ?? 'Unknown error')], 500);
            }

            // Kembalikan hasil AI ke Frontend untuk di-review (Belum masuk DB)
            return response()->json([
                'message' => 'Struk berhasil dibaca AI. Silakan review data berikut.',
                'data' => $aiData['parsed_data']
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }

    // =====================================================================
    // 3. SIMPAN KE DATABASE (Setelah di-review manusia)
    // =====================================================================
    public function store(Request $request)
    {
        // Validasi data yang dikirim dari form Next.js
        $validatedData = $request->validate([
            'category' => 'required|string',
            'date' => 'required|date',
            'total' => 'required|numeric',
            'items' => 'required|array',
        ]);

        try {
            // FITUR: SATPAM PENCEGAH DUPLIKAT
            $isDuplicate = Expense::where('date', $validatedData['date'])
                                  ->where('total', $validatedData['total'])
                                  ->exists();

            if ($isDuplicate) {
                return response()->json([
                    'error' => 'Gagal: Struk ini sepertinya sudah pernah disimpan (Data Duplikat).'
                ], 409);
            }

            // Simpan ke Database Supabase
            $expense = Expense::create($validatedData);

            return response()->json([
                'message' => 'Data tervalidasi berhasil disimpan ke Database!',
                'data' => $expense
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menyimpan ke database: ' . $e->getMessage()], 500);
        }
    }
}