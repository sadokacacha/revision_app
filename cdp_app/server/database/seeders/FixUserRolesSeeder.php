<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class FixUserRolesSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Starting role synchronization...');
        
        $users = User::all();
        $updated = 0;
        
        foreach ($users as $user) {
            // Get the role from model_has_roles table
            $roleRecord = DB::table('model_has_roles')
                ->where('model_id', $user->id)
                ->where('model_type', 'App\\Models\\User')
                ->first();
                
            if ($roleRecord) {
                $roleName = DB::table('roles')
                    ->where('id', $roleRecord->role_id)
                    ->value('name');
                
                if ($roleName && $user->role !== $roleName) {
                    $this->command->line("Updating user {$user->id} ({$user->email}): '{$user->role}' → '{$roleName}'");
                    $user->role = $roleName;
                    $user->save();
                    $updated++;
                }
            } else {
                // No role assigned, make sure user has a default role
                if (!$user->role) {
                    $user->role = 'student';
                    $user->save();
                    $this->command->line("Assigning default role 'student' to user {$user->id} ({$user->email})");
                    $updated++;
                }
            }
        }
        
        $this->command->info("Completed! Updated {$updated} user(s)");
    }
} 