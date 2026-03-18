# Flujo de Funcionamiento de la Plataforma — Digital 6G Frontend

Este documento describe cómo funciona el frontend de Digital 6G end-to-end: desde que un usuario abre el navegador hasta que interactúa con las funcionalidades de negocio. Está dirigido a desarrolladores nuevos en el proyecto.

---

## Stack Tecnológico

| Tecnología | Versión | Rol |
|:---|:---|:---|
| Vue 3 | 3.5.25 | Framework SPA (Composition API + `<script setup>`) |
| Vue Router 4 | — | Enrutamiento SPA con navigation guards |
| Pinia | 3.0.2 | Estado global + persistencia en `localStorage` |
| Axios | 1.13.5 | Cliente HTTP con interceptores de auth |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Vite | — | Build tool, alias `@` = `./src` |
| Chart.js + vue-chartjs | 4.5 | Gráficos en el dashboard admin |
| SweetAlert2 | 11 | Alertas y confirmaciones |
| Luxon | 3.6 | Manejo de fechas |

---

## Estructura General de Archivos

```
src/
├── main.js                      # Punto de entrada
├── App.vue                      # Raíz: RouterView + restoreSession()
├── api/
│   ├── axios.js                 # Instancia Axios + interceptores
│   └── services/                # Un archivo por dominio de negocio
├── stores/
│   └── auth.js                  # Estado de autenticación (Pinia, persistido)
├── router/
│   ├── index.js                 # Combina todas las rutas
│   ├── guards/
│   │   └── authGuards.js        # Guard global de autenticación y permisos
│   └── routes/
│       ├── authRoutes.js        # Rutas públicas
│       ├── clienteRoutes.js     # Rutas del cliente
│       └── adminRoutes.js       # Rutas del administrador
├── layouts/
│   ├── AppLayout.vue            # Layout base (sidebar + navbar + router-view)
│   ├── AdminLayout.vue          # Layout admin (filtra menú por permisos)
│   └── ClienteLayout.vue        # Layout cliente (menú completo)
├── views/
│   ├── auth/                    # Login, Registro, SeleccionSede
│   ├── cliente/                 # Vistas del dashboard cliente
│   └── administrador/           # Vistas del panel admin
├── components/
│   ├── shared/                  # Sidebar, Navbar, Paginacion
│   └── modals/                  # Modales reutilizables
├── composables/
│   └── useAuth.js               # hasPermission(), hasAnyPermission()
├── directives/
│   └── v-permission.js          # Oculta elementos del DOM sin permiso
└── constants/
    └── permisions.js            # PERMS.* — strings de permisos del JWT
```

---

## 1. Arranque de la Aplicación

**Archivo:** `src/main.js` → `src/App.vue`

```
1. main.js crea la app Vue
2. Inicializa Pinia con el plugin de persistencia (token/role/user → localStorage)
3. Registra la directiva global v-permission
4. Monta el router
5. App.vue se monta → ejecuta auth.restoreSession() en onMounted
```

### `restoreSession()` (auth store)

Al recargar la página, el token está en `localStorage` pero el estado reactivo de Vue se perdió. `restoreSession` lo reconstruye:

```
¿Hay token en el store (localStorage)?
  No → logout() → guard redirige a /login
  Sí → Decodifica el JWT (base64 del payload)
         ↓
       ¿El token expiró? (payload.exp * 1000 < Date.now())
         Sí → Llama refreshAccessToken()
                ¿Refresh exitoso? → Actualiza token y sigue
                ¿Refresh fallido? → logout()
         No → Rellena user y role desde el JWT en memoria
```

---

## 2. Flujo de Autenticación

### 2.1 Login

**Vista:** `src/views/auth/LoginVista.vue`
**Store:** `src/stores/auth.js → login(documento, password)`

