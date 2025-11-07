"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IshikawaData } from "@/services/apiService";
import { Download, Save } from "lucide-react";

interface IshikawaDiagramSVGProps {
  data: IshikawaData;
  observaciones: Record<string, string>;
  onObservacionChange: (categoria: string, value: string) => void;
  onSave: () => void;
  onExportPDF: () => void;
  isSaving?: boolean;
  isExporting?: boolean;
}

export function IshikawaDiagramSVG({ 
  data, 
  observaciones, 
  onObservacionChange,
  onSave,
  onExportPDF,
  isSaving = false,
  isExporting = false
}: IshikawaDiagramSVGProps) {
  const svgWidth = 1200;
  const svgHeight = 800;
  const centerY = svgHeight / 2;
  const spineLength = svgWidth - 200;
  
  // Dividir causas en superiores e inferiores
  const causasTop = data.causas_principales.filter((_, i) => i % 2 === 0);
  const causasBottom = data.causas_principales.filter((_, i) => i % 2 === 1);

  return (
    <Card id="ishikawa-diagram" className="print:shadow-none">
      <CardHeader className="print:pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Análisis Causa-Raíz (Diagrama de Ishikawa)</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Este diagrama muestra los factores de riesgo agrupados por categoría
              que contribuyen al problema identificado
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
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
      <CardContent className="print:p-4">
        <div className="relative bg-white p-8 rounded-lg border">
          {/* SVG para las líneas del diagrama */}
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            className="absolute top-0 left-0 pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {/* Línea principal (espina dorsal) */}
            <line
              x1={0}
              y1={centerY}
              x2={spineLength}
              y2={centerY}
              stroke="currentColor"
              strokeWidth="3"
              className="text-foreground"
            />

            {/* Líneas para causas superiores */}
            {causasTop.map((_, index) => {
              const x = (index + 1) * (spineLength / (causasTop.length + 1));
              const boneLength = 100;
              return (
                <line
                  key={`top-${index}`}
                  x1={x}
                  y1={centerY}
                  x2={x + boneLength * 0.7}
                  y2={centerY - boneLength}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-foreground"
                />
              );
            })}

            {/* Líneas para causas inferiores */}
            {causasBottom.map((_, index) => {
              const x = (index + 1) * (spineLength / (causasBottom.length + 1));
              const boneLength = 100;
              return (
                <line
                  key={`bottom-${index}`}
                  x1={x}
                  y1={centerY}
                  x2={x + boneLength * 0.7}
                  y2={centerY + boneLength}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-foreground"
                />
              );
            })}

            {/* Flecha en la cabeza */}
            <polygon
              points={`${spineLength},${centerY} ${spineLength - 15},${centerY - 8} ${spineLength - 15},${centerY + 8}`}
              fill="currentColor"
              className="text-foreground"
            />
          </svg>

          {/* Contenido del diagrama */}
          <div className="relative" style={{ height: svgHeight }}>
            {/* Causas superiores */}
            <div className="absolute top-0 left-0 right-0 flex justify-around px-8">
              {causasTop.map((causa, index) => (
                <div 
                  key={causa.categoria}
                  className="w-64 bg-white border rounded-lg p-4 shadow-sm"
                  style={{ 
                    position: 'relative',
                    top: `${30 + index * 10}px`,
                    zIndex: 10
                  }}
                >
                  <h4 className="font-bold text-sm text-primary uppercase text-center mb-2">
                    {causa.categoria}
                  </h4>
                  <ul className="text-xs space-y-1">
                    {causa.causas_secundarias.map((sec) => (
                      <li key={sec.nombre} className="border-b border-border/30 py-1">
                        {sec.nombre}{" "}
                        <span className="text-muted-foreground">
                          ({sec.frecuencia})
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Textarea
                    placeholder={`Observaciones sobre ${causa.categoria}...`}
                    className="mt-2 h-16 text-xs"
                    value={observaciones[causa.categoria] || ""}
                    onChange={(e) => onObservacionChange(causa.categoria, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Causas inferiores */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around px-8">
              {causasBottom.map((causa, index) => (
                <div 
                  key={causa.categoria}
                  className="w-64 bg-white border rounded-lg p-4 shadow-sm"
                  style={{ 
                    position: 'relative',
                    bottom: `${30 + index * 10}px`,
                    zIndex: 10
                  }}
                >
                  <h4 className="font-bold text-sm text-primary uppercase text-center mb-2">
                    {causa.categoria}
                  </h4>
                  <ul className="text-xs space-y-1">
                    {causa.causas_secundarias.map((sec) => (
                      <li key={sec.nombre} className="border-b border-border/30 py-1">
                        {sec.nombre}{" "}
                        <span className="text-muted-foreground">
                          ({sec.frecuencia})
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Textarea
                    placeholder={`Observaciones sobre ${causa.categoria}...`}
                    className="mt-2 h-16 text-xs"
                    value={observaciones[causa.categoria] || ""}
                    onChange={(e) => onObservacionChange(causa.categoria, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Cabeza del pescado (Efecto) */}
            <div 
              className="absolute bg-white border-4 border-foreground rounded-lg p-4 shadow-lg"
              style={{
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 180,
                zIndex: 20
              }}
            >
              <div className="text-sm font-bold text-center leading-tight">
                {data.efecto}
              </div>
              <div className="text-sm mt-2 text-center text-muted-foreground">
                ({data.tasa_reprobacion}%)
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-muted/20 rounded-lg print:break-before-page">
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
