"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { apiService, IshikawaData } from "@/services/apiService";
import { PaginatedResponse } from "@/types/api";
import { IshikawaTemplate } from "@/components/charts/ishikawa-template";
import { IshikawaDiagramSVG } from "@/components/charts/ishikawa-diagram-svg";

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

export default function IshikawaPage() {
  const [periodoId, setPeriodoId] = useState<number | null>(null);
  const [materiaId, setMateriaId] = useState<number | null>(null);
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [observaciones, setObservaciones] = useState<Record<string, string>>({});

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

  // Query para datos de Ishikawa (habilitado solo si hay grupo seleccionado)
  const { data: ishikawaData, isLoading: isLoadingIshikawa } = useQuery<
    IshikawaData
  >({
    queryKey: ["ishikawaData", grupoId],
    queryFn: () => apiService.getIshikawaData(grupoId!),
    enabled: !!grupoId,
  });

  // Query para obtener el último análisis guardado
  const { data: savedAnalysisData } = useQuery({
    queryKey: ["savedIshikawa", grupoId],
    queryFn: () => apiService.getLatestIshikawaAnalysis(grupoId!),
    enabled: !!grupoId,
  });

  // Cargar observaciones guardadas cuando se obtienen
  useEffect(() => {
    if (savedAnalysisData?.data?.observaciones) {
      setObservaciones(savedAnalysisData.data.observaciones);
    } else {
      setObservaciones({});
    }
  }, [savedAnalysisData]);

  // Mutation para guardar el análisis
  const saveMutation = useMutation({
    mutationFn: (data: { tasa_reprobacion: number; observaciones: Record<string, string> }) =>
      apiService.saveIshikawaAnalysis(grupoId!, data),
    onSuccess: () => {
      toast.success("Análisis guardado exitosamente");
    },
    onError: () => {
      toast.error("Error al guardar el análisis");
    },
  });

  // Handlers para los cambios de selección
  const handlePeriodoChange = (value: string) => {
    setPeriodoId(Number(value));
    setMateriaId(null);
    setGrupoId(null);
    setObservaciones({});
  };

  const handleMateriaChange = (value: string) => {
    setMateriaId(Number(value));
    setGrupoId(null);
    setObservaciones({});
  };

  const handleGrupoChange = (value: string) => {
    setGrupoId(Number(value));
    setObservaciones({});
  };

  const handleObservacionChange = (categoria: string, value: string) => {
    setObservaciones((prev) => ({
      ...prev,
      [categoria]: value,
    }));
  };

  const handleSave = () => {
    if (!ishikawaData) return;
    
    saveMutation.mutate({
      tasa_reprobacion: ishikawaData.tasa_reprobacion,
      observaciones,
    });
  };

  const handlePrint = () => {
    window.print();
    toast.success("Abriendo diálogo de impresión");
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">
          Diagrama de Ishikawa
        </h1>
        <p className="text-muted-foreground mt-2">
          Análisis de causa-raíz para identificar los factores que contribuyen
          a la reprobación del grupo
        </p>
      </div>

      {/* Card de Filtros */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Seleccionar Grupo</CardTitle>
          <CardDescription>
            Filtra por periodo, materia y grupo para generar el diagrama
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Sección del Diagrama */}
      {!grupoId ? (
        <Card className="print:hidden">
          <CardContent className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">
              Selecciona un grupo para generar el diagrama de Ishikawa
            </p>
          </CardContent>
        </Card>
      ) : isLoadingIshikawa ? (
        <Card className="print:hidden">
          <CardContent className="p-6">
            <Skeleton className="w-full h-[500px]" />
          </CardContent>
        </Card>
      ) : ishikawaData && ishikawaData.causas_principales.length > 0 ? (
        <IshikawaDiagramSVG 
          data={ishikawaData} 
          observaciones={observaciones}
          onObservacionChange={handleObservacionChange}
          onSave={handleSave}
          onPrint={handlePrint}
          isSaving={saveMutation.isPending}
        />
      ) : (
        <Card className="print:hidden">
          <CardContent className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">
              No hay datos de factores de riesgo para este grupo
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
