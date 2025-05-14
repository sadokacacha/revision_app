<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Classroom;
use Illuminate\Database\Seeder;

class StudentAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::whereHas('roles', fn ($q) => $q->where('name', 'student'))->first();

        $classroom = Classroom::inRandomOrder()->first();

        $student->classrooms()->sync([$classroom->id]);
    }
}
