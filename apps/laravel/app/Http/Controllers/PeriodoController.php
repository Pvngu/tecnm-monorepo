<?php

namespace App\Http\Controllers;

use App\Http\Requests\PeriodoRequest;
use App\Http\Traits\HasPagination;
use App\Models\Periodo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class PeriodoController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $periodos = QueryBuilder::for(Periodo::class)
            ->allowedFilters(['nombre', 'activo', 'fecha_inicio', 'fecha_fin'])
            ->allowedSorts(['nombre', 'fecha_inicio', 'fecha_fin', 'activo', 'created_at'])
            ->allowedIncludes(['grupos'])
            ->paginate($this->getPageSize());

        return response()->json($periodos);
    }

    public function store(PeriodoRequest $request): JsonResponse
    {
        $periodo = Periodo::create($request->validated());
        return response()->json($periodo, 201);
    }

    public function show(Periodo $periodo): JsonResponse
    {
        return response()->json($periodo);
    }

    public function update(PeriodoRequest $request, Periodo $periodo): JsonResponse
    {
        $periodo->update($request->validated());
        return response()->json($periodo);
    }

    public function destroy(Periodo $periodo): JsonResponse
    {
        $periodo->delete();
        return response()->json(null, 204);
    }
}
