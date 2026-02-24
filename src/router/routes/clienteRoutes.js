import icoInicio from "@/assets/img/home.svg?raw";
import icoMensualidad from "@/assets/img/event_available.svg?raw";
import icoNotificacion from "@/assets/img/notifications.svg?raw";
import icoContrato from "@/assets/img/contract.svg?raw";

export const clienteMenuItems = [
  { label: "Inicio", icon: icoInicio, route: "/cliente/inicio" },
  { label: "Mensualidad", icon: icoMensualidad, route: "/cliente/mensualidad" },
  {
    label: "Notificaciones<br>Pendientes",
    icon: icoNotificacion,
    route: "/cliente/notificaciones",
  },
  {
    label: "Cambios y<br>peticiones",
    icon: icoContrato,
    route: "/cliente/peticiones",
  },
];

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
      path: "notificaciones",
      component: () => import("@/views/cliente/Notificaciones.vue"),
    },
    {
      path: "peticiones",
      component: () => import("@/views/cliente/Peticiones.vue"),
    },

    { path: "", redirect: "inicio" }, // /cliente → /cliente/inicio
  ],
};
