# ModalInhabilitar

Modal para inhabilitar o activar un cliente. Cambia su tema visual según la acción (rojo para inhabilitar, verde para activar).

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `Boolean` | `false` | Visibilidad |
| `cliente` | `Object` | `null` | Datos del cliente (Nombres, Apellidos, Documento, Estado) |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Visibilidad |
| `confirmar` | `{ nuevoEstado, motivo, observaciones }` | Acción confirmada |

## Lógica

- Si `cliente.Estado === true` → modo **Inhabilitar** (tema rojo)
  - Pide motivo obligatorio (select: falta_pago, solicitud, comportamiento, otro)
  - Pide observaciones (textarea opcional)
- Si `cliente.Estado === false` → modo **Activar** (tema verde)
  - Solo confirmación simple, sin campos adicionales

## Uso

```vue
<ModalInhabilitar
  v-model="showInhabilitar"
  :cliente="clienteSeleccionado"
  @confirmar="handleCambiarEstado"
/>
```

```js
function handleCambiarEstado({ nuevoEstado, motivo, observaciones }) {
  // nuevoEstado: false (inhabilitar) o true (activar)
  ClientService.updateClientEstado(clienteSeleccionado.Documento, nuevoEstado)
  // motivo y observaciones solo aplican cuando inhabilitar
}
```
