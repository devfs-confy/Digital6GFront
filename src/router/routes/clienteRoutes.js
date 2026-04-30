export const clienteRoutes = {
  path: "/cliente",
  component: () => import("@/layouts/ClienteLayout.vue"),
  meta: { requiresAuth: true, role: "cliente" },
  children: [
    {
      path: "inicio",
      component: () => import("@/views/cliente/ClienteInicio.vue"),
    },
    {
      path: "mensualidad",
      component: () => import("@/views/cliente/Mensualidad.vue"),
    },
    {
      path: "transacciones",
      component: () => import("@/views/cliente/Transacciones.vue"),
    },
    {
      path: "solicitudes",
      component: () => import("@/views/cliente/Solicitudes.vue"),
    },
    {
      path: "parqueos",
      component: () => import("@/views/cliente/ParqueosReciente.vue"),
    },
    {
      path: "pagos",
      component: () => import("@/views/cliente/PagosRecientes.vue"),
    },
    {
      path: "informacion",
      component: () => import("@/views/cliente/EditarInformacion.vue"),
    },
    {
      path: "pqrs",
      component: () => import("@/views/cliente/PQRS.vue"),
    },
    {
      path: "mensualidad/pago/:rquid",
      component: () => import("@/views/cliente/EstadoTransaccion.vue"),
    },
    {
      path: "faqs",
      component: () => import("@/views/cliente/Faqs.vue"),
    },
    {
      path: "tutorial",
      component: () => import("@/views/cliente/Tutorial.vue"),
    },
    { path: "", redirect: "inicio" },
  ],
};
