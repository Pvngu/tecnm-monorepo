import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";
import { formatDateMX } from "@/lib/utils/dateFormat";

export type Alumno = {
  id: number;
  usuario_id: number | null;
  carrera_id: number;
  matricula: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento?: string; // YYYY-MM-DD
  semestre: number;
  genero: "masculino" | "femenino" | "otro";
  modalidad: "presencial" | "virtual" | "hibrida";
};

export const AlumnoFilters: FilterConfig[] = [
  {
    id: "nombre",
    label: "Buscar por nombre...",
    type: "search",
  },
  {
    id: "matricula",
    label: "Buscar por matrícula...",
    type: "search",
  },
  {
    id: "carrera_id",
    label: "Carrera",
    type: "dynamic-multiselect",
    resource: "carreras",
    optionLabelKey: "nombre",
    optionValueKey: "id",
  },
  {
    id: "semestre",
    label: "Semestre",
    type: "multiselect",
    options: [
      { label: "1er Semestre", value: 1 },
      { label: "2do Semestre", value: 2 },
      { label: "3er Semestre", value: 3 },
      { label: "4to Semestre", value: 4 },
      { label: "5to Semestre", value: 5 },
      { label: "6to Semestre", value: 6 },
      { label: "7mo Semestre", value: 7 },
      { label: "8vo Semestre", value: 8 },
      { label: "9no Semestre", value: 9 },
      { label: "10mo Semestre", value: 10 },
      { label: "11vo Semestre", value: 11 },
      { label: "12vo Semestre", value: 12 },
    ],
  },
  {
    id: "genero",
    label: "Género",
    type: "multiselect",
    options: [
      { label: "Masculino", value: "masculino" },
      { label: "Femenino", value: "femenino" },
      { label: "Otro", value: "otro" },
    ],
  },
  {
    id: "modalidad",
    label: "Modalidad",
    type: "multiselect",
    options: [
      { label: "Presencial", value: "presencial" },
      { label: "Virtual", value: "virtual" },
      { label: "Híbrida", value: "hibrida" },
    ],
  },
  {
    id: "estatus_alumno",
    label: "Estatus",
    type: "multiselect",
    options: [
      { label: "Activo", value: "activo" },
      { label: "Baja Temporal", value: "baja_temporal" },
      { label: "Baja Definitiva", value: "baja_definitiva" },
      { label: "Egresado", value: "egresado" },
    ],
  },
];

export const AlumnoSchema = z.object({
  usuario_id: z.number().nullable().optional().default(null),
  carrera_id: z
    .number({
      message: "La carrera no es valida",
    })
    .min(1, "La carrera es requerida"),
  matricula: z.string({
    message: "La matrícula es requerida",
  }),
  nombre: z.string({
    message: "El nombre es requerido",
  }),
  apellido_paterno: z.string({
    message: "El apellido paterno es requerido",
  }),
  apellido_materno: z.string().optional(),
  fecha_nacimiento: z
    .string({
      message: "La fecha de nacimiento es requerida",
    })
    .optional(),
  semestre: z
    .number({
      message: "El semestre es requerido",
    })
    .min(1, "El semestre debe ser al menos 1")
    .max(12, "El semestre no puede ser mayor a 12"),
  genero: z.enum(["masculino", "femenino", "otro"], {
    message: "El género es requerido",
  }),
  modalidad: z.enum(["presencial", "virtual", "hibrida"], {
    message: "La modalidad es requerida",
  }),
});

export const AlumnoColumns: ColumnDef<Alumno>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "matricula",
    header: "Matrícula",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apellido_paterno",
    header: "Apellido Paterno",
  },
  {
    accessorKey: "apellido_materno",
    header: "Apellido Materno",
  },
  {
    accessorKey: "fecha_nacimiento",
    header: "Fecha de Nacimiento",
    cell: ({ row }) => formatDateMX(row.getValue("fecha_nacimiento")),
  },
  {
    accessorKey: "semestre",
    header: "Semestre",
  },
  {
    accessorKey: "genero",
    header: "Género",
  },
  {
    accessorKey: "modalidad",
    header: "Modalidad",
  },
];

export const AlumnoFormConfig: FormFieldConfig[] = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    placeholder: "Ingresa el nombre",
  },
  {
    name: "apellido_paterno",
    label: "Apellido Paterno",
    type: "text",
    placeholder: "Ingresa el apellido paterno",
  },
  {
    name: "apellido_materno",
    label: "Apellido Materno",
    type: "text",
    placeholder: "Ingresa el apellido materno",
  },
  {
    name: "fecha_nacimiento",
    label: "Fecha de nacimiento",
    type: "date",
    placeholder: "Selecciona la fecha de nacimiento",
  },
  {
    name: "matricula",
    label: "Matrícula",
    type: "text",
    placeholder: "Ingresa la matrícula",
  },
  {
    name: "carrera_id",
    label: "Carrera",
    type: "dynamic-select",
    resource: "carreras",
    optionLabelKey: "nombre",
    optionValueKey: "id",
    placeholder: "Selecciona la carrera",
  },
  {
    name: "semestre",
    label: "Semestre",
    type: "number",
    placeholder: "Ingresa el semestre",
  },
  {
    name: "genero",
    label: "Género",
    type: "select",
    placeholder: "Selecciona el género",
    options: [
        { label: "Masculino", value: "masculino" },
        { label: "Femenino", value: "femenino" },
        { label: "Otro", value: "otro" },
    ]
  },
  {
    name: "modalidad",
    label: "Modalidad",
    type: "select",
    placeholder: "Selecciona la modalidad",
    options: [
        { label: "Presencial", value: "presencial" },
        { label: "Virtual", value: "virtual" },
        { label: "Híbrida", value: "hibrida" },
    ]
  }
];

export const AlumnoCsvHeaders = [
  "carrera_id",
  "matricula",
  "nombre",
  "apellido_paterno",
  "apellido_materno",
  "fecha_nacimiento",
  "semestre",
  "genero",
  "modalidad"
];

// Función para crear las acciones personalizadas con acceso al router
export const createAlumnoCustomActions = (router: any) => [
  {
    label: "Ver Expediente",
    onClick: (row: Alumno) => {
      router.push(`/admin/alumnos/${row.id}`);
    },
  },
];
