# Diagrama de Dispersión: Análisis de Correlación Múltiple

## 📊 Descripción General

Este módulo implementa un **Diagrama de Dispersión (Scatter Plot)** dinámico que permite visualizar la correlación entre cualquier par de variables académicas de los alumnos de un grupo. El usuario puede seleccionar las variables para los ejes X e Y de forma flexible, permitiendo múltiples análisis de correlación.

## 🎯 Propósito

- **Análisis flexible**: Seleccionar cualquier combinación de variables para correlacionar
- **Identificar patrones**: Descubrir relaciones entre diferentes métricas académicas
- **Toma de decisiones**: Proporcionar datos visuales para intervenciones específicas
- **Filtrado inteligente**: Análisis por semestre, materia y grupo específico

## 🏗️ Arquitectura de la Solución

### Backend (Laravel)

#### 1. **Endpoint API**
- **Ruta**: `GET /api/grupos/{grupo}/scatter-faltas`
- **Autenticación**: Requiere `auth:sanctum`
- **Ubicación**: `apps/laravel/routes/api.php`

#### 2. **Controlador**
- **Archivo**: `apps/laravel/app/Http/Controllers/GrupoController.php`
- **Método**: `getScatterPlotFaltas(Grupo $grupo)`
- **Funcionalidad**:
  - Obtiene inscripciones del grupo con múltiples métricas
  - Cuenta asistencias, faltas, justificados
  - Cuenta factores de riesgo por alumno
  - Calcula porcentaje de asistencia
  - Retorna array con todas las variables disponibles

#### 3. **Variables Disponibles**
El endpoint retorna las siguientes métricas para cada alumno:
- `calificacion_final`: Calificación final (0-100)
- `faltas`: Número de inasistencias injustificadas
- `asistencias`: Número de días asistidos
- `justificados`: Número de faltas justificadas
- `total_asistencias`: Total de registros de asistencia
- `porcentaje_asistencia`: Porcentaje de asistencia
- `num_factores_riesgo`: Cantidad de factores de riesgo identificados

### Frontend (Next.js)

#### 1. **Servicio API**
- **Archivo**: `apps/nextjs/src/services/apiService.ts`
- **Método**: `getScatterPlotFaltas(grupoId: number)`
- **Interface**: `ScatterPlotData`
  ```typescript
  interface ScatterPlotData {
    calificacion_final: number;
    faltas: number;
    asistencias: number;
    justificados: number;
    total_asistencias: number;
    porcentaje_asistencia: number;
    num_factores_riesgo: number;
    alumno_nombre: string;
    alumno_id: number;
  }
  ```

#### 2. **Componente Widget**
- **Archivo**: `apps/nextjs/src/components/charts/scatter-faltas-grupo.tsx`
- **Características**:
  - **Filtros**:
    - Semestre (requerido)
    - Materia (opcional)
    - Grupo (opcional)
  - **Selectores de Variables**:
    - Variable X (eje horizontal)
    - Variable Y (eje vertical)
  - **Gráfico**: Scatter plot con Recharts
  - **Tooltip**: Información detallada del alumno
  - **Interpretación**: Descripción dinámica según variables seleccionadas

#### 3. **Variables Configurables**

| Variable | Etiqueta | Unidad | Descripción |
|----------|----------|--------|-------------|
| `calificacion_final` | Calificación Final | pts | Calificación final del alumno |
| `faltas` | Número de Faltas | faltas | Total de inasistencias injustificadas |
| `asistencias` | Número de Asistencias | asist. | Total de días asistidos |
| `porcentaje_asistencia` | Porcentaje de Asistencia | % | Porcentaje de asistencia del total |
| `total_asistencias` | Total de Registros | reg. | Total de registros de asistencia |
| `num_factores_riesgo` | Factores de Riesgo | factores | Total de factores identificados |

## 📊 Formato de Datos

