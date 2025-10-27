import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";

export type Periodo = {
  id: number;
  nombre: string;
  fecha_inicio: string; // ISO date string
  fecha_fin: string; // ISO date string
  activo: boolean;
};

export const PeriodoFilters: FilterConfig[] = [
  {
    id: "nombre",
    label: "Buscar por nombre...",
    type: "search",
  },
];

export const PeriodoSchema = z.object({
  nombre: z
    .string({ message: "El nombre del periodo es requerido" })
    .min(1, "El nombre es requerido"),
  fecha_inicio: z
    .string({ message: "La fecha de inicio es requerida" })
    .min(1, "La fecha de inicio es requerida"),
  fecha_fin: z
    .string({ message: "La fecha de fin es requerida" })
    .min(1, "La fecha de fin es requerida"),
  activo: z.boolean().optional().default(false),
});

export const PeriodoColumns: ColumnDef<Periodo>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nombre", header: "Nombre" },
  { accessorKey: "fecha_inicio", header: "Fecha Inicio" },
  { accessorKey: "fecha_fin", header: "Fecha Fin" },
  { accessorKey: "activo", header: "Activo" },
];

export const PeriodoFormConfig: FormFieldConfig[] = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    placeholder: "Ingresa el nombre del periodo",
  },
  {
    name: "fecha_inicio",
    label: "Fecha Inicio",
    type: "date",
    placeholder: "YYYY-MM-DD",
  },
  {
    name: "fecha_fin",
    label: "Fecha Fin",
    type: "date",
    placeholder: "YYYY-MM-DD",
  },
  {
    name: "activo",
    label: "Activo",
    type: "checkbox",
    placeholder: "Activo",
  },
];
