# Módulo de Expediente de Alumno

Este módulo proporciona una interfaz completa para gestionar el expediente de un alumno, incluyendo información personal, inscripciones, calificaciones, factores de riesgo y asistencias.

## Características

### Backend (Laravel)

#### Endpoints API

1. **GET /api/alumnos/{alumno}** - Obtener alumno con todas sus relaciones
   - Retorna el alumno con eager loading de:
     - Usuario
     - Carrera
     - Inscripciones → Grupo → Materia → Unidades
     - Inscripciones → Grupo → Profesor
     - Inscripciones → Grupo → Periodo
     - Inscripciones → Calificaciones → Unidad
     - Inscripciones → Factores → Factor
     - Inscripciones → Asistencias

2. **PUT /api/alumnos/{alumno}** - Actualizar información personal del alumno
   - Campos: nombre, apellidos, matrícula, semestre, carrera_id, género, modalidad, estatus_alumno

3. **POST /api/inscripciones** - Inscribir alumno a un grupo
   - Body: `{ "alumno_id": X, "grupo_id": Y }`

4. **DELETE /api/inscripciones/{inscripcion}** - Dar de baja de un grupo

5. **POST /api/inscripciones/{inscripcion}/calificaciones-bulk** - Actualizar calificaciones en bulk
   - Body: 
   ```json
   {
     "calificaciones": [
       { "unidad_id": 1, "valor_calificacion": 90 },
       { "unidad_id": 2, "valor_calificacion": 85 }
     ],
     "calificacion_final": 87.5
   }
   ```

6. **POST /api/alumnos-factores** - Añadir factor de riesgo a una inscripción
   - Body: `{ "inscripcion_id": X, "factor_id": Y, "observaciones": "..." }`

7. **DELETE /api/alumnos-factores/{alumnoFactor}** - Eliminar factor de riesgo

8. **PUT /api/usuarios/{usuario}** - Actualizar cuenta de usuario
   - Body: `{ "email": "...", "password": "...", "password_confirmation": "..." }`

#### Modelos Actualizados

- **Alumno**: Añadido campo `estatus_alumno` en fillable
- **Inscripcion**: Añadida relación `factores()` para acceso directo a factores de riesgo
- **AlumnoController**: Método `show()` con eager loading completo
- **CalificacionController**: Nuevo método `storeBulk()` para actualización masiva
- **UsuarioController**: Nuevo controlador para gestión de usuarios

### Frontend (Next.js)

#### Página Principal
**Ruta**: `/admin/alumnos/[id]`

La página principal carga todos los datos del alumno mediante una consulta única y los distribuye en pestañas (tabs).

#### Componentes

1. **AlumnoHeader** (`/components/alumnos/alumno-header.tsx`)
   - Muestra nombre completo, matrícula, carrera y semestre
   - Badge de estatus con colores dinámicos (activo, baja temporal, baja definitiva, egresado)

2. **AlumnoInfoForm** (`/components/alumnos/alumno-info-form.tsx`)
   - Formulario para editar información personal
   - Validación con Zod
   - Campos: nombre, apellidos, matrícula, semestre, carrera, género, modalidad, estatus
   - Usa `DynamicSelect` para selección de carrera

3. **AlumnoInscripcionesManager** (`/components/alumnos/alumno-inscripciones-manager.tsx`)
   - Accordion con todas las inscripciones del alumno
   - Cada item muestra: materia, profesor, calificación final
   - Formulario de calificaciones por unidad
   - Botones para:
     - Guardar calificaciones
     - Dar de baja de grupo (con confirmación)
     - Inscribir a nuevo grupo (dialog)

4. **AlumnoFactoresManager** (`/components/alumnos/alumno-factores-manager.tsx`)
   - Selector de inscripción
   - Lista de factores de riesgo asignados
   - Botón para añadir nuevo factor (dialog con DynamicSelect)
   - Botón para eliminar factor (con confirmación)
   - Muestra observaciones y fecha de registro

