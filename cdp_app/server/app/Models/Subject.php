<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name','total_hours'];

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'subject_teacher')
                    ->withPivot('hours_done')
                    ->withTimestamps();
    }
}