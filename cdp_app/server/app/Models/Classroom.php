<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = ['name'];


public function teachers()
{
    return $this->belongsToMany(Teacher::class, 'classroom_subject_teacher')
                ->withPivot('subject_id')
                ->withTimestamps();
}

    public function students()
    {
        return $this->belongsToMany(User::class, 'classroom_user');
    }





}
