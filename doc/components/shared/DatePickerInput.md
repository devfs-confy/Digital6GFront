# DatePickerInput

Selector de fecha custom con calendario desplegable, soporte para rangos min/max y acciones rápidas.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `String` | `''` | Fecha seleccionada en formato `YYYY-MM-DD` |
| `placeholder` | `String` | `'Seleccionar fecha'` | Placeholder del input |
| `min` | `String` | `''` | Fecha mínima selectable (`YYYY-MM-DD`) |
| `max` | `String` | `''` | Fecha máxima selectable (`YYYY-MM-DD`) |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `String` | Nueva fecha seleccionada (`YYYY-MM-DD`) |
| `change` | `String` | Misma fecha (para conveniencia) |

## Uso

```vue
<script setup>
import { ref } from 'vue'
import DatePickerInput from '@/components/shared/DatePickerInput.vue'

const fecha = ref('')
</script>

<template>
  <DatePickerInput v-model="fecha" placeholder="Fecha de inicio" />
  <DatePickerInput v-model="fechaFin" :min="fecha" placeholder="Fecha de fin" />
</template>
```

## Características

- **Calendario custom**: grid de 7 columnas, navegación por mes
- **Click outside**: se cierra al hacer click fuera (usa `@vueuse/core` `onClickOutside`)
- **Acciones rápidas**: botón "Hoy" y "Limpiar"
- **Fechas deshabilitadas**: fuera del rango `min`/`max` se muestran en gris
- **Fecha actual**: resaltada con borde `#299261`
- **Fecha seleccionada**: fondo `#299261`, texto blanco
- **Formato display**: `DD/MM/YYYY`
- **Formato value**: `YYYY-MM-DD` (ISO)
