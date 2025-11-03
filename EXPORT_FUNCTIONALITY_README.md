# Funcionalidad de Exportación de Datos (Excel/CSV)

## 📋 Descripción General

Este documento describe la implementación de la funcionalidad de exportación de datos a formatos Excel (.xlsx) y CSV (.csv) en el sistema de gestión escolar. La exportación está disponible para el recurso de **Alumnos** y puede ser fácilmente extendida a otros recursos.

### Características Principales

✅ **Exportación a múltiples formatos**: Excel (.xlsx) y CSV (.csv)  
✅ **Respeta filtros aplicados**: La exportación incluye solo los datos filtrados por el usuario  
✅ **Autenticación segura**: Los endpoints están protegidos por auth:sanctum  
✅ **Interfaz intuitiva**: Menú dropdown en el frontend para seleccionar el formato  
✅ **Nombres de archivo con timestamp**: Los archivos se generan con fecha y hora  
✅ **Optimizado para grandes volúmenes**: Usa `FromQuery` para eficiencia  

---

## 🏗️ Arquitectura de la Solución

### Backend (Laravel)

1. **Biblioteca**: `maatwebsite/excel` v3.1.67
2. **Clase de Exportación**: `app/Exports/AlumnosExport.php`
3. **Controlador**: `app/Http/Controllers/AlumnoController.php`
4. **Rutas**: `routes/api.php`

### Frontend (Next.js)

1. **Servicio API**: `src/services/apiService.ts`
2. **Componente principal**: `src/app/admin/[resource]/page.tsx`
3. **UI Components**: Shadcn/ui (`DropdownMenu`, `Button`)

---

## 📁 Estructura de Archivos Creados/Modificados

### Backend

```
apps/laravel/
├── app/
│   ├── Exports/
│   │   └── AlumnosExport.php          # ✨ NUEVO
│   └── Http/
│       └── Controllers/
│           └── AlumnoController.php    # ✏️ MODIFICADO
└── routes/
    └── api.php                         # ✏️ MODIFICADO
```

### Frontend

```
apps/nextjs/
└── src/
    ├── services/
    │   └── apiService.ts               # ✏️ MODIFICADO
    └── app/
        └── admin/
            └── [resource]/
                └── page.tsx            # ✏️ MODIFICADO
```

---

## 🔧 Implementación Detallada

### 1. Backend - Clase de Exportación

**Archivo**: `apps/laravel/app/Exports/AlumnosExport.php`

```php
<?php

namespace App\Exports;

use App\Models\Alumno;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AlumnosExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        // Misma lógica de filtrado que en AlumnoController@index
        return QueryBuilder::for(Alumno::class)
            ->allowedFilters([
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'matricula',
                'semestre',
                'genero',
                'modalidad',
                AllowedFilter::exact('carrera_id'),
                AllowedFilter::exact('usuario_id'),
                AllowedFilter::exact('estatus_alumno'),
            ])
            ->with(['carrera', 'usuario']);
    }

    public function headings(): array
    {
        return [
            'Matrícula',
            'Nombre',
            'Apellido Paterno',
            'Apellido Materno',
            'Carrera',
            'Semestre',
            'Género',
            'Modalidad',
            'Estatus',
            'Email',
            'Fecha de Registro',
        ];
    }

    public function map($alumno): array
    {
        return [
            $alumno->matricula,
            $alumno->nombre,
            $alumno->apellido_paterno,
            $alumno->apellido_materno,
            $alumno->carrera->nombre ?? 'N/A',
            $alumno->semestre,
            $alumno->genero,
            $alumno->modalidad,
            $alumno->estatus_alumno,
            $alumno->usuario->email ?? 'N/A',
            $alumno->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
```

### 2. Backend - Métodos del Controlador

**Archivo**: `apps/laravel/app/Http/Controllers/AlumnoController.php`

