# Implementación de V-Permission en el Sistema

Este documento detalla el funcionamiento del sistema de permisos (RBAC avanzado) en Digital6G, desde la obtención de datos hasta la validación en la interfaz de usuario mediante directivas y guardias de navegación.

---

## 1. Origen de los Permisos (JWT)

Los permisos no se consultan en cada acción; se extraen directamente del **JSON Web Token (JWT)** proporcionado por el backend durante el login o el refresco de sesión.

- **Payload del JWT**: El token contiene un array llamado `permisos`.
- **Estructura**: `["VER-USUARIOS", "CREAR-SEDES", "EDITAR-TARIFAS", ...]`
- **Procesamiento**: En `src/stores/auth.js`, la función `restoreSession()` y `login()` decodifican el payload y asignan el array al estado reactivo del usuario.

```javascript
// src/stores/auth.js (Fragmento)
user.value = {
  // ... otros datos
  permisos: payload.permisos ?? [], // Array de strings en mayúsculas
};
```

---

## 2. Validación Centralizada: `useAuth`

Para evitar duplicar la lógica de validación, se utiliza el composable `useAuth.js`. Este centraliza la regla de oro: **"Si eres Administrador, tienes todos los permisos; de lo contrario, debes tener el permiso específico en tu array"**.

```javascript
// src/composables/useAuth.js
export function useAuth() {
  const hasPermission = (permission) => {
    if (isAdmin.value) return true; // Bypass para administradores
    const userPermissions = user.value?.permisos || [];
    return userPermissions.includes(permission.toUpperCase());
  };
}
```

---

## 3. Directiva de Interfaz: `v-permission`

La directiva personalizada `v-permission` permite ocultar elementos del DOM de forma declarativa si el usuario no cuenta con la autorización necesaria.

### Registro
Se registra globalmente en `src/main.js`:
```javascript
import { vPermission } from "./directives/v-permission";
app.directive("permission", vPermission);
```

### Uso en Componentes
Simplemente añade `v-permission="'NOMBRE-DEL-PERMISO'"` a cualquier elemento HTML o componente de Vue.

```vue
<!-- Solo se mostrará si el usuario tiene el permiso o es admin -->
<button v-permission="'CREAR-USUARIOS'" @click="openModal">
  Nuevo Usuario
</button>
```

### Funcionamiento Interno
Si la validación falla, la directiva remueve el elemento del árbol del DOM en el hook `mounted`:
```javascript
// src/directives/v-permission.js
mounted(el, binding) {
  if (!hasPermission(binding.value)) {
    el.remove(); // El elemento desaparece por completo
  }
}
```

---

## 4. Protección de Rutas: `authGuard`

Además de la interfaz, el sistema protege el acceso a nivel de URL en `src/router/guards/authGuards.js`.

### Configuración de la Ruta
En los archivos de rutas (ej: `adminRoutes.js`), se define el permiso requerido en el objeto `meta`:

```javascript
{
  path: "usuarios",
  component: Usuarios,
  meta: { 
    requiresAuth: true, 
    role: "admin", 
    permission: "VER-USUARIOS" // Permiso necesario
  }
}
```

### Validación en el Guardia
El `authGuard` verifica automáticamente esta propiedad antes de permitir la navegación:

```javascript
// src/router/guards/authGuards.js
const permisoRequerido = to.meta.permission;
if (permisoRequerido) {
  const tienePermiso = auth.isAdmin || auth.user?.permisos?.includes(permisoRequerido);
  if (!tienePermiso) {
    return next("/unauthorized"); // Redirección si no tiene permiso
  }
}
```

---

## 5. Resumen de Flujo

1.  **Login**: El servidor entrega un JWT con la lista de permisos.
2.  **Store**: Pinia guarda los permisos en `authStore.user.permisos`.
3.  **UI**: `v-permission` oculta botones o secciones basándose en el array del store.
4.  **Router**: El `authGuard` bloquea el acceso manual por URL si el permiso no está presente.

> 💡 **Nota**: Todos los permisos deben escribirse en **MAYÚSCULAS** y siguiendo el formato de kebab-case (ej: `ACCION-MODULO`) para mantener la consistencia con el backend.
