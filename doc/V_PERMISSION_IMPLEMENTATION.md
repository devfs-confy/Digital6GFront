# Implementación del Sistema de Permisos (RBAC)

Este documento detalla la arquitectura y el funcionamiento del sistema de control de acceso basado en roles (RBAC) y permisos específicos en el frontend de Digital6G.

---

## 1. Origen de los Permisos (JWT)

El sistema utiliza un esquema "stateless" donde los permisos se transportan directamente en el **JSON Web Token (JWT)** emitido por el backend tras un inicio de sesión exitoso.

- **Extracción**: En `src/stores/auth.js`, durante las funciones `login()` y `restoreSession()`, se decodifica el payload del token.
- **Estructura del Payload**: El token contiene un array de strings llamado `permisos`.
- **Almacenamiento**: Los permisos se guardan en el estado reactivo `user.permisos` del `authStore` de Pinia.

```javascript
// src/stores/auth.js
user.value = {
  // ... datos del usuario
  permisos: payload.permisos ?? [], // Ejemplo: ["VER-USUARIOS", "CREAR-SEDES"]
  rol: payload.rol,
};
```

---

## 2. Validación Centralizada: `useAuth`

Para mantener la consistencia en todo el aplicativo, la lógica de validación reside en el composable `src/composables/useAuth.js`.

### La Regla de Oro
1. **Bypass de Administrador**: Si el usuario tiene el rol de `SUPER-ADMIN`, `ADMIN` o `ADMINISTRADOR` (según el computed `isAdmin`), tiene acceso total automáticamente.
2. **Validación de Permiso**: Si no es administrador, se verifica si el permiso solicitado existe en el array `user.permisos`.

```javascript
// src/composables/useAuth.js
const hasPermission = (permission) => {
  if (isAdmin.value) return true; // Bypass
  const userPermissions = user.value?.permisos || [];
  if (!permission) return true;
  return userPermissions.includes(permission.toUpperCase());
};
```

---

## 3. Directiva de Interfaz: `v-permission`

La directiva personalizada `v-permission` permite ocultar elementos del DOM de forma declarativa si el usuario no cuenta con la autorización necesaria.

### Registro
Se registra globalmente en `src/main.js` para que esté disponible en cualquier componente.

### Uso en Componentes
Se recomienda usar las constantes `PERMS` para evitar errores de escritura.

```vue
<script setup>
import { PERMS } from "@/constants/permisions";
</script>

<template>
  <!-- El botón se eliminará del DOM si no hay permiso -->
  <button v-permission="PERMS.USUARIOS_CREAR">
    Nuevo Usuario
  </button>
</template>
```

### Funcionamiento Interno (`src/directives/v-permission.js`)
La directiva utiliza el hook `mounted` para evaluar el permiso. Si la validación falla, ejecuta `el.remove()`, eliminando físicamente el elemento del árbol del DOM.

---

## 4. Protección de Rutas: `permissionGuard`

A nivel de navegación, el archivo `src/router/guards/permission.guard.js` intercepta cada cambio de ruta para verificar el acceso.

### Configuración en Rutas
En los archivos de definición de rutas (ej. `adminRoutes.js`), se especifica el permiso requerido en el objeto `meta`:

```javascript
// src/router/routes/adminRoutes.js
{
  path: "sedes",
  component: Sedes,
  meta: { 
    permission: "VER-SEDES" // Permiso requerido para entrar
  }
}
```

### Lógica del Guardia
1. Si la ruta no define un `meta.permission`, se permite el acceso.
2. Si el usuario es `isAdmin`, se permite el acceso.
3. Se verifica si el permiso está en `authStore.user.permisos`.
4. Si falla, se redirige al usuario a su ruta de inicio predeterminada (`redirectTo`).

---

## 5. Constantes de Permisos (`PERMS`)

Para garantizar que los strings coincidan exactamente con lo que envía el backend, se utiliza el archivo `src/constants/permisions.js`. **Nunca uses strings literales en los componentes; usa siempre este objeto.**

```javascript
// src/constants/permisions.js
export const PERMS = {
  USUARIOS_VER: "VER-USUARIOS",
  SEDES_CREAR: "CREAR-SEDES",
  // ...
};
```

---

## 6. Gestión via API (`RolService`)

El archivo `src/api/services/rol.services.js` proporciona los métodos necesarios para la administración de este sistema desde el panel de control:

- `getAllPermisos()`: Lista todos los permisos disponibles en el sistema.
- `getPermisosRol(idRol)`: Obtiene los permisos asignados a un rol específico.
- `assignPermisos(dto)`: Actualiza la matriz de permisos de un rol.

---

## 7. Resumen de Flujo de Trabajo

1.  **Backend**: Valida credenciales y genera un JWT incluyendo el array de permisos del rol del usuario.
2.  **Frontend (AuthStore)**: Almacena el JWT y decodifica los permisos en el estado global.
3.  **Frontend (Router)**: El `permissionGuard` bloquea el acceso a vistas completas.
4.  **Frontend (UI)**: La directiva `v-permission` y el composable `useAuth` ocultan o muestran componentes y botones específicos.

> [!IMPORTANT]
> Todos los permisos en el código y en el backend deben manejarse en **MAYÚSCULAS** y seguir el formato `ACCION-MODULO` para mantener la integridad del sistema.
