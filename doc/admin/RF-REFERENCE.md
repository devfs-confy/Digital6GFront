# Referencia de Requerimientos Funcionales — Módulo Administrador

> Documento maestro de trazabilidad entre requerimientos funcionales (RF) y su implementación en código.
> Formato de comentarios en código: `<!-- RF-XXX.N: Descripción — PERMISO -->` (template) y `// RF-XXX.N: Descripción — PERMISO` (script).

---

## Tabla Maestra

| RF | Nombre | Vista | Archivo | Permisos Principales |
|----|--------|-------|---------|---------------------|
| RF-001 | Dashboard | Dashboard | `src/views/administrador/Dashboard.vue` | `VER-USUARIOS`, `VER-SEDES`, `VER-MENSUALIDADES` |
| RF-002 | Administrar Tarifas | Administrar Tarifas | `src/views/administrador/AdministrarTarifas.vue` | `VER-SEDES`, `EDITAR-TARIFAS` |
| RF-003 | Autorizaciones | Autorizaciones | `src/views/administrador/Autorizaciones.vue` | `CREAR-CÓDIGOS`, `EDITAR-AUTORIZACIONES` |
| RF-004 | Banners / Publicidad | Banner | `src/views/administrador/Banner.vue` | `CREAR-CÓDIGOS`, `CREAR-PUBLICIDAD`, `EDITAR-PUBLICIDAD` |
| RF-005 | Clientes | Clientes | `src/views/administrador/Clientes.vue` | `VER-USUARIOS`, `EDITAR-USUARIOS`, `INACTIVAR-USUARIOS` |
| RF-006 | Códigos de Verificación | Código | `src/views/administrador/Codigo.vue` | `CREAR-CÓDIGOS` |
| RF-007 | Comunidad UCC | Comunidad UCC | `src/views/administrador/ComunidadUCC.vue` | `VER-USUARIOS` |
| RF-008 | Consignaciones | Consignación | `src/views/administrador/Consignacion.vue` | `EDITAR-SEDES` |
| RF-009 | Facturación | Facturación | `src/views/administrador/Facturacion.vue` | `EDITAR-SEDES`, `EDITAR-FACTURACIÓN` |
| RF-010 | Historial Cambio de Placas | Historial Cambio Placas | `src/views/administrador/HistorialCambioPlacas.vue` | `VER-MENSUALIDADES` |
| RF-011 | Historial de Pagos | Historial Pagos | `src/views/administrador/HistorialPagos.vue` | `VER-MENSUALIDADES` |
| RF-012 | Mensualidades | Mensualidades | `src/views/administrador/Mensualidades.vue` | `VER-MENSUALIDADES`, `EDITAR-MENSUALIDADES` |
| RF-013 | Modalidades de Pago | Modalidades Pagos | `src/views/administrador/ModalidadesPagos.vue` | `VER-SEDES`, `HABILITAR-QUINCENAS` |
| RF-014 | Roles | Roles | `src/views/administrador/Roles.vue` | `EDITAR-ROLES`, `VER-PERMISOS`, `ASIGNAR-PERMISOS`, `INACTIVAR-PERMISOS` |
| RF-015 | Sedes | Sedes | `src/views/administrador/Sedes.vue` | `VER-SEDES`, `CREAR-SEDES`, `EDITAR-SEDES`, `INACTIVAR-SEDES` |
| RF-016 | Solicitudes / PQRS | Solicitudes | `src/views/administrador/Solicitudes.vue` | `VER-MENSUALIDADES`, `ASIGNAR-PQRS`, `RESPONDER-PQRS`, `CREAR-PQRS-MOTIVO`, `EDITAR-PQRS-MOTIVO` |
| RF-017 | Usuarios Admin | Usuarios | `src/views/administrador/Usuarios.vue` | `VER-ROLES`, `EDITAR-ROLES` |
| RF-018 | Ver Disponibilidad | Ver Disponibilidad | `src/views/administrador/VerDisponibilidad.vue` | `VER-SEDES` |