5. **AlumnoAsistenciasView** (`/components/alumnos/alumno-asistencias-view.tsx`)
   - Selector de inscripción
   - Estadísticas: total, presentes, faltas, % asistencia
   - Tabla con historial de asistencias ordenado por fecha
   - Badges de colores por estatus (presente, falta, justificado)

6. **AlumnoCuentaForm** (`/components/alumnos/alumno-cuenta-form.tsx`)
   - Formulario para actualizar email
   - Cambio de contraseña opcional
   - Validación de confirmación de contraseña
   - Alerta si el alumno no tiene cuenta de usuario

#### Servicios API

Nuevas funciones en `apiService.ts`:
- `getAlumnoDetallado(alumnoId)`: Obtiene alumno con todas sus relaciones
- `updateCalificacionesBulk(inscripcionId, data)`: Actualiza calificaciones en bulk
- `updateUsuario(usuarioId, data)`: Actualiza email y contraseña de usuario

#### Componentes UI de Shadcn/ui Añadidos

- **Tabs**: Para la navegación entre secciones
- **Accordion**: Para el listado de inscripciones colapsable

## Uso

### Acceder al Expediente

Para acceder al expediente de un alumno, navega a:
```
/admin/alumnos/{id}
```

Donde `{id}` es el ID del alumno.

### Flujo de Trabajo Típico

1. **Ver Información General**: Tab "Información"
   - Editar datos personales del alumno
   - Cambiar estatus (activo, baja temporal, etc.)

2. **Gestionar Inscripciones**: Tab "Inscripciones y Calificaciones"
   - Inscribir a nuevos grupos
   - Capturar calificaciones por unidad
   - Actualizar calificación final
   - Dar de baja de grupos

3. **Asignar Factores de Riesgo**: Tab "Factores de Riesgo"
   - Seleccionar inscripción
   - Añadir factores de riesgo
   - Añadir observaciones
   - Eliminar factores no aplicables

4. **Consultar Asistencias**: Tab "Asistencias"
   - Ver estadísticas de asistencia
   - Revisar historial completo

5. **Gestionar Cuenta**: Tab "Cuenta"
   - Actualizar email de acceso
   - Cambiar contraseña

## Validaciones

### Backend
- Email único por usuario
- Matrícula única por alumno
- Contraseña mínimo 8 caracteres
- Calificaciones entre 0 y 100
- Validación de existencia de relaciones (carrera_id, grupo_id, etc.)

### Frontend
- Validación de formularios con Zod
- Confirmaciones para acciones destructivas (eliminar)
- Feedback inmediato con toasts (sonner)
- Re-validación automática de queries tras mutaciones

## Dependencias

### Backend
- Laravel 10+
- Spatie Query Builder (para filtros)
- Route Model Binding habilitado

### Frontend
- Next.js 14+
- React Hook Form
- Zod
- TanStack Query (React Query)
- Shadcn/ui
- Sonner (para toasts)
- Radix UI (componentes primitivos)

## Notas Importantes

1. **Relaciones Anidadas**: El endpoint de show carga todas las relaciones de forma anidada para evitar múltiples requests.

2. **Optimización**: Se usa eager loading en el backend para evitar el problema N+1.

3. **Invalidación de Cache**: Después de cada mutación, se invalida la query del alumno para refrescar los datos automáticamente.

4. **Seguridad**: Todas las rutas requieren autenticación (`auth:sanctum` middleware).

5. **Permisos**: El módulo asume que el usuario tiene permisos de administrador. Se recomienda añadir verificación de permisos según sea necesario.

## Posibles Mejoras Futuras

- [ ] Añadir permisos granulares (quién puede editar qué)
- [ ] Historial de cambios (audit trail)
- [ ] Exportar expediente a PDF
- [ ] Gráficas de rendimiento académico
- [ ] Comparativa con promedios del grupo
- [ ] Notificaciones automáticas por email
- [ ] Sistema de comentarios/notas del tutor
