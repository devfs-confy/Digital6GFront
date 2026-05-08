# AppIcon

Componente que carga y renderiza iconos SVG dinámicamente desde `src/assets/img/`.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `name` | `String` | **Requerido** | Nombre del archivo SVG (sin extensión) |
| `size` | `String\|Number` | `18` | Tamaño en píxeles (ancho y alto) |

## Uso

```vue
<template>
  <AppIcon name="dashboard_customize" :size="24" />
  <AppIcon name="account_circle" :size="16" class="text-green-600" />
</template>
```

## Cómo funciona

1. Importa dinámicamente `@/assets/img/{name}.svg?raw`
2. Reemplaza `fill` y `stroke` hardcodeados con `currentColor`
3. Renderiza el SVG inline con el tamaño especificado
4. Si el icono no existe, muestra warning en consola y renderiza nada

## Iconos disponibles

Ver lista completa al final de `AppIcon.vue`. Algunos ejemplos:

| Nombre | Uso |
|:---|:---|
| `dashboard_customize` | Dashboard |
| `account_circle` | Usuarios |
| `car-side` | Vehículos |
| `calendar_month` | Calendario |
| `payment_card` | Pagos |
| `receipt_long` | Facturas |
| `notifications` | Notificaciones |
| `arrow_left_alt` | Flecha izquierda |
| `two_wheeler` | Moto |
| `contact_support` | PQRS / Soporte |

> **Convención:** Los iconos con sufijo `_green` tienen variantes verdes predefinidas.

## Estilización

El SVG hereda `color` del padre vía `currentColor`:

```vue
<AppIcon name="home" class="text-red-500" />  <!-- icono rojo -->
<AppIcon name="home" class="text-[#7FD344]" /> <!-- icono verde -->
```
