# Auth Store (Autenticación)

El archivo `src/stores/auth.js` es el núcleo de la seguridad y sesión de Digital6G. Se encarga de manejar el ciclo de vida completo de la autenticación del usuario.

## Estado (State)

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `user` | `Object \| null` | Datos del perfil (nombres, apellidos, email, documento, telefono, rol, permisos). |
| `token` | `String \| null` | JWT para autenticar peticiones API. |
| `role` | `String \| null` | Rol actual del usuario (`"admin"`, `"administrador"`, `"cliente"`). Derivado del campo `tipoUsuario` del JWT. |
| `loading` | `Boolean` | Flag para mostrar indicadores de carga en el componente de Login. |
| `errorMsg` | `String \| null` | Mensaje de error para mostrar al usuario en caso de fallo de login. |

---

## Propiedades Computadas (Getters)

| Propiedad | Descripción |
| :--- | :--- |
| `isLoggedIn` | `true` si existe un `token` en el estado. |
| `isAuthenticated` | Alias para `isLoggedIn`. Usado por el `authGuard`. |
| `redirectTo` | Retorna la ruta base según el rol actual (ej: `/admin/dashboard`, `/cliente/inicio`). Si el rol no está mapeado, retorna `/login`. |
| `isAdmin` | `true` si `user.rol.nombre` es `"SUPER-ADMIN"` o `"ADMIN"` (comparación en mayúsculas). |
| `isCliente` | `true` si `role` es `"cliente"`. |

> **Nota sobre `isAdmin`**: A diferencia de `role`, este getter lee el objeto `rol` anidado en `user` (que viene del payload JWT). Esto permite distinguir entre el nivel de acceso real del usuario y su tipo de sesión.

---

## Acciones (Actions)

### `login(documento, password)`

Realiza la petición de autenticación al backend (`POST /auth/login`).

- **Si es exitoso**: Almacena el `token`, decodifica el payload JWT con `atob()` para extraer `tipoUsuario` (→ `role`), `nombres`, `apellidos`, `email`, `documento`, `permisos` y `rol`. Retorna la URL de redirección según el rol.
- **Si falla**: Actualiza `errorMsg` con un mensaje específico por código de estado:

| Código | Mensaje |
| :--- | :--- |
| `429` | "Demasiados intentos. Espera unos minutos." |
| `409` | "Usuario inactivo. Contacta al administrador." |
| `401` / `400` | "Documento o contraseña incorrectos." |
| `404` | "Usuario no encontrado." |
| `>= 500` | "Petición fallida. Intenta de nuevo." |
| Sin respuesta | "Sin conexión con el servidor." |

### `logout()`

Limpia todo el estado del store (`user`, `token`, `role`, `errorMsg`). El plugin de persistencia sincroniza automáticamente la limpieza en `localStorage`.

### `restoreSession()`

Lee el JWT persistido en el store y restaura el objeto `user` y `role` **sin llamar al backend**.

1. Si no hay token → Ejecuta `logout()`.
2. Decodifica el payload del JWT.
3. Si el token ha expirado (`exp * 1000 < Date.now()`) → Intenta `refreshAccessToken()`.
4. Si el refresco falla → Ejecuta `logout()`.
5. Si el token es válido → Restaura `role` y `user` con los datos del payload.

### `refreshAccessToken()`

Solicita un nuevo token al endpoint `POST /api/auth/refresh`.

- Es invocado **automáticamente** por el interceptor de Axios cuando recibe un error `401`.
- Si tiene éxito: Actualiza `token`, `role` y `user` con los datos del nuevo JWT.
- Si falla: Ejecuta `logout()` y retorna `null`.

---

## Persistencia (`localStorage`)

El store persiste **tres propiedades** para garantizar una restauración de sesión completa:

```javascript
persist: {
  pick: ["token", "role", "user"],
}
```

La clave en `localStorage` es `"auth"` (nombre del store). El interceptor de Axios lee directamente de `localStorage.getItem("auth")` para adjuntar el token a las peticiones, incluso antes de que el store de Pinia esté inicializado.

> La persistencia de `user` y `role` es un complemento al mecanismo principal de restauración vía JWT, que garantiza que los datos estén disponibles inmediatamente en el primer render antes de que `restoreSession()` complete su ejecución.
