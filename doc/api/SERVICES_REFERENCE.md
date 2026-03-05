# Referencia de Servicios - API

Esta sección contiene la lista actualizada de servicios disponibles en la aplicación, incluyendo los nuevos módulos de pagos, mensualidades y validación.

---

## 👤 AdminServices
`src/api/services/admin.service.js`

Gestión avanzada de administradores y operadores.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAllAdmins(params)` | `GET v1/usuarios/admin` | `params`: Paginación/Filtros | Lista todos los usuarios con rol administrativo. |
| `updateAdminPermissions(doc, data)` | `PUT v1/usuarios/admin/:doc` | `doc`: Documento, `data`: Payload | Actualiza permisos o datos de un administrador específico. |
| `createAdmin(dto)` | `POST v1/usuarios/admin` | `dto`: Datos del admin | Registra un nuevo administrador/operador. |

---

## 👥 ClientService
`src/api/services/client.service.js`

Gestión de clientes y registros.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAllClients(params)` | `GET v1/usuarios/clientes` | `params`: `{ sede? }` | Lista todos los clientes, filtrable por sede. Requiere permiso `VER-USUARIOS`. |
| `createClient(dto)` | `POST v1/usuarios/clientes` | Ver payload completo abajo | Crea un nuevo cliente (público). Usado desde `RegistroVista.vue`. |
| `createClientWithCodigo(dto)` | `POST v1/usuarios/clientes/with-codigo` | `dto`: Datos + Código | Crea un cliente validando un código previo (público). |
| `updateOwnProfile(dto)` | `PUT v1/usuarios/clientes` | `dto`: `{ Email?, Telefono? }` | El cliente autenticado actualiza su propio Email y Teléfono. |
| `updateClientByDoc(doc, dto)` | `PUT v1/usuarios/clientes/:doc` | `doc`: Documento, `dto`: Campos | Admin actualiza Nombres/Apellidos/Email/Teléfono/Estado de un cliente. Usa `handleError`. |
| `updateClientEstado(doc, estado)` | `PUT v1/usuarios/clientes/:doc/estado` | `doc`: Documento, `estado`: Bool | Admin activa o inactiva un cliente. Requiere permiso `INACTIVAR-USUARIOS`. |

**Payload completo de `createClient(dto)`** (construido en `RegistroVista.vue`):

```js
{
  Documento: string,           // Número de documento del cliente
  Nombres: string,
  Apellidos: string,
  Telefono: string,
  Email: string,
  Password: string,            // Mínimo 8 caracteres
  IdEstacionamiento: number,   // ID de la sede seleccionada (viene de query ?sede)
  Estado: true,
  Sincronizacion: boolean,     // true si el cliente ya existía en la API de la sede
  Old: boolean,                // true si se encontró mensualidad previa en la API externa
  IdAutorizacion?: number,     // Solo si existe mensualidad previa (de la API de sede)
  Placa1: string | null,
  Placa2: string | null,       // Hasta 5 placas; null si no aplica
  Placa3: string | null,
  Placa4: string | null,
  Placa5: string | null,
  EstudianteUcc: boolean,      // true solo en sede ID=24 si el usuario confirmó ser estudiante
  CodigoEstudianteUCC: string, // Código UCC; vacío si no aplica
}
```

---

## 🏢 SedesService
`src/api/services/sedes.service.js`

Administración de sedes físicas y control de disponibilidad. Los métodos de disponibilidad están ahora consolidados en este servicio (antes en `sedesdisponibilidad.service.js`).

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll(params)` | `GET v1/sedes` | `params`: Opcional | Lista todas las sedes. Retorna `[]` en caso de error (no lanza). |
| `getById(id)` | `GET v1/sedes/:id` | `id`: ID Sede | Obtiene detalle de una sede. |
| `create(dto)` | `POST v1/sedes` | `dto`: `{ IdEstacionamiento*, Nombre*, AppHost*, Direccion*, RequiereTarjetaCarro*, RequiereTarjetaMoto*, ApiKey?, AppLiquidador?, Email?, PersonaContacto?, Telefono? }` | Crea una nueva sede. Requiere permiso `CREAR-SEDES`. |
| `update(id, dto)` | `PUT v1/sedes/:id` | `id`, `dto`: Subconjunto de campos de `create` + `Estado?` | Actualiza información de la sede. Requiere `EDITAR-SEDES`. |
| `delete(id)` | `DELETE v1/sedes/:id` | `id` | Elimina (o inhabilita) una sede. |
| `getDisponibilidad({ IdSede, IdTipoVehiculo })` | `GET v1/sedes/disponibilidad/detalle` | `IdSede?`, `IdTipoVehiculo?` | Detalle de ocupación actual por sede y tipo de vehículo. |
| `updateDisponibilidad(idsede, idtipovehiculo, dto)` | `PUT v1/sedes/disponibilidad/:idsede/:idtipovehiculo` | IDs y `dto`: `{ IdEstacionamiento?, IdTipoVehiculo?, Total?, Mensualidades? }` | Ajusta cupos de disponibilidad. Requiere `EDITAR-SEDES`. |

---

## 🛡️ RolService
`src/api/services/rol.service.js`

Gestión de la matriz de permisos y roles.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll()` | `GET v1/roles` | Ninguno | Lista roles (Administrador, Cliente, etc.). |
| `getAllPermisos()` | `GET v1/permisos` | Ninguno | Catálogo completo de permisos del sistema. |
| `getPermisosRol(idRol)` | `GET v1/rol-permiso/:idRol` | `idRol` | Permisos asignados a un rol específico. |
| `assignPermisos(idRol, ids)` | `PUT v1/rol-permiso` | `idRol`, `permisosIds` | Actualiza masivamente los permisos de un rol. |

