# Implementación del Sistema de Permisos (RBAC)

Este documento detalla la arquitectura y el funcionamiento del sistema de control de acceso basado en roles y permisos específicos (RBAC) en el frontend de Digital6G.

---

## 1. Origen de los Permisos (JWT)

El sistema utiliza un esquema "stateless" donde los permisos se transportan directamente en el **JSON Web Token (JWT)** emitido por el backend tras un inicio de sesión exitoso.

- **Extracción**: En `src/stores/auth.js`, durante las funciones `login()` y `restoreSession()`, se decodifica el payload del token con `atob()`.
- **Estructura del Payload**: El token contiene un array de strings llamado `permisos` y un objeto `rol`.
- **Almacenamiento**: Los permisos se guardan en el estado reactivo `user.permisos` del `authStore` de Pinia.

```javascript
// src/stores/auth.js — resultado tras decodificar el JWT
user.value = {
  nombres: payload.nombres,
  apellidos: payload.apellidos,
  email: payload.email,
  documento: payload.documento,
  permisos: payload.permisos ?? [], // Ejemplo: ["VER-USUARIOS", "CREAR-SEDES"]
  rol: payload.rol,                 // Objeto con { nombre: "ADMIN" } o similar
};
```

---

## 2. Constantes de Permisos (`PERMS`)

Para garantizar que los strings coincidan exactamente con lo que envía el backend, **siempre** se usa el archivo `src/constants/permisions.js`. **Nunca uses strings literales en los componentes.**

```javascript
// src/constants/permisions.js
export const PERMS = {
  // Usuarios
  USUARIOS_VER:         "VER-USUARIOS",
  USUARIOS_CREAR:       "CREAR-USUARIOS",
  USUARIOS_EDITAR:      "EDITAR-USUARIOS",
  USUARIOS_INACTIVAR:   "INACTIVAR-USUARIOS",

  // Roles
  ROLES_VER:            "VER-ROLES",
  ROLES_CREAR:          "CREAR-ROLES",
  ROLES_EDITAR:         "EDITAR-ROLES",

  // Permisos
  PERMISOS_VER:         "VER-PERMISOS",
  PERMISOS_ASIGNAR:     "ASIGNAR-PERMISOS",
  PERMISOS_INACTIVAR:   "INACTIVAR-PERMISOS",

  // Mensualidades
  MENSUALIDADES_VER:      "VER-MENSUALIDADES",
  MENSUALIDADES_CREAR:    "CREAR-MENSUALIDADES",
  MENSUALIDADES_EDITAR:   "EDITAR-MENSUALIDADES",
  MENSUALIDADES_INACTIVAR:"INACTIVAR-MENSUALIDADES",

  // Sedes
  SEDES_VER:            "VER-SEDES",
  SEDES_CREAR:          "CREAR-SEDES",
  SEDES_EDITAR:         "EDITAR-SEDES",
  SEDES_INACTIVAR:      "INACTIVAR-SEDES",

  // Códigos
  CODIGOS_CREAR:        "CREAR-CODIGOS",
};
```

> **Importante**: Todos los valores deben estar en **MAYÚSCULAS** con el formato `ACCION-MODULO` para mantener la integridad con el backend.

---

## 3. Validación Centralizada: `useAuth`

Para mantener la consistencia, toda la lógica de validación reside en el composable `src/composables/useAuth.js`.

### La Regla de Oro

1. **Bypass de Administrador**: Si el usuario tiene `isAdmin` (`SUPER-ADMIN` o `ADMIN`), tiene acceso total de forma automática.
2. **Validación de Permiso**: Si no es administrador, se verifica si el permiso solicitado existe en `user.permisos`.

```javascript
// src/composables/useAuth.js
const hasPermission = (permission) => {
  if (isAdmin.value) return true;                   // Bypass para admins
  if (!permission) return true;                     // Sin permiso = libre
  const userPermissions = user.value?.permisos || [];
  return userPermissions.includes(permission.toUpperCase());
};
```

### Funciones Disponibles

| Función | Descripción |
| :--- | :--- |
| `hasPermission(perm)` | `true` si el usuario tiene el permiso indicado. |
| `hasAllPermissions(perms[])` | `true` si el usuario tiene **todos** los permisos del array. |
| `hasAnyPermission(perms[])` | `true` si el usuario tiene **al menos uno** de los permisos. |

