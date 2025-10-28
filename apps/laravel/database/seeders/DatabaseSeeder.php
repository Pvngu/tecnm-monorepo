<?php

namespace Database\Seeders;

use App\Models\Alumno;
use App\Models\AlumnoFactor;
use App\Models\Asistencia;
use App\Models\Calificacion;
use App\Models\Carrera;
use App\Models\FactorRiesgo;
use App\Models\Grupo;
use App\Models\Inscripcion;
use App\Models\Materia;
use App\Models\Periodo;
use App\Models\Profesor;
use App\Models\Unidad;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
        ]);

        $this->command->info('🌱 Seeding catalogs...');

        // Step 1: Create Periods
        $periodos = [
            Periodo::factory()->create(['nombre' => 'Otoño 2024', 'fecha_inicio' => '2024-08-15', 'fecha_fin' => '2024-12-15', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Primavera 2025', 'fecha_inicio' => '2025-01-15', 'fecha_fin' => '2025-05-15', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Verano 2025', 'fecha_inicio' => '2025-06-01', 'fecha_fin' => '2025-07-31', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Otoño 2025', 'fecha_inicio' => '2025-08-15', 'fecha_fin' => '2025-12-15', 'activo' => true]),
        ];
        $this->command->info('✓ Created ' . count($periodos) . ' periods');

        // Step 2: Create Careers
        $carreras = Carrera::factory(8)->create();
        $this->command->info('✓ Created ' . $carreras->count() . ' careers');

        // Step 3: Create Risk Factors
        $factores = FactorRiesgo::factory(22)->create();
        $this->command->info('✓ Created ' . $factores->count() . ' risk factors');

        // Step 4: Create Subjects with Units
        $materias = Materia::factory(18)->create();
        $this->command->info('✓ Created ' . $materias->count() . ' subjects');

        foreach ($materias as $materia) {
            for ($i = 1; $i <= 5; $i++) {
                Unidad::factory()->create([
                    'materia_id' => $materia->id,
                    'numero_unidad' => $i,
                    'nombre_unidad' => "Unidad {$i}",
                ]);
            }
        }
        $this->command->info('✓ Created units for all subjects');

        // Step 5: Create Users and Professors
        $profesores = Profesor::factory(15)->create();
        $this->command->info('✓ Created ' . $profesores->count() . ' professors');

        // Step 6: Create Students
        $alumnos = collect();
        foreach ($carreras as $carrera) {
            $alumnosCarrera = Alumno::factory(20)->create([
                'carrera_id' => $carrera->id,
            ]);
            $alumnos = $alumnos->merge($alumnosCarrera);
        }
        $this->command->info('✓ Created ' . $alumnos->count() . ' students');

        $this->command->info('');
        $this->command->info('🌱 Seeding transactional data...');

        // Step 8: Create Groups (only for active period)
        $periodoActivo = $periodos[3]; // Otoño 2025
        $grupos = collect();

        foreach ($carreras as $carrera) {
            // Create 10 groups per career
            $materiasCarrera = $materias->random(10);
            foreach ($materiasCarrera as $materia) {
                $grupo = Grupo::factory()->create([
                    'materia_id' => $materia->id,
                    'profesor_id' => $profesores->random()->id,
                    'periodo_id' => $periodoActivo->id,
                    'carrera_id' => $carrera->id,
                ]);
                $grupos->push($grupo);
            }
        }
        $this->command->info('✓ Created ' . $grupos->count() . ' groups');

        // Step 9: Enroll Students in Groups
        $inscripciones = collect();
        
        foreach ($alumnos as $alumno) {
            // Each student enrolls in 5-7 subjects
            $gruposCarrera = $grupos->where('carrera_id', $alumno->carrera_id);
            $gruposAlumno = $gruposCarrera->random(rand(5, min(7, $gruposCarrera->count())));

            foreach ($gruposAlumno as $grupo) {
                $inscripcion = Inscripcion::factory()->create([
                    'alumno_id' => $alumno->id,
                    'grupo_id' => $grupo->id,
                    'calificacion_final' => null, // Will be calculated from units
                ]);
                $inscripciones->push($inscripcion);
            }
        }
        $this->command->info('✓ Created ' . $inscripciones->count() . ' enrollments');

        // Step 10: Create Grades for Each Unit
        $totalCalificaciones = 0;
        foreach ($inscripciones as $inscripcion) {
            $materia = $inscripcion->grupo->materia;
            $unidades = $materia->unidades;

            $sumaCalificaciones = 0;
            foreach ($unidades as $unidad) {
                $calificacion = Calificacion::factory()->create([
                    'inscripcion_id' => $inscripcion->id,
                    'unidad_id' => $unidad->id,
                    'valor_calificacion' => rand(60, 100),
                ]);
                $sumaCalificaciones += $calificacion->valor_calificacion;
                $totalCalificaciones++;
            }

            // Update final grade
            $inscripcion->update([
                'calificacion_final' => round($sumaCalificaciones / $unidades->count(), 2),
            ]);
        }
        $this->command->info('✓ Created ' . $totalCalificaciones . ' grades');

        // Step 11: Create Attendance Records
        $totalAsistencias = 0;
        $startDate = now()->subMonths(3);
        $endDate = now();

        foreach ($inscripciones->random(min(100, $inscripciones->count())) as $inscripcion) {
            // Create 15-25 attendance records per enrollment
            $numAsistencias = rand(15, 25);
            
            for ($i = 0; $i < $numAsistencias; $i++) {
                try {
                    $fecha = $startDate->copy()->addDays(rand(0, $startDate->diffInDays($endDate)));
                    
                    Asistencia::factory()->create([
                        'inscripcion_id' => $inscripcion->id,
                        'fecha' => $fecha->format('Y-m-d'),
                        'estatus' => rand(1, 100) <= 80 ? 'presente' : (rand(1, 100) <= 50 ? 'ausente' : 'retardo'),
                    ]);
                    $totalAsistencias++;
                } catch (\Exception $e) {
                    // Skip if duplicate date
                    continue;
                }
            }
        }
        $this->command->info('✓ Created ' . $totalAsistencias . ' attendance records');

        // Step 12: Assign Risk Factors to Some Students
        $alumnosEnRiesgo = $inscripciones
            ->filter(fn($i) => $i->calificacion_final < 70)
            ->random(min(30, $inscripciones->where('calificacion_final', '<', 70)->count()));

        $totalFactoresAsignados = 0;
        foreach ($alumnosEnRiesgo as $inscripcion) {
            // Assign 1-3 risk factors
            $factoresAsignar = $factores->random(rand(1, 3));
            
            foreach ($factoresAsignar as $factor) {
                try {
                    AlumnoFactor::factory()->create([
                        'inscripcion_id' => $inscripcion->id,
                        'factor_id' => $factor->id,
                    ]);
                    $totalFactoresAsignados++;
                } catch (\Exception $e) {
                    // Skip if duplicate
                    continue;
                }
            }
        }
        $this->command->info('✓ Assigned ' . $totalFactoresAsignados . ' risk factors');

        $this->command->info('');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('✅ Database seeded successfully!');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('📊 Summary:');
        $this->command->info('   • Periods: ' . count($periodos));
        $this->command->info('   • Careers: ' . $carreras->count());
        $this->command->info('   • Subjects: ' . $materias->count());
        $this->command->info('   • Units: ' . ($materias->count() * 5));
        $this->command->info('   • Professors: ' . $profesores->count());
        $this->command->info('   • Students: ' . $alumnos->count());
        $this->command->info('   • Groups: ' . $grupos->count());
        $this->command->info('   • Enrollments: ' . $inscripciones->count());
        $this->command->info('   • Grades: ' . $totalCalificaciones);
        $this->command->info('   • Attendance: ' . $totalAsistencias);
        $this->command->info('   • Risk Factors: ' . $factores->count());
        $this->command->info('   • Assigned Factors: ' . $totalFactoresAsignados);
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->warn('🔑 Admin credentials: admin@tecnm.mx / password123');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
