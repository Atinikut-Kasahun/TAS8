<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ResetAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:reset-password
                            {--email= : The email address of the admin account}
                            {--password= : The new password to set}';

    /**
     * The console command description.
     */
    protected $description = 'Reset the password for a Global Admin account. Can be run from the server terminal for emergency access recovery.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->newLine();
        $this->line('  <fg=cyan;options=bold>🔐 Global Admin — Password Reset Utility</>');
        $this->line('  <fg=gray>Use this command to recover access to an admin account.</>');
        $this->newLine();

        // Get email (from flag or interactively)
        $email = $this->option('email')
            ?? $this->ask('  Enter the admin email address');

        if (!$email) {
            $this->error('  Email address is required.');
            return self::FAILURE;
        }

        // Find the user
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("  No user found with email: {$email}");
            return self::FAILURE;
        }

        // Show the found user
        $this->line("  Found: <fg=green>{$user->name}</> ({$user->email})");
        $this->line("  Role:  <fg=yellow>{$user->roles->pluck('name')->join(', ')}</>");
        $this->newLine();

        // Confirm before proceeding
        if (!$this->confirm('  Do you want to reset this account\'s password?', true)) {
            $this->line('  <fg=yellow>Cancelled. No changes were made.</>');
            return self::SUCCESS;
        }

        // Get new password (from flag or interactively with secret input)
        $password = $this->option('password')
            ?? $this->secret('  Enter new password (min 8 characters)');

        if (!$password) {
            $this->error('  Password cannot be empty.');
            return self::FAILURE;
        }

        // Validate password length
        $validator = Validator::make(
            ['password' => $password],
            ['password' => 'required|min:8']
        );

        if ($validator->fails()) {
            $this->error('  Password must be at least 8 characters.');
            return self::FAILURE;
        }

        $confirm = $this->secret('  Confirm new password');

        if ($password !== $confirm) {
            $this->error('  Passwords do not match. No changes made.');
            return self::FAILURE;
        }

        // Update the password
        $user->password = Hash::make($password);
        $user->save();

        $this->newLine();
        $this->line('  <fg=green;options=bold>✅ Password reset successfully!</>');
        $this->line("  Account <fg=cyan>{$user->email}</> can now log in with the new password.");
        $this->newLine();

        return self::SUCCESS;
    }
}