### Respuesta del Backend (Ejemplo)
```json
[
  {
    "calificacion_final": 95.00,
    "faltas": 0,
    "asistencias": 48,
    "justificados": 2,
    "total_asistencias": 50,
    "porcentaje_asistencia": 96.0,
    "num_factores_riesgo": 0,
    "alumno_nombre": "Ana García López",
    "alumno_id": 1
  },
  {
    "calificacion_final": 55.00,
    "faltas": 15,
    "asistencias": 33,
    "justificados": 2,
    "total_asistencias": 50,
    "porcentaje_asistencia": 66.0,
    "num_factores_riesgo": 3,
    "alumno_nombre": "Carlos Ruiz Hernández",
    "alumno_id": 2
  }
]
```

## 🎨 Características de la Visualización

### Sistema de Filtros
1. **Semestre** (Obligatorio): Filtra materias por semestre académico
2. **Materia** (Opcional): Filtra grupos por materia específica
3. **Grupo** (Opcional): Selecciona grupo específico para análisis

### Selectores de Variables
- **Variable X**: Selecciona la métrica para el eje horizontal
- **Variable Y**: Selecciona la métrica para el eje vertical
- Cada variable muestra su descripción al seleccionarla

### Elementos Visuales
- **Puntos**: Cada punto representa un alumno
- **Ejes Dinámicos**: Etiquetas y unidades según variables seleccionadas
- **Tooltip Interactivo**: Muestra:
  - Nombre del alumno
  - Valor de variable X
  - Valor de variable Y
- **Grid**: Rejilla para facilitar la lectura

## 🚀 Uso

### 1. Acceder a la Página
```
/admin/analytics
```

### 2. Configurar Filtros
1. **Seleccionar Semestre**: Elige el semestre a analizar (1-12)
2. **Seleccionar Materia** (Opcional): Filtra por materia específica
3. **Seleccionar Grupo** (Opcional): Elige un grupo concreto

### 3. Configurar Variables
1. **Variable X**: Selecciona la métrica para el eje horizontal
2. **Variable Y**: Selecciona la métrica para el eje vertical

### 4. Interpretar el Gráfico
- Observa la distribución y tendencia de los puntos
- Identifica correlaciones (positiva, negativa, ninguna)
- Usa el tooltip para ver detalles de cada alumno
- Detecta outliers (puntos atípicos)

## 📈 Ejemplos de Análisis

### Ejemplo 1: Faltas vs. Calificación Final
**Variables**: 
- X: Número de Faltas
- Y: Calificación Final

**Interpretación Esperada**:
- Correlación **negativa**: Más faltas → Menor calificación
- Zona ideal: Superior izquierda (pocas faltas, altas calificaciones)
- Zona problemática: Inferior derecha (muchas faltas, bajas calificaciones)

### Ejemplo 2: Porcentaje de Asistencia vs. Calificación Final
**Variables**:
- X: Porcentaje de Asistencia
- Y: Calificación Final

**Interpretación Esperada**:
- Correlación **positiva**: Mayor asistencia → Mayor calificación
- Identificar alumnos con alta asistencia pero baja calificación (requieren apoyo académico)

### Ejemplo 3: Factores de Riesgo vs. Calificación Final
**Variables**:
- X: Número de Factores de Riesgo
- Y: Calificación Final

**Interpretación Esperada**:
- Correlación **negativa**: Más factores de riesgo → Menor calificación
- Detectar alumnos con muchos factores que mantienen buen rendimiento

## 📝 Base de Datos

### Tablas Involucradas

1. **inscripciones**
   - `id`
   - `alumno_id`
   - `grupo_id`
   - `calificacion_final`

2. **asistencias**
   - `id`
   - `inscripcion_id`
   - `estatus` (enum: 'asistio', 'falta', 'justificado')

3. **alumnos**
   - `id`
   - `nombre`
   - `apellido_paterno`
   - `apellido_materno`

4. **alumnos_factores**
   - `id`
   - `inscripcion_id`
   - `factor_id`

