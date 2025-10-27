# Resource Configuration Guide

This guide explains how to add new resource configurations to the admin panel.

## Overview

All resource configurations are automatically loaded from this directory. When you add a new resource config file, it will be automatically available in the admin panel.

## Steps to Add a New Resource

### 1. Create the Resource Config File

Create a new file in this directory with the pattern: `{resource-name}.config.ts`

Example: `estudiantes.config.ts`

### 2. Define the Required Exports

Your config file must export the following:

```typescript
import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { FormFieldConfig } from '@/types/form';
import { FilterConfig } from '@/types/filters';

// 1. Type definition
export type Estudiante = {
    id: number;
    nombre: string;
    // ... other fields
}

// 2. Column definitions for the table
export const EstudianteColumns: ColumnDef<Estudiante>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    // ... other columns
];

// 3. Filter configuration (optional)
export const EstudianteFilters: FilterConfig[] = [
    {
        id: 'nombre',
        label: 'Buscar por nombre...',
        type: 'search',
    },
    // ... other filters
];

// 4. Validation schema
export const EstudianteSchema = z.object({
    nombre: z.string({ message: 'El nombre es requerido' }),
    // ... other validations
});

// 5. Form configuration
export const EstudianteFormConfig: FormFieldConfig[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingresa el nombre' },
    // ... other fields
];

// 6. Includes (optional - for relationships)
export const EstudianteIncludes = [
    'carrera',
    'grupo',
];
```

### 3. Register in index.ts

Open `index.ts` and add your resource:

```typescript
// 1. Import the config
import * as EstudiantesConfig from './estudiantes.config';

// 2. Add to resourceConfigMap
export const resourceConfigMap: { [key: string]: ResourceConfig } = {
    // ... existing configs
    estudiantes: {
        columns: EstudiantesConfig.EstudianteColumns,
        type: {} as EstudiantesConfig.Estudiante,
        filters: EstudiantesConfig.EstudianteFilters,
        schema: EstudiantesConfig.EstudianteSchema,
        formConfig: EstudiantesConfig.EstudianteFormConfig,
        includes: EstudiantesConfig.EstudianteIncludes, // optional
    },
};

// 3. Export the config (at the bottom)
export * from './estudiantes.config';
```

### 4. Done!

Your new resource will be automatically available at `/admin/{resource-name}`

## Naming Conventions

- File name: `{resource-plural}.config.ts` (e.g., `estudiantes.config.ts`)
- Type name: `{ResourceSingular}` (e.g., `Estudiante`)
- Exports should follow the pattern: `{ResourceSingular}{Property}` (e.g., `EstudianteColumns`, `EstudianteSchema`)
- Use plural form for the resource key in the map (e.g., `estudiantes`)

## Optional Properties

Some properties are optional:

- `filters` - If you don't need filters for this resource
- `includes` - If the resource doesn't have relationships
- `formConfig` - If you're not using forms for this resource
- `schema` - If you don't need validation

## Example Resources

Check these existing configs for reference:
- `alumnos.config.ts` - Basic resource with filters
- `grupos.config.ts` - Resource with relationships and includes
- `carreras.config.ts` - Simple resource

## Tips

1. **Consistent naming** - Follow the naming convention strictly for auto-completion to work
2. **Type safety** - Export the TypeScript type for full type safety across the app
3. **Reusable filters** - Use the `FilterConfig` type for consistent filter behavior
4. **Validation first** - Define your Zod schema early to catch errors
