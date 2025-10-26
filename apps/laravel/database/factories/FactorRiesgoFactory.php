<?php

namespace Database\Factories;

use App\Models\FactorRiesgo;
use Illuminate\Database\Eloquent\Factories\Factory;

class FactorRiesgoFactory extends Factory
{
    protected $model = FactorRiesgo::class;

    private static $factores = [
        ['nombre' => 'Bajo rendimiento académico', 'categoria' => 'académicos'],
        ['nombre' => 'Dificultad en materias de matemáticas', 'categoria' => 'académicos'],
        ['nombre' => 'Falta de hábitos de estudio', 'categoria' => 'académicos'],
        ['nombre' => 'Ausentismo frecuente', 'categoria' => 'académicos'],
        ['nombre' => 'Problemas familiares', 'categoria' => 'psicosociales'],
        ['nombre' => 'Depresión o ansiedad', 'categoria' => 'psicosociales'],
        ['nombre' => 'Baja autoestima', 'categoria' => 'psicosociales'],
        ['nombre' => 'Problemas de adaptación', 'categoria' => 'psicosociales'],
        ['nombre' => 'Dificultades económicas', 'categoria' => 'económicos'],
        ['nombre' => 'Necesidad de trabajo', 'categoria' => 'económicos'],
        ['nombre' => 'Falta de recursos para materiales', 'categoria' => 'económicos'],
        ['nombre' => 'Falta de becas o apoyos', 'categoria' => 'económicos'],
        ['nombre' => 'Inadecuada orientación vocacional', 'categoria' => 'institucionales'],
        ['nombre' => 'Falta de tutorías académicas', 'categoria' => 'institucionales'],
        ['nombre' => 'Instalaciones inadecuadas', 'categoria' => 'institucionales'],
        ['nombre' => 'Falta de recursos bibliográficos', 'categoria' => 'institucionales'],
        ['nombre' => 'Falta de acceso a internet', 'categoria' => 'tecnológicos'],
        ['nombre' => 'Sin equipo de cómputo', 'categoria' => 'tecnológicos'],
        ['nombre' => 'Desconocimiento de herramientas digitales', 'categoria' => 'tecnológicos'],
        ['nombre' => 'Distancia del domicilio', 'categoria' => 'contextuales'],
        ['nombre' => 'Problemas de transporte', 'categoria' => 'contextuales'],
        ['nombre' => 'Inseguridad en la zona', 'categoria' => 'contextuales'],
    ];

    private static $index = 0;

    public function definition(): array
    {
        if (self::$index < count(self::$factores)) {
            $factor = self::$factores[self::$index];
            self::$index++;
            return $factor;
        }

        return [
            'nombre' => $this->faker->sentence(4),
            'categoria' => $this->faker->randomElement(['académicos', 'psicosociales', 'económicos', 'institucionales', 'tecnológicos', 'contextuales']),
        ];
    }
}
