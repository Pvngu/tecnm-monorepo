"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AlumnoHeaderProps {
  alumno: {
    nombre: string;
    apellido_paterno: string;
    apellido_materno?: string;
    matricula: string;
    carrera?: {
      nombre: string;
    };
    estatus_alumno?: string;
    semestre?: number;
  };
}

const getEstatusColor = (estatus?: string) => {
  switch (estatus) {
    case "activo":
      return "bg-green-500 hover:bg-green-600";
    case "baja_temporal":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "baja_definitiva":
      return "bg-red-500 hover:bg-red-600";
    case "egresado":
      return "bg-blue-500 hover:bg-blue-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const formatEstatus = (estatus?: string) => {
  if (!estatus) return "Desconocido";
  return estatus
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function AlumnoHeader({ alumno }: AlumnoHeaderProps) {
  const nombreCompleto = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno || ""}`.trim();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {nombreCompleto}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <p>
                <span className="font-medium">Matrícula:</span>{" "}
                {alumno.matricula}
              </p>
              {alumno.carrera && (
                <p>
                  <span className="font-medium">Carrera:</span>{" "}
                  {alumno.carrera.nombre}
                </p>
              )}
              {alumno.semestre && (
                <p>
                  <span className="font-medium">Semestre:</span>{" "}
                  {alumno.semestre}
                </p>
              )}
            </div>
          </div>
          <Badge className={getEstatusColor(alumno.estatus_alumno)}>
            {formatEstatus(alumno.estatus_alumno)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
