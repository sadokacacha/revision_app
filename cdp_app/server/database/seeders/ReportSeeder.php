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
            Report::factory()->count(10)->create([
                'generated_by' => $admin->id,
            ]);
        }
    }
}
