<?php

namespace Database\Factories;

use App\Models\Materia;
use Illuminate\Database\Eloquent\Factories\Factory;

class MateriaFactory extends Factory
{
    protected $model = Materia::class;

    private static $materias = [
        ['nombre' => 'Cálculo Diferencial', 'codigo' => 'MAT-1001', 'creditos' => 5],
        ['nombre' => 'Cálculo Integral', 'codigo' => 'MAT-1002', 'creditos' => 5],
        ['nombre' => 'Álgebra Lineal', 'codigo' => 'MAT-1003', 'creditos' => 5],
        ['nombre' => 'Programación Básica', 'codigo' => 'ISC-1001', 'creditos' => 5],
        ['nombre' => 'Programación Orientada a Objetos', 'codigo' => 'ISC-1002', 'creditos' => 5],
        ['nombre' => 'Estructuras de Datos', 'codigo' => 'ISC-1003', 'creditos' => 5],
        ['nombre' => 'Base de Datos', 'codigo' => 'ISC-2001', 'creditos' => 4],
        ['nombre' => 'Desarrollo Web', 'codigo' => 'ISC-2002', 'creditos' => 4],
        ['nombre' => 'Ingeniería de Software', 'codigo' => 'ISC-3001', 'creditos' => 4],
        ['nombre' => 'Sistemas Operativos', 'codigo' => 'ISC-3002', 'creditos' => 4],
        ['nombre' => 'Redes de Computadoras', 'codigo' => 'ISC-3003', 'creditos' => 4],
        ['nombre' => 'Inteligencia Artificial', 'codigo' => 'ISC-4001', 'creditos' => 4],
        ['nombre' => 'Física I', 'codigo' => 'FIS-1001', 'creditos' => 5],
        ['nombre' => 'Física II', 'codigo' => 'FIS-1002', 'creditos' => 5],
        ['nombre' => 'Química', 'codigo' => 'QUI-1001', 'creditos' => 4],
        ['nombre' => 'Fundamentos de Investigación', 'codigo' => 'GEN-1001', 'creditos' => 4],
        ['nombre' => 'Taller de Ética', 'codigo' => 'GEN-1002', 'creditos' => 3],
        ['nombre' => 'Desarrollo Sustentable', 'codigo' => 'GEN-2001', 'creditos' => 3],
    ];

    private static $index = 0;

    public function definition(): array
    {
        if (self::$index < count(self::$materias)) {
            $materia = self::$materias[self::$index];
            self::$index++;
            return [
                'nombre' => $materia['nombre'],
                'codigo_materia' => $materia['codigo'],
                'creditos' => $materia['creditos'],
            ];
        }

        return [
            'nombre' => $this->faker->words(3, true),
            'codigo_materia' => strtoupper($this->faker->bothify('???-####')),
            'creditos' => $this->faker->numberBetween(3, 6),
        ];
    }
}
