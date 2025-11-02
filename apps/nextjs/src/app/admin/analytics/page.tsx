"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService, type AnalyticsData, type AnalyticsFilters } from "@/services/dashboardService";
import { apiService } from "@/services/apiService";
import { Filter, TrendingUp, AlertTriangle } from "lucide-react";
import z from "zod";
import { ParetoFactoresGrupo } from "@/components/charts/pareto-factores-grupo";

interface Periodo {
  id: number;
  nombre: string;
  activo: boolean;
}

interface Carrera {
  id: number;
  nombre: string;
}

export default function AnalyticsPage() {
  // Filter states
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>("");
  const [selectedCarrera, setSelectedCarrera] = useState<string>("all");
  const [selectedSemestre, setSelectedSemestre] = useState<string>("all");

  // Fetch periodos
  const { data: periodosData } = useQuery({
    queryKey: ['periodos'],
    queryFn: () => apiService.getList<Periodo>('periodos', { per_page: 100 }),
  });

  // Fetch carreras
  const { data: carrerasData } = useQuery({
    queryKey: ['carreras'],
    queryFn: () => apiService.getList<Carrera>('carreras', { per_page: 100 }),
  });

  // Set default periodo to active one
  useEffect(() => {
    if (periodosData?.data && !selectedPeriodo) {
      const activePeriodo = periodosData.data.find(p => p.activo);
      if (activePeriodo) {
        setSelectedPeriodo(activePeriodo.id.toString());
      } else if (periodosData.data.length > 0) {
        setSelectedPeriodo(periodosData.data[0].id.toString());
      }
    }
  }, [periodosData, selectedPeriodo]);

  // Build filters for analytics query
  const analyticsFilters: AnalyticsFilters | null = selectedPeriodo
    ? {
        periodo_id: parseInt(selectedPeriodo),
        ...(selectedCarrera !== "all" && { carrera_id: parseInt(selectedCarrera) }),
        ...(selectedSemestre !== "all" && { semestre: parseInt(selectedSemestre) }),
      }
    : null;

  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['analytics', selectedPeriodo, selectedCarrera, selectedSemestre],
    queryFn: () => dashboardService.getAnalytics(analyticsFilters!),
    enabled: !!analyticsFilters,
  });

  const semestres = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Panel de Analíticas</h1>
        <p className="text-muted-foreground mt-2">
          Visualización de calificaciones y factores de riesgo
        </p>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filtros</CardTitle>
          </div>
          <CardDescription>
            Selecciona los criterios para filtrar los datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Periodo Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Periodo <span className="text-red-500">*</span>
              </label>
              <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
                  {periodosData?.data.map((periodo) => (
                    <SelectItem key={periodo.id} value={periodo.id.toString()}>
                      {periodo.nombre} {periodo.activo && "✓"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Carrera Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Carrera</label>
              <Select value={selectedCarrera} onValueChange={setSelectedCarrera}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las carreras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las carreras</SelectItem>
                  {carrerasData?.data.map((carrera) => (
                    <SelectItem key={carrera.id} value={carrera.id.toString()}>
                      {carrera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semestre Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select value={selectedSemestre} onValueChange={setSelectedSemestre}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los semestres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los semestres</SelectItem>
                  {semestres.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semestre {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grades Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle>Distribución de Calificaciones</CardTitle>
            </div>
            <CardDescription>
              Frecuencia de calificaciones finales por rango
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <div className="h-[300px] space-y-3">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={analyticsData?.calificaciones_data || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="rango" 
                      className="text-sm"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-sm"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        zIndex: 1000
                      }}
                      labelStyle={{ fontWeight: 'bold' }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Bar 
                      dataKey="frecuencia" 
                      fill="#3b82f6" 
                      name="Estudiantes"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Promedio General: {analyticsData?.promedio_general.toFixed(2) || "0.00"}
            </div>
            <div className="leading-none text-muted-foreground">
              Basado en {analyticsData?.calificaciones_data.reduce((acc, item) => acc + item.frecuencia, 0) || 0} calificaciones registradas
            </div>
          </CardFooter>
        </Card>

        {/* Risk Factors Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle>Factores de Riesgo Principales</CardTitle>
            </div>
            <CardDescription>
              Frecuencia de factores de riesgo detectados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <div className="h-[300px] space-y-3">
                <Skeleton className="h-full w-full" />
              </div>
            ) : analyticsData?.factores_riesgo_data.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay factores de riesgo registrados</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={analyticsData?.factores_riesgo_data || []} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      type="number"
                      className="text-sm"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="nombre" 
                      className="text-sm"
                      tick={{ fontSize: 11 }}
                      width={150}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        zIndex: 1000
                      }}
                      cursor={{ fill: 'rgba(130, 202, 157, 0.1)' }}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Bar 
                      dataKey="frecuencia" 
                      fill="#82ca9d" 
                      name="Ocurrencias"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Total de factores registrados: {analyticsData?.factores_riesgo_data.reduce((acc, item) => acc + item.frecuencia, 0) || 0}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Pareto Analysis Section */}
      <div>
        <ParetoFactoresGrupo />
      </div>
    </div>
  );
}
