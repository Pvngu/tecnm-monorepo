<?php

namespace Database\Factories;

use App\Models\Calificacion;
use App\Models\Inscripcion;
use App\Models\Unidad;
use Illuminate\Database\Eloquent\Factories\Factory;

class CalificacionFactory extends Factory
{
    protected $model = Calificacion::class;

    public function definition(): array
    {
        return [
            'inscripcion_id' => Inscripcion::factory(),
            'unidad_id' => Unidad::factory(),
            'valor_calificacion' => $this->faker->randomFloat(2, 50, 100),
        ];
    }

    public function aprobatoria(): static
    {
        return $this->state(fn (array $attributes) => [
            'valor_calificacion' => $this->faker->randomFloat(2, 70, 100),
        ]);
    }

    public function reprobatoria(): static
    {
        return $this->state(fn (array $attributes) => [
            'valor_calificacion' => $this->faker->randomFloat(2, 0, 69),
        ]);
    }
}
