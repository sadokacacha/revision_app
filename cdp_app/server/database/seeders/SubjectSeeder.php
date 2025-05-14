<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
 
public function run()
{
    $subjects = ['Math', 'Science', 'History', 'English'];

    foreach ($subjects as $subject) {
        Subject::firstOrCreate(['name' => $subject]);
    }
}
}

