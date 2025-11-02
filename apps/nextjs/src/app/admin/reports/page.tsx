"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText } from "lucide-react";
import { SummaryReport } from "@/components/reports";
import { apiService } from "@/services/apiService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReportFilters {
  periodoId: number | null;
  carreraId: number | null;
}

interface Periodo {
  id: number;
  nombre: string;
  activo: boolean;
}

interface Carrera {
  id: number;
  nombre: string;
}

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    periodoId: null,
    carreraId: null,
  });

  // Query para obtener el reporte (deshabilitada por defecto)
  const {
    data: reportData,
    isLoading: isLoadingReport,
    refetch: generateReport,
    isFetching,
    error: reportError,
  } = useQuery({
    queryKey: ["report-summary", filters.periodoId, filters.carreraId],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (filters.periodoId) params.periodo_id = filters.periodoId;
      if (filters.carreraId) params.carrera_id = filters.carreraId;

      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reportes/summary?${queryString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al generar el reporte");
      }

      return response.json();
    },
    enabled: false, // No ejecutar automáticamente
  });

  // Queries para los filtros usando apiService
  const { data: periodosData, isLoading: isLoadingPeriodos, error: periodosError } = useQuery({
    queryKey: ["periodos"],
    queryFn: async () => {
      const result = await apiService.getList<Periodo>("periodos", { per_page: 100 });
      console.log("Periodos cargados:", result);
      return result;
    },
  });

  const { data: carrerasData, isLoading: isLoadingCarreras, error: carrerasError } = useQuery({
    queryKey: ["carreras"],
    queryFn: async () => {
      const result = await apiService.getList<Carrera>("carreras", { per_page: 100 });
      console.log("Carreras cargadas:", result);
      return result;
    },
  });

  const handleGenerateReport = () => {
    if (!filters.periodoId) {
      alert("Por favor selecciona un periodo");
      return;
    }
    generateReport();
  };

  const selectedPeriodo = periodosData?.data.find((p) => p.id === filters.periodoId);
  const selectedCarrera = carrerasData?.data.find((c) => c.id === filters.carreraId);

  // Mostrar estado de carga de filtros
  if (isLoadingPeriodos || isLoadingCarreras) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando filtros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="hide-on-print">
        <h1 className="text-3xl font-bold mb-2">Generación de Reportes</h1>
        <p className="text-muted-foreground mb-6">
          Genera reportes automáticos con métricas clave y recomendaciones de mejora
        </p>

        {/* Mostrar errores si los hay */}
        {(periodosError || carrerasError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Error al cargar los filtros: {periodosError?.message || carrerasError?.message}
              <br />
              Por favor, verifica tu conexión e intenta recargar la página.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Filtros del Reporte</CardTitle>
            <CardDescription>
              Selecciona el periodo y opcionalmente una carrera específica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Debug info */}
            <div className="text-xs text-muted-foreground mb-2">
              Debug: Periodos: {periodosData?.data?.length || 0} | Carreras: {carrerasData?.data?.length || 0}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodo">Periodo *</Label>
                <Select
                  value={filters.periodoId?.toString() || ""}
                  onValueChange={(value: string) =>
                    setFilters((prev) => ({ ...prev, periodoId: parseInt(value) }))
                  }
                >
                  <SelectTrigger id="periodo">
                    <SelectValue placeholder="Selecciona un periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodosData?.data && periodosData.data.length > 0 ? (
                      periodosData.data.map((periodo) => (
                        <SelectItem key={periodo.id} value={periodo.id.toString()}>
                          {periodo.nombre}{periodo.activo ? " (Activo)" : ""}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No hay periodos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrera">Carrera</Label>
                <Select
                  value={filters.carreraId?.toString() || "all"}
                  onValueChange={(value: string) =>
                    setFilters((prev) => ({
                      ...prev,
                      carreraId: value === "all" ? null : parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger id="carrera">
                    <SelectValue placeholder="Todas las carreras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las carreras</SelectItem>
                    {carrerasData?.data && carrerasData.data.length > 0 ? (
                      carrerasData.data.map((carrera) => (
                        <SelectItem key={carrera.id} value={carrera.id.toString()}>
                          {carrera.nombre}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No hay carreras disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateReport}
                disabled={!filters.periodoId || isFetching}
                size="lg"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generar Reporte
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mostrar el reporte generado */}
      {reportError && (
        <Alert variant="destructive">
          <AlertDescription>
            Error al generar el reporte: {reportError.message}
          </AlertDescription>
        </Alert>
      )}

      {isLoadingReport && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {reportData && !isLoadingReport && (
        <SummaryReport
          data={reportData}
          periodo={selectedPeriodo}
          carrera={selectedCarrera}
        />
      )}

      {!reportData && !isLoadingReport && !isFetching && (
        <Card className="hide-on-print">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground text-center">
              Selecciona los filtros y genera un reporte para visualizar los resultados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
