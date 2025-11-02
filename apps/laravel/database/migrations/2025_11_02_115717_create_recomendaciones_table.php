<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recomendaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('factor_riesgo_id')
                  ->constrained('factores_riesgo')
                  ->onDelete('cascade');
            $table->string('titulo');
            $table->text('descripcion');
            $table->enum('nivel', ['institucional', 'docente', 'alumno'])
                  ->default('docente');
            $table->timestamps();
            
            // Un factor puede tener múltiples recomendaciones
            $table->unique(['factor_riesgo_id', 'titulo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recomendaciones');
    }
};
