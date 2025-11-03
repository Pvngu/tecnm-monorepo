<?php

namespace App\Exports;

use App\Models\Profesor;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ProfesoresExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        return QueryBuilder::for(Profesor::class)
            ->allowedFilters([
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'rfc',
                AllowedFilter::exact('usuario_id'),
            ])
            ->allowedSorts(['nombre', 'apellido_paterno', 'rfc', 'created_at'])
            ->allowedIncludes(['usuario', 'grupos'])
            ->with(['usuario']);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Apellido Paterno',
            'Apellido Materno',
            'RFC',
            'Email',
            'Fecha de Registro',
        ];
    }

    public function map($profesor): array
    {
        return [
            $profesor->id,
            $profesor->nombre,
            $profesor->apellido_paterno,
            $profesor->apellido_materno,
            $profesor->rfc,
            $profesor->usuario->email ?? 'N/A',
            $profesor->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
