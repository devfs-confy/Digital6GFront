# Notifiteminner

Item individual de notificación para reutilización en listas.

## Props

| Prop | Tipo | Requerido | Descripción |
|:---|:---|:---|:---|
| `notif` | `Object` | Sí | Objeto de notificación (Titulo, Mensaje, Categoria, Tipo, EsLeida) |
| `timeAgo` | `String` | Sí | Texto relativo del tiempo ("hace 5 min") |

## Uso

```vue
<Notifiteminner :notif="notificacion" :timeAgo="timeAgo(notificacion.FechaCreacion)" />
```

## Tipos soportados

| Tipo | Clase | Badge |
|:---|:---|:---|
| `Pago` | `notif-icon-wrap--pago` | `badge-pago` (verde) |
| `Sistema` | `notif-icon-wrap--sistema` | `badge-sistema` (azul) |
| `Alerta` | `notif-icon-wrap--alerta` | `badge-alerta` (ámbar) |

Cada tipo tiene su propio icono SVG y esquema de colores.
