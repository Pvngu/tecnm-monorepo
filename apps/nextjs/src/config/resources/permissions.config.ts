import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";

export type Permission = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
};

export const PermissionFilters: FilterConfig[] = [
  {
    id: "name",
    label: "Buscar por nombre...",
    type: "search",
  },
];

export const PermissionSchema = z.object({
  id: z.number().optional().nullable(),
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre del permiso es requerido"),
  guard_name: z.string().default("web"),
});

export const PermissionColumns: ColumnDef<Permission>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Nombre del Permiso" },
  { accessorKey: "guard_name", header: "Guard" },
  {
    accessorKey: "created_at",
    header: "Fecha de Creación",
    accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
  },
];

export const PermissionFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nombre del Permiso",
    type: "text",
    placeholder: "Ejemplo: crear-usuarios, editar-alumnos, etc.",
    columns: {
      container: 6,
      label: 12,
      wrapper: 12,
    },
  },
  {
    name: "guard_name",
    label: "Guard Name",
    type: "text",
    placeholder: "web",
    columns: {
      container: 6,
      label: 12,
      wrapper: 12,
    },
  },
];
