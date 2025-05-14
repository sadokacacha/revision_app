<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            SubjectSeeder::class,
            ClassroomSeeder::class,
            UserSeeder::class,
            TeacherAssignmentSeeder::class,
            StudentAssignmentSeeder::class,
            PaymentSeeder::class,
             ReportSeeder::class,
        ]);
    }
}
