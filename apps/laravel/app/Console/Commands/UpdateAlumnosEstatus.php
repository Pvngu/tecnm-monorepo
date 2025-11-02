<?php

namespace App\Console\Commands;

use App\Models\Alumno;
use Illuminate\Console\Command;

class UpdateAlumnosEstatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alumnos:update-estatus';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza el estatus de los alumnos basándose en sus calificaciones y factores de riesgo';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Actualizando estatus de alumnos...');
        $this->newLine();

        $alumnos = Alumno::with(['inscripciones.alumnosFactores'])->get();
        $bar = $this->output->createProgressBar($alumnos->count());
        $bar->start();

        $estatusActualizados = [
            'activo' => 0,
            'baja_temporal' => 0,
            'baja_definitiva' => 0,
            'egresado' => 0,
        ];

        foreach ($alumnos as $alumno) {
            $promedioGeneral = $alumno->inscripciones()
                ->whereNotNull('calificacion_final')
                ->avg('calificacion_final');

            $numeroFactoresRiesgo = 0;
            foreach ($alumno->inscripciones as $inscripcion) {
                $numeroFactoresRiesgo += $inscripcion->alumnosFactores()->count();
            }

            $nuevoEstatus = $alumno->estatus_alumno; // Mantener el actual por defecto

            // Lógica para determinar el estatus
            // Egresados: estudiantes de semestre 9 con buen promedio
            if ($alumno->semestre == 9 && $promedioGeneral >= 70) {
                if (rand(1, 100) <= 30) {
                    $nuevoEstatus = 'egresado';
                }
            }
            // Baja definitiva: estudiantes con promedio muy bajo o muchos factores de riesgo
            elseif ($promedioGeneral < 60 || $numeroFactoresRiesgo >= 3) {
                if (rand(1, 100) <= 20) {
                    $nuevoEstatus = 'baja_definitiva';
                }
            }
            // Baja temporal: estudiantes con bajo promedio
            elseif ($promedioGeneral < 70 && $promedioGeneral >= 60) {
                if (rand(1, 100) <= 25) {
                    $nuevoEstatus = 'baja_temporal';
                }
            }
            // Activos: el resto
            else {
                $nuevoEstatus = 'activo';
            }

            if ($alumno->estatus_alumno !== $nuevoEstatus) {
                $alumno->update(['estatus_alumno' => $nuevoEstatus]);
            }

            $estatusActualizados[$nuevoEstatus]++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info('✅ Estatus de alumnos actualizado exitosamente!');
        $this->newLine();

        $this->table(
            ['Estatus', 'Cantidad'],
            [
                ['Activos', $estatusActualizados['activo']],
                ['Baja Temporal', $estatusActualizados['baja_temporal']],
                ['Baja Definitiva', $estatusActualizados['baja_definitiva']],
                ['Egresados', $estatusActualizados['egresado']],
                ['TOTAL', array_sum($estatusActualizados)],
            ]
        );

        return Command::SUCCESS;
    }
}
