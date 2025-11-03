<?php

namespace App\Http\Controllers;

use App\Http\Requests\MateriaRequest;
use App\Http\Traits\HasPagination;
use App\Models\Materia;
use App\Exports\MateriasExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
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

    public function exportExcel(Request $request)
    {
        return Excel::download(
            new MateriasExport($request),
            'materias_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }

    public function exportCsv(Request $request)
    {
        return Excel::download(
            new MateriasExport($request),
            'materias_' . now()->format('Y-m-d_His') . '.csv',
            \Maatwebsite\Excel\Excel::CSV
        );
    }
}
