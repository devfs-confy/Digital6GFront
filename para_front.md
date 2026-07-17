# 📧 Instrucciones para el Frontend — Módulo Correos Informativos

## 1. Vista General

El módulo **Correos Informativos** permite al administrador enviar comunicaciones masivas por email a los clientes autorizados de uno o varios estacionamientos.

El envío es **asíncrono y masivo**: el correo se encola en BullMQ y se procesa en segundo plano usando **BCC** (copia oculta) para proteger la privacidad de los destinatarios. Ningún cliente ve a quién más se le envió el correo.

Los correos se envían **solo a personas autorizadas que tengan email y cuya autorización no esté vencida ni venza en los próximos 3 días** (es decir, `FechaFin >= hoy + 4 días`).

---

## 2. Endpoint disponible

### 2.1 Crear y enviar correo informativo
- **Método**: `POST`
- **URL**: `/v1/correos-info`
- **Auth**: Bearer token + permiso `ENVIAR-CORREOS`
- **Content-Type**: `application/json`

**Body** (`CreateCorreoInfoDto`):
```json
{
  "Asunto": "Novedades importantes del parqueadero",
  "Mensaje": "<p>Estimado cliente, queremos informarle que...</p>",
  "IdEstacionamientos": ["1", "2", "3"]
}
```

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Correo info creado y encolado para envío masivo",
  "statusCode": 200,
  "data": {
    "IdCorreo": "12345",
    "destinatarios": 42
  }
}
```

**Respuesta cuando no hay destinatarios**:
```json
{
  "success": true,
  "message": "Correo info creado, pero no se encontraron personas autorizadas con email en los estacionamientos seleccionados",
  "statusCode": 200,
  "data": {
    "IdCorreo": "12345",
    "destinatarios": 0
  }
}
```

---

## 3. DTO: `CreateCorreoInfoDto`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `Asunto` | `string` | Sí | Asunto del correo que verán los destinatarios |
| `Mensaje` | `string` | Sí | Cuerpo del correo. Puede ser **HTML** o texto plano. Si es HTML, el backend lo renderiza dentro del template visual de Confy |
| `IdEstacionamientos` | `string[]` | Sí (mínimo 1) | IDs de los estacionamientos a los que se enviará el correo. Cada ID es numérico enviado como string |

> **Nota**: `IdEstacionamientos` debe contener al menos 1 elemento (`ArrayMinSize(1)`).

---

## 4. Interfaz de datos (para TypeScript)

```typescript
export interface CreateCorreoInfoDto {
  Asunto: string;
  Mensaje: string;
  IdEstacionamientos: string[];
}

export interface CorreoInfoResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    IdCorreo: string;
    destinatarios: number;
  };
}
```

> **Nota**: `IdCorreo` es `bigint` en el backend. En el frontend se puede manejar como `string` para evitar problemas de serialización JSON.

---

## 5. Consideraciones de UI/UX sugeridas

### 5.1 Pantalla principal
Diseñar una vista de **"Enviar correo informativo"** con los siguientes elementos:

1. **Select multiopción de estacionamientos** (requerido):
   - Debe permitir seleccionar **uno o más** estacionamientos.
   - Obtener la lista de estacionamientos desde el endpoint existente del sistema (ej: `/v1/estacionamientos` o similar, dependiendo de la disponibilidad en el proyecto).
   - Mostrar el nombre del estacionamiento y usar su `IdEstacionamiento` como valor.
   - Validar que al menos 1 estacionamiento esté seleccionado antes de enviar.

2. **Campo de Asunto** (input text, requerido):
   - Longitud máxima sugerida: ~100 caracteres.
   - Placeholder: `"Ej: Cambio de horarios de operación"`.

3. **Editor de Mensaje** (textarea o editor WYSIWYG, requerido):
   - Idealmente un editor HTML básico (como Quill, TinyMCE, o un textarea con preview HTML).
   - El backend acepta HTML y lo inserta dentro del template visual de Confy.
   - Mostrar una vista previa del correo final si es posible.
   - Placeholder: `"Escriba el mensaje para sus clientes..."`.

4. **Botón de enviar**:
   - Texto: `"Enviar correo"`.
   - Deshabilitado mientras el formulario sea inválido o se esté procesando.
   - Mostrar spinner/loading durante la petición.

5. **Indicador de destinatarios estimados (opcional pero recomendado)**:
   - Si el backend expone un endpoint para consultar cuántas personas autorizadas activas tienen email por estacionamiento, mostrar un conteo previo.
   - Si no existe, al menos mostrar la cantidad de estacionamientos seleccionados.

### 5.2 Feedback al usuario
- **Éxito con destinatarios**: Mostrar toast/notificación: *"Correo encolado exitosamente. Se enviará a {N} destinatarios."*
- **Éxito sin destinatarios**: Mostrar advertencia: *"Correo creado, pero no se encontraron personas autorizadas con email en los estacionamientos seleccionados."*
- **Error de validación**: Si se envían estacionamientos inexistentes, el backend responde `400`: *"Uno o más estacionamientos no existen"*.
- **Sin permisos**: El backend responde `403` si el usuario no tiene el permiso `ENVIAR-CORREOS`.

### 5.3 Vista previa del correo (recomendada)
- Antes de enviar, ofrecer un botón **"Vista previa"** que muestre un modal con el template visual de Confy:
  - Banner superior verde con icono 📢 y el asunto.
  - Bloque verde claro listando los estacionamientos seleccionados.
  - Área de contenido con el HTML del mensaje.
  - Footer con branding de Confy.

---

## 6. Flujo de la pantalla

```
Administrador accede a "Correos Informativos"
         ↓
