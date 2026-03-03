# Capa de API - Digital6G

Esta sección documenta la arquitectura y el funcionamiento de la capa de comunicación con el backend del proyecto Digital6G.

## Estructura de Archivos

```text
src/api/
├── axios.js                          # Configuración central de Axios e interceptores.
└── services/
    ├── admin.services.js             # Gestión de administradores y operadores.
    ├── client.service.js             # Gestión de clientes registrados.
    ├── rol.services.js               # Gestión de roles y permisos (RBAC).
    ├── sedes.services.js             # Administración de sedes físicas.
    ├── sedesdisponibilidad.service.js # Consulta y ajuste de disponibilidad en sedes.
    ├── mensualidades.service.js      # Gestión de contratos de mensualidad.
    ├── payment.service.js            # Procesamiento de pagos de mensualidades.
    └── codigovalidacion.service.js   # Validación de códigos de seguridad/verificación.
```

## Principios de Diseño

1. **Singleton Pattern**: Cada servicio se exporta como una instancia única (`new Service()`), garantizando que no haya instancias duplicadas durante la sesión.
2. **Intercepción Centralizada**: La autenticación y el refresco de tokens se manejan automáticamente en `axios.js`, sin necesidad de lógica manual en cada servicio.
3. **Manejo de Errores**: Los servicios lanzan (`throw`) el error original del backend para que el componente pueda mostrar mensajes específicos (ej. usando `SweetAlert2`).

## Autenticación

El sistema utiliza **JSON Web Tokens (JWT)**. El token se almacena en el `localStorage` bajo la clave `auth` (gestionado por Pinia con `pinia-plugin-persistedstate`) y se adjunta automáticamente a todas las peticiones salientes mediante el interceptor de peticiones de Axios.

---

Para más detalles, consulta:
- [Configuración de Axios e Interceptores](./AXIOS_CONFIG.md)
- [Referencia Completa de Servicios](./SERVICES_REFERENCE.md)
