# Documentación — Digital6G Frontend

Sistema de gestión de parqueaderos. Vue 3 + Vite + Pinia + Tailwind CSS.

---

## Inicio Rápido

| Documento | Contenido |
|:---|:---|
| [Setup](./getting-started/SETUP.md) | Instalación, variables de entorno, scripts |
| [Convenciones](./getting-started/CONVENTIONS.md) | Naming, imports `@`, patrones de código |
| [Agregar Features](./getting-started/ADDING_FEATURES.md) | Cómo agregar rutas, vistas, permisos, servicios |

## Documentación por Área

| Área | Documentos |
|:---|:---|
| **API** | [README](./api/README.md) · [Axios](./api/AXIOS_CONFIG.md) · [Servicios](./api/SERVICES_REFERENCE.md) · [Errores](./api/ERROR_HANDLING.md) |
| **Router** | [README](./router/README.md) · [Rutas](./router/ROUTES_REFERENCE.md) · [Guards](./router/GUARDS.md) |
| **Stores** | [README](./stores/README.md) · [Auth Store](./stores/AUTH_STORE.md) |
| **Componentes** | [README](./components/README.md) · [Shared](./components/shared/) · [Modals](./components/modals/README.md) · [Aside](./components/aside/README.md) |
| **Composables** | [useAuth](./composables/useAuth.md) |
| **Utils** | [README](./utils/README.md) · [Error Handler](./utils/error.handler.md) · [Fechas](./utils/formats.date.md) · [SweetAlert2](./utils/swal.md) |

## Arquitectura

| Documento | Contenido |
|:---|:---|
| [Flujo de la Plataforma](./PLATFORM_FLOW.md) | End-to-end: desde el login hasta cada módulo de negocio |
| [Sistema de Permisos (RBAC)](./architecture/RBAC.md) | JWT, v-permission, useAuth, authGuard |
| [Layouts](./architecture/LAYOUTS.md) | Jerarquía de layouts, Suspense, skeletons |

## Diseño

| Documento | Contenido |
|:---|:---|
| [Design Tokens](./design/TOKENS.md) | Colores, tipografía, iconos SVG, botones, modales |

---

> **Nota:** Esta documentación está en proceso de reorganización. Los documentos existentes son válidos y actualizados.
