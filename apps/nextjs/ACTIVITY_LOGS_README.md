# Activity Logs - Registro de Actividades

Este módulo implementa un sistema completo de visualización de logs de actividad para el sistema TECNM.

## Características

### Backend (Laravel)

El endpoint de Activity Logs ya está implementado en Laravel con las siguientes características:

- **Endpoint**: `GET /api/v1/activity-logs`
- **Autenticación**: Requiere autenticación con Sanctum
- **Modelo**: `App\Models\ActivityLog`
- **Controlador**: `App\Http\Controllers\ActivityLogController`

#### Filtros Disponibles

- `entity` - Filtrar por tipo de entidad (alumnos, periodos, etc.)
- `action` - Filtrar por acción (CREATED, UPDATED, DELETED)
- `description` - Buscar por descripción
- `user_id` - Filtrar por ID de usuario (exact match)
- `loggable_type` - Filtrar por tipo de modelo (exact match)
- `loggable_id` - Filtrar por ID de registro (exact match)
- `datetime_from` - Filtrar desde fecha
- `datetime_to` - Filtrar hasta fecha

#### Ordenamiento

- `datetime` (default: descendente)
- `action`
- `entity`
- `created_at`

#### Includes (Relaciones)

- `user` - Información del usuario que realizó la acción
- `loggable` - Registro relacionado (polimórfico)

### Frontend (Next.js)

#### Archivos Creados

1. **Configuración de Recurso**: `src/config/resources/activity-logs.config.tsx`
   - Define el tipo `ActivityLog`
   - Configura las columnas de la tabla
   - Define los filtros disponibles

2. **Página de Visualización**: `src/app/admin/activity-logs/page.tsx`
   - Interfaz de usuario para visualizar logs
   - Filtros interactivos
   - Modal de detalles con información completa
   - Paginación

3. **Integración en Sidebar**: Agregado en `src/components/app-sidebar.tsx`

## Uso

### Acceso

1. Navega a `/admin/activity-logs` en la aplicación Next.js
2. O selecciona "Activity Logs" desde el sidebar en la sección "Administración"

### Visualización

La tabla muestra:
- **ID**: Identificador del log
- **Fecha**: Fecha y hora de la acción
- **Entidad**: Tipo de registro afectado
- **Acción**: Tipo de operación (Creado/Actualizado/Eliminado)
- **Descripción**: Descripción de la acción
- **Cambios**: Preview de los cambios realizados

### Filtros

Puedes filtrar por:
- **Entidad**: Selecciona una o más entidades
- **Acción**: Selecciona uno o más tipos de acción
- **Descripción**: Busca en las descripciones

### Detalles Completos

Haz click en cualquier fila para ver:

#### Para Registros Creados (CREATED)
- Información general del log
- Todos los campos creados con sus valores iniciales

#### Para Registros Actualizados (UPDATED)
- Información general del log
- Comparación lado a lado de valores antiguos vs nuevos
- Solo muestra los campos que cambiaron

#### Para Registros Eliminados (DELETED)
- Información general del log
- Todos los campos del registro antes de ser eliminado

#### Metadata del Sistema
- Servidor donde se realizó la acción
- Base de datos utilizada
- Timestamp exacto de la operación

## Estructura de Datos

### ActivityLog Type

```typescript
type ActivityLog = {
  id: number;
  user_id: number;
  loggable_type: string;
  loggable_id: number;
  action: "CREATED" | "UPDATED" | "DELETED";
  entity: string;
  description: string;
  json_log: {
    data: {
      old?: Record<string, any>;
      new?: Record<string, any>;
    };
    action: string;
    entity: string;
    metadata: {
      server: string;
      database: string;
    };
    timestamp: string;
    description: string;
  };
  datetime: string;
  created_at: string;
  updated_at: string;
};
```

## Ejemplo de Respuesta API

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 5,
      "user_id": 1,
      "loggable_type": "App\\Models\\Alumno",
      "loggable_id": 1,
      "action": "UPDATED",
      "entity": "alumnos",
      "description": "Alumno updated: ID 1",
      "json_log": {
        "data": {
          "old": {
            "nombre": "Iliana"
          },
          "new": {
            "nombre": "Ilianaaaa"
          }
        },
        "action": "UPDATED",
        "entity": "alumnos",
        "metadata": {
          "server": "Server-Name",
          "database": "laravel"
        },
        "timestamp": "2025-10-28T20:17:02.653288Z",
        "description": "Alumno updated: ID 1"
      },
      "datetime": "2025-10-28T20:17:02.000000Z",
      "created_at": "2025-10-28T20:17:02.000000Z",
      "updated_at": "2025-10-28T20:17:02.000000Z"
    }
  ],
  "per_page": 10,
  "total": 5
}
```

## Características Técnicas

### Componentes Utilizados

- `GenericDataTable` - Tabla reutilizable
- `GenericPagination` - Paginación estándar
- `FilterBar` - Barra de filtros dinámica
- `Dialog` - Modal para detalles
- `Badge` - Indicadores visuales de estado
- `Card` - Contenedores de información

### Hooks Personalizados

- `useResource` - Hook genérico para CRUD y listado

### Estilo Visual

- Badges de colores según acción:
  - Verde (default) para CREATED
  - Azul (secondary) para UPDATED
  - Rojo (destructive) para DELETED
- Preview de cambios con:
  - Texto tachado en rojo para valores antiguos
  - Texto en verde para valores nuevos
  - Flecha (→) indicando el cambio

## Mejoras Futuras

1. **Exportación de Logs**: Agregar funcionalidad para exportar a CSV/Excel
2. **Filtros Avanzados**: 
   - Rango de fechas con date picker
   - Filtro por usuario con autocompletado
3. **Búsqueda Global**: Búsqueda en todos los campos del json_log
4. **Estadísticas**: Dashboard con métricas de actividad
5. **Notificaciones**: Alertas para acciones críticas
6. **Auditoría**: Herramientas de auditoría avanzada

## Notas

- Los Activity Logs son **solo lectura** (no se pueden crear, editar o eliminar desde la UI)
- El sistema registra automáticamente todas las operaciones en modelos configurados
- La información se mantiene para auditoría y cumplimiento
