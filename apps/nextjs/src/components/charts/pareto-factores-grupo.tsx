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
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Play } from "lucide-react";

interface ParetoFactoresGrupoProps {
  periodoId: number;
  carreraId?: number;
  semestre?: number;
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

export function ParetoFactoresGrupo({ periodoId, carreraId, semestre }: ParetoFactoresGrupoProps) {
  const { screenReader, speak } = useAccessibility();
  const [selectedMateriaId, setSelectedMateriaId] = useState<string>("all");
  const [selectedGrupoId, setSelectedGrupoId] = useState<string>("all");

  // Query para Materias
  const { data: materiasData, isLoading: isLoadingMaterias } = useQuery<
    PaginatedResponse<Materia>
  >({
    queryKey: ["materias"],
    queryFn: () => apiService.getList<Materia>("materias", { per_page: 100 }),
    enabled: !!periodoId,
  });

  // Query para Grupos (habilitado solo si hay materia seleccionada)
  const { data: gruposData, isLoading: isLoadingGrupos } = useQuery<
    PaginatedResponse<Grupo>
  >({
    queryKey: ["grupos", periodoId, selectedMateriaId],
    queryFn: () => {
      const filters: any = { periodo_id: periodoId };
      if (selectedMateriaId !== "all") {
        filters.materia_id = parseInt(selectedMateriaId);
      }
      return apiService.getList<Grupo>("grupos", {
        per_page: 100,
        filter: filters,
      });
    },
    enabled: !!periodoId && selectedMateriaId !== "all",
  });

  // Determinar qué endpoint usar basado en si hay grupo seleccionado
  const useGrupoEndpoint = selectedGrupoId !== "all";

  // Query para datos del Pareto por periodo (todos los grupos)
  const { data: paretoDataPeriodo, isLoading: isLoadingParetoPeriodo } = useQuery<
    ParetoData[]
  >({
    queryKey: ["paretoFactoresPeriodo", periodoId, carreraId, semestre],
    queryFn: () => apiService.getParetoFactoresByPeriodo(periodoId, carreraId, semestre),
    enabled: !!periodoId && !useGrupoEndpoint,
  });

  // Query para datos del Pareto por grupo específico
  const { data: paretoDataGrupo, isLoading: isLoadingParetoGrupo } = useQuery<
    ParetoData[]
  >({
    queryKey: ["paretoFactoresGrupo", selectedGrupoId],
    queryFn: () => apiService.getParetoFactores(parseInt(selectedGrupoId)),
    enabled: useGrupoEndpoint,
  });

  // Usar los datos correspondientes
  const paretoData = useGrupoEndpoint ? paretoDataGrupo : paretoDataPeriodo;
  const isLoadingPareto = useGrupoEndpoint ? isLoadingParetoGrupo : isLoadingParetoPeriodo;

  // Handlers
  const handleMateriaChange = (value: string) => {
    setSelectedMateriaId(value);
    setSelectedGrupoId("all");
  };

  const handleGrupoChange = (value: string) => {
    setSelectedGrupoId(value);
  };

  const generateParetoDescription = (data: ParetoData[]) => {
    if (!data || data.length === 0) return "Gráfico de Pareto sin datos disponibles.";
    
    const totalFactors = data.length;
    const topFactors = data.filter(d => d.porcentaje_acumulado <= 80);
    const topFactorsNames = topFactors.map(d => d.nombre).join(", ");
    
    return `
        1. Descripción general accesible:
        Gráfico de Pareto mostrando los factores de riesgo más frecuentes.
        
        2. Resumen narrativo:
        Se analizaron ${totalFactors} factores de riesgo.
        Los factores principales que representan el 80% de los problemas son: ${topFactorsNames || "Ninguno (distribución plana)"}.
    `.trim();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>Análisis de Pareto - Factores de Riesgo</CardTitle>
            {screenReader && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => speak(generateParetoDescription(paretoData || []))}
                  aria-label="Escuchar descripción del gráfico"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Escuchar Resumen
                </Button>
            )}
        </div>
        <CardDescription>
          Identifica los factores de riesgo más impactantes (regla 80/20)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros Opcionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro: Materia (Opcional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Materia (Opcional)</label>
            <Select
              value={selectedMateriaId}
              onValueChange={handleMateriaChange}
              disabled={!periodoId || isLoadingMaterias}
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

          {/* Filtro: Grupo (Opcional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grupo (Opcional)</label>
            <Select
              value={selectedGrupoId}
              onValueChange={handleGrupoChange}
              disabled={selectedMateriaId === "all" || isLoadingGrupos}
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

        {/* Sección del Gráfico */}
        <div>
          {!periodoId ? (
            <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">
                Selecciona un periodo para ver el análisis de Pareto
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
                  onMouseEnter={(data: any) => {
                    if (screenReader) {
                      speak(`Factor ${data.nombre}: ${data.frecuencia} ocurrencias, ${data.porcentaje_acumulado}% acumulado`);
                    }
                  }}
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
                No hay datos de factores de riesgo para este periodo
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
            <p className="text-sm text-muted-foreground mt-2">
              {selectedGrupoId !== "all" 
                ? "Mostrando datos de un grupo específico." 
                : "Mostrando datos agregados de todos los grupos del periodo seleccionado."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
