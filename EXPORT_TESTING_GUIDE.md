# 🧪 Guía de Pruebas - Exportación de Datos

## Pre-requisitos

1. Backend Laravel corriendo en `http://localhost:8000`
2. Token de autenticación válido
3. Datos de prueba en la base de datos

---

## 🔑 Obtener Token de Autenticación

```bash
# Login para obtener token
curl -X POST "http://localhost:8000/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'

# Guardar el token retornado
TOKEN="tu_token_aqui"
```

---

## ✅ Pruebas por Recurso

### 1. Alumnos

#### Exportar todos los alumnos (Excel)
```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output alumnos_todos.xlsx

# ✅ Verificar: Debe descargar archivo alumnos_todos.xlsx
```

#### Exportar todos los alumnos (CSV)
```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/csv" \
  -H "Authorization: Bearer $TOKEN" \
  --output alumnos_todos.csv

# ✅ Verificar: Debe descargar archivo alumnos_todos.csv
```

#### Exportar alumnos de una carrera específica
```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel?filter[carrera_id]=1" \
  -H "Authorization: Bearer $TOKEN" \
  --output alumnos_carrera_1.xlsx

# ✅ Verificar: Solo debe incluir alumnos de carrera_id = 1
```

#### Exportar alumnos por semestre
```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel?filter[semestre]=5" \
  -H "Authorization: Bearer $TOKEN" \
  --output alumnos_semestre_5.xlsx

# ✅ Verificar: Solo debe incluir alumnos de semestre 5
```

#### Exportar con múltiples filtros
```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel?filter[carrera_id]=1&filter[semestre]=5&filter[estatus_alumno]=activo" \
  -H "Authorization: Bearer $TOKEN" \
  --output alumnos_filtro_multiple.xlsx

# ✅ Verificar: Debe aplicar todos los filtros
```

---

### 2. Profesores

#### Exportar todos los profesores
```bash
curl -X GET "http://localhost:8000/api/v1/profesores/export/excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output profesores_todos.xlsx

# ✅ Verificar: Columnas: ID, Nombre, Apellidos, RFC, Email, Fecha
```

#### Exportar profesores filtrados por nombre
```bash
curl -X GET "http://localhost:8000/api/v1/profesores/export/excel?filter[nombre]=Juan" \
  -H "Authorization: Bearer $TOKEN" \
  --output profesores_juan.xlsx

# ✅ Verificar: Solo debe incluir profesores con nombre "Juan"
```

---

### 3. Carreras

#### Exportar todas las carreras
```bash
curl -X GET "http://localhost:8000/api/v1/carreras/export/excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output carreras_todas.xlsx

# ✅ Verificar: Columnas: ID, Nombre, Clave, Fecha
```

#### Exportar carreras (CSV)
```bash
curl -X GET "http://localhost:8000/api/v1/carreras/export/csv" \
  -H "Authorization: Bearer $TOKEN" \
  --output carreras_todas.csv

# ✅ Verificar: Formato CSV compatible con Excel
```

---

### 4. Grupos

#### Exportar todos los grupos
```bash
curl -X GET "http://localhost:8000/api/v1/grupos/export/excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output grupos_todos.xlsx

# ✅ Verificar: Columnas incluyen Periodo, Materia, Profesor, etc.
```

#### Exportar grupos de un periodo
```bash
curl -X GET "http://localhost:8000/api/v1/grupos/export/excel?filter[periodo_id]=1" \
  -H "Authorization: Bearer $TOKEN" \
  --output grupos_periodo_1.xlsx

# ✅ Verificar: Solo grupos del periodo 1
```

#### Exportar grupos de un profesor
```bash
curl -X GET "http://localhost:8000/api/v1/grupos/export/excel?filter[profesor_id]=3" \
  -H "Authorization: Bearer $TOKEN" \
  --output grupos_profesor_3.xlsx

# ✅ Verificar: Solo grupos del profesor_id = 3
```

---

### 5. Materias

#### Exportar todas las materias
```bash
curl -X GET "http://localhost:8000/api/v1/materias/export/excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output materias_todas.xlsx

# ✅ Verificar: Incluye total de unidades y grupos
```

#### Exportar materias filtradas
```bash
curl -X GET "http://localhost:8000/api/v1/materias/export/excel?filter[creditos]=6" \
  -H "Authorization: Bearer $TOKEN" \
  --output materias_6_creditos.xlsx

# ✅ Verificar: Solo materias de 6 créditos
```

