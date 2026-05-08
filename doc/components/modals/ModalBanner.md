# ModalBanner

Modal tipo carousel para mostrar publicidad/banners con imágenes y enlaces opcionales.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `imagenes` | `Array` | `[]` | Array de URLs o base64 de imágenes |
| `enlaces` | `Array` | `[]` | Array de URLs (click abre en nueva pestaña) |
| `altTexto` | `String` | `'Publicidad'` | Texto alt de las imágenes |
| `autoshow` | `Boolean` | `true` | Mostrar automáticamente al recibir imágenes |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `cerrar` | — | Modal cerrado |

## Métodos expuestos

| Método | Descripción |
|:---|:---|
| `abrir()` | Abrir el modal manualmente |

## Uso

```vue
<script setup>
import { ref } from 'vue'
import ModalBanner from '@/components/modals/ModalBanner.vue'

const bannerRef = ref(null)
const imagenes = ref(['/img/banner1.jpg', '/img/banner2.jpg'])
const enlaces = ref(['https://example.com', ''])
</script>

<template>
  <ModalBanner
    ref="bannerRef"
    :imagenes="imagenes"
    :enlaces="enlaces"
    @cerrar="handleClose"
  />

  <!-- O abrir manualmente -->
  <button @click="bannerRef.abrir()">Ver promoción</button>
</template>
```

## Características

- **Carousel**: navegación prev/next con botones y dots indicadores
- **Skeleton**: shimmer animation mientras carga la imagen
- **Error**: muestra placeholder si la imagen falla
- **Links**: click en imagen con enlace abre en `_blank`
- **Responsive**: 9/16 aspect ratio, max 380px (420px en desktop)
- **Auto-show**: se abre automáticamente al recibir imágenes si `autoshow=true`
