import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { FormFieldConfig } from '@/components/common/ResourceForm';
import { FilterConfig } from '@/types/filters';

export type Carrera = {
    id: number;
    nombre: string;
    clave?: string | null;
}

export const CarreraFilters: FilterConfig[] = [
    {
        id: 'nombre',
        label: 'Buscar por nombre, clave...',
        type: 'search',
    },
];

export const CarreraSchema = z.object({
    nombre: z.string({ message: 'El nombre de la carrera es requerido' }).min(1, 'El nombre es requerido'),
    clave: z.string().optional().nullable(),
});

export const CarreraColumns: ColumnDef<Carrera>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'nombre',
        header: 'Nombre',
    },
    {
        accessorKey: 'clave',
        header: 'Clave',
    },
];

export const CarreraFormConfig: FormFieldConfig[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingresa el nombre de la carrera' },
    { name: 'clave', label: 'Clave', type: 'text', placeholder: 'Ingresa la clave (opcional)' },
];
