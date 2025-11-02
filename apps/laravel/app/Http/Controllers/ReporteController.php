<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscripcion;
use App\Models\FactorRiesgo;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    /**
     * Obtener reporte de resumen con métricas clave y factores de riesgo con recomendaciones.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSummaryReport(Request $request)
    {
        $request->validate([
            'periodo_id' => 'required|integer|exists:periodos,id',
            'carrera_id' => 'nullable|integer|exists:carreras,id',
        ]);

        // 1. Consulta base de inscripciones filtradas
        $inscripcionesQuery = Inscripcion::query()
            ->join('grupos', 'inscripciones.grupo_id', '=', 'grupos.id')
            ->where('grupos.periodo_id', $request->periodo_id);

        if ($request->has('carrera_id') && $request->carrera_id) {
            $inscripcionesQuery->join('alumnos', 'inscripciones.alumno_id', '=', 'alumnos.id')
                               ->where('alumnos.carrera_id', $request->carrera_id);
        }

        // Clonar la consulta para diferentes métricas
        $queryInscripcionesIds = (clone $inscripcionesQuery)->pluck('inscripciones.id');

        // 2. Calcular Métricas Clave
        $metricasQuery = (clone $inscripcionesQuery)->whereNotNull('inscripciones.calificacion_final');
        $totalAlumnos = $metricasQuery->distinct('inscripciones.alumno_id')->count('inscripciones.alumno_id');
        $totalInscripciones = $metricasQuery->count();
        $totalReprobados = (clone $metricasQuery)->where('inscripciones.calificacion_final', '<', 60)->count();

        $tasaReprobacion = ($totalInscripciones > 0) 
            ? round(($totalReprobados / $totalInscripciones) * 100, 1) 
            : 0;
        
        $promedioGeneral = round($metricasQuery->avg('inscripciones.calificacion_final'), 1);

        // 3. Obtener Top Factores de Riesgo (Top 5)
        $topFactores = DB::table('alumnos_factores')
            ->whereIn('inscripcion_id', $queryInscripcionesIds)
            ->select('factor_id', DB::raw('COUNT(id) as frecuencia'))
            ->groupBy('factor_id')
            ->orderBy('frecuencia', 'DESC')
            ->limit(5)
            ->get();

        $topFactoresIds = $topFactores->pluck('factor_id');

        // 4. Cargar Factores Y SUS RECOMENDACIONES con frecuencias
        $factoresConRecomendaciones = FactorRiesgo::whereIn('id', $topFactoresIds)
            ->with('recomendaciones')
            ->get()
            ->map(function ($factor) use ($topFactores) {
                // Añadir la frecuencia al factor
                $frecuencia = $topFactores->firstWhere('factor_id', $factor->id);
                $factor->frecuencia = $frecuencia ? $frecuencia->frecuencia : 0;
                return $factor;
            })
            ->sortByDesc('frecuencia')
            ->values(); // Re-indexar colección

        return response()->json([
            'success' => true,
            'metricas' => [
                'promedio_general' => $promedioGeneral ?? 0,
                'tasa_reprobacion' => $tasaReprobacion,
                'total_alumnos' => $totalAlumnos,
                'total_inscripciones' => $totalInscripciones,
                'total_reprobados' => $totalReprobados,
            ],
            'top_factores' => $factoresConRecomendaciones
        ]);
    }
}
