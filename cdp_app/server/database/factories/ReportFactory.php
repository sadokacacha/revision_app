<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Report;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'report_type'  => $this->faker->randomElement(['sales', 'attendance', 'discipline']),
            'content'      => $this->faker->paragraph(),
            // 'generated_by' is passed in from the seeder
        ];
    }
}
