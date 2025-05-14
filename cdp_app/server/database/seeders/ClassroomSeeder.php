<?php

namespace Database\Seeders;

use App\Models\Classroom;
use Illuminate\Database\Seeder;

class ClassroomSeeder extends Seeder
{
    public function run()
    {
        $classrooms = ['1A', '1B', '2A', '2B', '3A'];

        foreach ($classrooms as $classroom) {
            Classroom::create(['name' => $classroom]);
        }
    }
}
