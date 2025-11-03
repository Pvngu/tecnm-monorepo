# Guía Rápida de Prueba - Sistema de Roles y Permisos

## 🚀 Pasos para Probar el Sistema

### 1. Preparar el Backend

```bash
cd apps/laravel

# Ejecutar seeders para crear roles, permisos y usuarios
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=UserSeeder

# Verificar que se crearon correctamente
php artisan tinker
>>> \Spatie\Permission\Models\Role::count()
>>> \Spatie\Permission\Models\Permission::count()
>>> App\Models\User::count()
>>> exit
```

### 2. Verificar Rutas API

```bash
# Verificar que las rutas estén registradas
php artisan route:list | grep users
php artisan route:list | grep roles
php artisan route:list | grep permissions
```

Deberías ver:
- `GET|HEAD   api/users`
- `POST       api/users`
- `GET|HEAD   api/users/{user}`
- `PUT|PATCH  api/users/{user}`
- `DELETE     api/users/{user}`
- `POST       api/users/{user}/assign-role`
- `POST       api/users/{user}/remove-role`
- Y lo mismo para roles y permissions

### 3. Probar Endpoints con cURL o Postman

**Nota**: Necesitas estar autenticado. Primero obtén un token:

```bash
# Login para obtener token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@tecnm.mx",
    "password": "password123"
  }'
```

Luego usa el token en las siguientes peticiones:

```bash
# Listar roles con permisos
curl -X GET "http://localhost:8000/api/roles?include=permissions" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Accept: application/json"

# Listar usuarios con roles
curl -X GET "http://localhost:8000/api/users?include=roles" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Accept: application/json"

# Listar permisos
curl -X GET "http://localhost:8000/api/permissions" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Accept: application/json"

# Crear un nuevo usuario
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Usuario de Prueba",
    "email": "prueba@tecnm.mx",
    "password": "password123",
    "roles": [4]
  }'

# Crear un nuevo rol
curl -X POST http://localhost:8000/api/roles \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Rol de Prueba",
    "guard_name": "web",
    "permissions": [1, 2, 3]
  }'
```

### 4. Probar en el Frontend

1. **Iniciar la aplicación Next.js:**

```bash
cd apps/nextjs
npm run dev
```

2. **Iniciar sesión:**
   - Ir a `http://localhost:3000/login`
   - Usuario: `superadmin@tecnm.mx`
   - Contraseña: `password123`

3. **Navegar al módulo de Usuarios:**
   - En el menú lateral, expandir "Usuarios y Permisos"
   - Click en "Usuarios"
   - URL: `http://localhost:3000/admin/users`

4. **Probar funcionalidades:**

   **a) Ver lista de usuarios:**
   - Deberías ver una tabla con todos los usuarios
   - Cada usuario muestra su nombre, email y roles asignados

   **b) Buscar usuarios:**
   - Usar la barra de búsqueda para filtrar por nombre o email

   **c) Crear nuevo usuario:**
   - Click en "Add New users"
   - Llenar el formulario:
     - Nombre: "Test User"
     - Email: "test@tecnm.mx"
     - Contraseña: "password123"
     - Roles: Seleccionar uno o más roles
   - Click en "Guardar"
   - Verificar que el usuario aparece en la lista

   **d) Editar usuario:**
   - Click en el menú de acciones (tres puntos)
   - Click en "Edit"
   - Cambiar el nombre o roles
   - Click en "Guardar"
   - Verificar que los cambios se reflejan

   **e) Eliminar usuario:**
   - Click en el menú de acciones
   - Click en "Delete"
   - Confirmar la eliminación
   - Verificar que el usuario desaparece de la lista

5. **Probar módulo de Roles:**
   - Click en "Roles" en el menú lateral
   - URL: `http://localhost:3000/admin/roles`

   **a) Ver lista de roles:**
   - Deberías ver 6 roles predefinidos

   **b) Crear nuevo rol:**
   - Click en "Add New roles"
   - Nombre: "Rol Personalizado"
   - Permisos: Seleccionar varios permisos
   - Click en "Guardar"

   **c) Editar rol:**
   - Editar un rol existente
   - Cambiar los permisos asignados
   - Verificar que se actualizan

