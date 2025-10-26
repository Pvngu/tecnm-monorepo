// src/components/common/DynamicFilterSelect.tsx

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { apiService } from '@/services/apiService';
import { FilterConfig } from '@/types/filters';
import { QueryParams } from '@/hooks/useResource';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CirclePlus, CircleMinus, Loader2 } from 'lucide-react';

interface DynamicFilterSelectProps {
  config: FilterConfig;
  queryParams: QueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
}

export function DynamicFilterSelect({ config, queryParams, setQueryParams }: DynamicFilterSelectProps) {
  const { 
    id: filterId, 
    label, 
    resource,
    options: staticOptions,
    optionLabelKey = 'label',
    optionValueKey = 'value'
  } = config;
  
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  // Determine if this is a dynamic filter (fetches from API) or static (uses options prop)
  const isDynamic = !!resource;

  // Obtenemos los IDs seleccionados actualmente desde el queryParams principal
  const selectedValues = new Set<string | number>(queryParams.filter?.[filterId] || []);

  // Este useQuery busca en la API (solo para filtros dinámicos)
  const { data: optionsData, isLoading } = useQuery({
    queryKey: ['filter-options', resource, debouncedSearchTerm],
    queryFn: () => apiService.getList(resource!, {
      per_page: 20,
      filter: { [optionLabelKey]: debouncedSearchTerm || undefined }
    }),
    enabled: isDynamic && open,
  });

  // Si es dinámico, usa los datos de la API; si no, usa las opciones estáticas
  const options = isDynamic ? (optionsData?.data || []) : (staticOptions || []);

  // Filtrado local para opciones estáticas
  const filteredOptions = isDynamic 
    ? options 
    : options.filter((opt: any) => 
        opt[optionLabelKey].toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Handler para seleccionar/deseleccionar un item
  const handleSelect = (value: string | number, checked: boolean) => {
    const newSelectedValues = new Set(selectedValues);

    if (checked) {
      newSelectedValues.add(value);
    } else {
      newSelectedValues.delete(value);
    }

    const newValuesArray = Array.from(newSelectedValues);
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      filter: {
        ...prev.filter,
        [filterId]: newValuesArray.length > 0 ? newValuesArray : undefined,
      },
    }));
  };

  const clearSelection = () => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      filter: {
        ...prev.filter,
        [filterId]: undefined,
      },
    }));
    setOpen(false);
  };

  // Get selected items for display
  const selectedItems = filteredOptions.filter((opt: any) => 
    selectedValues.has(opt[optionValueKey])
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 justify-start border" style={{borderStyle: "dashed"}}>
          {selectedValues.size === 0 ? <CirclePlus className="h-4 w-4 ml-auto" /> : <CircleMinus className="h-4 w-4 ml-auto" />}
          <span>{label}</span>
          {selectedItems.length > 0 && selectedItems.length <= 2 && (
            <>
              <Separator orientation="vertical" />
              {selectedItems.map((opt: any) => (
                <Badge key={String(opt[optionValueKey])} variant="secondary" className="font-normal">
                  {opt[optionLabelKey]}
                </Badge>
              ))}
            </>
          )}
          {selectedItems.length > 2 && (
            <Badge variant="secondary" className="font-normal">
              {selectedItems.length} selected
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={`Buscar ${label.toLowerCase()}...`} 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoading && (
              <div className="p-2 flex justify-center items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!isLoading && filteredOptions.length === 0 && (
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredOptions.map((option: any) => {
                const value = option[optionValueKey];
                const isSelected = selectedValues.has(value);
                return (
                  <CommandItem
                    key={String(value)}
                    onSelect={() => handleSelect(value, !isSelected)}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked: boolean) => handleSelect(value, checked)}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <span className="flex-1">{option[optionLabelKey]}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        
        {/* Clear Button */}
        {selectedValues.size > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="w-full"
            >
              Clear selection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}