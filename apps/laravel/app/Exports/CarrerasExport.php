<?php

namespace App\Exports;

use App\Models\Carrera;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Spatie\QueryBuilder\QueryBuilder;

class CarrerasExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        return QueryBuilder::for(Carrera::class)
            ->allowedFilters(['nombre', 'clave'])
            ->allowedSorts(['nombre', 'clave', 'created_at'])
            ->allowedIncludes(['alumnos', 'grupos']);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Clave',
            'Fecha de Registro',
        ];
    }

    public function map($carrera): array
    {
        return [
            $carrera->id,
            $carrera->nombre,
            $carrera->clave,
            $carrera->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
