# Referencia de Rutas y Menús

En Digital6G, las rutas y los menús laterales (`Sidebar.vue`) están íntimamente ligados a través de objetos de configuración.

---

## 🔐 Rutas de Autenticación (`authRoutes.js`)

Rutas accesibles para cualquier usuario no autenticado.

- `/login`: Formulario de inicio de sesión.
- `/registro`: Registro de nuevos clientes.

---

## 🛡️ Rutas Administrativas (`adminRoutes.js`)

**Ruta Base:** `/admin` (Requiere rol `"admin"` o `"administrador"`).

| Ruta Relativa | Componente | Descripción |
| :--- | :--- | :--- |
| `dashboard` | `Dashboard.vue` | Panel de control principal. |
| `clientes` | `Clientes.vue` | Gestión de clientes registrados. |
| `validar` | `ValidarMensualidades.vue` | Validación de pagos mensuales. |
| `solicitudes` | `Solicitudes.vue` | Bandeja de solicitudes administrativas. |
| `reportes` | `Reportes.vue` | Estadísticas y reportes del sistema. |
| `sedes` | `Sedes.vue` | Administración de sedes físicas. |
| `mensualidades` | `Mensualidades.vue` | Gestión de cobros y estados de mensualidad. |
| `usuarios` | `Usuarios.vue` | Administración de usuarios (operadores, otros admins). |
| `disponibilidad` | `VerDisponibilidad.vue` | Consulta de cupos en sedes. |
| `verificacion` | `Verificacion.vue` | Generación/validación de códigos de verificación. |
| `tarifas` | `Tarifas.vue` | Configuración de precios por servicio. |
| `tarjetas` | `Tarjetas.vue` | Gestión de medios de pago/identificación. |

---

## 👤 Rutas de Clientes (`clienteRoutes.js`)

**Ruta Base:** `/cliente` (Requiere rol `"cliente"`).

| Ruta Relativa | Componente | Descripción |
| :--- | :--- | :--- |
| `inicio` | `ClienteInicio.vue` | Panel principal del cliente. |
| `mensualidad` | `Mensualidad.vue` | Estado de su mensualidad actual. |
| `notificaciones` | `Notificaciones.vue` | Centro de notificaciones pendientes. |
| `peticiones` | `Peticiones.vue` | Formulario de PQRS y cambios. |
| `solicitudes` | `Solicitudes.vue` | Historial de solicitudes realizadas. |
| `parqueos` | `ParqueosReciente.vue` | Historial de uso de parqueaderos. |
| `pagos` | `PagosRecientes.vue` | Historial de facturación y pagos. |
| `informacion` | `EditarInformacion.vue` | Actualización de perfil personal. |
| `placa` | `CambioPlaca.vue` | Gestión de vehículos asociados. |

---

## 📋 Configuración de Menús

Cada archivo de ruta exporta un array de `MenuItems` que los componentes `Sidebar.vue` y `Navbar.vue` utilizan para renderizar la navegación:

```javascript
// adminMenuItems y clienteMenuItems contienen:
{
  label: "Nombre del Menú",
  icon: SVG_RAW_CONTENT,
  route: "/path/to/route"
}
```

- **Iconos**: Se importan como archivos SVG crudos (`?raw`) para permitir la inyección directa en el HTML y estilización dinámica.
