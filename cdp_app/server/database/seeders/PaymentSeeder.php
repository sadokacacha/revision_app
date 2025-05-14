<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Find the first user with role=teacher
        $teacher = User::whereHas('roles', fn($q) => $q->where('name', 'teacher'))->first();

        if (! $teacher) {
            $this->command->warn('No teacher found—skipping PaymentSeeder');
            return;
        }

        $payments = [
            ['amount' => 1250, 'date' => now()->subMonths(3), 'status' => 'completed'],
            ['amount' => 1250, 'date' => now()->subMonths(2), 'status' => 'completed'],
            ['amount' => 1250, 'date' => now()->subMonths(1), 'status' => 'completed'],
            ['amount' => 1250, 'date' => now(),                'status' => 'pending'],
        ];

        foreach ($payments as $data) {
            Payment::create([
                'user_id' => $teacher->id,
                'type'    => 'teacher',      // <— required now
                'method'  => 'bank',         // <— required now
                'amount'  => $data['amount'],
                'date'    => $data['date'],
                'status'  => $data['status'],
            ]);
        }

        $this->command->info("✅ Seeded payments for teacher #{$teacher->id}");
    }
}
