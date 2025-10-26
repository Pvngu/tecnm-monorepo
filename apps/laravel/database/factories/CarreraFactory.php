<?php

namespace Database\Factories;

use App\Models\Carrera;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarreraFactory extends Factory
{
    protected $model = Carrera::class;

    private static $carreras = [
        ['nombre' => 'Ingeniería en Sistemas Computacionales', 'clave' => 'ISC'],
        ['nombre' => 'Ingeniería Industrial', 'clave' => 'IND'],
        ['nombre' => 'Ingeniería Electrónica', 'clave' => 'IEL'],
        ['nombre' => 'Ingeniería Mecatrónica', 'clave' => 'IME'],
        ['nombre' => 'Ingeniería Civil', 'clave' => 'ICI'],
        ['nombre' => 'Ingeniería en Gestión Empresarial', 'clave' => 'IGE'],
        ['nombre' => 'Licenciatura en Administración', 'clave' => 'LAD'],
        ['nombre' => 'Contador Público', 'clave' => 'CPB'],
    ];

    private static $index = 0;

    public function definition(): array
    {
        if (self::$index < count(self::$carreras)) {
            $carrera = self::$carreras[self::$index];
            self::$index++;
            return $carrera;
        }

        return [
            'nombre' => 'Ingeniería en ' . $this->faker->words(2, true),
            'clave' => strtoupper($this->faker->lexify('???')),
        ];
    }
}
