# Diagrama de Ishikawa (Espina de Pescado)

## Descripción General

El Diagrama de Ishikawa, también conocido como Diagrama de Espina de Pescado o Diagrama Causa-Efecto, es una herramienta de análisis visual que permite identificar las causas raíz de un problema específico. En este sistema, se utiliza para analizar los factores de riesgo que contribuyen a la tasa de reprobación de un grupo.

## Características Principales

### 1. **Filtros Dependientes**
- **Periodo**: Selecciona el periodo académico
- **Materia**: Selecciona la materia (habilitado después de elegir periodo)
- **Grupo**: Selecciona el grupo específico (habilitado después de elegir materia)

### 2. **Visualización del Diagrama**
- **Efecto (Cabeza del Pescado)**: Muestra la tasa de reprobación del grupo
- **Causas Principales (Espinas Principales)**: Categorías de factores de riesgo
  - Académico
  - Personal
  - Económico
  - Social
  - Familiar
  - Salud
- **Causas Secundarias**: Factores específicos dentro de cada categoría con su frecuencia

### 3. **Campos de Observaciones**
Cada categoría incluye un área de texto donde se pueden añadir observaciones cualitativas para complementar los datos cuantitativos.

### 4. **Persistencia de Datos**
- Los análisis se guardan en la base de datos
- Se pueden recuperar análisis previos
- Cada análisis está asociado al usuario que lo creó

### 5. **Exportación a PDF**
- Botón para exportar el diagrama completo a PDF
- Incluye todas las observaciones escritas
- Nombre de archivo con timestamp para organización

## Estructura de Datos

### Endpoint Backend - Obtener Datos
```
GET /api/v1/grupos/{grupo_id}/ishikawa-data
```

### Endpoint Backend - Guardar Análisis
```
POST /api/v1/grupos/{grupo_id}/ishikawa/save
```

**Body:**
```json
{
  "tasa_reprobacion": 32.5,
  "observaciones": {
    "Académico": "Se observa alta incidencia de inasistencias...",
    "Personal": "Problemas familiares frecuentes...",
    "Económico": "..."
  }
}
```

### Endpoint Backend - Obtener Último Análisis
```
GET /api/v1/grupos/{grupo_id}/ishikawa/latest
```

### Respuesta JSON
```json
{
  "efecto": "Tasa de Reprobación del 32.5% en el grupo",
  "tasa_reprobacion": 32.5,
  "causas_principales": [
    {
      "categoria": "Académico",
      "causas_secundarias": [
        { "nombre": "Inasistencias", "frecuencia": 12 },
        { "nombre": "Bajo Rendimiento Previo", "frecuencia": 5 }
      ]
    },
    {
      "categoria": "Personal",
      "causas_secundarias": [
        { "nombre": "Problemas Familiares", "frecuencia": 2 }
      ]
    }
  ]
}
```

## Archivos Involucrados

### Backend (Laravel)
1. **routes/api.php**: Rutas para el endpoint de Ishikawa
2. **app/Http/Controllers/GrupoController.php**: Método `getIshikawaData()`
3. **app/Http/Controllers/AnalisisIshikawaController.php**: CRUD de análisis (nuevo)
4. **app/Models/AnalisisIshikawa.php**: Modelo para persistencia (nuevo)
5. **database/migrations/2025_11_02_000001_create_analisis_ishikawa_table.php**: Tabla de base de datos (nuevo)

### Frontend (Next.js)
1. **src/app/admin/ishikawa/page.tsx**: Página principal con filtros, guardado y exportación
2. **src/components/charts/ishikawa-template.tsx**: Componente de visualización con botones de acción
3. **src/services/apiService.ts**: Métodos de API y tipos TypeScript
4. **src/app/globals.css**: Estilos CSS para el diagrama
5. **src/components/app-sidebar.tsx**: Entrada en el menú de navegación
6. **src/app/layout.tsx**: Toaster para notificaciones (actualizado)
7. **package.json**: Dependencias html2canvas y jspdf (actualizado)

## Uso de la Herramienta

### Paso 1: Navegar a la Herramienta
Accede desde el menú lateral: **Herramientas > Diagrama de Ishikawa**

