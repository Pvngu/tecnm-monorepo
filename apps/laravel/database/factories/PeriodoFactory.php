<?php

namespace Database\Factories;

use App\Models\Periodo;
use Illuminate\Database\Eloquent\Factories\Factory;

class PeriodoFactory extends Factory
{
    protected $model = Periodo::class;

    public function definition(): array
    {
        $year = $this->faker->numberBetween(2024, 2026);
        $semestre = $this->faker->randomElement(['Otoño', 'Primavera', 'Verano']);
        
        $fechas = [
            'Otoño' => ['08-15', '12-15'],
            'Primavera' => ['01-15', '05-15'],
            'Verano' => ['06-01', '07-31'],
        ];

        return [
            'nombre' => "{$semestre} {$year}",
            'fecha_inicio' => "{$year}-{$fechas[$semestre][0]}",
            'fecha_fin' => "{$year}-{$fechas[$semestre][1]}",
            'activo' => $this->faker->boolean(20),
        ];
    }

    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => true,
        ]);
    }
}
