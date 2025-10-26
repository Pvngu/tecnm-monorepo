<?php

namespace Database\Factories;

use App\Models\Profesor;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfesorFactory extends Factory
{
    protected $model = Profesor::class;

    public function definition(): array
    {
        return [
            'usuario_id' => null,
            'nombre' => $this->faker->firstName(),
            'apellido_paterno' => $this->faker->lastName(),
            'apellido_materno' => $this->faker->lastName(),
            'rfc' => strtoupper($this->faker->bothify('????######???')),
        ];
    }

    public function withUsuario(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'usuario_id' => Usuario::factory()->profesor(),
            ];
        });
    }
}
