"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlumnoHeader } from "@/components/alumnos/alumno-header";
import { AlumnoInfoForm } from "@/components/alumnos/alumno-info-form";
import { AlumnoInscripcionesManager } from "@/components/alumnos/alumno-inscripciones-manager";
import { AlumnoFactoresManager } from "@/components/alumnos/alumno-factores-manager";
import { AlumnoAsistenciasView } from "@/components/alumnos/alumno-asistencias-view";
import { AlumnoCuentaForm } from "@/components/alumnos/alumno-cuenta-form";

export default function AlumnoExpedientePage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ["alumno", id],
    queryFn: () => apiService.getAlumnoDetallado(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error al cargar el expediente del alumno
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AlumnoHeader alumno={data} />

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="inscripciones">
            Inscripciones y Calificaciones
          </TabsTrigger>
          <TabsTrigger value="factores">Factores de Riesgo</TabsTrigger>
          <TabsTrigger value="asistencias">Asistencias</TabsTrigger>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion">
          <AlumnoInfoForm alumno={data} />
        </TabsContent>

        <TabsContent value="inscripciones">
          <AlumnoInscripcionesManager
            inscripciones={data.inscripciones || []}
            alumnoId={data.id}
          />
        </TabsContent>

        <TabsContent value="factores">
          <AlumnoFactoresManager inscripciones={data.inscripciones || []} />
        </TabsContent>

        <TabsContent value="asistencias">
          <AlumnoAsistenciasView inscripciones={data.inscripciones || []} />
        </TabsContent>

        <TabsContent value="cuenta">
          <AlumnoCuentaForm usuario={data.usuario} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
