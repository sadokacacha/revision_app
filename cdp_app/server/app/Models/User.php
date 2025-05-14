<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Subject;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_user');
    }


    public function attendances()
{
    return $this->hasManyThrough(Attendance::class, Teacher::class);
}
public function subjects()
{
    return $this->belongsToMany(Subject::class, 'subject_teacher');
}
}
