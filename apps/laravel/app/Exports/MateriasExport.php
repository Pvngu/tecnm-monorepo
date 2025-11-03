<?php

namespace App\Exports;

use App\Models\Materia;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Spatie\QueryBuilder\QueryBuilder;

class MateriasExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        return QueryBuilder::for(Materia::class)
            ->allowedFilters(['nombre', 'codigo_materia', 'creditos'])
            ->allowedSorts(['nombre', 'codigo_materia', 'creditos', 'created_at'])
            ->allowedIncludes(['unidades', 'grupos'])
            ->withCount(['unidades', 'grupos']);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Código',
            'Nombre',
            'Créditos',
            'Total Unidades',
            'Total Grupos',
            'Fecha de Registro',
        ];
    }

    public function map($materia): array
    {
        return [
            $materia->id,
            $materia->codigo_materia,
            $materia->nombre,
            $materia->creditos,
            $materia->unidades_count ?? 0,
            $materia->grupos_count ?? 0,
            $materia->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