```php
use App\Exports\AlumnosExport;
use Maatwebsite\Excel\Facades\Excel;

// ...

public function exportExcel(Request $request)
{
    return Excel::download(
        new AlumnosExport($request),
        'alumnos_' . now()->format('Y-m-d_His') . '.xlsx'
    );
}

public function exportCsv(Request $request)
{
    return Excel::download(
        new AlumnosExport($request),
        'alumnos_' . now()->format('Y-m-d_His') . '.csv',
        \Maatwebsite\Excel\Excel::CSV
    );
}
```

### 3. Backend - Rutas de API

**Archivo**: `apps/laravel/routes/api.php`

```php
Route::middleware(['auth:sanctum'])->group(function () {
    // Rutas de exportación (ANTES del apiResource)
    Route::get('alumnos/export/excel', [AlumnoController::class, 'exportExcel']);
    Route::get('alumnos/export/csv', [AlumnoController::class, 'exportCsv']);
    
    Route::apiResource('alumnos', AlumnoController::class);
});
```

### 4. Frontend - Servicio de API

**Archivo**: `apps/nextjs/src/services/apiService.ts`

```typescript
exportFile: async (
    resource: string,
    format: 'excel' | 'csv',
    queryParams: Record<string, any> = {}
): Promise<Blob> => {
    const queryString = objectToQueryString(queryParams);
    const url = queryString
        ? `${apiBaseURL}${resource}/export/${format}?${queryString}`
        : `${apiBaseURL}${resource}/export/${format}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrf,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new HttpError(response, await response.text());
    }

    return response.blob();
}
```

### 5. Frontend - Componente de Página

**Archivo**: `apps/nextjs/src/app/admin/[resource]/page.tsx`

```typescript
import { Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// ...

const handleExport = async (format: 'excel' | 'csv') => {
    try {
        toast.loading(`Exportando a ${format.toUpperCase()}...`);
        
        const blob = await apiService.exportFile(resource, format, queryParams);
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        const extension = format === 'excel' ? 'xlsx' : 'csv';
        const fileName = `${resource}_${timestamp}.${extension}`;
        
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.dismiss();
        toast.success(`Archivo exportado exitosamente: ${fileName}`);
    } catch (error) {
        toast.dismiss();
        console.error('Error al exportar:', error);
        toast.error(`Error al exportar a ${format.toUpperCase()}`);
    }
};

// En el JSX:
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('excel')}>
            Exportar a Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
            Exportar a CSV (.csv)
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
```

---

## 🚀 Uso

### Exportar Datos sin Filtros

1. Navega a `/admin/alumnos`
2. Haz clic en el botón "Exportar"
3. Selecciona el formato deseado (Excel o CSV)
4. El archivo se descargará automáticamente

### Exportar Datos con Filtros

1. Navega a `/admin/alumnos`
2. Aplica los filtros deseados (ej. Carrera, Semestre)
3. Haz clic en el botón "Exportar"
4. Selecciona el formato
5. ✅ El archivo contendrá **solo los datos filtrados**

---

## 🔄 Extender a Otros Recursos

Para agregar exportación a otros recursos (ej. `profesores`, `materias`), sigue estos pasos:

### 1. Crear Clase de Exportación

```bash
cd apps/laravel
php artisan make:export ProfesoresExport --model=Profesor
```

### 2. Configurar la Clase

```php
// apps/laravel/app/Exports/ProfesoresExport.php

namespace App\Exports;

use App\Models\Profesor;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ProfesoresExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        // Copia la lógica de filtrado del ProfesorController@index
        return Profesor::query()->with(['relaciones_necesarias']);
    }

    public function headings(): array
    {
        return ['Columna 1', 'Columna 2', /* ... */];
    }

    public function map($profesor): array
    {
        return [
            $profesor->campo1,
            $profesor->campo2,
            // ...
        ];
    }
}
```

### 3. Agregar Métodos al Controlador

```php
// apps/laravel/app/Http/Controllers/ProfesorController.php

