<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscripcion_id')->constrained('inscripciones')->cascadeOnDelete();
            $table->foreignId('unidad_id')->constrained('unidades')->restrictOnDelete();
            $table->decimal('valor_calificacion', 5, 2);
            $table->timestamps();

            $table->unique(['inscripcion_id', 'unidad_id']);
            $table->index('inscripcion_id', 'idx_calificaciones_inscripcion_id');
            $table->index('unidad_id', 'idx_calificaciones_unidad_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calificaciones');
    }
};
