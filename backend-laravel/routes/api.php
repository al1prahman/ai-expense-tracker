<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseController;

// Rute untuk mengambil daftar pengeluaran
Route::get('/expenses', [ExpenseController::class, 'index']);

// Rute untuk mengunggah dan memproses struk
Route::post('/expenses/extract', [ExpenseController::class, 'extractAndSave']);