```
Usuario introduce documento + contraseña
        ↓
auth.login() → POST /auth/login { Documento, Password }
        ↓
¿Respuesta exitosa (success: true)?
  Sí:
    - Guarda token en store (→ persiste en localStorage)
    - Decodifica JWT: extrae nombres, email, documento, permisos[], rol
    - Calcula role (payload.tipoUsuario.toLowerCase())
    - Retorna redirectTo según el rol:
        'admin' / 'administrador' → /admin/dashboard
        'cliente'                → /cliente/inicio
  No / Error:
    - Mapea el código HTTP a un mensaje de error:
        429 → "Demasiados intentos"
        409 → "Usuario inactivo"
        401/400 → "Documento o contraseña incorrectos"
        404 → "Usuario no encontrado"
        500+ → "Petición fallida"
    - Muestra errorMsg en la vista
```

### 2.2 Registro de Cliente

**Vista:** `src/views/auth/RegistroVista.vue`
**Flujo previo:** `src/views/auth/SeleccionSede.vue`

```
1. Usuario visita /seleccionsede
   → SedesService.getAll() carga la lista de sedes activas
   → Usuario selecciona una sede → router.push({ path: '/registro', query: { sede: id } })

2. En /registro el formulario recopila:
   Datos personales + contraseña + placas + datos de sede

3. Si la sede requiere código de estudiante (IdSede === 24):
   → Se pide código UCC → CodigoValidationService.validate({ Codigo })
   → Si válido → se incluye en el payload

4. Al enviar:
   → ClientService.createClient(dto) → POST /v1/usuarios/clientes
   O bien:
   → ClientService.createClientWithCodigo(dto) → POST /v1/usuarios/clientes/with-codigo

5. Si exitoso → router.push('/login')
```

### 2.3 Logout

```
Navbar → botón "Cerrar sesión"
  → auth.logout()
     - Limpia user, token, role, errorMsg del store
     - Pinia persiste el estado vacío → localStorage queda sin token
  → router.push('/login')
```

---

## 3. Sistema de Rutas y Guards

**Archivo:** `src/router/guards/authGuards.js`

El guard `authGuard` se ejecuta **antes de cada navegación** (beforeEach):

```
Navegación a /ruta
        ↓
¿Es ruta pública? (/login, /registro, /seleccionsede, /unauthorized)
  Sí:
    ¿Usuario autenticado? → Redirige a auth.redirectTo (evita volver al login)
    No → Permite pasar
  No:
    ¿Sin token? → /login
    ¿Tiene token pero sin user? → restoreSession() (recarga de página)
        ↓
    ¿La ruta tiene meta.role?
      Sí: ¿auth.role !== meta.role? → /unauthorized
        ↓
    ¿La ruta tiene meta.permission?
      Sí: ¿isAdmin o user.permisos.includes(permiso)? → /unauthorized si no
        ↓
    next() → Renderiza la vista
```

### Tabla de Rutas

#### Rutas Públicas

| Ruta | Vista | Descripción |
|:---|:---|:---|
| `/login` | `LoginVista.vue` | Inicio de sesión |
| `/registro` | `RegistroVista.vue` | Registro de nuevo cliente |
| `/seleccionsede` | `SeleccionSede.vue` | Selector de sede antes del registro |
| `/unauthorized` | `Unauthorizedvista.vue` | Acceso denegado |

#### Rutas de Cliente (`/cliente`, role: `"cliente"`)

| Ruta | Vista | Descripción |
|:---|:---|:---|
| `/cliente/inicio` | `ClienteInicio.vue` | Dashboard con accesos rápidos |
| `/cliente/mensualidad` | `Mensualidad.vue` | Mis mensualidades, pagar, congelar |
| `/cliente/notificaciones` | `Notificaciones.vue` | Notificaciones pendientes |
| `/cliente/peticiones` | `Peticiones.vue` | Cambios y peticiones |
| `/cliente/solicitudes` | `Solicitudes.vue` | Estado de solicitudes enviadas |
| `/cliente/parqueos` | `ParqueosReciente.vue` | Parqueos recientes |
| `/cliente/pagos` | `PagosRecientes.vue` | Historial de pagos |
| `/cliente/informacion` | `EditarInformacion.vue` | Actualizar email/teléfono |
| `/cliente/placa` | `CambioPlaca.vue` | Solicitar cambio de placa |
| `/cliente/pqrs` | `PQRS.vue` | Peticiones, quejas, reclamos |

