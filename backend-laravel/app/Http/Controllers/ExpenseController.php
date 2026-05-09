<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    // Mengambil data khusus untuk user yang sedang login
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) return response()->json(['error' => 'Unauthorized'], 401);

        $payload = json_decode(base64_decode(explode('.', $token)[1]));
        $userId = $payload->sub;

        $expenses = Expense::where('user_id', $userId)->orderBy('date', 'desc')->get();
        return response()->json($expenses);
    }

    // Menyimpan data dengan menempelkan ID user
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

        // Simpan dengan menggabungkan user_id
        $expense = Expense::create(array_merge($validated, ['user_id' => $userId]));

        return response()->json(['message' => 'Berhasil disimpan', 'data' => $expense], 201);
    }
}