```vue
<script setup>
import { useAuth } from "@/composables/useAuth";

const { hasPermission, hasAnyPermission, isAdmin } = useAuth();
</script>

<template>
  <div v-if="hasPermission(PERMS.USUARIOS_EDITAR)">
    <!-- Solo visible si tiene el permiso -->
  </div>
</template>
```

---

## 4. Directiva de Interfaz: `v-permission`

La directiva personalizada `v-permission` permite ocultar elementos del DOM de forma declarativa si el usuario no cuenta con la autorización necesaria.

### Registro

Se registra globalmente en `src/main.js`:

```javascript
import { vPermission } from "@/directives/v-permission";
app.directive("permission", vPermission);
```

### Uso en Componentes

```vue
<script setup>
import { PERMS } from "@/constants/permisions";
</script>

<template>
  <!-- El botón se elimina del DOM si no hay permiso -->
  <button v-permission="PERMS.USUARIOS_CREAR">
    Nuevo Usuario
  </button>
</template>
```

### Funcionamiento Interno

La directiva usa el hook `mounted` para evaluar el permiso al momento en que el elemento se inserta en el DOM. Si la validación falla, ejecuta `el.remove()`, eliminando el elemento del árbol del DOM.

> **Nota de seguridad**: La eliminación del DOM es una medida de UX, no de seguridad real. El backend **siempre debe** validar los permisos en cada petición de la API.

---

## 5. Protección de Rutas: `authGuard` (Paso 5)

A nivel de navegación, la verificación de permisos específicos está integrada como el **Paso 5** del guardia principal `src/router/guards/authGuards.js`.

### Configuración en Rutas

En los archivos de definición de rutas (ej. `adminRoutes.js`), se especifica el permiso requerido en el objeto `meta`:

```javascript
// src/router/routes/adminRoutes.js
{
  path: "usuarios",
  component: Usuarios,
  meta: {
    requiresAuth: true,
    role: "admin",
    permission: PERMS.ROLES_VER,
  }
}
```

### Lógica del Paso 5

```javascript
// src/router/guards/authGuards.js — Paso 5
const permisoRequerido = to.meta.permission;
if (permisoRequerido) {
  const tienePermiso = auth.isAdmin || auth.user?.permisos?.includes(permisoRequerido);
  if (!tienePermiso) {
    return next("/unauthorized");
  }
}
```

1. Si la ruta no define `meta.permission` → Se permite el acceso.
2. Si el usuario es `isAdmin` → Se permite el acceso (bypass).
3. Se verifica si el permiso existe en `auth.user.permisos`.
4. Si no existe → Redirige a `/unauthorized`.

> La lógica de permisos por ruta está **integrada directamente** en `authGuards.js`, no en un guardia separado.

---

## 6. Gestión via API (`RolService`)

El archivo `src/api/services/rol.service.js` proporciona los métodos para administrar la matriz de permisos desde el panel de control:

| Método | Descripción |
| :--- | :--- |
| `getAllPermisos()` | Lista todos los permisos disponibles en el sistema. |
| `getAll()` | Lista todos los roles registrados. |
| `getPermisosRol(idRol)` | Obtiene los permisos asignados a un rol específico. |
| `assignPermisos(idRol, ids)` | Actualiza masivamente la matriz de permisos de un rol. |

---

## 7. Resumen de Capas de Control

| Capa | Archivo | Mecanismo |
| :--- | :--- | :--- |
| **JWT** | `src/stores/auth.js` | Extrae permisos del token al hacer login o al restaurar sesión. |
| **Ruta** | `src/router/guards/authGuards.js` | Bloquea navegación si falta `meta.permission`. |
| **Componente** | `src/composables/useAuth.js` | `hasPermission()` para lógica condicional en templates. |
| **DOM** | `src/directives/v-permission.js` | Elimina elementos visualmente si no hay permiso. |
| **Menú** | `src/layouts/AdminLayout.vue` | Filtra `adminMenuItems` según permisos del usuario. |
| **API** | Backend | Validación real de autorización (fuente de verdad). |

### Flujo Completo

1. **Backend** valida credenciales y genera un JWT con el array `permisos` del rol asignado.
2. **AuthStore** almacena el JWT y decodifica los permisos en el estado global (`user.permisos`).
3. **Router** (`authGuard` Paso 5) bloquea el acceso a vistas completas si falta el permiso en `meta`.
4. **UI** (`v-permission` + `useAuth`) oculta botones y secciones dentro de las vistas.
5. **Menú** (`AdminLayout`) filtra los items del sidebar mostrando solo los módulos accesibles.
