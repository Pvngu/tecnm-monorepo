import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FormFieldConfig } from "@/types/form";
import { FilterConfig } from "@/types/filters";

export type FactorRiesgo = {
  id: number;
  nombre: string;
  categoria:
    | "académicos"
    | "psicosociales"
    | "económicos"
    | "institucionales"
    | "tecnológicos"
    | "contextuales";
};

export const FactorRiesgoFilters: FilterConfig[] = [
  {
    id: "nombre",
    label: "Buscar por nombre...",
    type: "search",
  },
  {
    id: "categoria",
    label: "Categoría",
    type: "multiselect",
    // options expected to be { label, value }
    options: [
      { label: "Académicos", value: "académicos" },
      { label: "Psicosociales", value: "psicosociales" },
      { label: "Económicos", value: "económicos" },
      { label: "Institucionales", value: "institucionales" },
      { label: "Tecnológicos", value: "tecnológicos" },
      { label: "Contextuales", value: "contextuales" },
    ],
  },
];

export const FactorRiesgoSchema = z.object({
  nombre: z
    .string({ message: "El nombre del factor es requerido" })
    .min(1, "El nombre es requerido"),
  categoria: z.enum([
    "académicos",
    "psicosociales",
    "económicos",
    "institucionales",
    "tecnológicos",
    "contextuales",
  ]),
});

export const FactorRiesgoColumns: ColumnDef<FactorRiesgo>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "categoria",
    header: "Categoría",
  },
];

export const FactorRiesgoFormConfig: FormFieldConfig[] = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    placeholder: "Ingresa el nombre del factor de riesgo",
  },
  {
    name: "categoria",
    label: "Categoría",
    type: "select",
    options: [
      { label: "Académicos", value: "académicos" },
      { label: "Psicosociales", value: "psicosociales" },
      { label: "Económicos", value: "económicos" },
      { label: "Institucionales", value: "institucionales" },
      { label: "Tecnológicos", value: "tecnológicos" },
      { label: "Contextuales", value: "contextuales" },
    ],
  },
];

export default FactorRiesgo;
