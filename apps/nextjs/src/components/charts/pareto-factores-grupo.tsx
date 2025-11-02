"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
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
import { apiService, ParetoData } from "@/services/apiService";
import { PaginatedResponse } from "@/types/api";

// Interfaces para los recursos
interface Periodo {
  id: number;
  nombre: string;
  activo: boolean;
}

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

export function ParetoFactoresGrupo() {
  const [periodoId, setPeriodoId] = useState<number | null>(null);
  const [materiaId, setMateriaId] = useState<number | null>(null);
  const [grupoId, setGrupoId] = useState<number | null>(null);

  // Query para Periodos
  const { data: periodosData, isLoading: isLoadingPeriodos } = useQuery<
    PaginatedResponse<Periodo>
  >({
    queryKey: ["periodos"],
    queryFn: () => apiService.getList<Periodo>("periodos", { per_page: 100 }),
  });

  // Query para Materias (habilitado solo si hay periodo seleccionado)
  const { data: materiasData, isLoading: isLoadingMaterias } = useQuery<
    PaginatedResponse<Materia>
  >({
    queryKey: ["materias", periodoId],
    queryFn: () => apiService.getList<Materia>("materias", { per_page: 100 }),
    enabled: !!periodoId,
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

  // Query para datos del Pareto (habilitado solo si hay grupo seleccionado)
  const { data: paretoData, isLoading: isLoadingPareto } = useQuery<
    ParetoData[]
  >({
    queryKey: ["paretoFactores", grupoId],
    queryFn: () => apiService.getParetoFactores(grupoId!),
    enabled: !!grupoId,
  });

  // Handlers para los cambios de selección
  const handlePeriodoChange = (value: string) => {
    setPeriodoId(Number(value));
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análisis de Pareto - Factores de Riesgo por Grupo</CardTitle>
        <CardDescription>
          Identifica los factores de riesgo más impactantes (regla 80/20) para
          un grupo específico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sección de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro 1: Periodo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Periodo</label>
            <Select
              value={periodoId?.toString() || ""}
              onValueChange={handlePeriodoChange}
              disabled={isLoadingPeriodos}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un periodo" />
              </SelectTrigger>
              <SelectContent>
                {periodosData?.data.map((periodo) => (
                  <SelectItem key={periodo.id} value={periodo.id.toString()}>
                    {periodo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro 2: Materia */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Materia</label>
            <Select
              value={materiaId?.toString() || ""}
              onValueChange={handleMateriaChange}
              disabled={!periodoId || isLoadingMaterias}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una materia" />
              </SelectTrigger>
              <SelectContent>
                {materiasData?.data.map((materia) => (
                  <SelectItem key={materia.id} value={materia.id.toString()}>
                    {materia.clave} - {materia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro 3: Grupo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grupo</label>
            <Select
              value={grupoId?.toString() || ""}
              onValueChange={handleGrupoChange}
              disabled={!materiaId || isLoadingGrupos}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un grupo" />
              </SelectTrigger>
              <SelectContent>
                {gruposData?.data.map((grupo) => (
                  <SelectItem key={grupo.id} value={grupo.id.toString()}>
                    {grupo.aula} - {grupo.horario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sección del Gráfico */}
        <div className="mt-6">
          {!grupoId ? (
            <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">
                Selecciona un grupo para ver el análisis de Pareto
              </p>
            </div>
          ) : isLoadingPareto ? (
            <Skeleton className="w-full h-[300px]" />
          ) : paretoData && paretoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nombre"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{
                    value: "Frecuencia",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "% Acumulado",
                    angle: 90,
                    position: "insideRight",
                  }}
                  domain={[0, 100]}
                  tickFormatter={(value: number) => `${value}%`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "% Acumulado") {
                      return [`${value}%`, name];
                    }
                    return [value, name];
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="frecuencia"
                  fill="#8884d8"
                  name="Frecuencia"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="porcentaje_acumulado"
                  stroke="#ff7300"
                  strokeWidth={2}
                  name="% Acumulado"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">
                No hay datos de factores de riesgo para este grupo
              </p>
            </div>
          )}
        </div>

        {/* Información adicional del análisis de Pareto */}
        {paretoData && paretoData.length > 0 && (
          <div className="mt-4 p-4 bg-muted/20 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">
              Interpretación del Análisis de Pareto:
            </h4>
            <p className="text-sm text-muted-foreground">
              Los factores mostrados a la izquierda son los más frecuentes. La
              línea naranja representa el porcentaje acumulado. Según la regla
              80/20, los primeros factores (que alcanzan ~80% acumulado)
              requieren mayor atención.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