#### Rutas de Admin (`/admin`, role: `"admin"`)

| Ruta | Vista | Permiso requerido |
|:---|:---|:---|
| `/admin/dashboard` | `Dashboard.vue` | — (todos los admins) |
| `/admin/clientes` | `Clientes.vue` | `VER-USUARIOS` |
| `/admin/solicitudes` | `Solicitudes.vue` | `VER-MENSUALIDADES` |
| `/admin/reportes` | `Reportes.vue` | `EDITAR-SEDES` |
| `/admin/sedes` | `Sedes.vue` | `VER-SEDES` |
| `/admin/tarifas-admin` | `AdministrarTarifas.vue` | `VER-SEDES` |
| `/admin/mensualidades` | `Mensualidades.vue` | `VER-MENSUALIDADES` |
| `/admin/usuarios` | `Usuarios.vue` | `VER-ROLES` |
| `/admin/roles` | `Roles.vue` | `VER-ROLES` |
| `/admin/disponibilidad` | `VerDisponibilidad.vue` | `CREAR-CODIGOS` |
| `/admin/verificacion` | `Codigo.vue` | `CREAR-CODIGOS` |
| `/admin/tarifas` | `Tarifas.vue` | `CREAR-CODIGOS` |
| `/admin/tarjetas` | `Tarjetas.vue` | `CREAR-CODIGOS` |

---

## 4. Sistema de Permisos

La plataforma tiene dos tipos de usuarios administrativos y un modelo de permisos granular.

### Roles y jerarquía

```
SUPER-ADMIN  →  Bypasea TODOS los permisos. Ve todo, hace todo.
ADMIN        →  Bypasea TODOS los permisos. Igual que SUPER-ADMIN.
[Otros roles] → Solo acceden a lo que sus permisos permitan explícitamente.
```

El bypass se implementa en tres lugares:
1. **`authGuard`**: `auth.isAdmin || user.permisos.includes(permiso)`
2. **`useAuth.js` composable**: `hasPermission()` retorna `true` si `isAdmin`
3. **`v-permission` directiva**: no elimina el elemento si `isAdmin`

### Cómo se almacenan los permisos

Los permisos vienen **embebidos en el JWT** como array de strings:

```json
{
  "nombres": "Carlos",
  "tipoUsuario": "admin",
  "rol": { "nombre": "OPERADOR" },
  "permisos": ["VER-USUARIOS", "VER-MENSUALIDADES", "CREAR-CODIGOS"]
}
```

Al hacer login o `restoreSession`, el frontend decodifica el JWT y guarda `payload.permisos` en `auth.user.permisos`.

### Uso en componentes

**Opción 1 — Directiva en template:**

```html
<!-- El elemento se elimina del DOM si el usuario no tiene el permiso -->
<button v-permission="'VER-USUARIOS'">Ver Clientes</button>
```

**Opción 2 — Composable en `<script setup>`:**

```js
import { useAuth } from "@/composables/useAuth";
const { hasPermission, hasAnyPermission } = useAuth();

if (hasPermission("VER-USUARIOS")) { /* ... */ }
if (hasAnyPermission(["VER-MENSUALIDADES", "CREAR-CODIGOS"])) { /* ... */ }
```

**Opción 3 — Guard de ruta (automático):**

```js
// En adminRoutes.js:
{ path: "clientes", meta: { permission: PERMS.USUARIOS_VER } }
// authGuard redirige a /unauthorized si el usuario no tiene ese permiso
```