---

## Detalle por Requerimiento Funcional

### RF-001 · Dashboard
**Archivo:** `src/views/administrador/Dashboard.vue`
**Permisos:** `VER-USUARIOS`, `VER-SEDES`, `VER-MENSUALIDADES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | KPIs: total clientes y disponibilidad por sede | `VER-USUARIOS` / `VER-SEDES` | `<script>` — bloques de datos `Usuarios`, `Sedes`, computed `usuariostotales`, `sedestotal` |
| 2 | Gráfica barras: mensualidades vencidas por sede | `VER-MENSUALIDADES` | `<template>` — card "Mensualidades vencidas"; `<script>` — datos y opciones de gráfica |
| 3 | Gráfica líneas: ingresos mensuales | `VER-MENSUALIDADES` | `<template>` — card "Ingresos mensuales"; `<script>` — datos y opciones de gráfica |
| 4 | Gráfica barras apiladas: disponibilidad carros/motos por sede | `VER-MENSUALIDADES` | `<template>` — card "Capacidad por sede"; `<script>` — `Sedesdata`, lógica de selección de sede |
| 5 | Tarjetas de acceso rápido filtradas por permisos | `PERMISOS` | `<template>` — grid de tarjetas; `<script>` — computed `opciones` |
| 6 | Carga paralela Promise.all al montar | `VER-SEDES` / `VER-USUARIOS` / `VER-MENSUALIDADES` | `<script>` — `onMounted` |

---

### RF-002 · Administrar Tarifas
**Archivo:** `src/views/administrador/AdministrarTarifas.vue`
**Permisos:** `VER-SEDES`, `EDITAR-TARIFAS`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Filtros en cascada: Sede → Tipo vehículo → Autorización | `VER-SEDES` | `<template>` — contenedor de filtros; `<script>` — `todasLasTarifas`, `sedes`, `catTiposVehiculo`, `catAutorizaciones`, `filtros`, `catAutorizacionesFiltradas`, watch de `idSede`, `cargarCatalogos`, `onFiltroChange`, `limpiarFiltros` |
| 2 | Tabla de tarifas con paginación server-side | `VER-SEDES` | `<template>` — tabla y paginación; `<script>` — `tarifas`, `loading`, estado de paginación, `cargarTarifas`, `irPagina`, `onLimitChange` |
| 3 | Editar tarifa: valor, descripción, estado | `EDITAR-TARIFAS` | `<template>` — botón editar, panel `AsideEditar`, modal confirmación; `<script>` — estado `modalEditar`/`tarifaActual`/`formEditar`, `confirmarGuardarTarifa`, `abrirEditar`, `guardarTarifa` |
| 4 | Estados: Activa / Inactiva con badge visual | `VER-SEDES` | `<template>` — celda de estado en cada fila |

---

### RF-003 · Autorizaciones
**Archivo:** `src/views/administrador/Autorizaciones.vue`
**Permisos:** `CREAR-CÓDIGOS`, `EDITAR-AUTORIZACIONES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Listar autorizaciones con filtro por sede | `CREAR-CÓDIGOS` | `<template>` — tabla con filtros; `<script>` — estado reactivo, filtros, paginación, carga API, helpers |
| 2 | Crear autorización: nombre, modalidad, valor, sede | `CREAR-CÓDIGOS` | `<template>` — botón crear, panel lateral crear/editar; `<script>` — panel lateral, formulario reactivo, abrir/crear/guardar |
| 3 | Toggle estado activo/inactivo | `EDITAR-AUTORIZACIONES` | `<template>` — toggle en tabla y formulario; `<script>` — toggle quincena/estado |
| 4 | Toggle prioridad Alta/Normal | `EDITAR-AUTORIZACIONES` | `<template>` — toggle prioridad; `<script>` — toggle prioridad |
| 5 | Toggle sincronización activa/inactiva | `EDITAR-AUTORIZACIONES` | `<template>` — toggle sincronización; `<script>` — toggle sincronización |

