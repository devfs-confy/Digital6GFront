# 💳 Instrucciones para el Frontend — Integración BREB y WebSocket

## 1. Vista General

El módulo de pagos soporta dos métodos:

- **PlaceToPay**: redirección a la pasarela.
- **BREB**: pago mediante código QR.

Para BREB el backend expone un **WebSocket por `requestId`** y un endpoint para abandonar el pago.

> **Importante:** el código QR **no se guarda en la base de datos** por su peso. Si el usuario cierra el modal, el pago se cancela o se puede generar uno nuevo.

---

## 2. Selección de método de pago

Mostrar dos botones:

| Botón | Valor en `MetodoPago` |
|-------|------------------------|
| Pagar con PlaceToPay | `PLACETOPAY` |
| Pagar con BREB (QR) | `BREB` |

> Si no se envía `MetodoPago`, el backend usa `PLACETOPAY` por defecto.

---

## 3. Iniciar pago BREB

### Endpoint

```http
POST /api/v1/payments/mensualidad/iniciar-pago/:idPersona
Authorization: Bearer <jwt>
Content-Type: application/json
```

### Body de ejemplo

```json
{
  "Email": "cliente@correo.com",
  "CantidadMeses": 1,
  "ModalidadPago": "MENSUALIDAD",
  "Documento": 1023456789,
  "TipoDocumento": "CC",
  "Nombre": "Juan",
  "Apellidos": "Pérez",
  "Sede": 12,
  "MetodoPago": "BREB"
}
```

### Respuesta para BREB

```json
{
  "qrImage": "data:image/png;base64,iVBORw0KGgo...",
  "referencia": "1023456789-1710000000000",
  "invoiceId": "10dc5cdb-12e8-4f8d-8c6c-cdc26bc6c167",
  "transactionId": "CINV6O8c1TL0GHMPjHC",
  "invoiceNum": "20260325143000",
  "agrmId": "00020624",
  "fechaExpiracion": "2026-03-25T14:35:00.000Z"
}
```

**Acción:** mostrar el QR, iniciar timer con `fechaExpiracion` y conectar el WebSocket.

---

## 4. Comportamiento al intentar generar un nuevo QR

Si el usuario ya tenía un pago BREB pendiente (por cierre de modal, recarga de página, etc.), el backend **cancela automáticamente la transacción anterior** y genera un QR nuevo.

No es necesario mostrar advertencia ni pedir confirmación. El frontend puede llamar directamente a `POST /payments/mensualidad/iniciar-pago/:idPersona` y recibirá un QR nuevo.

---

## 5. WebSocket BREB

### Conexión

```javascript
import { io } from 'socket.io-client'

const socket = io('ws://localhost:3000/pagos-breb', {
  auth: { token: '<jwt>' },
  query: { requestId: '20260325143000' }, // invoiceNum
  transports: ['websocket', 'polling'],
})
```

### Eventos

#### `estado-actual`

Se emite inmediatamente al conectar.

```json
{
  "requestId": "20260325143000",
  "estado": "PENDIENTE",
  "referencia": "1023456789-1710000000000",
  "invoiceId": "10dc5cdb-12e8-4f8d-8c6c-cdc26bc6c167",
  "transactionId": "CINV6O8c1TL0GHMPjHC",
  "fechaExpiracion": "2026-03-25T14:35:00.000Z"
}
```

#### `pago-actualizado`

Se emite cuando el estado cambia.

```json
{
  "IdTransaccion": "1101203361",
  "estado": "APROBADO",
  "estadoBreb": "0",
  "respuestaBreb": { ... }
}
```

### Ejemplo completo

```javascript
socket.on('connect', () => {
  console.log('Conectado al socket de BREB')
})

socket.on('estado-actual', (data) => {
  if (data.fechaExpiracion) {
    iniciarCuentaRegresiva(data.fechaExpiracion)
  }

  if (data.estado === 'APROBADO') {
    redirigirAConfirmacion(data.requestId)
  }
})

socket.on('pago-actualizado', (data) => {
  if (data.estado === 'APROBADO') {
    redirigirAConfirmacion(data.requestId ?? props.invoiceNum)
  }
})

socket.on('connect_error', (err) => {
  console.error('Error de conexión:', err.message)
})
```

---

## 6. Cerrar el modal de BREB

Al cerrar el modal (botón cerrar, clic fuera, Escape, etc.), el frontend debe:

1. **Desconectar el WebSocket.**
2. **Llamar al endpoint de abandonar pago.**

```http
POST /api/v1/breb/payments/abandonar/:requestId
Authorization: Bearer <jwt>
```

Esto marca la transacción como `CANCELADO` y permite generar un QR nuevo.

### Ejemplo

```javascript
const cerrar = async () => {
  if (props.invoiceNum && !expirado.value && estadoPago.value !== 'APROBADO') {
    try {
      await PagosService.abandonarPagoBreb(props.invoiceNum)
    } catch (e) {
      console.error('Error al abandonar pago BREB:', e)
    }
  }

  desconectarSocket()
  emit('update:modelValue', false)
}
```

### Notas

- Si la transacción ya fue pagada, el endpoint responde que ya está `APROBADO` y el frontend debe redirigir.
- Si el usuario recarga la página sin cerrar el modal, al intentar generar un nuevo QR el backend cancela automáticamente la anterior.

---

## 7. Expiración del QR

El frontend debe mostrar un timer con `fechaExpiracion`.

- Cuando el timer llegue a cero, cerrar el modal y mostrar un botón **"Generar nuevo QR"**.
- No es necesario llamar a abandonar si el QR expiró, pero no hace daño.

---

## 8. Verificación manual

Si el WebSocket falla, el usuario puede presionar **"Consultar pago"**. El frontend redirige a:

```http
GET /api/v1/payments/mensualidad/verificar/:requestId
Authorization: Bearer <jwt>
```

El backend consulta BREB, actualiza el estado y responde con redirección 302 al frontend:

```http
HTTP/1.1 302 Found
Location: {frontendUrl}/cliente/mensualidad/pago/{requestId}
```

---

## 9. Estados posibles

| Estado | Significado |
|--------|-------------|
| `PENDIENTE` | QR generado, esperando pago |
| `APROBADO` | Pago confirmado |
| `CANCELADO` | QR cancelado por expiración o cierre de modal |
| `RECHAZADO` | Pago rechazado |
| `ERROR` | Error en la pasarela |

---

## 10. Flujo recomendado

```
Usuario elige "Pagar con BREB"
         ↓
Frontend: POST /payments/mensualidad/iniciar-pago/:idPersona
         ↓
Backend: responde qrImage, referencia, invoiceNum, fechaExpiracion
         ↓
Frontend: muestra QR, inicia timer y conecta WebSocket /pagos-breb
         ↓
WebSocket: emite 'estado-actual' con PENDIENTE y fechaExpiracion
         ↓
Usuario escanea y paga
         ↓
Backend: scheduler o webhook detecta APROBADO
         ↓
WebSocket: emite 'pago-actualizado' con APROBADO
         ↓
Frontend: redirige a /payments/mensualidad/verificar/:requestId
         ↓
Backend: genera factura y redirige al frontend de confirmación
```

---

## 11. Notas técnicas

- El QR viene listo para renderizar: `<img :src="qrImage" />`.
- El `requestId` para WebSocket y verificación es el `invoiceNum`.
- El WebSocket requiere JWT en `auth.token`.
- Al cerrar el modal siempre llamar a `POST /breb/payments/abandonar/:requestId` para liberar la transacción.
- Si se pierde la conexión WebSocket, usar el botón **Consultar pago**.
