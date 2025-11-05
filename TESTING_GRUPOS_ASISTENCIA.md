# Guía de Pruebas - Gestión de Grupos y Asistencias

## Requisitos Previos

1. Base de datos configurada con:
   - Al menos un grupo creado
   - Alumnos inscritos en ese grupo (registros en tabla `inscripciones`)
   - Token de autenticación válido

2. Servicios en ejecución:
   ```bash
   # Terminal 1 - Laravel Backend
   cd apps/laravel
   php artisan serve
   
   # Terminal 2 - Next.js Frontend
   cd apps/nextjs
   npm run dev
   ```

## Pruebas Backend

### 1. Obtener Alumnos de un Grupo

**Endpoint**: `GET /api/grupos/{id}/alumnos`

```bash
# Usando curl
curl -X GET "http://localhost:8000/api/grupos/1/alumnos" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

**Respuesta Esperada**: Status 200
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

**Casos de Prueba**:
- ✅ Grupo con alumnos inscritos
- ✅ Grupo sin alumnos (debe retornar array vacío)
- ❌ Grupo inexistente (debe retornar 404)

### 2. Obtener Asistencias por Fecha

**Endpoint**: `GET /api/grupos/{id}/asistencias?fecha=2025-11-04`

```bash
curl -X GET "http://localhost:8000/api/grupos/1/asistencias?fecha=2025-11-04" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

**Respuesta Esperada**: Status 200
```json
{
  "10": {
    "id": 1,
    "inscripcion_id": 10,
    "fecha": "2025-11-04",
    "estatus": "presente",
    "created_at": "2025-11-04T10:00:00.000000Z",
    "updated_at": "2025-11-04T10:00:00.000000Z"
  },
  "11": {
    "id": 2,
    "inscripcion_id": 11,
    "fecha": "2025-11-04",
    "estatus": "ausente",
    "created_at": "2025-11-04T10:00:00.000000Z",
    "updated_at": "2025-11-04T10:00:00.000000Z"
  }
}
```

**Casos de Prueba**:
- ✅ Fecha con asistencias registradas
- ✅ Fecha sin asistencias (debe retornar objeto vacío {})
- ✅ Sin parámetro fecha (debe usar fecha actual)

### 3. Guardar Asistencias en Lote

**Endpoint**: `POST /api/grupos/{id}/asistencias/bulk`

```bash
curl -X POST "http://localhost:8000/api/grupos/1/asistencias/bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
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
  }'
```

**Respuesta Esperada**: Status 200
```json
{
  "message": "Asistencias guardadas correctamente",
  "fecha": "2025-11-04",
  "total": 3
}
```

**Casos de Prueba**:

✅ **Casos Exitosos**:
- Crear asistencias nuevas
- Actualizar asistencias existentes
- Mezcla de estados (presente, ausente, retardo)

❌ **Casos de Error**:
- Fecha faltante (422)
- Array de asistencias vacío (422)
- inscripcion_id inexistente (422)
- inscripcion_id que no pertenece al grupo (422)
- Estado inválido (422)

**Ejemplo de Error**:
```json
{
  "message": "Algunas inscripciones no pertenecen a este grupo"
}
```

## Pruebas Frontend

### 1. Navegación a Grupos

1. Iniciar sesión en la aplicación
2. Navegar a `/admin/grupos`
3. Verificar que la tabla de grupos se carga correctamente
4. Buscar el botón "Ver Grupo y Asistencia" en las acciones de cada fila

**Resultado Esperado**:
- ✅ Tabla de grupos visible
- ✅ Acción personalizada presente en el menú de acciones
- ✅ Click en la acción redirige a `/admin/grupos/{id}`

### 2. Visualización de Grupo

1. Click en "Ver Grupo y Asistencia" de cualquier grupo
2. Esperar a que cargue la página

**Resultado Esperado**:
- ✅ Card con información del grupo (materia, profesor, periodo, aula)
- ✅ Selector de fecha con fecha actual seleccionada
- ✅ Tabla de alumnos con datos correctos
- ✅ Selectores de asistencia para cada alumno
- ✅ Estadísticas mostrando contadores en 0 o con datos existentes

### 3. Tomar Asistencia

1. En la página del grupo, verificar la fecha (hoy por defecto)
2. Para cada alumno, seleccionar un estado:
   - Algunos "Presente"
   - Algunos "Ausente"
   - Algunos "Retardo"
3. Observar que las estadísticas se actualicen en tiempo real
4. Click en el botón "Guardar"

**Resultado Esperado**:
- ✅ Estadísticas se actualizan al cambiar estados
- ✅ Botón "Guardar" cambia a "Guardando..." durante la operación
- ✅ Toast de éxito aparece: "Asistencias guardadas correctamente"
- ✅ Datos se mantienen después de guardar

### 4. Editar Asistencia Existente

1. Cambiar la fecha a una fecha pasada donde ya hay asistencias
2. Esperar a que cargue
3. Verificar que los selectores muestran los estados guardados
4. Modificar algunos estados
5. Guardar nuevamente

