# Guía Rápida de Instalación - Módulo de Expediente de Alumno

## Requisitos Previos

- ✅ Backend Laravel corriendo en `http://localhost:8000`
- ✅ Frontend Next.js configurado
- ✅ Base de datos PostgreSQL con migraciones aplicadas
- ✅ Autenticación con Sanctum configurada

## Instalación en 3 Pasos

### 1. Instalar Dependencias del Frontend

```bash
cd apps/nextjs
npm install @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-icons
```

### 2. Reiniciar el Servidor de Desarrollo

```bash
# Terminal 1 - Backend
cd apps/laravel
php artisan serve

# Terminal 2 - Frontend
cd apps/nextjs
npm run dev
```

### 3. Verificar la Instalación

1. Inicia sesión en la aplicación
2. Navega a `/admin/alumnos/1` (o cualquier ID válido de alumno)
3. Verifica que se carguen las 5 pestañas:
   - Información
   - Inscripciones y Calificaciones
   - Factores de Riesgo
   - Asistencias
   - Cuenta

## URLs de Acceso

### Desarrollo
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Expediente**: http://localhost:3000/admin/alumnos/[id]

## Verificación de Endpoints

Puedes probar los endpoints directamente con curl o Postman:

```bash
# 1. Obtener alumno detallado (requiere autenticación)
curl http://localhost:8000/api/v1/alumnos/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Actualizar alumno
curl -X PUT http://localhost:8000/api/v1/alumnos/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido_paterno":"Pérez","estatus_alumno":"activo"}'

# 3. Inscribir a grupo
curl -X POST http://localhost:8000/api/v1/inscripciones \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alumno_id":1,"grupo_id":5}'

# 4. Actualizar calificaciones
curl -X POST http://localhost:8000/api/v1/inscripciones/1/calificaciones-bulk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"calificaciones":[{"unidad_id":1,"valor_calificacion":90}],"calificacion_final":90}'
```

## Solución de Problemas Comunes

### Error: "Cannot find module '@/components/alumnos/...'"

**Solución**: Reinicia el servidor de desarrollo de Next.js
```bash
# Ctrl+C para detener
npm run dev
```

### Error: "Cannot find module '@radix-ui/react-tabs'"

**Solución**: Instala las dependencias faltantes
```bash
npm install @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-icons
```

### Error 401 Unauthorized

**Solución**: Verifica que:
1. Estás autenticado (cookie de sesión válida)
2. El token CSRF es correcto
3. El middleware `auth:sanctum` está configurado

### Error: "Alumno not found"

**Solución**: Verifica que:
1. El ID del alumno existe en la base de datos
2. Tienes permisos para ver ese alumno
3. La URL es correcta: `/admin/alumnos/[id]`

### Error de CORS

**Solución**: Verifica en `apps/laravel/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### Las calificaciones no se guardan

**Solución**: Verifica que:
1. Las unidades existen en la materia del grupo
2. El formato de las calificaciones es correcto (array de objetos)
3. Los valores están entre 0 y 100

## Testing Manual Recomendado

### Test 1: Información Personal
1. ✅ Editar nombre del alumno
2. ✅ Cambiar estatus a "Baja Temporal"
3. ✅ Verificar que el badge cambia de color
4. ✅ Guardar y verificar toast de éxito

### Test 2: Inscripciones
1. ✅ Inscribir a un nuevo grupo
2. ✅ Capturar calificaciones por unidad
3. ✅ Actualizar calificación final
4. ✅ Dar de baja (con confirmación)

### Test 3: Factores de Riesgo
1. ✅ Seleccionar una inscripción
2. ✅ Añadir un factor de riesgo
3. ✅ Añadir observaciones
4. ✅ Eliminar un factor (con confirmación)

### Test 4: Asistencias
1. ✅ Seleccionar una inscripción
2. ✅ Verificar estadísticas
3. ✅ Verificar tabla de asistencias
4. ✅ Verificar badges de colores

### Test 5: Cuenta
1. ✅ Actualizar email
2. ✅ Cambiar contraseña
3. ✅ Verificar validación de confirmación

## Configuración Adicional (Opcional)

### Habilitar Auditoría de Cambios

Si quieres registrar todos los cambios, verifica que el trait `LogsActivity` esté funcionando:

```php
// En los modelos ya está incluido
use App\Traits\LogsActivity;

class Alumno extends Model
{
    use HasFactory, LogsActivity;
    // ...
}
```

### Configurar Permisos

Si necesitas restringir acceso:

```php
// En routes/api.php
Route::middleware(['auth:sanctum', 'can:manage-students'])->group(function () {
    Route::get('/alumnos/{alumno}', [AlumnoController::class, 'show']);
    // ...
});
```

### Optimizar Queries

Para mejor rendimiento en producción, considera:

```php
// En AlumnoController
public function show(Alumno $alumno): JsonResponse
{
    $alumno->loadMissing([
        'usuario:id,email',
        'carrera:id,nombre',
        // Solo campos necesarios
    ]);
    // ...
}
```

## Backup de Base de Datos

Antes de probar en producción:

```bash
# PostgreSQL
pg_dump -U postgres nombre_db > backup_antes_expediente.sql

# Restaurar si algo sale mal
psql -U postgres nombre_db < backup_antes_expediente.sql
```

## Checklist de Producción

Antes de desplegar:

- [ ] Todas las dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Migraciones aplicadas
- [ ] Seeds ejecutados (si es necesario)
- [ ] Permisos configurados
- [ ] CORS configurado correctamente
- [ ] URLs de producción actualizadas
- [ ] SSL habilitado
- [ ] Backup de base de datos realizado
- [ ] Tests manuales completados
- [ ] Documentación actualizada

## Contacto y Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs de Laravel (`storage/logs/laravel.log`)
3. Verifica las network requests en DevTools
4. Consulta la documentación en `EXPEDIENTE_ALUMNO_README.md`

---

**¡Listo! El módulo de Expediente de Alumno está completo y funcionando.** 🎉