---

### RF-004 · Banners / Publicidad
**Archivo:** `src/views/administrador/Banner.vue`
**Permisos:** `CREAR-CÓDIGOS`, `CREAR-PUBLICIDAD`, `EDITAR-PUBLICIDAD`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Grid de cards con imagen, sede y estado | `CREAR-CÓDIGOS` | `<template>` — filtros, resumen, grid de cards, badges estado/sedes, paginación; `<script>` — estado reactivo grid, filtros, carga de publicidades e imágenes Base64 |
| 2 | Crear banner: título, imagen (Base64/FormData), sede destino | `CREAR-PUBLICIDAD` | `<template>` — botón crear, modal crear; `<script>` — abrir crear, handler de imagen, guardar (crear con FormData) |
| 3 | Editar banner: imagen, título, sede | `EDITAR-PUBLICIDAD` | `<template>` — botón editar, modal editar; `<script>` — abrir editar, guardar (editar con FormData) |
| 4 | Activar/desactivar banner por sede | `EDITAR-PUBLICIDAD` | `<template>` — botón gestionar sedes, modal sedes con toggle; `<script>` — abrir modal sedes, toggle activar/desactivar por sede |

---

### RF-005 · Clientes
**Archivo:** `src/views/administrador/Clientes.vue`
**Permisos:** `VER-USUARIOS`, `EDITAR-USUARIOS`, `INACTIVAR-USUARIOS`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Tabla paginada: búsqueda por nombre, documento, #ID mensualidad | `VER-USUARIOS` | `<template>` — buscador, tabla, paginación; `<script>` — estado listado, carga paginada, debounce, computed filtrado local |
| 2 | Filtro por sede y estado (activo/inactivo) | `VER-USUARIOS` | `<template>` — selects de sede y estado; `<script>` — filtros `filtroSede`/`filtroEstado`, carga con filtros |
| 3 | Registrar nuevo cliente: documento, nombres, apellidos, teléfono, email, contraseña, sede, placas, flags Old/Estudiante UCC/Estado; campos IdTarjeta + IdAutorización condicionales a modo Old | `VER-USUARIOS` | `<template>` — botón "Nuevo cliente", modal crear con todos los campos; `<script>` — abrir modal crear, guardar nuevo cliente con validaciones/campos condicionales |
| 4 | Editar cliente: nombres, apellidos, email, teléfono; cambio opcional de documento | `EDITAR-USUARIOS` | `<template>` — botón editar, aside editar; `<script>` — formulario reactivo editar, abrir editar, guardar cambios incluyendo documento |
| 5 | Activar/inhabilitar cliente con modal de confirmación | `INACTIVAR-USUARIOS` | `<template>` — botón activar/inhabilitar, modal confirmación; `<script>` — abrir modal cambio estado, ejecutar cambio en backend |
| 6 | Badges de IDs de mensualidades asociadas al cliente | `VER-USUARIOS` | `<template>` — badges en columna de tabla |

---

### RF-006 · Códigos de Verificación
**Archivo:** `src/views/administrador/Codigo.vue`
**Permisos:** `CREAR-CÓDIGOS`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Generar código de validación de un solo uso por sede | `CREAR-CÓDIGOS` | `<template>` — botón/formulario generar; `<script>` — método generar código |
| 2 | Historial de códigos generados en la sesión actual | `CREAR-CÓDIGOS` | `<template>` — lista/historial; `<script>` — estado del historial |
| 3 | Copiar código al portapapeles con feedback visual | `CREAR-CÓDIGOS` | `<template>` — botón copiar; `<script>` — método copiar con feedback |

---

