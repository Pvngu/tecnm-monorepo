<?php

namespace App\Http\Controllers;

use App\Http\Requests\MateriaRequest;
use App\Http\Traits\HasPagination;
use App\Models\Materia;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;

class MateriaController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $materias = QueryBuilder::for(Materia::class)
            ->allowedFilters(['nombre', 'codigo_materia', 'creditos'])
            ->allowedSorts(['nombre', 'codigo_materia', 'creditos', 'created_at'])
            ->allowedIncludes(['unidades', 'grupos'])
            ->paginate($this->getPageSize());

        return response()->json($materias);
    }

    public function store(MateriaRequest $request): JsonResponse
    {
        $materia = Materia::create($request->validated());
        return response()->json($materia, 201);
    }

    public function show(Materia $materia): JsonResponse
    {
        return response()->json($materia);
    }

    public function update(MateriaRequest $request, Materia $materia): JsonResponse
    {
        $materia->update($request->validated());
        return response()->json($materia);
    }

    public function destroy(Materia $materia): JsonResponse
    {
        $materia->delete();
        return response()->json(null, 204);
    }
}
