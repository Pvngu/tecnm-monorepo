"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("ishikawa-diagram");
      if (!element) {
        toast.error("No se pudo encontrar el diagrama");
        return;
      }

      // Ocultar botones antes de capturar
      const buttons = element.querySelectorAll("button");
      buttons.forEach((btn) => {
        (btn as HTMLElement).style.display = "none";
      });

      // Esperar un momento para que se apliquen los cambios
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Crear el canvas con configuración mejorada
      const canvas = await html2canvas(element, {
        scale: 3, // Mayor escala para mejor calidad
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        // Forzar renderizado de pseudoelementos
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("ishikawa-diagram");
          if (clonedElement) {
            // Asegurar que todo sea visible
            clonedElement.style.overflow = "visible";
            clonedElement.style.height = "auto";
          }
        },
      });

      // Mostrar botones nuevamente
      buttons.forEach((btn) => {
        (btn as HTMLElement).style.display = "";
      });

      // Crear el PDF con mejor tamaño
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular dimensiones manteniendo aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(
        (pdfWidth - 20) / imgWidth, 
        (pdfHeight - 20) / imgHeight
      );
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = (pdfHeight - finalHeight) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        finalWidth,
        finalHeight
      );

      // Descargar el PDF con nombre descriptivo
      const fecha = new Date().toISOString().split('T')[0];
      pdf.save(`ishikawa-grupo-${grupoId}-${fecha}.pdf`);
      toast.success("PDF generado exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Diagrama de Ishikawa
        </h1>
        <p className="text-muted-foreground mt-2">
          Análisis de causa-raíz para identificar los factores que contribuyen
          a la reprobación del grupo
        </p>
      </div>

      {/* Card de Filtros */}
      <Card>
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
        <Card>
          <CardContent className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">
              Selecciona un grupo para generar el diagrama de Ishikawa
            </p>
          </CardContent>
        </Card>
      ) : isLoadingIshikawa ? (
        <Card>
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
          onExportPDF={handleExportPDF}
          isSaving={saveMutation.isPending}
          isExporting={isExporting}
        />
      ) : (
        <Card>
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