### RF-007 · Comunidad UCC
**Archivo:** `src/views/administrador/ComunidadUCC.vue`
**Permisos:** `VER-USUARIOS`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Listado de estudiantes UCC registrados con búsqueda | `VER-USUARIOS` | `<template>` — buscador y tabla/listado; `<script>` — carga de estudiantes, filtro de búsqueda |
| 2 | Registro manual de estudiante: código, documento, nombres | `VER-USUARIOS` | `<template>` — formulario registro manual; `<script>` — guardar estudiante manual |
| 3 | Carga masiva desde archivo Excel (.xlsx / .xls) | `VER-USUARIOS` | `<template>` — input/upload de archivo; `<script>` — procesar archivo Excel |
| 4 | Validación de duplicados en carga masiva | `VER-USUARIOS` | `<script>` — validación de duplicados antes de guardar |

---

### RF-008 · Consignaciones
**Archivo:** `src/views/administrador/Consignacion.vue`
**Permisos:** `EDITAR-SEDES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Arqueos por sede y rango de fechas | `EDITAR-SEDES` | `<template>` — selectores de sede y fechas; `<script>` — carga de arqueos |
| 2 | Detalle de valores: efectivo, datáfono, producido total | `EDITAR-SEDES` | `<template>` — tabla/resumen de valores; `<script>` — cálculo de totales |
| 3 | Generación de reporte de consignación por fecha | `EDITAR-SEDES` | `<template>` — botón generar reporte; `<script>` — método generar reporte |
| 4 | Exportar/visualizar detalle del arqueo | `EDITAR-SEDES` | `<template>` — botón exportar/ver detalle; `<script>` — exportar/visualizar |

---

### RF-009 · Facturación
**Archivo:** `src/views/administrador/Facturacion.vue`
**Permisos:** `EDITAR-SEDES`, `EDITAR-FACTURACIÓN`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Configurar facturación por sede y módulo | `EDITAR-SEDES` | `<template>` — formulario configuración; `<script>` — carga/guardado de configuración |
| 2 | Definir rango de números de factura (inicio / fin) | `EDITAR-SEDES` | `<template>` — inputs rango inicio/fin; `<script>` — validación y guardado de rango |
| 3 | Barra de progreso que indica el porcentaje de uso del rango asignado | `EDITAR-SEDES` | `<template>` — barra de progreso; `<script>` — cálculo de porcentaje |
| 4 | Editar configuración | `EDITAR-FACTURACIÓN` | `<template>` — botón editar, panel/formulario; `<script>` — guardar edición |

---

### RF-010 · Historial Cambio de Placas
**Archivo:** `src/views/administrador/HistorialCambioPlacas.vue`
**Permisos:** `VER-MENSUALIDADES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Listado de solicitudes de cambio de placas con filtros de fecha | `VER-MENSUALIDADES` | `<template>` — filtros y tabla; `<script>` — carga con filtros |
| 2 | Detalle: placa anterior → placa nueva, estado (aplicado/pendiente), fecha solicitud | `VER-MENSUALIDADES` | `<template>` — aside/modal detalle; `<script>` — abrir detalle |
| 3 | Filtro por sede y por estado de solicitud | `VER-MENSUALIDADES` | `<template>` — selects de filtro; `<script>` — aplicación de filtros |

---

