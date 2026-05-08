# Navbar

Barra superior con título de página, info del usuario, botón de notificaciones y dropdown de usuario.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `isOpen` | `Boolean` | — | Estado del sidebar (muestra/oculta botón de abrir) |
| `titulo` | `String` | — | Título de la página actual |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `toggle` | — | Abrir/cerrar sidebar |

## Estructura

```
┌─────────────────────────────────────────────────────────┐
│ [≡] Título de Página          [🔔] [CG ▾]              │
│                                  notif  avatar+dropdown │
└─────────────────────────────────────────────────────────┘
```

- **Izquierda**: botón colapsar sidebar (solo visible si sidebar cerrado) + título
- **Derecha**: email del usuario, nombre, botón notificaciones (`NotificacionesBtn`), avatar con dropdown

## Dropdown

Muestra nombre, tipo de usuario y botón "Cerrar sesión". Se cierra al hacer click fuera (overlay invisible).

## Responsive

| Breakpoint | Comportamiento |
|:---|:---|
| `< 480px` | Título oculto, user-info oculto, avatar más grande |
| `≥ 480px` | Todo visible |
