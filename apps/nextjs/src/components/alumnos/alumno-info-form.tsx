"use client";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DynamicSelect } from "@/components/common/DynamicSelect";

const alumnoInfoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido_paterno: z.string().min(1, "El apellido paterno es requerido"),
  apellido_materno: z.string().optional(),
  matricula: z.string().min(1, "La matrícula es requerida"),
  semestre: z.number().min(1).max(12),
  carrera_id: z.number().min(1, "La carrera es requerida"),
  genero: z.enum(["masculino", "femenino", "otro"]).optional(),
  modalidad: z.enum(["presencial", "virtual", "híbrida"]).optional(),
  estatus_alumno: z
    .enum(["activo", "baja_temporal", "baja_definitiva", "egresado"])
    .optional(),
});

type AlumnoInfoFormData = z.infer<typeof alumnoInfoSchema>;

interface AlumnoInfoFormProps {
  alumno: any;
}

export function AlumnoInfoForm({ alumno }: AlumnoInfoFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<AlumnoInfoFormData>({
    resolver: zodResolver(alumnoInfoSchema),
    defaultValues: {
      nombre: alumno.nombre || "",
      apellido_paterno: alumno.apellido_paterno || "",
      apellido_materno: alumno.apellido_materno || "",
      matricula: alumno.matricula || "",
      semestre: alumno.semestre || 1,
      carrera_id: alumno.carrera_id || 0,
      genero: alumno.genero || undefined,
      modalidad: alumno.modalidad || undefined,
      estatus_alumno: alumno.estatus_alumno || "activo",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AlumnoInfoFormData) =>
      apiService.update("alumnos", alumno.id, data),
    onSuccess: () => {
      toast.success("Información actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["alumno", String(alumno.id)] });
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al actualizar la información");
    },
  });

  const onSubmit = (data: AlumnoInfoFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre(s)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido_paterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Paterno</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido_materno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Materno</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matricula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semestre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semestre</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carrera_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrera</FormLabel>
                    <FormControl>
                      <DynamicSelect
                        resource="carreras"
                        optionLabelKey="nombre"
                        optionValueKey="id"
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        placeholder="Selecciona una carrera"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modalidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidad</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona modalidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="híbrida">Híbrida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estatus_alumno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estatus del Alumno</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona estatus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="baja_temporal">
                          Baja Temporal
                        </SelectItem>
                        <SelectItem value="baja_definitiva">
                          Baja Definitiva
                        </SelectItem>
                        <SelectItem value="egresado">Egresado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
