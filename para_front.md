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
