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

        // Create a specific super admin user
        $superAdmin = User::create([
            'name' => 'Super Administrador',
            'email' => 'superadmin@tecnm.mx',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('Super Administrador');
        $this->command->info('✓ Created super admin user (superadmin@tecnm.mx)');

        // Create a specific admin user
        $admin = User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@tecnm.mx',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Administrador');
        $this->command->info('✓ Created admin user (admin@tecnm.mx)');

        // Create a specific coordinador user
        $coordinador = User::create([
            'name' => 'Coordinador Académico',
            'email' => 'coordinador@tecnm.mx',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $coordinador->assignRole('Coordinador');
        $this->command->info('✓ Created coordinador user (coordinador@tecnm.mx)');

        // Create a secretaria user
        $secretaria = User::create([
            'name' => 'Secretaria Académica',
            'email' => 'secretaria@tecnm.mx',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $secretaria->assignRole('Secretaria');
        $this->command->info('✓ Created secretaria user (secretaria@tecnm.mx)');

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
            $profesor->assignRole('Profesor');
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
        $this->command->info('   • Super Admin users: ' . User::role('Super Administrador')->count());
        $this->command->info('   • Admin users: ' . User::role('Administrador')->count());
        $this->command->info('   • Coordinador users: ' . User::role('Coordinador')->count());
        $this->command->info('   • Profesor users: ' . User::role('Profesor')->count());
        $this->command->info('   • Secretaria users: ' . User::role('Secretaria')->count());
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->warn('🔑 All users have password: password123');
        $this->command->warn('🔑 Super Admin: superadmin@tecnm.mx');
        $this->command->warn('🔑 Admin: admin@tecnm.mx');
        $this->command->warn('🔑 Coordinador: coordinador@tecnm.mx');
        $this->command->warn('🔑 Secretaria: secretaria@tecnm.mx');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