### Consulta SQL Equivalente
```sql
SELECT 
    CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', a.apellido_materno) as alumno_nombre,
    a.id as alumno_id,
    i.calificacion_final,
    COUNT(CASE WHEN asist.estatus = 'falta' THEN 1 END) as faltas,
    COUNT(CASE WHEN asist.estatus = 'asistio' THEN 1 END) as asistencias,
    COUNT(CASE WHEN asist.estatus = 'justificado' THEN 1 END) as justificados,
    COUNT(asist.id) as total_asistencias,
    ROUND((COUNT(CASE WHEN asist.estatus = 'asistio' THEN 1 END) / COUNT(asist.id)) * 100, 1) as porcentaje_asistencia,
    COUNT(af.id) as num_factores_riesgo
FROM inscripciones i
JOIN alumnos a ON i.alumno_id = a.id
LEFT JOIN asistencias asist ON asist.inscripcion_id = i.id
LEFT JOIN alumnos_factores af ON af.inscripcion_id = i.id
WHERE i.grupo_id = ?
AND i.calificacion_final IS NOT NULL
GROUP BY i.id, a.id, a.nombre, a.apellido_paterno, a.apellido_materno, i.calificacion_final
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Laravel**: Framework PHP
- **Eloquent ORM**: Para consultas y relaciones
- **Sanctum**: Autenticación API

### Frontend
- **Next.js**: Framework React
- **TypeScript**: Tipado estático
- **TanStack Query**: Gestión de estado del servidor
- **Recharts**: Biblioteca de gráficos
- **shadcn/ui**: Componentes UI
- **TailwindCSS**: Estilos

## 📦 Archivos Modificados/Creados

### Backend (Laravel)
```
✅ apps/laravel/routes/api.php
✅ apps/laravel/app/Http/Controllers/GrupoController.php
✅ apps/laravel/app/Models/Alumno.php
```

### Frontend (Next.js)
```
✅ apps/nextjs/src/services/apiService.ts
✅ apps/nextjs/src/components/charts/scatter-faltas-grupo.tsx
✅ apps/nextjs/src/app/admin/analytics/page.tsx
✅ apps/nextjs/SCATTER_FALTAS_README.md
```

## 🎓 Casos de Uso Educativos

### Para Profesores
- Identificar correlaciones entre diferentes variables académicas
- Evaluar el impacto de la asistencia en el rendimiento
- Detectar alumnos que requieren apoyo específico
- Planificar intervenciones basadas en datos

### Para Coordinadores
- Analizar patrones por semestre o materia
- Comparar diferentes grupos
- Identificar factores de riesgo más impactantes
- Generar reportes de correlación

### Para Directivos
- Evaluar políticas institucionales
- Identificar áreas de mejora
- Tomar decisiones basadas en análisis de datos
- Justificar programas de apoyo académico

## 🔍 Mejoras Futuras Sugeridas

1. **Línea de Tendencia**
   - Agregar regresión lineal automática
   - Mostrar ecuación de la recta
   - Calcular coeficiente de correlación (r)
   - Mostrar R² (coeficiente de determinación)

2. **Análisis Estadístico**
   - Media, mediana y moda de cada variable
   - Desviación estándar
   - Identificación automática de outliers
   - Prueba de significancia estadística

3. **Exportación y Reportes**
   - Descargar gráfico como imagen PNG/SVG
   - Exportar datos a CSV/Excel
   - Generar reporte PDF automático
   - Compartir análisis

4. **Comparación Múltiple**
   - Comparar múltiples grupos en el mismo gráfico
   - Análisis histórico (varios periodos)
   - Benchmark entre carreras
   - Análisis de cohortes

5. **Visualizaciones Adicionales**
   - Matriz de correlación entre todas las variables
   - Heatmap de correlaciones
   - Gráficos de burbujas (3 variables)
   - Animaciones de evolución temporal

6. **Alertas Inteligentes**
   - Notificaciones de correlaciones inusuales
   - Alertas de alumnos en riesgo
   - Sugerencias automáticas de intervención

## 📞 Soporte

Para dudas o problemas con esta funcionalidad, consultar:
- Código fuente en los archivos mencionados
- Documentación de Recharts: https://recharts.org/
- Documentación de Laravel Eloquent
- Documentación de TanStack Query

---

**Versión**: 2.0  
**Fecha**: Noviembre 2025  
**Desarrollador**: Full-Stack Team

## 📝 Base de Datos

### Tablas Involucradas

1. **inscripciones**
   - `id`
   - `alumno_id`
   - `grupo_id`
   - `calificacion_final`

2. **asistencias**
   - `id`
   - `inscripcion_id`
   - `estatus` (enum: 'asistio', 'falta', 'justificado')

3. **alumnos**
   - `id`
   - `nombre`
   - `apellido_paterno`
   - `apellido_materno`

### Consulta SQL Equivalente
```sql
SELECT 
    CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', a.apellido_materno) as alumno_nombre,
    i.calificacion_final as y_calificacion,
    COUNT(CASE WHEN asist.estatus = 'falta' THEN 1 END) as x_faltas
