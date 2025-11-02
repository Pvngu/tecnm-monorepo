<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Alumno;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Actualizar estatus de alumnos basándose en su rendimiento
        $alumnos = Alumno::with(['inscripciones.alumnosFactores'])->get();

        foreach ($alumnos as $alumno) {
            $promedioGeneral = $alumno->inscripciones()
                ->whereNotNull('calificacion_final')
                ->avg('calificacion_final');

            $numeroFactoresRiesgo = 0;
            foreach ($alumno->inscripciones as $inscripcion) {
                $numeroFactoresRiesgo += $inscripcion->alumnosFactores()->count();
            }

            // Si no tiene inscripciones, mantener como activo
            if ($alumno->inscripciones->count() === 0) {
                continue;
            }

            // Egresados: estudiantes de semestre 9 con buen promedio
            if ($alumno->semestre == 9 && $promedioGeneral >= 70) {
                if (rand(1, 100) <= 30) {
                    $alumno->update(['estatus_alumno' => 'egresado']);
                }
            }
            // Baja definitiva: estudiantes con promedio muy bajo o muchos factores de riesgo
            elseif ($promedioGeneral < 60 || $numeroFactoresRiesgo >= 3) {
                if (rand(1, 100) <= 20) {
                    $alumno->update(['estatus_alumno' => 'baja_definitiva']);
                }
            }
            // Baja temporal: estudiantes con bajo promedio
            elseif ($promedioGeneral < 70 && $promedioGeneral >= 60) {
                if (rand(1, 100) <= 25) {
                    $alumno->update(['estatus_alumno' => 'baja_temporal']);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir todos los alumnos a estatus 'activo'
        Alumno::query()->update(['estatus_alumno' => 'activo']);
    }
};
