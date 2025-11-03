<?php

namespace App\Exports;

use App\Models\Periodo;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Spatie\QueryBuilder\QueryBuilder;

class PeriodosExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        return QueryBuilder::for(Periodo::class)
            ->allowedFilters(['nombre', 'activo', 'fecha_inicio', 'fecha_fin'])
            ->allowedSorts(['nombre', 'fecha_inicio', 'fecha_fin', 'activo', 'created_at'])
            ->allowedIncludes(['grupos'])
            ->withCount('grupos');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Fecha Inicio',
            'Fecha Fin',
            'Activo',
            'Total Grupos',
            'Fecha de Registro',
        ];
    }

    public function map($periodo): array
    {
        return [
            $periodo->id,
            $periodo->nombre,
            $periodo->fecha_inicio,
            $periodo->fecha_fin,
            $periodo->activo ? 'Sí' : 'No',
            $periodo->grupos_count ?? 0,
            $periodo->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