---

### 6. Periodos

#### Exportar todos los periodos
```bash
curl -X GET "http://localhost:8000/api/v1/periodos/export/excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output periodos_todos.xlsx

# ✅ Verificar: Incluye fechas y estado activo
```

#### Exportar solo periodos activos
```bash
curl -X GET "http://localhost:8000/api/v1/periodos/export/excel?filter[activo]=1" \
  -H "Authorization: Bearer $TOKEN" \
  --output periodos_activos.xlsx

# ✅ Verificar: Solo periodos con activo = true
```

---

### 7. Factores de Riesgo

#### Exportar todos los factores
```bash
curl -X GET "http://localhost:8000/api/v1/factores-riesgo/export/excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output factores_todos.xlsx

# ✅ Verificar: Incluye total de alumnos afectados
```

#### Exportar factores por categoría
```bash
curl -X GET "http://localhost:8000/api/v1/factores-riesgo/export/excel?filter[categoria]=Económico" \
  -H "Authorization: Bearer $TOKEN" \
  --output factores_economicos.xlsx

# ✅ Verificar: Solo factores de categoría "Económico"
```

---

## 🔒 Pruebas de Seguridad

### Intentar sin autenticación (debe fallar)
```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel" \
  --output test_sin_auth.xlsx

# ✅ Verificar: Debe retornar 401 Unauthorized
# El archivo no debe descargarse
```

### Intentar con token inválido
```bash
curl -X GET "http://localhost:8000/api/v1/alumnos/export/excel" \
  -H "Authorization: Bearer token_invalido" \
  --output test_token_invalido.xlsx

# ✅ Verificar: Debe retornar 401 Unauthorized
```

---

## 🌐 Pruebas Frontend (Manual)

### Prueba 1: Exportar sin filtros
1. Navegar a `/admin/alumnos`
2. Hacer clic en "Exportar"
3. Seleccionar "Exportar a Excel (.xlsx)"
4. ✅ Verificar: 
   - Se muestra toast "Exportando a EXCEL..."
   - Archivo se descarga automáticamente
   - Toast cambia a "Archivo exportado exitosamente"
   - Nombre del archivo: `alumnos_YYYY-MM-DD.xlsx`

### Prueba 2: Exportar con filtros
1. Navegar a `/admin/alumnos`
2. Aplicar filtro: Carrera = "Sistemas"
3. Aplicar filtro: Semestre = "5"
4. Hacer clic en "Exportar" → "Exportar a CSV (.csv)"
5. ✅ Verificar:
   - Archivo contiene solo alumnos filtrados
   - Nombre del archivo: `alumnos_YYYY-MM-DD.csv`

### Prueba 3: Exportar otros recursos
1. Repetir prueba 1 en:
   - `/admin/profesores` ✅
   - `/admin/carreras` ✅
   - `/admin/grupos` ✅
   - `/admin/materias` ✅
   - `/admin/periodos` ✅
   - `/admin/factores-riesgo` ✅

### Prueba 4: Manejo de errores
1. Desconectar el backend
2. Intentar exportar
3. ✅ Verificar: 
   - Se muestra toast de error
   - No se descarga archivo
   - La aplicación no se rompe

---

## 📊 Verificación de Datos Exportados

### Verificar Excel (.xlsx)
1. Abrir el archivo en Microsoft Excel o LibreOffice Calc
2. ✅ Verificar:
   - Columnas tienen cabeceras correctas
   - Datos están formateados
   - No hay valores #N/A o errores
   - Las relaciones (carrera.nombre, etc.) se muestran correctamente
   - Las fechas están en formato legible

### Verificar CSV (.csv)
1. Abrir el archivo en un editor de texto
2. ✅ Verificar:
   - Cabeceras en la primera línea
   - Valores separados por comas
   - No hay caracteres extraños
3. Importar a Google Sheets
4. ✅ Verificar:
   - Se importa correctamente
   - Los datos se separan en columnas

---

## 🧪 Script de Prueba Automatizado (Bash)