6. **Probar módulo de Permisos:**
   - Click en "Permisos" en el menú lateral
   - URL: `http://localhost:3000/admin/permissions`

   **a) Ver lista de permisos:**
   - Deberías ver 80+ permisos organizados

   **b) Crear nuevo permiso:**
   - Click en "Add New permissions"
   - Nombre: "nuevo-permiso-prueba"
   - Guard: "web"
   - Click en "Guardar"

### 5. Verificar en la Base de Datos

```bash
# Conectar a la base de datos
php artisan tinker

# Verificar usuarios con roles
>>> $user = App\Models\User::with('roles')->find(1);
>>> $user->roles->pluck('name')

# Verificar rol con permisos
>>> $role = \Spatie\Permission\Models\Role::with('permissions')->first();
>>> $role->permissions->pluck('name')

# Verificar si un usuario tiene un permiso
>>> $user->can('crear-alumnos')

# Verificar si un usuario tiene un rol
>>> $user->hasRole('Super Administrador')

>>> exit
```

## ✅ Checklist de Prueba

### Backend
- [ ] Seeders ejecutados correctamente
- [ ] Roles creados (6 roles)
- [ ] Permisos creados (80+ permisos)
- [ ] Usuarios de prueba creados
- [ ] Rutas API registradas
- [ ] Endpoints de usuarios funcionan
- [ ] Endpoints de roles funcionan
- [ ] Endpoints de permisos funcionan

### Frontend
- [ ] Menú "Usuarios y Permisos" visible en sidebar
- [ ] Página de usuarios carga correctamente
- [ ] Página de roles carga correctamente
- [ ] Página de permisos carga correctamente
- [ ] Formulario de usuario funciona
- [ ] Formulario de rol funciona
- [ ] Formulario de permiso funciona
- [ ] Búsqueda y filtros funcionan
- [ ] Paginación funciona
- [ ] Acciones de editar/eliminar funcionan

## 🐛 Problemas Comunes

### "Role does not exist" al ejecutar seeder
**Solución:**
```bash
php artisan cache:clear
php artisan config:clear
php artisan db:seed --class=RolesAndPermissionsSeeder
```

### Formulario no carga los roles/permisos
**Posibles causas:**
1. Backend no está corriendo
2. Rutas API no están registradas
3. Token de autenticación expiró

**Solución:**
```bash
# Verificar backend
cd apps/laravel
php artisan serve

# Verificar rutas
php artisan route:list | grep -E "users|roles|permissions"

# Limpiar caché
php artisan cache:clear
```

### Error 500 al crear usuario/rol
**Verificar:**
1. Migraciones de Spatie Permission ejecutadas
2. Seeders ejecutados
3. Logs de Laravel: `tail -f apps/laravel/storage/logs/laravel.log`

## 📊 Datos de Prueba

### Usuarios Predefinidos

| Email | Contraseña | Rol |
|-------|-----------|-----|
| superadmin@tecnm.mx | password123 | Super Administrador |
| admin@tecnm.mx | password123 | Administrador |
| coordinador@tecnm.mx | password123 | Coordinador |
| secretaria@tecnm.mx | password123 | Secretaria |
| profesor1@tecnm.mx | password123 | Profesor |
| profesor2@tecnm.mx | password123 | Profesor |
| profesor3@tecnm.mx | password123 | Profesor |
| profesor4@tecnm.mx | password123 | Profesor |
| profesor5@tecnm.mx | password123 | Profesor |

### Roles Predefinidos

1. Super Administrador (80+ permisos)
2. Administrador (60+ permisos)
3. Coordinador (40+ permisos)
4. Profesor (15+ permisos)
5. Secretaria (10+ permisos)
6. Estudiante (4 permisos)

## 🎯 Casos de Uso para Probar

### Caso 1: Crear un nuevo coordinador
1. Ir a Usuarios
2. Crear usuario: "Juan Coordinador" / "juan.coord@tecnm.mx"
3. Asignar rol: "Coordinador"
4. Verificar que tiene los permisos correctos

### Caso 2: Crear un rol personalizado
1. Ir a Roles
2. Crear rol: "Asistente Académico"
3. Asignar permisos: ver-alumnos, ver-grupos, ver-calificaciones
4. Crear un usuario y asignarle este rol
5. Verificar que solo tiene esos permisos

### Caso 3: Modificar permisos de un rol
1. Ir a Roles
2. Editar rol "Profesor"
3. Agregar permiso: "crear-grupos"
4. Verificar que todos los usuarios con rol Profesor ahora pueden crear grupos

---

¡Sistema listo para probar! 🚀
