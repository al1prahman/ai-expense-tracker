<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseController;

// 1. Ambil riwayat pengeluaran
Route::get('/expenses', [ExpenseController::class, 'index']);

// 2. Upload gambar untuk dibaca AI (Tidak simpan DB)
Route::post('/expenses/extract', [ExpenseController::class, 'extract']);

// 3. Simpan data yang sudah diedit manusia ke Database
Route::post('/expenses', [ExpenseController::class, 'store']);