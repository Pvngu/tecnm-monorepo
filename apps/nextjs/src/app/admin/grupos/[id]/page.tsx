'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, GrupoAlumno } from "@/services/apiService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Save, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Grupo {
  id: number;
  materia: { id: number; nombre: string } | null;
  profesor?: { id: number; nombre: string } | null;
  periodo: { id: number; nombre: string } | null;
  carrera?: { id: number; nombre: string } | null;
  horario?: string | null;
  aula?: string | null;
}

type AsistenciaEstatus = "presente" | "ausente" | "retardo";

const estatusOptions = [
  { label: "Presente", value: "presente" },
  { label: "Ausente", value: "ausente" },
  { label: "Retardo", value: "retardo" },
];

export default function GrupoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const grupoId = params.id as string;
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [asistencias, setAsistencias] = useState<Record<number, AsistenciaEstatus>>({});

  const dateString = format(selectedDate, "yyyy-MM-dd");

  // Fetch grupo details
  const { data: grupo, isLoading: isLoadingGrupo } = useQuery<Grupo>({
    queryKey: ["grupos", grupoId, "include"],
    queryFn: () => apiService.getOneWithIncludes<Grupo>(
      "grupos",
      grupoId,
      ["materia", "profesor", "periodo", "carrera"]
    ),
  });

  // Fetch alumnos in grupo
  const { data: alumnos, isLoading: isLoadingAlumnos } = useQuery<GrupoAlumno[]>({
    queryKey: ["grupos", grupoId, "alumnos"],
    queryFn: () => apiService.getGrupoAlumnos(Number(grupoId)),
  });

  // Fetch existing attendance for selected date
  const { data: existingAsistencias, isLoading: isLoadingAsistencias } = useQuery({
    queryKey: ["grupos", grupoId, "asistencias", dateString],
    queryFn: () => apiService.getGrupoAsistencias(Number(grupoId), dateString),
    enabled: !!dateString,
  });

  // Update asistencias state when existing data loads
  useEffect(() => {
    if (existingAsistencias && alumnos) {
      const newAsistencias: Record<number, AsistenciaEstatus> = {};
      alumnos.forEach((alumno) => {
        const existing = existingAsistencias[alumno.inscripcion_id];
        newAsistencias[alumno.inscripcion_id] = existing?.estatus || "ausente";
      });
      setAsistencias(newAsistencias);
    } else if (alumnos && !existingAsistencias) {
      // Initialize all as absent if no existing data
      const newAsistencias: Record<number, AsistenciaEstatus> = {};
      alumnos.forEach((alumno) => {
        newAsistencias[alumno.inscripcion_id] = "ausente";
      });
      setAsistencias(newAsistencias);
    }
  }, [existingAsistencias, alumnos, dateString]);

  const handleStatusChange = (inscripcionId: number, estatus: AsistenciaEstatus) => {
    setAsistencias((prev) => ({ ...prev, [inscripcionId]: estatus }));
  };

  // Mutation for saving attendance
  const saveAsistenciasMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        fecha: dateString,
        asistencias: Object.entries(asistencias).map(([inscripcion_id, estatus]) => ({
          inscripcion_id: Number(inscripcion_id),
          estatus,
        })),
      };

      return apiService.saveAsistenciasBulk(Number(grupoId), payload);
    },
    onSuccess: () => {
      toast.success("Asistencias guardadas correctamente");
      queryClient.invalidateQueries({ queryKey: ["grupos", grupoId, "asistencias", dateString] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al guardar asistencias");
    },
  });

  const handleSave = () => {
    saveAsistenciasMutation.mutate();
  };

  const getStatusSummary = () => {
    const summary = {
      presente: 0,
      ausente: 0,
      retardo: 0,
    };

    Object.values(asistencias).forEach((status) => {
      summary[status]++;
    });

    return summary;
  };

  const summary = getStatusSummary();

  if (isLoadingGrupo || isLoadingAlumnos) {
    return (
      <div className="container mx-auto py-10 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!grupo) {
    return (
      <div className="container mx-auto py-10">
        <p>Grupo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {grupo.materia?.nombre || "Grupo"}
            </h1>
            <p className="text-muted-foreground">
              Gestión de asistencias y alumnos
            </p>
          </div>
        </div>
      </div>

      {/* Group Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Grupo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Materia</p>
            <p className="text-lg">{grupo.materia?.nombre || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Profesor</p>
            <p className="text-lg">{grupo.profesor?.nombre || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Periodo</p>
            <p className="text-lg">{grupo.periodo?.nombre || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Aula</p>
            <p className="text-lg">{grupo.aula || "N/A"}</p>
          </div>
          {grupo.horario && (
            <div className="col-span-full">
              <p className="text-sm font-medium text-muted-foreground">Horario</p>
              <p className="text-lg">{grupo.horario}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Asistencias</CardTitle>
              <CardDescription>
                {alumnos?.length || 0} alumnos inscritos
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-60 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={saveAsistenciasMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {saveAsistenciasMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{summary.presente}</p>
                  <p className="text-sm text-muted-foreground">Presentes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{summary.ausente}</p>
                  <p className="text-sm text-muted-foreground">Ausentes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{summary.retardo}</p>
                  <p className="text-sm text-muted-foreground">Retardos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Table */}
          {isLoadingAsistencias ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead className="text-right">Asistencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnos && alumnos.length > 0 ? (
                  alumnos.map((alumno) => (
                    <TableRow key={alumno.inscripcion_id}>
                      <TableCell className="font-medium">{alumno.matricula}</TableCell>
                      <TableCell>{alumno.nombre_completo}</TableCell>
                      <TableCell>{alumno.semestre}</TableCell>
                      <TableCell>{alumno.carrera || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={asistencias[alumno.inscripcion_id] || "ausente"}
                          onValueChange={(value: string) =>
                            handleStatusChange(
                              alumno.inscripcion_id,
                              value as AsistenciaEstatus
                            )
                          }
                        >
                          <SelectTrigger className="w-[140px] ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {estatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        No hay alumnos inscritos en este grupo
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
