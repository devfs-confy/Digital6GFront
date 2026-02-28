# Capa de API - Digital6G

Esta sección documenta la arquitectura y el funcionamiento de la capa de comunicación con el backend del proyecto Digital6G.

## 📁 Estructura de Archivos

- `src/api/axios.js`: Configuración central de Axios e interceptores.
- `src/api/services/`: Directorio que contiene las clases de servicio para cada módulo del sistema.
  - `admin.services.js`: Servicios específicos para administración.
  - `rol.services.js`: Gestión de roles y permisos.
  - `sedes.services.js`: Gestión de sedes.
  - `sedesdisponibilidad.service.js`: Consulta de disponibilidad en sedes.
  - `users.service.js`: Gestión de usuarios y clientes.

## 🚀 Principios de Diseño

1. **Singleton Pattern**: Cada servicio se exporta como una instancia única (`new Service()`).
2. **Intercepción Centralizada**: La autenticación y el refresco de tokens se manejan automáticamente en `axios.js`.
3. **Manejo de Errores**: Los servicios capturan errores básicos y los registran en consola, retornando datos limpios o lanzando excepciones según sea necesario.

## 🔐 Autenticación

El sistema utiliza **JSON Web Tokens (JWT)**. El token se almacena en el `localStorage` bajo la clave `auth` y se adjunta automáticamente a todas las peticiones salientes.

---
Para más detalles, consulta:
- [Configuración de Axios e Interceptores](./AXIOS_CONFIG.md)
- [Referencia de Servicios](./SERVICES_REFERENCE.md)
