# Corrección de Exportación a PDF del Diagrama de Ishikawa

## Problema Original

El diagrama de Ishikawa no se exportaba correctamente a PDF debido a las siguientes limitaciones:

1. **Pseudoelementos CSS (`::before`, `::after`)**: `html2canvas` tiene dificultades para renderizar correctamente los pseudoelementos CSS que se usaban para dibujar las "espinas" del diagrama.
2. **Posicionamiento absoluto complejo**: El layout con múltiples elementos con `position: absolute` dificultaba la captura precisa.
3. **Variables CSS dinámicas**: Las variables HSL podrían no renderizarse correctamente en el canvas.
4. **Falta de configuración específica**: La configuración de `html2canvas` era básica y no optimizada.

## Soluciones Implementadas

### 1. Nuevo Componente con SVG (`IshikawaDiagramSVG`)

Se creó un nuevo componente que utiliza SVG para dibujar las líneas del diagrama:

- **Archivo**: `/apps/nextjs/src/components/charts/ishikawa-diagram-svg.tsx`
- **Ventajas**:
  - SVG se renderiza perfectamente con `html2canvas`
  - Mayor control sobre las líneas y su posicionamiento
  - Mejor calidad en la exportación
  - No depende de pseudoelementos CSS

### 2. Mejoras en la Función de Exportación PDF

Se mejoró la función `handleExportPDF` en `page.tsx`:

```typescript
// Mejoras implementadas:
- Ocultar botones antes de capturar
- Mayor escala (3x) para mejor calidad
- Configuración optimizada de html2canvas
- Orientación automática del PDF según dimensiones
- Márgenes adecuados en el PDF
- Mejor manejo de errores con mensajes descriptivos
- Nombre de archivo con fecha en lugar de timestamp
```

### 3. Mejoras en CSS

Se actualizaron los estilos en `globals.css`:

```css
/* Mejoras agregadas: */
- background-color: white; (explícito para captura)
- will-change: transform; (mejor renderizado)
- backface-visibility: hidden; (suaviza transformaciones)
- print-color-adjust: exact; (preserva colores en exportación)
- Estilos de impresión mejorados
```

### 4. Clases Utility para Exportación

Se agregaron clases de Tailwind para ocultar elementos durante la exportación:

```typescript
className="print:hidden"  // Oculta en impresión/captura
```

## Cómo Usar

### Exportar a PDF

1. Selecciona un **Periodo**, **Materia** y **Grupo**
2. Espera a que se cargue el diagrama de Ishikawa
3. Haz clic en el botón **"Exportar PDF"**
4. El PDF se descargará automáticamente con el formato:
   - `ishikawa-grupo-{ID}-{FECHA}.pdf`

### Características del PDF Exportado

- **Calidad Alta**: Escala 3x para mejor resolución
- **Orientación Automática**: Se ajusta según las dimensiones del diagrama
- **Márgenes Apropiados**: 10mm de margen en todos los lados
- **Colores Preservados**: Mantiene todos los colores del diagrama
- **Sin Botones**: Los botones de acción se ocultan automáticamente

## Configuración Técnica

### Parámetros de html2canvas

```typescript
{
  scale: 3,                    // Alta resolución
  useCORS: true,              // Permite recursos externos
  allowTaint: true,           // Permite imágenes cross-origin
  logging: false,             // Desactiva logs de depuración
  backgroundColor: "#ffffff", // Fondo blanco
  windowWidth: element.scrollWidth,
  windowHeight: element.scrollHeight,
  onclone: (clonedDoc) => {
    // Configuraciones adicionales al clonar
  }
}
```

### Parámetros de jsPDF

```typescript
{
  orientation: "landscape" | "portrait", // Automático
  unit: "mm",
  format: "a4"
}
```

## Alternativas Disponibles

### Componente Original (CSS-based)

Si necesitas usar el componente original basado en CSS:

```typescript
import { IshikawaTemplate } from "@/components/charts/ishikawa-template";
```

### Componente Nuevo (SVG-based) - **Recomendado**

El componente actual en uso:

```typescript
import { IshikawaDiagramSVG } from "@/components/charts/ishikawa-diagram-svg";
```

## Solución de Problemas

### El PDF sale en blanco

1. Verifica que el elemento `#ishikawa-diagram` exista
2. Revisa la consola del navegador para errores
3. Asegúrate de que el diagrama esté completamente cargado

### Las líneas no se ven en el PDF

- El nuevo componente SVG soluciona este problema
- Si usas el componente CSS, cambia a `IshikawaDiagramSVG`

### Calidad baja en el PDF

- La escala está configurada en 3x (alta calidad)
- Puedes aumentar el valor de `scale` si necesitas más calidad
- Ten en cuenta que valores muy altos pueden causar problemas de rendimiento

### El PDF no respeta los colores

- Se agregó `print-color-adjust: exact` en CSS
- Esto fuerza la preservación de colores en la exportación

## Archivos Modificados

1. `/apps/nextjs/src/app/admin/ishikawa/page.tsx` - Función de exportación mejorada
2. `/apps/nextjs/src/components/charts/ishikawa-template.tsx` - Clases print:hidden
3. `/apps/nextjs/src/components/charts/ishikawa-diagram-svg.tsx` - **Nuevo componente**
4. `/apps/nextjs/src/app/globals.css` - Estilos mejorados para exportación

## Próximas Mejoras Sugeridas

1. **Opción de orientación manual**: Permitir al usuario elegir la orientación
2. **Calidad personalizable**: Slider para ajustar la calidad de exportación
3. **Marca de agua**: Agregar logo o marca de agua institucional
4. **Metadatos del PDF**: Incluir autor, fecha, título en las propiedades del PDF
5. **Vista previa**: Mostrar una vista previa antes de descargar
6. **Múltiples formatos**: Permitir exportar también como PNG o JPEG

## Soporte

Si encuentras algún problema con la exportación a PDF, verifica:

1. Navegador compatible (Chrome, Firefox, Edge)
2. Versión actualizada de las dependencias:
   - `html2canvas`: ^1.4.1
   - `jspdf`: ^2.5.1
3. Consola del navegador para mensajes de error

---

**Última actualización**: 7 de noviembre de 2025
**Autor**: GitHub Copilot
