<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlumnoRequest;
use App\Http\Traits\HasPagination;
use App\Models\Alumno;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AlumnoController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $alumnos = QueryBuilder::for(Alumno::class)
            ->allowedFilters([
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'matricula',
                'semestre',
                'genero',
                'modalidad',
                AllowedFilter::exact('carrera_id'),
                AllowedFilter::exact('usuario_id'),
            ])
            ->allowedSorts(['nombre', 'apellido_paterno', 'matricula', 'semestre', 'created_at'])
            ->allowedIncludes(['usuario', 'carrera', 'inscripciones'])
            ->paginate($this->getPageSize());

        return response()->json($alumnos);
    }

    public function store(AlumnoRequest $request): JsonResponse
    {
        $alumno = Alumno::create($request->validated());
        return response()->json($alumno, 201);
    }

    public function show(Alumno $alumno): JsonResponse
    {
        return response()->json($alumno);
    }

    public function update(AlumnoRequest $request, Alumno $alumno): JsonResponse
    {
        $alumno->update($request->validated());
        return response()->json($alumno);
    }

    public function destroy(Alumno $alumno): JsonResponse
    {
        $alumno->delete();
        return response()->json(null, 204);
    }
}
