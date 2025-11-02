# Guía de Instalación - Nuevas Funcionalidades de Ishikawa

Esta guía te ayudará a configurar las nuevas funcionalidades de guardado y exportación PDF del Diagrama de Ishikawa.

## 🔧 Pasos de Instalación

### 1. Backend (Laravel)

#### Ejecutar la migración de base de datos:

```bash
cd apps/laravel
php artisan migrate
```

Esto creará la tabla `analisis_ishikawa` con los siguientes campos:
- `id`: Identificador único
- `grupo_id`: Referencia al grupo analizado
- `user_id`: Usuario que realizó el análisis
- `tasa_reprobacion`: Tasa de reprobación del grupo
- `observaciones`: JSON con las observaciones por categoría
- `created_at` y `updated_at`: Timestamps

#### Verificar la migración:

```bash
php artisan migrate:status
```

Deberías ver la migración `2025_11_02_000001_create_analisis_ishikawa_table` como ejecutada.

### 2. Frontend (Next.js)

#### Las dependencias ya fueron instaladas:

```bash
cd apps/nextjs
npm install
```

Esto instaló:
- `html2canvas@^1.4.1`: Para capturar el diagrama como imagen
- `jspdf@^2.5.2`: Para generar el archivo PDF

## 🧪 Verificación

### Backend

Verifica que los nuevos endpoints estén disponibles:

```bash
php artisan route:list | grep ishikawa
```

Deberías ver:
- `GET|HEAD  api/v1/grupos/{grupo}/ishikawa-data`
- `POST      api/v1/grupos/{grupo}/ishikawa/save`
- `GET|HEAD  api/v1/grupos/{grupo}/ishikawa/latest`
- `GET|HEAD  api/v1/grupos/{grupo}/ishikawa/list`
- `DELETE    api/v1/analisis-ishikawa/{analisis}`

### Frontend

Verifica que las dependencias estén instaladas:

```bash
npm list html2canvas jspdf
```

## 🚀 Uso de las Nuevas Funcionalidades

### 1. Guardar Análisis

1. Navega a la página de Ishikawa
2. Selecciona un grupo
3. Escribe observaciones en los campos de texto
4. Haz clic en el botón "Guardar"
5. Recibirás una notificación de confirmación

**Datos guardados:**
- Tasa de reprobación del grupo
- Observaciones por cada categoría de factores
- Vinculado al usuario actual

### 2. Recuperar Análisis Guardado

Cuando selecciones un grupo para el cual ya guardaste un análisis:
- Las observaciones se cargarán automáticamente
- Puedes editarlas y volver a guardar
- Cada guardado actualiza el análisis existente

### 3. Exportar a PDF

1. Asegúrate de tener el diagrama completo visible
2. Haz clic en el botón "Exportar PDF"
3. El sistema capturará el diagrama completo
4. Se descargará automáticamente como:
   - Formato: `ishikawa-grupo-{ID}-{timestamp}.pdf`
   - Orientación: Horizontal (Landscape)
   - Tamaño: A4

**Incluye:**
- El diagrama completo de Ishikawa
- Todas las observaciones escritas
- Título y descripción
- Factores de riesgo con frecuencias

## 📊 Estructura de la Base de Datos

### Tabla: analisis_ishikawa

```sql
CREATE TABLE analisis_ishikawa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grupo_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    tasa_reprobacion DECIMAL(5,2) NOT NULL,
    observaciones JSON NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_grupo_id (grupo_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### Ejemplo de registro:

```json
{
  "id": 1,
  "grupo_id": 5,
  "user_id": 1,
  "tasa_reprobacion": 32.50,
  "observaciones": {
    "Académico": "Alta incidencia de inasistencias en las primeras semanas del semestre.",
    "Personal": "Varios estudiantes reportan problemas familiares.",
    "Económico": "Dificultades para adquirir materiales necesarios."
  },
  "created_at": "2025-11-02 10:30:00",
  "updated_at": "2025-11-02 14:45:00"
}
```

## 🔐 Seguridad

- Todos los endpoints requieren autenticación (`auth:sanctum`)
- Cada usuario solo puede editar/eliminar sus propios análisis
- Los análisis están asociados al grupo y al usuario
- Las eliminaciones de grupos/usuarios en cascada limpian los análisis

## 🐛 Troubleshooting

### Error: "Tabla no encontrada"
```bash
# Ejecuta las migraciones
php artisan migrate
```

### Error: "Cannot find module 'html2canvas'"
```bash
# Reinstala las dependencias
cd apps/nextjs
npm install
```

### Error al exportar PDF
- Asegúrate de que el diagrama esté completamente visible
- Verifica la consola del navegador para errores
- Intenta con un navegador diferente

### Las observaciones no se guardan
- Verifica que estés autenticado
- Revisa los permisos del usuario
- Comprueba los logs de Laravel: `tail -f storage/logs/laravel.log`

## 📝 Notas Adicionales

### Limitaciones de Exportación PDF
- El PDF se genera en el lado del cliente
- Funciona mejor con navegadores modernos (Chrome, Firefox, Edge)
- La calidad depende del tamaño del diagrama
- Si el diagrama es muy grande, puede tardar unos segundos

### Rendimiento
- Los análisis se cachean en el frontend
- Las observaciones se actualizan en tiempo real
- La exportación PDF es instantánea para diagramas normales

### Backups
```bash
# Hacer backup de la tabla de análisis
php artisan db:table analisis_ishikawa --dump > backup_ishikawa.sql
```

## ✅ Checklist de Instalación

- [ ] Migración ejecutada en Laravel
- [ ] Dependencias instaladas en Next.js
- [ ] Endpoints verificados
- [ ] Prueba de guardado exitosa
- [ ] Prueba de exportación PDF exitosa
- [ ] Toaster de notificaciones funcionando

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs de Laravel: `storage/logs/laravel.log`
2. Revisa la consola del navegador (F12)
3. Verifica que todos los servicios estén corriendo
4. Contacta al equipo de desarrollo

---

**¡Listo!** Ahora tienes todas las funcionalidades de guardado y exportación PDF funcionando. 🎉
