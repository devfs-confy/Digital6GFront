# ModalFacturacion

Modal de facturación electrónica con flujo de 3 pasos: pregunta → buscar cliente → crear cliente.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `Boolean` | — | Visibilidad |
| `documentoUsuario` | `String` | `''` | Documento del usuario (prellenado) |
| `nombreUsuario` | `String` | `''` | Nombre del usuario (prellenado) |
| `emailUsuario` | `String` | `''` | Email del usuario (prellenado) |
| `telefonoUsuario` | `String` | `''` | Teléfono del usuario (prellenado) |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Visibilidad |
| `confirmar` | `{ IdentificacionCliente }` | ID del cliente de facturación |

## Flujo de 3 pasos

### Paso 1: Pregunta
- "¿Deseas factura para este pago?"
- **Sí** → Paso 2 (buscar cliente)
- **No** → Emite `confirmar` con `IdentificacionCliente: '222222222222'` (genérico)

### Paso 2: Buscar cliente
- Input de documento con debounce de 900ms
- Busca vía `ClientBillService.GetFacturacionCliente(id)`
- Si encontrado: muestra resumen, botón "Usar este cliente"
- Si no encontrado: ofrece "Crear nuevo cliente de facturación" → Paso 3

### Paso 3: Crear cliente
- Formulario: razón social, tipo persona (Natural/Jurídica), tipo documento (CC/CE/NIT), identificación, email, teléfono, dirección
- Crea vía `ClientBillService.CreateFacturacionCliente(documentoUsuario, dto)`
- Al éxito: emite `confirmar` con el ID del cliente creado

## Uso

```vue
<ModalFacturacion
  v-model="showFactura"
  :documentoUsuario="auth.user?.documento"
  :nombreUsuario="auth.user?.nombres"
  :emailUsuario="auth.user?.email"
  :telefonoUsuario="auth.user?.telefono"
  @confirmar="iniciarPago($event)"
/>
```
