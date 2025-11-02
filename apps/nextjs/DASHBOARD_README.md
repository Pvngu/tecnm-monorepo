# Dashboard de Análisis de Deserción Estudiantil

## Descripción

Dashboard que muestra estadísticas clave sobre el análisis de deserción estudiantil, incluyendo:

- **Total de Estudiantes**: Número total de estudiantes registrados en el sistema
- **Reprobación Promedio**: Porcentaje de estudiantes que han reprobado (calificación < 70)
- **Deserción Estimada**: Porcentaje de estudiantes con estatus de `baja_temporal` o `baja_definitiva`
- **Gráfico de Deserción por Semestre**: Visualización del número de estudiantes que han desertado en cada semestre (1-9)
- **Filtro por Período**: Selector para filtrar estadísticas de reprobación por período académico

### Estatus de Alumnos

El cálculo de deserción se basa en la columna `estatus_alumno` de la tabla `alumnos`:
- **`activo`**: Estudiante cursando normalmente
- **`baja_temporal`**: Estudiante que ha suspendido temporalmente
- **`baja_definitiva`**: Estudiante que ha abandonado definitivamente
- **`egresado`**: Estudiante que ha completado su carrera

**Deserción = baja_temporal + baja_definitiva**

## Cambios Realizados

### Backend (Laravel)

1. **Nuevo Controlador**: `app/Http/Controllers/DashboardController.php`
   - Método `getStats()`: Calcula y retorna las estadísticas del dashboard
   - **Filtrado por período**: Acepta parámetro opcional `periodo_id`
   - Lógica de cálculo:
     - Total de estudiantes: Conteo de alumnos con inscripciones en el período seleccionado
     - Reprobación promedio: Porcentaje de inscripciones con calificación final < 70 en el período
     - Deserción estimada: Porcentaje de alumnos con `estatus_alumno` en `['baja_temporal', 'baja_definitiva']` que tienen inscripciones en el período
     - Deserción por semestre: Conteo de alumnos con estatus de deserción por cada semestre, filtrado por período
   - Si no se especifica período, usa el período activo por defecto

2. **Nueva Ruta API**: `routes/api.php`
   ```php
   Route::get('dashboard/stats', [DashboardController::class, 'getStats']);
   ```
   - Endpoint: `GET /api/v1/dashboard/stats`
   - Parámetros opcionales:
     - `periodo_id`: ID del período para filtrar estadísticas
   - Autenticación: Requiere token Sanctum
   - Respuesta JSON:
     ```json
     {
       "totalEstudiantes": 50,
       "reprobacionPromedio": 25.00,
       "desercionEstimada": 10.00,
       "desercionPorSemestre": [
         { "semestre": "Sem 1", "estudiantes": 12 },
         { "semestre": "Sem 2", "estudiantes": 8 },
         ...
       ],
       "periodos": [
         { "id": 1, "nombre": "Otoño 2025", "activo": true },
         { "id": 2, "nombre": "Primavera 2025", "activo": false },
         ...
       ],
       "periodoSeleccionado": 1
     }
     ```

### Frontend (Next.js)

1. **Página de Dashboard**: `src/app/admin/dashboard/page.tsx`
   - Componente con cliente side rendering (`"use client"`)
   - Muestra 3 tarjetas con estadísticas principales
   - Selector de período para filtrar datos de reprobación
   - Gráfico de barras con deserción por semestre usando Recharts
   - Diseño responsive con Tailwind CSS

2. **Servicio de Dashboard**: `src/services/dashboardService.ts`
   - Función `getStats(periodoId?)`: Fetch de estadísticas desde el backend
   - Soporte para filtrado por período
   - Manejo de errores y tipos TypeScript

3. **Dependencias Nuevas**:
   - `recharts`: Biblioteca para gráficos React (instalada vía npm)

## Uso

### Backend

Asegúrate de que el servidor Laravel esté corriendo:

```bash
cd apps/laravel
php artisan serve
```

### Frontend

Asegúrate de que el servidor Next.js esté corriendo:

```bash
cd apps/nextjs
npm run dev
```

Navega a `/admin/dashboard` para ver el dashboard.

## Variables de Entorno

Asegúrate de tener configurado en `.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Notas Técnicas

- El cálculo de deserción se basa en la columna `estatus_alumno` de la tabla `alumnos`
- Se consideran en deserción los estudiantes con estatus: `baja_temporal` o `baja_definitiva`
- **Filtrado por período**: Todas las estadísticas se filtran por el período seleccionado
  - Solo se consideran estudiantes que tienen inscripciones en ese período
  - Si no se selecciona período, usa el período activo por defecto
- Los datos se actualizan cada vez que se cambia el período o se recarga la página
- El gráfico muestra semestres del 1 al 9
- Los colores siguen el diseño del sistema (azul principal)
- El estatus de los alumnos se asigna automáticamente basándose en rendimiento académico y factores de riesgo

## Mejoras Futuras

- Agregar filtros por carrera
- Implementar actualización en tiempo real
- Agregar más métricas (promedio general, asistencia, etc.)
- Exportar datos a Excel/PDF
- Agregar comparativas entre períodos
- Gráficos de tendencias histórica
- Predicción de deserción usando datos históricos
