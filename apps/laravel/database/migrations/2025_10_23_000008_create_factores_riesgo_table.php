<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factores_riesgo', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255);
            $table->enum('categoria', ['académicos', 'psicosociales', 'económicos', 'institucionales', 'tecnológicos', 'contextuales']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factores_riesgo');
    }
};
