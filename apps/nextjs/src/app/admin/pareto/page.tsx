"use client";

import { ParetoFactoresGrupo } from "@/components/charts/pareto-factores-grupo";

export default function ParetoPage() {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Análisis de Pareto</h1>
        <p className="text-muted-foreground mt-2">
          Identifica los factores de riesgo más impactantes por grupo utilizando la regla 80/20
        </p>
      </div>

      {/* Pareto Widget */}
      <ParetoFactoresGrupo />
    </div>
  );
}
