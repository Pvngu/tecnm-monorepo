import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";

export type Role = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: Array<{
    id: number;
    name: string;
    guard_name: string;
  }>;
};

export const RoleIncludes = ["permissions"];

export const RoleFilters: FilterConfig[] = [
  {
    id: "name",
    label: "Buscar por nombre...",
    type: "search",
  },
];

export const RoleSchema = z.object({
  id: z.number().optional().nullable(),
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre del rol es requerido"),
  guard_name: z.string().default("web"),
  permissions: z.array(z.number()).optional().default([]),
});

export const RoleColumns: ColumnDef<Role>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Nombre del Rol" },
  { accessorKey: "guard_name", header: "Guard" },
  {
    accessorKey: "permissions",
    header: "Permisos",
    accessorFn: (row) =>
      row?.permissions?.length
        ? `${row.permissions.length} permiso(s)`
        : "Sin permisos",
  },
  {
    accessorKey: "created_at",
    header: "Fecha de Creación",
    accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
  },
];

export const RoleFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nombre del Rol",
    type: "text",
    placeholder: "Ejemplo: Administrador, Profesor, etc.",
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
  {
    name: "permissions",
    label: "Permisos",
    type: "dynamic-multiselect",
    placeholder: "Seleccionar permisos",
    resource: "permissions",
    optionLabelKey: "name",
    optionValueKey: "id",
    columns: {
      container: 12,
      label: 12,
      wrapper: 12,
    },
  },
];
