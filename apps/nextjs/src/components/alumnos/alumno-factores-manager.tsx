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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";

const factorSchema = z.object({
  factor_id: z.number().min(1, "El factor de riesgo es requerido"),
  observaciones: z.string().optional(),
});

interface AlumnoFactoresManagerProps {
  inscripciones: any[];
}

export function AlumnoFactoresManager({
  inscripciones,
}: AlumnoFactoresManagerProps) {
  const queryClient = useQueryClient();
  const [selectedInscripcionId, setSelectedInscripcionId] = useState<
    number | null
  >(inscripciones[0]?.id || null);
  const [openDialog, setOpenDialog] = useState(false);

  const factorForm = useForm({
    resolver: zodResolver(factorSchema),
    defaultValues: {
      factor_id: 0,
      observaciones: "",
    },
  });

  const selectedInscripcion = inscripciones.find(
    (i) => i.id === selectedInscripcionId
  );

  const createFactorMutation = useMutation({
    mutationFn: (data: {
      inscripcion_id: number;
      factor_id: number;
      observaciones?: string;
    }) => apiService.create("alumnos-factores", data),
    onSuccess: () => {
      toast.success("Factor de riesgo añadido correctamente");
      queryClient.invalidateQueries({ queryKey: ["alumno"] });
      setOpenDialog(false);
      factorForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al añadir el factor de riesgo");
    },
  });

  const deleteFactorMutation = useMutation({
    mutationFn: (factorId: number) =>
      apiService.delete("alumnos-factores", factorId),
    onSuccess: () => {
      toast.success("Factor de riesgo eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["alumno"] });
    },
    onError: (error: any) => {
      toast.error(
        error.data?.message || "Error al eliminar el factor de riesgo"
      );
    },
  });

  const onSubmitFactor = (data: { factor_id: number; observaciones?: string }) => {
    if (!selectedInscripcionId) {
      toast.error("Por favor selecciona una inscripción");
      return;
    }

    createFactorMutation.mutate({
      inscripcion_id: selectedInscripcionId,
      factor_id: data.factor_id,
      observaciones: data.observaciones,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Factores de Riesgo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selector de Inscripción */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Seleccionar Inscripción</label>
          <Select
            value={selectedInscripcionId?.toString() || ""}
            onValueChange={(value: string) => setSelectedInscripcionId(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una inscripción" />
            </SelectTrigger>
            <SelectContent>
              {inscripciones.map((inscripcion) => (
                <SelectItem
                  key={inscripcion.id}
                  value={inscripcion.id.toString()}
                >
                  {inscripcion.grupo?.materia?.nombre || "Sin materia"} -{" "}
                  {inscripcion.grupo?.profesor?.nombre || "Sin profesor"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botón para añadir factor */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button disabled={!selectedInscripcionId}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Factor de Riesgo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Factor de Riesgo</DialogTitle>
              <DialogDescription>
                Añade un nuevo factor de riesgo a la inscripción seleccionada
              </DialogDescription>
            </DialogHeader>
            <Form {...factorForm}>
              <form
                onSubmit={factorForm.handleSubmit(onSubmitFactor)}
                className="space-y-4"
              >
                <FormField
                  control={factorForm.control}
                  name="factor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Factor de Riesgo</FormLabel>
                      <FormControl>
                        <DynamicSelect
                          resource="factores-riesgo"
                          optionLabelKey="nombre"
                          optionValueKey="id"
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          placeholder="Selecciona un factor"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={factorForm.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Añade observaciones (opcional)"
                          rows={4}
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
                    disabled={createFactorMutation.isPending}
                  >
                    {createFactorMutation.isPending ? "Añadiendo..." : "Añadir"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Lista de factores */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Factores Asignados a esta Inscripción
          </h4>
          {!selectedInscripcion ? (
            <p className="text-sm text-muted-foreground">
              Selecciona una inscripción para ver sus factores de riesgo
            </p>
          ) : selectedInscripcion.factores?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay factores de riesgo asignados
            </p>
          ) : (
            <div className="space-y-3">
              {selectedInscripcion.factores?.map((alumnoFactor: any) => (
                <div
                  key={alumnoFactor.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">
                        {alumnoFactor.factor?.nombre || "Sin nombre"}
                      </Badge>
                    </div>
                    {alumnoFactor.observaciones && (
                      <p className="text-sm text-muted-foreground">
                        {alumnoFactor.observaciones}
                      </p>
                    )}
                    {alumnoFactor.fecha_registro && (
                      <p className="text-xs text-muted-foreground">
                        Registrado:{" "}
                        {new Date(
                          alumnoFactor.fecha_registro
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará este factor de riesgo. Esta
                          acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteFactorMutation.mutate(alumnoFactor.id)
                          }
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
