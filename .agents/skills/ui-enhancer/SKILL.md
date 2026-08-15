---
name: ui-enhancer
description: Mejora visual y estética de interfaces de usuario (UI/UX). Usa esta skill siempre que el usuario quiera: mejorar la estética de una app, página o componente; agregar gráficos, animaciones, efectos visuales, transiciones, partículas, gradientes, glassmorphism, neomorfismo, modo oscuro, dashboards con charts, microinteracciones, loaders, skeletons, iconografía personalizada, o cualquier mejora visual a código HTML/CSS/JS o React existente o nuevo. También úsala cuando el usuario diga "hazlo más bonito", "mejora el diseño", "quiero animaciones", "agrega gráficos", "moderniza esto", "quiero un UI más profesional", "embellece", "dale vida", "rediseña", "agrega efectos" o cualquier variante. Si hay código de frontend involucrado y el usuario quiere que se vea mejor, usa esta skill SIN EXCEPCIÓN.
---

# UI Enhancer — Skill de Mejora Visual Completa

Esta skill guía la mejora estética, animación y enriquecimiento visual de cualquier interfaz. El objetivo es transformar UIs ordinarias en experiencias memorables, modernas y pulidas.

---

## Proceso de Trabajo

### 1. Analizar lo que se quiere mejorar
- ¿Es código existente o nuevo? → Si existe, leerlo completo antes de tocar nada.
- ¿Qué tipo de componente/página es? (dashboard, landing, formulario, tarjetas, tabla, etc.)
- ¿Qué pide el usuario? → Lee `references/mejoras-catalogo.md` para encontrar la técnica adecuada.
- ¿Qué framework? → HTML/CSS/JS puro, React, Vue, etc.

### 2. Elegir dirección estética
Antes de escribir código, decidir:
- **Paleta**: ¿Oscura? ¿Clara? ¿Neón? ¿Pastel? ¿Corporate? ¿Glassmorphism?
- **Tipografía**: Nunca usar Inter o Roboto por defecto. Ver `references/tipografias.md`.
- **Animaciones**: ¿Sutiles o dramáticas? ¿CSS o librería?
- **Gráficos**: Si el usuario pide charts, ver `references/graficos.md`.

### 3. Implementar
- **Siempre** producir código completo y funcional, no fragmentos.
- **Nunca** dejar placeholders tipo `/* add styles here */`.
- **Siempre** incluir fallbacks y compatibilidad cross-browser básica.
- Para archivos grandes (>150 líneas), crear archivo y usar `present_files`.

---

## Reglas de Oro de Diseño

```
✅ Usar variables CSS (--color-primary, --spacing-md, etc.)
✅ Mobile-first en todo
✅ Transiciones en hover (0.2s–0.4s ease)
✅ Sombras con transparencia (rgba), no colores sólidos
✅ Bordes redondeados coherentes (una sola escala)
✅ Espaciado basado en múltiplos de 4px o 8px
✅ Estados de carga (skeleton / spinner) cuando hay datos async
✅ Focus visible para accesibilidad
❌ NUNCA gradientes púrpura-azul genéricos como primer recurso
❌ NUNCA font-size < 12px
❌ NUNCA lorem ipsum en demos finales
❌ NUNCA outline: none sin alternativa de focus
```

---

## Técnicas Disponibles por Categoría

Consulta el archivo de referencia correspondiente cuando necesites detalles de implementación:

| Categoría | Cuándo usarla | Archivo de referencia |
|-----------|--------------|----------------------|
| Animaciones CSS | Transiciones, keyframes, scroll-reveal | `references/animaciones.md` |
| Gráficos y Charts | Datos, métricas, dashboards | `references/graficos.md` |
| Efectos Visuales | Glassmorphism, neomorfismo, partículas | `references/efectos.md` |
| Tipografía | Fuentes, escala tipográfica | `references/tipografias.md` |
| Componentes UI | Cards, modales, tablas, forms | `references/componentes.md` |
| Modo Oscuro | Dark mode, sistema de temas | `references/temas.md` |
| Microinteracciones | Botones, feedback, loaders | `references/microinteracciones.md` |
| Layouts Modernos | Grid, Flexbox, layouts rotos | `references/layouts.md` |

---

## Flujo Rápido de Decisión

```
Usuario pide mejora visual
        │
        ├─► ¿Tiene código existente?
        │         ├─ SÍ → Leer código → Identificar problemas → Mejorar respetando estructura
        │         └─ NO → Crear desde cero con máxima calidad estética
        │
        ├─► ¿Pide animaciones?
        │         └─ Leer references/animaciones.md → Elegir técnica → Implementar
        │
        ├─► ¿Pide gráficos/charts?
        │         └─ Leer references/graficos.md → Elegir librería → Implementar con datos reales de ejemplo
        │
        ├─► ¿Pide efecto específico (glass, neon, partículas)?
        │         └─ Leer references/efectos.md → Implementar
        │
        └─► ¿Pide componente UI (card, modal, tabla)?
                  └─ Leer references/componentes.md → Implementar con la máxima calidad
```

---

## Librerías Disponibles en Artifacts

### Para React (.jsx)
```js
import { motion, AnimatePresence } from 'framer-motion'  // ← NO disponible, usar CSS
import * as d3 from 'd3'
import { LineChart, BarChart, PieChart, ... } from 'recharts'
import * as THREE from 'three'
import * as Plotly from 'plotly'
import * as Tone from 'tone'
```

### Para HTML
```html
<!-- Charts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js">
<!-- Animaciones -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js">
<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js">
<!-- Partículas -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js">
<!-- Íconos -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<!-- Animate.css -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
<!-- Lottie (animaciones JSON) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js">
<!-- CountUp -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.6.2/countUp.umd.js">
<!-- Typed.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.1.0/typed.umd.js">
<!-- AOS (scroll animations) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js">
<!-- Swiper (carruseles) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js">
<!-- ApexCharts (charts avanzados) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.44.0/apexcharts.min.js">
```

---

## Checklist Final Antes de Entregar

Antes de dar el código al usuario, verificar:
- [ ] Variables CSS definidas en `:root`
- [ ] Responsive con al menos un breakpoint (768px o 1024px)
- [ ] Hover states en todos los elementos interactivos
- [ ] Colores con suficiente contraste (WCAG AA)
- [ ] Animaciones con `prefers-reduced-motion` respetado si es producción
- [ ] Sin console.error en el código
- [ ] Datos de ejemplo realistas (no "Lorem ipsum" ni "Test test")
- [ ] Código completo (no fragmentos incompletos)

---

## Notas de Comunicación

- Hablar en español si el usuario escribe en español
- Si el usuario da código existente, mencionar qué cambios se hicieron y por qué
- Si se eligió una estética particular (glassmorphism, neón, etc.), mencionarlo brevemente
- No escribir párrafos largos de explicación — el código debe hablar por sí solo
- Si el resultado es un archivo grande, usar `present_files` para entregarlo descargable
