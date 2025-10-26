<?php

namespace App\Http\Controllers;

use App\Http\Requests\GrupoRequest;
use App\Http\Traits\HasPagination;
use App\Models\Grupo;
use Illuminate\Http\JsonResponse;
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
}
