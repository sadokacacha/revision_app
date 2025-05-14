<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'type',      // 'teacher' or 'student'
    'method',    // 'cash', 'check', 'bank'
    'amount',
    'date',
    'status'
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function teacher()
{
    return $this->hasOne(Teacher::class, 'user_id', 'user_id');
}
}