use App\Exports\ProfesoresExport;
use Maatwebsite\Excel\Facades\Excel;

public function exportExcel(Request $request)
{
    return Excel::download(
        new ProfesoresExport($request),
        'profesores_' . now()->format('Y-m-d_His') . '.xlsx'
    );
}

public function exportCsv(Request $request)
{
    return Excel::download(
        new ProfesoresExport($request),
        'profesores_' . now()->format('Y-m-d_His') . '.csv',
        \Maatwebsite\Excel\Excel::CSV
    );
}
```

### 4. Agregar Rutas

```php
// apps/laravel/routes/api.php

Route::get('profesores/export/excel', [ProfesorController::class, 'exportExcel']);
Route::get('profesores/export/csv', [ProfesorController::class, 'exportCsv']);
```

### 5. ¡Listo!

El frontend ya está preparado para manejar la exportación de cualquier recurso automáticamente. No requiere cambios adicionales.

---

## 🧪 Pruebas

### Probar Exportación Excel

```bash
# Usando curl (requiere token válido)
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel?filter[carrera_id]=1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output alumnos.xlsx
```

### Probar Exportación CSV

```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/csv?filter[semestre]=5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output alumnos.csv
```

---

## 📊 Ejemplos de Filtros

Los siguientes filtros están soportados (según `AlumnoController`):

```
GET /api/v1/alumnos/export/excel?filter[carrera_id]=1
GET /api/v1/alumnos/export/excel?filter[semestre]=5
GET /api/v1/alumnos/export/excel?filter[genero]=masculino
GET /api/v1/alumnos/export/excel?filter[estatus_alumno]=activo
GET /api/v1/alumnos/export/excel?filter[nombre]=Juan
GET /api/v1/alumnos/export/excel?filter[carrera_id]=1&filter[semestre]=5
```

---

## 🔍 Consideraciones Técnicas

### Seguridad

- ✅ Los endpoints están protegidos por `auth:sanctum`
- ✅ Solo usuarios autenticados pueden exportar datos
- ✅ Los filtros se validan a través de `Spatie\QueryBuilder`

### Rendimiento

- ✅ Usa `FromQuery` para cargar datos en streaming (eficiente para grandes volúmenes)
- ✅ Las relaciones se cargan con `with()` para evitar N+1 queries
- ✅ Auto-ajuste de columnas con `ShouldAutoSize`

### Limitaciones Conocidas

- El archivo se genera en memoria. Para exportaciones **muy grandes** (>100k filas), considera usar:
  - `WithChunking` para procesar en lotes
  - Trabajos en cola (queues) para exportaciones asíncronas

---

## 📚 Recursos Adicionales

- [Documentación de maatwebsite/excel](https://docs.laravel-excel.com/)
- [Spatie Query Builder](https://spatie.be/docs/laravel-query-builder/)
- [Shadcn/ui Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu)

---

## ✅ Checklist de Implementación

- [x] Backend: Instalar `maatwebsite/excel`
- [x] Backend: Crear clase `AlumnosExport`
- [x] Backend: Implementar métodos `exportExcel()` y `exportCsv()`
- [x] Backend: Agregar rutas de exportación
- [x] Frontend: Agregar método `exportFile()` a `apiService`
- [x] Frontend: Implementar botón de exportación con dropdown
- [x] Frontend: Implementar función `handleExport()`
- [x] Documentación: Crear README

---

## 🎉 Conclusión

La funcionalidad de exportación está **completamente implementada** y lista para usar. El patrón es reutilizable y puede ser aplicado a cualquier otro recurso del sistema siguiendo los pasos de extensión descritos en este documento.

**Desarrollado por**: Sistema de Gestión Escolar - TECNM  
**Fecha**: Noviembre 2025  
**Stack**: Laravel 11 + Next.js 14 + Shadcn/ui
