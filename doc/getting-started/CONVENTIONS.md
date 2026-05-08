# Convenciones de Código — Digital6G Frontend

## Estilo General

- **JavaScript** (no TypeScript)
- **Composition API** con `<script setup>` en todos los componentes
- Indentación: 2 espacios
- Sin punto y coma al final de las sentencias
- Strings con comillas dobles `"`

## Naming Conventions

### Archivos

| Tipo | Convención | Ejemplo |
|:---|:---|:---|
| Componentes Vue | `PascalCase.vue` | `LoginVista.vue`, `Sidebar.vue` |
| Servicios API | `kebab-case.service.js` | `client.service.js`, `rol.service.js` |
| Guards | `kebab-case.js` | `authGuards.js`, `permission.guard.js` |
| Rutas | `kebab-case.js` | `adminRoutes.js`, `clienteMenu.js` |
| Stores | `kebab-case.js` | `auth.js` |
| Composables | `camelCase.js` con prefijo `use` | `useAuth.js` |
| Utilidades | `kebab-case.js` | `error.handler.js`, `formats.date.js` |
| Constantes | `camelCase.js` | `permisions.js` |

### Variables y Funciones

| Tipo | Convención | Ejemplo |
|:---|:---|:---|
| Variables reactivas (`ref`) | `camelCase` | `const clientes = ref([])` |
| Computadas (`computed`) | `camelCase` | `const menuFiltrado = computed(...)` |
| Funciones/métodos | `camelCase` | `async function loadClientes()` |
| Constantes | `UPPER_SNAKE_CASE` | `const PERMS = { ... }` |
| Props | `camelCase` | `defineProps({ titulo: String })` |

### Componentes

- Vistas: sufijo `Vista` para páginas auth (`LoginVista.vue`)
- Layouts: sufijo `Layout` (`AdminLayout.vue`)
- Componentes compartidos: nombre descriptivo (`AdminPageHeader.vue`)
- Modales: prefijo `Modal` (`ModalCongelar.vue`)

## Imports

### Alias `@`

Siempre usar el alias `@` para imports desde `src/`:

```js
// Correcto
import ClientService from "@/api/services/client.service"
import { useAuth } from "@/composables/useAuth"
import { PERMS } from "@/constants/permisions"

// Incorrecto (relative paths largos)
import ClientService from "../../api/services/client.service"
```

### Orden de Imports

1. Vue / librerías externas
2. Servicios API
3. Stores / Composables
4. Componentes
5. Utilidades / Constantes
6. CSS

```vue
<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import ClientService from "@/api/services/client.service"
import { useAuthStore } from "@/stores/auth"
import { useAuth } from "@/composables/useAuth"
import BaseModal from "@/components/modals/BaseModal.vue"
import { showError, showSuccess } from "@/utils/swal"
import { PERMS } from "@/constants/permisions"
</script>
```

## Patrones de Código

### Servicios API (clase singleton)

```js
import { handleError } from "@/utils/error.handler"
import { api } from "../axios"

class MiServicio {
  constructor() {
    this.nameRoute = "v1/mi-recurso"
  }

  async getAll(params) {
    try {
      const response = await api.get(this.nameRoute, { params })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }
}

export default new MiServicio()
```

**Reglas:**
- Un archivo por dominio de negocio
- Exportar como instancia única (`export default new MiServicio()`)
- `this.nameRoute` como propiedad en el constructor
- Usar `handleError` en el `catch` (a menos que se quiera lanzar el error)
- Parámetros opcionales como objeto `params`

### Consumo de Servicios en Componentes

**Patrón con `handleError` (la mayoría):**

```vue
<script setup>
import { ref, onMounted } from "vue"
import ClientService from "@/api/services/client.service"

const clientes = ref([])
const cargando = ref(false)

onMounted(async () => {
  cargando.value = true
  const result = await ClientService.getAllClients({ sede: 5 })

  if (result?.error) {
    console.error(result.data?.message)
    cargando.value = false
    return
  }

  clientes.value = result.data ?? result
  cargando.value = false
})
</script>
```

**Patrón con `try/catch` (servicios que lanzan):**

```vue
<script setup>
import { ref, onMounted } from "vue"
import SedesService from "@/api/services/sedes.service"

const sedes = ref([])

onMounted(async () => {
  try {
    sedes.value = await SedesService.getAll()
  } catch (error) {
    console.error(error.response?.data ?? error.message)
  }
})
</script>
```

> **Regla:** `SedesService`, `RolService` y `SedesDisponibilidadService` lanzan errores directamente. El resto usa `handleError` y retorna `{ error: true, status, data }`.

### Componentes Vue

```vue
<script setup>
import { ref, computed } from "vue"

// Props
const props = defineProps({
  titulo: { type: String, required: true },
  visible: { type: Boolean, default: false },
})

// Emits
const emit = defineEmits(["cerrar", "guardar"])

// Estado
const formulario = ref({ nombre: "", email: "" })

// Computadas
const esValido = computed(() => formulario.value.nombre.length > 0)

// Métodos
function guardar() {
  if (!esValido.value) return
  emit("guardar", formulario.value)
}
</script>

<template>
  <div class="container">
    <h2>{{ titulo }}</h2>
    <button @click="guardar">Guardar</button>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
}
</style>
```

### Rutas

```js
// src/router/routes/miModuloRoutes.js
import MiVista from "@/views/administrador/MiVista.vue"
import { PERMS } from "@/constants/permisions"

export const miModuloRoutes = {
  path: "/admin/mi-modulo",
  component: () => import("@/layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, role: "admin" },
  children: [
    {
      path: "",
      component: MiVista,
      meta: { permission: PERMS.SEDES_VER },
    },
  ],
}
```

### Permisos

**Nunca usar strings literales.** Siempre usar `PERMS`:

```js
// Correcto
meta: { permission: PERMS.USUARIOS_VER }
v-permission="PERMS.USUARIOS_CREAR"

// Incorrecto
meta: { permission: "VER-USUARIOS" }
```

## Tailwind CSS

- Usar clases utilitarias directamente en el template
- Para estilos complejos, usar `@apply` en archivos CSS del directorio `assets/`
- No crear clases CSS custom a menos que sea necesario (animaciones, overrides)

## SweetAlert2

Usar los wrappers de `@/utils/swal`, no llamar a `Swal.fire` directamente:

```js
import { showError, showSuccess, showConfirm, showInfo } from "@/utils/swal"

showError("No se pudo guardar")
showSuccess("Guardado exitoso")
showInfo("Procesando...")

const ok = await showConfirm("¿Está seguro?")
if (ok) { /* proceder */ }
```

## Manejo de Fechas

Usar `@/utils/formats.date.js` para formateo. El proyecto usa **Luxon** con timezone Colombia (`America/Bogota`).

```js
import { formatFecha } from "@/utils/formats.date"

formatFecha("2026-05-08T10:00:00") // "08/05/2026"
```
