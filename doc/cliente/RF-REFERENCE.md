# Referencia de Requerimientos Funcionales — Módulo Cliente

> Documento maestro de trazabilidad entre requerimientos funcionales (RF) y su implementación en código.
> Formato de comentarios en código: `<!-- RF-XXX.N: Descripción -->` (template) y `// RF-XXX.N: Descripción` (script).

---

## Tabla Maestra

| RF | Nombre | Vista | Archivo | Módulo |
|----|--------|-------|---------|--------|
| RF-021 | Registro de clientes | Registro | `src/views/auth/RegistroVista.vue` | Auth |
| RF-022 | Autenticación de clientes | Login | `src/views/auth/LoginVista.vue` | Auth |
| RF-023 | Gestión de información del cliente | Editar Información | `src/views/cliente/EditarInformacion.vue` | Cliente |
| RF-024 | Pago de mensualidad | Mensualidad | `src/views/cliente/Mensualidad.vue` | Cliente |
| RF-025 | Selección y validación de sede | Selección Sede / Mensualidad | `src/views/auth/SeleccionSede.vue` / `src/views/cliente/Mensualidad.vue` | Auth / Cliente |
| RF-026 | Marcación para Facturación Electrónica (FE) | Editar Información / Mensualidad | `src/views/cliente/EditarInformacion.vue` / `src/views/cliente/Mensualidad.vue` | Cliente |
| RF-028 | Cambio de placas / tarjeta | Mensualidad | `src/views/cliente/Mensualidad.vue` | Cliente |
| RF-029 | Consultar historial de pagos | Pagos Recientes | `src/views/cliente/PagosRecientes.vue` | Cliente |
| RF-030 | Consultar historial de entradas y salidas | Parqueos / Transacciones | `src/views/cliente/ParqueosReciente.vue` / `src/views/cliente/Transacciones.vue` | Cliente |
| RF-032 | Enviar PQRS | PQRS / Solicitudes / Peticiones | `src/views/cliente/PQRS.vue` / `Solicitudes.vue` / `Peticiones.vue` | Cliente |
| RF-033 | Pago de tarjeta (nueva/reposición) | Mensualidad | `src/views/cliente/Mensualidad.vue` | Cliente |
| RF-034 | Pagos quincenales | Mensualidad | `src/views/cliente/Mensualidad.vue` | Cliente |
| RF-035 | Pago de recarga 20 días (UCC) | Mensualidad | `src/views/cliente/Mensualidad.vue` | Cliente |
| RF-038 | Gestión de pagos de varias mensualidades | Mensualidad | `src/views/cliente/Mensualidad.vue` | Cliente |

---

## Detalle por Requerimiento Funcional

### RF-021 · Registro de clientes
**Archivo:** `src/views/auth/RegistroVista.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Formulario de registro con información básica y credenciales | `<template>` — panel de formulario, campos de entrada |
| 2 | Búsqueda de documento (auto-llenado si existe) | `<template>` — input de documento; `<script>` — búsqueda debounced |
| 3 | Registro estudiante UCC condicional | `<template>` — checkbox y campos UCC; `<script>` — lógica condicional |
| 4 | Selección de sede y vehículo | `<template>` — selects de sede, tipo vehículo, placas |
| 5 | Términos y condiciones | `<template>` — checkbox de términos |
| 6 | Envío de registro y modal de éxito | `<template>` — botón submit, modal éxito; `<script>` — `guardarRegistro`, validación |

---

### RF-022 · Autenticación de clientes
**Archivo:** `src/views/auth/LoginVista.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Login con correo electrónico o documento | `<template>` — inputs usuario y contraseña |
| 2 | Validación de credenciales | `<script>` — `login`, llamada a API auth |
| 3 | Enlace a recuperar contraseña | `<template>` — "Olvidé mi contraseña" |
| 4 | Enlace a registro de nuevo cliente | `<template>` — "¿No tienes cuenta? Regístrate" |
| 5 | Mensajes de error de autenticación | `<template>` — alerta de error; `<script>` — manejo de error |

---