Selecciona 1 o más estacionamientos (multi-select)
         ↓
Escribe el Asunto
         ↓
Escribe el Mensaje (HTML o texto)
         ↓
[Opcional] Clic en "Vista previa" para ver cómo quedará
         ↓
Clic en "Enviar correo"
         ↓
Frontend envía POST /v1/correos-info
         ↓
Backend valida estacionamientos, crea registro, encola envío masivo
         ↓
Backend responde con { IdCorreo, destinatarios: N }
         ↓
Frontend muestra notificación de éxito con cantidad de destinatarios
         ↓
Los correos se envían en segundo plano (BCC, lotes de 50)
```

---

## 7. Restricciones importantes

- **Los emails se envían solo a personas autorizadas que cumplan**:
  - Tener `Email` registrado (no nulo).
  - Tener `Estado = true`.
  - `FechaFin >= hoy + 4 días` (excluye vencidos y los que vencen en 3 días o menos).

- **Emails duplicados se deduplican**: si una persona tiene autorizaciones en múltiples estacionamientos seleccionados, solo recibe **un correo**.

- **Privacidad**: los destinatarios se envían por BCC. Nadie ve los demás emails.

- **Permiso requerido**: `ENVIAR-CORREOS`.

---

## 8. Advertencias técnicas para el frontend

- El campo `Mensaje` acepta HTML. El frontend debe sanitizar la entrada del usuario antes de mostrarla en vista previa para evitar XSS.
- Si se usa un editor WYSIWYG, asegurarse de que las etiquetas HTML generadas sean compatibles con emails (evitar scripts, iframes, etc.).
- El backend no devuelve la lista de emails a los que se envió por privacidad; solo retorna el conteo (`destinatarios`).

---

# 💳 Instrucciones para el Frontend — Módulo Pagos (Opciones de Pago)

## A. Vista General

El módulo de pagos permite al cliente seleccionar entre distintas **opciones de pago** para su mensualidad. Las opciones disponibles dependen de:
- La **autorización** que tenga el cliente.
- Las **reglas de modalidad** configuradas por el estacionamiento (`T_ReglasModalidadPagos`).
- Si el cliente tiene **cobro de tarjeta** habilitado (`CobroTarjeta`).

Ahora, cuando un cliente tiene cobro de tarjeta habilitado, el backend devuelve **dos variantes por cada modalidad**:
- Una **con tarjeta** (incluye el valor de la tarjeta física/pasarela en el total).
- Una **sin tarjeta** (solo paga la mensualidad/quincena).

---

## B. Endpoints

### B.1 Obtener opciones de pago
- **Método**: `GET`
- **URL**: `/v1/payments/mensualidad/:idPersona/opciones-pago`
- **Auth**: Bearer token
- **Path params**:
  - `idPersona` (number): ID de la persona autorizada.
- **Query params**:
  - `sede` (number, **requerido**): ID del estacionamiento.
  - `meses` (number, opcional, default `1`): Cantidad de meses (1 o 2).

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Opciones de pago",
  "statusCode": 200,
  "data": [
    {
      "modalidad": "MENSUALIDAD",
      "nombre": "Mensualidad + Tarjeta",
      "cantidadMeses": 1,
      "valorUnitario": 129310,
      "incluyeTarjeta": true,
      "desglose": {
        "subtotal": 137931,
        "iva": 22069,
        "total": 160000
      },
      "tarjeta": {
        "subtotal": 8621,
        "iva": 1379,
        "total": 10000
      },
      "totalFinal": 160000
    },
    {
      "modalidad": "MENSUALIDAD",
      "nombre": "Mensualidad (sin tarjeta)",
      "cantidadMeses": 1,
      "valorUnitario": 129310,
      "incluyeTarjeta": false,
      "desglose": {
        "subtotal": 129310,
        "iva": 20690,
        "total": 150000
      },
      "totalFinal": 150000
    },
    {
      "modalidad": "QUINCENA",
      "nombre": "Quincena + Tarjeta",
      "cantidadMeses": 1,
      "valorUnitario": 64655,
      "incluyeTarjeta": true,
      "desglose": { "subtotal": 73276, "iva": 11724, "total": 85000 },
      "tarjeta": { "subtotal": 8621, "iva": 1379, "total": 10000 },
      "totalFinal": 85000
    },
    {
      "modalidad": "QUINCENA",
      "nombre": "Quincena (sin tarjeta)",
      "cantidadMeses": 1,
      "valorUnitario": 64655,
      "incluyeTarjeta": false,
      "desglose": { "subtotal": 64655, "iva": 10345, "total": 75000 },
      "totalFinal": 75000
    }
  ]
}
```

