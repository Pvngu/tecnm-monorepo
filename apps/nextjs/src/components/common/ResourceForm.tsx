'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormFieldConfig } from '@/types/form';
import { UseMutationResult } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface ResourceFormProps<T extends z.ZodType<any, any>> {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    schema: z.ZodObject;
    formConfig: FormFieldConfig[];
    onSubmit: UseMutationResult<any, any, any, any>;
    defaultValues?: any;
    isLoadingData: boolean;
    isEditMode: boolean;
}

export function ResourceForm<T extends z.ZodType<any, any>>({
    isOpen,
    onOpenChange,
    schema,
    formConfig,
    onSubmit,
    defaultValues,
    isLoadingData,
    isEditMode,
}: ResourceFormProps<T>) {
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues || {},
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && defaultValues) {
                form.reset(defaultValues);
            } else {
                // Reset to empty values for create mode
                form.reset({} as any);
            }
        }
    }, [isOpen, isEditMode, defaultValues]);

    const handleFormSubmit = (data: any) => {
        console.log('Submitting form data:', data);
        onSubmit.mutate(data, {
            onSuccess: () => {
                console.log('Form submitted successfully');
                onOpenChange(false);
                form.reset();
            }
        });
    }

    const renderField = (field: any, config: FormFieldConfig) => {
        switch(config.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'password':
            default:
                return (
                    <Input 
                        type={config.type}
                        placeholder={config.placeholder} 
                        {...field}
                    />
                );
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <SheetHeader>
                        <SheetTitle>
                            {isEditMode ? 'Editar Registro' : 'Crear Nuevo Registro'}
                        </SheetTitle>
                        <SheetDescription>
                            Completa los campos y guarda los cambios.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 px-4 space-y-4">
                    {isLoadingData ? (
                        formConfig.map((config) => (
                            <div key={config.name} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))
                    ) : (
                        formConfig.map((config) => (
                        <FormField
                            key={config.name}
                            control={form.control}
                            name={config.name}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{config.label}</FormLabel>
                                <FormControl>
                                {renderField(field, config)}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        ))
                    )}
                    </div>
                    <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="outline">
                        Cancelar
                        </Button>
                    </SheetClose>
                    <Button type="submit" disabled={onSubmit.isPending || isLoadingData}>
                        {onSubmit.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Guardar Cambios
                    </Button>
                    </SheetFooter>
                </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}