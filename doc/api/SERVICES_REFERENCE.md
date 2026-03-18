# Referencia de Servicios - API

Referencia completa y actualizada de todos los servicios del frontend. Cada servicio encapsula las llamadas HTTP a la API REST usando la instancia de Axios configurada en `src/api/axios.js`.

> **Nota sobre errores**: Todos los servicios utilizan `handleError` de `src/utils/error.handler.js` o lanzan el error directamente. Ver la sección [Manejo de Errores](#manejo-de-errores) al final de este documento.

---

## Índice

- [AdminServices](#-adminservices)
- [ClientService](#-clientservice)
- [MensualidadesService](#️-mensualidadesservice)
- [PaymentsService](#-paymentsservice)
- [SedesService](#️-sedesservice)
- [SedesDisponibilidadService](#-sedesdisponibilidadservice-legacy)
- [AutorizacionesService](#-autorizacionesservice)
- [CodigosService](#-codigosservice)
- [CodigoValidationService](#-codigovalidationservice)
- [RolService](#-rolservice)
- [TarifasService](#-tarifasservice)
- [Axios Base](#️-axios-base-srcapiaaxiosjs)
- [Manejo de Errores](#manejo-de-errores)

---

## 👤 AdminServices

**Archivo:** `src/api/services/admin.service.js`
**Ruta base:** `v1/usuarios/admin`
**Exportación:** instancia única (`export default new AdminServices()`)

Gestiona la creación y administración de usuarios con roles administrativos (Administrador, Operador, etc.).

### Métodos

#### `getAllAdmins(params?)`

```js
import AdminServices from "@/api/services/admin.service";

const result = await AdminServices.getAllAdmins({ page: 1, limit: 10, search: "juan", rol: 2 });
```

| Parámetro | Tipo | Requerido | Descripción |
|:---|:---|:---:|:---|
| `params.page` | `number` | No | Página actual (paginación) |
| `params.limit` | `number` | No | Registros por página |
| `params.search` | `string` | No | Texto libre para buscar por nombre o documento |
| `params.rol` | `number` | No | Filtra por ID de rol |

**Retorna:** `{ data, total, page, ... }` o `{ error, status, data }` si falla.
**HTTP:** `GET /v1/usuarios/admin`

---

#### `createAdmin(dto)`

```js
const result = await AdminServices.createAdmin({
  Documento: 123456789,
  Nombres: "Carlos",
  Apellidos: "López",
  Password: "clave1234",
  Telefono: "3001234567",
  Email: "carlos@mail.com",
  IdRol: 2,
  Estado: true, // opcional, default true
});
```

| Campo | Tipo | Requerido | Descripción |
|:---|:---|:---:|:---|
| `Documento` | `number` | **Sí** | Documento de identidad (se convierte a Number) |
| `Nombres` | `string` | **Sí** | Primer y segundo nombre |
| `Apellidos` | `string` | **Sí** | Apellidos |
| `Password` | `string` | **Sí** | Contraseña inicial |
| `Telefono` | `string` | **Sí** | Número de contacto |
| `Email` | `string` | **Sí** | Correo electrónico |
| `IdRol` | `number` | **Sí** | ID del rol asignado |
| `Estado` | `boolean` | No | Activo/Inactivo, por defecto `true` |

**Retorna:** Objeto del usuario creado o `{ error, status, data }`.
**HTTP:** `POST /v1/usuarios/admin`

---

#### `updateAdmin(documento, dto)`

Actualiza **solo los campos enviados** en `dto` (todos opcionales).

```js
const result = await AdminServices.updateAdmin(123456789, {
  Email: "nuevo@mail.com",
  IdRol: 3,
});
```

| Parámetro | Tipo | Descripción |
|:---|:---|:---|
| `documento` | `number` | Documento del admin a modificar |
| `dto.Nombres` | `string` | Nuevos nombres (opcional) |
| `dto.Apellidos` | `string` | Nuevos apellidos (opcional) |
| `dto.Email` | `string` | Nuevo email (opcional) |
| `dto.Telefono` | `string` | Nuevo teléfono (opcional) |
| `dto.Password` | `string` | Nueva contraseña (opcional) |
| `dto.IdRol` | `number` | Nuevo rol (opcional) |
| `dto.Estado` | `boolean` | Activar/inactivar (opcional) |
| `dto.Documento` | `number` | Cambiar documento (opcional, raro) |

**HTTP:** `PUT /v1/usuarios/admin/{documento}`

---

#### `updateAdminPermissions(documento, data)`

Alias de `updateAdmin`. Existe para compatibilidad con código anterior.

```js
await AdminServices.updateAdminPermissions(doc, data);
// Equivalente a:
await AdminServices.updateAdmin(doc, data);
```

---

## 👥 ClientService

**Archivo:** `src/api/services/client.service.js`
**Ruta base:** `v1/usuarios/clientes`
**Exportación:** instancia única

Gestiona el ciclo de vida de los usuarios de tipo cliente: registro, consulta y actualización.

### Métodos

#### `getAllClients(params?)`

Requiere permiso `VER-USUARIOS`. Solo accesible por administradores.

```js
import ClientService from "@/api/services/client.service";

const result = await ClientService.getAllClients({
  sede: 5,
  page: 1,
  limit: 20,
  search: "garcia",
  estado: true,
});
```

| Parámetro | Tipo | Descripción |
|:---|:---|:---|
| `params.sede` | `number` | Filtra por ID de sede |
| `params.page` | `number` | Número de página |
| `params.limit` | `number` | Tamaño de página |
| `params.search` | `string` | Búsqueda por nombre o documento |
| `params.estado` | `boolean` | Filtra por estado activo/inactivo |

**HTTP:** `GET /v1/usuarios/clientes`

---

#### `createClient(dto)`

Endpoint **público** (no requiere token). Usado desde `RegistroVista.vue`.

```js
const result = await ClientService.createClient({
  Documento: "1234567890",
  Nombres: "Ana",
  Apellidos: "Martínez",
  Telefono: "3009876543",
  Email: "ana@mail.com",
  Password: "clave1234",
  IdEstacionamiento: 5,
  Estado: true,
  Sincronizacion: false,
  Old: false,
  IdAutorizacion: null,  // solo si Old === true
  Placa1: "ABC123",
  Placa2: null,
  Placa3: null,
  Placa4: null,
  Placa5: null,
  EstudianteUcc: false,
  CodigoEstudianteUCC: "",
});
```

| Campo | Tipo | Descripción |
|:---|:---|:---|
| `Documento` | `string` | Número de documento |
| `Nombres` | `string` | Nombres del cliente |
| `Apellidos` | `string` | Apellidos del cliente |
| `Telefono` | `string` | Teléfono de contacto |
| `Email` | `string` | Correo electrónico |
| `Password` | `string` | Mínimo 8 caracteres |
| `IdEstacionamiento` | `number` | ID de la sede seleccionada |
| `Estado` | `boolean` | Siempre `true` en registro |
| `Sincronizacion` | `boolean` | `true` si el usuario ya existía en la API de la sede |
| `Old` | `boolean` | `true` si se encontró mensualidad previa en API externa |
| `IdAutorizacion` | `number\|null` | ID de autorización previa (solo si `Old === true`) |
| `Placa1`–`Placa5` | `string\|null` | Placas vehiculares (hasta 5) |
| `EstudianteUcc` | `boolean` | `true` solo en sede ID=24 |
| `CodigoEstudianteUCC` | `string` | Código estudiantil UCC |

**HTTP:** `POST /v1/usuarios/clientes`

---

#### `createClientWithCodigo(dto)`

Endpoint **público**. Variante del registro que valida un código previo.

```js
const result = await ClientService.createClientWithCodigo({
  ...mismoPayloadDeCreateClient,
  Codigo: "ABC123",
});
```

**HTTP:** `POST /v1/usuarios/clientes/with-codigo`

---

#### `updateOwnProfile(dto)`

El cliente **autenticado** actualiza su propio Email y/o Teléfono.

```js
const result = await ClientService.updateOwnProfile({
  Email: "nuevo@mail.com",
  Telefono: "3001234567",
});
```

**HTTP:** `PUT /v1/usuarios/clientes` (sin ID, usa token)

---

#### `updateClientByDoc(doc, dto)`

Administrador actualiza datos de un cliente específico.

```js
const result = await ClientService.updateClientByDoc("1234567890", {
  Nombres: "Ana Patricia",
  Email: "ana.nueva@mail.com",
});
```

**HTTP:** `PUT /v1/usuarios/clientes/{doc}`

---

#### `updateClientEstado(doc, estado)`

Activa o inactiva un cliente. Requiere permiso `INACTIVAR-USUARIOS`.

```js
await ClientService.updateClientEstado("1234567890", false); // Inactiva
await ClientService.updateClientEstado("1234567890", true);  // Activa
```

**HTTP:** `PUT /v1/usuarios/clientes/{doc}/estado` con body `{ Estado: boolean }`

---

## 🗓️ MensualidadesService

**Archivo:** `src/api/services/mensualidades.service.js`
**Rutas base:**
- Admin: `v1/mensualidades/admin`
- Cliente: `v1/mensualidades/clientes/mis-mensualidades`

Gestiona los contratos de mensualidad de parqueadero. Dividido en contexto **Admin** y **Cliente**.

### Métodos — Contexto Admin

#### `getAllBySede({ sede, page, limit, search }?)`

```js
import MensualidadesService from "@/api/services/mensualidades.service";

const result = await MensualidadesService.getAllBySede({
  sede: 5,
  page: 1,
  limit: 10,
  search: "garcia",
});
```

| Parámetro | Tipo | Default | Descripción |
|:---|:---|:---:|:---|
| `sede` | `number` | — | ID de la sede (requerido en práctica) |
| `page` | `number` | `1` | Número de página |
| `limit` | `number` | `10` | Registros por página |
| `search` | `string` | `""` | Búsqueda por nombre/documento |

**HTTP:** `GET /v1/mensualidades/admin?sede=&page=&limit=&search=`

---

#### `getDetalleById(id)`

```js
const detalle = await MensualidadesService.getDetalleById(42);
```

Retorna información completa de una mensualidad: datos del cliente, sede, placas, historial de pagos, fechas.
**HTTP:** `GET /v1/mensualidades/admin/detalle/{id}`

---

#### `getDesdeApiSede(idsede, documento)`

Consulta datos de mensualidad directamente desde la API externa de la sede.

```js
const datos = await MensualidadesService.getDesdeApiSede(5, "1234567890");
```

**HTTP:** `GET /v1/mensualidades/admin/api-sede/{idsede}/{documento}`

---

#### `updateById(id, dto)`

```js
const result = await MensualidadesService.updateById(42, {
  Estado: "activo",
  FechaFin: "2026-12-31",
});
```

**HTTP:** `PUT /v1/mensualidades/admin/{id}`

---

### Métodos — Contexto Cliente (usuario autenticado)

#### `getMisMensualidades()`

Lista todas las mensualidades del usuario autenticado (vía token JWT).

```js
const mensualidades = await MensualidadesService.getMisMensualidades();
```

**HTTP:** `GET /v1/mensualidades/clientes/mis-mensualidades`

---

#### `getMiMensualidadById(id)`

```js
const detalle = await MensualidadesService.getMiMensualidadById(42);
```

**HTTP:** `GET /v1/mensualidades/clientes/mis-mensualidades/{id}`

---

#### `ChangeCarPlate(payload)`

El cliente solicita un cambio de placa vehicular.

```js
const result = await MensualidadesService.ChangeCarPlate({
  IdMensualidad: 42,
  PlacaAnterior: "ABC123",
  PlacaNueva: "XYZ789",
  // ... campos según la API
});
```

**HTTP:** `POST /v1/mensualidades/clientes/mis-mensualidades/cambio-placas`

---

## 💳 PaymentsService

**Archivo:** `src/api/services/payment.service.js`
**Ruta base:** `v1/payments/mensualidad`
**Exportación:** instancia única

Procesamiento de pagos de mensualidades.

### Métodos

#### `getAll(params?)`

```js
import PaymentsService from "@/api/services/payment.service";

const pagos = await PaymentsService.getAll({ sede: 5, page: 1 });
```

Normaliza la respuesta buscando `response.data?.data` antes de retornar.
**HTTP:** `GET /v1/payments/mensualidad`

---

#### `create(dto)`

Registra un nuevo pago de mensualidad.

```js
const result = await PaymentsService.create({
  IdMensualidad: 42,
  Monto: 150000,
  MetodoPago: "efectivo",
  // ... otros campos según la API
});
```

**HTTP:** `POST /v1/payments/mensualidad`

---

## 🏢 SedesService

**Archivo:** `src/api/services/sedes.service.js`
**Ruta base:** `v1/sedes`
**Exportación:** instancia única

Administración de sedes físicas de parqueadero. Este servicio también incluye los métodos de disponibilidad (antes en `SedesDisponibilidadService`).

> **Manejo de errores especial:** `getAll` retorna `[]` en caso de error (no lanza). Los demás métodos lanzan el error directamente.

### Métodos — CRUD de Sedes

#### `getAll(params?)`

```js
import SedesService from "@/api/services/sedes.service";

const sedes = await SedesService.getAll({ Estado: true });
// Retorna [] si hay error (nunca lanza)
```

**HTTP:** `GET /v1/sedes`

---

#### `getById(id)`

```js
const sede = await SedesService.getById(5);
```

**HTTP:** `GET /v1/sedes/{id}`
**Lanza error** si falla.

---

#### `create(dto)`

Requiere permiso `CREAR-SEDES`.

```js
const result = await SedesService.create({
  IdEstacionamiento: 101,     // REQUERIDO
  Nombre: "Sede Norte",       // REQUERIDO
  AppHost: "https://...",     // REQUERIDO
  Direccion: "Calle 1 #2",   // REQUERIDO
  RequiereTarjetaCarro: true, // REQUERIDO
  RequiereTarjetaMoto: false, // REQUERIDO
  ApiKey: "key-abc",          // opcional
  AppLiquidador: "https://...",// opcional
  Email: "sede@mail.com",     // opcional
  PersonaContacto: "Juan",    // opcional
  Telefono: "3001234567",     // opcional
});
```

**HTTP:** `POST /v1/sedes`

---

#### `update(id, dto)`

Requiere permiso `EDITAR-SEDES`. Acepta cualquier subconjunto de los campos de `create` más `Estado`.

```js
await SedesService.update(5, { Nombre: "Sede Norte 2", Estado: true });
```

**HTTP:** `PUT /v1/sedes/{id}`

---

#### `delete(id)`

```js
await SedesService.delete(5);
```

**HTTP:** `DELETE /v1/sedes/{id}`

---

### Métodos — Disponibilidad

#### `getDisponibilidad({ IdSede?, IdTipoVehiculo? }?)`

```js
// Toda la red:
const disponibilidad = await SedesService.getDisponibilidad();

// Filtrada por sede y tipo de vehículo:
const disponibilidad = await SedesService.getDisponibilidad({
  IdSede: 5,
  IdTipoVehiculo: 1, // 1 = Carro, 2 = Moto (según API)
});
```

**HTTP:** `GET /v1/sedes/disponibilidad/detalle`

---

#### `updateDisponibilidad(idsede, idtipovehiculo, dto)`

Requiere permiso `EDITAR-SEDES`.

```js
await SedesService.updateDisponibilidad(5, 1, {
  Total: 200,
  Mensualidades: 50,
});
```

| Parámetro `dto` | Tipo | Descripción |
|:---|:---|:---|
| `IdEstacionamiento` | `number` | Opcional |
| `IdTipoVehiculo` | `number` | Opcional |
| `Total` | `number` | Cupos totales disponibles |
| `Mensualidades` | `number` | Cupos asignados a mensualidades |

**HTTP:** `PUT /v1/sedes/disponibilidad/{idsede}/{idtipovehiculo}`

---

## 📊 SedesDisponibilidadService *(legacy)*

**Archivo:** `src/api/services/sedesdisponibilidad.service.js`
**Ruta base:** `v1/sedes/disponibilidad`

> **Deprecated:** Esta funcionalidad fue consolidada en `SedesService`. Mantener solo para compatibilidad con código existente. Para nuevas implementaciones usar `SedesService`.

### Métodos

#### `getDisponibilidadDetalle(params?)`

```js
import SedesDisponibilidadService from "@/api/services/sedesdisponibilidad.service";

const data = await SedesDisponibilidadService.getDisponibilidadDetalle({ IdSede: 5 });
```

**HTTP:** `GET /v1/sedes/disponibilidad/detalle`
**Lanza error** (a diferencia de `SedesService.getAll` que retorna `[]`).

---

#### `updateDisponibilidad(idSede, idTipoVehiculo, dto)`

```js
await SedesDisponibilidadService.updateDisponibilidad(5, 1, { Total: 200 });
```

**HTTP:** `PUT /v1/sedes/disponibilidad/{idSede}/{idTipoVehiculo}`

---

## 📋 AutorizacionesService

**Archivo:** `src/api/services/autorizaciones.service.js`
**Ruta base:** `/v1/autorizaciones`

Consulta de autorizaciones de mensualidad (contratos vigentes en el sistema del parqueadero).

### Métodos

#### `getAll(params?)`

```js
import AutorizacionesService from "@/api/services/autorizaciones.service";

const result = await AutorizacionesService.getAll({ sede: 5 });
```

**HTTP:** `GET /v1/autorizaciones`

---

#### `getBySede(idSede)`

Obtiene autorizaciones de una sede con límite interno de 100 registros.

```js
const autorizaciones = await AutorizacionesService.getBySede(5);
// Internamente envía: params = { idSede: 5, limit: 100 }
```

**HTTP:** `GET /v1/autorizaciones?idSede={idSede}&limit=100`

---

## 🔑 CodigosService

**Archivo:** `src/api/services/codigos.service.js`
**Ruta base:** `/v1/codigo-validation`

Generación de códigos de verificación. Usado por operadores/admins para generar códigos de acceso a mensualidades.

### Métodos

#### `generarCodigo(idSede, idAutorizacion)`

```js
import CodigosService from "@/api/services/codigos.service";

const result = await CodigosService.generarCodigo(5, 123);
// Body enviado: { IdSede: 5, IdAutorizacion: 123 }
```

**HTTP:** `POST /v1/codigo-validation`

> **Diferencia con CodigoValidationService:** `CodigosService.generarCodigo` **genera** un código nuevo. `CodigoValidationService.validate` **valida** un código existente proporcionado por el usuario.

---

## ✅ CodigoValidationService

**Archivo:** `src/api/services/codigovalidacion.service.js`
**Ruta base:** `v1/codigo-validation`

Validación de códigos de verificación introducidos por el usuario.

### Métodos

#### `validate(dto)`

```js
import CodigoValidationService from "@/api/services/codigovalidacion.service";

const result = await CodigoValidationService.validate({ Codigo: "AB1234" });
```

**HTTP:** `POST /v1/codigo-validation`

---

## 🛡️ RolService

**Archivo:** `src/api/services/rol.service.js`
**Rutas base:** `v1/roles`, `v1/permisos`, `v1/rol-permiso`

Gestión de roles y permisos del sistema.

> **Manejo de errores especial:** Todos los métodos lanzan el error directamente (no usan `handleError`). El componente debe envolver las llamadas en `try/catch`.

### Métodos

#### `getAll()`

```js
import RolService from "@/api/services/rol.service";

const roles = await RolService.getAll();
// Ejemplo: [{ id: 1, nombre: "SUPER-ADMIN" }, { id: 2, nombre: "OPERADOR" }, ...]
```

**HTTP:** `GET /v1/roles`

---

#### `getAllPermisos()`

Catálogo completo de todos los permisos disponibles en el sistema.

```js
const permisos = await RolService.getAllPermisos();
```

**HTTP:** `GET /v1/permisos`

---

#### `getPermisosRol(idRol)`

Permisos actualmente asignados a un rol específico.

```js
const permisosDelRol = await RolService.getPermisosRol(2);
```

**HTTP:** `GET /v1/rol-permiso/{idRol}`

---

#### `assignPermisos(idRol, permisosIds)`

Reemplaza **masivamente** los permisos de un rol. Esta operación es global y afecta a todos los usuarios con ese rol.

```js
await RolService.assignPermisos(2, [1, 3, 5, 7]);
// Body: { IdRol: 2, Permisos: [1, 3, 5, 7] }
```

> **Advertencia:** Cambia los permisos de **todos** los usuarios con ese rol simultáneamente. Usar con cuidado.

**HTTP:** `PUT /v1/rol-permiso`

---

## 💰 TarifasService

**Archivo:** `src/api/services/tarifas.service.js`
**Ruta base:** `v1/tarifas`

Consulta de tarifas del sistema de estacionamiento.

### Métodos

#### `getAll(params?)`

```js
import TarifasService from "@/api/services/tarifas.service";

const tarifas = await TarifasService.getAll({ sede: 5 });
```

**HTTP:** `GET /v1/tarifas`

---

## ⚙️ Axios Base (`src/api/axios.js`)

Instancia central de Axios usada por todos los servicios.

```js
import { api } from "@/api/axios";
```

| Propiedad | Valor |
|:---|:---|
| `baseURL` | `VITE_API_URL` (variable de entorno en `.env`) |
| `timeout` | 10 segundos |
| `Content-Type` | `application/json` |

### Request Interceptor

Lee el token del `localStorage` (clave `"auth"`, campo `token`) y lo adjunta como:

```
Authorization: Bearer <token>
```

### Response Interceptor — Refresh Automático de Token

Maneja respuestas `401` de forma transparente. El flujo es:

```
Petición con token expirado
        ↓
Interceptor detecta 401 (no es /auth/login ni /auth/refresh)
        ↓
¿Ya está refrescando? (flag isRefreshing)
  Sí → Agrega la petición a la cola pendingQueue
  No → Llama auth.refreshAccessToken()
        ↓
¿Refresh exitoso?
  Sí → Actualiza token en store, reinvoca peticiones pendientes, reintenta original
  No → Llama logout(), redirige window.location a /login
```

La bandera `isRefreshing` y la cola `pendingQueue` evitan llamadas concurrentes al endpoint de refresh cuando múltiples peticiones fallan al mismo tiempo.

---

## Manejo de Errores

### `handleError(error)` — `src/utils/error.handler.js`

Función auxiliar usada por la mayoría de los servicios en sus bloques `catch`. Normaliza el error de Axios en un objeto estructurado para que el componente pueda manejarlo sin `try/catch`.

```js
// Retorna si es error de Axios:
{ error: true, status: 404, data: { message: "Usuario no encontrado" } }

// En errores desconocidos: hace console.error y retorna undefined
```

**Patrón de uso en componentes:**

```js
const result = await ClientService.getAllClients({ sede: 1 });

if (result?.error) {
  // Mostrar alerta con result.status o result.data.message
  console.error("Error:", result.data);
  return;
}

// Usar result normalmente
const clientes = result.data;
```

### Servicios que lanzan el error directamente

Estos servicios hacen `throw error` en lugar de usar `handleError`. El componente **debe** usar `try/catch`:

| Servicio | Métodos |
|:---|:---|
| `SedesService` | `getById`, `create`, `update`, `delete`, `getDisponibilidad`, `updateDisponibilidad` |
| `SedesDisponibilidadService` | `getDisponibilidadDetalle`, `updateDisponibilidad` |
| `RolService` | `getAll`, `getAllPermisos`, `getPermisosRol`, `assignPermisos` |

```js
// Ejemplo con try/catch obligatorio:
try {
  const sede = await SedesService.getById(5);
  // usar sede...
} catch (error) {
  console.error(error.response?.data ?? error.message);
}
```

---

## Catálogo de Permisos (`src/constants/permisions.js`)

Constantes usadas en `meta.permission` de las rutas del router y en la directiva `v-permission`.

```js
import { PERMS } from "@/constants/permisions";

// Ejemplo de uso en router:
meta: { permission: PERMS.USUARIOS_VER }

// Ejemplo de uso en template:
<button v-permission="PERMS.USUARIOS_INACTIVAR">Inactivar</button>
```

| Constante | Valor (string en JWT) | Módulo |
|:---|:---|:---|
| `PERMS.USUARIOS_VER` | `"VER-USUARIOS"` | Usuarios |
| `PERMS.USUARIOS_CREAR` | `"CREAR-USUARIOS"` | Usuarios |
| `PERMS.USUARIOS_EDITAR` | `"EDITAR-USUARIOS"` | Usuarios |
| `PERMS.USUARIOS_INACTIVAR` | `"INACTIVAR-USUARIOS"` | Usuarios |
| `PERMS.ROLES_VER` | `"VER-ROLES"` | Roles |
| `PERMS.ROLES_CREAR` | `"CREAR-ROLES"` | Roles |
| `PERMS.ROLES_EDITAR` | `"EDITAR-ROLES"` | Roles |
| `PERMS.PERMISOS_VER` | `"VER-PERMISOS"` | Permisos |
| `PERMS.PERMISOS_ASIGNAR` | `"ASIGNAR-PERMISOS"` | Permisos |
| `PERMS.PERMISOS_INACTIVAR` | `"INACTIVAR-PERMISOS"` | Permisos |
| `PERMS.MENSUALIDADES_VER` | `"VER-MENSUALIDADES"` | Mensualidades |
| `PERMS.MENSUALIDADES_CREAR` | `"CREAR-MENSUALIDADES"` | Mensualidades |
| `PERMS.MENSUALIDADES_EDITAR` | `"EDITAR-MENSUALIDADES"` | Mensualidades |
| `PERMS.MENSUALIDADES_INACTIVAR` | `"INACTIVAR-MENSUALIDADES"` | Mensualidades |
| `PERMS.SEDES_VER` | `"VER-SEDES"` | Sedes |
| `PERMS.SEDES_CREAR` | `"CREAR-SEDES"` | Sedes |
| `PERMS.SEDES_EDITAR` | `"EDITAR-SEDES"` | Sedes |
| `PERMS.SEDES_INACTIVAR` | `"INACTIVAR-SEDES"` | Sedes |
| `PERMS.CODIGOS_CREAR` | `"CREAR-CODIGOS"` | Códigos |
| `PERMS.ESTUDIANTES_SUBIR` | `"SUBIR-ESTUDIANTES"` | Estudiantes |
| `PERMS.AUTORIZACIONES_VER` | `"VER-AUTORIZACIONES"` | Autorizaciones |
