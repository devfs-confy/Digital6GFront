# Capa de API - Digital6G

Esta sección documenta la arquitectura y el funcionamiento de la capa de comunicación con el backend del proyecto Digital6G.

## Estructura de Archivos

```text
src/
├── api/
│   ├── axios.js                          # Configuración central de Axios e interceptores.
│   └── services/
│       ├── admin.service.js             # Gestión de administradores y operadores.
│       ├── client.service.js             # Gestión de clientes (CRUD + estado).
│       ├── rol.service.js                # Gestión de roles y permisos (RBAC).
│       ├── sedes.service.js              # Administración de sedes + disponibilidad.
│       ├── sedesdisponibilidad.service.js # Consulta y ajuste de disponibilidad (legacy).
│       ├── mensualidades.service.js      # Gestión de contratos de mensualidad (admin/cliente).
│       ├── tarifas.service.js            # Consulta de tarifas del sistema.
│       ├── payment.service.js            # Procesamiento de pagos de mensualidades.
│       └── codigovalidacion.service.js   # Validación de códigos de seguridad/verificación.
└── utils/
    └── error.handler.js                  # Utilidad centralizada para manejo de errores Axios.
```

## Principios de Diseño

1. **Singleton Pattern**: Cada servicio se exporta como una instancia única (`new Service()`), garantizando que no haya instancias duplicadas durante la sesión.
2. **Intercepción Centralizada**: La autenticación y el refresco de tokens se manejan automáticamente en `axios.js`, sin necesidad de lógica manual en cada servicio.
3. **Manejo de Errores**: Dos patrones — `handleError` (retorna objeto) o `throw` (lanza error). Ver [Manejo de Errores](./ERROR_HANDLING.md).

## Autenticación

El sistema utiliza **JSON Web Tokens (JWT)**. El token se almacena en el `localStorage` bajo la clave `auth` (gestionado por Pinia con `pinia-plugin-persistedstate`) y se adjunta automáticamente a todas las peticiones salientes mediante el interceptor de peticiones de Axios.

## Servicios Disponibles

| Servicio | Dominio | Archivo |
|:---|:---|:---|
| `AdminServices` | Usuarios admin | `admin.service.js` |
| `ClientService` | Usuarios cliente | `client.service.js` |
| `AuthService` | Auth (forgot/reset password) | `auth.service.js` |
| `MensualidadesService` | Mensualidades | `mensualidades.service.js` |
| `PaymentsService` | Pagos (legacy) | `payment.service.js` |
| `PagosService` | Pagos (pasarela) | `pagos.service.js` |
| `SedesService` | Sedes + disponibilidad | `sedes.service.js` |
| `SedesDisponibilidadService` | Disponibilidad (legacy) | `sedesdisponibilidad.service.js` |
| `AutorizacionesService` | Autorizaciones | `autorizaciones.service.js` |
| `CodigosService` | Generar códigos | `codigos.service.js` |
| `CodigoValidationService` | Validar códigos | `codigovalidacion.service.js` |
| `RolService` | Roles y permisos | `rol.service.js` |
| `TarifasService` | Tarifas | `tarifas.service.js` |
| `BannerService` | Publicidad/banners | `banner.service.js` |
| `ClientBillService` | Facturación cliente | `clientefactura.service.js` |
| `ComunidadUccService` | Comunidad UCC | `comunidadUcc.service.js` |
| `ConsignacionesService` | Consignaciones/arqueos | `consignaciones.service.js` |
| `FacturacionService` | Facturación admin | `facturacion.service.js` |
| `FacturaService` | Facturas POS + estado | `factura.service.js` |
| `ModalidadesPagosService` | Modalidades de pago | `modalidades.pagos.js` |
| `NotificacionesService` | Notificaciones | `notificaciones.service.js` |
| `ParqueosService` | Historial parqueos | `parqueos.service.js` |
| `PqrsService` | PQRS | `pqrs.service.js` |
| `ReglasEstacionamientoService` | Reglas de acceso | `reglas.estacionamiento.service.js` |

---

Para más detalles, consulta:
- [Configuración de Axios e Interceptores](./AXIOS_CONFIG.md)
- [Referencia Completa de Servicios](./SERVICES_REFERENCE.md)
- [Manejo de Errores](./ERROR_HANDLING.md)
