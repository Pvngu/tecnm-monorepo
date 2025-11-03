# Endpoints de Exportación - API Reference

## 📋 Resumen

Todos los endpoints de exportación siguen el mismo patrón:
- **Autenticación**: Requieren token de `auth:sanctum`
- **Métodos**: GET
- **Formatos**: Excel (.xlsx) y CSV (.csv)
- **Respuesta**: Archivo binario para descarga
- **Filtros**: Soportan todos los filtros definidos en el método `index()` del controlador

---

## 🔗 Endpoints Disponibles

### 1. Alumnos

**Excel:**
```http
GET /api/v1/alumnos/export/excel
Authorization: Bearer {token}
```

**CSV:**
```http
GET /api/v1/alumnos/export/csv
Authorization: Bearer {token}
```

**Filtros soportados:**
- `filter[nombre]` - Búsqueda parcial por nombre
- `filter[apellido_paterno]` - Búsqueda parcial
- `filter[apellido_materno]` - Búsqueda parcial
- `filter[matricula]` - Búsqueda parcial
- `filter[semestre]` - Búsqueda parcial
- `filter[genero]` - Búsqueda parcial
- `filter[modalidad]` - Búsqueda parcial
- `filter[carrera_id]` - Exacto
- `filter[usuario_id]` - Exacto
- `filter[estatus_alumno]` - Exacto

**Columnas exportadas:**
- Matrícula
- Nombre
- Apellido Paterno
- Apellido Materno
- Carrera
- Semestre
- Género
- Modalidad
- Estatus
- Email
- Fecha de Registro

---

### 2. Profesores

**Excel:**
```http
GET /api/v1/profesores/export/excel
Authorization: Bearer {token}
```

**CSV:**
```http
GET /api/v1/profesores/export/csv
Authorization: Bearer {token}
```

**Filtros soportados:**
- `filter[nombre]` - Búsqueda parcial
- `filter[apellido_paterno]` - Búsqueda parcial
- `filter[apellido_materno]` - Búsqueda parcial
- `filter[rfc]` - Búsqueda parcial
- `filter[usuario_id]` - Exacto

**Columnas exportadas:**
- ID
- Nombre
- Apellido Paterno
- Apellido Materno
- RFC
- Email
- Fecha de Registro

---

### 3. Carreras

**Excel:**
```http
GET /api/v1/carreras/export/excel
Authorization: Bearer {token}
```

**CSV:**
```http
GET /api/v1/carreras/export/csv
Authorization: Bearer {token}
```

**Filtros soportados:**
- `filter[nombre]` - Búsqueda parcial
- `filter[clave]` - Búsqueda parcial

**Columnas exportadas:**
- ID
- Nombre
- Clave
- Fecha de Registro

---

### 4. Grupos

**Excel:**
```http
GET /api/v1/grupos/export/excel
Authorization: Bearer {token}
```

**CSV:**
```http
GET /api/v1/grupos/export/csv
Authorization: Bearer {token}
```

**Filtros soportados:**
- `filter[horario]` - Búsqueda parcial
- `filter[aula]` - Búsqueda parcial
- `filter[materia_id]` - Exacto
- `filter[profesor_id]` - Exacto
- `filter[periodo_id]` - Exacto
- `filter[carrera_id]` - Exacto

**Columnas exportadas:**
- ID
- Periodo
- Materia
- Profesor
- Carrera
- Horario
- Aula
- Total Inscripciones
- Fecha de Creación

---

### 5. Materias

**Excel:**
```http
GET /api/v1/materias/export/excel
Authorization: Bearer {token}
```

**CSV:**
```http
GET /api/v1/materias/export/csv
Authorization: Bearer {token}
```

**Filtros soportados:**
- `filter[nombre]` - Búsqueda parcial
- `filter[codigo_materia]` - Búsqueda parcial
- `filter[creditos]` - Búsqueda parcial

**Columnas exportadas:**
- ID
- Código
- Nombre
- Créditos
- Total Unidades
- Total Grupos
- Fecha de Registro

---

### 6. Periodos

**Excel:**
```http
GET /api/v1/periodos/export/excel
Authorization: Bearer {token}
```

**CSV:**
```http
GET /api/v1/periodos/export/csv
Authorization: Bearer {token}
```

**Filtros soportados:**
- `filter[nombre]` - Búsqueda parcial
- `filter[activo]` - Búsqueda parcial
- `filter[fecha_inicio]` - Búsqueda parcial
- `filter[fecha_fin]` - Búsqueda parcial

