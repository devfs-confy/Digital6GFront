# 💳 Instrucciones para el Frontend — Integración BREB y WebSocket

## 1. Vista General

<<<<<<< HEAD
El módulo de pagos soporta dos métodos:

- **PlaceToPay**: redirección a la pasarela.
- **BREB**: pago mediante código QR.

Para BREB el backend expone un **WebSocket por `requestId`** y un endpoint para abandonar el pago.

> **Importante:** el código QR **no se guarda en la base de datos** por su peso. Si el usuario cierra el modal, el pago se cancela o se puede generar uno nuevo.
=======
El módulo de pagos ahora soporta dos métodos de pago:

- **PlaceToPay**: redirección a la pasarela actual.
- **BREB**: pago mediante código QR.

Además, existe un **WebSocket temporal por `requestId`** que notifica al frontend cuando el estado de un pago BREB cambia, sin necesidad de webhook del banco.
>>>>>>> 6f54a70 (save change)

---

## 2. Selección de método de pago

<<<<<<< HEAD
Mostrar dos botones:

| Botón | Valor en `MetodoPago` |
|-------|------------------------|
| Pagar con PlaceToPay | `PLACETOPAY` |
| Pagar con BREB (QR) | `BREB` |
=======
Antes de llamar al endpoint de inicio de pago, el frontend debe mostrar **dos botones** para que el usuario elija:

| Botón | Método | Valor en `MetodoPago` |
|-------|--------|------------------------|
| **Pagar con PlaceToPay** | Redirección | `PLACETOPAY` |
| **Pagar con BREB (QR)** | Código QR | `BREB` |
>>>>>>> 6f54a70 (save change)

> Si no se envía `MetodoPago`, el backend usa `PLACETOPAY` por defecto.

---

<<<<<<< HEAD
## 3. Iniciar pago BREB
=======
## 3. Iniciar pago
>>>>>>> 6f54a70 (save change)

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

<<<<<<< HEAD
### Respuesta para BREB

```json
{
=======
### Respuesta para PlaceToPay

```json
{
  "urlPago": "https://checkout.placetopay.com/session/abc123",
  "referencia": "1023456789-1710000000000",
  "requestId": "987654",
  "monto": 309000,
  "moneda": "COP"
}
```

**Acción:** redirigir al usuario a `urlPago`.

### Respuesta para BREB

```json
{
>>>>>>> 6f54a70 (save change)
  "qrImage": "data:image/png;base64,iVBORw0KGgo...",
  "referencia": "1023456789-1710000000000",
  "invoiceId": "10dc5cdb-12e8-4f8d-8c6c-cdc26bc6c167",
  "transactionId": "CINV6O8c1TL0GHMPjHC",
  "invoiceNum": "20260325143000",
<<<<<<< HEAD
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
=======
  "agrmId": "00020624"
}
```

**Acción:** mostrar el código QR al usuario.

---

## 4. Pantalla de pago BREB

Cuando el usuario elija **BREB**, mostrar una pantalla con:

1. **Código QR grande y centrado**
   - Renderizar directamente el campo `qrImage`.
   - Ejemplo: `<img src={qrImage} alt="QR de pago BREB" />`

2. **Botón "Descargar QR"**
   - Convertir el `qrImage` base64 a PNG.
   - Nombre sugerido: `qr-pago-breb-{referencia}.png`.

3. **Instrucciones de pago**
   - *"Escanea el código con tu app bancaria, o descarga la imagen y cárgala desde tu banco."*

4. **Información del pago**
   - Monto.
   - Referencia.
   - Concepto (mensualidad, recarga, etc.).

5. **Botón "Volver a generar QR"**
   - Si el usuario cierra o quiere reintentar, llamar nuevamente al endpoint de inicio de pago.
   - El backend genera un QR nuevo porque **no se guarda en BD**.

---

## 5. WebSocket de notificación por pago BREB

El backend expone un WebSocket en el namespace `/pagos-breb` para notificar cambios de estado de una transacción BREB específica.

### Características

- **Temporal:** el frontend se conecta, espera la notificación y se desconecta.
- **Por `requestId`:** solo recibe notificaciones de la transacción indicada.
- **Autenticado:** requiere JWT.
- **Evento:** `pago-actualizado`.

### Conexión desde el frontend

```javascript
import { io } from 'socket.io-client';

const socket = io('/pagos-breb', {
  auth: { token: '<jwt>' },
  query: { requestId: '20260325143000' }, // invoiceNum devuelto al iniciar pago
});

socket.on('connect', () => {
  console.log('Conectado al socket de BREB');
});

