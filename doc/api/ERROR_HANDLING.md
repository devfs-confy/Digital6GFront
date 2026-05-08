# Manejo de Errores — Digital6G Frontend

## Arquitectura de Errores

El sistema tiene dos patrones de manejo de errores en los servicios API:

| Patrón | Servicios | Cómo consumir |
|:---|:---|:---|
| `handleError` (retornar objeto) | La mayoría de servicios | Verificar `result?.error` |
| `throw error` (lanzar) | `SedesService`, `RolService`, `SedesDisponibilidadService` | Usar `try/catch` |

---

## `handleError(error, context?)`

**Archivo:** `src/utils/error.handler.js`

```js
import axios from "axios";
import { showError } from "@/utils/swal";

export function handleError(error, context = "") {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (context) console.error(`[${context}]`, status, data);
    else console.error("Ocurrió un error:", status, data);

    showError({ status, data });

    return { error: true, status, data };
  } else {
    console.error("Error desconocido", error);
    showError({});
  }
}
```

### Qué hace

1. Detecta si es error de Axios (`axios.isAxiosError`)
2. Extrae `status` y `data` de la respuesta
3. Imprime en `console.error` (con contexto opcional)
4. Muestra toast de error vía `showError()` de SweetAlert2
5. Retorna objeto estructurado: `{ error: true, status, data }`

### Patrón de uso en componentes

```vue
<script setup>
import { ref, onMounted } from "vue"
import ClientService from "@/api/services/client.service"

const clientes = ref([])

onMounted(async () => {
  const result = await ClientService.getAllClients({ sede: 5 })

  if (result?.error) {
    // El toast ya se mostró automáticamente via handleError
    // Aquí puedes lógica adicional si necesitas
    return
  }

  clientes.value = result.data ?? result
})
</script>
```

### Cuándo usar `context`

```js
// En servicios con muchos métodos, ayuda a identificar cuál falló
catch (error) {
  return handleError(error, "MiServicio.getAll")
}
```

---

## `showError({ status, data })`

**Archivo:** `src/utils/swal.js`

Wrapper de SweetAlert2 que muestra un toast de error. Se invoca automáticamente desde `handleError`.

| Código | Mensaje mostrado |
|:---|:---|
| `401` | "No autorizado. Inicia sesión nuevamente." |
| `403` | "No tienes permisos para esta acción." |
| `404` | "Recurso no encontrado." |
| `409` | "Conflicto. El recurso ya existe." |
| `422` | "Datos inválidos. Verifica el formulario." |
| `429` | "Demasiadas peticiones. Espera un momento." |
| `500+` | "Error del servidor. Intenta de nuevo más tarde." |
| Sin respuesta | "Sin conexión con el servidor." |

> **Nota:** Los mensajes exactos dependen de la implementación en `swal.js`. Si el backend envía `data.message`, se muestra ese mensaje.

---

## Servicios que lanzan errores (try/catch obligatorio)

Estos servicios **no usan** `handleError`. Lanzan el error directamente con `throw`:

| Servicio | Por qué |
|:---|:---|
| `SedesService` | CRUD de sedes necesita manejo específico por vista |
| `RolService` | Gestión de permisos requiere try/catch explícito |
| `SedesDisponibilidadService` | Legacy, mismo patrón que SedesService |

### Patrón de uso

```vue
<script setup>
import { ref, onMounted } from "vue"
import SedesService from "@/api/services/sedes.service"
import { showError } from "@/utils/swal"

const sedes = ref([])

onMounted(async () => {
  try {
    sedes.value = await SedesService.getAll()
  } catch (error) {
    showError({
      status: error.response?.status,
      data: error.response?.data,
    })
  }
})
</script>
```

---

## Errores de Autenticación (manejo automático)

Los errores `401` son interceptados automáticamente por el **response interceptor** de Axios (`src/api/axios.js`):

```
Petición → API responde 401
         ↓
¿Es /auth/login o /auth/refresh? → Deja pasar el error (no reintentar)
         ↓
¿Ya hay refresh en progreso? → Encolar petición en pendingQueue
         ↓
isRefreshing = true → auth.refreshAccessToken()
         ↓
¿Refresh exitoso?
  Sí → Actualizar token, reintentar peticiones pendientes
  No → logout(), redirigir a /login
```

### Qué NO hacer

```js
// NO manejar 401 manualmente en componentes
// El interceptor ya lo hace automáticamente
const result = await ClientService.getAllClients()
if (result?.status === 401) {
  // NO necesitas esto — el interceptor se encarga
}
```

---

## Errores de Validación del Backend

Cuando el backend retorna `422` o `400` con detalles de validación:

```json
{
  "message": "El campo Email es obligatorio",
  "errors": {
    "Email": ["El email ya está registrado"],
    "Password": ["Mínimo 8 caracteres"]
  }
}
```

El `handleError` muestra el `message` principal en el toast. Para mostrar errores campo por campo, el componente debe acceder a `result.data.errors`:

```vue
<script setup>
const errores = ref({})

const result = await ClientService.createClient(formData)
if (result?.error && result.data?.errors) {
  errores.value = result.data.errors
}
</script>

<template>
  <input v-model="form.Email" />
  <p v-if="errores.Email" class="text-red-500">{{ errores.Email[0] }}</p>
</template>
```

---

## Resumen Visual

```
Servicio API
    │
    ├── handleError → retorna { error: true, status, data }
    │                   → showError() automático
    │                   → componente verifica result?.error
    │
    └── throw error → componente debe usar try/catch
                        → showError() manual si se desea
```
