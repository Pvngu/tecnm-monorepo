import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FilterConfig } from "@/types/filters";
import { Badge } from "@/components/ui/badge";

export type ActivityLog = {
  id: number;
  user_id: number;
  loggable_type: string;
  loggable_id: number;
  action: "CREATED" | "UPDATED" | "DELETED";
  entity: string;
  description: string;
  json_log: {
    data: {
      old?: Record<string, any>;
      new?: Record<string, any>;
    };
    action: string;
    entity: string;
    metadata: {
      server: string;
      database: string;
    };
    timestamp: string;
    description: string;
  };
  datetime: string;
  created_at: string;
  updated_at: string;
};

export const ActivityLogFilters: FilterConfig[] = [
  {
    id: "entity",
    label: "Entidad",
    type: "multiselect",
    options: [
      { label: "Alumnos", value: "alumnos" },
      { label: "Profesores", value: "profesores" },
      { label: "Periodos", value: "periodos" },
      { label: "Carreras", value: "carreras" },
      { label: "Materias", value: "materias" },
      { label: "Grupos", value: "grupos" },
      { label: "Inscripciones", value: "inscripciones" },
      { label: "Calificaciones", value: "calificaciones" },
      { label: "Asistencias", value: "asistencias" },
    ],
  },
  {
    id: "action",
    label: "Acción",
    type: "multiselect",
    options: [
      { label: "Creado", value: "CREATED" },
      { label: "Actualizado", value: "UPDATED" },
      { label: "Eliminado", value: "DELETED" },
    ],
  },
  {
    id: "description",
    label: "Buscar por descripción...",
    type: "search",
  },
];

export const ActivityLogColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "datetime",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.original.datetime);
      return date.toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short",
      });
    },
  },
  {
    accessorKey: "entity",
    header: "Entidad",
    cell: ({ row }) => {
      return (
        <span className="capitalize font-medium">
          {row.original.entity}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => {
      const action = row.original.action;
      const variants: Record<string, "default" | "secondary" | "destructive"> = {
        CREATED: "default",
        UPDATED: "secondary",
        DELETED: "destructive",
      };
      const labels: Record<string, string> = {
        CREATED: "Creado",
        UPDATED: "Actualizado",
        DELETED: "Eliminado",
      };
      return (
        <Badge variant={variants[action] || "default"}>
          {labels[action] || action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    id: "changes",
    header: "Cambios",
    cell: ({ row }) => {
      const log = row.original;
      const hasOld = log.json_log?.data?.old;
      const hasNew = log.json_log?.data?.new;
      
      if (!hasOld && !hasNew) {
        return <span className="text-muted-foreground">Sin datos</span>;
      }
      
      const changedFields = hasOld && hasNew 
        ? Object.keys(log.json_log.data.new || {}).filter(
            key => log.json_log.data.old?.[key] !== log.json_log.data.new?.[key]
          )
        : [];
      
      if (log.action === "CREATED") {
        const fieldCount = Object.keys(log.json_log.data.new || {}).length;
        return <span className="text-sm text-muted-foreground">{fieldCount} campos creados</span>;
      }
      
      if (log.action === "DELETED") {
        const fieldCount = Object.keys(log.json_log.data.old || {}).length;
        return <span className="text-sm text-muted-foreground">{fieldCount} campos eliminados</span>;
      }
      
      if (log.action === "UPDATED" && changedFields.length > 0) {
        return (
          <div className="text-sm space-y-1">
            {changedFields.slice(0, 2).map((field) => (
              <div key={field} className="flex gap-2 items-center">
                <span className="font-medium">{field}:</span>
                <span className="text-red-600 line-through">
                  {String(log.json_log.data.old?.[field])}
                </span>
                <span>→</span>
                <span className="text-green-600">
                  {String(log.json_log.data.new?.[field])}
                </span>
              </div>
            ))}
            {changedFields.length > 2 && (
              <span className="text-muted-foreground">
                +{changedFields.length - 2} más...
              </span>
            )}
          </div>
        );
      }
      
      return <span className="text-muted-foreground">Sin cambios</span>;
    },
  },
];

// Activity logs are read-only, no schema needed
export const ActivityLogSchema = z.object({});
