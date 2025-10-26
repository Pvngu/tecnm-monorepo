'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { GenericDataTable } from '@/components/common/GenericDataTable';
import { GenericPagination } from '@/components/common/GenericPagination';
import { useResource, QueryParams } from '@/hooks/useResource';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { PaginationState, ColumnDef } from '@tanstack/react-table';

import { DataTableRowActions } from '@/components/common/DataTableRowActions';

import { FilterBar } from '@/components/common/FilterBar';
import { FilterConfig } from '@/types/filters';

import { AlumnoColumns, Alumno, AlumnoFilters } from '@/config/resources/alumnos.config';
import { CarreraColumns, Carrera, CarreraFilters } from '@/config/resources/carreras.config';
import { PeriodoColumns, Periodo, PeriodoFilters } from '@/config/resources/periodos.config';
import { MateriaColumns, Materia, MateriaFilters } from '@/config/resources/materias.config';
import { ProfesorColumns, Profesor, ProfesorFilters } from '@/config/resources/profesores.config';
import { GrupoColumns, Grupo, GrupoIncludes, GrupoFilters } from '@/config/resources/grupos.config';

const resourceConfigMap: { 
    [key: string]: { 
        columns: any;
        type: any;
        includes?: any;
        filters?: FilterConfig[]
    }
} = {
    alumnos: { columns: AlumnoColumns, type: {} as Alumno, filters: AlumnoFilters },
    carreras: { columns: CarreraColumns, type: {} as Carrera, filters: CarreraFilters },
    periodos: { columns: PeriodoColumns, type: {} as Periodo, filters: PeriodoFilters },
    materias: { columns: MateriaColumns, type: {} as Materia, filters: MateriaFilters },
    profesores: { columns: ProfesorColumns, type: {} as Profesor, filters: ProfesorFilters },
    grupos: { columns: GrupoColumns, type: {} as Grupo, includes: GrupoIncludes, filters: GrupoFilters },
};

export default function ResourceListPage() {
    const params = useParams();
    const resource = params.resource as string;

    const { columns: baseColumns, type, includes, filters } = useMemo(() => {
        return resourceConfigMap[resource] || { columns: [], type: {}, includes: [], filters: [] };
    }, [resource]);

    // Call the generic hook with the resource name from the URL
    const { 
        data: paginatedData,
        isLoadingItems,
        queryParams,
        setQueryParams,
        deleteItem
    } = useResource<typeof type>(
        resource,
        {
            include: includes,
            per_page: 10,
        }
    );

    const tableData = paginatedData?.data || [];
    const pageCount = paginatedData?.last_page || -1;

    const paginationState: PaginationState = {
        pageIndex: (queryParams.page || 1) - 1,
        pageSize: queryParams.per_page || 10,
    }

    const columns = useMemo(() => {
        const actionsColumn: ColumnDef<typeof type> = {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <DataTableRowActions
                    row={row}
                    resource={resource}
                    deleteItem={deleteItem}
                />
            ),
        };

        return [...baseColumns, actionsColumn];
    }, [baseColumns, resource, deleteItem]);

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({ ...prev, page: newPage }));
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setQueryParams(prev => ({ ...prev, per_page: newPageSize, page: 1 }));
    };

    return (
        <div className='container mx-auto py-10 space-y-4'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold capitalize'>{resource}</h1>
                <Button asChild>
                    <Link href={`/${resource}/new`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New {resource}
                    </Link>
                </Button>
            </div>
            <FilterBar 
                config={filters || []}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
            />
            <GenericDataTable 
                columns={columns}
                data={tableData}
                isLoading={isLoadingItems}
                pageCount={pageCount}
                pagination={paginationState}
                setPagination={() => {}}
            />
            <div className="mt-4 w-fit ml-auto">
                {paginatedData && paginatedData.last_page > 1 && (
                <GenericPagination
                    currentPage={paginatedData.current_page}
                    lastPage={paginatedData.last_page}
                    onPageChange={handlePageChange}
                    pageSize={paginationState.pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />
                )}
            </div>
        </div>
    )
};