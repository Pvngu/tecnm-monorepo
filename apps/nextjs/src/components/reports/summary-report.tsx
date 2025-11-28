"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, TrendingDown, TrendingUp, Users, FileText } from "lucide-react";

interface Recomendacion {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: "institucional" | "docente" | "alumno";
}

interface FactorRiesgo {
  id: number;
  nombre: string;
  categoria: string;
  frecuencia: number;
  recomendaciones: Recomendacion[];
}

interface Metricas {
  promedio_general: number;
  tasa_reprobacion: number;
  total_alumnos: number;
  total_inscripciones: number;
  total_reprobados: number;
}

interface ReportData {
  metricas: Metricas;
  top_factores: FactorRiesgo[];
}

interface Periodo {
  id: number;
  nombre: string;
}

interface Carrera {
  id: number;
  nombre: string;
}

interface SummaryReportProps {
  data: ReportData;
  periodo?: Periodo;
  carrera?: Carrera;
}

const getNivelColor = (nivel: string) => {
  switch (nivel) {
    case "institucional":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "docente":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "alumno":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export function SummaryReport({ data, periodo, carrera }: SummaryReportProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="mt-6 print:shadow-none print:border-none">
      <CardHeader className="flex flex-row justify-between items-start">
        <div className="flex-1">
          <CardTitle className="text-2xl mb-2">
            Reporte de Rendimiento y Riesgo Académico
          </CardTitle>
          <CardDescription className="text-base">
            <span className="font-semibold">{periodo?.nombre || "Periodo no especificado"}</span>
            {carrera && (
              <>
                {" | "}
                <span className="font-semibold">{carrera.nombre}</span>
              </>
            )}
            {!carrera && " | Todas las carreras"}
          </CardDescription>
          <p className="text-xs text-muted-foreground mt-2">
            Generado el {new Date().toLocaleDateString("es-MX", { 
              year: "numeric", 
              month: "long", 
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrint}
          className="print:hidden ml-4"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sección 1: Métricas Clave */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Indicadores Clave de Rendimiento
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card 
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200"
              data-screen-reader-text={`Promedio general ${data.metricas.promedio_general}`}
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Promedio General
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <CardTitle className="text-3xl text-blue-900 dark:text-blue-100">
                      {data.metricas.promedio_general}
                    </CardTitle>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200"
              data-screen-reader-text={`Tasa de reprobación ${data.metricas.tasa_reprobacion}%`}
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-red-700 dark:text-red-300">
                  Tasa de Reprobación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400 mr-2" />
                  <div>
                    <CardTitle className="text-3xl text-red-900 dark:text-red-100">
                      {data.metricas.tasa_reprobacion}%
                    </CardTitle>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200"
              data-screen-reader-text={`Total alumnos ${data.metricas.total_alumnos}`}
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-green-700 dark:text-green-300">
                  Total Alumnos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400 mr-2" />
                  <div>
                    <CardTitle className="text-3xl text-green-900 dark:text-green-100">
                      {data.metricas.total_alumnos}
                    </CardTitle>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200"
              data-screen-reader-text={`Total reprobados ${data.metricas.total_reprobados}`}
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-orange-700 dark:text-orange-300">
                  Total Reprobados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingDown className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-2" />
                  <div>
                    <CardTitle className="text-3xl text-orange-900 dark:text-orange-100">
                      {data.metricas.total_reprobados}
                    </CardTitle>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Sección 2: Factores y Recomendaciones */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Factores de Riesgo Principales y Recomendaciones de Mejora
          </h3>
          
          {data.top_factores.length === 0 ? (
            <Alert>
              <AlertDescription>
                No se encontraron factores de riesgo registrados para este periodo y carrera.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {data.top_factores.map((factor, index) => (
                <Card
                  key={factor.id}
                  className="bg-muted/30 border-l-4 border-l-primary"
                  data-screen-reader-text={`Factor de riesgo ${factor.nombre} con ${factor.frecuencia} casos. Categoría ${factor.categoria}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-primary font-bold">
                            {index + 1}.
                          </span>
                          {factor.nombre}
                          <Badge variant="secondary" className="ml-2">
                            {factor.frecuencia} casos
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Categoría: <span className="font-medium">{factor.categoria}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Recomendaciones:
                    </h4>
                    {factor.recomendaciones.length > 0 ? (
                      <div className="space-y-3">
                        {factor.recomendaciones.map((rec) => (
                          <Alert 
                            key={rec.id} 
                            className="bg-background"
                            data-screen-reader-text={`Recomendación ${rec.nivel}: ${rec.titulo}. ${rec.descripcion}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <AlertTitle className="flex items-center gap-2 mb-2">
                                  {rec.titulo}
                                  <Badge
                                    className={getNivelColor(rec.nivel)}
                                    variant="secondary"
                                  >
                                    {rec.nivel === "institucional" && "Institucional"}
                                    {rec.nivel === "docente" && "Docente"}
                                    {rec.nivel === "alumno" && "Alumno"}
                                  </Badge>
                                </AlertTitle>
                                <AlertDescription className="text-sm">
                                  {rec.descripcion}
                                </AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertDescription>
                          No hay recomendaciones registradas para este factor de riesgo.
                          Por favor, contacte al administrador del sistema.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer del reporte */}
        <Separator className="my-6" />
        <div className="text-xs text-muted-foreground text-center print:text-left">
          <p>
            Este reporte fue generado automáticamente por el Sistema de Gestión Escolar TecNM
          </p>
          <p className="mt-1">
            Las recomendaciones están basadas en mejores prácticas educativas y deben adaptarse al contexto específico
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
