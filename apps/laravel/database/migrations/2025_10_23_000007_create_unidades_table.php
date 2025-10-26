<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unidades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materia_id')->constrained('materias')->cascadeOnDelete();
            $table->integer('numero_unidad');
            $table->string('nombre_unidad', 255)->nullable();
            $table->timestamps();

            $table->unique(['materia_id', 'numero_unidad']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unidades');
    }
};