### B.2 Iniciar pago
- **Método**: `POST`
- **URL**: `/v1/payments/mensualidad/iniciar-pago/:idPersona`
- **Auth**: Bearer token
- **Content-Type**: `application/json`
- **Path params**:
  - `idPersona` (number): ID de la persona autorizada que paga.

**Body** (`IniciarPagoMensualidadDto`):
```json
{
  "Email": "cliente@correo.com",
  "Telefono": "3001234567",
  "CantidadMeses": 1,
  "ModalidadPago": "MENSUALIDAD",
  "NombreOpcion": "Mensualidad + Tarjeta",
  "Documento": 123456789,
  "TipoDocumento": "CC",
  "Nombre": "JUAN",
  "Apellidos": "Perez",
  "Sede": 32,
  "IdentificacionCliente": "123456789"
}
```

> **⚠️ IMPORTANTE**: El frontend **DEBE** enviar el campo `NombreOpcion` con el valor exacto del campo `nombre` de la opción que seleccionó el usuario (por ejemplo `"Mensualidad + Tarjeta"` o `"Mensualidad (sin tarjeta)"`). Esto le indica al backend si debe cobrar o no la tarjeta, sin necesidad de enviar un flag booleano adicional.

---

## C. Interfaz de datos (para TypeScript)

```typescript
export interface OpcionPago {
  modalidad: string;           // ej. "MENSUALIDAD", "QUINCENA"
  nombre: string;            // ej. "Mensualidad + Tarjeta"
  cantidadMeses: number;
  valorUnitario: number;
  incluyeTarjeta: boolean;
  desglose: {
    subtotal: number;
    iva: number;
    total: number;
  };
  tarjeta?: {
    subtotal: number;
    iva: number;
    total: number;
  };
  totalFinal: number;
}

export interface IniciarPagoMensualidadDto {
  Email: string;
  Telefono?: string;
  CantidadMeses: number;
  ModalidadPago: string;
  NombreOpcion?: string;       // <-- requerido cuando hay variantes con/sin tarjeta
  FechaInicio?: string;
  IdentificacionCliente?: string;
  Documento: number;
  TipoDocumento: string;
  Nombre: string;
  Apellidos: string;
  Sede: number;
}
```

---

## D. Consideraciones de UI/UX sugeridas

1. **Listado de opciones de pago**:
   - Mostrar cada opción como una **tarjeta o radio-button** que el usuario puede seleccionar.
   - Destacar el `nombre` de la opción (es el texto legible para el usuario).
   - Mostrar el `totalFinal` de forma prominente.
   - Si la opción incluye tarjeta (`incluyeTarjeta: true`), mostrar un desglose secundario con el valor de la tarjeta.
   - Si hay varias opciones con el mismo `modalidad` (ej. dos "MENSUALIDAD"), diferenciarlas claramente por el nombre.

2. **Cantidad de meses**:
   - Solo aplica para `MENSUALIDAD`. Mostrar un stepper o select con valores `1` o `2`.
   - Para `QUINCENA`, `RECARGA`, `SOLO_TARJETA`, la cantidad es fija en `1`.

3. **Al iniciar el pago**:
   - El frontend debe guardar el campo `nombre` de la opción seleccionada y enviarlo en `NombreOpcion`.
   - Si no envía `NombreOpcion`, el backend asume que quiere cobrar tarjeta si la tiene habilitada (comportamiento legacy).

---

## E. Flujo de la pantalla

```
Cliente entra a "Pagar mensualidad"
         ↓
Frontend llama GET /v1/payments/mensualidad/:idPersona/opciones-pago?sede=:sede&meses=1
         ↓
Backend devuelve array de opciones (con/sin tarjeta según aplique)
         ↓
Cliente selecciona una opción del listado
         ↓
Frontend guarda: ModalidadPago + NombreOpcion + CantidadMeses
         ↓
Cliente presiona "Pagar"
         ↓
Frontend envía POST /v1/payments/mensualidad/iniciar-pago/:idPersona
         ↓
Backend calcula el monto exacto según NombreOpcion
         ↓
Backend responde con URL de la pasarela de pago
         ↓
Frontend redirige al cliente a la URL de pago
```

---

## F. Advertencias técnicas para el frontend

- El campo `NombreOpcion` debe coincidir **exactamente** con el campo `nombre` de la opción elegida. El backend usa este string para detectar si la opción incluye tarjeta o no (busca el sufijo `"(sin tarjeta)"`).
- Si el cliente **no** tiene `CobroTarjeta` habilitado, el backend devuelve solo una opción por modalidad (sin variantes).
- Si el cliente está dentro de la ventana de pago anticipado (>5 días por vencer), el backend puede devolver solo la opción de "Solo cobro de tarjeta".
- El backend realiza la deduplicación y validación de emails al enviar correos informativos; los pagos no envían emails automáticamente.
