'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { apiService } from '@/services/apiService';
import { FormFieldConfig } from '@/types/form';
import { ControllerRenderProps } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface DynamicFormSelectProps {
  config: FormFieldConfig;
  field: ControllerRenderProps<any, string>;
}

export function DynamicFormSelect({ config, field }: DynamicFormSelectProps) {
  const {
    label,
    resource,
    optionLabelKey = 'nombre',
    optionValueKey = 'id',
  } = config;

  if (!resource) {
    return <Input type="text" value="Error: 'resource' no está definido en la config." disabled />;
  }

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  // Query to fetch options based on search term
  const { data: optionsData, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['filter-options', resource, debouncedSearchTerm],
    queryFn: () =>
      apiService.getList(resource, {
        per_page: 20,
        filter: { [optionLabelKey]: debouncedSearchTerm || undefined },
      }),
    enabled: open, // Only fetch when popover is open
  });

  const options = optionsData?.data || [];

  // Query to fetch the label of the current value (Edit mode)
  // This runs only when the popover is closed to avoid redundant calls
  const { data: selectedItemData, isLoading: isLoadingSelected } = useQuery({
    queryKey: ['resource-item', resource, field.value],
    queryFn: () => apiService.getOne(resource, field.value),
    enabled: !!field.value && !open && !options.length,
  });

  // Local state to display the label of the selected item
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  useEffect(() => {
    if (selectedItemData) {
      setSelectedLabel(selectedItemData[optionLabelKey]);
    } else if (!field.value) {
      setSelectedLabel('');
    }
  }, [selectedItemData, field.value, optionLabelKey]);

  // Handler for selecting an option
  const handleSelect = (option: any) => {
    const value = option[optionValueKey];
    field.onChange(value); // Update React Hook Form state
    setSelectedLabel(option[optionLabelKey]); // Update local label
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {isLoadingSelected ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            selectedLabel || config.placeholder || `Selecciona un ${label.toLowerCase()}`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label.toLowerCase()}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoadingOptions && (
              <div className="p-2 flex justify-center items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!isLoadingOptions && options.length === 0 && (
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            )}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option[optionValueKey]}
                  value={option[optionLabelKey]} // 'value' es para la búsqueda de <Command>
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      field.value === option[optionValueKey]
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option[optionLabelKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}