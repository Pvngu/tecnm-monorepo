<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlumnoFactorRequest;
use App\Http\Traits\HasPagination;
use App\Models\AlumnoFactor;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AlumnoFactorController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $alumnosFactores = QueryBuilder::for(AlumnoFactor::class)
            ->allowedFilters([
                'fecha_registro',
                'observaciones',
                AllowedFilter::exact('inscripcion_id'),
                AllowedFilter::exact('factor_id'),
            ])
            ->allowedSorts(['fecha_registro', 'created_at'])
            ->allowedIncludes(['inscripcion', 'factor'])
            ->paginate($this->getPageSize());

        return response()->json($alumnosFactores);
    }

    public function store(AlumnoFactorRequest $request): JsonResponse
    {
        $alumnoFactor = AlumnoFactor::create($request->validated());
        return response()->json($alumnoFactor, 201);
    }

    public function show(AlumnoFactor $alumnoFactor): JsonResponse
    {
        return response()->json($alumnoFactor);
    }

    public function update(AlumnoFactorRequest $request, AlumnoFactor $alumnoFactor): JsonResponse
    {
        $alumnoFactor->update($request->validated());
        return response()->json($alumnoFactor);
    }

    public function destroy(AlumnoFactor $alumnoFactor): JsonResponse
    {
        $alumnoFactor->delete();
        return response()->json(null, 204);
    }
}
