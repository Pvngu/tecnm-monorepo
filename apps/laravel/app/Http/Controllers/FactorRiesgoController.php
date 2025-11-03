<?php

namespace App\Http\Controllers;

use App\Http\Requests\FactorRiesgoRequest;
use App\Http\Traits\HasPagination;
use App\Models\FactorRiesgo;
use App\Exports\FactoresRiesgoExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\QueryBuilder;

class FactorRiesgoController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $factores = QueryBuilder::for(FactorRiesgo::class)
            ->allowedFilters(['nombre', 'categoria'])
            ->allowedSorts(['nombre', 'categoria', 'created_at'])
            ->allowedIncludes(['alumnosFactores'])
            ->paginate($this->getPageSize());

        return response()->json($factores);
    }

    public function store(FactorRiesgoRequest $request): JsonResponse
    {
        $factor = FactorRiesgo::create($request->validated());
        return response()->json($factor, 201);
    }

    public function show(FactorRiesgo $factorRiesgo): JsonResponse
    {
        return response()->json($factorRiesgo);
    }

    public function update(FactorRiesgoRequest $request, FactorRiesgo $factorRiesgo): JsonResponse
    {
        $factorRiesgo->update($request->validated());
        return response()->json($factorRiesgo);
    }

    public function destroy(FactorRiesgo $factorRiesgo): JsonResponse
    {
        $factorRiesgo->delete();
        return response()->json(null, 204);
    }

    public function exportExcel(Request $request)
    {
        return Excel::download(
            new FactoresRiesgoExport($request),
            'factores_riesgo_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }

    public function exportCsv(Request $request)
    {
        return Excel::download(
            new FactoresRiesgoExport($request),
            'factores_riesgo_' . now()->format('Y-m-d_His') . '.csv',
            \Maatwebsite\Excel\Excel::CSV
        );
    }
}
