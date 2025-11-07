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
    // Obtener factores de riesgo existentes usando los nombres proporcionados por el usuario
    $fBajoRendimiento = FactorRiesgo::where('nombre', 'Bajo rendimiento académico')->first();
    $fDificultadMatematicas = FactorRiesgo::where('nombre', 'Dificultad en materias de matemáticas')->first();
    $fFaltaHabitos = FactorRiesgo::where('nombre', 'Falta de hábitos de estudio')->first();
    $fAusentismo = FactorRiesgo::where('nombre', 'Ausentismo frecuente')->first();
    $fProblemasFamiliares = FactorRiesgo::where('nombre', 'Problemas familiares')->first();
    $fDepresionAnsiedad = FactorRiesgo::where('nombre', 'Depresión o ansiedad')->first();
    $fBajaAutoestima = FactorRiesgo::where('nombre', 'Baja autoestima')->first();
    $fProblemasAdaptacion = FactorRiesgo::where('nombre', 'Problemas de adaptación')->first();
    $fDificultadesEconomicas = FactorRiesgo::where('nombre', 'Dificultades económicas')->first();
    $fNecesidadTrabajo = FactorRiesgo::where('nombre', 'Necesidad de trabajo')->first();
    $fFaltaRecursosMateriales = FactorRiesgo::where('nombre', 'Falta de recursos para materiales')->first();
    $fFaltaBecas = FactorRiesgo::where('nombre', 'Falta de becas o apoyos')->first();
    $fOrientacionVocacional = FactorRiesgo::where('nombre', 'Inadecuada orientación vocacional')->first();
    $fFaltaTutorias = FactorRiesgo::where('nombre', 'Falta de tutorías académicas')->first();
    $fInstalacionesInadecuadas = FactorRiesgo::where('nombre', 'Instalaciones inadecuadas')->first();
    $fFaltaRecursosBibliograficos = FactorRiesgo::where('nombre', 'Falta de recursos bibliográficos')->first();
    $fFaltaInternet = FactorRiesgo::where('nombre', 'Falta de acceso a internet')->first();
    $fSinEquipo = FactorRiesgo::where('nombre', 'Sin equipo de cómputo')->first();
    $fDesconocimientoHerramientas = FactorRiesgo::where('nombre', 'Desconocimiento de herramientas digitales')->first();
    $fDistanciaDomicilio = FactorRiesgo::where('nombre', 'Distancia del domicilio')->first();
    $fProblemasTransporte = FactorRiesgo::where('nombre', 'Problemas de transporte')->first();
    $fInseguridad = FactorRiesgo::where('nombre', 'Inseguridad en la zona')->first();

        // Recomendaciones para Bajo rendimiento académico
        if ($fBajoRendimiento) {
            Recomendacion::create([
                'factor_riesgo_id' => $fBajoRendimiento->id,
                'titulo' => 'Programa de Tutorías Académicas',
                'descripcion' => 'Asignar tutores académicos para seguimiento personalizado y refuerzo en áreas críticas.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fBajoRendimiento->id,
                'titulo' => 'Evaluaciones Formativas Frecuentes',
                'descripcion' => 'Implementar pruebas cortas y retroalimentación para detectar dificultades antes de las evaluaciones finales.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Dificultad en materias de matemáticas
        if ($fDificultadMatematicas) {
            Recomendacion::create([
                'factor_riesgo_id' => $fDificultadMatematicas->id,
                'titulo' => 'Talleres de Matemáticas Prácticas',
                'descripcion' => 'Organizar talleres hands-on con ejercicios y soluciones guiadas para reforzar conceptos clave.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fDificultadMatematicas->id,
                'titulo' => 'Material Didáctico Específico',
                'descripcion' => 'Proveer guías, videos y problemas resueltos que expliquen paso a paso los temas difíciles.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Falta de hábitos de estudio
        if ($fFaltaHabitos) {
            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaHabitos->id,
                'titulo' => 'Capacitación en Técnicas de Estudio',
                'descripcion' => 'Ofrecer cursos sobre organización del tiempo, toma de apuntes y métodos de estudio activos.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaHabitos->id,
                'titulo' => 'Planes de Estudio Personalizados',
                'descripcion' => 'Diseñar planes semanales con metas y seguimiento para ayudar al estudiante a crear hábitos sostenibles.',
                'nivel' => 'alumno'
            ]);
        }

        // Recomendaciones para Problemas familiares
        if ($fProblemasFamiliares) {
            Recomendacion::create([
                'factor_riesgo_id' => $fProblemasFamiliares->id,
                'titulo' => 'Atención Psicosocial Familiar',
                'descripcion' => 'Ofrecer orientación y coordinación con servicios sociales para apoyar al estudiante y su familia.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fProblemasFamiliares->id,
                'titulo' => 'Flexibilidad Académica Temporal',
                'descripcion' => 'Permitir ajustes en plazos y carga académica mientras se estabiliza la situación familiar.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Depresión o ansiedad
        if ($fDepresionAnsiedad) {
            Recomendacion::create([
                'factor_riesgo_id' => $fDepresionAnsiedad->id,
                'titulo' => 'Servicio de Salud Mental',
                'descripcion' => 'Derivar a servicios profesionales de psicología y psiquiatría y ofrecer sesiones de apoyo.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fDepresionAnsiedad->id,
                'titulo' => 'Programas de Manejo del Estrés',
                'descripcion' => 'Talleres y grupos de apoyo sobre manejo de ansiedad, mindfulness y técnicas de relajación.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Baja autoestima
        if ($fBajaAutoestima) {
            Recomendacion::create([
                'factor_riesgo_id' => $fBajaAutoestima->id,
                'titulo' => 'Talleres de Desarrollo Personal',
                'descripcion' => 'Sesiones para mejorar la autoconfianza, habilidades sociales y establecimiento de metas.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fBajaAutoestima->id,
                'titulo' => 'Mentoría entre Pares',
                'descripcion' => 'Programas donde estudiantes avanzados apoyen y den retroalimentación constructiva.',
                'nivel' => 'alumno'
            ]);
        }

        // Recomendaciones para Problemas de adaptación
        if ($fProblemasAdaptacion) {
            Recomendacion::create([
                'factor_riesgo_id' => $fProblemasAdaptacion->id,
                'titulo' => 'Programa de Inducción y Acompañamiento',
                'descripcion' => 'Actividades de bienvenida, tutorías de adaptación y seguimiento durante el primer semestre.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fProblemasAdaptacion->id,
                'titulo' => 'Grupos de Integración',
                'descripcion' => 'Crear grupos que faciliten la socialización y el apoyo mutuo entre nuevos estudiantes.',
                'nivel' => 'alumno'
            ]);
        }

        // Recomendaciones para Dificultades económicas
        if ($fDificultadesEconomicas) {
            Recomendacion::create([
                'factor_riesgo_id' => $fDificultadesEconomicas->id,
                'titulo' => 'Apoyos Económicos y Becas',
                'descripcion' => 'Informar y facilitar el acceso a fondos, becas y apoyos temporales para estudiantes en necesidad.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fDificultadesEconomicas->id,
                'titulo' => 'Ofertas de Trabajo Estudiantil',
                'descripcion' => 'Promover empleos a tiempo parcial dentro de la institución que se adapten al horario académico.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Necesidad de trabajo
        if ($fNecesidadTrabajo) {
            Recomendacion::create([
                'factor_riesgo_id' => $fNecesidadTrabajo->id,
                'titulo' => 'Bolsa de Trabajo Interna',
                'descripcion' => 'Crear una bolsa de trabajo con ofertas compatibles con estudiantes, priorizando horarios flexibles.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fNecesidadTrabajo->id,
                'titulo' => 'Asesoría para Conciliación Estudio-Trabajo',
                'descripcion' => 'Orientación para planificar horarios y optimizar carga académica sin sacrificar rendimiento.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Falta de recursos para materiales
        if ($fFaltaRecursosMateriales) {
            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaRecursosMateriales->id,
                'titulo' => 'Préstamo o Donación de Materiales',
                'descripcion' => 'Implementar programas de préstamo de libros y materiales o recibir donaciones gestionadas por la institución.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaRecursosMateriales->id,
                'titulo' => 'Recursos Digitales Gratuitos',
                'descripcion' => 'Proveer enlaces a recursos gratuitos, repositorios y material abierto que sustituyan materiales de pago.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Falta de becas o apoyos
        if ($fFaltaBecas) {
            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaBecas->id,
                'titulo' => 'Gestión Activa de Becas',
                'descripcion' => 'Crear un departamento que busque y gestione becas internas y externas para estudiantes vulnerables.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaBecas->id,
                'titulo' => 'Capacitación en Aplicación a Becas',
                'descripcion' => 'Talleres que ayuden a preparar solicitudes y documentos para aumentar las posibilidades de obtener apoyo.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Inadecuada orientación vocacional
        if ($fOrientacionVocacional) {
            Recomendacion::create([
                'factor_riesgo_id' => $fOrientacionVocacional->id,
                'titulo' => 'Servicios de Orientación Vocacional',
                'descripcion' => 'Brindar asesoría profesional para ayudar a los estudiantes a tomar decisiones informadas sobre su carrera.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fOrientacionVocacional->id,
                'titulo' => 'Charlas y Ferias Profesionales',
                'descripcion' => 'Organizar eventos con empresas y egresados para mostrar salidas profesionales y perfiles requeridos.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Falta de tutorías académicas
        if ($fFaltaTutorias) {
            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaTutorias->id,
                'titulo' => 'Establecer Programa de Tutorías',
                'descripcion' => 'Crear un programa formal de tutorías para acompañar a estudiantes con dificultades en asignaturas clave.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaTutorias->id,
                'titulo' => 'Capacitación a Tutores',
                'descripcion' => 'Formar a los tutores en técnicas pedagógicas y metodologías de seguimiento efectivo.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Instalaciones inadecuadas
        if ($fInstalacionesInadecuadas) {
            Recomendacion::create([
                'factor_riesgo_id' => $fInstalacionesInadecuadas->id,
                'titulo' => 'Mejoras en Infraestructura',
                'descripcion' => 'Plan de inversión para mejorar aulas, laboratorios y espacios de estudio.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fInstalacionesInadecuadas->id,
                'titulo' => 'Uso Eficiente de Espacios',
                'descripcion' => 'Optimizar el horario y el uso de espacios existentes para maximizar disponibilidad y condiciones.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Falta de recursos bibliográficos
        if ($fFaltaRecursosBibliograficos) {
            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaRecursosBibliograficos->id,
                'titulo' => 'Ampliación de Biblioteca y Recursos',
                'descripcion' => 'Adquirir o suscribir recursos digitales y físicos relevantes para el plan de estudios.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaRecursosBibliograficos->id,
                'titulo' => 'Acceso a Repositorios Académicos',
                'descripcion' => 'Gestionar acceso a repositorios y bases de datos científicas para estudiantes y docentes.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Falta de acceso a internet
        if ($fFaltaInternet) {
            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaInternet->id,
                'titulo' => 'Puntos de Acceso Wi-Fi',
                'descripcion' => 'Instalar o ampliar cobertura Wi-Fi en campus y áreas de estudio para asegurar conectividad.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fFaltaInternet->id,
                'titulo' => 'Apoyos para Conectividad',
                'descripcion' => 'Gestionar subsidios o convenios para paquetes de datos para estudiantes en situación vulnerable.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Sin equipo de cómputo
        if ($fSinEquipo) {
            Recomendacion::create([
                'factor_riesgo_id' => $fSinEquipo->id,
                'titulo' => 'Programa de Préstamo de Equipos',
                'descripcion' => 'Habilitar un programa de préstamo temporal de laptops y tablets para estudiantes que lo necesiten.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fSinEquipo->id,
                'titulo' => 'Laboratorios con Horarios Ampliados',
                'descripcion' => 'Mantener laboratorios abiertos en horarios extendidos para que los estudiantes puedan acceder a equipos.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Desconocimiento de herramientas digitales
        if ($fDesconocimientoHerramientas) {
            Recomendacion::create([
                'factor_riesgo_id' => $fDesconocimientoHerramientas->id,
                'titulo' => 'Capacitación en Herramientas Digitales',
                'descripcion' => 'Cursos básicos de ofimática, plataformas de aprendizaje y herramientas necesarias para las materias.',
                'nivel' => 'docente'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fDesconocimientoHerramientas->id,
                'titulo' => 'Guías y Tutoriales Paso a Paso',
                'descripcion' => 'Crear documentación y videos cortos que muestren cómo usar las herramientas más comunes.',
                'nivel' => 'institucional'
            ]);
        }

        // Recomendaciones para Distancia del domicilio
        if ($fDistanciaDomicilio) {
            Recomendacion::create([
                'factor_riesgo_id' => $fDistanciaDomicilio->id,
                'titulo' => 'Programas de Alojamiento Estudiantil',
                'descripcion' => 'Facilitar acceso a residencias o convenios con hospedaje cercano para estudiantes que viven lejos.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fDistanciaDomicilio->id,
                'titulo' => 'Clases Híbridas o Grabadas',
                'descripcion' => 'Ofrecer materiales grabados y modalidad híbrida para estudiantes que no puedan asistir diariamente.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Problemas de transporte
        if ($fProblemasTransporte) {
            Recomendacion::create([
                'factor_riesgo_id' => $fProblemasTransporte->id,
                'titulo' => 'Coordinación de Transporte Escolar',
                'descripcion' => 'Explorar rutas y convenios para transporte colectivo que faciliten la llegada de estudiantes.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fProblemasTransporte->id,
                'titulo' => 'Flexibilidad en Horarios',
                'descripcion' => 'Permitir arreglos de entrega y asistencia en casos puntuales por problemas de transporte.',
                'nivel' => 'docente'
            ]);
        }

        // Recomendaciones para Inseguridad en la zona
        if ($fInseguridad) {
            Recomendacion::create([
                'factor_riesgo_id' => $fInseguridad->id,
                'titulo' => 'Medidas de Seguridad y Acompañamiento',
                'descripcion' => 'Coordinar con autoridades locales y ofrecer rutas seguras o escoltas en casos críticos.',
                'nivel' => 'institucional'
            ]);

            Recomendacion::create([
                'factor_riesgo_id' => $fInseguridad->id,
                'titulo' => 'Apoyos para Estudios a Distancia',
                'descripcion' => 'Facilitar alternativas virtuales cuando la inseguridad impida la asistencia presencial.',
                'nivel' => 'institucional'
            ]);
        }
    }
}
