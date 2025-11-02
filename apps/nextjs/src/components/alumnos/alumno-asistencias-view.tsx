"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AlumnoAsistenciasViewProps {
  inscripciones: any[];
}

const getEstatusColor = (estatus: string) => {
  switch (estatus) {
    case "presente":
      return "bg-green-500 hover:bg-green-600";
    case "falta":
      return "bg-red-500 hover:bg-red-600";
    case "justificado":
      return "bg-yellow-500 hover:bg-yellow-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const formatEstatus = (estatus: string) => {
  const estatusMap: Record<string, string> = {
    presente: "Presente",
    falta: "Falta",
    justificado: "Justificado",
  };
  return estatusMap[estatus] || estatus;
};

export function AlumnoAsistenciasView({
  inscripciones,
}: AlumnoAsistenciasViewProps) {
  const [selectedInscripcionId, setSelectedInscripcionId] = useState<
    number | null
  >(inscripciones[0]?.id || null);

  const selectedInscripcion = inscripciones.find(
    (i) => i.id === selectedInscripcionId
  );

  const asistencias = selectedInscripcion?.asistencias || [];

  // Calcular estadísticas
  const totalAsistencias = asistencias.length;
  const presentes = asistencias.filter(
    (a: any) => a.estatus === "presente"
  ).length;
  const faltas = asistencias.filter((a: any) => a.estatus === "falta").length;
  const justificados = asistencias.filter(
    (a: any) => a.estatus === "justificado"
  ).length;
  const porcentajeAsistencia =
    totalAsistencias > 0 ? ((presentes / totalAsistencias) * 100).toFixed(2) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Asistencias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selector de Inscripción */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Seleccionar Inscripción</label>
          <Select
            value={selectedInscripcionId?.toString() || ""}
            onValueChange={(value: string) =>
              setSelectedInscripcionId(Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una inscripción" />
            </SelectTrigger>
            <SelectContent>
              {inscripciones.map((inscripcion) => (
                <SelectItem
                  key={inscripcion.id}
                  value={inscripcion.id.toString()}
                >
                  {inscripcion.grupo?.materia?.nombre || "Sin materia"} -{" "}
                  {inscripcion.grupo?.profesor?.nombre || "Sin profesor"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estadísticas */}
        {selectedInscripcion && totalAsistencias > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{totalAsistencias}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Presentes</p>
              <p className="text-2xl font-bold text-green-600">{presentes}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Faltas</p>
              <p className="text-2xl font-bold text-red-600">{faltas}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">% Asistencia</p>
              <p className="text-2xl font-bold text-blue-600">
                {porcentajeAsistencia}%
              </p>
            </div>
          </div>
        )}

        {/* Tabla de asistencias */}
        {!selectedInscripcion ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Selecciona una inscripción para ver el historial de asistencias
          </p>
        ) : asistencias.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay registros de asistencias
          </p>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asistencias
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                  )
                  .map((asistencia: any) => (
                    <TableRow key={asistencia.id}>
                      <TableCell>
                        {new Date(asistencia.fecha).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstatusColor(asistencia.estatus)}>
                          {formatEstatus(asistencia.estatus)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {asistencia.observaciones || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