```bash
#!/bin/bash

# Script de prueba automática de exportación
# Uso: ./test_export.sh YOUR_TOKEN

TOKEN=$1
BASE_URL="http://localhost:8000/api/v1"
OUTPUT_DIR="./test_exports"

# Crear directorio de salida
mkdir -p $OUTPUT_DIR

echo "🧪 Iniciando pruebas de exportación..."
echo "====================================="

# Función para probar exportación
test_export() {
  resource=$1
  format=$2
  filter=$3
  
  url="$BASE_URL/$resource/export/$format"
  if [ ! -z "$filter" ]; then
    url="$url?$filter"
  fi
  
  output_file="$OUTPUT_DIR/${resource}_${format}.${format/excel/xlsx}"
  output_file="${output_file/csv/csv}"
  
  echo "Probando: $resource ($format)..."
  
  response=$(curl -s -w "%{http_code}" -X GET "$url" \
    -H "Authorization: Bearer $TOKEN" \
    --output "$output_file")
  
  if [ "$response" == "200" ]; then
    echo "✅ ÉXITO: $resource ($format)"
  else
    echo "❌ ERROR: $resource ($format) - HTTP $response"
  fi
}

# Probar todos los recursos
test_export "alumnos" "excel" ""
test_export "alumnos" "csv" ""
test_export "alumnos" "excel" "filter[semestre]=5"

test_export "profesores" "excel" ""
test_export "profesores" "csv" ""

test_export "carreras" "excel" ""
test_export "carreras" "csv" ""

test_export "grupos" "excel" ""
test_export "grupos" "csv" ""

test_export "materias" "excel" ""
test_export "materias" "csv" ""

test_export "periodos" "excel" ""
test_export "periodos" "csv" ""

test_export "factores-riesgo" "excel" ""
test_export "factores-riesgo" "csv" ""

echo "====================================="
echo "✅ Pruebas completadas"
echo "Archivos guardados en: $OUTPUT_DIR"
ls -lh $OUTPUT_DIR
```

**Uso:**
```bash
chmod +x test_export.sh
./test_export.sh "tu_token_aqui"
```

---

## 📋 Checklist de Pruebas Completas

### Backend
- [ ] Todas las rutas de exportación están registradas
- [ ] Todos los endpoints retornan 200 con token válido
- [ ] Todos los endpoints retornan 401 sin token
- [ ] Los archivos .xlsx se descargan correctamente
- [ ] Los archivos .csv se descargan correctamente
- [ ] Los filtros se aplican correctamente
- [ ] Las relaciones (with) se cargan correctamente
- [ ] Los timestamps en nombres de archivo funcionan
- [ ] No hay errores en logs

### Frontend
- [ ] El botón "Exportar" aparece en todas las páginas
- [ ] El dropdown muestra opciones Excel y CSV
- [ ] Los toasts de carga se muestran
- [ ] Los toasts de éxito se muestran
- [ ] Los toasts de error se muestran (al fallar)
- [ ] Los filtros aplicados se respetan
- [ ] La descarga es automática
- [ ] Los nombres de archivo son correctos

### Calidad de Datos
- [ ] Las cabeceras son descriptivas
- [ ] No hay valores NULL donde no deberían estar
- [ ] Las fechas están formateadas
- [ ] Las relaciones se muestran correctamente
- [ ] Los conteos (withCount) son precisos
- [ ] No hay #N/A o errores en Excel
- [ ] El CSV es compatible con otros sistemas

---

## 🎯 Criterios de Aceptación

✅ **Funcionalidad**: Todos los 14 endpoints funcionan  
✅ **Seguridad**: Autenticación requerida en todos  
✅ **Filtros**: Respetan los filtros aplicados  
✅ **Formatos**: Excel y CSV se generan correctamente  
✅ **UX**: Interfaz intuitiva y feedback claro  
✅ **Datos**: Información completa y correcta  
✅ **Performance**: Exportaciones rápidas (<5s para <10k registros)  

---

## 📞 Reporte de Bugs

Si encuentras algún problema durante las pruebas:

1. Verifica la versión de maatwebsite/excel: `composer show maatwebsite/excel`
2. Revisa los logs: `tail -f storage/logs/laravel.log`
3. Verifica la consola del navegador (Frontend)
4. Documenta el error con:
   - URL exacta
   - Filtros aplicados
   - Código de respuesta HTTP
   - Mensaje de error
   - Pasos para reproducir

---

**Última actualización**: Noviembre 3, 2025  
**Total de pruebas**: 30+ casos de prueba  
**Estado**: ✅ READY FOR TESTING
