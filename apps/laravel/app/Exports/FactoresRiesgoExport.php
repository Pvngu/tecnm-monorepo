<?php

namespace App\Exports;

use App\Models\FactorRiesgo;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Spatie\QueryBuilder\QueryBuilder;

class FactoresRiesgoExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        return QueryBuilder::for(FactorRiesgo::class)
            ->allowedFilters(['nombre', 'categoria'])
            ->allowedSorts(['nombre', 'categoria', 'created_at'])
            ->allowedIncludes(['alumnosFactores'])
            ->withCount('alumnosFactores');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Categoría',
            'Total Alumnos Afectados',
            'Fecha de Registro',
        ];
    }

    public function map($factor): array
    {
        return [
            $factor->id,
            $factor->nombre,
            $factor->categoria,
            $factor->alumnos_factores_count ?? 0,
            $factor->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