### RF-011 · Historial de Pagos
**Archivo:** `src/views/administrador/HistorialPagos.vue`
**Permisos:** `VER-MENSUALIDADES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Tabla de pagos/facturas con filtros por fecha, número de factura y CUS/transacción | `VER-MENSUALIDADES` | `<template>` — filtros y tabla; `<script>` — carga con filtros |
| 2 | Detalle de pago: subtotal, IVA, total, tipo de pago, módulo | `VER-MENSUALIDADES` | `<template>` — aside detalle; `<script>` — ver detalle |
| 3 | Filtro por sede | `VER-MENSUALIDADES` | `<template>` — select sede; `<script>` — filtro sede |
| 4 | Exportar datos de historial | `VER-MENSUALIDADES` | `<template>` — botón exportar; `<script>` — método exportar (si existe) |

> **Nota:** La funcionalidad de exportar (RF-011.4) no se detectó lógica implementada en la vista actual.

---

### RF-012 · Mensualidades
**Archivo:** `src/views/administrador/Mensualidades.vue`
**Permisos:** `VER-MENSUALIDADES`, `EDITAR-MENSUALIDADES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Tabla con búsqueda por nombre, documento, placa o #ID | `VER-MENSUALIDADES` | `<template>` — buscador y tabla; `<script>` — filtros y carga |
| 2 | Filtro por sede (obligatorio) y por estado | `VER-MENSUALIDADES` | `<template>` — selects sede y estado; `<script>` — `onSedeChange`, `onFiltroChange` |
| 3 | Editar mensualidad: nombre, NIT, empresa, fechas, estado, cobro tarjeta, hasta 5 placas, autorización | `EDITAR-MENSUALIDADES` | `<template>` — panel editar con campos; `<script>` — formulario edición, guardar |
| 4 | Ver detalle read-only: badges, estado, titular, autorización, vigencia, vehículos | `VER-MENSUALIDADES` | `<template>` — aside ver detalle; `<script>` — `abrirVerDetalle` |
| 5 | Modal últimos pagos: historial de facturas del cliente | `VER-MENSUALIDADES` | `<template>` — modal últimos pagos; `<script>` — carga historial pagos |
| 6 | Modal transacciones: sede de acceso, filtro fecha, tabla entrada/salida paginada | `VER-MENSUALIDADES` | `<template>` — modal transacciones; `<script>` — carga transacciones |
| 7 | Indicadores de vigencia: Activa / Por vencer / Vencida / Congelada / Pendiente | `VER-MENSUALIDADES` | `<template>` — badges de estado en tabla |
| 8 | Registrar nuevo cliente directamente desde este módulo | `VER-MENSUALIDADES` / `CREAR-USUARIOS` | No se detectó lógica implementada en la vista actual |

> **Nota:** La funcionalidad de registrar nuevo cliente (RF-012.8) no se detectó implementada en `Mensualidades.vue`.

---

### RF-013 · Modalidades de Pago
**Archivo:** `src/views/administrador/ModalidadesPagos.vue`
**Permisos:** `VER-SEDES`, `HABILITAR-QUINCENAS`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Listar modalidades asignadas a cada autorización | `VER-SEDES` | `<template>` — lista de autorizaciones; `<script>` — carga autorizaciones y conteos |
| 2 | Asignar/quitar modalidades a autorizaciones (mensual, quincena, recarga) | `VER-SEDES` | `<template>` — checkboxes/toggles de modalidades; `<script>` — `toggleAsignacion`, `guardarCambios` |
| 3 | Habilitar modalidad quincena | `HABILITAR-QUINCENAS` | `<template>` — botón quincenas, modal quincenas; `<script>` — `abrirModalQuincena`, `enviarQuincena` |
| 4 | Módulo especial sede 24 para recargas | `VER-SEDES` | `<template>` — sección especial sede 24; `<script>` — lógica condicional sede 24 |

---

### RF-014 · Roles
**Archivo:** `src/views/administrador/Roles.vue`
**Permisos:** `EDITAR-ROLES`, `VER-PERMISOS`, `ASIGNAR-PERMISOS`, `INACTIVAR-PERMISOS`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Panel izquierdo: listado de roles; clic selecciona rol activo | `EDITAR-ROLES` | `<template>` — panel izquierdo; `<script>` — carga roles, selección de rol |
| 2 | Panel derecho: permisos del rol agrupados por prefijo | `VER-PERMISOS` | `<template>` — panel derecho; `<script>` — agrupación por prefijo |
| 3 | Toggle individual de permiso ON / OFF | `ASIGNAR-PERMISOS` / `INACTIVAR-PERMISOS` | `<template>` — toggle individual; `<script>` — toggle individual |
| 4 | Bulk action "Seleccionar todo" | `ASIGNAR-PERMISOS` | `<template>` — botón seleccionar todo; `<script>` — `selectAll` |
| 5 | Bulk action "Quitar todo" | `INACTIVAR-PERMISOS` | `<template>` — botón quitar todo; `<script>` — `clearAll` |
| 6 | Guardar cambios de permisos del rol | `ASIGNAR-PERMISOS` | `<template>` — botón guardar; `<script>` — guardar cambios |

