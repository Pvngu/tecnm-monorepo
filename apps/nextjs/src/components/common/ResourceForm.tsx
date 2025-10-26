'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type FormFieldConfig = {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password';
    placeholder?: string;
}

interface ResourceFormProps<T extends z.ZodType<any, any>> {
    schema: T;
    formConfig: FormFieldConfig[];
    onSubmit: (data: z.infer<T>) => void;
    defaultValues?: Partial<z.infer<T>>;
    isLoading?: boolean;
    submitButtonText?: string;
}

export function ResourceForm<T extends z.ZodType<any, any>>({
    schema,
    formConfig,
    onSubmit,
    defaultValues,
    isLoading,
    submitButtonText = 'Submit',
}: ResourceFormProps<T>) {
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues || {},
    });

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
        <Card>
            <CardHeader>
                <CardTitle>{submitButtonText.includes('Create') ? 'Create New' : 'Edit Item'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                        {formConfig.map((config) => (
                            <FormField
                                key={config.name}
                                control={form.control as any}
                                name={config.name as any}
                                render={({field}) => {
                                    <FormItem>
                                        <FormLabel>{config.label}</FormLabel>
                                        <FormControl>
                                            {renderField(field, config)}
                                        </FormControl>
                                    </FormItem>
                                }}
                            />
                        ))}
                        <Button type='submit' disabled={isLoading}>
                            {isLoading ? 'Guardando...' : submitButtonText}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}