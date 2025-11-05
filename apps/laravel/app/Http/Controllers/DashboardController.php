<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use App\Models\Inscripcion;
use App\Models\Calificacion;
use App\Models\Periodo;
use App\Models\AlumnoFactor;
use App\Models\FactorRiesgo;
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

    /**
     * Get analytics data for dashboard
     * Returns grades distribution and risk factors frequency
     */
    public function getAnalytics(Request $request)
    {
        // Validate required periodo_id parameter
        $request->validate([
            'periodo_id' => 'required|exists:periodos,id',
            'carrera_id' => 'nullable|exists:carreras,id',
            'semestre' => 'nullable|integer|min:1|max:12',
        ]);

        $periodoId = $request->input('periodo_id');
        $carreraId = $request->input('carrera_id');
        $semestre = $request->input('semestre');

        // Build base query for filtered inscriptions
        $baseQuery = Inscripcion::query()
            ->join('alumnos', 'inscripciones.alumno_id', '=', 'alumnos.id')
            ->join('grupos', 'inscripciones.grupo_id', '=', 'grupos.id')
            ->where('grupos.periodo_id', $periodoId);

        // Apply optional filters
        if ($carreraId) {
            $baseQuery->where('alumnos.carrera_id', $carreraId);
        }
        if ($semestre) {
            $baseQuery->where('alumnos.semestre', $semestre);
        }

        // 1. Get grades distribution data
        $gradesQuery = clone $baseQuery;
        $gradesData = $gradesQuery
            ->select(
                DB::raw('CASE 
                    WHEN calificacion_final < 60 THEN 0
                    WHEN calificacion_final >= 60 AND calificacion_final < 70 THEN 60
                    WHEN calificacion_final >= 70 AND calificacion_final < 80 THEN 70
                    WHEN calificacion_final >= 80 AND calificacion_final < 90 THEN 80
                    ELSE 90
                END as rango_inicio'),
                DB::raw('COUNT(*) as frecuencia')
            )
            ->whereNotNull('inscripciones.calificacion_final')
            ->groupBy('rango_inicio')
            ->orderBy('rango_inicio')
            ->get();

        // Format grades data with proper range labels
        $calificacionesData = $gradesData->map(function ($item) {
            $rangoInicio = $item->rango_inicio;
            $rango = match($rangoInicio) {
                0 => '0-59',
                60 => '60-69',
                70 => '70-79',
                80 => '80-89',
                90 => '90-100',
                default => "$rangoInicio-" . ($rangoInicio + 9)
            };

            return [
                'rango' => $rango,
                'frecuencia' => (int) $item->frecuencia
            ];
        })->values();

        // Calculate average grade
        $promedioQuery = clone $baseQuery;
        $promedioGeneral = $promedioQuery
            ->whereNotNull('inscripciones.calificacion_final')
            ->avg('inscripciones.calificacion_final');
        $promedioGeneral = $promedioGeneral ? round($promedioGeneral, 2) : 0;

        // 2. Get risk factors frequency data
        // First get the IDs of filtered inscriptions
        $inscripcionIds = (clone $baseQuery)->pluck('inscripciones.id');

        // Query risk factors for these inscriptions
        $factoresRiesgoData = AlumnoFactor::query()
            ->select('factores_riesgo.nombre', DB::raw('COUNT(alumnos_factores.id) as frecuencia'))
            ->join('factores_riesgo', 'alumnos_factores.factor_id', '=', 'factores_riesgo.id')
            ->whereIn('alumnos_factores.inscripcion_id', $inscripcionIds)
            ->groupBy('factores_riesgo.id', 'factores_riesgo.nombre')
            ->orderByDesc('frecuencia')
            ->get()
            ->map(function ($item) {
                return [
                    'nombre' => $item->nombre,
                    'frecuencia' => (int) $item->frecuencia
                ];
            });

        return response()->json([
            'calificaciones_data' => $calificacionesData,
            'factores_riesgo_data' => $factoresRiesgoData,
            'promedio_general' => $promedioGeneral
        ]);
    }

    /**
     * Get Pareto analysis data for a periodo
     * Returns risk factors ordered by frequency with cumulative percentage
     */
    public function getParetoFactores(Request $request)
    {
        // Validate required periodo_id parameter
        $request->validate([
            'periodo_id' => 'required|exists:periodos,id',
            'carrera_id' => 'nullable|exists:carreras,id',
            'semestre' => 'nullable|integer|min:1|max:12',
        ]);

        $periodoId = $request->input('periodo_id');
        $carreraId = $request->input('carrera_id');
        $semestre = $request->input('semestre');

        // Build base query to get inscriptions for the periodo
        $inscripcionQuery = Inscripcion::query()
            ->join('alumnos', 'inscripciones.alumno_id', '=', 'alumnos.id')
            ->join('grupos', 'inscripciones.grupo_id', '=', 'grupos.id')
            ->where('grupos.periodo_id', $periodoId);

        // Apply optional filters
        if ($carreraId) {
            $inscripcionQuery->where('alumnos.carrera_id', $carreraId);
        }
        if ($semestre) {
            $inscripcionQuery->where('alumnos.semestre', $semestre);
        }

        // Get inscripcion IDs
        $inscripcionIds = $inscripcionQuery->pluck('inscripciones.id');

        // Query factors, group, count and order
        $factores = DB::table('alumnos_factores')
            ->join('factores_riesgo', 'alumnos_factores.factor_id', '=', 'factores_riesgo.id')
            ->whereIn('alumnos_factores.inscripcion_id', $inscripcionIds)
            ->select('factores_riesgo.nombre', DB::raw('COUNT(alumnos_factores.id) as frecuencia'))
            ->groupBy('factores_riesgo.nombre')
            ->orderBy('frecuencia', 'DESC')
            ->get();

        // Process for Pareto (Calculate cumulative percentage)
        $totalFrecuencia = $factores->sum('frecuencia');
        $frecuenciaAcumulada = 0;

        $datosPareto = $factores->map(function ($item) use ($totalFrecuencia, &$frecuenciaAcumulada) {
            $frecuenciaAcumulada += $item->frecuencia;
            $porcentajeAcumulado = ($totalFrecuencia > 0) ? ($frecuenciaAcumulada / $totalFrecuencia) * 100 : 0;

            return [
                'nombre' => $item->nombre,
                'frecuencia' => $item->frecuencia,
                'porcentaje_acumulado' => round($porcentajeAcumulado, 1)
            ];
        });

        return response()->json($datosPareto);
    }
}
