# Auth Store (Autenticación)

El archivo `src/stores/auth.js` es el núcleo de la seguridad y sesión de Digital6G. Se encarga de manejar el ciclo de vida de la autenticación del usuario.

## 📦 Estado (State)

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `user` | `Object` | Datos del perfil (nombres, email, documento, etc.). |
| `token` | `String` | JWT para autenticar peticiones API. |
| `role` | `String` | Rol actual del usuario (`"admin"`, `"cliente"`, `"operador"`). |
| `loading` | `Boolean` | Flag para mostrar indicadores de carga en Login. |
| `errorMsg` | `String` | Mensaje de error para mostrar al usuario en caso de fallo. |

---

## ⚡ Propiedades Computadas (Getters)

| Propiedad | Descripción |
| :--- | :--- |
| `isLoggedIn` | `true` si existe un `token` válido. |
| `isAuthenticated` | Alias para `isLoggedIn` (usado en `authGuard`). |
| `redirectTo` | Retorna la ruta base según el rol actual (ej: `/admin/dashboard`). |
| `isAdmin` | `true` si el rol es `"admin"` o `"administrador"`. |
| `isCliente` | `true` si el rol es `"cliente"`. |

---

## 🛠 Acciones (Actions)

### `login(documento, password)`
Realiza la petición al backend (`/auth/login`).
- Si es exitoso: Almacena el token, decodifica el payload JWT para obtener el rol y el perfil básico, y retorna la ruta de redirección.
- Si falla: Actualiza `errorMsg` con el mensaje apropiado según el código de estado (401, 404, 429, 500, etc.).

### `logout()`
Limpia todo el estado del store (`user`, `token`, `role`, `errorMsg`). Esto dispara la redirección automática a `/login` a través del `authGuard`.

### `restoreSession()`
Recupera el token persistido del `localStorage` y restaura el objeto `user` y `role`.
- Si el token ha expirado (`exp` del JWT < ahora), intenta ejecutar `refreshAccessToken()`.
- Si falla la restauración, ejecuta `logout()`.

### `refreshAccessToken()`
Pide un nuevo token al endpoint `/api/auth/refresh`.
- Es invocado automáticamente por el interceptor de Axios ante un error 401.
- Si tiene éxito, actualiza el `token` y los datos del `user`.
- Si falla, cierra la sesión del usuario.

---

## 💾 Persistencia (`localStorage`)
El store está configurado para persistir solo el `token` de acceso.

```javascript
persist: {
  pick: ["token"],
}
```

Esto permite que al recargar la página, el `authGuard` detecte que existe una sesión y ejecute `restoreSession()`, la cual decodifica el JWT y restaura el objeto `user` y el `role` del usuario de forma automática sin necesidad de almacenar datos redundantes o potencialmente desincronizados en el `localStorage`.
