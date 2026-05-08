# AsideEditar

Panel lateral deslizante (slide-in desde la derecha) para formularios de edición. Teleporta a `body`.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `Boolean` | `false` | Visibilidad |
| `titulo` | `String` | `'Editar'` | Título del panel |
| `subtitulo` | `String` | `'Editando información'` | Subtítulo |
| `labelGuardar` | `String` | `'Guardar cambios'` | Texto del botón guardar |
| `loading` | `Boolean` | `false` | Estado de carga (spinner en botón) |
| `error` | `String` | `''` | Mensaje de error |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Visibilidad |
| `guardar` | — | Click en botón guardar |

## Slots

| Slot | Descripción |
|:---|:---|
| `default` | Contenido del body (formulario, campos, etc.) |

## Estructura

```
┌─────────────────────────────────────┐
│ [Avatar] Título              [✕]    │
│         Subtitulo                   │
├─────────────────────────────────────┤
│                                     │
│  <slot> (contenido del formulario)  │
│                                     │
├─────────────────────────────────────┤
│ [Cancelar]        [Guardar cambios] │
└─────────────────────────────────────┘
```

## Uso

```vue
<script setup>
import { ref } from 'vue'
import AsideEditar from '@/components/aside/AsideEditar.vue'

const showEdit = ref(false)
const loading = ref(false)

async function handleGuardar() {
  loading.value = true
  await ClientService.updateClientByDoc(doc, formData)
  loading.value = false
  showEdit.value = false
}
</script>

<template>
  <AsideEditar
    v-model="showEdit"
    titulo="Editar Cliente"
    subtitulo="Modificando información"
    :loading="loading"
    @guardar="handleGuardar"
  >
    <input v-model="formData.Nombres" placeholder="Nombres" />
    <input v-model="formData.Email" placeholder="Email" />
  </AsideEditar>
</template>
```

## Responsive

- **Desktop**: panel de 440px desde la derecha, `h-dvh`
- **Mobile (< 500px)**: bottom sheet con `92dvh`, bordes redondeados arriba

## Animación

- Entrada: `translateX(100%) → 0` con `cubic-bezier(0.34, 1.1, 0.64, 1)`
- Salida: `0 → translateX(100%)` con `ease-in`
- Overlay: fade in/out con `bg-[rgba(13,41,28,0.45)]` + `backdrop-blur`
