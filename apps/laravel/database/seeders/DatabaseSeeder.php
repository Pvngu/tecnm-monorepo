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
            Periodo::factory()->create(['nombre' => 'Otoño 2023', 'fecha_inicio' => '2023-08-15', 'fecha_fin' => '2023-12-15', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Primavera 2024', 'fecha_inicio' => '2024-01-15', 'fecha_fin' => '2024-05-15', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Verano 2024', 'fecha_inicio' => '2024-06-01', 'fecha_fin' => '2024-07-31', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Otoño 2024', 'fecha_inicio' => '2024-08-15', 'fecha_fin' => '2024-12-15', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Primavera 2025', 'fecha_inicio' => '2025-01-15', 'fecha_fin' => '2025-05-15', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Verano 2025', 'fecha_inicio' => '2025-06-01', 'fecha_fin' => '2025-07-31', 'activo' => false]),
            Periodo::factory()->create(['nombre' => 'Otoño 2025', 'fecha_inicio' => '2025-08-15', 'fecha_fin' => '2025-12-15', 'activo' => true]),
        ];
        $this->command->info('✓ Created ' . count($periodos) . ' periods');

        // Step 2: Create Careers
        $carreras = Carrera::factory(12)->create();
        $this->command->info('✓ Created ' . $carreras->count() . ' careers');

        // Step 3: Create Risk Factors
        $factores = FactorRiesgo::factory(30)->create();
        $this->command->info('✓ Created ' . $factores->count() . ' risk factors');

        // Step 4: Create Subjects with Units
        $materias = Materia::factory(35)->create();
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
        $profesores = Profesor::factory(25)->create();
        $this->command->info('✓ Created ' . $profesores->count() . ' professors');

        // Step 6: Create Students
        $alumnos = collect();
        foreach ($carreras as $carrera) {
            $alumnosCarrera = Alumno::factory(40)->create([
                'carrera_id' => $carrera->id,
                'estatus_alumno' => 'activo', // Inicialmente todos activos
            ]);
            $alumnos = $alumnos->merge($alumnosCarrera);
        }
        $this->command->info('✓ Created ' . $alumnos->count() . ' students');

        $this->command->info('');
        $this->command->info('🌱 Seeding transactional data...');

        // Step 8: Create Groups for ALL periods
        $grupos = collect();

        foreach ($periodos as $periodo) {
            $gruposPeriodo = 0;
            foreach ($carreras as $carrera) {
                // Create 12-15 groups per career per period
                $numGrupos = rand(12, 15);
                $materiasCarrera = $materias->random(min($numGrupos, $materias->count()));
                
                foreach ($materiasCarrera as $materia) {
                    $grupo = Grupo::factory()->create([
                        'materia_id' => $materia->id,
                        'profesor_id' => $profesores->random()->id,
                        'periodo_id' => $periodo->id,
                        'carrera_id' => $carrera->id,
                    ]);
                    $grupos->push($grupo);
                    $gruposPeriodo++;
                }
            }
            $this->command->info("✓ Created {$gruposPeriodo} groups for period: {$periodo->nombre}");
        }
        $this->command->info('✓ Total groups created: ' . $grupos->count());

        // Step 9: Enroll Students in Groups (for ALL periods)
        $inscripciones = collect();
        
        foreach ($periodos as $periodo) {
            $inscripcionesPeriodo = 0;
            $gruposPeriodo = $grupos->where('periodo_id', $periodo->id);
            
            foreach ($alumnos as $alumno) {
                // Each student enrolls in 5-8 subjects per period
                $gruposCarrera = $gruposPeriodo->where('carrera_id', $alumno->carrera_id);
                
                if ($gruposCarrera->count() > 0) {
                    $numMaterias = rand(5, min(8, $gruposCarrera->count()));
                    $gruposAlumno = $gruposCarrera->random($numMaterias);

                    foreach ($gruposAlumno as $grupo) {
                        $inscripcion = Inscripcion::factory()->create([
                            'alumno_id' => $alumno->id,
                            'grupo_id' => $grupo->id,
                            'calificacion_final' => null, // Will be calculated from units
                        ]);
                        $inscripciones->push($inscripcion);
                        $inscripcionesPeriodo++;
                    }
                }
            }
            $this->command->info("✓ Created {$inscripcionesPeriodo} enrollments for period: {$periodo->nombre}");
        }
        $this->command->info('✓ Total enrollments created: ' . $inscripciones->count());

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

        // Step 11: Create Attendance Records (for all enrollments)
        $totalAsistencias = 0;

        foreach ($periodos as $periodo) {
            $asistenciasPeriodo = 0;
            $inscripcionesPeriodo = $inscripciones->filter(function($inscripcion) use ($periodo) {
                return $inscripcion->grupo->periodo_id == $periodo->id;
            });

            $startDate = \Carbon\Carbon::parse($periodo->fecha_inicio);
            $endDate = \Carbon\Carbon::parse($periodo->fecha_fin);

            // Create attendance for 60% of enrollments per period
            $inscripcionesSample = $inscripcionesPeriodo->random(min(
                (int)($inscripcionesPeriodo->count() * 0.6),
                $inscripcionesPeriodo->count()
            ));

            foreach ($inscripcionesSample as $inscripcion) {
                // Create 20-30 attendance records per enrollment
                $numAsistencias = rand(20, 30);
                
                for ($i = 0; $i < $numAsistencias; $i++) {
                    try {
                        $fecha = $startDate->copy()->addDays(rand(0, max(1, $startDate->diffInDays($endDate))));
                        
                        Asistencia::factory()->create([
                            'inscripcion_id' => $inscripcion->id,
                            'fecha' => $fecha->format('Y-m-d'),
                            'estatus' => rand(1, 100) <= 85 ? 'presente' : (rand(1, 100) <= 60 ? 'ausente' : 'retardo'),
                        ]);
                        $totalAsistencias++;
                        $asistenciasPeriodo++;
                    } catch (\Exception $e) {
                        // Skip if duplicate date
                        continue;
                    }
                }
            }
            $this->command->info("✓ Created {$asistenciasPeriodo} attendance records for period: {$periodo->nombre}");
        }
        $this->command->info('✓ Total attendance records created: ' . $totalAsistencias);

        // Step 12: Assign Risk Factors to Some Students (across all periods)
        $totalFactoresAsignados = 0;
        
        foreach ($periodos as $periodo) {
            $factoresPeriodo = 0;
            $inscripcionesPeriodo = $inscripciones->filter(function($inscripcion) use ($periodo) {
                return $inscripcion->grupo->periodo_id == $periodo->id;
            });

            $alumnosEnRiesgo = $inscripcionesPeriodo
                ->filter(fn($i) => $i->calificacion_final < 70)
                ->shuffle()
                ->take(min(50, $inscripcionesPeriodo->where('calificacion_final', '<', 70)->count()));

            foreach ($alumnosEnRiesgo as $inscripcion) {
                // Assign 1-4 risk factors
                $factoresAsignar = $factores->random(rand(1, 4));
                
                foreach ($factoresAsignar as $factor) {
                    try {
                        AlumnoFactor::factory()->create([
                            'inscripcion_id' => $inscripcion->id,
                            'factor_id' => $factor->id,
                        ]);
                        $totalFactoresAsignados++;
                        $factoresPeriodo++;
                    } catch (\Exception $e) {
                        // Skip if duplicate
                        continue;
                    }
                }
            }
            $this->command->info("✓ Assigned {$factoresPeriodo} risk factors for period: {$periodo->nombre}");
        }
        $this->command->info('✓ Total risk factors assigned: ' . $totalFactoresAsignados);

        // Step 13: Seed Recommendations
        $this->call([
            RecomendacionSeeder::class,
        ]);
        $this->command->info('✓ Created recommendations for risk factors');

        // Step 14: Update student status based on performance
        $this->command->info('');
        $this->command->info('🔄 Updating student status...');
        
        $estatusActualizados = [
            'baja_temporal' => 0,
            'baja_definitiva' => 0,
            'egresado' => 0,
        ];

        foreach ($alumnos as $alumno) {
            $promedioGeneral = $alumno->inscripciones()
                ->whereNotNull('calificacion_final')
                ->avg('calificacion_final');

            // Egresados: estudiantes de semestre 9 con buen promedio
            if ($alumno->semestre == 9 && $promedioGeneral >= 70) {
                if (rand(1, 100) <= 30) { // 30% de probabilidad
                    $alumno->update(['estatus_alumno' => 'egresado']);
                    $estatusActualizados['egresado']++;
                }
            }
            // Baja definitiva: estudiantes con promedio muy bajo o muchos factores de riesgo
            elseif ($promedioGeneral < 60 || $alumno->inscripciones()->whereHas('alumnosFactores')->count() >= 3) {
                if (rand(1, 100) <= 20) { // 20% de probabilidad
                    $alumno->update(['estatus_alumno' => 'baja_definitiva']);
                    $estatusActualizados['baja_definitiva']++;
                }
            }
            // Baja temporal: estudiantes con bajo promedio
            elseif ($promedioGeneral < 70) {
                if (rand(1, 100) <= 25) { // 25% de probabilidad
                    $alumno->update(['estatus_alumno' => 'baja_temporal']);
                    $estatusActualizados['baja_temporal']++;
                }
            }
        }

        $this->command->info('✓ Updated student status:');
        $this->command->info('   • Baja temporal: ' . $estatusActualizados['baja_temporal']);
        $this->command->info('   • Baja definitiva: ' . $estatusActualizados['baja_definitiva']);
        $this->command->info('   • Egresados: ' . $estatusActualizados['egresado']);

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
        
        $this->command->info('');
        $this->command->info('📅 Data per Period:');
        foreach ($periodos as $periodo) {
            $gruposPeriodo = $grupos->where('periodo_id', $periodo->id)->count();
            $inscripcionesPeriodo = $inscripciones->filter(fn($i) => $i->grupo->periodo_id == $periodo->id)->count();
            $this->command->info("   • {$periodo->nombre}: {$gruposPeriodo} groups, {$inscripcionesPeriodo} enrollments");
        }
        
        $this->command->info('');
        $this->command->info('   • Student Status:');
        $this->command->info('      - Activos: ' . Alumno::where('estatus_alumno', 'activo')->count());
        $this->command->info('      - Baja temporal: ' . Alumno::where('estatus_alumno', 'baja_temporal')->count());
        $this->command->info('      - Baja definitiva: ' . Alumno::where('estatus_alumno', 'baja_definitiva')->count());
        $this->command->info('      - Egresados: ' . Alumno::where('estatus_alumno', 'egresado')->count());
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->warn('🔑 Admin credentials: admin@tecnm.mx / password123');
        $this->command->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
