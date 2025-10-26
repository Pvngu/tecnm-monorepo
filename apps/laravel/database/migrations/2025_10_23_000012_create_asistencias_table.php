<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscripcion_id')->constrained('inscripciones')->cascadeOnDelete();
            $table->date('fecha');
            $table->enum('estatus', ['presente', 'ausente', 'retardo']);
            $table->timestamps();

            $table->unique(['inscripcion_id', 'fecha']);
            $table->index('inscripcion_id', 'idx_asistencias_inscripcion_id');
            $table->index('fecha', 'idx_asistencias_fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
