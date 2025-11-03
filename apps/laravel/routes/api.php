<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PeriodoController;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\UnidadController;
use App\Http\Controllers\FactorRiesgoController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\CalificacionController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\AlumnoFactorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalisisIshikawaController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

//create group for middleware auth:sanctum
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('dashboard/analytics', [DashboardController::class, 'getAnalytics']);
    Route::apiResource('periodos', PeriodoController::class);
    Route::apiResource('carreras', CarreraController::class);
    Route::apiResource('profesores', ProfesorController::class);
    Route::post('alumnos/import', [AlumnoController::class, 'import']);
    Route::apiResource('alumnos', AlumnoController::class);
    Route::apiResource('materias', MateriaController::class);
    Route::apiResource('unidades', UnidadController::class);
    Route::apiResource('factores-riesgo', FactorRiesgoController::class);
    Route::apiResource('grupos', GrupoController::class);
    Route::get('grupos/{grupo}/factores-pareto', [GrupoController::class, 'getFactoresPareto']);
    Route::get('grupos/{grupo}/ishikawa-data', [GrupoController::class, 'getIshikawaData']);
    Route::get('grupos/{grupo}/scatter-faltas', [GrupoController::class, 'getScatterPlotFaltas']);
    
    // Rutas para Análisis de Ishikawa
    Route::post('grupos/{grupo}/ishikawa/save', [AnalisisIshikawaController::class, 'save']);
    Route::get('grupos/{grupo}/ishikawa/latest', [AnalisisIshikawaController::class, 'getLatest']);
    Route::get('grupos/{grupo}/ishikawa/list', [AnalisisIshikawaController::class, 'listByGrupo']);
    Route::delete('analisis-ishikawa/{analisis}', [AnalisisIshikawaController::class, 'delete']);
    
    Route::apiResource('inscripciones', InscripcionController::class);
    Route::post('inscripciones/{inscripcion}/calificaciones-bulk', [CalificacionController::class, 'storeBulk']);
    Route::apiResource('calificaciones', CalificacionController::class);
    Route::apiResource('asistencias', AsistenciaController::class);
    Route::apiResource('alumnos-factores', AlumnoFactorController::class);
    Route::put('usuarios/{usuario}', [UsuarioController::class, 'update']);
    Route::get('activity-logs', [App\Http\Controllers\ActivityLogController::class, 'index']);
    
    // Rutas para Reportes
    Route::get('reportes/summary', [ReporteController::class, 'getSummaryReport']);
    
    // Rutas para Roles y Permisos
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
    Route::apiResource('users', UserController::class);
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole']);
    Route::post('users/{user}/remove-role', [UserController::class, 'removeRole']);
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});