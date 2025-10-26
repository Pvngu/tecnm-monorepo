<?php

namespace Database\Factories;

use App\Models\Asistencia;
use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Factories\Factory;

class AsistenciaFactory extends Factory
{
    protected $model = Asistencia::class;

    public function definition(): array
    {
        return [
            'inscripcion_id' => Inscripcion::factory(),
            'fecha' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'estatus' => $this->faker->randomElement(['presente', 'ausente', 'retardo']),
        ];
    }

    public function presente(): static
    {
        return $this->state(fn (array $attributes) => [
            'estatus' => 'presente',
        ]);
    }

    public function ausente(): static
    {
        return $this->state(fn (array $attributes) => [
            'estatus' => 'ausente',
        ]);
    }

    public function retardo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estatus' => 'retardo',
        ]);
    }
}
