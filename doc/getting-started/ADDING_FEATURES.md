# Agregar Features — Digital6G Frontend

Guías paso a paso para agregar nuevos elementos al proyecto.

---

## Agregar una Nueva Ruta

### 1. Crear la vista

```
src/views/administrador/MiNuevaVista.vue
```

```vue
<script setup>
import { ref, onMounted } from "vue"
import { showSuccess } from "@/utils/swal"

const datos = ref([])

onMounted(async () => {
  // Cargar datos
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Mi Nueva Vista</h1>
  </div>
</template>
```

### 2. Definir la ruta

En `src/router/routes/adminRoutes.js` (o `clienteRoutes.js`):

```js
import MiNuevaVista from "@/views/administrador/MiNuevaVista.vue"

// Dentro del array children de adminRoutes:
{
  path: "mi-nueva-vista",
  component: MiNuevaVista,
  meta: { permission: PERMS.SEDES_VER },  // o el permiso correspondiente
}
```

Si es un módulo grande con sub-rutas, crear un archivo separado:

```js
// src/router/routes/miModuloRoutes.js
import MiNuevaVista from "@/views/administrador/MiNuevaVista.vue"
import { PERMS } from "@/constants/permisions"

export const miModuloRoutes = {
  path: "/admin/mi-modulo",
  component: () => import("@/layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, role: "admin" },
  children: [
    {
      path: "",
      component: MiNuevaVista,
      meta: { permission: PERMS.SEDES_VER },
    },
  ],
}
```

Y registrarlo en `src/router/index.js`:

```js
import { miModuloRoutes } from "./routes/miModuloRoutes"

const router = createRouter({
  routes: [
    ...authRoutes,
    clienteRoutes,
    adminRoutes,
    miModuloRoutes,       // <-- agregar aquí
    { path: "/", redirect: "/login" },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
  ],
})
```

### 3. Agregar al menú del sidebar

En `src/router/routes/adminMenu.js`:

```js
import iconoSvg from "@/assets/img/mi-icono.svg?raw"

export const adminMenuItems = [
  // ... items existentes
  {
    label: "Mi<br>Módulo",
    icon: iconoSvg,
    route: "/admin/mi-nueva-vista",
    permission: PERMS.SEDES_VER,
    activeFor: ["/admin/mi-nueva-vista"],
  },
]
```

---

## Agregar un Nuevo Permiso

### 1. Definir la constante

En `src/constants/permisions.js`:

```js
export const PERMS = {
  // ... existentes
  MI_MODULO_VER:    "VER-MI-MODULO",
  MI_MODULO_CREAR:  "CREAR-MI-MODULO",
  MI_MODULO_EDITAR: "EDITAR-MI-MODULO",
}
```

> **Formato:** `ACCION-MODULO` en MAYÚSCULAS. Debe coincidir exactamente con lo que envía el backend en el JWT.

### 2. Usar en la ruta

```js
{
  path: "mi-nueva-vista",
  component: MiNuevaVista,
  meta: { permission: PERMS.MI_MODULO_VER },
}
```

### 3. Usar en el template

```vue
<!-- Directiva: elimina el elemento si no hay permiso -->
<button v-permission="PERMS.MI_MODULO_CREAR">Crear</button>

<!-- Composable: lógica condicional -->
<script setup>
import { useAuth } from "@/composables/useAuth"
import { PERMS } from "@/constants/permisions"

const { hasPermission } = useAuth()
</script>

<template>
  <div v-if="hasPermission(PERMS.MI_MODULO_EDITAR)">
    <!-- contenido solo visible con permiso -->
  </div>
</template>
```

### 4. Agregar al menú

```js
{
  label: "Mi<br>Módulo",
  icon: miIcono,
  route: "/admin/mi-nueva-vista",
  permission: PERMS.MI_MODULO_VER,  // <-- solo aparece si tiene este permiso
  activeFor: ["/admin/mi-nueva-vista"],
}
```

---

## Agregar un Servicio API

### 1. Crear el archivo

```
src/api/services/miRecurso.service.js
```

```js
import { handleError } from "@/utils/error.handler"
import { api } from "../axios"

class MiRecursoService {
  constructor() {
    this.nameRoute = "v1/mi-recurso"
  }

  // GET /v1/mi-recurso
  async getAll(params) {
    try {
      const response = await api.get(this.nameRoute, { params })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }

  // GET /v1/mi-recurso/{id}
  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }

  // POST /v1/mi-recurso
  async create(dto) {
    try {
      const response = await api.post(this.nameRoute, dto)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }

  // PUT /v1/mi-recurso/{id}
  async update(id, dto) {
    try {
      const response = await api.put(`${this.nameRoute}/${id}`, dto)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }

}

export default new MiRecursoService()
```

### 2. Usar en un componente

```vue
<script setup>
import { ref, onMounted } from "vue"
import MiRecursoService from "@/api/services/miRecurso.service"

const items = ref([])

onMounted(async () => {
  const result = await MiRecursoService.getAll()
  if (result?.error) return
  items.value = result.data ?? result
})
</script>
```

### ¿Cuándo lanzar errores vs usar `handleError`?

| Patrón | Cuándo usar |
|:---|:---|
| `handleError` (retornar `{ error: true }`) | La mayoría de servicios. El componente decide cómo manejar el error. |
| `throw error` (lanzar) | Cuando el error es crítico y el componente debe usar `try/catch`. Usado por `SedesService`, `RolService`. |

---

## Agregar un Componente Reutilizable

### 1. Crear el archivo

```
src/components/shared/MiComponente.vue
```

```vue
<script setup>
const props = defineProps({
  titulo: { type: String, required: true },
  size:   { type: String, default: "md", validator: (v) => ["sm", "md", "lg"].includes(v) },
})

const emit = defineEmits(["click", "close"])
</script>

<template>
  <div :class="['mi-componente', size]">
    <h3>{{ titulo }}</h3>
    <slot></slot>
    <button @click="emit('close')">Cerrar</button>
  </div>
</template>

<style scoped>
.mi-componente { /* ... */ }
</style>
```

### 2. Registrar globalmente (opcional)

Si se usa en muchas vistas, registrar en `src/main.js`:

```js
import MiComponente from "@/components/shared/MiComponente.vue"

app.component("MiComponente", MiComponente)
```

Luego se puede usar en cualquier template sin import:

```vue
<template>
  <MiComponente titulo="Hola" @close="cerrar">
    <p>Contenido del slot</p>
  </MiComponente>
</template>
```

---

## Agregar un Composable

```js
// src/composables/useMiFeature.js
import { ref, computed } from "vue"

export function useMiFeature() {
  const datos = ref([])
  const cargando = ref(false)

  const total = computed(() => datos.value.length)

  async function cargar() {
    cargando.value = true
    // lógica...
    cargando.value = false
  }

  return { datos, cargando, total, cargar }
}
```

Uso:

```vue
<script setup>
import { useMiFeature } from "@/composables/useMiFeature"

const { datos, cargando, total, cargar } = useMiFeature()
</script>
```
