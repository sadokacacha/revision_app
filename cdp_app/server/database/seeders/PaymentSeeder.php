<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Payment;
class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Find the teacher PROFILE, not just the user
        $teacherUser = User::whereHas('roles', fn($q) => 
            $q->where('name', 'teacher')
        )->first();

        if (! $teacherUser) {
            $this->command->warn('No teacher user found — skipping PaymentSeeder');
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
                'user_id' => $teacherUser->id,
                'type'    => 'teacher',      // <-- required by your migration
                'method'  => 'bank',         // <-- required by your migration
                'amount'  => $data['amount'],
                'date'    => $data['date'],
                'status'  => $data['status'],
            ]);
        }

        $this->command->info("✅ Seeded ".count($payments)." payments for teacher #{$teacherUser->id}");
    }
}
