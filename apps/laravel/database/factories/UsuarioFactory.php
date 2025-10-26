<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'password_hash' => Hash::make('password123'),
            'rol' => $this->faker->randomElement(['admin', 'profesor', 'alumno']),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'admin',
        ]);
    }

    public function profesor(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'profesor',
        ]);
    }

    public function alumno(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'alumno',
        ]);
    }
}
