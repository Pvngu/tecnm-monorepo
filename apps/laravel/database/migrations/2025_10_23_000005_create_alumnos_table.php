<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumnos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->nullable()->unique()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('carrera_id')->constrained('carreras')->restrictOnDelete();
            $table->string('matricula', 50)->unique();
            $table->string('nombre', 100);
            $table->string('apellido_paterno', 100);
            $table->string('apellido_materno', 100)->nullable();
            $table->integer('semestre');
            $table->enum('genero', ['masculino', 'femenino', 'otro'])->nullable();
            $table->enum('modalidad', ['presencial', 'virtual', 'híbrida'])->nullable();
            $table->timestamps();

            $table->index('carrera_id', 'idx_alumnos_carrera_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumnos');
    }
};
