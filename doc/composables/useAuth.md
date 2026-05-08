# Composable useAuth — Digital6G Frontend

Composable para validación de permisos en `<script setup>` y templates.

## Archivo

`src/composables/useAuth.js`

## Qué expone

| Retorno | Tipo | Descripción |
|:---|:---|:---|
| `user` | `Ref<Object\|null>` | Datos del usuario (del authStore) |
| `role` | `Ref<String\|null>` | Rol actual (`"admin"`, `"cliente"`) |
| `isAdmin` | `Ref<Boolean>` | `true` si rol es `SUPER-ADMIN` o `ADMIN` |
| `hasPermission(perm)` | `Function` | `true` si tiene el permiso |
| `hasAllPermissions(perms[])` | `Function` | `true` si tiene TODOS los permisos |
| `hasAnyPermission(perms[])` | `Function` | `true` si tiene AL MENOS UNO |

## Uso en `<script setup>`

```vue
<script setup>
import { useAuth } from "@/composables/useAuth"
import { PERMS } from "@/constants/permisions"

const { hasPermission, hasAnyPermission, isAdmin } = useAuth()

// Un permiso
if (hasPermission(PERMS.USUARIOS_VER)) {
  // puede ver usuarios
}

// Al menos uno
if (hasAnyPermission([PERMS.SEDES_VER, PERMS.SEDES_CREAR])) {
  // puede ver o crear sedes
}

// Todos
if (hasAllPermissions([PERMS.ROLES_VER, PERMS.ROLES_EDITAR])) {
  // puede ver Y editar roles
}
</script>
```

## Uso en template

```vue
<template>
  <button v-if="hasPermission(PERMS.USUARIOS_CREAR)">
    Nuevo Usuario
  </button>

  <div v-if="isAdmin">
    <!-- Solo admins ven esto -->
  </div>
</template>
```

## Regla de oro: bypass de admin

Si `isAdmin === true`, **todas** las funciones retornan `true` sin importar los permisos:

```js
// Si el usuario es SUPER-ADMIN o ADMIN:
hasPermission("CUALQUIER-COSA")     // → true
hasAllPermissions(["X", "Y", "Z"])  // → true
hasAnyPermission([])                // → true
```

## Comparación con `v-permission`

| | `useAuth` | `v-permission` |
|:---|:---|:---|
| **Uso** | `<script>` y `v-if` | Directiva en template |
| **Efecto** | Controla lógica | Elimina del DOM |
| **Seguridad** | Solo UX | Solo UX (el backend es la fuente de verdad) |

**Recomendación:** Usar `v-permission` para ocultar elementos del DOM. Usar `useAuth` para lógica condicional en scripts.
