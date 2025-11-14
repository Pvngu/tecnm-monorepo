"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DynamicSelect } from "@/components/common/DynamicSelect";
import { Plus, Trash2 } from "lucide-react";

const inscripcionSchema = z.object({
  grupo_id: z.number().min(1, "El grupo es requerido"),
});

interface AlumnoInscripcionesManagerProps {
  inscripciones: any[];
  alumnoId: number;
}

export function AlumnoInscripcionesManager({
  inscripciones,
  alumnoId,
}: AlumnoInscripcionesManagerProps) {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState<any>(null);

  const inscripcionForm = useForm({
    resolver: zodResolver(inscripcionSchema),
    defaultValues: {
      grupo_id: 0,
    },
  });

  const createInscripcionMutation = useMutation({
    mutationFn: (data: { alumno_id: number; grupo_id: number }) =>
      apiService.create("inscripciones", data),
    onSuccess: () => {
      toast.success("Alumno inscrito correctamente");
      queryClient.invalidateQueries({ queryKey: ["alumno", String(alumnoId)] });
      setOpenDialog(false);
      inscripcionForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al inscribir al alumno");
    },
  });

  const deleteInscripcionMutation = useMutation({
    mutationFn: (inscripcionId: number) =>
      apiService.delete("inscripciones", inscripcionId),
    onSuccess: () => {
      toast.success("Inscripción eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["alumno", String(alumnoId)] });
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al eliminar la inscripción");
    },
  });

  const onSubmitInscripcion = (data: { grupo_id: number }) => {
    createInscripcionMutation.mutate({
      alumno_id: alumnoId,
      grupo_id: data.grupo_id,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inscripciones y Calificaciones</CardTitle>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Inscribir a Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inscribir a Grupo</DialogTitle>
              <DialogDescription>
                Selecciona el grupo al que deseas inscribir al alumno
              </DialogDescription>
            </DialogHeader>
            <Form {...inscripcionForm}>
              <form
                onSubmit={inscripcionForm.handleSubmit(onSubmitInscripcion)}
                className="space-y-4"
              >
                <FormField
                  control={inscripcionForm.control}
                  name="grupo_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo</FormLabel>
                      <FormControl>
                        <DynamicSelect
                          resource="grupos"
                          optionValueKey="id"
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          placeholder="Selecciona un grupo"
                          searchKey="horario"
                          customLabel={(grupo) => 
                            `${grupo.materia?.nombre || 'Sin materia'} - ${grupo.profesor?.nombre || 'Sin profesor'} ${grupo.profesor?.apellido_paterno || ''} - ${grupo.horario}`
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createInscripcionMutation.isPending}
                  >
                    {createInscripcionMutation.isPending
                      ? "Inscribiendo..."
                      : "Inscribir"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {inscripciones.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay inscripciones registradas
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {inscripciones.map((inscripcion) => (
              <AccordionItem key={inscripcion.id} value={`inscripcion-${inscripcion.id}`}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        {inscripcion.grupo?.materia?.nombre || "Sin materia"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {inscripcion.grupo?.profesor?.nombre || "Sin profesor"}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {inscripcion.calificacion_final
                        ? `${inscripcion.calificacion_final}`
                        : "S/C"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <InscripcionCalificacionesForm
                    inscripcion={inscripcion}
                    alumnoId={alumnoId}
                    onDelete={() => deleteInscripcionMutation.mutate(inscripcion.id)}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

// Componente interno para el formulario de calificaciones
interface InscripcionCalificacionesFormProps {
  inscripcion: any;
  alumnoId: number;
  onDelete: () => void;
}

function InscripcionCalificacionesForm({
  inscripcion,
  alumnoId,
  onDelete,
}: InscripcionCalificacionesFormProps) {
  const queryClient = useQueryClient();
  const unidades = inscripcion.grupo?.materia?.unidades || [];

  const [calificaciones, setCalificaciones] = useState<
    { unidad_id: number; valor_calificacion: number }[]
  >(() => {
    return unidades.map((unidad: any) => {
      const calExistente = inscripcion.calificaciones?.find(
        (cal: any) => cal.unidad_id === unidad.id
      );
      return {
        unidad_id: unidad.id,
        valor_calificacion: calExistente?.valor_calificacion || 0,
      };
    });
  });

  const updateCalificacionesMutation = useMutation({
    mutationFn: (data: {
      calificaciones: { unidad_id: number; valor_calificacion: number }[];
    }) => apiService.updateCalificacionesBulk(inscripcion.id, data),
    onSuccess: () => {
      toast.success("Calificaciones actualizadas correctamente");
      queryClient.invalidateQueries({ queryKey: ["alumno", String(alumnoId)] });
    },
    onError: (error: any) => {
      toast.error(
        error.data?.message || "Error al actualizar las calificaciones"
      );
    },
  });

  const handleSaveCalificaciones = () => {
    updateCalificacionesMutation.mutate({
      calificaciones,
    });
  };

  const handleCalificacionChange = (unidadId: number, valor: number) => {
    setCalificaciones((prev) =>
      prev.map((cal) =>
        cal.unidad_id === unidadId
          ? { ...cal, valor_calificacion: valor }
          : cal
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">Calificaciones por Unidad</h4>
        {unidades.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Esta materia no tiene unidades configuradas
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unidades.map((unidad: any) => {
              const calificacion = calificaciones.find(
                (cal) => cal.unidad_id === unidad.id
              );
              return (
                <div key={unidad.id} className="flex items-center gap-2">
                  <label className="text-sm flex-1">Unidad {unidad.numero_unidad}</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={calificacion?.valor_calificacion || 0}
                    onChange={(e) =>
                      handleCalificacionChange(
                        unidad.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-24"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {inscripcion.calificacion_final !== null && (
        <div className="flex items-center gap-2 pt-2">
          <label className="text-sm font-medium flex-1">Calificación Final</label>
          <div className="w-24 text-right font-semibold">
            {Number(inscripcion.calificacion_final).toFixed(2)}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Dar de Baja de Grupo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará la inscripción del alumno a este grupo.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          onClick={handleSaveCalificaciones}
          disabled={updateCalificacionesMutation.isPending}
        >
          {updateCalificacionesMutation.isPending
            ? "Guardando..."
            : "Guardar Calificaciones"}
        </Button>
      </div>
    </div>
  );
}
