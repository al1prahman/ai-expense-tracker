<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // Pastikan ini ada untuk memanggil Python API

class ExpenseController extends Controller
{
    // 1. Mengambil data khusus untuk user yang sedang login
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) return response()->json(['error' => 'Unauthorized'], 401);

        $payload = json_decode(base64_decode(explode('.', $token)[1]));
        $userId = $payload->sub;

        $expenses = Expense::where('user_id', $userId)->orderBy('date', 'desc')->get();
        return response()->json($expenses);
    }

    // 2. Menyimpan data dengan menempelkan ID user
    public function store(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) return response()->json(['error' => 'Unauthorized'], 401);

        $payload = json_decode(base64_decode(explode('.', $token)[1]));
        $userId = $payload->sub;

        $validated = $request->validate([
            'category' => 'required|string',
            'date' => 'required|date',
            'total' => 'required|numeric',
            'items' => 'nullable|array'
        ]);

        $isDuplicate = Expense::where('user_id', $userId)
                              ->where('date', $validated['date'])
                              ->where('total', $validated['total'])
                              ->exists();

        if ($isDuplicate) {
            return response()->json(['error' => 'Data pengeluaran ini sepertinya duplikat.'], 409);
        }

        $expense = Expense::create(array_merge($validated, ['user_id' => $userId]));

        return response()->json(['message' => 'Berhasil disimpan', 'data' => $expense], 201);
    }

    // 3. FUNGSI YANG HILANG: Mengirim foto struk ke Python AI Service
    public function extract(Request $request)
    {
        // Validasi file yang diunggah
        $request->validate([
            'receipt' => 'required|image|max:25600', // Maksimal 25MB
        ]);

        $file = $request->file('receipt');

        try {
            // Meneruskan foto dari Laravel ke Python FastAPI (Asumsi Python berjalan di port 8000)
            $response = Http::attach(
                'file', file_get_contents($file->getPathname()), $file->getClientOriginalName()
            )->post('http://127.0.0.1:8000/extract'); // Sesuaikan jika URL Python berbeda

            if ($response->successful()) {
                // Kembalikan hasil AI ke Next.js
                return response()->json(['data' => $response->json()]);
            }

            return response()->json(['error' => 'Gagal memproses struk di AI Service'], 500);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Koneksi ke AI Service gagal: ' . $e->getMessage()], 500);
        }
    }
}