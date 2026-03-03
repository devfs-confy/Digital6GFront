# Referencia de Rutas y Menús

En Digital6G, las rutas y los menús laterales (`Sidebar.vue`) están íntimamente ligados a través de objetos de configuración exportados desde cada archivo de rutas.

---

## Rutas de Autenticación (`authRoutes.js`)

Rutas públicas, accesibles sin autenticación.

| Ruta | Componente | Descripción |
| :--- | :--- | :--- |
| `/login` | `LoginVista.vue` | Formulario de inicio de sesión. |
| `/registro` | `RegistroVista.vue` | Registro de nuevos clientes. |
| `/unauthorized` | `Unauthorizedvista.vue` | Página de acceso denegado. |

---

## Rutas Administrativas (`adminRoutes.js`)

**Ruta Base:** `/admin`
**Meta global:** `{ requiresAuth: true, role: "admin" }`

| Ruta Relativa | Componente | Permiso requerido (`meta.permission`) |
| :--- | :--- | :--- |
| `dashboard` | `Dashboard.vue` | _(ninguno)_ |
| `clientes` | `Clientes.vue` | `PERMS.USUARIOS_VER` |
| `validar` | `ValidarMensualidades.vue` | `PERMS.MENSUALIDADES_VER` |
| `solicitudes` | `Solicitudes.vue` | `PERMS.MENSUALIDADES_VER` |
| `reportes` | `Reportes.vue` | `PERMS.SEDES_EDITAR` |
| `sedes` | `Sedes.vue` | `PERMS.SEDES_VER` |
| `mensualidades` | `Mensualidades.vue` | `PERMS.MENSUALIDADES_VER` |
| `usuarios` | `Usuarios.vue` | `PERMS.ROLES_VER` |
| `disponibilidad` | `VerDisponibilidad.vue` | `PERMS.CODIGOS_CREAR` |
| `verificacion` | `CodigoVerificacion.vue` | `PERMS.CODIGOS_CREAR` |
| `tarifas` | `Tarifas.vue` | `PERMS.CODIGOS_CREAR` |
| `tarjetas` | `Tarjetas.vue` | `PERMS.CODIGOS_CREAR` |
| `/admin` _(index)_ | — | Redirige a `/admin/dashboard` |

> Los usuarios con rol `SUPER-ADMIN` o `ADMIN` tienen acceso a todas las rutas sin importar el permiso requerido.

---

## Rutas de Clientes (`clienteRoutes.js`)

**Ruta Base:** `/cliente`
**Meta global:** `{ requiresAuth: true, role: "cliente" }`

| Ruta Relativa | Componente | Descripción |
| :--- | :--- | :--- |
| `inicio` | `ClienteInicio.vue` | Panel principal del cliente. |
| `mensualidad` | `Mensualidad.vue` | Estado de la mensualidad actual. |
| `notificaciones` | `Notificaciones.vue` | Centro de notificaciones pendientes. |
| `peticiones` | `Peticiones.vue` | Formulario de cambios y peticiones. |
| `solicitudes` | `Solicitudes.vue` | Historial de solicitudes realizadas. |
| `parqueos` | `ParqueosReciente.vue` | Historial de uso de parqueaderos. |
| `pagos` | `PagosRecientes.vue` | Historial de facturación y pagos. |
| `informacion` | `EditarInformacion.vue` | Actualización de perfil personal. |
| `placa` | `CambioPlaca.vue` | Gestión de vehículos asociados. |
| `pqrs` | `PQRS.vue` | Canal de PQRS (Peticiones, Quejas, Reclamos). |
| `/cliente` _(index)_ | — | Redirige a `/cliente/inicio` |

> Las rutas de cliente no tienen `meta.permission`, ya que el acceso es irrestricto para el rol `cliente`.

---

## Configuración de Menús

Cada archivo de rutas exporta un array de `menuItems` que `AdminLayout.vue` y `ClienteLayout.vue` utilizan para renderizar la navegación lateral:

```javascript
// Estructura de un item de menú
{
  label: "Nombre del Menú",   // String, soporta HTML (<br> para saltos)
  icon: SVG_RAW_CONTENT,      // SVG importado con ?raw para estilización dinámica
  route: "/path/to/route",    // Ruta de destino
  permission: PERMS.XYZ,      // (Solo adminMenuItems) Permiso para mostrar el item
  activeFor: ["/path/a", "/path/b"] // Rutas que activan el estado "activo" del item
}
```

### Filtrado del Menú de Administración

`AdminLayout.vue` filtra `adminMenuItems` de forma reactiva antes de pasarlos al `Sidebar`:

```javascript
const menuFiltrado = computed(() => {
  return adminMenuItems.filter(item => {
    if (!item.permission) return true;         // Sin permiso = siempre visible
    if (esSuperAdmin || isAdmin) return true;  // Admins ven todo
    return authStore.user?.permisos?.includes(item.permission) ?? false;
  });
});
```

- **Iconos**: Se importan como archivos SVG crudos (`?raw`) para permitir la inyección directa en el HTML y la estilización dinámica con clases de Tailwind CSS.
