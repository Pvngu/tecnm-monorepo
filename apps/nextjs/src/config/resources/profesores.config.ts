import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";

export type Profesor = {
  id: number;
  usuario_id?: number | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  rfc?: string | null;
};

export const ProfesorFilters: FilterConfig[] = [
  {
    id: "nombre",
    label: "Buscar por nombre...",
    type: "search",
  },
];

export const ProfesorSchema = z.object({
  usuario_id: z.number().optional().nullable(),
  nombre: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre es requerido"),
  apellido_paterno: z
    .string({ message: "El apellido paterno es requerido" })
    .min(1, "El apellido paterno es requerido"),
  apellido_materno: z.string().optional().nullable(),
  rfc: z.string().optional().nullable(),
});

export const ProfesorColumns: ColumnDef<Profesor>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nombre", header: "Nombre" },
  { accessorKey: "apellido_paterno", header: "Apellido Paterno" },
  { accessorKey: "apellido_materno", header: "Apellido Materno" },
  { accessorKey: "rfc", header: "RFC" },
];

export const ProfesorFormConfig: FormFieldConfig[] = [
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
    name: "rfc",
    label: "RFC",
    type: "text",
    placeholder: "Ingresa el RFC (opcional)",
  },
];
