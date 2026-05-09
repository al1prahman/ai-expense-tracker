<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    // Tambahkan 'user_id' di sini
    protected $fillable = ['user_id', 'category', 'date', 'total', 'items'];

    protected $casts = [
        'items' => 'array'
    ];
}