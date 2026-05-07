<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = ['items', 'total', 'date', 'category'];

    protected $casts = [
        'items' => 'array',
    ];
}