---

## 📅 SedesDisponibilidadService *(legacy)*
`src/api/services/sedesdisponibilidad.service.js`

> **Nota:** La funcionalidad de disponibilidad fue consolidada en `SedesService` (`sedes.service.js`). Este servicio se mantiene por compatibilidad pero se recomienda usar `SedesService` para nuevas implementaciones.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getDisponibilidadDetalle(params)` | `GET v1/sedes/disponibilidad/detalle` | `params`: Filtros | Detalle de ocupación actual. Retorna `[]` en caso de error. |
| `updateDisponibilidad(idSede, idTipoVehiculo, dto)` | `PUT v1/sedes/disponibilidad/:idSede/:idTipoVehiculo` | IDs y `dto` | Ajusta la disponibilidad de una sede. |

---

## 💳 PaymentsService
`src/api/services/payment.service.js`

Procesamiento de pagos de mensualidades.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll(params)` | `GET v1/payments/mensualidad` | `params` | Historial global de pagos (Admin). |
| `create(dto)` | `POST v1/payments/mensualidad` | `dto`: Datos pago | Registra un nuevo pago de mensualidad. |

---

## 🗓️ MensualidadesService
`src/api/services/mensualidades.service.js`

Gestión de contratos de mensualidad. El servicio está ahora dividido en dos contextos: **Admin** (`v1/mensualidades/admin`) y **Cliente** (`v1/mensualidades/clientes/mis-mensualidades`).

**Contexto Admin:**

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAllBySede({ sede, page, limit, search })` | `GET v1/mensualidades/admin` | `sede`: ID sede, `page`, `limit`, `search?` | Lista mensualidades filtradas por sede con paginación. |
| `getDetalleById(id)` | `GET v1/mensualidades/admin/detalle/:id` | `id` | Información completa de una mensualidad específica. |
| `getDesdeApiSede(idsede, documento)` | `GET v1/mensualidades/admin/api-sede/:idsede/:documento` | `idsede`, `documento` | Consulta datos de mensualidad desde la API de la sede externa. |
| `updateById(id, dto)` | `PUT v1/mensualidades/admin/:id` | `id`, `dto` | Actualiza una mensualidad (admin). |

**Contexto Cliente (usuario autenticado):**

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getMisMensualidades()` | `GET v1/mensualidades/clientes/mis-mensualidades` | Ninguno | Lista las mensualidades del usuario autenticado. |
| `getMiMensualidadById(id)` | `GET v1/mensualidades/clientes/mis-mensualidades/:id` | `id` | Detalle de una mensualidad propia. |

---

## 💰 TarifasService
`src/api/services/tarifas.service.js`

Consulta de tarifas del sistema de estacionamiento.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll(params)` | `GET v1/tarifas` | `params`: Filtros opcionales | Lista todas las tarifas disponibles. |

---

## 🔑 CodigoValidationService
`src/api/services/codigovalidacion.service.js`

Validación de códigos de seguridad/verificación.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `validate(dto)` | `POST v1/codigo-validation` | `dto`: { Codigo } | Verifica la validez de un código en el sistema. |

---

## 🛠 Estándares de Uso

Todos los servicios extienden el comportamiento base de **Axios** configurado en `src/api/axios.js`.

1. **Manejo de Errores**: Los servicios lanzan (`throw`) el error original del backend para que el componente pueda mostrar mensajes específicos (ej. usando `SweetAlert` o `Toast`). Algunos métodos usan `handleError` de `src/utils/error.handler.js` para retornar un objeto `{ error, status, data }` en lugar de lanzar.
2. **Estructura de Respuesta**: La mayoría de los métodos de "lectura" intentan normalizar la respuesta buscando la propiedad `.data` del payload del backend.
3. **Persistencia**: Se recomienda usar estos servicios dentro de acciones de **Pinia** o directamente en componentes mediante `try/catch`.

---

## 🔧 Utilidades

### `handleError`
`src/utils/error.handler.js`

Función auxiliar para normalizar errores de Axios. Usada en métodos que prefieren retornar un resultado estructurado en vez de lanzar una excepción.

```js
import { handleError } from "@/utils/error.handler";

// Retorna: { error: true, status: number, data: object } en errores Axios
// Retorna: undefined en errores desconocidos (con console.error)
const result = await someService.someMethod(dto);
if (result?.error) { /* manejar error */ }
```
