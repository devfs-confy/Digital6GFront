import icoInicio from "@/assets/img/home.svg?raw";
import icoMensualidad from "@/assets/img/event_available.svg?raw";
import icoNotificacion from "@/assets/img/notifications.svg?raw";
import icoContrato from "@/assets/img/contract.svg?raw";
import icoPagos from "@/assets/img/receipt_long.svg?raw";
import icoParqueos from "@/assets/img/parking_sign.svg?raw";
import icoPQRS from "@/assets/img/contract_edit.svg?raw";
import icoPerfil from "@/assets/img/account_circle.svg?raw";

export const clienteMenuItems = [
  { label: "Inicio", icon: icoInicio, route: "/cliente/inicio" },
  {
    label: "Mis Mensualidades",
    icon: icoMensualidad,
    route: "/cliente/mensualidad",
    activeFor: ["/cliente/mensualidad", "/cliente/mensualidad/pago"],
  },

  {
    label: "Pagos Recientes",
    icon: icoPagos,
    route: "/cliente/pagos",
  },
  {
    label: "Parqueos recientes",
    icon: icoParqueos,
    route: "/cliente/parqueos",
  },
  {
    label: "PQRS",
    icon: icoPQRS,
    route: "/cliente/pqrs",
  },
  {
    label: "Información </br> personal",
    icon: icoPerfil,
    route: "/cliente/informacion",
  },

  // {
  //   label: "Notificaciones<br>Pendientes",
  //   icon: icoNotificacion,
  //   route: "/cliente/notificaciones",
  // },
  // {
  //   label: "Cambios y<br>peticiones",
  //   icon: icoContrato,
  //   route: "/cliente/peticiones",
  // },
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
    // {
    //   path: "notificaciones",
    //   component: () => import("@/views/cliente/Notificaciones.vue"),
    // },
    // {
    //   path: "peticiones",
    //   component: () => import("@/views/cliente/Peticiones.vue"),
    // },
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
      path: "mensualidad/pago",
      component: () => import("@/views/cliente/VerFactura.vue"),
    },

    { path: "", redirect: "inicio" }, // /cliente → /cliente/inicio
  ],
};