### RF-023 · Gestión de información del cliente
**Archivo:** `src/views/cliente/EditarInformacion.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Consultar información personal | `<template>` — vista de datos personales; `<script>` — carga inicial |
| 2 | Modificar nombre, apellidos, teléfono, correo | `<template>` — inputs editables; `<script>` — guardar cambios |
| 3 | Modificar contraseña | `<template>` — sección de contraseña; `<script>` — cambio de contraseña |
| 4 | Solicitar desactivación de cuenta | `<template>` — botón desactivar (nota en UI) |
| 5 | Avatar e iniciales del cliente | `<template>` — avatar con iniciales |

---

### RF-024 · Pago de mensualidad
**Archivo:** `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Grid de mensualidades del cliente logueado | `<template>` — grid de tarjetas; `<script>` — `cargarMisMensualidades` |
| 2 | Estado de mensualidad (activa, por vencer, vencida, congelada, pendiente) | `<template>` — badges, banda superior, colores; `<script>` — helpers de estado |
| 3 | Contador de días restantes | `<template>` — caja de días; `<script>` — `diasRestantes` |
| 4 | Barra de progreso de vigencia | `<template>` — barra de progreso; `<script>` — `porcentajeVigencia` |
| 5 | Pago desde web, cualquier dispositivo | `<template>` — botón "Pagar"; `<script>` — `confirmarPago`, `ejecutarPago` |
| 6 | Fecha inicio automática (día siguiente al registro) | `<script>` — fecha por defecto en creación |
| 7 | Fecha inicio definida manualmente por cliente | `<template>` — input fecha inicio manual; `<script>` — `fechaInicioManual` |
| 8 | Si mensualidad activa, sumar 30 días a vencimiento | `<script>` — lógica de extensión de fechas en backend |
| 9 | Pagar hasta 2 períodos mensuales en un solo pago | `<template>` — selector 1-2 meses; `<script>` — `mesesExtra`, `seleccionarMesesExtra` |
| 10 | Notificaciones diarias 6 días antes del vencimiento | Backend-triggered; UI: notificaciones en `Notificaciones.vue` |
| 11 | Pago pendiente: advertencia y redirección | `<template>` — bloque pago pendiente; `<script>` — `pagoPendiente` |
| 12 | Excedente por cambio de autorización (carro→moto/moto→carro) | `<template>` — resumen de excedente; `<script>` — `infoExcedente` |
| 13 | Datos personales para pasarela de pago (AvalPay) | `<template>` — formulario facturación; `<script>` — `avalpayinformacion` |
| 14 | Modal de consentimiento para pagos | `<template>` — modal de consentimiento; `<script>` — aceptación de términos |
| 15 | Redirección a pasarela de pago tras confirmar | `<script>` — redirección a URL de pago |

---

### RF-025 · Selección y validación de sede
**Archivos:** `src/views/auth/SeleccionSede.vue`, `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Listado de sedes disponibles para selección | `SeleccionSede.vue` `<template>` — grid de sedes; `<script>` — carga de sedes |
| 2 | Selección de sede al registrarse | `SeleccionSede.vue` `<template>` — cards clickeables; `<script>` — navegación post-selección |
| 3 | Selector de sede en modal de pago | `Mensualidad.vue` `<template>` — `<select>` de sede en modal; `<script>` — `cambiarSede`, `sedeInput` |
| 4 | Sedes adicionales con acceso (universidades compartidas) | `Mensualidad.vue` `<template>` — listado "Puede ingresar a las siguientes sedes"; `<script>` — `getSedesAccess` |
| 5 | Carga de opciones de pago según sede seleccionada | `Mensualidad.vue` `<script>` — watch sobre `sedeInput` |

---

### RF-026 · Marcación para Facturación Electrónica (FE)
**Archivos:** `src/views/cliente/EditarInformacion.vue`, `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Marcar/desmarcar requerimiento de FE en perfil | `EditarInformacion.vue` (nota en UI — campo pendiente de implementación) |
| 2 | Datos de facturación en proceso de pago (tipo doc, documento, nombre, apellido, teléfono, correo) | `Mensualidad.vue` `<template>` — sección "Datos personales" en modal de pago; `<script>` — `avalpayinformacion` |
| 3 | Pre-carga de datos de usuario logueado en formulario de pago | `Mensualidad.vue` `<script>` — precarga desde token JWT |
| 4 | Modal de facturación / consentimiento | `Mensualidad.vue` `<template>` — modales de facturación y consentimiento |

---

