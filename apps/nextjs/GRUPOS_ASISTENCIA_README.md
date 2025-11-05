# Gestión de Grupos y Asistencias

Esta documentación describe la funcionalidad para visualizar los alumnos de un grupo y registrar asistencias diarias.

## Características

### Backend (Laravel)

#### Nuevos Endpoints

1. **Obtener alumnos de un grupo**
   - **Ruta**: `GET /api/grupos/{grupo}/alumnos`
   - **Descripción**: Retorna todos los alumnos inscritos en un grupo específico
   - **Respuesta**: Array de alumnos con su información completa
   ```json
   [
     {
       "id": 1,
       "inscripcion_id": 10,
       "matricula": "20230001",
       "nombre": "Juan",
       "apellido_paterno": "Pérez",
       "apellido_materno": "García",
       "nombre_completo": "Juan Pérez García",
       "semestre": 5,
       "carrera": "Ingeniería en Sistemas",
       "calificacion_final": 85.5
     }
   ]
   ```

2. **Obtener asistencias por fecha**
   - **Ruta**: `GET /api/grupos/{grupo}/asistencias?fecha=YYYY-MM-DD`
   - **Descripción**: Obtiene las asistencias registradas para una fecha específica
   - **Parámetros**:
     - `fecha` (opcional): Fecha en formato YYYY-MM-DD. Si no se proporciona, usa la fecha actual
   - **Respuesta**: Objeto con las asistencias indexadas por `inscripcion_id`

3. **Guardar asistencias en lote**
   - **Ruta**: `POST /api/grupos/{grupo}/asistencias/bulk`
   - **Descripción**: Guarda o actualiza múltiples asistencias de una vez
   - **Cuerpo de la petición**:
   ```json
   {
     "fecha": "2025-11-04",
     "asistencias": [
       {
         "inscripcion_id": 10,
         "estatus": "presente"
       },
       {
         "inscripcion_id": 11,
         "estatus": "ausente"
       },
       {
         "inscripcion_id": 12,
         "estatus": "retardo"
       }
     ]
   }
   ```
   - **Validaciones**:
     - `fecha`: Requerida, debe ser una fecha válida
     - `asistencias`: Requerido, array
     - `asistencias.*.inscripcion_id`: Requerido, debe existir en la tabla `inscripciones`
     - `asistencias.*.estatus`: Requerido, valores permitidos: `presente`, `ausente`, `retardo`

#### Métodos en GrupoController

```php
// Obtener alumnos del grupo
public function getAlumnos(Grupo $grupo): JsonResponse

// Obtener asistencias por fecha
public function getAsistenciasByFecha(Request $request, Grupo $grupo): JsonResponse

// Guardar asistencias en lote
public function saveAsistenciasBulk(Request $request, Grupo $grupo): JsonResponse
```

### Frontend (Next.js)

#### Configuración de Recursos

Se agregó una función en `grupos.config.ts` para crear acciones personalizadas:

```typescript
export const createGrupoCustomActions = (router: any) => [
  {
    label: "Ver Grupo y Asistencia",
    onClick: (row: Grupo) => {
      router.push(`/admin/grupos/${row.id}`);
    },
  },
];
```

Esta acción aparece en la tabla de grupos y permite navegar a la página de detalle.

#### Página de Detalle del Grupo

**Ruta**: `/admin/grupos/[id]/page.tsx`

La página incluye:

1. **Información del Grupo**
   - Materia
   - Profesor
   - Periodo
   - Aula
   - Horario

2. **Selector de Fecha**
   - Calendario interactivo
   - Formato localizado en español
   - Permite seleccionar cualquier fecha para ver/editar asistencias

3. **Estadísticas de Asistencia**
   - Total de presentes (verde)
   - Total de ausentes (rojo)
   - Total de retardos (amarillo)

4. **Tabla de Alumnos**
   Columnas:
   - Matrícula
   - Nombre Completo
   - Semestre
   - Carrera
   - Selector de Asistencia (Presente/Ausente/Retardo)

5. **Funcionalidades**
   - Carga automática de asistencias existentes para la fecha seleccionada
   - Actualización en tiempo real de las estadísticas al cambiar estados
   - Guardado en lote de todas las asistencias
   - Indicadores de carga mientras se procesan las peticiones
   - Mensajes de éxito/error con toast notifications

## Estructura de Datos

### Modelo Asistencia

```php
Schema::create('asistencias', function (Blueprint $table) {
    $table->id();
    $table->foreignId('inscripcion_id')->constrained('inscripciones')->cascadeOnDelete();
    $table->date('fecha');
    $table->enum('estatus', ['presente', 'ausente', 'retardo']);
    $table->timestamps();

    $table->unique(['inscripcion_id', 'fecha']);
});
```

- Relación con `inscripciones` (no directamente con alumnos)
- Restricción única: un alumno solo puede tener un registro de asistencia por fecha
- Estados posibles: `presente`, `ausente`, `retardo`

## Flujo de Uso

1. **Acceder a la lista de grupos**
   - Navegar a `/admin/grupos`
   - Ver la tabla con todos los grupos

2. **Seleccionar un grupo**
   - Click en "Ver Grupo y Asistencia" en las acciones de la fila
   - Se redirige a `/admin/grupos/{id}`

3. **Visualizar información del grupo**
   - Ver detalles: materia, profesor, periodo, aula, horario
   - Ver lista completa de alumnos inscritos

4. **Tomar asistencia**
   - Seleccionar la fecha (por defecto es hoy)
   - Para cada alumno, seleccionar: Presente, Ausente o Retardo
   - Ver estadísticas en tiempo real
   - Click en "Guardar" para registrar las asistencias

5. **Consultar asistencias pasadas**
   - Cambiar la fecha en el calendario
   - La tabla se actualiza automáticamente con los registros de esa fecha
   - Editar si es necesario y guardar nuevamente

## Características Técnicas

### Estado y Caché

- Uso de React Query para gestión de estado del servidor
- Cache automático de datos del grupo y alumnos
- Invalidación de cache al guardar asistencias
- Optimistic updates para mejor UX

### Validaciones

- Validación de que todas las inscripciones pertenecen al grupo
- Validación de formato de fecha
- Validación de estados de asistencia permitidos
- Manejo de errores con mensajes descriptivos

### Diseño Responsive

- Layout adaptable a diferentes tamaños de pantalla
- Grid system con Tailwind CSS
- Componentes de shadcn/ui para consistencia visual

## Dependencias

### Backend
- Laravel 11
- Spatie Query Builder (para filtros y búsquedas)

### Frontend
- Next.js 14 (App Router)
- React Query (TanStack Query)
- shadcn/ui components
- date-fns (manejo de fechas)
- Tailwind CSS
- Sonner (toast notifications)

## Mejoras Futuras

- [ ] Exportar reporte de asistencias por grupo
- [ ] Gráficas de tendencias de asistencia
- [ ] Notificaciones automáticas por faltas consecutivas
- [ ] Registro rápido (marcar todos como presentes con excepciones)
- [ ] Historial de asistencias por alumno
- [ ] Integración con sistema de justificantes
- [ ] Vista de calendario mensual con resumen de asistencias
