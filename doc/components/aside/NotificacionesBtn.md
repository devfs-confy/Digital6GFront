# NotificacionesBtn

Botón de campana con panel dropdown de notificaciones, tabs por tipo, badge de no leídas y modal de detalle.

## Uso

```vue
<template>
  <NotificacionesBtn />
</template>
```

Se usa dentro de `Navbar.vue` automáticamente.

## Características

- **Badge**: muestra cantidad de no leídas (máx `9+`)
- **Tabs**: Todas, Pagos, Sistema, PQRS
- **Secciones**: "Nuevas" (no leídas) primero, luego "Anteriores" (leídas)
- **Click en notificación**: marca como leída, abre modal de detalle
- **Marcar todo leído**: botón en header del panel
- **Auto-fetch**: carga notificaciones al abrir el panel
- **Click outside**: cierra el panel

## Tipos de notificación

| Tipo | Color | Icono |
|:---|:---|:---|
| `Pago` | Verde `#7FD344` | Tarjeta de crédito |
| `Alerta` | Ámbar `#f59e0b` | Triángulo de advertencia |
| `Sistema` | Azul `#60a5fa` | Info circular |
| `RESPUESTA_PQRS` | — | Se filtra en tab PQRS |

## Time formatting

Usa `Luxon` con timezone `America/Bogota`:
- `< 60s`: "hace un momento"
- `< 1h`: "hace X min"
- `< 24h`: "hace X h"
- `> 24h`: "hace X d"

## Responsive

- **Desktop**: panel dropdown posicionado arriba a la derecha
- **Mobile (< 600px)**: bottom sheet que sube desde abajo (`85dvh` max)

## API usada

- `NotificacionesService.GetNotifiaciones()` — lista todas
- `NotificacionesService.GetNotifiacionesById(id)` — marca como leída
