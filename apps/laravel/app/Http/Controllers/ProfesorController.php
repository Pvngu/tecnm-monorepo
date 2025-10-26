<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfesorRequest;
use App\Http\Traits\HasPagination;
use App\Models\Profesor;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ProfesorController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $profesores = QueryBuilder::for(Profesor::class)
            ->allowedFilters([
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'rfc',
                AllowedFilter::exact('usuario_id'),
            ])
            ->allowedSorts(['nombre', 'apellido_paterno', 'rfc', 'created_at'])
            ->allowedIncludes(['usuario', 'grupos'])
            ->paginate($this->getPageSize());

        return response()->json($profesores);
    }

    public function store(ProfesorRequest $request): JsonResponse
    {
        $profesor = Profesor::create($request->validated());
        return response()->json($profesor, 201);
    }

    public function show(Profesor $profesor): JsonResponse
    {
        return response()->json($profesor);
    }

    public function update(ProfesorRequest $request, Profesor $profesor): JsonResponse
    {
        $profesor->update($request->validated());
        return response()->json($profesor);
    }

    public function destroy(Profesor $profesor): JsonResponse
    {
        $profesor->delete();
        return response()->json(null, 204);
    }
}
