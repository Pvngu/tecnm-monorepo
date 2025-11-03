import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  roles?: Array<{
    id: number;
    name: string;
    guard_name: string;
  }>;
};

export const UserIncludes = ["roles"];

export const UserFilters: FilterConfig[] = [
  {
    id: "name",
    label: "Buscar por nombre o email...",
    type: "search",
  },
  {
    id: "role_id",
    label: "Rol",
    type: "dynamic-multiselect",
    resource: "roles",
    optionLabelKey: "name",
    optionValueKey: "id",
  },
];

export const UserSchema = z.object({
  id: z.number().optional().nullable(),
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre es requerido"),
  email: z
    .string({ message: "El email es requerido" })
    .email("Debe ser un email válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        // If we're creating (no id), password is required
        // If we're editing (has id), password is optional
        return true; // Allow empty for edits
      },
      { message: "La contraseña es requerida para nuevos usuarios" }
    ),
  roles: z.array(z.number()).optional().default([]),
});

export const UserColumns: ColumnDef<User>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "roles",
    header: "Roles",
    accessorFn: (row) =>
      row?.roles?.map((role) => role.name).join(", ") || "Sin rol",
  },
  {
    accessorKey: "created_at",
    header: "Fecha de Creación",
    accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
  },
];

export const UserFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Ingresa el nombre del usuario",
    columns: {
      container: 6,
      label: 12,
      wrapper: 12,
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Ingresa el email",
    columns: {
      container: 6,
      label: 12,
      wrapper: 12,
    },
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "Ingresa la contraseña (mínimo 8 caracteres)",
    columns: {
      container: 6,
      label: 12,
      wrapper: 12,
    },
  },
  {
    name: "roles",
    label: "Roles",
    type: "dynamic-multiselect",
    placeholder: "Seleccionar roles",
    resource: "roles",
    optionLabelKey: "name",
    optionValueKey: "id",
    columns: {
      container: 6,
      label: 12,
      wrapper: 12,
    },
  },
];