---

## 5. Flujo de Token — Refresh Automático

El interceptor de respuesta en `src/api/axios.js` maneja la renovación de tokens de forma transparente:

```
Petición HTTP → API
        ↓
API responde 401 (token expirado)
        ↓
Interceptor detecta el 401
¿Es una ruta de login o refresh? → No hace nada (deja pasar el error)
¿Ya hay un refresh en progreso? → Encola la petición en pendingQueue
¿No hay refresh en progreso?
  → isRefreshing = true
  → auth.refreshAccessToken() → POST /api/auth/refresh
         ↓
  ¿Nuevo token recibido?
    Sí:
      - Actualiza auth.token
      - Llama processPendingQueue(null, newToken) → reinvoca todas las peticiones encoladas
      - Reintenta la petición original con el nuevo token
    No:
      - processPendingQueue(error, null) → rechaza las peticiones encoladas
      - auth.logout()
      - window.location.href = "/login"
  → isRefreshing = false
```

---

## 6. Flujo del Cliente — Mis Mensualidades

**Vista:** `src/views/cliente/Mensualidad.vue`

```
1. onMounted → MensualidadesService.getMisMensualidades()
   → GET /v1/mensualidades/clientes/mis-mensualidades
   → Retorna array de mensualidades del usuario autenticado

2. Para cada mensualidad se muestra:
   - Nombre de la sede y tipo de mensualidad
   - Estado (activo, vencido, congelado...)
   - Días restantes + barra de progreso del período
   - Fechas de inicio y fin
   - Botones: Pagar | Ver | Congelar

3. Acción "Pagar":
   → Abre modal de pago con resumen
   → Al confirmar: PaymentsService.create(dto) → POST /v1/payments/mensualidad

4. Acción "Congelar":
   → Abre modal de congelamiento
   → Al confirmar: MensualidadesService.updateById(id, { Estado: "congelado" })

5. Acción "Agregar por código":
   → Modal pide un código de verificación
   → CodigoValidationService.validate({ Codigo })
   → Si válido → se asocia la mensualidad al usuario
```

---

## 7. Flujo del Admin — Dashboard

**Vista:** `src/views/administrador/Dashboard.vue`

```
1. onMounted carga en paralelo:
   - SedesService.getAll()                     → Lista de sedes
   - SedesDisponibilidadService.getDisponibilidadDetalle()  → Disponibilidad actual
   - [datos para gráficos según permisos]

2. Renderiza:
   - Gráfico de barras: "Mensualidades vencidas por sede" (datos críticos en rojo)
   - Gráfico de barras: "Ingresos mensuales — 6 mejores sedes" (datos financieros en verde)
   - Selector de disponibilidad: por sede + tipo de vehículo (Carro / Moto)
     - Barra de progreso con colores:
         < 70% ocupación → verde
         70-90%          → ámbar
         > 90%           → rojo
   - Cards de acceso rápido (filtradas por permiso del usuario)
```

---

## 8. Flujo del Admin — Gestión de Clientes

**Vista:** `src/views/administrador/Clientes.vue`

```
1. Carga con paginación → ClientService.getAllClients({ sede, page, limit })

2. Filtros:
   - Búsqueda por nombre/documento (search)
   - Selector de sede
   - Toggle activo/inactivo

3. Acciones por fila:
   - Editar → Modal de edición → ClientService.updateClientByDoc(doc, dto)
   - Inactivar/Activar → ClientService.updateClientEstado(doc, bool)
     (requiere permiso INACTIVAR-USUARIOS)

4. Crear nuevo cliente → Modal → AdminServices.createAdmin(dto) ó ClientService.createClient(dto)
```

---

## 9. Flujo del Admin — Gestión de Mensualidades

**Vista:** `src/views/administrador/Mensualidades.vue`

