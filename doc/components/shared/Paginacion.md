# Paginacion

Componente de paginación con navegación por páginas y selector de filas por página.

## Props

| Prop | Tipo | Requerido | Descripción |
|:---|:---|:---|:---|
| `paginaActual` | `Number` | Sí | Página actual |
| `totalPaginas` | `Number` | Sí | Total de páginas |
| `totalRegistros` | `Number` | Sí | Total de registros |
| `limit` | `Number` | Sí | Filas por página actual |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `pagina` | `Number` | Nueva página solicitada |
| `limit` | `Number` | Nuevo límite de filas (10, 20, 50) |

## Uso

```vue
<script setup>
const page = ref(1)
const limit = ref(10)

async function loadPage(p) {
  page.value = p
  const result = await ClientService.getAllClients({ page: p, limit: limit.value })
  // ...
}
</script>

<template>
  <Paginacion
    :paginaActual="page"
    :totalPaginas="totalPages"
    :totalRegistros="totalRecords"
    :limit="limit"
    @pagina="loadPage"
    @limit="limit = $event; loadPage(1)"
  />
</template>
```

## Lógica de páginas visibles

- Si `totalPaginas <= 5`: muestra todas
- Si `> 5`: muestra ventana de 5 páginas centrada en la actual

## Responsive

- `< 600px`: texto "Pág. X de Y" oculto, se muestra `X / Y` compacto
- Selector de filas siempre visible
