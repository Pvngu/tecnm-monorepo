import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";

export type Materia = {
  id: number;
  nombre: string;
  codigo_materia?: string | null;
  creditos?: number | null;
};

export const MateriaFilters: FilterConfig[] = [
  {
    id: "nombre",
    label: "Buscar por nombre...",
    type: "search",
  },
];

export const MateriaSchema = z.object({
  nombre: z
    .string({ message: "El nombre de la materia es requerido" })
    .min(1, "El nombre es requerido"),
  codigo_materia: z.string().optional().nullable(),
  creditos: z.number().optional().nullable(),
});

export const MateriaColumns: ColumnDef<Materia>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nombre", header: "Nombre" },
  { accessorKey: "codigo_materia", header: "Código" },
  { accessorKey: "creditos", header: "Créditos" },
];

export const MateriaFormConfig: FormFieldConfig[] = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    placeholder: "Ingresa el nombre de la materia",
  },
  {
    name: "codigo_materia",
    label: "Código",
    type: "text",
    placeholder: "Código de la materia (opcional)",
  },
  {
    name: "creditos",
    label: "Créditos",
    type: "number",
    placeholder: "0",
  },
];
