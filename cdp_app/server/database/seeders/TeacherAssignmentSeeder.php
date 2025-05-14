<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Classroom;

class TeacherAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Fetch a teacher
        $teacher = Teacher::first();
        if (! $teacher) {
            $this->command->warn('No teacher found—skipping TeacherAssignmentSeeder');
            return;
        }

        // 2) Pick 3 random subjects
        $subjectIds = Subject::inRandomOrder()
                             ->take(3)
                             ->pluck('id')
                             ->toArray();
        $this->command->info('Picked Subject IDs: ' . implode(', ', $subjectIds));

        // 3) Pick 2 random classrooms
        $classroomIds = Classroom::inRandomOrder()
                                 ->take(2)
                                 ->pluck('id')
                                 ->toArray();
        $this->command->info('Picked Classroom IDs: ' . implode(', ', $classroomIds));

        // 4) Sync the simple subject_teacher pivot
        $teacher->subjects()->sync($subjectIds);
        $this->command->info("Synced subjects to teacher #{$teacher->id}");

        // 5) Seed the classroom_subject_teacher pivot by using classrooms() relationship
        foreach ($classroomIds as $classroomId) {
            foreach ($subjectIds as $subjectId) {
                $teacher->classrooms()->attach($classroomId, [
                    'subject_id' => $subjectId,
                ]);
                $this->command->info(
                    "Attached classroom #{$classroomId} + subject #{$subjectId} to teacher #{$teacher->id}"
                );
            }
        }

        $this->command->info("✅ Finished TeacherAssignmentSeeder");
    }
}