### RF-028 · Cambio de placas / tarjeta
**Archivo:** `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Visualización de placas registradas en tarjeta de mensualidad | `<template>` — badges de placas con ícono de carro |
| 2 | Solicitud de cambio de placas (hasta 2 máximo; 3+ vía PQRS) | `<template>` — modal de cambio de placas; `<script>` — `modalCambioPlacas`, `nuevasPlacas` |
| 3 | Advertencia de 1 cambio por mes | `<template>` — alerta en modal de cambio |
| 4 | Cambio de autorización con excedente (carro→moto/moto→carro) | `<template>` — banner de excedente; `<script>` — `infoExcedente`, `infoAutorizacion` |
| 5 | Pago de excedente por cambio de autorización | `<template>` — resumen de excedente en modal; `<script>` — confirmación con excedente |
| 6 | Botón "Perdí mi tarjeta" (reposición) | `<template>` — `btnTarjeta`; `<script>` — `modalTarjeta`, `confirmarTarjetaPerdida` |
| 7 | Recordatorio de reclamo de tarjeta al pagar | `<template>` — recordatorio en flujo de pago |

---

### RF-029 · Consultar historial de pagos
**Archivo:** `src/views/cliente/PagosRecientes.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Visualizar últimos cinco pagos por sede | `<template>` — tabla de pagos agrupada por sede |
| 2 | Resumen global de pagos | `<template>` — header con resumen; `<script>` — computeds de totales |
| 3 | Detalle de factura: número, fecha, valor, estado | `<template>` — filas de factura |
| 4 | Descarga de factura electrónica (PDF) | `<template>` — botón descargar; `<script>` — `descargarFactura` |
| 5 | Estados de carga y error | `<template>` — skeleton, error, vacío |

---

### RF-030 · Consultar historial de entradas y salidas
**Archivos:** `src/views/cliente/ParqueosReciente.vue`, `src/views/cliente/Transacciones.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Ver registros de entradas y salidas por sede | `ParqueosReciente.vue` `<template>` — tabla de accesos; `<script>` — `cargarAccesos` |
| 2 | Filtros por placa, fecha, tipo de vehículo | `ParqueosReciente.vue` `<template>` — inputs de filtro |
| 3 | Selector de sede para consultar parqueos | `ParqueosReciente.vue` `<template>` — select de sede |
| 4 | Ver historial de transacciones de pago | `Transacciones.vue` `<template>` — tabla de transacciones; `<script>` — `cargarTransacciones` |
| 5 | Resumen de totales pagados | `Transacciones.vue` `<template>` — resumen; `<script>` — `totalPagado` |
| 6 | Badges de estado de transacción | `Transacciones.vue` `<template>` — badges en tabla |

---

### RF-032 · Enviar PQRS
**Archivos:** `src/views/cliente/PQRS.vue`, `src/views/cliente/Solicitudes.vue`, `src/views/cliente/Peticiones.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Formulario para enviar nueva PQRS | `PQRS.vue` `<template>` — modal "Nueva PQRS"; `<script>` — `crearPqrs`, `fN` |
| 2 | Tipos de PQRS: Petición, Queja, Reclamo, Sugerencia | `PQRS.vue` `<template>` — select de tipo; `<script>` — catálogo de tipos |
| 3 | Categorización por código de motivo (tabla backend) | `PQRS.vue` `<template>` — select de motivo; `<script>` — `cargarMotivos` |
| 4 | Descripción, asunto, imagen adjunta (JPG/PNG/WEBP ≤5MB) | `PQRS.vue` `<template>` — textarea, input file; `<script>` — `cargarImagenPqrs` |
| 5 | Pre-llenado de datos de contacto | `PQRS.vue` `<template>` — campos de contacto; `<script>` — prefill desde usuario |
| 6 | Relación con mensualidad (auto-selección si existe) | `PQRS.vue` `<template>` — select de mensualidad; `<script>` — `cargarMensualidades` |
| 7 | Historial de PQRS enviadas con estado (ABIERTO/EN_PROCESO/CERRADO) | `PQRS.vue` / `Solicitudes.vue` `<template>` — tabla/cards de historial; `<script>` — `cargarPqrs` |
| 8 | Ver detalle de PQRS con respuesta del admin | `PQRS.vue` / `Solicitudes.vue` `<template>` — modal detalle; `<script>` — `abrirDetalle` |
| 9 | Peticiones específicas (cambio autorización, cédula/NIT, sede, pago erróneo, Aval Pay, tarjetas, otros) | `Peticiones.vue` `<template>` — cards de peticiones; `<script>` — navegación programática |
| 10 | Seguimiento de estado y prioridad | `Solicitudes.vue` `<template>` — badges de estado/prioridad/tipo |

