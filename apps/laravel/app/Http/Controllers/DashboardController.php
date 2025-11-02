<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use App\Models\Inscripcion;
use App\Models\Calificacion;
use App\Models\Periodo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function getStats(Request $request)
    {
        $periodoId = $request->query('periodo_id');

        // Si no se especifica período, usar el período activo
        if (!$periodoId) {
            $periodoActivo = Periodo::where('activo', true)->first();
            $periodoId = $periodoActivo?->id;
        }

        // Query base de alumnos
        $queryAlumnos = Alumno::query();
        
        // Si hay período seleccionado, filtrar solo alumnos con inscripciones en ese período
        if ($periodoId) {
            $queryAlumnos->whereHas('inscripciones.grupo', function ($query) use ($periodoId) {
                $query->where('periodo_id', $periodoId);
            });
        }

        // Total de estudiantes (filtrado por período si aplica)
        $totalEstudiantes = $queryAlumnos->count();

        // Reprobación promedio (calificaciones menores a 70)
        // Filtrado por período
        $queryCalificaciones = Inscripcion::whereNotNull('calificacion_final');
        if ($periodoId) {
            $queryCalificaciones->whereHas('grupo', function ($query) use ($periodoId) {
                $query->where('periodo_id', $periodoId);
            });
        }
        
        $totalCalificaciones = $queryCalificaciones->count();
        $calificacionesReprobadas = (clone $queryCalificaciones)->where('calificacion_final', '<', 70)->count();
        $reprobacionPromedio = $totalCalificaciones > 0 
            ? round(($calificacionesReprobadas / $totalCalificaciones) * 100, 2) 
            : 0;

        // Deserción estimada (estudiantes con estatus de baja)
        // Filtrado por período - solo estudiantes que tienen inscripciones en ese período
        $queryDesercion = Alumno::whereIn('estatus_alumno', ['baja_temporal', 'baja_definitiva']);
        if ($periodoId) {
            $queryDesercion->whereHas('inscripciones.grupo', function ($query) use ($periodoId) {
                $query->where('periodo_id', $periodoId);
            });
        }
        
        $estudiantesDesercion = $queryDesercion->count();
        $desercionEstimada = $totalEstudiantes > 0 
            ? round(($estudiantesDesercion / $totalEstudiantes) * 100, 2) 
            : 0;

        // Deserción por semestre
        $desercionPorSemestre = [];
        
        // Obtener el conteo de estudiantes que desertaron por semestre
        for ($sem = 1; $sem <= 9; $sem++) {
            $queryDesertoresSemestre = Alumno::where('semestre', $sem)
                ->whereIn('estatus_alumno', ['baja_temporal', 'baja_definitiva']);
            
            // Aplicar filtro de período si existe
            if ($periodoId) {
                $queryDesertoresSemestre->whereHas('inscripciones.grupo', function ($query) use ($periodoId) {
                    $query->where('periodo_id', $periodoId);
                });
            }
            
            $desertoresPorSemestre = $queryDesertoresSemestre->count();
            
            $desercionPorSemestre[] = [
                'semestre' => "Sem $sem",
                'estudiantes' => $desertoresPorSemestre
            ];
        }

        // Obtener lista de períodos para el filtro
        $periodos = Periodo::orderBy('fecha_inicio', 'desc')->get(['id', 'nombre', 'activo']);

        return response()->json([
            'totalEstudiantes' => $totalEstudiantes,
            'reprobacionPromedio' => $reprobacionPromedio,
            'desercionEstimada' => $desercionEstimada,
            'desercionPorSemestre' => $desercionPorSemestre,
            'periodos' => $periodos,
            'periodoSeleccionado' => $periodoId,
        ]);
    }
}