**Columnas exportadas:**
- ID
- Nombre
- Fecha Inicio
- Fecha Fin
- Activo
- Total Grupos
- Fecha de Registro

---

### 7. Factores de Riesgo

**Excel:**
```http
GET /api/v1/factores-riesgo/export/excel
Authorization: Bearer {token}
```

**CSV:**
```http
GET /api/v1/factores-riesgo/export/csv
Authorization: Bearer {token}
```

**Filtros soportados:**
- `filter[nombre]` - Búsqueda parcial
- `filter[categoria]` - Búsqueda parcial

**Columnas exportadas:**
- ID
- Nombre
- Categoría
- Total Alumnos Afectados
- Fecha de Registro

---

## 📝 Ejemplos de Uso

### Curl - Exportar Alumnos con Filtros

```bash
# Excel con filtro de carrera
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel?filter[carrera_id]=1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output alumnos_carrera_1.xlsx

# CSV con múltiples filtros
curl -X GET "http://localhost:8000/api/v1/alumnos/export/csv?filter[carrera_id]=1&filter[semestre]=5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output alumnos_carrera_1_semestre_5.csv
```

### JavaScript (Fetch API)

```javascript
// Función genérica de exportación
async function exportData(resource, format, filters = {}) {
  const params = new URLSearchParams(filters);
  const url = `${API_BASE_URL}/${resource}/export/${format}?${params}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv',
    },
    credentials: 'include',
  });
  
  if (!response.ok) throw new Error('Export failed');
  
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${resource}_${new Date().toISOString()}.${format === 'excel' ? 'xlsx' : 'csv'}`;
  link.click();
  window.URL.revokeObjectURL(downloadUrl);
}

// Ejemplo de uso
exportData('alumnos', 'excel', { 'filter[carrera_id]': 1 });
exportData('profesores', 'csv', { 'filter[nombre]': 'Juan' });
```

### Python (Requests)

```python
import requests

def export_data(resource, format_type, token, filters=None):
    url = f"http://localhost:8000/api/v1/{resource}/export/{format_type}"
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv'
    }
    
    response = requests.get(url, headers=headers, params=filters)
    
    if response.status_code == 200:
        filename = f"{resource}_{format_type}.{'xlsx' if format_type == 'excel' else 'csv'}"
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Archivo guardado: {filename}")
    else:
        print(f"Error: {response.status_code}")

# Ejemplo de uso
export_data('alumnos', 'excel', 'YOUR_TOKEN', {'filter[carrera_id]': 1})
export_data('grupos', 'csv', 'YOUR_TOKEN', {'filter[periodo_id]': 2})
```

---

## 🔒 Autenticación

Todos los endpoints requieren un token de autenticación válido de Sanctum:

```http
Authorization: Bearer {token}
```

Para obtener el token:
1. Inicia sesión en `/api/login`
2. El token se retorna en la respuesta
3. Incluye el token en el header `Authorization` de todas las peticiones

---

## ⚠️ Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Éxito - Archivo descargado |
| 401 | No autenticado - Token inválido o faltante |
| 403 | Sin permisos - Usuario no autorizado |
| 404 | No encontrado - Ruta incorrecta |
| 500 | Error del servidor |

---

## 🎯 Mejores Prácticas

1. **Filtros Complejos**: Combina múltiples filtros para exportar datos específicos
   ```
   /alumnos/export/excel?filter[carrera_id]=1&filter[semestre]=5&filter[estatus_alumno]=activo
   ```

2. **Ordenamiento**: Usa el parámetro `sort` (si está implementado)
   ```
   /alumnos/export/excel?sort=-created_at
   ```

3. **Nombres de Archivo**: Los archivos incluyen timestamp automáticamente
   - Formato: `{recurso}_{YYYY-MM-DD_HHmmss}.{extension}`
   - Ejemplo: `alumnos_2025-11-03_143022.xlsx`

4. **Límites**: No hay límite de registros, pero exportaciones muy grandes pueden tardar

5. **Formato**: 
   - Usa **Excel** para análisis visual con formato
   - Usa **CSV** para importar a otros sistemas o procesamiento automático

---

## 📊 Estadísticas de Implementación

**Total de Recursos con Exportación**: 7
- Alumnos
- Profesores
- Carreras
- Grupos
- Materias
- Periodos
- Factores de Riesgo

**Total de Endpoints**: 14 (2 por recurso)

**Total de Clases de Exportación**: 7

**Total de Controladores Actualizados**: 7

---

**Última Actualización**: Noviembre 3, 2025  
**Versión del API**: v1  
**Stack**: Laravel 11 + maatwebsite/excel 3.1.67
