<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlumnoRequest;
use App\Http\Traits\HasPagination;
use App\Models\Alumno;
use App\Exports\AlumnosExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AlumnoController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $alumnos = QueryBuilder::for(Alumno::class)
            ->allowedFilters([
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'matricula',
                'semestre',
                'genero',
                'modalidad',
                AllowedFilter::exact('carrera_id'),
                AllowedFilter::exact('usuario_id'),
                AllowedFilter::exact('estatus_alumno'),
                AllowedFilter::exact('genero'),
                AllowedFilter::exact('modalidad'),
            ])
            ->allowedSorts(['nombre', 'apellido_paterno', 'matricula', 'semestre', 'created_at'])
            ->allowedIncludes(['usuario', 'carrera', 'inscripciones'])
            ->paginate($this->getPageSize());

        return response()->json($alumnos);
    }

    public function store(AlumnoRequest $request): JsonResponse
    {
        $alumno = Alumno::create($request->validated());
        return response()->json($alumno, 201);
    }

    public function show(Alumno $alumno): JsonResponse
    {
        $alumno->load([
            'usuario',
            'carrera',
            'inscripciones.grupo.materia.unidades',
            'inscripciones.grupo.profesor',
            'inscripciones.grupo.periodo',
            'inscripciones.calificaciones.unidad',
            'inscripciones.factores.factor',
            'inscripciones.asistencias'
        ]);

        return response()->json($alumno);
    }

    public function update(AlumnoRequest $request, Alumno $alumno): JsonResponse
    {
        $alumno->update($request->validated());
        return response()->json($alumno);
    }

    public function destroy(Alumno $alumno): JsonResponse
    {
        $alumno->delete();
        return response()->json(null, 204);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'data' => 'required|array',
            'data.*.carrera_id' => 'required|integer|exists:carreras,id',
            'data.*.matricula' => 'required|string|max:50',
            'data.*.nombre' => 'required|string|max:100',
            'data.*.apellido_paterno' => 'required|string|max:100',
            'data.*.apellido_materno' => 'nullable|string|max:100',
            'data.*.fecha_nacimiento' => 'nullable|date',
            'data.*.semestre' => 'required|integer|min:1|max:12',
            'data.*.genero' => 'required|in:masculino,femenino,otro',
            'data.*.modalidad' => 'required|in:presencial,virtual,hibrida',
        ]);

        $imported = [];
        $errors = [];

        foreach ($request->data as $index => $row) {
            try {
                // Set usuario_id to null by default for CSV imports
                $alumnoData = array_merge($row, ['usuario_id' => null]);
                
                $alumno = Alumno::create($alumnoData);
                $imported[] = $alumno;
            } catch (\Exception $e) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => $e->getMessage(),
                    'data' => $row,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'imported' => count($imported),
            'failed' => count($errors),
            'errors' => $errors,
        ]);
    }

    /**
     * Exporta los alumnos a formato Excel (.xlsx)
     * Respeta todos los filtros aplicados en el request
     */
    public function exportExcel(Request $request)
    {
        return Excel::download(
            new AlumnosExport($request),
            'alumnos_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }

    /**
     * Exporta los alumnos a formato CSV (.csv)
     * Respeta todos los filtros aplicados en el request
     */
    public function exportCsv(Request $request)
    {
        return Excel::download(
            new AlumnosExport($request),
            'alumnos_' . now()->format('Y-m-d_His') . '.csv',
            \Maatwebsite\Excel\Excel::CSV
        );
    }
}
