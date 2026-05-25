# Digital6G Frontend

> Sistema de gestión de parqueaderos — Panel de administración y portal de clientes.

[![Vue 3](https://img.shields.io/badge/Vue-3.5.25-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.2-FFD859?logo=pinia)](https://pinia.vuejs.org/)

---

## Vista Rápida

| Rol | Panel | Acceso |
|:---|:---|:---|
| **Admin** | Dashboard, clientes, sedes, mensualidades, roles, PQRS, facturación | `/admin/**` |
| **Cliente** | Mis mensualidades, pagos, parqueos, notificaciones, PQRS | `/cliente/**` |

## Stack Tecnológico

| Tecnología | Versión | Rol |
|:---|:---|:---|
| Vue 3 | 3.5.25 | Framework SPA (Composition API + `<script setup>`) |
| Vite | 7.3.1 | Build tool + dev server |
| Vue Router | 4 | Enrutamiento SPA con guards RBAC |
| Pinia | 3.0.2 | Estado global + persistencia en localStorage |
| Tailwind CSS | 3.4.17 | Estilos utilitarios |
| Flowbite | 3.1.2 | Componentes UI |
| Axios | 1.13.5 | HTTP client con interceptores de auth + refresh token |
| Chart.js | 4.5.1 | Gráficos en dashboard admin |
| SweetAlert2 | 11.19.1 | Alertas y confirmaciones |
| Luxon | 3.6.1 | Manejo de fechas (timezone Colombia) |

---

## Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.development .env
# Editar .env → VITE_API_URL=https://tu-api.com/api

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. (Opcional) Compilar Tailwind CSS
npm run style
```

### Scripts disponibles

| Comando | Descripción |
|:---|:---|
| `npm run dev` | Servidor de desarrollo en `0.0.0.0:5173` |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Preview del build de producción |
| `npm run style` | Compilar Tailwind CSS (watch mode) |

---

## Estructura del Proyecto

```
src/
├── main.js                          # Punto de entrada
├── App.vue                          # Raíz: RouterView + restoreSession()
├── api/
│   ├── axios.js                     # Axios instance + interceptores JWT
│   └── services/                    # 22 servicios API (singleton pattern)
├── assets/
│   ├── img/                         # 90+ iconos SVG + imágenes
│   ├── main.css                     # Tailwind compilado
│   ├── base.css                     # Resets globales
│   ├── swal.css                     # SweetAlert2 custom styles
│   └── table-system.css             # Tablas custom
├── components/
│   ├── shared/                      # Sidebar, Navbar, Paginacion, AppIcon, DatePicker
│   ├── modals/                      # BaseModal, ModalCongelar, ModalFacturacion, etc.
│   └── aside/                       # NotificacionesBtn, AsideEditar
├── composables/
│   └── useAuth.js                   # hasPermission(), hasAnyPermission()
├── constants/
│   └── permisions.js                # PERMS.* — strings de permisos del JWT
├── directives/
│   └── v-permission.js              # Oculta elementos del DOM sin permiso
├── layouts/
│   ├── AppLayout.vue                # Layout base (sidebar + navbar + router-view)
│   ├── AdminLayout.vue              # Layout admin (filtra menú por permisos + Suspense)
│   ├── ClienteLayout.vue            # Layout cliente
│   └── AppLayout.skeleton.vue       # Skeleton de carga
├── router/
│   ├── index.js                     # Combina rutas + aplica authGuard
│   ├── guards/
│   │   └── authGuards.js            # Guard de 5 pasos (auth, rol, permiso)
│   └── routes/
│       ├── authRoutes.js            # Rutas públicas
│       ├── adminRoutes.js           # Rutas admin + adminMenuItems
│       └── clienteRoutes.js         # Rutas cliente + clienteMenuItems
├── stores/
│   └── auth.js                      # Auth store (login, logout, restoreSession, refresh)
├── utils/
│   ├── error.handler.js             # Manejo centralizado de errores Axios
│   ├── formats.date.js              # Formateo de fechas (Luxon, Colombia)
│   └── swal.js                      # Wrappers de SweetAlert2
└── views/
    ├── auth/                        # Login, Registro, SeleccionSede, ForgotPassword
    ├── administrador/               # 18 vistas admin (Dashboard, Clientes, Sedes, etc.)
    └── cliente/                     # 14 vistas cliente (Inicio, Mensualidad, PQRS, etc.)
```

---

## Arquitectura Clave

### Autenticación

- **JWT** con access token + refresh token
- **Auto-refresh**: interceptor de Axios maneja 401 automáticamente con cola de peticiones
- **Persistencia**: `pinia-plugin-persistedstate` guarda token/user/role en localStorage
- **Restore**: al recargar la página, `restoreSession()` decodifica el JWT y restaura el estado

### Control de Acceso (RBAC) — 3 capas

| Capa | Mecanismo | Archivo |
|:---|:---|:---|
| **Ruta** | `authGuard` verifica `meta.role` y `meta.permission` | `router/guards/authGuards.js` |
| **Componente** | `useAuth()` → `hasPermission()`, `hasAnyPermission()` | `composables/useAuth.js` |
| **DOM** | `v-permission` elimina elementos sin permiso | `directives/v-permission.js` |

> **Bypass**: usuarios con rol `SUPER-ADMIN` o `ADMIN` tienen acceso total sin importar permisos.

### API Layer

- **22 servicios** en `api/services/`, cada uno como singleton (`export default new Service()`)
- **Dos patrones de error**: `handleError` (retorna objeto) o `throw` (lanza error)
- **Servicios que lanzan**: `SedesService`, `RolService`, `SedesDisponibilidadService`

---

## Documentación Completa

Toda la documentación del proyecto está en [`doc/`](./doc/):

| Sección | Contenido |
|:---|:---|
| [Getting Started](./doc/getting-started/SETUP.md) | Setup, convenciones, cómo agregar features |
| [API](./doc/api/README.md) | Axios, 22 servicios, manejo de errores |
| [Router](./doc/router/README.md) | Rutas, guards, menús |
| [Stores](./doc/stores/README.md) | Auth store, persistencia |
| [Componentes](./doc/components/README.md) | Shared, modals, aside |
| [Composables](./doc/composables/useAuth.md) | useAuth — permisos |
| [Utils](./doc/utils/README.md) | Error handler, fechas, SweetAlert2 |
| [Arquitectura](./doc/PLATFORM_FLOW.md) | Flujo end-to-end de la plataforma |
| [Permisos (RBAC)](./doc/architecture/RBAC.md) | Sistema de permisos detallado |
| [Requerimientos Funcionales Admin](./doc/admin/RF-REFERENCE.md) | Tabla maestra RF-001 a RF-018, mapeo a vistas y permisos |
| [Guía de Diseño](./doc/DESIGN-GUIDE.md) | Tokens, componentes, animaciones — para replicar el sistema de diseño |
| [Design Tokens](./doc/design/TOKENS.md) | Colores, tipografía, iconos |

---

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|:---|:---|:---|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000/api` |

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Convenciones de Código

- **JavaScript** (no TypeScript)
- **Composition API** con `<script setup>`
- Alias `@` para imports desde `src/`
- Servicios como clases singleton con `handleError`
- Permisos siempre vía `PERMS.*` (nunca strings literales)

Ver [CONVENTIONS.md](./doc/getting-started/CONVENTIONS.md) para detalles completos.

---

*Digital6G — Sistema de gestión de parqueaderos.*
