"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, XCircle, TrendingDown, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService, type DashboardStats, type Periodo } from "@/services/dashboardService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>("");

  const fetchStats = async (periodoId?: number) => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats(periodoId);
      setStats(data);
      
      // Si no hay período seleccionado, usar el período activo o el seleccionado del backend
      if (!selectedPeriodo && data.periodoSeleccionado) {
        setSelectedPeriodo(data.periodoSeleccionado.toString());
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handlePeriodoChange = (value: string) => {
    setSelectedPeriodo(value);
    const periodoId = value === "all" ? undefined : parseInt(value);
    fetchStats(periodoId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Bienvenido al Sistema de Análisis</h1>
          <p className="text-muted-foreground">Monitoreo y análisis de deserción estudiantil</p>
        </div>
        
        {/* Filtro de Período */}
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedPeriodo} onValueChange={handlePeriodoChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los períodos</SelectItem>
              {stats?.periodos.map((periodo) => (
                <SelectItem key={periodo.id} value={periodo.id.toString()}>
                  {periodo.nombre} {periodo.activo && "✓"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Estudiantes */}
        <Card data-screen-reader-text={`Total estudiantes ${stats?.totalEstudiantes || 0} registrados en el sistema`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Estudiantes
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalEstudiantes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        {/* Reprobación Promedio */}
        <Card data-screen-reader-text={`Reprobación promedio ${stats?.reprobacionPromedio || 0}% tasa de reprobación actual`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reprobación Promedio
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.reprobacionPromedio || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasa de reprobación actual
            </p>
          </CardContent>
        </Card>

        {/* Deserción Estimada */}
        <Card data-screen-reader-text={`Deserción estimada ${stats?.desercionEstimada || 0}% estimación de deserción`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Deserción Estimada
              </CardTitle>
              <TrendingDown className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.desercionEstimada || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimación de deserción
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deserción por Semestre Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Deserción por Semestre</CardTitle>
          <CardDescription>
            Número de estudiantes que han desertado en cada semestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">Gráfico</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.desercionPorSemestre || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="semestre" 
                    className="text-sm"
                  />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="estudiantes" 
                    fill="rgb(59 130 246)" 
                    name="Estudiantes"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}