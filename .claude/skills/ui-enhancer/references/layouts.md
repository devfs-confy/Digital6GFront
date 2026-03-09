# Layouts Modernos — Referencia Completa

## CSS Grid Avanzado

### Dashboard Layout
```css
.dashboard {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: 260px 1fr;
  grid-template-rows: 72px 1fr;
  min-height: 100vh;
}
.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
```

### Bento Grid (muy moderno — macOS style)
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 16px;
}
.bento-item { border-radius: 20px; overflow: hidden; }
.bento-item.wide  { grid-column: span 2; }
.bento-item.tall  { grid-row: span 2; }
.bento-item.large { grid-column: span 2; grid-row: span 2; }

/* Responsive */
@media (max-width: 768px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
  .bento-item.wide, .bento-item.large { grid-column: span 2; }
}
```

### Masonry Layout (CSS puro — columns)
```css
.masonry {
  columns: 3 280px;
  column-gap: 16px;
}
.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
}
@media (max-width: 600px) { .masonry { columns: 1; } }
```

### Grid con área destacada
```css
.featured-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
}
.featured-grid .hero { grid-row: span 2; }
```

---

## Flexbox Avanzado

### Sticky footer layout
```css
.page {
  display: flex; flex-direction: column;
  min-height: 100vh;
}
.content { flex: 1; }
.footer  { /* queda al final siempre */ }
```

### Centro perfecto
```css
.center-perfect {
  display: flex; align-items: center; justify-content: center;
  /* Alternativa: */
  display: grid; place-items: center;
}
```

### Navbar responsiva
```css
.nav {
  display: flex; align-items: center;
  gap: clamp(8px, 2vw, 24px);
}
.nav-links { display: flex; gap: 4px; margin-left: auto; }

@media (max-width: 768px) {
  .nav-links {
    position: fixed; inset: 0;
    flex-direction: column; justify-content: center; align-items: center;
    background: rgba(0,0,0,0.95);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }
  .nav-links.open { transform: translateX(0); }
}
```

---

## Responsive Design Patterns

### Container queries (moderno)
```css
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

### Fluid layouts con clamp()
```css
.container {
  width: min(1200px, 100% - 32px);
  margin-inline: auto;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(16px, 3vw, 32px);
}
```

### Breakpoints estándar
```css
/* Mobile first */
.elemento { /* móvil */ }

@media (min-width: 640px)  { /* sm  */ }
@media (min-width: 768px)  { /* md  */ }
@media (min-width: 1024px) { /* lg  */ }
@media (min-width: 1280px) { /* xl  */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Layouts de Hero

### Hero centrado con gradiente
```css
.hero {
  min-height: 100vh;
  display: grid; place-items: center; text-align: center;
  padding: clamp(60px, 10vh, 120px) 24px;
  position: relative;
  overflow: hidden;
}
.hero-content {
  position: relative; z-index: 1;
  max-width: 800px;
}
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(circle at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 60%),
    radial-gradient(circle at 70% 50%, rgba(168,85,247,0.1) 0%, transparent 60%);
}
```

### Hero split (texto + imagen)
```css
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  min-height: 100vh;
  padding: 0 clamp(24px, 5vw, 80px);
}
@media (max-width: 768px) {
  .hero-split { grid-template-columns: 1fr; text-align: center; }
}
```

---

## Sticky / Scroll Layouts

### Sticky sidebar con contenido scrolleable
```css
.two-col {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  align-items: start;
}
.sticky-sidebar {
  position: sticky;
  top: 100px; /* navbar height + offset */
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
```

### Scroll snapping (carrusel / secciones)
```css
.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.scroll-container::-webkit-scrollbar { display: none; }
.scroll-item {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 100%;
}
```

### Full-page sections
```css
html { scroll-snap-type: y mandatory; }
.section {
  min-height: 100vh;
  scroll-snap-align: start;
  display: grid; place-items: center;
}
```

---

## Spacing System

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}
```

---

## Print Layout

```css
@media print {
  .sidebar, .navbar, .btn, .no-print { display: none !important; }
  body { background: white; color: black; font-size: 12pt; }
  .main-content { width: 100%; margin: 0; padding: 0; }
  a::after { content: " (" attr(href) ")"; }
  h1, h2, h3 { page-break-after: avoid; }
  img { max-width: 100% !important; }
}
```
