import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { FormFieldConfig } from '@/components/common/ResourceForm';
import { FilterConfig } from '@/types/filters';

export type Alumno = {
    id: number;
    usuario_id: number | null;
    carrera_id: number;
    matricula: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno?: string;
    semestre: number;
    genero: 'masculino' | 'femenino' | 'otro';
    modalidad: 'presencial' | 'virtual' | 'hibrida';
}

export const AlumnoFilters: FilterConfig[] = [
    {
        id: 'nombre',
        label: 'Buscar por nombre...',
        type: 'search',
    }
]

export const AlumnoSchema = z.object({
    usuario_id: z.number().nullable(),
    carrera_id: z.number({
        message: 'La carrera no es valida',
    }).min(1, 'La carrera es requerida'),
    matricula: z.string({
        message: 'La matrícula es requerida'}),
    nombre: z.string({
        message: 'El nombre es requerido'}),
    apellido_paterno: z.string({
        message: 'El apellido paterno es requerido'}),
    apellido_materno: z.string().optional(),
    semestre: z.number({
        message: 'El semestre es requerido'}).min(1, 'El semestre debe ser al menos 1').max(12, 'El semestre no puede ser mayor a 12'),
    genero: z.enum(['masculino', 'femenino', 'otro'], {
        message: 'El género es requerido',
    }),
    modalidad: z.enum(['presencial', 'virtual', 'hibrida'], {
        message: 'La modalidad es requerida',
    }),
});

export const AlumnoColumns: ColumnDef<Alumno>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'matricula',
        header: 'Matrícula',
    },
    {
        accessorKey: 'nombre',
        header: 'Nombre',
    },
    {
        accessorKey: 'apellido_paterno',
        header: 'Apellido Paterno',
    },
    {
        accessorKey: 'apellido_materno',
        header: 'Apellido Materno',
    },
    {
        accessorKey: 'semestre',
        header: 'Semestre',
    },
    {
        accessorKey: 'genero',
        header: 'Género',
    },
    {
        accessorKey: 'modalidad',
        header: 'Modalidad',
    }
];

export const AlumnoFormConfig: FormFieldConfig[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingresa el nombre' },
    { name: 'apellido_paterno', label: 'Apellido Paterno', type: 'text', placeholder: 'Ingresa el apellido paterno' },
    { name: 'apellido_materno', label: 'Apellido Materno', type: 'text', placeholder: 'Ingresa el apellido materno' },
];