**Resultado Esperado**:
- ✅ Carga correcta de asistencias existentes
- ✅ Selectores muestran los estados correctos
- ✅ Actualización exitosa con toast de confirmación

### 5. Cambio de Fecha

1. Click en el selector de fecha
2. Seleccionar una fecha diferente en el calendario
3. Esperar a que se recarguen las asistencias

**Resultado Esperado**:
- ✅ Calendario se abre correctamente
- ✅ Fecha seleccionada se refleja en el botón
- ✅ Tabla de asistencias se recarga automáticamente
- ✅ Si no hay asistencias para esa fecha, todos aparecen como "Ausente"

### 6. Estados de Carga

1. Navegar a un grupo
2. Observar los skeletons mientras carga
3. Cambiar de fecha
4. Observar el skeleton en la tabla de asistencia

**Resultado Esperado**:
- ✅ Skeletons aparecen durante la carga inicial
- ✅ Skeleton específico en la tabla durante cambio de fecha
- ✅ UI no se bloquea durante las operaciones

### 7. Manejo de Errores

1. **Sin conexión**:
   - Desconectar internet
   - Intentar guardar asistencias
   - Verificar mensaje de error

2. **Token expirado**:
   - Borrar localStorage
   - Intentar cargar la página
   - Verificar redirección a login

3. **Grupo sin alumnos**:
   - Navegar a un grupo vacío
   - Verificar mensaje: "No hay alumnos inscritos en este grupo"

**Resultado Esperado**:
- ✅ Mensajes de error apropiados
- ✅ No crashes de la aplicación
- ✅ UI permanece responsiva

## Datos de Prueba Recomendados

### Crear Grupo de Prueba

```sql
-- Grupo
INSERT INTO grupos (materia_id, profesor_id, periodo_id, carrera_id, horario, aula)
VALUES (1, 1, 1, 1, 'Lun-Mie-Vie 8:00-10:00', 'Aula 201');

-- Inscripciones (varios alumnos)
INSERT INTO inscripciones (alumno_id, grupo_id)
VALUES 
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (5, 1);
```

### Crear Asistencias de Prueba

```sql
-- Asistencias para hoy
INSERT INTO asistencias (inscripcion_id, fecha, estatus)
VALUES
  (1, CURDATE(), 'presente'),
  (2, CURDATE(), 'ausente'),
  (3, CURDATE(), 'retardo'),
  (4, CURDATE(), 'presente'),
  (5, CURDATE(), 'presente');

-- Asistencias para fecha pasada
INSERT INTO asistencias (inscripcion_id, fecha, estatus)
VALUES
  (1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'presente'),
  (2, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'presente'),
  (3, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'ausente'),
  (4, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'presente'),
  (5, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'retardo');
```

## Checklist de Pruebas

### Backend
- [ ] Endpoint de alumnos retorna datos correctos
- [ ] Endpoint de asistencias retorna datos correctos
- [ ] Guardado de asistencias funciona
- [ ] Validaciones rechazan datos inválidos
- [ ] Restricción única (inscripcion_id, fecha) funciona
- [ ] Actualización de asistencias existentes funciona

### Frontend
- [ ] Navegación desde lista de grupos funciona
- [ ] Carga de información del grupo correcta
- [ ] Carga de lista de alumnos correcta
- [ ] Selector de fecha funciona
- [ ] Cambio de fecha recarga asistencias
- [ ] Estadísticas se actualizan en tiempo real
- [ ] Guardado de asistencias funciona
- [ ] Toast notifications aparecen
- [ ] Estados de carga (skeletons) funcionan
- [ ] Manejo de errores apropiado
- [ ] UI responsive en móvil
- [ ] Accesibilidad básica (navegación por teclado)

### Integración
- [ ] Flujo completo: navegación → ver → modificar → guardar
- [ ] Datos persisten después de recargar página
- [ ] Múltiples cambios de fecha funcionan
- [ ] Edición de asistencias pasadas funciona
- [ ] Comportamiento correcto con grupo vacío

## Problemas Conocidos y Soluciones

### Problema: "Error al cargar asistencias"
**Solución**: Verificar que el token esté vigente en localStorage

### Problema: No aparecen alumnos
**Solución**: Verificar que existan inscripciones en la tabla para ese grupo

### Problema: Error 422 al guardar
**Solución**: Verificar que todos los `inscripcion_id` sean válidos y pertenezcan al grupo

### Problema: Selectores no se actualizan al cambiar fecha
**Solución**: Verificar que React Query esté invalidando el cache correctamente

## Métricas de Éxito

- ✅ Tiempo de carga inicial < 2 segundos
- ✅ Tiempo de guardado < 1 segundo
- ✅ Sin errores en consola del navegador
- ✅ Sin errores en logs de Laravel
- ✅ UI responsiva y fluida
- ✅ 100% de las validaciones funcionando
- ✅ Datos consistentes entre frontend y backend
