# Sistema de Enrutamiento (Vue Router)

El sistema de rutas de Digital6G está diseñado de forma modular y protegida por un sistema de **Role-Based Access Control (RBAC)**. Utiliza `vue-router` para la navegación SPA.

## 📁 Estructura del Directorio

- `index.js`: Punto de entrada principal donde se instancia el router y se aplican los guardias globales.
- `guards/`: Contiene la lógica de protección de rutas (`authGuards.js`).
- `routes/`: Definiciones de rutas segmentadas por responsabilidad:
  - `authRoutes.js`: Rutas públicas (Login, Registro).
  - `clienteRoutes.js`: Rutas privadas para el rol de Cliente.
  - `adminRoutes.js`: Rutas privadas para el rol de Administrador.
  - `operadorRoutes.js`: Rutas para el rol de Operador (Actualmente en desarrollo).

## 🚀 Configuración Global

El router utiliza el modo de historial web (`createWebHistory`) para URLs limpias. Todas las rutas se inyectan en el array principal y se protegen mediante un `beforeEach` que ejecuta el `authGuard`.

```javascript
router.beforeEach(authGuard);
```

## 🔗 Referencia Rápida
- [Guardias de Navegación y Seguridad](./GUARDS.md)
- [Listado de Rutas y Menús](./ROUTES_REFERENCE.md)
