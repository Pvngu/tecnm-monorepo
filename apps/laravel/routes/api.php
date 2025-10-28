<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PeriodoController;
use App\Http\Controllers\CarreraController;
// use App\Http\Controllers\UserController;
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

Route::apiResource('periodos', PeriodoController::class);
Route::apiResource('carreras', CarreraController::class);
Route::apiResource('profesores', ProfesorController::class);
Route::apiResource('alumnos', AlumnoController::class);
Route::apiResource('materias', MateriaController::class);
Route::apiResource('unidades', UnidadController::class);
Route::apiResource('factores-riesgo', FactorRiesgoController::class);
Route::apiResource('grupos', GrupoController::class);
Route::apiResource('inscripciones', InscripcionController::class);
Route::apiResource('calificaciones', CalificacionController::class);
Route::apiResource('asistencias', AsistenciaController::class);
Route::apiResource('alumnos-factores', AlumnoFactorController::class);
Route::get('activity-logs', [App\Http\Controllers\ActivityLogController::class, 'index']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});