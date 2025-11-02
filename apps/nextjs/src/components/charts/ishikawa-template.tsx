"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IshikawaData } from "@/services/apiService";
import { Download, Save } from "lucide-react";

interface IshikawaTemplateProps {
  data: IshikawaData;
  observaciones: Record<string, string>;
  onObservacionChange: (categoria: string, value: string) => void;
  onSave: () => void;
  onExportPDF: () => void;
  isSaving?: boolean;
  isExporting?: boolean;
}

export function IshikawaTemplate({ 
  data, 
  observaciones, 
  onObservacionChange,
  onSave,
  onExportPDF,
  isSaving = false,
  isExporting = false
}: IshikawaTemplateProps) {
  return (
    <Card id="ishikawa-diagram">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Análisis Causa-Raíz (Diagrama de Ishikawa)</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Este diagrama muestra los factores de riesgo agrupados por categoría
              que contribuyen al problema identificado
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onSave} 
              disabled={isSaving}
              variant="outline"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
            <Button 
              onClick={onExportPDF}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Generando..." : "Exportar PDF"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ishikawa-container">
          {/* Línea principal (espina dorsal) */}
          <div className="ishikawa-spine"></div>

          {/* Cabeza del pescado (Efecto) */}
          <div className="ishikawa-head">
            <div className="text-xs font-bold leading-tight">
              {data.efecto}
            </div>
            <div className="text-xs mt-1 text-muted-foreground">
              ({data.tasa_reprobacion}%)
            </div>
          </div>

          {/* Causas principales (espinas) */}
          <div className="ishikawa-bones">
            {data.causas_principales.map((causa, index) => (
              <div
                key={causa.categoria}
                className={`ishikawa-bone ${
                  index % 2 === 0 ? "bone-top" : "bone-bottom"
                }`}
              >
                <div className="bone-title">{causa.categoria}</div>
                <ul className="sub-bones">
                  {causa.causas_secundarias.map((sec) => (
                    <li key={sec.nombre} className="sub-bone">
                      {sec.nombre}{" "}
                      <span className="text-muted-foreground">
                        ({sec.frecuencia})
                      </span>
                    </li>
                  ))}
                </ul>
                <Textarea
                  placeholder={`Observaciones sobre ${causa.categoria}...`}
                  className="mt-3 h-20 text-xs"
                  value={observaciones[causa.categoria] || ""}
                  onChange={(e) => onObservacionChange(causa.categoria, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-muted/20 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">
            Cómo usar este diagrama:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              Cada categoría representa una "espina" principal del diagrama
            </li>
            <li>
              Los números entre paréntesis indican la frecuencia del factor
            </li>
            <li>
              Usa los campos de texto para añadir observaciones cualitativas
            </li>
            <li>
              Identifica las categorías con mayor frecuencia para priorizar
              acciones
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
