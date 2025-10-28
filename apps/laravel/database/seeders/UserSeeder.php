<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('👤 Creating users...');

        // Create a specific admin user
        $admin = User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@tecnm.mx',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');
        $this->command->info('✓ Created admin user (admin@tecnm.mx)');

        // Create a specific administracion user
        $administracion = User::create([
            'name' => 'Jefe de Administración',
            'email' => 'administracion@tecnm.mx',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $administracion->assignRole('administracion');
        $this->command->info('✓ Created administracion user (administracion@tecnm.mx)');

        // Create specific profesor users
        $profesorNames = [
            'Dr. Juan Pérez García',
            'Dra. María López Hernández',
            'Ing. Carlos Martínez Ruiz',
            'M.C. Ana Sánchez Torres',
            'Dr. Roberto González Díaz',
        ];

        foreach ($profesorNames as $index => $name) {
            $profesor = User::create([
                'name' => $name,
                'email' => 'profesor' . ($index + 1) . '@tecnm.mx',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
            $profesor->assignRole('profesor');
        }
        $this->command->info('✓ Created ' . count($profesorNames) . ' profesor users');

        // Create additional random users with random roles
        $roles = Role::all()->pluck('name')->toArray();
        $randomUserCount = 15;

        for ($i = 1; $i <= $randomUserCount; $i++) {
            $randomRole = $roles[array_rand($roles)];
            
            $user = User::create([
                'name' => fake()->name(),
                'email' => 'user' . $i . '@tecnm.mx',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
            
            $user->assignRole($randomRole);
        }
        $this->command->info('✓ Created ' . $randomUserCount . ' random users with random roles');

        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('✅ Users created successfully!');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('📊 Summary:');
        $this->command->info('   • Total users: ' . User::count());
        $this->command->info('   • Admin users: ' . User::role('admin')->count());
        $this->command->info('   • Administracion users: ' . User::role('administracion')->count());
        $this->command->info('   • Profesor users: ' . User::role('profesor')->count());
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->warn('🔑 All users have password: password123');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
