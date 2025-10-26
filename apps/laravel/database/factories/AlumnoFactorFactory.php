<?php

namespace Database\Factories;

use App\Models\AlumnoFactor;
use App\Models\FactorRiesgo;
use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Factories\Factory;

class AlumnoFactorFactory extends Factory
{
    protected $model = AlumnoFactor::class;

    public function definition(): array
    {
        return [
            'inscripcion_id' => Inscripcion::factory(),
            'factor_id' => FactorRiesgo::factory(),
            'fecha_registro' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'observaciones' => $this->faker->optional(0.7)->sentence(10),
        ];
    }
}