### Paso 2: Seleccionar el Grupo
1. Selecciona un **Periodo**
2. Selecciona una **Materia**
3. Selecciona un **Grupo**

### Paso 3: Analizar el Diagrama
- Observa la **tasa de reprobación** en la cabeza del pescado
- Revisa las **categorías** con mayor número de factores
- Identifica los **factores específicos** más frecuentes
- Añade **observaciones cualitativas** en los campos de texto

### Paso 4: Guardar el Análisis
1. Escribe tus observaciones en cada categoría
2. Haz clic en el botón **"Guardar"**
3. El sistema confirmará que se guardó exitosamente
4. Puedes volver a cargar tus observaciones más tarde

### Paso 5: Exportar a PDF
1. Haz clic en el botón **"Exportar PDF"**
2. El sistema generará un PDF con todo el diagrama
3. El archivo se descargará automáticamente
4. El nombre del archivo incluye el ID del grupo y timestamp

### Paso 6: Tomar Decisiones
Utiliza el análisis para:
- Priorizar acciones de intervención
- Diseñar estrategias de apoyo específicas
- Generar reportes para profesores y coordinadores

## Consideraciones Técnicas

### Cálculo de la Tasa de Reprobación
- Calificación mínima aprobatoria: **60**
- Fórmula: `(Alumnos Reprobados / Total Alumnos) × 100`

### Agrupación de Factores
Los factores se agrupan primero por **categoría** (del modelo `FactorRiesgo`) y luego se cuentan las frecuencias de cada factor específico dentro de cada categoría.

### Estados de la UI
- **Sin selección**: Mensaje para seleccionar un grupo
- **Cargando**: Skeleton de carga
- **Con datos**: Muestra el diagrama completo con botones de acción
- **Sin datos**: Mensaje indicando que no hay factores registrados
- **Guardando**: Botón deshabilitado mientras se guarda
- **Exportando**: Botón deshabilitado mientras se genera el PDF

## Base de Datos

### Tabla: `analisis_ishikawa`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGINT | ID auto-incremental |
| `grupo_id` | BIGINT | FK a tabla grupos |
| `user_id` | BIGINT | FK a tabla users (quien hizo el análisis) |
| `tasa_reprobacion` | DECIMAL(5,2) | Tasa de reprobación del grupo |
| `observaciones` | JSON | Observaciones por categoría |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

**Índices:**
- `grupo_id` (búsquedas por grupo)
- `user_id` (búsquedas por usuario)
- `created_at` (ordenamiento cronológico)

## Mejoras Futuras

### Funcionalidades Potenciales
1. ~~**Exportar a PDF/Imagen**~~: ✅ **IMPLEMENTADO**
2. ~~**Guardado de Observaciones**~~: ✅ **IMPLEMENTADO**
3. **Comparación entre Grupos**: Ver múltiples diagramas lado a lado
4. **Histórico**: Comparar el mismo grupo en diferentes periodos
5. **Generación de Reportes**: Crear informes automáticos con recomendaciones
6. **Filtros Adicionales**: Por carrera, por profesor, etc.
7. **Colaboración**: Comentarios de múltiples usuarios
8. **Plantillas de Observaciones**: Sugerencias automáticas basadas en datos

## Ventajas del Diagrama de Ishikawa

1. **Visual e Intuitivo**: Fácil de entender para todos los stakeholders
2. **Estructura Organizada**: Agrupa causas en categorías lógicas
3. **Identificación de Prioridades**: Muestra las frecuencias para priorizar acciones
4. **Trabajo Colaborativo**: Facilita discusiones en equipo
5. **Base para Acciones**: Proporciona evidencia para tomar decisiones informadas

## Diferencia con Análisis de Pareto

| Característica | Pareto | Ishikawa |
|---------------|--------|----------|
| **Enfoque** | Frecuencias ordenadas | Agrupación por categorías |
| **Visual** | Gráfico de barras + línea | Diagrama de espina de pescado |
| **Objetivo** | Regla 80/20 | Análisis causa-raíz |
| **Uso** | Priorización cuantitativa | Análisis cualitativo estructurado |

Ambas herramientas son complementarias y se recomienda usarlas en conjunto para un análisis completo.

## Soporte y Contacto

Para reportar problemas o sugerencias sobre esta herramienta, contacta al equipo de desarrollo.
