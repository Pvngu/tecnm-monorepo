<?php

namespace App\Http\Controllers;

use App\Models\AnalisisIshikawa;
use App\Models\Grupo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AnalisisIshikawaController extends Controller
{
    /**
     * Guardar o actualizar un análisis de Ishikawa
     */
    public function save(Request $request, Grupo $grupo): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tasa_reprobacion' => 'required|numeric|min:0|max:100',
            'observaciones' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // Buscar si ya existe un análisis para este grupo del usuario actual
        $analisis = AnalisisIshikawa::where('grupo_id', $grupo->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($analisis) {
            // Actualizar existente
            $analisis->update([
                'tasa_reprobacion' => $request->tasa_reprobacion,
                'observaciones' => $request->observaciones,
            ]);
        } else {
            // Crear nuevo
            $analisis = AnalisisIshikawa::create([
                'grupo_id' => $grupo->id,
                'user_id' => Auth::id(),
                'tasa_reprobacion' => $request->tasa_reprobacion,
                'observaciones' => $request->observaciones,
            ]);
        }

        return response()->json([
            'message' => 'Análisis guardado exitosamente',
            'data' => $analisis
        ], 200);
    }

    /**
     * Obtener el último análisis guardado de un grupo
     */
    public function getLatest(Grupo $grupo): JsonResponse
    {
        $analisis = AnalisisIshikawa::where('grupo_id', $grupo->id)
            ->where('user_id', Auth::id())
            ->latest()
            ->first();

        if (!$analisis) {
            return response()->json([
                'message' => 'No se encontró análisis guardado',
                'data' => null
            ], 404);
        }

        return response()->json([
            'data' => $analisis
        ], 200);
    }

    /**
     * Listar todos los análisis de un grupo
     */
    public function listByGrupo(Grupo $grupo): JsonResponse
    {
        $analisis = AnalisisIshikawa::where('grupo_id', $grupo->id)
            ->with(['user:id,name,email'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $analisis
        ], 200);
    }

    /**
     * Eliminar un análisis
     */
    public function delete(AnalisisIshikawa $analisis): JsonResponse
    {
        // Verificar que el usuario sea el dueño del análisis
        if ($analisis->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar este análisis'
            ], 403);
        }

        $analisis->delete();

        return response()->json([
            'message' => 'Análisis eliminado exitosamente'
        ], 200);
    }
}
