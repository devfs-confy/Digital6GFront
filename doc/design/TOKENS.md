# Design Tokens — Digital6G Frontend

Paleta de colores, tipografía, iconos y patrones visuales del sistema.

## Colores

### Primarios

| Nombre | Hex | Uso |
|:---|:---|:---|
| Dark Green | `#0D291C` | Headers, botones primarios, sidebar, bordes |
| Green | `#299261` | Acentos, focus rings, badges positivos |
| Lime | `#7FD344` | Indicadores activos, textos sobre fondo oscuro |
| Gray | `#232B3A` | Textos secundarios, botones cancelar |

### Fondo

| Nombre | Hex | Uso |
|:---|:---|:---|
| App Background | `#F0F0F0` | Fondo general de la app |
| Card Background | `#ffffff` | Cards, modales, paneles |
| Sidebar Gradient | `#122e1e → #0D291C → #0a2016` | Gradiente del sidebar |

### Estados

| Estado | Color | Uso |
|:---|:---|:---|
| Éxito | `#299261` / `#7FD344` | Badges, iconos, textos positivos |
| Advertencia | `#f59e0b` / `#b45309` | Alertas, badges "por vencer" |
| Error | `#dc2626` / `#b91c1c` | Botones danger, errores, badges "vencido" |
| Info | `#60a5fa` / `#2563eb` | Notificaciones sistema, badges info |
| Congelado | `#3b82f6` / `#2563eb` | Badge "congelada" |

### Bordes y sombras

| Elemento | Valor |
|:---|:---|
| Borde modal | `2px solid #0D291C` |
| Sombra modal | `0 6px 0 #000` (efecto 3D) |
| Sombra dropdown | `0 8px 30px rgba(13,41,28,0.2), 0 3px 0 #0D291C` |
| Sombra botón activo | `inset 3px 0 0 #7FD344` |

## Tipografía

### Fuente

| Propiedad | Valor |
|:---|:---|
| Familia | `"Funnel Display", sans-serif` |
| Variable settings | `wdth: 100, YTLC: 500` |
| Rendering | `optimizeLegibility`, `-webkit-font-smoothing: antialiased` |

### Tamaños comunes

| Elemento | Tamaño | Peso |
|:---|:---|:---|
| Título de página | `clamp(1rem, 3vw, 1.75rem)` | 700 |
| Título modal | `0.92rem` | 600 |
| Label de campo | `0.62rem` | 600, uppercase, tracking `0.09em` |
| Texto body | `0.78rem` - `0.85rem` | 600 |
| Texto pequeño | `0.6rem` - `0.65rem` | 600-700 |
| Badge | `0.55rem` | 600, uppercase |

## Iconos

### Sistema de iconos

- **Formato**: SVG inline importados con `?raw` (Vite plugin)
- **Color**: `currentColor` por defecto (hereda del padre)
- **Componente**: `<AppIcon name="nombre" :size="18" />`
- **Sidebar**: colorea SVGs dinámicamente (`fill` replacement)

### Convención de nombres

| Patrón | Ejemplo |
|:---|:---|
| Simple | `home`, `search`, `settings` |
| Con variante | `account_box`, `account_box_green` |
| Compuesto | `dashboard_customize`, `arrow_left_alt` |

### Iconos del menú admin

Importados desde `src/assets/img/*.svg?raw` en `adminMenu.js`:
- Dashboard, Clientes, Mensualidades, Sedes, Roles, etc.
- Cada uno con variante normal y `_green`

## Botones

### Patrón 3D

Todos los botones principales usan efecto 3D con `box-shadow`:

```css
/* Botón primario */
background: #0D291C;
color: #7FD344;
border: 2px solid #0D291C;
box-shadow: 0 1px 0 #051510;

/* Hover */
background: #132e21;

/* Active */
transform: translateY(2px);
box-shadow: 0 1px 0 #051510;
```

### Variantes

| Tipo | Fondo | Texto | Borde | Sombra |
|:---|:---|:---|:---|:---|
| Primario | `#0D291C` | `#7FD344` | `#0D291C` | `#051510` |
| Cancelar | `white` | `#232B3A` | `#000` | `#000` |
| Danger | `#b91c1c` | `white` | `#991b1b` | `#7f1d1d` |
| Activate | `#15803d` | `white` | `#14532d` | `#14532d` |

## Modales

### Estilo común

- Borde: `2px solid #0D291C`
- Border-radius: `24px` - `28px`
- Sombra: `0 6px 0 #000` o `0 8px 0 #color`
- Header: fondo `#0D291C`, texto blanco
- Overlay: `bg-black/55` con `backdrop-blur`

### Animaciones

- Entrada: `popIn` — `scale(0.88) → scale(1)` con `cubic-bezier(0.34, 1.5, 0.64, 1)`
- Salida: `popOut` — `scale(1) → scale(0.93)` con `ease-in`
- Duración: 0.2s - 0.32s

## Tailwind

### Configuración

- Versión: `3.4.17`
- Input: `src/assets/style.css`
- Output: `src/assets/main.css`
- Plugin: `flowbite`

### Clases custom

- `.styled-scrollbar` — scrollbar personalizado
- `.customize-table` — variables para vue3-easytable

### Responsive breakpoints

| Breakpoint | Valor | Uso |
|:---|:---|:---|
| `sm` | `640px` | Textos más pequeños |
| `md` | `768px` | Layouts adaptativos |
| `lg` | `1024px` | Sidebar toggle point |
| `max-[600px]` | `600px` | Paginación compacta |
| `max-[480px]` | `480px` | Mobile extremo |