---

### RF-033 · Pago de tarjeta (nueva/reposición)
**Archivo:** `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Botón "Perdí mi tarjeta" en tarjeta de mensualidad (si `btnTarjeta` es true) | `<template>` — botón tarjeta perdida |
| 2 | Modal para confirmar pago de reposición de tarjeta | `<template>` — modal tarjeta perdida |
| 3 | Condición de habilitación según sede (`cobroTarjetaPermitido`) | `<script>` — `pagarDeshabilitado`, validación de tarjeta |
| 4 | Recordatorio de reclamo de tarjeta en flujo de pago | `<template>` — mensaje en modal de pago |

---

### RF-034 · Pagos quincenales
**Archivo:** `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Opción de plan quincenal en selector de modalidad (si habilitado por admin) | `<template>` — opciones con etiqueta `QUINCENA`; `<script>` — `esQuincena` |
| 2 | Diferenciación visual quincena vs mensual | `<template>` — labels en opciones de pago |
| 3 | Exclusión de congelación para mensualidades quincenales | `<script>` — `mostrarCongelar` (excluye quincenales) |
| 4 | Carga dinámica de opciones según autorización y sede | `<script>` — `cargarOpcionesPago`, `watch(sedeInput)` |

---

### RF-035 · Pago de recarga 20 días (UCC)
**Archivo:** `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Planes de recarga devueltos por backend según configuración admin | `<template>` — listado de planes disponibles |
| 2 | Reglas: opera 1 mes desde compra, no congelados, solo UCC motos | Backend / lógica de negocio en API |
| 3 | Información al usuario sobre reglas de recarga | `<template>` — avisos en modal de pago |

---

### RF-038 · Gestión de pagos de varias mensualidades asociadas a un mismo pagador
**Archivo:** `src/views/cliente/Mensualidad.vue`

| # | Funcionalidad | Ubicación aproximada |
|---|--------------|---------------------|
| 1 | Grid de todas las mensualidades asociadas al cliente logueado | `<template>` — grid `v-for="m in mensualidades"`; `<script>` — `cargarMisMensualidades` |
| 2 | Cada tarjeta muestra nombre, documento, sede, estado, placas, vigencia | `<template>` — contenido de tarjeta de mensualidad |
| 3 | Pago individual por mensualidad | `<template>` — botón "Pagar" por tarjeta; `<script>` — `abrirPago`, `mensualidadAccion` |
| 4 | Ver detalle de mensualidad | `<template>` — botón "Más info"; `<script>` — `abrirDetalle` |
| 5 | Añadir mensualidad por código | `<template>` — modal de código; `<script>` — `modalCodigo` |

---

## Vistas Auxiliares del Cliente (sin RF específico asignado)

| Vista | Archivo | Descripción |
|-------|---------|-------------|
| Dashboard cliente | `src/views/cliente/ClienteInicio.vue` | Grid de acceso a módulos + banners publicitarios |
| Notificaciones | `src/views/cliente/Notificaciones.vue` | Centro de notificaciones (vencimiento, PQRS, sistema) |
| Estado de transacción | `src/views/cliente/EstadoTransaccion.vue` | Resultado post-pago (aprobado/rechazado/pendiente) + PDF |
| Ver factura | `src/views/cliente/VerFactura.vue` | Visualización/descarga de factura en PDF |
| Tutorial | `src/views/cliente/Tutorial.vue` | Onboarding interactivo con pasos guiados, videos, imágenes |
| FAQs | `src/views/cliente/Faqs.vue` | Preguntas frecuentes con búsqueda en tiempo real y categorías |

---

## Convenciones de Comentarios en Código

### Template (HTML)
```html
<!-- RF-024.1: Grid de mensualidades del cliente — pago de mensualidad -->
<div class="grid grid-cols-2 ...">
  ...
</div>
```

### Script (JavaScript)
```javascript
// RF-024.5: Pago desde web, cualquier dispositivo — confirmación de pago
const confirmarPago = async () => {
  ...
}
```

### Múltiples RF en un bloque
```html
<!-- RF-024.2, RF-024.3: Estado de mensualidad y contador de días -->
```

---

> **Última actualización:** 2026-05-25
> **Versión:** 1.0
