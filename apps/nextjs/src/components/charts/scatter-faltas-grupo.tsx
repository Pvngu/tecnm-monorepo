"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService, ScatterPlotData } from "@/services/apiService";
import { PaginatedResponse } from "@/types/api";

// Interfaces para los recursos
interface Materia {
  id: number;
  nombre: string;
  clave: string;
  semestre: number;
}

interface Grupo {
  id: number;
  horario: string;
  aula: string;
  materia_id: number;
  profesor_id: number;
  periodo_id: number;
}

// Definición de variables disponibles para los ejes
interface VariableOption {
  value: keyof ScatterPlotData;
  label: string;
  unit: string;
  description: string;
}

const VARIABLES: VariableOption[] = [
  {
    value: "calificacion_final",
    label: "Calificación Final",
    unit: " pts",
    description: "Calificación final del alumno en el grupo"
  },
  {
    value: "faltas",
    label: "Número de Faltas",
    unit: " faltas",
    description: "Total de inasistencias injustificadas"
  },
  {
    value: "asistencias",
    label: "Número de Asistencias",
    unit: " asist.",
    description: "Total de días asistidos"
  },
  {
    value: "porcentaje_asistencia",
    label: "Porcentaje de Asistencia",
    unit: "%",
    description: "Porcentaje de asistencia del total de clases"
  },
  {
    value: "total_asistencias",
    label: "Total de Registros de Asistencia",
    unit: " reg.",
    description: "Total de registros de asistencia (asistencias + faltas + justificados)"
  },
  {
    value: "num_factores_riesgo",
    label: "Número de Factores de Riesgo",
    unit: " factores",
    description: "Total de factores de riesgo identificados"
  },
];

