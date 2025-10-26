<?php

namespace App\Http\Controllers;

use App\Http\Requests\CalificacionRequest;
use App\Http\Traits\HasPagination;
use App\Models\Calificacion;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class CalificacionController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $calificaciones = QueryBuilder::for(Calificacion::class)
            ->allowedFilters([
                'valor_calificacion',
                AllowedFilter::exact('inscripcion_id'),
                AllowedFilter::exact('unidad_id'),
            ])
            ->allowedSorts(['valor_calificacion', 'created_at'])
            ->allowedIncludes(['inscripcion', 'unidad'])
            ->paginate($this->getPageSize());

        return response()->json($calificaciones);
    }

    public function store(CalificacionRequest $request): JsonResponse
    {
        $calificacion = Calificacion::create($request->validated());
        return response()->json($calificacion, 201);
    }

    public function show(Calificacion $calificacion): JsonResponse
    {
        return response()->json($calificacion);
    }

    public function update(CalificacionRequest $request, Calificacion $calificacion): JsonResponse
    {
        $calificacion->update($request->validated());
        return response()->json($calificacion);
    }

    public function destroy(Calificacion $calificacion): JsonResponse
    {
        $calificacion->delete();
        return response()->json(null, 204);
    }
}
