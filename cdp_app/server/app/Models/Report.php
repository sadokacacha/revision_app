<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    public function definition()
{
    return [
        'report_type' => $this->faker->randomElement(['sales', 'inventory', 'user_activity']),
        'generated_by' => 1, // You can override this in seeder
        'content' => $this->faker->paragraph,
    ];
}

}
