# Acceso al Expediente de Alumno desde la Tabla

## 📋 Descripción

Se ha agregado una nueva opción en el menú de acciones (dropdown) de la tabla de alumnos que permite acceder directamente al expediente completo del alumno.

## ✨ Nueva Funcionalidad

### Ubicación
En la página de listado de alumnos (`/admin/alumnos`), cada fila de la tabla ahora incluye:

- **Botón de Acciones** (⋮)
  - **Ver Expediente** ← NUEVA opción
  - Edit
  - Delete

### Cómo Funciona

1. **En la tabla de alumnos**, haz clic en el botón de acciones (⋮) en cualquier fila
2. Selecciona **"Ver Expediente"**
3. Serás redirigido a `/admin/alumnos/{id}` donde verás:
   - Información personal
   - Inscripciones y calificaciones
   - Factores de riesgo
   - Asistencias
   - Cuenta de usuario

## 🔧 Implementación Técnica

### Archivos Modificados

1. **`DataTableRowActions.tsx`**
   - Añadido soporte para `customActions`
   - Las acciones personalizadas se muestran antes de Edit y Delete

2. **`alumnos.config.ts`**
   - Nueva función `createAlumnoCustomActions(router)`
   - Define la acción "Ver Expediente"

3. **`resources/index.ts`**
   - Actualizada interfaz `ResourceConfig` para incluir `customActions`

4. **`admin/[resource]/page.tsx`**
   - Implementada lógica para crear acciones dinámicas según el recurso
   - Usa `useRouter` de Next.js para navegación

### Estructura de Código

```typescript
// alumnos.config.ts
export const createAlumnoCustomActions = (router: any) => [
  {
    label: "Ver Expediente",
    onClick: (row: Alumno) => {
      router.push(`/admin/alumnos/${row.id}`);
    },
  },
];
```

```typescript
// DataTableRowActions.tsx
{customActions.length > 0 && (
  <>
    {customActions.map((action, index) => (
      <DropdownMenuItem
        key={index}
        onClick={() => action.onClick(row.original)}
        className={action.className}
      >
        {action.label}
      </DropdownMenuItem>
    ))}
    <DropdownMenuSeparator />
  </>
)}
```

## 🎯 Ventajas

1. **Acceso Rápido**: Un solo clic desde la tabla
2. **Navegación Fluida**: Usa el router de Next.js (sin recargas)
3. **Extensible**: Fácil agregar más acciones personalizadas
4. **Específico por Recurso**: Cada recurso puede tener sus propias acciones

## 📝 Cómo Agregar Acciones a Otros Recursos

Si quieres agregar acciones personalizadas a otros recursos (carreras, profesores, etc.):

1. **Crea la función de acciones** en el archivo de configuración:
   ```typescript
   // carreras.config.ts
   export const createCarreraCustomActions = (router: any) => [
     {
       label: "Ver Estadísticas",
       onClick: (row: Carrera) => {
         router.push(`/admin/carreras/${row.id}/stats`);
       },
     },
   ];
   ```

2. **Importa y usa en `page.tsx`**:
   ```typescript
   import { createCarreraCustomActions } from '@/config/resources/carreras.config';
   
   const customActions = useMemo(() => {
     if (resource === 'alumnos') {
       return createAlumnoCustomActions(router);
     }
     if (resource === 'carreras') {
       return createCarreraCustomActions(router);
     }
     return [];
   }, [resource, router]);
   ```

## 🎨 Personalización

Puedes personalizar el estilo de las acciones usando la propiedad `className`:

```typescript
{
  label: "Acción Importante",
  onClick: (row) => { /* ... */ },
  className: "text-blue-600 font-semibold", // Estilo personalizado
}
```

## ✅ Estado Actual

- ✅ Acción "Ver Expediente" implementada para Alumnos
- ✅ Sistema extensible para otros recursos
- ✅ Navegación con Next.js Router
- ✅ Sin errores de TypeScript
- ✅ Totalmente funcional

---

**Ahora puedes acceder al expediente de cualquier alumno con un solo clic desde la tabla principal!** 🎉
