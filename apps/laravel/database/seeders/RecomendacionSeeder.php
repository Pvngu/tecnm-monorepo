<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FactorRiesgo;
use App\Models\Recomendacion;

class RecomendacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener factores de riesgo existentes
        $factorInasistencias = FactorRiesgo::where('nombre', 'Inasistencias')->first();
        $factorBajoRendimiento = FactorRiesgo::where('nombre', 'Bajo Rendimiento Académico')->first();
        $factorProblemasPersonales = FactorRiesgo::where('nombre', 'Problemas Personales')->first();
        $factorFaltaMotivacion = FactorRiesgo::where('nombre', 'Falta de Motivación')->first();
        $factorDificultadMaterias = FactorRiesgo::where('nombre', 'Dificultad con Materias Específicas')->first();

        // Recomendaciones para Inasistencias
        if ($factorInasistencias) {
            Recomendacion::create([
                'factor_riesgo_id' => $factorInasistencias->id,
                'titulo' => 'Implementar Sistema de Alerta Temprana',
                'descripcion' => 'Contactar al alumno después de la 2da falta consecutiva para identificar la causa raíz y ofrecer apoyo inmediato.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorInasistencias->id,
                'titulo' => 'Establecer Política de Asistencia Clara',
                'descripcion' => 'Comunicar desde el inicio del semestre las políticas de asistencia y sus consecuencias, así como los canales de justificación.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorInasistencias->id,
                'titulo' => 'Fomentar el Compromiso Personal',
                'descripcion' => 'Establecer un contrato de aprendizaje con el alumno donde se comprometa a mejorar su asistencia y se establezcan objetivos claros.',
                'nivel' => 'alumno'
            ]);
        }

        // Recomendaciones para Bajo Rendimiento Académico
        if ($factorBajoRendimiento) {
            Recomendacion::create([
                'factor_riesgo_id' => $factorBajoRendimiento->id,
                'titulo' => 'Programa de Tutorías Académicas',
                'descripcion' => 'Asignar tutores académicos especializados que brinden seguimiento personalizado a estudiantes con bajo rendimiento.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorBajoRendimiento->id,
                'titulo' => 'Evaluación Continua y Retroalimentación',
                'descripcion' => 'Implementar evaluaciones formativas frecuentes que permitan identificar áreas de mejora antes de las evaluaciones sumativas.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorBajoRendimiento->id,
                'titulo' => 'Técnicas de Estudio Efectivas',
                'descripcion' => 'Capacitar al alumno en técnicas de estudio, organización del tiempo y métodos de aprendizaje activo.',
                'nivel' => 'alumno'
            ]);
        }

        // Recomendaciones para Problemas Personales
        if ($factorProblemasPersonales) {
            Recomendacion::create([
                'factor_riesgo_id' => $factorProblemasPersonales->id,
                'titulo' => 'Servicio de Apoyo Psicológico',
                'descripcion' => 'Ofrecer servicios de orientación psicológica gratuitos y confidenciales para estudiantes con problemas personales o emocionales.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorProblemasPersonales->id,
                'titulo' => 'Flexibilidad en Plazos de Entrega',
                'descripcion' => 'Considerar extensiones de plazos o trabajos alternativos para estudiantes que atraviesan situaciones personales difíciles.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorProblemasPersonales->id,
                'titulo' => 'Red de Apoyo entre Pares',
                'descripcion' => 'Fomentar grupos de apoyo entre estudiantes donde puedan compartir experiencias y estrategias de afrontamiento.',
                'nivel' => 'alumno'
            ]);
        }

        // Recomendaciones para Falta de Motivación
        if ($factorFaltaMotivacion) {
            Recomendacion::create([
                'factor_riesgo_id' => $factorFaltaMotivacion->id,
                'titulo' => 'Proyectos Aplicados a Casos Reales',
                'descripcion' => 'Diseñar proyectos que resuelvan problemas reales de la industria o comunidad, mostrando la relevancia práctica de la materia.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorFaltaMotivacion->id,
                'titulo' => 'Vinculación con Empresas',
                'descripcion' => 'Organizar visitas a empresas, charlas con egresados exitosos y ferias de empleo para mostrar oportunidades profesionales.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorFaltaMotivacion->id,
                'titulo' => 'Establecimiento de Metas Personales',
                'descripcion' => 'Ayudar al alumno a definir objetivos profesionales claros y crear un plan de acción para alcanzarlos.',
                'nivel' => 'alumno'
            ]);
        }

        // Recomendaciones para Dificultad con Materias Específicas
        if ($factorDificultadMaterias) {
            Recomendacion::create([
                'factor_riesgo_id' => $factorDificultadMaterias->id,
                'titulo' => 'Asesorías Especializadas',
                'descripcion' => 'Ofrecer asesorías grupales e individuales para materias identificadas como difíciles, especialmente matemáticas y programación.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorDificultadMaterias->id,
                'titulo' => 'Material de Apoyo Adicional',
                'descripcion' => 'Proporcionar recursos complementarios como videos, ejercicios resueltos, plataformas interactivas y bibliografía adicional.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $factorDificultadMaterias->id,
                'titulo' => 'Grupos de Estudio',
                'descripcion' => 'Formar grupos de estudio con compañeros para resolver dudas colaborativamente y reforzar conceptos difíciles.',
                'nivel' => 'alumno'
            ]);
        }
    }
}
