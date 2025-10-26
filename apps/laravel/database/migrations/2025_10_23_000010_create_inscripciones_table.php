<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_id')->constrained('alumnos')->cascadeOnDelete();
            $table->foreignId('grupo_id')->constrained('grupos')->restrictOnDelete();
            $table->decimal('calificacion_final', 5, 2)->nullable();
            $table->timestamps();

            $table->unique(['alumno_id', 'grupo_id']);
            $table->index('alumno_id', 'idx_inscripciones_alumno_id');
            $table->index('grupo_id', 'idx_inscripciones_grupo_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscripciones');
    }
};
