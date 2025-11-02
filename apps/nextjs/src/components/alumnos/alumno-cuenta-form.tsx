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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const cuentaSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .optional()
      .or(z.literal("")),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"],
    }
  );

type CuentaFormData = z.infer<typeof cuentaSchema>;

interface AlumnoCuentaFormProps {
  usuario?: {
    id: number;
    email: string;
  } | null;
}

export function AlumnoCuentaForm({ usuario }: AlumnoCuentaFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CuentaFormData>({
    resolver: zodResolver(cuentaSchema),
    defaultValues: {
      email: usuario?.email || "",
      password: "",
      password_confirmation: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      email: string;
      password?: string;
      password_confirmation?: string;
    }) => {
      if (!usuario) throw new Error("Usuario no encontrado");
      return apiService.updateUsuario(usuario.id, data);
    },
    onSuccess: () => {
      toast.success("Cuenta actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["alumno"] });
      form.reset({
        email: form.getValues("email"),
        password: "",
        password_confirmation: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.data?.message || "Error al actualizar la cuenta");
    },
  });

  const onSubmit = (data: CuentaFormData) => {
    const payload: {
      email: string;
      password?: string;
      password_confirmation?: string;
    } = {
      email: data.email,
    };

    if (data.password && data.password.length > 0) {
      payload.password = data.password;
      payload.password_confirmation = data.password_confirmation;
    }

    updateMutation.mutate(payload);
  };

  if (!usuario) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este alumno no tiene una cuenta de usuario asociada.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cuenta de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este email se utilizará para iniciar sesión
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Cambiar Contraseña</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deja estos campos vacíos si no deseas cambiar la contraseña
              </p>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Mínimo 8 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
