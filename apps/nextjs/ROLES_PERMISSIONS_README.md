# Sistema de Roles y Permisos

Este módulo implementa un sistema completo de gestión de roles, permisos y usuarios utilizando Spatie Laravel Permission en el backend y una interfaz dinámica en Next.js.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Roles Predefinidos](#roles-predefinidos)
- [Permisos Disponibles](#permisos-disponibles)
- [Uso en Frontend](#uso-en-frontend)
- [API Endpoints](#api-endpoints)
- [Seeders](#seeders)

## ✨ Características

- ✅ Gestión completa de usuarios, roles y permisos
- ✅ Asignación de múltiples roles a usuarios
- ✅ Asignación de múltiples permisos a roles
- ✅ Interfaz de usuario dinámica y fácil de usar
- ✅ Filtros y búsqueda avanzada
- ✅ Roles y permisos predefinidos
- ✅ Sistema de autenticación integrado

## 🚀 Instalación

### Backend (Laravel)

1. Las migraciones de Spatie Permission ya están ejecutadas. Si necesitas ejecutarlas nuevamente:

```bash
cd apps/laravel
php artisan migrate
```

2. Ejecuta los seeders para crear roles, permisos y usuarios de prueba:

```bash
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=UserSeeder
```

O ejecuta todos los seeders:

```bash
php artisan db:seed
```

### Frontend (Next.js)

Las configuraciones ya están creadas y registradas. El sistema funcionará automáticamente con la interfaz dinámica existente.

## 👥 Roles Predefinidos

El sistema incluye los siguientes roles predefinidos:

### 1. Super Administrador
- **Descripción**: Acceso total al sistema
- **Permisos**: Todos los permisos disponibles
- **Usuario de prueba**: `superadmin@tecnm.mx` / `password123`

### 2. Administrador
- **Descripción**: Gestión completa excepto administración de usuarios
- **Permisos**: 
  - Gestión completa de alumnos, profesores, materias, carreras, periodos, grupos
  - Gestión de factores de riesgo, calificaciones, asistencias
  - Acceso a reportes, dashboard, analytics
  - Gestión de análisis Ishikawa
  - Visualización de activity logs
- **Usuario de prueba**: `admin@tecnm.mx` / `password123`

### 3. Coordinador
- **Descripción**: Gestión académica
- **Permisos**:
  - Crear y editar alumnos, profesores, materias, grupos
  - Ver periodos y carreras
  - Gestión completa de calificaciones y asistencias
  - Gestión de factores de riesgo
  - Acceso a reportes y analytics
  - Gestión de análisis Ishikawa
- **Usuario de prueba**: `coordinador@tecnm.mx` / `password123`

### 4. Profesor
- **Descripción**: Gestión de sus grupos y estudiantes
- **Permisos**:
  - Ver alumnos, materias, grupos
  - Gestión de calificaciones y asistencias
  - Ver factores de riesgo
  - Acceso a reportes y dashboard
- **Usuarios de prueba**: `profesor1@tecnm.mx` a `profesor5@tecnm.mx` / `password123`

### 5. Secretaria
- **Descripción**: Acceso de lectura principalmente, gestión básica de alumnos
- **Permisos**:
  - Crear y editar alumnos
  - Ver profesores, materias, grupos, periodos, carreras
  - Ver calificaciones y asistencias
  - Acceso a reportes
- **Usuario de prueba**: `secretaria@tecnm.mx` / `password123`

### 6. Estudiante
- **Descripción**: Acceso muy limitado, solo consulta
- **Permisos**:
  - Ver materias y grupos
  - Ver sus propias calificaciones y asistencias

## 🔐 Permisos Disponibles

El sistema incluye permisos organizados por módulo:

### Alumnos
- `ver-alumnos`, `crear-alumnos`, `editar-alumnos`, `eliminar-alumnos`, `importar-alumnos`

### Profesores
- `ver-profesores`, `crear-profesores`, `editar-profesores`, `eliminar-profesores`

### Materias
- `ver-materias`, `crear-materias`, `editar-materias`, `eliminar-materias`

### Carreras
- `ver-carreras`, `crear-carreras`, `editar-carreras`, `eliminar-carreras`

### Periodos
- `ver-periodos`, `crear-periodos`, `editar-periodos`, `eliminar-periodos`

### Grupos
- `ver-grupos`, `crear-grupos`, `editar-grupos`, `eliminar-grupos`

### Factores de Riesgo
- `ver-factores-riesgo`, `crear-factores-riesgo`, `editar-factores-riesgo`, `eliminar-factores-riesgo`

### Calificaciones
- `ver-calificaciones`, `crear-calificaciones`, `editar-calificaciones`, `eliminar-calificaciones`

### Asistencias
- `ver-asistencias`, `crear-asistencias`, `editar-asistencias`, `eliminar-asistencias`

### Reportes
- `ver-reportes`, `generar-reportes`

### Dashboard
- `ver-dashboard`, `ver-analytics`

### Análisis Ishikawa
- `ver-ishikawa`, `crear-ishikawa`, `editar-ishikawa`, `eliminar-ishikawa`

### Usuarios y Roles
- `ver-usuarios`, `crear-usuarios`, `editar-usuarios`, `eliminar-usuarios`
- `asignar-roles`
- `ver-roles`, `crear-roles`, `editar-roles`, `eliminar-roles`
- `ver-permisos`, `crear-permisos`, `editar-permisos`, `eliminar-permisos`

### Activity Logs
- `ver-activity-logs`

## 💻 Uso en Frontend

### Acceso a los Módulos

Los nuevos módulos están disponibles en el menú lateral bajo "Usuarios y Permisos":

1. **Usuarios** (`/admin/users`)
   - Lista de todos los usuarios del sistema
   - Crear y editar usuarios
   - Asignar roles a usuarios
   - Búsqueda y filtrado

2. **Roles** (`/admin/roles`)
   - Lista de todos los roles
   - Crear y editar roles
   - Asignar permisos a roles
   - Visualizar permisos asignados

3. **Permisos** (`/admin/permissions`)
   - Lista de todos los permisos
   - Crear nuevos permisos
   - Editar permisos existentes

### Formulario de Usuario

El formulario de usuario incluye:
- **Nombre**: Nombre completo del usuario
- **Email**: Correo electrónico único
- **Contraseña**: Mínimo 8 caracteres (opcional al editar)
- **Roles**: Selección múltiple de roles

### Formulario de Rol

El formulario de rol incluye:
- **Nombre del Rol**: Nombre descriptivo
- **Guard Name**: Generalmente "web"
- **Permisos**: Selección múltiple de permisos

### Formulario de Permiso

El formulario de permiso incluye:
- **Nombre del Permiso**: Nombre único en formato kebab-case
- **Guard Name**: Generalmente "web"

## 📡 API Endpoints

### Usuarios

```http
GET    /api/users              # Listar usuarios
POST   /api/users              # Crear usuario
GET    /api/users/{id}         # Ver usuario
PUT    /api/users/{id}         # Actualizar usuario
DELETE /api/users/{id}         # Eliminar usuario
POST   /api/users/{id}/assign-role    # Asignar rol
POST   /api/users/{id}/remove-role    # Remover rol
```

### Roles

```http
GET    /api/roles              # Listar roles
POST   /api/roles              # Crear rol
GET    /api/roles/{id}         # Ver rol
PUT    /api/roles/{id}         # Actualizar rol
DELETE /api/roles/{id}         # Eliminar rol
```

### Permisos

```http
GET    /api/permissions         # Listar permisos
POST   /api/permissions         # Crear permiso
GET    /api/permissions/{id}    # Ver permiso
PUT    /api/permissions/{id}    # Actualizar permiso
DELETE /api/permissions/{id}    # Eliminar permiso
```

### Parámetros de Query

Todos los endpoints soportan:
- `?search=texto` - Búsqueda por nombre/email
- `?per_page=15` - Paginación
- `?page=1` - Página actual
- `?include=roles,permissions` - Incluir relaciones

### Ejemplo de Request

**Crear usuario con roles:**

```json
POST /api/users
{
  "name": "Juan Pérez",
  "email": "juan@tecnm.mx",
  "password": "password123",
  "roles": [1, 2]
}
```

**Crear rol con permisos:**

```json
POST /api/roles
{
  "name": "Mi Rol Personalizado",
  "guard_name": "web",
  "permissions": [1, 2, 3, 4, 5]
}
```

## 🌱 Seeders

### RolesAndPermissionsSeeder

Crea todos los roles y permisos predefinidos del sistema.

```bash
php artisan db:seed --class=RolesAndPermissionsSeeder
```

### UserSeeder

Crea usuarios de prueba con diferentes roles:

```bash
php artisan db:seed --class=UserSeeder
```

Usuarios creados:
- `superadmin@tecnm.mx` - Super Administrador
- `admin@tecnm.mx` - Administrador
- `coordinador@tecnm.mx` - Coordinador
- `secretaria@tecnm.mx` - Secretaria
- `profesor1@tecnm.mx` a `profesor5@tecnm.mx` - Profesores
- `user1@tecnm.mx` a `user15@tecnm.mx` - Usuarios aleatorios con roles aleatorios

**Todas las contraseñas son**: `password123`

## 🔧 Uso Programático en Laravel

### Verificar Permisos

```php
// Verificar si un usuario tiene un permiso
if ($user->can('crear-alumnos')) {
    // El usuario puede crear alumnos
}

// Verificar si un usuario tiene un rol
if ($user->hasRole('Administrador')) {
    // El usuario es administrador
}

// Verificar múltiples permisos
if ($user->hasAnyPermission(['crear-alumnos', 'editar-alumnos'])) {
    // El usuario puede crear o editar alumnos
}
```

### Proteger Rutas con Middleware

```php
Route::middleware(['auth:sanctum', 'permission:crear-alumnos'])
    ->post('/api/alumnos', [AlumnoController::class, 'store']);

Route::middleware(['auth:sanctum', 'role:Administrador'])
    ->group(function () {
        // Rutas solo para administradores
    });
```

### Asignar Roles y Permisos

```php
// Asignar rol a usuario
$user->assignRole('Profesor');

// Asignar múltiples roles
$user->assignRole(['Profesor', 'Coordinador']);

// Sincronizar roles (reemplaza todos los roles anteriores)
$user->syncRoles(['Administrador']);

// Dar permiso directamente a usuario
$user->givePermissionTo('crear-alumnos');

// Dar permiso a rol
$role->givePermissionTo('ver-reportes');
```

## 📝 Notas Importantes

1. **Caché de Permisos**: Spatie Permission cachea los permisos. Si haces cambios directamente en la base de datos, limpia el caché:
   ```bash
   php artisan cache:forget spatie.permission.cache
   ```

2. **Guard Name**: Por defecto se usa `web`. Mantén consistencia en todos los roles y permisos.

3. **Nombres de Permisos**: Usa formato kebab-case (ej: `crear-alumnos`) para mantener consistencia.

4. **Nombres de Roles**: Usa nombres descriptivos en español con mayúsculas (ej: `Super Administrador`).

## 🐛 Troubleshooting

### Error: "Role does not exist"
Asegúrate de que los seeders se hayan ejecutado correctamente:
```bash
php artisan db:seed --class=RolesAndPermissionsSeeder
```

### Los permisos no se actualizan
Limpia el caché:
```bash
php artisan cache:clear
php artisan config:clear
```

### Error en el frontend: "Resource not found"
Verifica que las rutas API estén registradas:
```bash
php artisan route:list | grep roles
php artisan route:list | grep permissions
php artisan route:list | grep users
```

## 📚 Recursos Adicionales

- [Spatie Laravel Permission Documentation](https://spatie.be/docs/laravel-permission)
- [Laravel Authorization Documentation](https://laravel.com/docs/authorization)

---

Creado para TecNM - Sistema de Gestión Académica