```
1. Selector de sede en el header
2. MensualidadesService.getAllBySede({ sede, page, limit, search })
3. Click en mensualidad → MensualidadesService.getDetalleById(id)
4. Editar → MensualidadesService.updateById(id, dto)
5. Consultar estado en API externa de la sede:
   → MensualidadesService.getDesdeApiSede(idsede, documento)
```

---

## 10. Flujo del Admin — Roles y Permisos

**Vista:** `src/views/administrador/Roles.vue`

```
1. RolService.getAll() → Lista de roles
2. RolService.getAllPermisos() → Catálogo completo de permisos
3. Al seleccionar un rol → RolService.getPermisosRol(idRol)
4. El admin edita qué permisos tiene ese rol
5. Al guardar → RolService.assignPermisos(idRol, [ids...])
   EFECTO: Cambia los permisos de TODOS los usuarios con ese rol
```

---

## 11. Layouts y Navegación

### Jerarquía de componentes de layout

```
App.vue (RouterView)
  └── AdminLayout.vue  /  ClienteLayout.vue
        └── AppLayout.vue
              ├── Sidebar.vue   (menú lateral)
              ├── Navbar.vue    (barra superior)
              └── <router-view> (contenido de la vista actual)
```

### AdminLayout — Filtrado de menú por permisos

`AdminLayout.vue` filtra `adminMenuItems` antes de pasarlos al sidebar:

```js
const menuFiltrado = adminMenuItems.filter(item =>
  !item.permission || hasPermission(item.permission)
);
```

Los ítems sin `permission` (como Dashboard) siempre son visibles. Los demás solo aparecen si el usuario tiene el permiso correspondiente.

### Sidebar — Estados de menú

- **Activo**: `route.path === item.route` o `item.activeFor.includes(route.path)`
- **Indicador verde** en el ítem activo
- **Animación escalonada** en la entrada (`animationDelay` por índice)
- **Responsive**: colapsa en móvil (`< 1024px`), se abre con overlay oscuro

---

## 12. Convenciones del Código

### Cómo consumir un servicio en un componente

```vue
<script setup>
import { ref, onMounted } from "vue";
import ClientService from "@/api/services/client.service";

const clientes = ref([]);
const cargando = ref(false);

onMounted(async () => {
  cargando.value = true;
  const result = await ClientService.getAllClients({ sede: 5 });

  if (result?.error) {
    console.error(result.data?.message);
    return;
  }

  clientes.value = result.data ?? result;
  cargando.value = false;
});
</script>
```

### Errores que lanzan vs errores que retornan

| Tipo de servicio | En el componente |
|:---|:---|
| Usa `handleError` (la mayoría) | Verificar `result?.error` |
| Lanza directamente (SedesService, RolService) | Usar `try/catch` |

### Variables de entorno necesarias

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=https://tu-api.com/api
```

### Alias de importación

```js
// Correcto (usa alias de Vite):
import ClientService from "@/api/services/client.service";

// Equivalente a:
import ClientService from "./src/api/services/client.service";
```

---

## 13. Diagrama de Flujo General

```
Navegador abre la app
        ↓
main.js → App.vue → restoreSession()
        ↓
authGuard evalúa la ruta destino
        ↓
  ┌─────────────────────────────────────┐
  │   ¿Ruta pública?                    │
  │   → Renderiza sin checks            │
  │                                     │
  │   ¿Autenticado + rol correcto       │
  │   + permisos suficientes?           │
  │   → Renderiza la vista              │
  │                                     │
  │   ¿Falla algún check?               │
  │   → /login o /unauthorized          │
  └─────────────────────────────────────┘
        ↓
Layout (Admin o Cliente)
  → Sidebar (menú filtrado por permisos)
  → Navbar (info del usuario + logout)
  → Vista actual (carga datos vía Services)
        ↓
Services → api/axios → API REST
  → Interceptor adjunta Bearer token
  → Si 401 → refresh automático
  → Si refresh falla → logout + /login
```
