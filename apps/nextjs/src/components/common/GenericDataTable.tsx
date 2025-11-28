'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    PaginationState,
    useReactTable
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import TableSkeleton from './TableSkeleton';

interface GenericDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
}

import { useAccessibility } from "@/context/AccessibilityContext";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useMemo } from "react";

// ... existing imports

export function GenericDataTable<TData, TValue>({
    columns,
    data,
    isLoading,
}: GenericDataTableProps<TData, TValue>) {
    const { screenReader, speak } = useAccessibility();

    const tableColumns = useMemo(() => {
        if (!screenReader) return columns;

        const accessibilityColumn: ColumnDef<TData, TValue> = {
            id: "accessibility-actions",
            header: () => <span className="sr-only">Acciones de lectura</span>,
            cell: ({ row }) => {
                const generateRowSummary = () => {
                    return `Fila ${row.index + 1}. ` + row.getVisibleCells()
                        .filter(cell => cell.column.id !== "accessibility-actions")
                        .map(cell => {
                            const header = cell.column.columnDef.header;
                            const headerText = typeof header === 'string' ? header : '';
                            let cellValue = cell.getValue() as string;
                            if (cellValue === null || cellValue === undefined) cellValue = '';
                            return `${headerText} ${cellValue}`;
                        }).join('. ');
                };

                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                            e.stopPropagation();
                            speak(generateRowSummary());
                        }}
                        onMouseEnter={() => speak(generateRowSummary())}
                        aria-label="Leer fila completa"
                    >
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                );
            },
            enableSorting: false,
            enableHiding: false,
        };

        return [accessibilityColumn, ...columns];
    }, [columns, screenReader, speak]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    const TableContent = () => {
        return (
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )
                                    }
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell 
                                        key={cell.id}
                                        data-screen-reader-text={
                                            cell.column.id !== "accessibility-actions" 
                                            ? `${typeof cell.column.columnDef.header === 'string' ? cell.column.columnDef.header : ''}: ${cell.getValue()}`
                                            : undefined
                                        }
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ): (
                        <TableRow>
                            <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                No se encontraron datos.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        )
    }

    return(
        <div>
            <div className="rounded-md border">
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <TableContent />
                )}
            </div>
        </div>
    )
}