<?php

namespace Database\Factories;

use App\Models\Alumno;
use App\Models\Carrera;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class AlumnoFactory extends Factory
{
    protected $model = Alumno::class;

    public function definition(): array
    {
        $year = $this->faker->numberBetween(20, 25);
        $sequence = $this->faker->unique()->numberBetween(1000, 9999);

        return [
            'usuario_id' => null,
            'carrera_id' => Carrera::factory(),
            'matricula' => "{$year}25{$sequence}",
            'nombre' => $this->faker->firstName(),
            'apellido_paterno' => $this->faker->lastName(),
            'apellido_materno' => $this->faker->lastName(),
            'semestre' => $this->faker->numberBetween(1, 9),
            'genero' => $this->faker->randomElement(['masculino', 'femenino', 'otro']),
            'modalidad' => $this->faker->randomElement(['presencial', 'virtual', 'híbrida']),
        ];
    }

    public function withUsuario(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'usuario_id' => Usuario::factory()->alumno(),
            ];
        });
    }
}
