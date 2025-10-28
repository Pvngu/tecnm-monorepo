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

        // Define resources that need CRUD permissions
        $resources = [
            'periodos',
            'carreras',
            'profesores',
            'alumnos',
            'materias',
            'unidades',
            'grupos',
            'inscripciones',
            'calificaciones',
            'asistencias',
            'factores_riesgo',
            'alumnos_factores',
        ];

        // Define permission actions
        $actions = ['view', 'create', 'edit', 'delete'];

        // Create permissions for each resource
        $permissions = [];
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                $permissionName = "{$resource}_{$action}";
                $permissions[] = Permission::create(['name' => $permissionName]);
            }
        }

        $this->command->info("✓ Created " . count($permissions) . " permissions");

        $this->command->info('👥 Creating roles...');

        // Create Roles
        $adminRole = Role::create(['name' => 'admin']);
        $administracionRole = Role::create(['name' => 'administracion']);
        $profesorRole = Role::create(['name' => 'profesor']);

        $this->command->info('✓ Created 3 roles');

        $this->command->info('🔗 Assigning permissions to roles...');

        // Admin: has all permissions
        $adminRole->givePermissionTo(Permission::all());

        // Administracion: can manage most resources but with some restrictions
        $administracionRole->givePermissionTo([
            // Full access to periods, careers, and subjects
            'periodos_view', 'periodos_create', 'periodos_edit', 'periodos_delete',
            'carreras_view', 'carreras_create', 'carreras_edit', 'carreras_delete',
            'materias_view', 'materias_create', 'materias_edit', 'materias_delete',
            'unidades_view', 'unidades_create', 'unidades_edit', 'unidades_delete',
            
            // Full access to professors and students
            'profesores_view', 'profesores_create', 'profesores_edit', 'profesores_delete',
            'alumnos_view', 'alumnos_create', 'alumnos_edit', 'alumnos_delete',
            
            // Full access to groups and enrollments
            'grupos_view', 'grupos_create', 'grupos_edit', 'grupos_delete',
            'inscripciones_view', 'inscripciones_create', 'inscripciones_edit', 'inscripciones_delete',
            
            // View grades and attendance, limited editing
            'calificaciones_view', 'calificaciones_edit',
            'asistencias_view', 'asistencias_edit',
            
            // Full access to risk factors
            'factores_riesgo_view', 'factores_riesgo_create', 'factores_riesgo_edit', 'factores_riesgo_delete',
            'alumnos_factores_view', 'alumnos_factores_create', 'alumnos_factores_edit', 'alumnos_factores_delete',
        ]);

        // Profesor: limited access focused on teaching activities
        $profesorRole->givePermissionTo([
            // View only for catalogs
            'periodos_view',
            'carreras_view',
            'materias_view',
            'unidades_view',
            
            // View professors (colleagues)
            'profesores_view',
            
            // View and limited edit for students
            'alumnos_view',
            
            // View their groups
            'grupos_view',
            
            // Manage enrollments in their groups
            'inscripciones_view',
            
            // Full access to grades and attendance for their students
            'calificaciones_view', 'calificaciones_create', 'calificaciones_edit', 'calificaciones_delete',
            'asistencias_view', 'asistencias_create', 'asistencias_edit', 'asistencias_delete',
            
            // View and report risk factors
            'factores_riesgo_view',
            'alumnos_factores_view', 'alumnos_factores_create',
        ]);

        $this->command->info('✓ Assigned permissions to roles');

        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('✅ Roles and Permissions created successfully!');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('📊 Summary:');
        $this->command->info("   • Permissions: " . count($permissions));
        $this->command->info("   • Roles: 3 (admin, administracion, profesor)");
        $this->command->info("   • Admin permissions: " . $adminRole->permissions->count());
        $this->command->info("   • Administracion permissions: " . $administracionRole->permissions->count());
        $this->command->info("   • Profesor permissions: " . $profesorRole->permissions->count());
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
