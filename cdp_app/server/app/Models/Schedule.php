<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;
protected $fillable = [
    'teacher_id',
    'classroom_id', 
    'subject_id',
    'day',
    'start_time',
    'end_time',
];
public function teacher() {
    return $this->belongsTo(Teacher::class);
}

public function classroom() {
    return $this->belongsTo(Classroom::class);
}

public function subject() {
    return $this->belongsTo(Subject::class);
}

public function attendances()
{
    return $this->hasMany(Attendance::class);
}

}