<?php

namespace App\Http\Controllers;

use App\Http\Requests\AsistenciaRequest;
use App\Http\Traits\HasPagination;
use App\Models\Asistencia;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AsistenciaController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $asistencias = QueryBuilder::for(Asistencia::class)
            ->allowedFilters([
                'fecha',
                'estatus',
                AllowedFilter::exact('inscripcion_id'),
            ])
            ->allowedSorts(['fecha', 'estatus', 'created_at'])
            ->allowedIncludes(['inscripcion'])
            ->paginate($this->getPageSize());

        return response()->json($asistencias);
    }

    public function store(AsistenciaRequest $request): JsonResponse
    {
        $asistencia = Asistencia::create($request->validated());
        return response()->json($asistencia, 201);
    }

    public function show(Asistencia $asistencia): JsonResponse
    {
        return response()->json($asistencia);
    }

    public function update(AsistenciaRequest $request, Asistencia $asistencia): JsonResponse
    {
        $asistencia->update($request->validated());
        return response()->json($asistencia);
    }

    public function destroy(Asistencia $asistencia): JsonResponse
    {
        $asistencia->delete();
        return response()->json(null, 204);
    }
}
