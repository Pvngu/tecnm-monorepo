<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Grupo;
use App\Models\Materia;
use App\Models\Periodo;
use App\Models\Profesor;
use Illuminate\Database\Eloquent\Factories\Factory;

class GrupoFactory extends Factory
{
    protected $model = Grupo::class;

    public function definition(): array
    {
        $dias = $this->faker->randomElements(['L', 'M', 'W', 'J', 'V'], $this->faker->numberBetween(2, 3));
        $hora = $this->faker->numberBetween(7, 18);
        $horario = implode('-', $dias) . ' ' . sprintf('%02d:00-%02d:00', $hora, $hora + 2);

        return [
            'materia_id' => Materia::factory(),
            'profesor_id' => Profesor::factory(),
            'periodo_id' => Periodo::factory(),
            'carrera_id' => Carrera::factory(),
            'horario' => $horario,
            'aula' => $this->faker->randomElement(['A', 'B', 'C', 'D']) . '-' . $this->faker->numberBetween(101, 405),
        ];
    }
}
