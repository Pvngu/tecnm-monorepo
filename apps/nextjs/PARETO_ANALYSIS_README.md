# Widget de Análisis de Pareto - Factores de Riesgo por Grupo

Este documento describe la implementación del widget de análisis de Pareto que permite identificar los factores de riesgo más impactantes (regla 80/20) por grupo.

## 🎯 Objetivo

Permitir a los administradores seleccionar un grupo específico y visualizar los factores de riesgo más frecuentes mediante un gráfico de Pareto, facilitando la identificación de las áreas que requieren mayor atención.

## 📁 Archivos Modificados/Creados

### Backend (Laravel)

1. **`apps/laravel/routes/api.php`**
   - Añadida nueva ruta: `GET /api/grupos/{grupo}/factores-pareto`
   - Ruta protegida por middleware `auth:sanctum`
   - Utiliza Route Model Binding para el grupo

2. **`apps/laravel/app/Http/Controllers/GrupoController.php`**
   - Añadido método `getFactoresPareto(Grupo $grupo)`
   - Lógica implementada:
     - Obtiene inscripciones del grupo
     - Consulta y agrupa factores de riesgo por frecuencia
     - Calcula porcentaje acumulado para análisis de Pareto
     - Devuelve datos ordenados por frecuencia descendente

### Frontend (Next.js)

3. **`apps/nextjs/src/services/apiService.ts`**
   - Añadida función `getParetoFactores(grupoId: number)`
   - Añadida interfaz `ParetoData` para tipar la respuesta

4. **`apps/nextjs/src/components/charts/pareto-factores-grupo.tsx`** (NUEVO)
   - Componente cliente con estado local para filtros
   - Implementa 3 filtros dependientes en cascada:
     - Periodo → Materia → Grupo
   - Gráfico combinado (ComposedChart) con:
     - Barras para frecuencia (eje Y izquierdo)
     - Línea para porcentaje acumulado (eje Y derecho)
   - Estados de carga y vacío con feedback visual

5. **`apps/nextjs/src/app/admin/pareto/page.tsx`** (NUEVO)
   - Página independiente para el Análisis de Pareto
   - Renderiza el componente `<ParetoFactoresGrupo />`
   - Accesible en la ruta `/admin/pareto`

## 🔄 Flujo de Datos

```
Usuario selecciona Periodo
  ↓
Se habilita selector de Materia
  ↓
Usuario selecciona Materia
  ↓
Se habilita selector de Grupo
  ↓
Usuario selecciona Grupo
  ↓
Se ejecuta query a: GET /api/grupos/{id}/factores-pareto
  ↓
Backend procesa:
  1. Obtiene inscripciones del grupo
  2. Consulta factores de riesgo asociados
  3. Agrupa y cuenta frecuencias
  4. Calcula porcentajes acumulados
  ↓
Frontend recibe array de ParetoData
  ↓
Renderiza gráfico de Pareto (barras + línea)
```

## 📊 Estructura de Datos

### Respuesta del Endpoint

```json
[
  {
    "nombre": "Inasistencias",
    "frecuencia": 15,
    "porcentaje_acumulado": 65.2
  },
  {
    "nombre": "Bajo Rendimiento",
    "frecuencia": 5,
    "porcentaje_acumulado": 87.0
  },
  {
    "nombre": "Reprobación previa",
    "frecuencia": 3,
    "porcentaje_acumulado": 100.0
  }
]
```

## 🎨 Características del Componente

### Filtros Dependientes
- **Periodo**: Selector simple, carga automáticamente al montar
- **Materia**: Habilitado solo si hay periodo seleccionado
- **Grupo**: Habilitado solo si hay materia seleccionada

### Visualización
- **Gráfico de Pareto**: Combina barras (frecuencia) y línea (% acumulado)
- **Eje X**: Nombres de factores de riesgo (rotados -45°)
- **Eje Y Izquierdo**: Frecuencia (número de ocurrencias)
- **Eje Y Derecho**: Porcentaje acumulado (0-100%)
- **Tooltip**: Información detallada al hacer hover
- **Estados**: Loading skeletons, mensajes de estado vacío

### Interpretación
Panel informativo incluido que explica la regla 80/20:
> "Los factores mostrados a la izquierda son los más frecuentes. La línea naranja representa el porcentaje acumulado. Según la regla 80/20, los primeros factores (que alcanzan ~80% acumulado) requieren mayor atención."

## 🚀 Uso

1. Navega a `/admin/pareto`
2. En la sección "Análisis de Pareto - Factores de Riesgo por Grupo"
3. Selecciona un Periodo
4. Selecciona una Materia
5. Selecciona un Grupo
6. Visualiza el análisis de Pareto

## 🔐 Autenticación

- Todos los endpoints requieren autenticación mediante Sanctum
- Las cookies de sesión se envían automáticamente con `credentials: 'include'`
- Token CSRF se incluye en los headers de las peticiones

## 📦 Dependencias

- **Laravel**: Spatie Query Builder (ya instalado)
- **Next.js**: 
  - @tanstack/react-query (gestión de estado del servidor)
  - recharts (gráficos)
  - shadcn/ui (componentes UI)

## 🧪 Testing Recomendado

1. Verificar que los filtros se habilitan/deshabilitan correctamente
2. Probar con un grupo que tenga factores de riesgo
3. Probar con un grupo sin factores de riesgo
4. Validar el cálculo del porcentaje acumulado
5. Verificar responsividad en diferentes tamaños de pantalla

## 📝 Notas Técnicas

- El componente resetea los filtros dependientes al cambiar valores superiores
- Los queries usan `enabled` para evitar llamadas innecesarias
- El formato de datos está optimizado para Recharts
- Los porcentajes acumulados se redondean a 1 decimal
- La consulta SQL usa GROUP BY y ORDER BY para eficiencia
