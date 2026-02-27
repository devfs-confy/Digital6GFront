# Guardias de Navegación y Seguridad

El archivo `src/router/guards/authGuards.js` es el responsable de la seguridad de la aplicación a nivel de cliente. Su función es interceptar cada navegación y validar si el usuario tiene permiso para acceder.

## 🛡️ Lógica del `authGuard`

El guardia sigue un flujo de decisión estructurado:

1. **Rutas Públicas**: Si la ruta está en `rutasPublicas` (ej: `/login`, `/registro`) o tiene `meta.public: true`:
   - Si ya está autenticado → Redirige automáticamente a su panel principal (`redirectTo`).
   - Si no está autenticado → Permite el acceso.

2. **Verificación de Autenticación**: Si el usuario no tiene un token activo:
   - Redirige inmediatamente a `/login`.

3. **Restauración de Sesión**: Si existe un token pero el objeto `user` en el store es nulo (recarga de página):
   - Ejecuta `auth.restoreSession()`.
   - Si la sesión no es válida (token expirado) → Redirige a `/login`.

4. **Verificación de Rol (RBAC)**: Si la ruta tiene un rol requerido (`meta.role`):
   - Compara `auth.role` con el rol esperado.
   - Si no coinciden → Redirige a `/unauthorized`.

## 📋 Parámetros de Ruta (`meta`)

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `requiresAuth` | `Boolean` | Indica que la ruta es privada. |
| `role` | `String` | El rol exacto permitido para esta ruta (ej: `"admin"`, `"cliente"`). |
| `public` | `Boolean` | Si es `true`, omite las verificaciones de autenticación. |

```javascript
// Ejemplo de uso en clienteRoutes.js
export const clienteRoutes = {
  path: "/cliente",
  meta: { requiresAuth: true, role: "cliente" },
  children: [...]
};
```

---

## ⚠️ Notas Técnicas
- El guardia es **asíncrono**, permitiendo verificar el estado del token o realizar refrescos antes de decidir el siguiente paso.
- Utiliza el store de Pinia (`useAuthStore`) para obtener el estado actual de la sesión.
