# 💳 Instrucciones para el Frontend — Integración BREB y WebSocket

## 1. Vista General

El módulo de pagos ahora soporta dos métodos de pago:

- **PlaceToPay**: redirección a la pasarela actual.
- **BREB**: pago mediante código QR.

Además, existe un **WebSocket temporal por `requestId`** que notifica al frontend cuando el estado de un pago BREB cambia, sin necesidad de webhook del banco.

---

## 2. Selección de método de pago

Antes de llamar al endpoint de inicio de pago, el frontend debe mostrar **dos botones** para que el usuario elija:

| Botón | Método | Valor en `MetodoPago` |
|-------|--------|------------------------|
| **Pagar con PlaceToPay** | Redirección | `PLACETOPAY` |
| **Pagar con BREB (QR)** | Código QR | `BREB` |

> Si no se envía `MetodoPago`, el backend usa `PLACETOPAY` por defecto.

---

## 3. Iniciar pago

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
  "qrImage": "data:image/png;base64,iVBORw0KGgo...",
  "referencia": "1023456789-1710000000000",
  "invoiceId": "10dc5cdb-12e8-4f8d-8c6c-cdc26bc6c167",
  "transactionId": "CINV6O8c1TL0GHMPjHC",
  "invoiceNum": "20260325143000",
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

```json
{
  "IdTransaccion": "1101203361",
  "estado": "APROBADO",
  "estadoBreb": "0",
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
  }
}
```

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
}
```

---

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
```

---

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