---

### RF-015 · Sedes
**Archivo:** `src/views/administrador/Sedes.vue`
**Permisos:** `VER-SEDES`, `CREAR-SEDES`, `EDITAR-SEDES`, `INACTIVAR-SEDES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Grid de cards por sede con disponibilidad carros/motos en tiempo real | `VER-SEDES` | `<template>` — grid de cards, skeleton; `<script>` — carga de sedes |
| 2 | Crear sede: nombre, dirección, capacidad carros/motos, API key | `CREAR-SEDES` | `<template>` — botón crear, formulario; `<script>` — abrir nueva sede, guardar |
| 3 | Editar sede: todos los campos | `EDITAR-SEDES` | `<template>` — botón editar, formulario; `<script>` — abrir edición, guardar |
| 4 | Activar / desactivar sede | `INACTIVAR-SEDES` | `<template>` — botón activar/desactivar; `<script>` — toggle de estado |
| 5 | Mostrar/ocultar API key con toggle | `VER-SEDES` | `<template>` — toggle API key; `<script>` — toggle visibilidad API key |

---

### RF-016 · Solicitudes / PQRS
**Archivo:** `src/views/administrador/Solicitudes.vue`
**Permisos:** `VER-MENSUALIDADES`, `ASIGNAR-PQRS`, `RESPONDER-PQRS`, `CREAR-PQRS-MOTIVO`, `EDITAR-PQRS-MOTIVO`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Tabla de solicitudes con filtros tipo, estado, prioridad y búsqueda | `VER-MENSUALIDADES` | `<template>` — filtros y tabla; `<script>` — estado, filtros, carga PQRS |
| 2 | Tipos: Petición, queja, reclamo, sugerencia | `VER-MENSUALIDADES` | `<template>` — select tipo; `<script>` — catálogo de tipos |
| 3 | Asignar PQRS a administrador responsable | `ASIGNAR-PQRS` | `<template>` — modal asignar; `<script>` — asignación a admin |
| 4 | Ver detalle completo: asunto, motivo, descripción, imágenes adjuntas | `VER-MENSUALIDADES` | `<template>` — modal detalle; `<script>` — abrir detalle |
| 5 | Responder PQRS con campo de texto y cambio de estado | `RESPONDER-PQRS` | `<template>` — formulario responder; `<script>` — responder PQRS |
| 6 | Gestionar catálogo de motivos | `CREAR-PQRS-MOTIVO` / `EDITAR-PQRS-MOTIVO` | `<template>` — modal gestión motivos; `<script>` — CRUD motivos |

---

### RF-017 · Usuarios Admin
**Archivo:** `src/views/administrador/Usuarios.vue`
**Permisos:** `VER-ROLES`, `EDITAR-ROLES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Tabla de administradores del sistema con búsqueda debounced | `VER-ROLES` | `<template>` — buscador y tabla; `<script>` — carga inicial, debounce |
| 2 | Crear administrador: nombre, email, contraseña, rol asignado | `VER-ROLES` | `<template>` — panel crear; `<script>` — abrir crear, guardar usuario |
| 3 | Editar administrador: datos básicos y rol | `EDITAR-ROLES` | `<template>` — panel editar; `<script>` — abrir editar, guardar |
| 4 | Activar/desactivar cuenta de administrador | `EDITAR-ROLES` | `<template>` — botón y modal inhabilitar; `<script>` — activar/desactivar cuenta |

