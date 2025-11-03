<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->command->info('🔐 Creating permissions...');

        // Create permissions
        $permissions = [
            // Alumnos
            'ver-alumnos',
            'crear-alumnos',
            'editar-alumnos',
            'eliminar-alumnos',
            'importar-alumnos',
            
            // Profesores
            'ver-profesores',
            'crear-profesores',
            'editar-profesores',
            'eliminar-profesores',
            
            // Materias
            'ver-materias',
            'crear-materias',
            'editar-materias',
            'eliminar-materias',
            
            // Carreras
            'ver-carreras',
            'crear-carreras',
            'editar-carreras',
            'eliminar-carreras',
            
            // Periodos
            'ver-periodos',
            'crear-periodos',
            'editar-periodos',
            'eliminar-periodos',
            
            // Grupos
            'ver-grupos',
            'crear-grupos',
            'editar-grupos',
            'eliminar-grupos',
            
            // Factores de Riesgo
            'ver-factores-riesgo',
            'crear-factores-riesgo',
            'editar-factores-riesgo',
            'eliminar-factores-riesgo',
            
            // Calificaciones
            'ver-calificaciones',
            'crear-calificaciones',
            'editar-calificaciones',
            'eliminar-calificaciones',
            
            // Asistencias
            'ver-asistencias',
            'crear-asistencias',
            'editar-asistencias',
            'eliminar-asistencias',
            
            // Reportes
            'ver-reportes',
            'generar-reportes',
            
            // Dashboard
            'ver-dashboard',
            'ver-analytics',
            
            // Análisis
            'ver-ishikawa',
            'crear-ishikawa',
            'editar-ishikawa',
            'eliminar-ishikawa',
            
            // Usuarios y Roles
            'ver-usuarios',
            'crear-usuarios',
            'editar-usuarios',
            'eliminar-usuarios',
            'asignar-roles',
            'ver-roles',
            'crear-roles',
            'editar-roles',
            'eliminar-roles',
            'ver-permisos',
            'crear-permisos',
            'editar-permisos',
            'eliminar-permisos',
            
            // Activity Logs
            'ver-activity-logs',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        $this->command->info("✓ Created " . count($permissions) . " permissions");

        $this->command->info('👥 Creating roles...');

        // Create roles and assign permissions

        // Super Admin - has all permissions
        $superAdmin = Role::create(['name' => 'Super Administrador', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::all());

        // Administrador - most permissions except user management
        $admin = Role::create(['name' => 'Administrador', 'guard_name' => 'web']);

        $admin->givePermissionTo([
            'ver-alumnos', 'crear-alumnos', 'editar-alumnos', 'eliminar-alumnos', 'importar-alumnos',
            'ver-profesores', 'crear-profesores', 'editar-profesores', 'eliminar-profesores',
            'ver-materias', 'crear-materias', 'editar-materias', 'eliminar-materias',
            'ver-carreras', 'crear-carreras', 'editar-carreras', 'eliminar-carreras',
            'ver-periodos', 'crear-periodos', 'editar-periodos', 'eliminar-periodos',
            'ver-grupos', 'crear-grupos', 'editar-grupos', 'eliminar-grupos',
            'ver-factores-riesgo', 'crear-factores-riesgo', 'editar-factores-riesgo', 'eliminar-factores-riesgo',
            'ver-calificaciones', 'crear-calificaciones', 'editar-calificaciones', 'eliminar-calificaciones',
            'ver-asistencias', 'crear-asistencias', 'editar-asistencias', 'eliminar-asistencias',
            'ver-reportes', 'generar-reportes',
            'ver-dashboard', 'ver-analytics',
            'ver-ishikawa', 'crear-ishikawa', 'editar-ishikawa', 'eliminar-ishikawa',
            'ver-activity-logs',
        ]);

        // Profesor - can view and manage their own groups, students, grades
        $profesor = Role::create(['name' => 'Profesor', 'guard_name' => 'web']);
        $profesor->givePermissionTo([
            'ver-alumnos',
            'ver-materias',
            'ver-grupos',
            'ver-calificaciones', 'crear-calificaciones', 'editar-calificaciones',
            'ver-asistencias', 'crear-asistencias', 'editar-asistencias',
            'ver-factores-riesgo',
            'ver-reportes',
            'ver-dashboard',
        ]);

        // Coordinador - can manage academic aspects
        $coordinador = Role::create(['name' => 'Coordinador', 'guard_name' => 'web']);
        $coordinador->givePermissionTo([
            'ver-alumnos', 'crear-alumnos', 'editar-alumnos',
            'ver-profesores', 'crear-profesores', 'editar-profesores',
            'ver-materias', 'crear-materias', 'editar-materias',
            'ver-grupos', 'crear-grupos', 'editar-grupos',
            'ver-periodos',
            'ver-carreras',
            'ver-calificaciones', 'crear-calificaciones', 'editar-calificaciones',
            'ver-asistencias', 'crear-asistencias', 'editar-asistencias',
            'ver-factores-riesgo', 'crear-factores-riesgo', 'editar-factores-riesgo',
            'ver-reportes', 'generar-reportes',
            'ver-dashboard', 'ver-analytics',
            'ver-ishikawa', 'crear-ishikawa', 'editar-ishikawa',
        ]);

        // Secretaria - read-only for most, can manage some basic data
        $secretaria = Role::create(['name' => 'Secretaria', 'guard_name' => 'web']);
        $secretaria->givePermissionTo([
            'ver-alumnos', 'crear-alumnos', 'editar-alumnos',
            'ver-profesores',
            'ver-materias',
            'ver-grupos',
            'ver-periodos',
            'ver-carreras',
            'ver-calificaciones',
            'ver-asistencias',
            'ver-reportes',
        ]);

        // Estudiante - very limited access
        $estudiante = Role::create(['name' => 'Estudiante', 'guard_name' => 'web']);
        $estudiante->givePermissionTo([
            'ver-materias',
            'ver-grupos',
            'ver-calificaciones',
            'ver-asistencias',
        ]);

        $this->command->info('✓ Created 6 roles with permissions');

        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('✅ Roles and Permissions created successfully!');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('📊 Summary:');
        $this->command->info("   • Permissions: " . count($permissions));
        $this->command->info("   • Roles: 6");
        $this->command->info("   • Super Administrador: " . $superAdmin->permissions->count() . " permissions");
        $this->command->info("   • Administrador: " . $admin->permissions->count() . " permissions");
        $this->command->info("   • Coordinador: " . $coordinador->permissions->count() . " permissions");
        $this->command->info("   • Profesor: " . $profesor->permissions->count() . " permissions");
        $this->command->info("   • Secretaria: " . $secretaria->permissions->count() . " permissions");
        $this->command->info("   • Estudiante: " . $estudiante->permissions->count() . " permissions");
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
