<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => Hash::make('password')]
        );
        $admin->syncRoles(['admin']);

        // Teacher + profile
        $teacherUser = User::updateOrCreate(
            ['email' => 'teacher@example.com'],
            ['name' => 'Teacher Lisa', 'password' => Hash::make('password')]
        );
        $teacherUser->syncRoles(['teacher']);
        Teacher::updateOrCreate(
            ['user_id' => $teacherUser->id],
            ['hourly_rate' => 50, 'payment_method' => 'bank']
        );

        // Student
        $student = User::updateOrCreate(
            ['email' => 'student@example.com'],
            ['name' => 'Student Tom', 'password' => Hash::make('password')]
        );
        $student->syncRoles(['student']);
    }
}
