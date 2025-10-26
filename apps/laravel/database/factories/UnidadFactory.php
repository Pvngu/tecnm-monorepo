<?php

namespace Database\Factories;

use App\Models\Materia;
use App\Models\Unidad;
use Illuminate\Database\Eloquent\Factories\Factory;

class UnidadFactory extends Factory
{
    protected $model = Unidad::class;

    public function definition(): array
    {
        return [
            'materia_id' => Materia::factory(),
            'numero_unidad' => $this->faker->numberBetween(1, 6),
            'nombre_unidad' => 'Unidad ' . $this->faker->numberBetween(1, 6) . ': ' . $this->faker->words(3, true),
        ];
    }
}
