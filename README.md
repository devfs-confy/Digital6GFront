# Digital6G Frontend 🚀

Sistema de gestión para **Digital6G**, desarrollado con Vue 3 y Vite. Esta aplicación proporciona una interfaz robusta y reactiva para administradores, operadores y clientes, facilitando la gestión de sedes, mensualidades y servicios de transporte.

---

## 🛠 Tecnologías Principales

El proyecto utiliza un stack moderno y eficiente diseñado para la escalabilidad:

- **[Vue 3](https://vuejs.org/) (v3.5.25)**: Framework progresivo para construir interfaces de usuario utilizando la Composition API.
- **[Vite](https://vitejs.dev/) (v7.3.1)**: Herramienta de construcción ultra rápida para el desarrollo frontend moderno.
- **[Tailwind CSS](https://tailwindcss.com/) (v3.4.17)**: Framework de CSS "utility-first" para un diseño rápido y personalizado.
- **[Pinia](https://pinia.vuejs.org/) (v3.0.2)**: Almacén de estado intuitivo y tipado para Vue.
- **[Vue Router](https://router.vuejs.org/) (v4.x)**: Enrutador oficial para aplicaciones Single Page (SPA).

---

## 📦 Paquetes y Dependencias Clave

A continuación se listan las dependencias más importantes instaladas en el proyecto:

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

## 📂 Estructura del Proyecto

El proyecto sigue una organización modular basada en responsabilidades:

```text
src/
├── api/             # Configuración de Axios y servicios de API por módulo.
│   └── services/    # Clases para peticiones específicas (admin, sedes, etc).
├── assets/          # Recursos estáticos (imágenes, SVGs) y estilos globales.
├── components/      # Componentes reutilizables.
│   ├── modals/      # Ventanas modales específicas del sistema.
│   └── shared/      # Componentes comunes (Navbar, Sidebar).
├── layouts/         # Envoltorios de diseño (Admin, Cliente, Operador).
├── router/          # Configuración de rutas y guardias de navegación.
├── stores/          # Estado global de la aplicación (Autenticación, etc).
├── views/           # Vistas principales divididas por roles de usuario.
│   ├── administrador/
│   ├── auth/        # Login y Registro.
│   └── cliente/
└── App.vue          # Componente raíz de la aplicación.
```

---

## 🔑 Puntos Importantes

### 1. Gestión de API y Autenticación
La capa de API (`src/api/`) cuenta con un sistema de **interceptores** que gestiona automáticamente el envío de tokens JWT y el **refresco de sesión** sin intervención manual del desarrollador.

> 📄 Consulta la [Documentación de la API](./doc/api/README.md) para más detalles.

### 2. Sistema de Roles (RBAC)
Las rutas están protegidas mediante guardias de navegación (`src/router/guards/`) que verifican los permisos del usuario antes de permitir el acceso a módulos de Administración, Operación o Cliente.

### 3. Diseño Responsivo
Gracias a Tailwind CSS y Flowbite, la aplicación es totalmente compatible con dispositivos móviles y escritorio, adaptando los layouts según la resolución de pantalla.

---

## 🚀 Instalación y Desarrollo

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

*Digital6G - Desarrollado con ❤️ para la eficiencia en transporte y gestión.*
