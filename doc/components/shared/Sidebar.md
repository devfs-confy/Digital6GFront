# Sidebar

Menú lateral de navegación con iconos SVG, animaciones escalonadas y soporte responsive.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `menuItems` | `Array` | — | Array de `{ label, icon, route, permission?, activeFor? }` |
| `isOpen` | `Boolean` | — | Controla visibilidad del sidebar |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `toggle` | — | Abrir/cerrar sidebar (disparado al hacer click en el logo) |
| `select` | — | Reservado para uso futuro |

## Estructura de `menuItems`

```js
{
  label: "Mi<br>Módulo",           // HTML soportado (<br> para saltos)
  icon: svgRawString,              // SVG importado con ?raw
  route: "/admin/mi-modulo",       // Ruta de destino
  permission: PERMS.SEDES_VER,     // (opcional) para filtrado en AdminLayout
  activeFor: ["/admin/mi-modulo"]  // (opcional) rutas que activan el estado activo
}
```

## Uso

```vue
<template>
  <Sidebar :menuItems="adminMenuItems" :isOpen="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />
</template>
```

## Comportamiento

- **Estado activo**: `route.path === item.route` o `item.activeFor.some(r => route.path.startsWith(r))`
- **Iconos**: se colorean dinámicamente — `#0D291C` si activo, `#ffffff` si inactivo
- **Animación**: cada ítem entra con `animationDelay: i * 0.04s` (efecto escalonado)
- **Mobile (< 1024px)**: posición absoluta con overlay, se cierra al navegar
- **Logo**: el elemento `#cerrar` dentro del SVG del logo emite `toggle` al hacer click

## Estilos

- Fondo: gradiente `#122e1e → #0D291C → #0a2016`
- Ítem activo: fondo blanco con borde izquierdo `#7FD344` (3px)
- Scrollbar: thin, color `rgba(255,255,255,0.12)`
- Respeta `prefers-reduced-motion`
