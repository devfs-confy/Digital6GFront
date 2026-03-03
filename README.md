# Digital6G Frontend

Sistema de gestión para **Digital6G**, desarrollado con Vue 3 y Vite. Esta aplicación proporciona una interfaz robusta y reactiva para administradores, operadores y clientes, facilitando la gestión de sedes, mensualidades y servicios de transporte.

---

## Tecnologías Principales

El proyecto utiliza un stack moderno y eficiente diseñado para la escalabilidad:

- **[Vue 3](https://vuejs.org/) (v3.5.25)**: Framework progresivo con Composition API y `<script setup>`.
- **[Vite](https://vitejs.dev/) (v7.3.1)**: Herramienta de construcción ultra rápida para el desarrollo frontend moderno.
- **[Tailwind CSS](https://tailwindcss.com/) (v3.4.17)**: Framework de CSS "utility-first" para un diseño rápido y personalizado.
- **[Pinia](https://pinia.vuejs.org/) (v3.0.2)**: Almacén de estado intuitivo y tipado para Vue.
- **[Vue Router](https://router.vuejs.org/) (v4.x)**: Enrutador oficial para aplicaciones Single Page (SPA).

---

## Paquetes y Dependencias Clave

| Paquete | Versión | Propósito |
| :--- | :--- | :--- |
| `axios` | `^1.13.5` | Cliente HTTP para comunicación con el Backend. |
| `flowbite` | `3.1.2` | Biblioteca de componentes de UI basada en Tailwind CSS. |
| `pinia-plugin-persistedstate` | `^4.7.1` | Persistencia del estado de Pinia en `localStorage`. |
| `luxon` | `3.6.1` | Manejo avanzado de fechas y tiempos. |
| `sweetalert2` | `11.19.1` | Modales y notificaciones elegantes. |
| `chart.js` & `vue-chartjs` | `^4.5.1` / `^5.3.3` | Generación de reportes y gráficas estadísticas. |
| `qrcode` | `1.5.4` | Generación de códigos QR para validaciones. |
| `@vueuse/core` | `13.0.0` | Colección de utilidades esenciales para Vue Composition API. |

---

## Estructura del Proyecto

El proyecto sigue una organización modular basada en responsabilidades:

```text
src/
├── api/                  # Configuración de Axios y servicios de API por módulo.
│   └── services/         # Clases de servicio (admin, clientes, roles, sedes, pagos, etc).
├── assets/               # Recursos estáticos (imágenes, SVGs) y estilos globales.
├── components/           # Componentes reutilizables.
│   ├── modals/           # Ventanas modales específicas del sistema.
│   └── shared/           # Componentes comunes (Navbar, Sidebar).
├── composables/          # Lógica reutilizable con Composition API.
│   └── useAuth.js        # Validación de permisos y acceso al estado de sesión.
├── constants/            # Constantes centralizadas del sistema.
│   └── permisions.js     # Objeto PERMS con todos los strings de permisos.
├── directives/           # Directivas Vue personalizadas.
│   └── v-permission.js   # Directiva para control de visibilidad por permiso.
├── layouts/              # Envoltorios de diseño (Admin, Cliente, Operador).
├── router/               # Configuración de rutas y guardias de navegación.
│   ├── guards/           # authGuards.js con lógica RBAC de 5 pasos.
│   └── routes/           # Rutas separadas por rol (auth, admin, cliente, operador).
├── stores/               # Estado global de la aplicación (Autenticación).
├── views/                # Vistas principales divididas por roles de usuario.
│   ├── administrador/    # Vistas del panel de administración.
│   ├── auth/             # Login, Registro y página de acceso no autorizado.
│   └── cliente/          # Vistas del portal del cliente.
└── App.vue               # Componente raíz de la aplicación.
```

---

## Puntos Importantes

### 1. Gestión de API y Autenticación

La capa de API (`src/api/`) cuenta con un sistema de **interceptores** que gestiona automáticamente el envío de tokens JWT y el **refresco de sesión** sin intervención manual del desarrollador.

> Consulta la [Documentación de la API](./doc/api/README.md) para más detalles.

### 2. Sistema de Roles y Permisos (RBAC)

Las rutas están protegidas mediante un guardia de navegación de 5 pasos (`src/router/guards/authGuards.js`) que verifica autenticación, rol y permisos específicos antes de permitir el acceso a cualquier módulo.

La aplicación implementa tres capas de control:
- **Capa de Ruta**: El `authGuard` bloquea la navegación según `meta.role` y `meta.permission`.
- **Capa de Componente**: El composable `useAuth` expone funciones de validación (`hasPermission`, `hasAllPermissions`).
- **Capa de DOM**: La directiva `v-permission` elimina elementos del DOM si el usuario no tiene el permiso necesario.

> Consulta la [Guía del Sistema de Permisos](./doc/V_PERMISSION_IMPLEMENTATION.md) para la implementación completa.

### 3. Diseño Responsivo

Gracias a Tailwind CSS y Flowbite, la aplicación es totalmente compatible con dispositivos móviles y escritorio, adaptando los layouts según la resolución de pantalla.

---

## Documentación del Sistema

Para un mayor detalle sobre la arquitectura y el funcionamiento interno, consulta las siguientes guías:

- **[Capa de API](./doc/api/README.md)**: Configuración de Axios, interceptores y referencia de servicios.
- **[Enrutamiento](./doc/router/README.md)**: Definición de rutas, guardias de seguridad y RBAC.
- **[Gestión de Estado](./doc/stores/README.md)**: Estructura de Pinia stores y persistencia de sesión.
- **[Sistema de Permisos (V-Permission)](./doc/V_PERMISSION_IMPLEMENTATION.md)**: Guía completa sobre cómo funciona y cómo implementar la validación de permisos en el sistema.

---

## Instalación y Desarrollo

1. **Clonar el repositorio**
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**:
   Crea un archivo `.env` basado en `.env.development` y configura `VITE_API_URL`.
4. **Ejecutar modo desarrollo**:
   ```bash
   npm run dev
   ```
5. **Generar estilos Tailwind** (opcional para watch dinámico):
   ```bash
   npm run style
   ```

---

*Digital6G - Desarrollado con dedicación para la eficiencia en transporte y gestión.*
