# swal.js

Wrappers de SweetAlert2 con el diseño visual del sistema.

## Archivo

`src/utils/swal.js`

## Funciones

### `showError({ status, data }?)`

Muestra un toast de error. Usa `mensajePorStatus` para mensajes por código HTTP.

```js
import { showError } from "@/utils/swal"

// Con status HTTP:
showError({ status: 404 })
// → "El recurso solicitado no fue encontrado."

// Con data del backend:
showError({ status: 400, data: { message: "El email ya está registrado" } })
// → "El email ya está registrado"

// Con array de errores:
showError({ status: 422, data: { message: ["Email inválido", "Password muy corto"] } })
// → "Email inválido\nPassword muy corto"
```

### Mensajes por status

| Status | Mensaje |
|:---|:---|
| `400` | "Los datos enviados no son válidos." |
| `401` | "No estás autorizado. Inicia sesión nuevamente." |
| `403` | "No tienes permisos para realizar esta acción." |
| `404` | "El recurso solicitado no fue encontrado." |
| `409` | "Ya existe un registro con estos datos." |
| `422` | "Los datos enviados no pudieron ser procesados." |
| `500` | "Error interno del servidor. Intenta más tarde." |
| `503` | "Servicio no disponible. Intenta más tarde." |
| otro | "Ocurrió un error inesperado." |

---

### `showSuccess(title?, text?)`

Toast de éxito con auto-cierre a los 2.2 segundos.

```js
await showSuccess("¡Guardado!", "Los cambios se aplicaron correctamente.")
await showSuccess("¡Listo!")
```

---

### `showConfirm(options?)`

Diálogo de confirmación con botones Confirmar/Cancelar.

```js
const { isConfirmed } = await showConfirm({
  title: "¿Eliminar este registro?",
  text: "Esta acción no se puede deshacer.",
  confirmText: "Eliminar",
  cancelText: "Cancelar",
  icon: "warning",  // "warning" | "info" | "error" | "success" | "question"
})

if (isConfirmed) {
  // proceder
}
```

**Defaults:**
- `title`: "¿Estás seguro?"
- `confirmText`: "Confirmar"
- `cancelText`: "Cancelar"
- `icon`: "warning"
- `reverseButtons`: true (cancelar a la izquierda)

---

### `showInfo(title?, text?)`

Diálogo informativo.

```js
await showInfo("Información", "El proceso se completó en segundo plano.")
```

---

### `SwalBase` (default export)

Instancia mixin de SweetAlert2 con las clases custom del sistema. Úsalo para dialogs custom:

```js
import SwalBase from "@/utils/swal"

await SwalBase.fire({
  icon: "question",
  title: "Pregunta custom",
  html: "<p>HTML personalizado</p>",
  showCancelButton: true,
})
```

## Estilos

Los estilos se definen en `src/assets/swal.css`:
- `.swal-popup` — popup con bordes redondeados
- `.swal-title` — título con fuente del sistema
- `.swal-btn-confirm` — botón confirmar (`#0D291C` / `#7FD344`)
- `.swal-btn-cancel` — botón cancelar (blanco / negro)
- `.swal-show` / `.swal-hide` — animaciones de entrada/salida
