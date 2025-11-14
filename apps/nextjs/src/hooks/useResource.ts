import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { PaginatedResponse } from '@/types/api';
import { toast } from 'sonner';
import { useState } from 'react';

export interface QueryParams {
    page?: number;
    per_page?: number;
    include?: string[];
    sort?: string;
    filter?: Record<string, any>;
}

const defaultParams: QueryParams = {
    page: 1,
    per_page: 10,
    include: [],
    sort: '',
    filter: {},
};

export const useResource = <TData>(
    resource: string,
    initialParams: QueryParams = {}
) => {
    const queryClient = useQueryClient();

    const [queryParams, setQueryParams] = useState<QueryParams>({
        ...defaultParams,
        ...initialParams,
    })

    const queryKey = [resource, queryParams];

    // Read: Get all items
    const { data, isLoading: isLoadingItems } = useQuery<PaginatedResponse<TData>>({
        queryKey,
        queryFn: () => apiService.getList<TData>(resource, queryParams),
        // keepPreviousData: true,
    });

    // Read: Get single item by ID
    const useItem = (id: string | number | undefined) => {
        return useQuery<TData>({
            queryKey: [...queryKey, id],
            queryFn: () => apiService.getOne<TData>(resource, id!),
            enabled: !!id, // only run if id is provided
        });
    };

    // Create: Add a new item
    const createItem = useMutation({
        mutationFn: (newItem: TData) => apiService.create(resource, newItem),
        onSuccess: () => {
            toast.success(`${resource} creado correctamente`);
            queryClient.invalidateQueries({ queryKey: [resource] });
        },
        onError: (error: any) => {
            // apiService throws an HttpError with a `data` property containing
            // Laravel validation errors in `data.errors` when status === 422.
            const validationErrors = error?.data?.errors;
            if (validationErrors) {
                // If there's a specific matricula error, show that first
                if (validationErrors.matricula && validationErrors.matricula.length) {
                    const msgs = validationErrors.matricula.map((m: string) => {
                        // Translate common English Laravel validation messages to Spanish
                        if (m.includes('has already been taken')) {
                            return 'La matrícula ya está en uso.';
                        }
                        if (m.includes('The matricula field is required') || m.includes('The matricula field is required.')) {
                            return 'La matrícula es obligatoria.';
                        }
                        return m; // fallback to original
                    });

                    toast.error(msgs.join(' '));
                    return;
                }

                // Otherwise show the first validation message available
                const firstField = Object.keys(validationErrors)[0];
                if (firstField) {
                    const msgs = validationErrors[firstField];
                    if (Array.isArray(msgs) && msgs.length) {
                        toast.error(msgs.join(' '));
                        return;
                    }
                }
            }

            // Fallback to generic message
            toast.error(`Failed to create ${resource}: ${error?.message ?? 'Unknown error'}`);
        },
    });

    const updateItem = useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: TData }) =>
            apiService.update(resource, id, data),
        onSuccess: () => {
            toast.success(`${resource} actualizado correctamente`);
            queryClient.invalidateQueries({ queryKey });
            // queryClient.invalidateQueries({ queryKey: [...queryKey, id] }); // invalidate single item query
        },
        onError: (error: any) => {
            const validationErrors = error?.data?.errors;
            if (validationErrors) {
                if (validationErrors.matricula && validationErrors.matricula.length) {
                    const msgs = validationErrors.matricula.map((m: string) => {
                        if (m.includes('has already been taken')) {
                            return 'La matrícula ya está en uso.';
                        }
                        if (m.includes('The matricula field is required') || m.includes('The matricula field is required.')) {
                            return 'La matrícula es obligatoria.';
                        }
                        return m;
                    });

                    toast.error(msgs.join(' '));
                    return;
                }

                const firstField = Object.keys(validationErrors)[0];
                if (firstField) {
                    const msgs = validationErrors[firstField];
                    if (Array.isArray(msgs) && msgs.length) {
                        toast.error(msgs.join(' '));
                        return;
                    }
                }
            }

            toast.error(`Failed to update ${resource}: ${error?.message ?? 'Unknown error'}`);
        },
    });

    const deleteItem = useMutation({
        mutationFn: (id: string | number) => apiService.delete(resource, id),
        onSuccess: () => {
            toast.success(`${resource} deleted successfully`);
            queryClient.invalidateQueries({ queryKey: [resource] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete ${resource}: ${error.message}`);
        },
    });

    return {
        data,
        isLoadingItems,
        queryParams,
        setQueryParams,
        useItem,
        createItem,
        updateItem,
        deleteItem,
    };
}