<?php

namespace App\Http\Controllers;

use App\Http\Requests\InscripcionRequest;
use App\Http\Traits\HasPagination;
use App\Models\Inscripcion;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class InscripcionController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $inscripciones = QueryBuilder::for(Inscripcion::class)
            ->allowedFilters([
                'calificacion_final',
                AllowedFilter::exact('alumno_id'),
                AllowedFilter::exact('grupo_id'),
            ])
            ->allowedSorts(['calificacion_final', 'created_at'])
            ->allowedIncludes(['alumno', 'grupo', 'calificaciones', 'asistencias', 'alumnosFactores'])
            ->paginate($this->getPageSize());

        return response()->json($inscripciones);
    }

    public function store(InscripcionRequest $request): JsonResponse
    {
        $inscripcion = Inscripcion::create($request->validated());
        return response()->json($inscripcion, 201);
    }

    public function show(Inscripcion $inscripcion): JsonResponse
    {
        return response()->json($inscripcion);
    }

    public function update(InscripcionRequest $request, Inscripcion $inscripcion): JsonResponse
    {
        $inscripcion->update($request->validated());
        return response()->json($inscripcion);
    }

    public function destroy(Inscripcion $inscripcion): JsonResponse
    {
        $inscripcion->delete();
        return response()->json(null, 204);
    }
}
