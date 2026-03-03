# Sistema de Enrutamiento (Vue Router)

El sistema de rutas de Digital6G está diseñado de forma modular y protegido por un sistema de **Role-Based Access Control (RBAC)**. Utiliza `vue-router` para la navegación SPA.

## Estructura del Directorio

```text
src/router/
├── index.js               # Punto de entrada: instancia el router y aplica el guardia global.
├── guards/
│   ├── authGuards.js      # Guardia principal con lógica RBAC de 5 pasos (auth, rol, permiso).
│   └── permission.guard.js # Guardia auxiliar de permisos (referencia, integrado en authGuard).
└── routes/
    ├── authRoutes.js      # Rutas públicas (Login, Registro).
    ├── clienteRoutes.js   # Rutas privadas para el rol de Cliente.
    ├── adminRoutes.js     # Rutas privadas para el rol de Administrador + adminMenuItems.
    └── operadorRoutes.js  # Rutas para el rol de Operador (actualmente inactivas/comentadas).
```

## Configuración Global

El router utiliza el modo de historial web (`createWebHistory`) para URLs limpias. Todas las rutas se inyectan en el array principal y se protegen mediante un `beforeEach` que ejecuta el `authGuard`.

```javascript
router.beforeEach(authGuard);
```

Rutas de fallback configuradas en `index.js`:
- `/` → Redirige a `/login`.
- `/:pathMatch(.*)*` → Redirige a `/login` (ruta comodín para 404).

## Estado de los Roles

| Rol | Estado | Descripción |
| :--- | :--- | :--- |
| `admin` / `administrador` | Activo | Acceso a `/admin/**` con permisos por módulo. |
| `cliente` | Activo | Acceso a `/cliente/**`. |
| `operador` | Inactivo | Rutas definidas pero comentadas en `index.js`. |

---

## Referencias
- [Guardias de Navegación y Seguridad](./GUARDS.md)
- [Listado de Rutas y Menús](./ROUTES_REFERENCE.md)
