<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsuarioRequest;
use App\Http\Traits\HasPagination;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;

class UsuarioController extends Controller
{
    use HasPagination;

    public function index(): JsonResponse
    {
        $usuarios = QueryBuilder::for(Usuario::class)
            ->allowedFilters(['email', 'rol'])
            ->allowedSorts(['email', 'rol', 'created_at'])
            ->allowedIncludes(['profesor', 'alumno'])
            ->paginate($this->getPageSize());

        return response()->json($usuarios);
    }

    public function store(UsuarioRequest $request): JsonResponse
    {
        $usuario = Usuario::create($request->validated());
        return response()->json($usuario, 201);
    }

    public function show(Usuario $usuario): JsonResponse
    {
        return response()->json($usuario);
    }

    public function update(UsuarioRequest $request, Usuario $usuario): JsonResponse
    {
        $usuario->update($request->validated());
        return response()->json($usuario);
    }

    public function destroy(Usuario $usuario): JsonResponse
    {
        $usuario->delete();
        return response()->json(null, 204);
    }
}