FROM inscripciones i
JOIN alumnos a ON i.alumno_id = a.id
LEFT JOIN asistencias asist ON asist.inscripcion_id = i.id
WHERE i.grupo_id = ?
AND i.calificacion_final IS NOT NULL
GROUP BY i.id, a.nombre, a.apellido_paterno, a.apellido_materno, i.calificacion_final
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Laravel**: Framework PHP
- **Eloquent ORM**: Para consultas y relaciones
- **Sanctum**: Autenticación API

### Frontend
- **Next.js**: Framework React
- **TypeScript**: Tipado estático
- **TanStack Query**: Gestión de estado del servidor
- **Recharts**: Biblioteca de gráficos
- **shadcn/ui**: Componentes UI
- **TailwindCSS**: Estilos

## 📦 Archivos Modificados/Creados

### Backend (Laravel)
```
✅ apps/laravel/routes/api.php
✅ apps/laravel/app/Http/Controllers/GrupoController.php
✅ apps/laravel/app/Models/Alumno.php
```

### Frontend (Next.js)
```
✅ apps/nextjs/src/services/apiService.ts
✅ apps/nextjs/src/components/charts/scatter-faltas-grupo.tsx (NUEVO)
✅ apps/nextjs/src/app/admin/analytics/page.tsx
```

## 🎓 Casos de Uso Educativos

### Para Profesores
- Identificar alumnos en riesgo por ausentismo
- Evaluar la efectividad de la asistencia en el rendimiento
- Planificar intervenciones específicas

### Para Coordinadores
- Analizar patrones de asistencia por grupo
- Comparar diferentes grupos de la misma materia
- Generar reportes de correlación

### Para Directivos
- Evaluar políticas de asistencia
- Identificar grupos problemáticos
- Tomar decisiones basadas en datos

## 🔍 Mejoras Futuras Sugeridas

1. **Línea de Tendencia**
   - Agregar regresión lineal para mostrar la correlación

2. **Filtros Adicionales**
   - Por género
   - Por modalidad (escolarizado/mixto)
   - Por rango de semestre

3. **Exportación**
   - Descargar gráfico como imagen
   - Exportar datos a CSV/Excel

4. **Estadísticas**
   - Coeficiente de correlación (r)
   - Ecuación de la recta de tendencia
   - R² (coeficiente de determinación)

5. **Comparación**
   - Comparar múltiples grupos en el mismo gráfico
   - Análisis histórico (varios periodos)

## 📞 Soporte

Para dudas o problemas con esta funcionalidad, consultar:
- Código fuente en los archivos mencionados
- Documentación de Recharts: https://recharts.org/
- Documentación de Laravel Eloquent

---

**Versión**: 1.0  
**Fecha**: Noviembre 2025  
**Desarrollador**: Full-Stack Team
