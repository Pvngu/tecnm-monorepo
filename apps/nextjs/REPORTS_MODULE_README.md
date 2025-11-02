# Módulo de Generación de Reportes Automáticos

## Descripción

El módulo de reportes automáticos permite a los administradores generar reportes bajo demanda que resumen indicadores clave de rendimiento académico y proporcionan recomendaciones específicas de mejora basadas en los factores de riesgo más frecuentes.

## Características

- **Generación de Reportes Personalizados**: Filtra por periodo y carrera (opcional)
- **Métricas Clave**: Promedio general, tasa de reprobación, total de alumnos y reprobados
- **Top 5 Factores de Riesgo**: Identifica los factores más frecuentes ordenados por relevancia
- **Recomendaciones Accionables**: Base de conocimientos con sugerencias específicas por factor
- **Niveles de Intervención**: Recomendaciones clasificadas por nivel (institucional, docente, alumno)
- **Optimizado para Impresión**: Diseño limpio que se adapta perfectamente al formato impreso

## Estructura del Backend (Laravel)

### 1. Migración: `recomendaciones`

**Archivo**: `database/migrations/2025_11_02_115717_create_recomendaciones_table.php`

```php
Schema::create('recomendaciones', function (Blueprint $table) {
    $table->id();
    $table->foreignId('factor_riesgo_id')
          ->constrained('factores_riesgo')
          ->onDelete('cascade');
    $table->string('titulo');
    $table->text('descripcion');
    $table->enum('nivel', ['institucional', 'docente', 'alumno'])
          ->default('docente');
    $table->timestamps();
    
    $table->unique(['factor_riesgo_id', 'titulo']);
});
```

### 2. Modelo: `Recomendacion`

**Archivo**: `app/Models/Recomendacion.php`

- **Relaciones**:
  - `belongsTo(FactorRiesgo::class)`: Cada recomendación pertenece a un factor de riesgo

### 3. Modelo Actualizado: `FactorRiesgo`

**Archivo**: `app/Models/FactorRiesgo.php`

- **Nueva Relación**:
  - `hasMany(Recomendacion::class)`: Un factor puede tener múltiples recomendaciones

### 4. Controlador: `ReporteController`

**Archivo**: `app/Http/Controllers/ReporteController.php`

**Endpoint**: `GET /api/reportes/summary`

**Parámetros**:
- `periodo_id` (requerido): ID del periodo a analizar
- `carrera_id` (opcional): ID de la carrera específica

**Respuesta JSON**:
```json
{
  "success": true,
  "metricas": {
    "promedio_general": 78.5,
    "tasa_reprobacion": 22.1,
    "total_alumnos": 500,
    "total_inscripciones": 520,
    "total_reprobados": 110
  },
  "top_factores": [
    {
      "id": 1,
      "nombre": "Inasistencias",
      "categoria": "Academico",
      "frecuencia": 45,
      "recomendaciones": [
        {
          "id": 1,
          "titulo": "Implementar Sistema de Alerta Temprana",
          "descripcion": "Contactar al alumno después de la 2da falta...",
          "nivel": "docente"
        }
      ]
    }
  ]
}
```

### 5. Seeder: `RecomendacionSeeder`

**Archivo**: `database/seeders/RecomendacionSeeder.php`

Puebla la base de datos con recomendaciones de ejemplo para los siguientes factores:
- Inasistencias (3 recomendaciones)
- Bajo Rendimiento Académico (3 recomendaciones)
- Problemas Personales (3 recomendaciones)
- Falta de Motivación (3 recomendaciones)
- Dificultad con Materias Específicas (3 recomendaciones)

## Estructura del Frontend (Next.js)

### 1. Página de Reportes

**Archivo**: `src/app/admin/reports/page.tsx`

**Características**:
- Filtros de periodo (requerido) y carrera (opcional)
- Botón "Generar Reporte" con estado de carga
- Integración con TanStack Query para manejo de estado
- Reporte generado bajo demanda (no automático al cargar)

### 2. Componente de Reporte

**Archivo**: `src/components/reports/summary-report.tsx`

**Secciones**:
1. **Header**: Título, descripción (periodo/carrera), fecha de generación, botón de impresión
2. **Métricas Clave**: 4 tarjetas con gradientes de colores mostrando KPIs
3. **Factores y Recomendaciones**: Lista de factores con sus recomendaciones categorizadas
4. **Footer**: Información del sistema y disclaimer

**Estilos de Impresión**:
- Oculta navegación y filtros
- Márgenes optimizados (0.5in)
- Colores exactos preservados
- Prevención de saltos de página inapropiados

### 3. Estilos Globales

**Archivo**: `src/app/globals.css`

```css
@media print {
  .hide-on-print {
    display: none !important;
  }
  
  @page {
    size: auto;
    margin: 0.5in;
  }
  
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### 4. Layout Actualizado

**Archivo**: `src/app/admin/layout.tsx`

- Añadida clase `hide-on-print` al `<AppSidebar>` y `<header>`

### 5. Sidebar Actualizado

**Archivo**: `src/components/app-sidebar.tsx`

- Nueva entrada "Reportes" en la sección de proyectos

## Cómo Usar

### 1. Backend

```bash
# Ejecutar migraciones (si no se han ejecutado)
php artisan migrate

# Poblar recomendaciones
php artisan db:seed --class=RecomendacionSeeder
```

### 2. Frontend

1. Navegar a `/admin/reports`
2. Seleccionar un **periodo** (requerido)
3. Opcionalmente seleccionar una **carrera** específica
4. Hacer clic en **"Generar Reporte"**
5. Revisar el reporte generado
6. Usar el botón de impresión para exportar a PDF

## Próximas Mejoras Sugeridas

- [ ] Exportación directa a PDF sin usar ventana de impresión
- [ ] Gráficas visuales de los factores de riesgo
- [ ] Comparativas entre periodos
- [ ] Histórico de reportes generados
- [ ] Recomendaciones personalizadas mediante IA
- [ ] Filtros adicionales (semestre, grupos específicos)
- [ ] Envío automático por email
- [ ] Dashboard de seguimiento de recomendaciones implementadas

## Notas Técnicas

- **Backend**: Laravel 11.x con Sanctum para autenticación
- **Frontend**: Next.js 15.x con TanStack Query v5
- **Base de Datos**: MySQL con Eloquent ORM
- **UI**: shadcn/ui con Tailwind CSS v4

## Mantenimiento

Para añadir nuevas recomendaciones:

1. Accede a la base de datos
2. Inserta en la tabla `recomendaciones`:

```sql
INSERT INTO recomendaciones (factor_riesgo_id, titulo, descripcion, nivel) 
VALUES (1, 'Nueva Recomendación', 'Descripción detallada...', 'docente');
```

O desde código:

```php
Recomendacion::create([
    'factor_riesgo_id' => $factorId,
    'titulo' => 'Título de la Recomendación',
    'descripcion' => 'Descripción detallada...',
    'nivel' => 'institucional' // o 'docente' o 'alumno'
]);
```

## Autor

Desarrollado como parte del Sistema de Gestión Escolar TecNM
