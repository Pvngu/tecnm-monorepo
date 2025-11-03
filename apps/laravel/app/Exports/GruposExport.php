<?php

namespace App\Exports;

use App\Models\Grupo;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class GruposExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        return QueryBuilder::for(Grupo::class)
            ->allowedFilters([
                'horario',
                'aula',
                AllowedFilter::exact('materia_id'),
                AllowedFilter::exact('profesor_id'),
                AllowedFilter::exact('periodo_id'),
                AllowedFilter::exact('carrera_id'),
            ])
            ->allowedSorts(['aula', 'created_at'])
            ->allowedIncludes(['materia', 'profesor', 'periodo', 'carrera', 'inscripciones'])
            ->with(['materia', 'profesor', 'periodo', 'carrera'])
            ->withCount('inscripciones');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Periodo',
            'Materia',
            'Profesor',
            'Carrera',
            'Horario',
            'Aula',
            'Total Inscripciones',
            'Fecha de Creación',
        ];
    }

    public function map($grupo): array
    {
        return [
            $grupo->id,
            $grupo->periodo->nombre ?? 'N/A',
            $grupo->materia->nombre ?? 'N/A',
            $grupo->profesor 
                ? "{$grupo->profesor->nombre} {$grupo->profesor->apellido_paterno}" 
                : 'N/A',
            $grupo->carrera->nombre ?? 'N/A',
            $grupo->horario,
            $grupo->aula,
            $grupo->inscripciones_count ?? 0,
            $grupo->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
