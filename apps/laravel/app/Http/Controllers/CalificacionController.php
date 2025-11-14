<?php

namespace App\Http\Controllers;

use App\Http\Requests\CalificacionRequest;
use App\Http\Traits\HasPagination;
use App\Models\Calificacion;
use App\Models\Inscripcion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    public function storeBulk(Request $request, Inscripcion $inscripcion): JsonResponse
    {
        $request->validate([
            'calificaciones' => 'required|array',
            'calificaciones.*.unidad_id' => 'required|integer|exists:unidades,id',
            'calificaciones.*.valor_calificacion' => 'required|numeric|min:0|max:100',
        ]);

        foreach ($request->calificaciones as $calificacionData) {
            Calificacion::updateOrCreate(
                [
                    'inscripcion_id' => $inscripcion->id,
                    'unidad_id' => $calificacionData['unidad_id'],
                ],
                [
                    'valor_calificacion' => $calificacionData['valor_calificacion'],
                ]
            );
        }

        // Calculate final grade as average of unit grades
        $calificacionFinal = collect($request->calificaciones)
            ->avg('valor_calificacion');

        $inscripcion->update([
            'calificacion_final' => round($calificacionFinal, 2),
        ]);

        $inscripcion->load('calificaciones.unidad');

        return response()->json($inscripcion);
    }
}
