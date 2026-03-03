# Referencia de Servicios - API

Esta sección contiene la lista actualizada de servicios disponibles en la aplicación, incluyendo los nuevos módulos de pagos, mensualidades y validación.

---

## 👤 AdminServices
`src/api/services/admin.services.js`

Gestión avanzada de administradores y operadores.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAllAdmins(params)` | `GET v1/usuarios/admin` | `params`: Paginación/Filtros | Lista todos los usuarios con rol administrativo. |
| `updateAdminPermissions(doc, data)` | `PUT v1/usuarios/admin/:doc` | `doc`: Documento, `data`: Payload | Actualiza permisos o datos de un administrador específico. |
| `createAdmin(dto)` | `POST v1/usuarios/admin` | `dto`: Datos del admin | Registra un nuevo administrador/operador. |

---

## 👥 UsersService
`src/api/services/users.service.js` o `src/api/services/client.service.js`

Gestión de clientes y registros.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAllClients(params)` | `GET v1/usuarios/clientes` | `params`: Filtros | Lista todos los clientes registrados. |
| `createClient(dto)` | `POST v1/usuarios/clientes` | `dto`: Datos básicos | Crea un nuevo cliente. |
| `createClientWithCodigo(dto)` | `POST v1/usuarios/clientes/with-codigo` | `dto`: Datos + Código | Crea un cliente validando un código previo. |

---

## 🏢 SedesService
`src/api/services/sedes.services.js`

Administración de sedes físicas.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll(params)` | `GET v1/sedes` | `params`: Opcional | Lista todas las sedes. |
| `getById(id)` | `GET v1/sedes/:id` | `id`: ID Sede | Obtiene detalle de una sede. |
| `create(dto)` | `POST v1/sedes` | `dto`: Datos sede | Crea una nueva sede. |
| `update(id, dto)` | `PUT v1/sedes/:id` | `id`, `dto` | Actualiza información de la sede. |
| `delete(id)` | `DELETE v1/sedes/:id` | `id` | Elimina (o inhabilita) una sede. |

---

## 🛡️ RolService
`src/api/services/rol.services.js`

Gestión de la matriz de permisos y roles.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll()` | `GET v1/roles` | Ninguno | Lista roles (Administrador, Cliente, etc.). |
| `getAllPermisos()` | `GET v1/permisos` | Ninguno | Catálogo completo de permisos del sistema. |
| `getPermisosRol(idRol)` | `GET v1/rol-permiso/:idRol` | `idRol` | Permisos asignados a un rol específico. |
| `assignPermisos(idRol, ids)` | `PUT v1/rol-permiso` | `idRol`, `permisosIds` | Actualiza masivamente los permisos de un rol. |

---

## 📅 SedesDisponibilidadService
`src/api/services/sedesdisponibilidad.service.js`

Control de cupos y disponibilidad por tipo de vehículo.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getDisponibilidadDetalle(params)` | `GET v1/sedes/disponibilidad/detalle` | `sede`, `fecha` | Detalle de ocupación actual. |
| `updateDisponibilidad(idS, idV, dto)` | `PUT v1/sedes/disponibilidad/:idS/:idV` | IDs y nuevo cupo | Ajusta la disponibilidad de una sede. |

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

Gestión de contratos de mensualidad.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll(params)` | `GET v1/mensualidades` | `params` | Lista todas las mensualidades activas. |
| `getDetalle(id)` | `GET v1/mensualidades/detalle/:id` | `id` | Información completa de una mensualidad. |
| `getMisMensualidades(params)` | `GET v1/mensualidades/mis-mensualidades` | `params` | Mensualidades del usuario autenticado. |
| `getMiMensualidadById(id)` | `GET v1/mensualidades/mis-mensualidades/:id` | `id` | Detalle de una mensualidad propia. |

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

1. **Manejo de Errores**: Los servicios lanzan (`throw`) el error original del backend para que el componente pueda mostrar mensajes específicos (ej. usando `SweetAlert` o `Toast`).
2. **Estructura de Respuesta**: La mayoría de los métodos de "lectura" intentan normalizar la respuesta buscando la propiedad `.data` del payload del backend.
3. **Persistencia**: Se recomienda usar estos servicios dentro de acciones de **Pinia** o directamente en componentes mediante `try/catch`.
