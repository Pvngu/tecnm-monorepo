<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grupos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materia_id')->constrained('materias')->restrictOnDelete();
            $table->foreignId('profesor_id')->constrained('profesores')->restrictOnDelete();
            $table->foreignId('periodo_id')->constrained('periodos')->restrictOnDelete();
            $table->foreignId('carrera_id')->nullable()->constrained('carreras')->restrictOnDelete();
            $table->text('horario')->nullable();
            $table->string('aula', 50)->nullable();
            $table->timestamps();

            $table->index('materia_id', 'idx_grupos_materia_id');
            $table->index('profesor_id', 'idx_grupos_profesor_id');
            $table->index('periodo_id', 'idx_grupos_periodo_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grupos');
    }
};
