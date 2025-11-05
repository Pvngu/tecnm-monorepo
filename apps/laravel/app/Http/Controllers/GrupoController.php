<?php

namespace App\Http\Controllers;

use App\Http\Requests\GrupoRequest;
use App\Http\Traits\HasPagination;
use App\Models\Grupo;
use App\Exports\GruposExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class GrupoController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $grupos = QueryBuilder::for(Grupo::class)
            ->allowedFilters([
                'horario',
                'aula',
                AllowedFilter::exact('materia_id'),
                AllowedFilter::exact('profesor_id'),
                AllowedFilter::exact('periodo_id'),
                AllowedFilter::exact('carrera_id'),
            ])
            ->allowedSorts(['aula', 'created_at'])
            ->allowedIncludes(['materia', 'profesor', 'periodo', 'carrera', 'inscripciones'])
            ->paginate($this->getPageSize());

        return response()->json($grupos);
    }

    public function store(GrupoRequest $request): JsonResponse
    {
        $grupo = Grupo::create($request->validated());
        return response()->json($grupo, 201);
    }

    public function show(Grupo $grupo): JsonResponse
    {
        // Load relationships if requested via include parameter
        $allowedIncludes = ['materia', 'profesor', 'periodo', 'carrera', 'inscripciones'];
        $includeParam = request()->query('include', '');
        
        if ($includeParam) {
            $includes = array_filter(
                explode(',', $includeParam),
                fn($include) => in_array(trim($include), $allowedIncludes)
            );
            
            if (!empty($includes)) {
                $grupo->load($includes);
            }
        }
        
        return response()->json($grupo);
    }

    public function update(GrupoRequest $request, Grupo $grupo): JsonResponse
    {
        $grupo->update($request->validated());
        return response()->json($grupo);
    }

    public function destroy(Grupo $grupo): JsonResponse
    {
        $grupo->delete();
        return response()->json(null, 204);
    }

    /**
     * Análisis de Pareto de factores de riesgo por grupo
     * Devuelve los factores de riesgo ordenados por frecuencia con porcentaje acumulado
     */
    public function getFactoresPareto(Grupo $grupo): JsonResponse
    {
        // 1. Obtener los IDs de las inscripciones del grupo
        $inscripcionIds = $grupo->inscripciones()->pluck('id');

        // 2. Consultar factores, agrupar, contar y ordenar
        $factores = DB::table('alumnos_factores')
            ->join('factores_riesgo', 'alumnos_factores.factor_id', '=', 'factores_riesgo.id')
            ->whereIn('alumnos_factores.inscripcion_id', $inscripcionIds)
            ->select('factores_riesgo.nombre', DB::raw('COUNT(alumnos_factores.id) as frecuencia'))
            ->groupBy('factores_riesgo.nombre')
            ->orderBy('frecuencia', 'DESC')
            ->get();

        // 3. Procesar para Pareto (Calcular % Acumulado)
        $totalFrecuencia = $factores->sum('frecuencia');
        $frecuenciaAcumulada = 0;

        $datosPareto = $factores->map(function ($item) use ($totalFrecuencia, &$frecuenciaAcumulada) {
            $frecuenciaAcumulada += $item->frecuencia;
            $porcentajeAcumulado = ($totalFrecuencia > 0) ? ($frecuenciaAcumulada / $totalFrecuencia) * 100 : 0;

            return [
                'nombre' => $item->nombre,
                'frecuencia' => $item->frecuencia,
                'porcentaje_acumulado' => round($porcentajeAcumulado, 1) // Redondear a 1 decimal
            ];
        });

        // 4. Devolver la respuesta JSON
        return response()->json($datosPareto);
    }

    /**
     * Obtener datos para el Diagrama de Ishikawa del grupo
     * Devuelve el efecto (tasa de reprobación) y las causas principales agrupadas por categoría
     */
    public function getIshikawaData(Grupo $grupo): JsonResponse
    {
        // 1. Obtener inscripciones y calcular el "Efecto" (Tasa de Reprobación)
        // Asumimos que 60 es la calificación mínima aprobatoria.
        $inscripciones = $grupo->inscripciones()->get();
        $totalAlumnos = $inscripciones->count();
        
        if ($totalAlumnos === 0) {
            return response()->json([
                'efecto' => 'Grupo sin alumnos',
                'tasa_reprobacion' => 0,
                'causas_principales' => []
            ]);
        }

        $totalReprobados = $inscripciones->where('calificacion_final', '<', 60)->count();
        $tasaReprobacion = round(($totalReprobados / $totalAlumnos) * 100, 1);
        $efecto = "Tasa de Reprobación del $tasaReprobacion% en el grupo";

        // 2. Obtener los IDs de las inscripciones
        $inscripcionIds = $inscripciones->pluck('id');

        // 3. Consultar factores, agrupar por CATEGORÍA y por NOMBRE
        $factoresAgrupados = DB::table('alumnos_factores')
            ->join('factores_riesgo', 'alumnos_factores.factor_id', '=', 'factores_riesgo.id')
            ->whereIn('alumnos_factores.inscripcion_id', $inscripcionIds)
            ->select('factores_riesgo.categoria', 'factores_riesgo.nombre', DB::raw('COUNT(alumnos_factores.id) as frecuencia'))
            ->groupBy('factores_riesgo.categoria', 'factores_riesgo.nombre')
            ->orderBy('factores_riesgo.categoria')
            ->orderBy('frecuencia', 'DESC')
            ->get();

        // 4. Formatear la respuesta en la estructura de Ishikawa
        $causasPrincipales = $factoresAgrupados->groupBy('categoria')
            ->map(function ($factoresEnCategoria, $categoriaNombre) {
                return [
                    'categoria' => $categoriaNombre, // La "espina" principal
                    'causas_secundarias' => $factoresEnCategoria->map(function ($factor) {
                        return [
                            'nombre' => $factor->nombre, // La "espina" secundaria
                            'frecuencia' => $factor->frecuencia
                        ];
                    })->values()
                ];
            })->values();
            
        // 5. Devolver la respuesta JSON
        return response()->json([
            'efecto' => $efecto,
            'tasa_reprobacion' => $tasaReprobacion,
            'causas_principales' => $causasPrincipales
        ]);
    }

    /**
     * Obtener datos para el Diagrama de Dispersión: Faltas vs. Calificación Final
     * Devuelve los puntos (x: número de faltas, y: calificación final) del grupo
     */
    public function getScatterPlotFaltas(Grupo $grupo): JsonResponse
    {
        // Cargar las inscripciones del grupo con sus calificaciones finales
        // y un conteo de sus asistencias que tengan estatus 'falta'
        $datos = $grupo->inscripciones()
            ->whereNotNull('calificacion_final')
            ->with('alumno') // Eager loading para evitar N+1
            ->withCount([
                'asistencias as total_asistencias',
                'asistencias as faltas_count' => function ($query) {
                    $query->where('estatus', 'falta');
                },
                'asistencias as asistencias_count' => function ($query) {
                    $query->where('estatus', 'asistio');
                },
                'asistencias as justificados_count' => function ($query) {
                    $query->where('estatus', 'justificado');
                },
                'calificaciones as calificaciones_count',
                'alumnosFactores as factores_count',
            ])
            ->get();

        // Formatear los datos para el gráfico de dispersión con múltiples variables
        $scatterData = $datos->map(function ($inscripcion) {
            // Calcular porcentaje de asistencias
            $totalRegistros = $inscripcion->total_asistencias;
            $porcentajeAsistencia = $totalRegistros > 0 
                ? round(($inscripcion->asistencias_count / $totalRegistros) * 100, 1) 
                : 0;

            return [
                // Variables numéricas disponibles
                'calificacion_final' => (float) $inscripcion->calificacion_final,
                'faltas' => $inscripcion->faltas_count,
                'asistencias' => $inscripcion->asistencias_count,
                'justificados' => $inscripcion->justificados_count,
                'total_asistencias' => $inscripcion->total_asistencias,
                'porcentaje_asistencia' => $porcentajeAsistencia,
                'num_factores_riesgo' => $inscripcion->factores_count,
                
                // Información del alumno
                'alumno_nombre' => $inscripcion->alumno->nombre_completo,
                'alumno_id' => $inscripcion->alumno_id,
            ];
        });

        return response()->json($scatterData);
    }

    public function exportExcel(Request $request)
    {
        return Excel::download(
            new GruposExport($request),
            'grupos_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }

    public function exportCsv(Request $request)
    {
        return Excel::download(
            new GruposExport($request),
            'grupos_' . now()->format('Y-m-d_His') . '.csv',
            \Maatwebsite\Excel\Excel::CSV
        );
    }

    /**
     * Obtener los alumnos inscritos en un grupo
     */
    public function getAlumnos(Grupo $grupo): JsonResponse
    {
        $alumnos = $grupo->inscripciones()
            ->with(['alumno.carrera'])
            ->get()
            ->map(function ($inscripcion) {
                return [
                    'id' => $inscripcion->alumno->id,
                    'inscripcion_id' => $inscripcion->id,
                    'matricula' => $inscripcion->alumno->matricula,
                    'nombre' => $inscripcion->alumno->nombre,
                    'apellido_paterno' => $inscripcion->alumno->apellido_paterno,
                    'apellido_materno' => $inscripcion->alumno->apellido_materno,
                    'nombre_completo' => trim($inscripcion->alumno->nombre . ' ' . 
                                            $inscripcion->alumno->apellido_paterno . ' ' . 
                                            ($inscripcion->alumno->apellido_materno ?? '')),
                    'semestre' => $inscripcion->alumno->semestre,
                    'carrera' => $inscripcion->alumno->carrera->nombre ?? null,
                    'calificacion_final' => $inscripcion->calificacion_final,
                ];
            });

        return response()->json($alumnos);
    }

    /**
     * Obtener asistencias de un grupo para una fecha específica
     */
    public function getAsistenciasByFecha(Request $request, Grupo $grupo): JsonResponse
    {
        $fecha = $request->input('fecha', now()->format('Y-m-d'));

        $inscripcionIds = $grupo->inscripciones()->pluck('id');
        
        $asistencias = DB::table('asistencias')
            ->whereIn('inscripcion_id', $inscripcionIds)
            ->where('fecha', $fecha)
            ->get()
            ->keyBy('inscripcion_id');

        return response()->json($asistencias);
    }

    /**
     * Guardar asistencias de múltiples alumnos para una fecha
     */
    public function saveAsistenciasBulk(Request $request, Grupo $grupo): JsonResponse
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'asistencias' => 'required|array',
            'asistencias.*.inscripcion_id' => 'required|exists:inscripciones,id',
            'asistencias.*.estatus' => 'required|in:presente,ausente,retardo',
        ]);

        $fecha = $validated['fecha'];
        $asistenciasData = $validated['asistencias'];

        // Verificar que todas las inscripciones pertenecen al grupo
        $inscripcionIds = collect($asistenciasData)->pluck('inscripcion_id');
        $grupoInscripcionIds = $grupo->inscripciones()->pluck('id');
        
        if ($inscripcionIds->diff($grupoInscripcionIds)->isNotEmpty()) {
            return response()->json([
                'message' => 'Algunas inscripciones no pertenecen a este grupo'
            ], 422);
        }

        // Guardar o actualizar asistencias
        foreach ($asistenciasData as $asistenciaData) {
            DB::table('asistencias')->updateOrInsert(
                [
                    'inscripcion_id' => $asistenciaData['inscripcion_id'],
                    'fecha' => $fecha,
                ],
                [
                    'estatus' => $asistenciaData['estatus'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        return response()->json([
            'message' => 'Asistencias guardadas correctamente',
            'fecha' => $fecha,
            'total' => count($asistenciasData)
        ], 200);
    }
}
