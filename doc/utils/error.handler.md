# error.handler.js

Manejo centralizado de errores Axios. Usado por la mayoría de servicios API.

## Archivo

`src/utils/error.handler.js`

## Función: `handleError(error, context?)`

```js
import { handleError } from "@/utils/error.handler"

// En un servicio:
async getAll(params) {
  try {
    const response = await api.get(this.nameRoute, { params })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}
```

### Qué hace

1. Verifica si es error de Axios (`axios.isAxiosError`)
2. Extrae `status` y `data` de la respuesta
3. Imprime en `console.error` (con `context` opcional para identificar el método)
4. Muestra toast de error vía `showError()` de SweetAlert2
5. Retorna objeto: `{ error: true, status, data }`

### Parámetros

| Parámetro | Tipo | Descripción |
|:---|:---|:---|
| `error` | `Error` | Error capturado del catch |
| `context` | `String` | (Opcional) Identificador del método, ej: `"MiServicio.getAll"` |

### Retorno

```js
// Error de Axios:
{ error: true, status: 404, data: { message: "No encontrado" } }

// Error desconocido:
undefined  // (hace console.error y showError)
```

### Patrón de consumo en componentes

```js
const result = await ClientService.getAllClients({ sede: 5 })

if (result?.error) {
  // El toast ya se mostró automáticamente
  return
}

// Usar result normalmente
clientes.value = result.data ?? result
```
