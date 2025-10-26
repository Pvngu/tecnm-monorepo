<?php

namespace Database\Factories;

use App\Models\Alumno;
use App\Models\Grupo;
use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Factories\Factory;

class InscripcionFactory extends Factory
{
    protected $model = Inscripcion::class;

    public function definition(): array
    {
        return [
            'alumno_id' => Alumno::factory(),
            'grupo_id' => Grupo::factory(),
            'calificacion_final' => $this->faker->optional(0.7)->randomFloat(2, 60, 100),
        ];
    }

    public function withCalificacion(): static
    {
        return $this->state(fn (array $attributes) => [
            'calificacion_final' => $this->faker->randomFloat(2, 60, 100),
        ]);
    }

    public function sinCalificacion(): static
    {
        return $this->state(fn (array $attributes) => [
            'calificacion_final' => null,
        ]);
    }
}
