# CSV Import Feature

## Overview

The CSV import feature allows you to bulk import data for resources like Alumnos using a CSV file. This feature is built with:

- **Frontend**: React component with PapaParse for CSV parsing
- **Backend**: Laravel endpoint for bulk data creation
- **UI**: Dialog modal with drag-and-drop CSV upload

## Features

- ✅ CSV file validation
- ✅ Header validation to ensure correct format
- ✅ Progress indicator during upload
- ✅ Error handling with detailed messages
- ✅ Success confirmation
- ✅ Automatic data refresh after import

## How to Use

### 1. Prepare Your CSV File

Create a CSV file with the required headers. For Alumnos, the headers are:

```csv
carrera_id,matricula,nombre,apellido_paterno,apellido_materno,semestre,genero,modalidad
```

**Example CSV:**
```csv
carrera_id,matricula,nombre,apellido_paterno,apellido_materno,semestre,genero,modalidad
1,20230001,Juan,Pérez,García,3,masculino,presencial
1,20230002,María,López,Martínez,3,femenino,virtual
2,20230003,Carlos,Rodríguez,Sánchez,5,masculino,hibrida
```

A template file is available at: `/public/templates/alumnos-template.csv`

### 2. Import via UI

1. Navigate to the Alumnos page (`/admin/alumnos`)
2. Click the "Importar CSV" button in the top right
3. Select your CSV file
4. Review the parsed data
5. Click "Importar" to upload

### 3. Validation Rules

The CSV data must follow these rules:

- **carrera_id**: Required, must be a valid carrera ID
- **matricula**: Required, max 50 characters
- **nombre**: Required, max 100 characters
- **apellido_paterno**: Required, max 100 characters
- **apellido_materno**: Optional, max 100 characters
- **semestre**: Required, must be between 1 and 12
- **genero**: Required, must be one of: `masculino`, `femenino`, `otro`
- **modalidad**: Required, must be one of: `presencial`, `virtual`, `hibrida`

## Technical Implementation

### Frontend Components

**CsvImportDialog** (`src/components/common/CsvImportDialog.tsx`)
- Handles file selection and CSV parsing using PapaParse
- Validates headers against expected format
- Shows upload progress and results
- Communicates with backend via `apiService.bulkImport()`

**Resource Page** (`src/app/admin/[resource]/page.tsx`)
- Conditionally shows import button based on `csvHeaders` config
- Handles import success/error states

### Backend Endpoint

**Route**: `POST /api/v1/alumnos/import`

**Request Body**:
```json
{
  "data": [
    {
      "carrera_id": 1,
      "matricula": "20230001",
      "nombre": "Juan",
      "apellido_paterno": "Pérez",
      "apellido_materno": "García",
      "semestre": 3,
      "genero": "masculino",
      "modalidad": "presencial"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "imported": 3,
  "failed": 0,
  "errors": []
}
```

### Configuration

To enable CSV import for a resource, add the `csvHeaders` property to the resource config:

```typescript
// src/config/resources/alumnos.config.ts
export const AlumnoCsvHeaders = [
  "carrera_id",
  "matricula",
  "nombre",
  "apellido_paterno",
  "apellido_materno",
  "semestre",
  "genero",
  "modalidad"
];
```

Then register it in the resource config map:

```typescript
// src/config/resources/index.ts
alumnos: {
  columns: AlumnosConfig.AlumnoColumns,
  type: {} as AlumnosConfig.Alumno,
  filters: AlumnosConfig.AlumnoFilters,
  schema: AlumnosConfig.AlumnoSchema,
  formConfig: AlumnosConfig.AlumnoFormConfig,
  csvHeaders: AlumnosConfig.AlumnoCsvHeaders, // Add this line
},
```

## Adding Import to Other Resources

To add CSV import to other resources:

1. **Define CSV headers** in the resource config file:
```typescript
export const MiRecursoCsvHeaders = ["campo1", "campo2", ...];
```

2. **Export it** in the resource config index:
```typescript
mirecurso: {
  // ... existing config
  csvHeaders: MiRecursoConfig.MiRecursoCsvHeaders,
}
```

3. **Create the import endpoint** in the Laravel controller:
```php
public function import(Request $request): JsonResponse
{
    $request->validate([
        'data' => 'required|array',
        // Add validation rules for each field
    ]);

    // Import logic here
}
```

4. **Register the route** before the apiResource:
```php
Route::post('mirecurso/import', [MiRecursoController::class, 'import']);
Route::apiResource('mirecurso', MiRecursoController::class);
```

## Error Handling

The import process handles errors at multiple levels:

1. **File validation**: Ensures file is CSV format
2. **Header validation**: Checks for required columns
3. **Data validation**: Laravel validates each row
4. **Partial imports**: If some rows fail, successful rows are still imported

Errors are displayed in the dialog with row numbers and specific messages.

## Notes

- The import sets `usuario_id` to `null` by default for CSV imports
- Large CSV files (1000+ rows) may take some time to process
- The UI refreshes automatically after successful import
- Failed rows are reported but don't prevent successful rows from being imported
