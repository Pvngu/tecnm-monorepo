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

        // Distribución realista de estatus:
        // 70% activos, 15% baja temporal, 10% baja definitiva, 5% egresados
        $rand = $this->faker->numberBetween(1, 100);
        if ($rand <= 70) {
            $estatus = 'activo';
        } elseif ($rand <= 85) {
            $estatus = 'baja_temporal';
        } elseif ($rand <= 95) {
            $estatus = 'baja_definitiva';
        } else {
            $estatus = 'egresado';
        }

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
            'estatus_alumno' => $estatus,
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
