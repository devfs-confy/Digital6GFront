# AdminPageHeader

Header de página para vistas de administración con título centrado, botón volver y slots laterales.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `title` | `String` | **Requerido** | Título de la página |
| `showBack` | `Boolean` | `true` | Mostrar botón "Volver" |

## Slots

| Slot | Descripción |
|:---|:---|
| `left` | Contenido izquierdo (override del botón volver) |
| `right` | Contenido derecho (botones de acción, filtros, etc.) |

## Uso

```vue
<template>
  <AdminPageHeader title="Gestión de Clientes">
    <template #right>
      <button class="btn-primary">Nuevo Cliente</button>
    </template>
  </AdminPageHeader>
</template>
```

```vue
<!-- Sin botón volver -->
<AdminPageHeader title="Dashboard" :showBack="false" />
```

```vue
<!-- Slot izquierdo custom -->
<AdminPageHeader title="Detalle">
  <template #left>
    <button @click="volverCustom">← Atrás</button>
  </template>
</AdminPageHeader>
```

## Estilos

- Fondo blanco, bordes redondeados completos (`rounded-full`)
- Botón volver: fondo `#7FD344`, texto `#232B3A`, sombra 3D
- Responsive: texto más pequeño en mobile, "Volver" oculto en `< 640px` (solo ícono)
