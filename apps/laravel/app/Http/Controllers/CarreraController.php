<?php

namespace App\Http\Controllers;

use App\Http\Requests\CarreraRequest;
use App\Http\Traits\HasModelCache;
use App\Http\Traits\HasPagination;
use App\Models\Carrera;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class CarreraController extends Controller
{
    use HasPagination, HasModelCache;

    /**
     * Get the model class for caching.
     */
    protected function getModelClass(): string
    {
        return Carrera::class;
    }

    public function index(): JsonResponse
    {
        // Generate a unique cache key based on query parameters
        $cacheKey = 'index:' . md5(request()->getQueryString() ?? 'default');

        $carreras = $this->cacheRemember($cacheKey, function () {
            return QueryBuilder::for(Carrera::class)
                ->allowedFilters(['nombre', 'clave'])
                ->allowedSorts(['nombre', 'clave', 'created_at'])
                ->allowedIncludes(['alumnos', 'grupos'])
                ->paginate($this->getPageSize());
        });

        return response()->json($carreras);
    }

    public function store(CarreraRequest $request): JsonResponse
    {
        $carrera = Carrera::create($request->validated());
        
        // Clear cache after creating a new record
        $this->clearModelCache();
        
        return response()->json($carrera, 201);
    }

    public function show(Carrera $carrera): JsonResponse
    {
        // Cache individual carrera
        $cacheKey = 'show:' . $carrera->id;

        $cachedCarrera = $this->cacheRemember($cacheKey, function () use ($carrera) {
            return $carrera;
        });

        return response()->json($cachedCarrera);
    }

    public function update(CarreraRequest $request, Carrera $carrera): JsonResponse
    {
        $carrera->update($request->validated());
        
        // Clear cache after updating
        $this->clearModelCache();
        
        return response()->json($carrera);
    }

    public function destroy(Carrera $carrera): JsonResponse
    {
        $carrera->delete();
        
        // Clear cache after deleting
        $this->clearModelCache();
        
        return response()->json(null, 204);
    }
}
