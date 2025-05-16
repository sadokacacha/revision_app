<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class SyncUserRoles extends Command
{
    protected $signature = 'users:sync-roles';
    protected $description = 'Synchronize user roles from Spatie permissions to the direct role column';

    public function handle()
    {
        $this->info('Starting role synchronization...');
        
        $users = User::all();
        $updated = 0;
        
        foreach ($users as $user) {
            // Get the first role from Spatie
            $role = null;
            if (method_exists($user, 'roles')) {
                if ($user->roles()->exists()) {
                    $role = $user->roles()->first()?->name;
                }
            }
            
            if ($role && $user->role !== $role) {
                $this->line("Updating user {$user->id} ({$user->email}): '{$user->role}' → '{$role}'");
                $user->role = $role;
                $user->save();
                $updated++;
            }
        }
        
        $this->info("Completed! Updated {$updated} user(s)");
        return Command::SUCCESS;
    }
} 