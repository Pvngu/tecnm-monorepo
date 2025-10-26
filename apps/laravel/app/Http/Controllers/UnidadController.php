<?php

namespace App\Http\Controllers;

use App\Http\Requests\UnidadRequest;
use App\Http\Traits\HasPagination;
use App\Models\Unidad;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class UnidadController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $unidades = QueryBuilder::for(Unidad::class)
            ->allowedFilters([
                'nombre_unidad',
                'numero_unidad',
                AllowedFilter::exact('materia_id'),
            ])
            ->allowedSorts(['numero_unidad', 'nombre_unidad', 'created_at'])
            ->allowedIncludes(['materia', 'calificaciones'])
            ->paginate($this->getPageSize());

        return response()->json($unidades);
    }

    public function store(UnidadRequest $request): JsonResponse
    {
        $unidad = Unidad::create($request->validated());
        return response()->json($unidad, 201);
    }

    public function show(Unidad $unidad): JsonResponse
    {
        return response()->json($unidad);
    }

    public function update(UnidadRequest $request, Unidad $unidad): JsonResponse
    {
        $unidad->update($request->validated());
        return response()->json($unidad);
    }

    public function destroy(Unidad $unidad): JsonResponse
    {
        $unidad->delete();
        return response()->json(null, 204);
    }
}