---

### RF-018 · Ver Disponibilidad
**Archivo:** `src/views/administrador/VerDisponibilidad.vue`
**Permisos:** `VER-SEDES`

| # | Funcionalidad | Permiso | Ubicación aproximada |
|---|--------------|---------|---------------------|
| 1 | Vista en desarrollo (stub) — muestra estado de disponibilidad de espacios | `VER-SEDES` | `<template>` — mensaje/vista stub |

---

## Glosario de Permisos

| Permiso | Descripción | Vistas que lo usan |
|---------|-------------|-------------------|
| `VER-USUARIOS` | Ver listado de usuarios/clientes | Dashboard, Clientes, ComunidadUCC |
| `EDITAR-USUARIOS` | Editar datos de usuarios/clientes | Clientes |
| `INACTIVAR-USUARIOS` | Activar o desactivar usuarios/clientes | Clientes |
| `VER-SEDES` | Ver información de sedes | Dashboard, AdministrarTarifas, ModalidadesPagos, Sedes, Consignacion, Facturacion, VerDisponibilidad |
| `CREAR-SEDES` | Crear nuevas sedes | Sedes |
| `EDITAR-SEDES` | Editar configuración de sedes | Sedes, Consignacion, Facturacion |
| `INACTIVAR-SEDES` | Activar/desactivar sedes | Sedes |
| `VER-MENSUALIDADES` | Ver mensualidades y pagos | Dashboard, HistorialCambioPlacas, HistorialPagos, Mensualidades, Solicitudes |
| `EDITAR-MENSUALIDADES` | Editar mensualidades | Mensualidades |
| `EDITAR-TARIFAS` | Editar tarifas | AdministrarTarifas |
| `CREAR-CÓDIGOS` | Crear códigos y autorizaciones | Autorizaciones, Codigo, Banner |
| `EDITAR-AUTORIZACIONES` | Editar estado/prioridad/sincronización de autorizaciones | Autorizaciones |
| `CREAR-PUBLICIDAD` | Crear banners/publicidad | Banner |
| `EDITAR-PUBLICIDAD` | Editar y activar/desactivar banners | Banner |
| `VER-ROLES` | Ver roles y usuarios administradores | Roles, Usuarios |
| `EDITAR-ROLES` | Editar roles y usuarios administradores | Roles, Usuarios |
| `VER-PERMISOS` | Ver permisos agrupados | Roles |
| `ASIGNAR-PERMISOS` | Asignar permisos a roles | Roles |
| `INACTIVAR-PERMISOS` | Quitar permisos a roles | Roles |
| `ASIGNAR-PQRS` | Asignar PQRS a administrador | Solicitudes |
| `RESPONDER-PQRS` | Responder solicitudes PQRS | Solicitudes |
| `CREAR-PQRS-MOTIVO` | Crear motivos de PQRS | Solicitudes |
| `EDITAR-PQRS-MOTIVO` | Editar motivos de PQRS | Solicitudes |
| `HABILITAR-QUINCENAS` | Habilitar modalidad quincena | ModalidadesPagos |
| `EDITAR-FACTURACIÓN` | Editar configuración de facturación | Facturacion |

---

## Convenciones de Comentarios en Código

### Template (HTML)
```html
<!-- RF-005.1: Tabla paginada de clientes con búsqueda por nombre, documento o #ID — VER-USUARIOS -->
<div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
  ...
</div>
```

### Script (JavaScript)
```javascript
// RF-005.3: Registrar nuevo cliente con campos condicionales según modo Old — VER-USUARIOS
const abrirCrearCliente = () => {
  ...
}
```

### Múltiples RF en un bloque
```html
<!-- RF-001.1, RF-001.2: KPIs y gráfica de mensualidades vencidas — VER-USUARIOS / VER-MENSUALIDADES -->
```

---

> **Última actualización:** 2026-05-25
> **Versión:** 1.0
