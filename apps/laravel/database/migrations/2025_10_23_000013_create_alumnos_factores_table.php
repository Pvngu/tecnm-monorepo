<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumnos_factores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscripcion_id')->constrained('inscripciones')->cascadeOnDelete();
            $table->foreignId('factor_id')->constrained('factores_riesgo')->restrictOnDelete();
            $table->timestampTz('fecha_registro')->useCurrent();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['inscripcion_id', 'factor_id']);
            $table->index('inscripcion_id', 'idx_alumnos_factores_inscripcion_id');
            $table->index('factor_id', 'idx_alumnos_factores_factor_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumnos_factores');
    }
};
