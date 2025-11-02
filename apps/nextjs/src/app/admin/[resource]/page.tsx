'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { GenericDataTable } from '@/components/common/GenericDataTable';
import { GenericPagination } from '@/components/common/GenericPagination';
import { useResource, QueryParams } from '@/hooks/useResource';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PaginationState, ColumnDef } from '@tanstack/react-table';

import { DataTableRowActions } from '@/components/common/DataTableRowActions';
import { FilterBar } from '@/components/common/FilterBar';

import { ResourceForm } from '@/components/common/ResourceForm';
import { z } from 'zod';
import type { FormFieldConfig } from '@/types/form';

// Import the centralized resource configuration
import { resourceConfigMap } from '@/config/resources';

export default function ResourceListPage() {
    const params = useParams();
    const resource = params.resource as string;

    const { columns: baseColumns, type, includes, filters, schema, formConfig } = useMemo(() => {
        return resourceConfigMap[resource] || { columns: [], type: {}, includes: [], filters: [], schema: z.object({}), formConfig: [] };
    }, [resource]);

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    // use `undefined` to represent "no selected item" which plays nicer with TS narrowing
    const [sheetItemId, setSheetItemId] = useState<string | number | undefined>(undefined);

    // Call the generic hook with the resource name from the URL
    const { 
        data: paginatedData,
        isLoadingItems,
        queryParams,
        setQueryParams,
        deleteItem,
        updateItem,
        createItem,
        useItem
    } = useResource<typeof type>(
        resource,
        {
            include: includes,
            per_page: 10,
        }
    );

    // `useItem` expects a non-null id; assert the type here because when no id is
    // selected we intentionally pass `undefined` (the hook should handle it).
    const { data: itemData, isLoading: isLoadingItem } = useItem(sheetItemId as string | number);

    const tableData = paginatedData?.data || [];

    const paginationState: PaginationState = {
        pageIndex: (queryParams.page || 1) - 1,
        pageSize: queryParams.per_page || 10,
    }

    const handleCreate = () => {
        setSheetItemId(undefined);
        setIsSheetOpen(true);
    }

    const handleEdit = (id: string | number) => {
        setSheetItemId(id);
        setIsSheetOpen(true);
    }

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({ ...prev, page: newPage }));
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setQueryParams(prev => ({ ...prev, per_page: newPageSize, page: 1 }));
    };

        const columns = useMemo(() => {
        const actionsColumn: ColumnDef<typeof type> = {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <DataTableRowActions
                    row={row}
                    resource={resource}
                    deleteItem={deleteItem}
                    onEdit={handleEdit}
                />
            ),
        };

        return [...baseColumns, actionsColumn];
    }, [baseColumns, resource, deleteItem]);

    const isEditMode = sheetItemId !== undefined;
    const baseMutation = isEditMode ? updateItem : createItem;

    const onSubmitWithId = {
        ...baseMutation,
        mutate: (data: any, options?: any) => {
            if(isEditMode) {
                // when in edit mode `sheetItemId` is defined, ensure the type is
                // narrowed for the mutation payload
                updateItem.mutate({ id: sheetItemId as string | number, data }, options);
            } else {
                createItem.mutate(data, options);
            }
        },
    } as typeof baseMutation;

    return (
        <div className='container mx-auto py-10 space-y-4'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold capitalize'>{resource}</h1>
                <Button onClick={handleCreate}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New {resource}
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
                        <ResourceForm
              key={sheetItemId !== null ? `edit-${sheetItemId}` : 'create'}
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              isEditMode={isEditMode}
                            schema={schema as z.ZodTypeAny}
                            formConfig={formConfig as FormFieldConfig[]}
              onSubmit={onSubmitWithId}
              isLoadingData={isLoadingItem}
              defaultValues={isEditMode ? itemData : undefined}
            />
        </div>
    )
};