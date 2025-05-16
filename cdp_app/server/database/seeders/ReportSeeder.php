<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Report;
use App\Models\User;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'admin'))->first();

        if ($admin) {
            // Create reports with hardcoded data instead of using factory
            $reportTypes = ['sales', 'attendance', 'discipline'];
            $contents = [
                'This is a sales report for the month of May.',
                'Attendance report for the first semester.',
                'Student discipline report for the academic year.',
                'Financial report for the second quarter.',
                'Teacher performance evaluation summary.'
            ];
            
            for ($i = 0; $i < 5; $i++) {
                Report::create([
                    'report_type' => $reportTypes[$i % 3],
                    'content' => $contents[$i],
                    'generated_by' => $admin->id,
                ]);
            }
        }
    }
}
