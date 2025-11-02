# Actualización del Sistema de Estatus de Alumnos

## Descripción

Se ha actualizado el sistema para usar la columna `estatus_alumno` de la tabla `alumnos` para calcular correctamente la deserción estudiantil.

## Estados de Alumno

La columna `estatus_alumno` puede tener los siguientes valores:

- **`activo`**: Estudiante que está cursando normalmente
- **`baja_temporal`**: Estudiante que ha suspendido temporalmente sus estudios
- **`baja_definitiva`**: Estudiante que ha abandonado definitivamente sus estudios
- **`egresado`**: Estudiante que ha completado su carrera

## Cambios Realizados

### 1. Backend (Laravel)

#### DashboardController.php
- **Actualizado**: El cálculo de deserción ahora usa `estatus_alumno`
- **Lógica**: Deserción = estudiantes con estatus `baja_temporal` + `baja_definitiva`
- **Gráfico**: Muestra deserción por semestre basándose en el estatus

#### AlumnoFactory.php
- **Actualizado**: Genera el campo `estatus_alumno` con distribución realista:
  - 70% activos
  - 15% baja temporal
  - 10% baja definitiva
  - 5% egresados

#### DatabaseSeeder.php
- **Actualizado**: Asigna estatus basándose en el rendimiento académico:
  - **Egresados**: Semestre 9 con promedio ≥ 70 (30% probabilidad)
  - **Baja definitiva**: Promedio < 60 o ≥ 3 factores de riesgo (20% probabilidad)
  - **Baja temporal**: Promedio < 70 (25% probabilidad)
  - **Activos**: El resto

### 2. Migración de Datos

#### Migración: `update_alumnos_estatus_based_on_performance`
- Actualiza automáticamente el estatus de alumnos existentes
- Se ejecuta al correr `php artisan migrate`

### 3. Comando Artisan

#### `php artisan alumnos:update-estatus`
- **Propósito**: Actualizar el estatus de alumnos en cualquier momento
- **Uso**: Útil para recalcular estatus después de cambios en calificaciones
- **Output**: Muestra tabla con distribución de estatus

## Uso

### Para Nuevas Instalaciones

1. Ejecutar migraciones:
   ```bash
   cd apps/laravel
   php artisan migrate:fresh --seed
   ```

2. El seeder automáticamente asignará estatus realistas

### Para Bases de Datos Existentes

**Opción 1: Usar la migración**
```bash
cd apps/laravel
php artisan migrate
```

**Opción 2: Usar el comando Artisan**
```bash
cd apps/laravel
php artisan alumnos:update-estatus
```

## Lógica de Asignación de Estatus

### Criterios Automáticos

```php
if (semestre == 9 && promedio >= 70) {
    // 30% probabilidad -> egresado
}
else if (promedio < 60 || factoresRiesgo >= 3) {
    // 20% probabilidad -> baja_definitiva
}
else if (promedio < 70 && promedio >= 60) {
    // 25% probabilidad -> baja_temporal
}
else {
    // activo
}
```

### Factores Considerados

1. **Promedio de calificaciones**: De todas las inscripciones
2. **Factores de riesgo**: Número de factores asignados
3. **Semestre actual**: Para identificar posibles egresados
4. **Probabilidad**: Para simular comportamiento realista

## Dashboard

El dashboard ahora muestra:

- **Total Estudiantes**: Todos los estudiantes registrados
- **Reprobación Promedio**: % de calificaciones < 70
- **Deserción Estimada**: % de estudiantes con `baja_temporal` o `baja_definitiva`
- **Gráfico por Semestre**: Número de desertores en cada semestre

## Consultas Útiles

### Ver distribución de estatus
```sql
SELECT estatus_alumno, COUNT(*) as total 
FROM alumnos 
GROUP BY estatus_alumno;
```

### Ver deserción por carrera
```sql
SELECT c.nombre_carrera, 
       COUNT(*) as total,
       SUM(CASE WHEN a.estatus_alumno IN ('baja_temporal', 'baja_definitiva') THEN 1 ELSE 0 END) as desertores
FROM alumnos a
JOIN carreras c ON a.carrera_id = c.id
GROUP BY c.nombre_carrera;
```

### Ver deserción por semestre
```sql
SELECT semestre, 
       COUNT(*) as total,
       SUM(CASE WHEN estatus_alumno IN ('baja_temporal', 'baja_definitiva') THEN 1 ELSE 0 END) as desertores
FROM alumnos
GROUP BY semestre
ORDER BY semestre;
```

## Notas Importantes

1. El estatus se asigna con probabilidades para simular datos realistas
2. Puedes ejecutar el comando `alumnos:update-estatus` múltiples veces
3. La migración solo se ejecuta una vez
4. El seeder crea nuevos datos con estatus ya asignados

## Mejoras Futuras

- [ ] Panel de administración para cambiar estatus manualmente
- [ ] Historial de cambios de estatus
- [ ] Notificaciones automáticas cuando un alumno cambia a deserción
- [ ] Análisis predictivo de deserción usando ML
- [ ] Reportes detallados por período