export function ScatterFaltasGrupo() {
  // Estados para filtros
  const [semestre, setSemestre] = useState<number | null>(null);
  const [materiaId, setMateriaId] = useState<number | null>(null);
  const [grupoId, setGrupoId] = useState<number | null>(null);
  
  // Estados para variables de los ejes
  const [variableX, setVariableX] = useState<keyof ScatterPlotData>("faltas");
  const [variableY, setVariableY] = useState<keyof ScatterPlotData>("calificacion_final");

  // Query para Materias filtradas por semestre
  const { data: materiasData, isLoading: isLoadingMaterias } = useQuery<
    PaginatedResponse<Materia>
  >({
    queryKey: ["materias", semestre],
    queryFn: () => apiService.getList<Materia>("materias", { 
      per_page: 100,
      ...(semestre && { filter: { semestre } })
    }),
    enabled: !!semestre,
  });

  // Query para Grupos (habilitado solo si hay materia seleccionada)
  const { data: gruposData, isLoading: isLoadingGrupos } = useQuery<
    PaginatedResponse<Grupo>
  >({
    queryKey: ["grupos", materiaId],
    queryFn: () =>
      apiService.getList<Grupo>("grupos", {
        per_page: 100,
        filter: { materia_id: materiaId },
      }),
    enabled: !!materiaId,
  });

  // Query para datos del Scatter Plot (habilitado solo si hay grupo seleccionado)
  const { data: scatterData, isLoading: isLoadingScatter } = useQuery<
    ScatterPlotData[]
  >({
    queryKey: ["scatterPlotFaltas", grupoId],
    queryFn: () => apiService.getScatterPlotFaltas(grupoId!),
    enabled: !!grupoId,
  });

  // Handlers para los cambios de selección
  const handleSemestreChange = (value: string) => {
    setSemestre(Number(value));
    setMateriaId(null);
    setGrupoId(null);
  };

  const handleMateriaChange = (value: string) => {
    setMateriaId(Number(value));
    setGrupoId(null);
  };

  const handleGrupoChange = (value: string) => {
    setGrupoId(Number(value));
  };

  // Obtener información de las variables seleccionadas
  const varXInfo = VARIABLES.find(v => v.value === variableX);
  const varYInfo = VARIABLES.find(v => v.value === variableY);

  // Preparar datos para el gráfico
  const chartData = scatterData?.map(item => ({
    ...item,
    x: item[variableX] as number,
    y: item[variableY] as number,
  }));

  const semestres = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagrama de Dispersión - Análisis de Correlación</CardTitle>
        <CardDescription>
          Analiza la relación entre dos variables académicas seleccionando las opciones deseadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sección de Filtros */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Filtros de Datos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro 1: Semestre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Semestre <span className="text-red-500">*</span>
              </label>
              <Select
                value={semestre?.toString() || ""}
                onValueChange={handleSemestreChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semestres.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semestre {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro 2: Materia (Opcional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Materia (Opcional)</label>
              <Select
                value={materiaId?.toString() || ""}
                onValueChange={handleMateriaChange}
                disabled={!semestre || isLoadingMaterias}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {materiasData?.data.map((materia) => (
                    <SelectItem key={materia.id} value={materia.id.toString()}>
                      {materia.clave} - {materia.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro 3: Grupo (Opcional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Grupo (Opcional)</label>
              <Select
                value={grupoId?.toString() || ""}
                onValueChange={handleGrupoChange}
                disabled={!materiaId || materiaId.toString() === "all" || isLoadingGrupos}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  {gruposData?.data.map((grupo) => (
                    <SelectItem key={grupo.id} value={grupo.id.toString()}>
                      {grupo.aula} - {grupo.horario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Selectores de Variables */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Variables del Gráfico</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Variable X */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Variable X (Eje Horizontal) <span className="text-red-500">*</span>
              </label>
              <Select
                value={variableX}
                onValueChange={(value: string) => setVariableX(value as keyof ScatterPlotData)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VARIABLES.map((variable) => (
                    <SelectItem key={variable.value} value={variable.value}>
                      {variable.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {varXInfo && (
                <p className="text-xs text-muted-foreground">{varXInfo.description}</p>
              )}
            </div>

            {/* Variable Y */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Variable Y (Eje Vertical) <span className="text-red-500">*</span>
              </label>
              <Select
                value={variableY}
                onValueChange={(value: string) => setVariableY(value as keyof ScatterPlotData)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VARIABLES.map((variable) => (
                    <SelectItem key={variable.value} value={variable.value}>
                      {variable.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {varYInfo && (
                <p className="text-xs text-muted-foreground">{varYInfo.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sección del Gráfico */}
        <div className="mt-6">
          {!grupoId || grupoId.toString() === "all" ? (
            <div className="flex items-center justify-center h-[450px] border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">
                Selecciona un grupo específico para ver el diagrama de dispersión
              </p>
            </div>
          ) : isLoadingScatter ? (
            <Skeleton className="w-full h-[450px]" />
          ) : chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={varXInfo?.label}
                  unit={varXInfo?.unit}
                  label={{
                    value: varXInfo?.label || "",
                    position: "insideBottom",
                    offset: -15,
                    style: { fontSize: 14, fontWeight: 500 }
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={varYInfo?.label}
                  unit={varYInfo?.unit}
                  label={{
                    value: varYInfo?.label || "",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 14, fontWeight: 500 }
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ScatterPlotData & { x: number; y: number };
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-md">
                          <p className="font-bold text-sm mb-2">
                            {data.alumno_nombre}
                          </p>
                          <div className="space-y-1 text-xs">
                            <p>
                              <span className="font-semibold">{varXInfo?.label}:</span>{" "}
                              {data.x}{varXInfo?.unit}
                            </p>
                            <p>
                              <span className="font-semibold">{varYInfo?.label}:</span>{" "}
                              {data.y}{varYInfo?.unit}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter
                  name="Alumnos"
                  data={chartData}
                  fill="#8884d8"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[450px] border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">
                No hay datos disponibles para este grupo
              </p>
            </div>
          )}
        </div>

        {/* Información adicional del análisis */}
        {chartData && chartData.length > 0 && (
          <div className="mt-4 p-4 bg-muted/20 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold">
              Análisis de Correlación: {varXInfo?.label} vs {varYInfo?.label}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold mb-1">Variable X: {varXInfo?.label}</p>
                <p className="text-muted-foreground">{varXInfo?.description}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Variable Y: {varYInfo?.label}</p>
                <p className="text-muted-foreground">{varYInfo?.description}</p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Total de alumnos analizados:</strong> {chartData.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pasa el cursor sobre cada punto para ver los detalles del alumno.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
