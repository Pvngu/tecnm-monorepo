'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, GrupoAlumno, Unidad } from "@/services/apiService";
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
import { CalendarIcon, ArrowLeft, Save, Users, Plus, Trash2, BookOpen, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isAddAlumnoDialogOpen, setIsAddAlumnoDialogOpen] = useState(false);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<number | null>(null);
  const [alumnoToRemove, setAlumnoToRemove] = useState<{ id: number; nombre: string } | null>(null);
  const [isUnidadDialogOpen, setIsUnidadDialogOpen] = useState(false);
  const [unidadToEdit, setUnidadToEdit] = useState<Unidad | null>(null);
  const [unidadToDelete, setUnidadToDelete] = useState<Unidad | null>(null);
  const [unidadForm, setUnidadForm] = useState({ numero_unidad: 1, nombre_unidad: "" });

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

  // Fetch unidades for the grupo's materia
  const { data: unidades, isLoading: isLoadingUnidades } = useQuery<Unidad[]>({
    queryKey: ["grupos", grupoId, "unidades"],
    queryFn: () => apiService.getGrupoUnidades(Number(grupoId)),
  });

  // Fetch all available alumnos for adding to grupo
  const { data: availableAlumnos } = useQuery({
    queryKey: ["alumnos", "all"],
    queryFn: () => apiService.getList("alumnos", { per_page: 1000 }),
    enabled: isAddAlumnoDialogOpen,
  });

  // Mutation to add alumno to grupo
  const addAlumnoMutation = useMutation({
    mutationFn: (alumnoId: number) => apiService.addAlumnoToGrupo(Number(grupoId), alumnoId),
    onSuccess: () => {
      toast.success("Alumno agregado al grupo");
      queryClient.invalidateQueries({ queryKey: ["grupos", grupoId, "alumnos"] });
      setIsAddAlumnoDialogOpen(false);
      setSelectedAlumnoId(null);
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al agregar alumno");
    },
  });

  // Mutation to remove alumno from grupo
  const removeAlumnoMutation = useMutation({
    mutationFn: (inscripcionId: number) => 
      apiService.removeAlumnoFromGrupo(Number(grupoId), inscripcionId),
    onSuccess: () => {
      toast.success("Alumno removido del grupo");
      queryClient.invalidateQueries({ queryKey: ["grupos", grupoId, "alumnos"] });
      setAlumnoToRemove(null);
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al remover alumno");
    },
  });

  const handleAddAlumno = () => {
    if (selectedAlumnoId) {
      addAlumnoMutation.mutate(selectedAlumnoId);
    }
  };

  const handleRemoveAlumno = () => {
    if (alumnoToRemove) {
      removeAlumnoMutation.mutate(alumnoToRemove.id);
    }
  };

  // Mutations for unidades
  const createUnidadMutation = useMutation({
    mutationFn: (data: { numero_unidad: number; nombre_unidad?: string }) =>
      apiService.createGrupoUnidad(Number(grupoId), data),
    onSuccess: () => {
      toast.success("Unidad creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["grupos", grupoId, "unidades"] });
      setIsUnidadDialogOpen(false);
      setUnidadForm({ numero_unidad: 1, nombre_unidad: "" });
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al crear unidad");
    },
  });

  const updateUnidadMutation = useMutation({
    mutationFn: (data: { unidadId: number; numero_unidad: number; nombre_unidad?: string }) =>
      apiService.updateGrupoUnidad(Number(grupoId), data.unidadId, {
        numero_unidad: data.numero_unidad,
        nombre_unidad: data.nombre_unidad,
      }),
    onSuccess: () => {
      toast.success("Unidad actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["grupos", grupoId, "unidades"] });
      setIsUnidadDialogOpen(false);
      setUnidadToEdit(null);
      setUnidadForm({ numero_unidad: 1, nombre_unidad: "" });
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al actualizar unidad");
    },
  });

  const deleteUnidadMutation = useMutation({
    mutationFn: (unidadId: number) => apiService.deleteGrupoUnidad(Number(grupoId), unidadId),
    onSuccess: () => {
      toast.success("Unidad eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["grupos", grupoId, "unidades"] });
      setUnidadToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al eliminar unidad");
    },
  });

  const handleOpenUnidadDialog = (unidad?: Unidad) => {
    if (unidad) {
      setUnidadToEdit(unidad);
      setUnidadForm({
        numero_unidad: unidad.numero_unidad,
        nombre_unidad: unidad.nombre_unidad || "",
      });
    } else {
      setUnidadToEdit(null);
      setUnidadForm({ numero_unidad: (unidades?.length || 0) + 1, nombre_unidad: "" });
    }
    setIsUnidadDialogOpen(true);
  };

  const handleSaveUnidad = () => {
    if (unidadToEdit) {
      updateUnidadMutation.mutate({
        unidadId: unidadToEdit.id,
        ...unidadForm,
      });
    } else {
      createUnidadMutation.mutate(unidadForm);
    }
  };

  // Filter out already enrolled alumnos
  const alumnosNotInGrupo = availableAlumnos?.data.filter(
    (alumno: any) => !alumnos?.some((enrolled) => enrolled.id === alumno.id)
  ) || [];

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

      {/* Tabs for different sections */}
      <Tabs defaultValue="asistencias" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="asistencias">Asistencias</TabsTrigger>
          <TabsTrigger value="alumnos">Gestionar Alumnos</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
        </TabsList>

        {/* Asistencias Tab */}
        <TabsContent value="asistencias">
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
        </TabsContent>

        {/* Alumnos Management Tab */}
        <TabsContent value="alumnos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestionar Alumnos</CardTitle>
                  <CardDescription>
                    Agregar o remover alumnos del grupo
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddAlumnoDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Alumno
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAlumnoToRemove({ 
                              id: alumno.inscripcion_id, 
                              nombre: alumno.nombre_completo 
                            })}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unidades Tab */}
        <TabsContent value="unidades">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Unidades de la Materia</CardTitle>
                  <CardDescription>
                    Unidades que pertenecen a {grupo.materia?.nombre}
                  </CardDescription>
                </div>
                <Button onClick={() => handleOpenUnidadDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Unidad
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingUnidades ? (
                <Skeleton className="h-48 w-full" />
              ) : unidades && unidades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Nombre de la Unidad</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unidades.map((unidad) => (
                      <TableRow key={unidad.id}>
                        <TableCell className="font-medium">
                          Unidad {unidad.numero_unidad}
                        </TableCell>
                        <TableCell>{unidad.nombre_unidad || "Sin nombre"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenUnidadDialog(unidad)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUnidadToDelete(unidad)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">
                    No hay unidades configuradas para esta materia
                  </p>
                  <Button onClick={() => handleOpenUnidadDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primera Unidad
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Alumno Dialog */}
      <Dialog open={isAddAlumnoDialogOpen} onOpenChange={setIsAddAlumnoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Alumno al Grupo</DialogTitle>
            <DialogDescription>
              Selecciona un alumno para inscribir en este grupo
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedAlumnoId?.toString() || ""}
              onValueChange={(value: string) => setSelectedAlumnoId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar alumno" />
              </SelectTrigger>
              <SelectContent>
                {alumnosNotInGrupo.map((alumno: any) => (
                  <SelectItem key={alumno.id} value={alumno.id.toString()}>
                    {alumno.matricula} - {alumno.nombre} {alumno.apellido_paterno}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddAlumnoDialogOpen(false);
                setSelectedAlumnoId(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddAlumno}
              disabled={!selectedAlumnoId || addAlumnoMutation.isPending}
            >
              {addAlumnoMutation.isPending ? "Agregando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Alumno Confirmation */}
      <AlertDialog open={!!alumnoToRemove} onOpenChange={() => setAlumnoToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Remover alumno del grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas remover a <strong>{alumnoToRemove?.nombre}</strong> de este grupo?
              Esta acción eliminará todas las asistencias y calificaciones asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlumnoToRemove(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAlumno}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeAlumnoMutation.isPending ? "Removiendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Unidad Dialog */}
      <Dialog open={isUnidadDialogOpen} onOpenChange={setIsUnidadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {unidadToEdit ? "Editar Unidad" : "Crear Nueva Unidad"}
            </DialogTitle>
            <DialogDescription>
              {unidadToEdit 
                ? "Modifica los datos de la unidad"
                : "Agrega una nueva unidad a esta materia"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="numero_unidad">Número de Unidad</Label>
              <Input
                id="numero_unidad"
                type="number"
                min="1"
                value={unidadForm.numero_unidad}
                onChange={(e) => setUnidadForm({ 
                  ...unidadForm, 
                  numero_unidad: parseInt(e.target.value) || 1 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_unidad">Nombre de la Unidad</Label>
              <Input
                id="nombre_unidad"
                type="text"
                placeholder="Ej: Introducción a la programación"
                value={unidadForm.nombre_unidad}
                onChange={(e) => setUnidadForm({ 
                  ...unidadForm, 
                  nombre_unidad: e.target.value 
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUnidadDialogOpen(false);
                setUnidadToEdit(null);
                setUnidadForm({ numero_unidad: 1, nombre_unidad: "" });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveUnidad}
              disabled={createUnidadMutation.isPending || updateUnidadMutation.isPending}
            >
              {(createUnidadMutation.isPending || updateUnidadMutation.isPending)
                ? "Guardando..."
                : unidadToEdit
                ? "Actualizar"
                : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Unidad Confirmation */}
      <AlertDialog open={!!unidadToDelete} onOpenChange={() => setUnidadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar unidad?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la <strong>Unidad {unidadToDelete?.numero_unidad}</strong>
              {unidadToDelete?.nombre_unidad && ` - ${unidadToDelete.nombre_unidad}`}?
              Esta acción eliminará todas las calificaciones asociadas a esta unidad.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUnidadToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => unidadToDelete && deleteUnidadMutation.mutate(unidadToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUnidadMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
