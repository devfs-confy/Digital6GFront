# BaseModal

Modal genérico reutilizable con header, body con scroll, footer con botones y estados de carga.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `Boolean` | `false` | Controla visibilidad (v-model) |
| `title` | `String` | `''` | Título del modal |
| `subtitle` | `String` | `''` | Subtítulo opcional |
| `closeOnBackdrop` | `Boolean` | `false` | Cerrar al hacer click en el overlay |
| `size` | `String` | `'md'` | Tamaño: `xs`, `sm`, `md`, `lg`, `xl` |
| `maxHeightClass` | `String` | `'max-h-[calc(100vh-32px)]'` | Altura máxima |
| `bodyClass` | `String` | `''` | Clases CSS adicionales para el body |
| `showFooter` | `Boolean` | `true` | Mostrar footer |
| `showCancel` | `Boolean` | `true` | Mostrar botón cancelar |
| `showConfirm` | `Boolean` | `true` | Mostrar botón confirmar |
| `cancelLabel` | `String` | `'Cancelar'` | Texto del botón cancelar |
| `confirmLabel` | `String` | `'Aceptar'` | Texto del botón confirmar |
| `loadingLabel` | `String` | `'Cargando...'` | Texto cuando `loading=true` |
| `confirmDisabled` | `Boolean` | `false` | Deshabilitar botón confirmar |
| `loading` | `Boolean` | `false` | Mostrar spinner en botón confirmar |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Cambiar visibilidad |
| `confirm` | — | Click en botón confirmar |

## Slots

| Slot | Descripción |
|:---|:---|
| `default` | Contenido del body |
| `icon` | Icono/avatar del header (default: ícono info) |
| `footer` | Footer custom (override completo) |

## Tamaños

| Size | Max Width |
|:---|:---|
| `xs` | 320px |
| `sm` | 380px |
| `md` | 420px |
| `lg` | 520px |
| `xl` | 660px |

## Uso

```vue
<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'

const show = ref(false)
const loading = ref(false)

async function handleConfirm() {
  loading.value = true
  await someAsyncOperation()
  loading.value = false
  show.value = false
}
</script>

<template>
  <BaseModal
    v-model="show"
    title="Confirmar acción"
    subtitle="¿Estás seguro?"
    size="sm"
    :loading="loading"
    @confirm="handleConfirm"
  >
    <p class="p-5">¿Deseas continuar con esta acción?</p>
  </BaseModal>
</template>
```

```vue
<!-- Con slot icon custom -->
<BaseModal v-model="show" title="Eliminar">
  <template #icon>
    <div class="w-9 h-9 rounded-xl bg-red-500">
      <svg>...</svg>
    </div>
  </template>
  <p>¿Eliminar este registro?</p>
</BaseModal>
```

## Estilos

- Overlay: `bg-black/55` con `backdrop-blur-sm`
- Borde: `2px solid #0D291C`, sombra `0 6px 0 #000`
- Header: fondo `#0D291C`, texto blanco
- Botón confirmar: fondo `#0D291C`, texto `#7FD344`
- Botón cancelar: fondo blanco, borde negro
- Animación: fade in/out (0.2s)