socket.on('pago-actualizado', (data) => {
  console.log('Estado del pago:', data);

  if (data.estado === 'APROBADO') {
    // Continuar con el flujo de éxito
  }

  // El frontend se desconecta al recibir la notificación
  socket.disconnect();
});

socket.on('connect_error', (err) => {
  console.error('Error de conexión:', err.message);
});
```

### Payload del evento
>>>>>>> 6f54a70 (save change)

```json
{
  "IdTransaccion": "1101203361",
  "estado": "APROBADO",
  "estadoBreb": "0",
<<<<<<< HEAD
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
=======
  "respuestaBreb": {
    "Agreement": {
      "AgrmId": "00000104",
      "InvoiceInfo": {
        "InvoiceNum": 180093906,
        "TrnDt": "2026-04-20T16:20:02.000-05:00",
        "PaidCurAmt": 20000,
        "TransactionState": "0",
        "DueDt": "2026-06-10T00:00:00.000-05:00",
        "TotalCurAmt": 20000,
        "BillState": "P"
      }
    }
>>>>>>> 6f54a70 (save change)
  }

<<<<<<< HEAD
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
=======
### Estados posibles

| Estado BREB | Estado mapeado |
|-------------|----------------|
| `0` | `APROBADO` |
| `1` | `RECHAZADO` |
| `2` | `CANCELADO` |
| `3` | `PENDIENTE` |
| `4` | `RECHAZADO` |
| `5` | `PENDIENTE` |
| `6` | `PENDIENTE` |
| `7` | `PENDIENTE` |
| `8` | `ERROR` |

### Nota importante

El scheduler del backend consulta BREB cada 5 minutos. Esto significa que la notificación WebSocket puede tardar hasta 5 minutos en llegar. Si se necesita respuesta más rápida, se puede llamar al endpoint de consulta manual (`GET /breb/payments/detail/status/:referencia`) desde el frontend.

---

## 6. Consulta manual de estado BREB

Si el frontend quiere consultar el estado en cualquier momento:

```http
GET /api/v1/breb/payments/detail/status/:referencia
Authorization: Bearer <jwt>
```

- `:referencia` = referencia interna devuelta al iniciar el pago.

### Respuesta

```json
{
  "success": true,
  "message": "Estado de la transacción BREB",
  "statusCode": 200,
  "data": {
    "IdTransaccion": "1101203361",
    "estado": "APROBADO",
    "estadoBreb": "0",
    "respuestaBreb": {
      "Agreement": {
        "AgrmId": "00000104",
        "InvoiceInfo": {
          "InvoiceNum": 180093906,
          "TransactionState": "0",
          "BillState": "P"
        }
      }
    }
  },
  "timestamp": "2026-10-05T10:00:03.000Z"
>>>>>>> 6f54a70 (save change)
}
```

### Notas

<<<<<<< HEAD
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
=======
## 7. Flujo completo recomendado para BREB

```
Usuario elige "Pagar con BREB"
         ↓
Frontend envía POST /payments/mensualidad/iniciar-pago/:idPersona
         ↓
Backend responde con qrImage, referencia, requestId (invoiceNum)
         ↓
Frontend muestra QR y se conecta al WebSocket /pagos-breb
         ↓
Usuario escanea y paga el QR
         ↓
Scheduler del backend consulta BREB (cada 5 min)
         ↓
Backend emite evento pago-actualizado al frontend
         ↓
Frontend recibe estado APROBADO y continúa el flujo
         ↓
Frontend se desconecta del WebSocket
>>>>>>> 6f54a70 (save change)
```

---

<<<<<<< HEAD
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
=======
## 8. Consideraciones de UI/UX

1. **Deshabilitar el botón de enviar** hasta que el usuario seleccione un método de pago.
2. **Mostrar loader** mientras se genera el QR o se redirige a PlaceToPay.
3. **Para BREB:**
   - Mostrar un timer o mensaje: *"Escanea el QR para completar el pago. Te notificaremos cuando sea aprobado."*
   - Ofrecer opción de descargar el QR.
   - Mostrar botón *"Reintentar"* para generar un QR nuevo.
4. **Manejo de errores:**
   - Si el WebSocket falla, recurrir a consulta manual periódica.
   - Si el pago es rechazado, mostrar mensaje claro y permitir reintentar.

---

## 9. Notas técnicas

- El QR viene como `data:image/png;base64,...`, listo para renderizar o descargar.
- El campo `requestId` para el WebSocket es el `invoiceNum` devuelto al iniciar el pago BREB.
- El `IdTransaccion` es el documento del mensual (persona autorizada que paga).
- El WebSocket requiere autenticación Bearer JWT.
- No es necesario persistir el QR en el frontend; si se pierde, se genera uno nuevo.
>>>>>>> 6f54a70 (save change)
