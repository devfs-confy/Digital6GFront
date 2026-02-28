# Referencia de Servicios - API

Esta sección contiene una lista detallada de los servicios disponibles en la aplicación y sus respectivos métodos.

---

## 👤 AdminServices
`src/api/services/admin.services.js`

Servicios orientados a tareas administrativas.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAllClients(params)` | `GET v1/usuarios/admin` | `params`: Objeto opcional (paginación, filtros) | Obtiene todos los clientes registrados desde la perspectiva administrativa. |

---

## 🏢 SedesSerivce
`src/api/services/sedes.services.js`

Gestión y consulta de sedes físicas.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll(params)` | `GET v1/sedes` | `params`: Objeto opcional | Recupera el listado completo de sedes registradas. |

---

## 🛡️ RolService
`src/api/services/rol.services.js`

Gestión de roles y permisos del sistema.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAll()` | `GET v1/roles` | Ninguno | Obtiene todos los roles registrados. |
| `getOne(id)` | `GET v1/roles/:id` | `id`: Identificador del rol | Obtiene la información de un rol específico. |
| `create(dto)` | `POST v1/roles` | `dto`: Datos del rol | Crea un nuevo rol en el sistema. |
| `getAllPermisos()` | `GET v1/permisos` | Ninguno | Obtiene el listado completo de permisos disponibles. |
| `getPermisosRol(idRol)`| `GET v1/rol-permiso/:idRol`| `idRol`: ID del rol | Obtiene los permisos asociados a un rol. |
| `assignPermisos(dto)` | `PUT v1/rol-permiso` | `dto`: { id_rol, id_permiso } | Asigna o actualiza los permisos de un rol. |

---

## 📅 SedesDisponibilidadService
`src/api/services/sedesdisponibilidad.service.js`

Consulta detallada de la disponibilidad de recursos en las sedes.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getDisponibilidadDetalle(params)` | `GET v1/sedes/disponibilidad/detalle` | `params`: Filtros obligatorios (fecha, sede) | Obtiene el detalle de disponibilidad para una sede en una fecha específica. |

---

## 👥 UsersService
`src/api/services/users.service.js`

Gestión de usuarios y clientes del sistema.

| Método | Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- | :--- |
| `getAllClients(params)` | `GET v1/usuarios/clientes` | `params`: Objeto opcional | Obtiene el listado de clientes registrados en el sistema. |

---

## 🛠 Cómo Usar un Servicio

Para utilizar un servicio en un componente Vue, simplemente impórtalo y llama a sus métodos asíncronos:

```javascript
import SedesSerivce from "@/api/services/sedes.services";

async function fetchSedes() {
  try {
    const data = await SedesSerivce.getAll();
    console.log("Sedes:", data);
  } catch (error) {
    console.error("Error al cargar sedes:", error);
  }
}
```

---

## 📝 Notas sobre Implementación
- **Excepciones**: Algunos servicios retornan un arreglo vacío (`[]`) en caso de error, mientras que otros lanzan (`throw`) el error para ser manejado por el componente que hace la llamada. Se recomienda estandarizar este comportamiento en futuras versiones.
- **Namespacing**: Las rutas base se definen en el `constructor()` de cada clase usando el atributo `this.nameRoute`.
