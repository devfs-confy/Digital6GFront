export const adminRoutes = {
  path: "/admin",
  component: () => import("@/layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, role: "admin" },
  children: [
    {
      path: "dashboard",
      component: () => import("@/views/administrador/Dashboard.vue"),
    },
    {
      path: "clientes",
      component: () => import("@/views/administrador/Clientes.vue"),
      meta: { permission: "VER-USUARIOS" },
    },
    {
      path: "solicitudes",
      component: () => import("@/views/administrador/Solicitudes.vue"),
      meta: { permission: "VER-MENSUALIDADES" },
    },
    {
      path: "historial-pagos",
      component: () => import("@/views/administrador/HistorialPagos.vue"),
      meta: { permission: "VER-MENSUALIDADES" },
    },
    {
      path: "historial-cambio-placas",
      component: () => import("@/views/administrador/HistorialCambioPlacas.vue"),
      meta: { permission: "VER-MENSUALIDADES" },
    },
    {
      path: "consignaciones",
      component: () => import("@/views/administrador/Consignacion.vue"),
      meta: { permission: "EDITAR-SEDES" },
    },
    {
      path: "sedes",
      component: () => import("@/views/administrador/Sedes.vue"),
      meta: { permission: "VER-SEDES" },
    },
    {
      path: "mensualidades",
      component: () => import("@/views/administrador/Mensualidades.vue"),
      meta: { permission: "VER-MENSUALIDADES" },
    },
    {
      path: "facturacion",
      component: () => import("@/views/administrador/Facturacion.vue"),
      meta: { permission: "EDITAR-SEDES" },
    },
    {
      path: "tarifas-admin",
      component: () => import("@/views/administrador/AdministrarTarifas.vue"),
      meta: { permission: "VER-SEDES" },
    },
    {
      path: "usuarios",
      component: () => import("@/views/administrador/Usuarios.vue"),
      meta: { permission: "VER-ROLES" },
    },
    {
      path: "roles",
      component: () => import("@/views/administrador/Roles.vue"),
      meta: { permission: "VER-ROLES" },
    },
    {
      path: "verificacion",
      component: () => import("@/views/administrador/Codigo.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    {
      path: "autorizaciones",
      component: () => import("@/views/administrador/Autorizaciones.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    {
      path: "banner",
      component: () => import("@/views/administrador/Banner.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    {
      path: "modalidades-pagos",
      component: () => import("@/views/administrador/ModalidadesPagos.vue"),
      meta: { permission: "VER-SEDES" },
    },
    {
      path: "comunidad-ucc",
      component: () => import("@/views/administrador/ComunidadUCC.vue"),
      meta: { permission: "VER-USUARIOS" },
    },
    { path: "", redirect: "dashboard" },
  ],
};
