import icoInicio from "@/assets/img/home.svg?raw";
import icoMensualidad from "@/assets/img/event_available.svg?raw";
import icoPagos from "@/assets/img/receipt_long.svg?raw";
import icoParqueos from "@/assets/img/parking_sign.svg?raw";
import icoPQRS from "@/assets/img/contract_edit.svg?raw";
import icoPerfil from "@/assets/img/account_circle.svg?raw";
import icofaqs from "@/assets/img/contact_support.svg?raw";
import icotutorial from "@/assets/img/info_i.svg?raw";

export const clienteMenuItems = [
  { label: "Inicio", icon: icoInicio, route: "/cliente/inicio" },
  {
    label: "Mis <br> Mensualidades",
    icon: icoMensualidad,
    route: "/cliente/mensualidad",
    activeFor: ["/cliente/mensualidad", "/cliente/mensualidad/pago"],
  },

  {
    label: "Pagos <br> Recientes",
    icon: icoPagos,
    route: "/cliente/pagos",
  },
  {
    label: "Parqueos <br> Recientes",
    icon: icoParqueos,
    route: "/cliente/parqueos",
  },

  {
    label: "Historial de<br> Transacciones",
    icon: icoPagos,
    route: "/cliente/transacciones",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "PQRS",
    icon: icoPQRS,
    route: "/cliente/pqrs",
  },
  {
    label: "Información </br> Personal",
    icon: icoPerfil,
    route: "/cliente/informacion",
  },

  {
    label: "Faqs",
    icon: icofaqs,
    route: "/cliente/faqs",
  },
  {
    label: "Tutorial",
    icon: icotutorial,
    route: "/cliente/tutorial",
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

    { path: "", redirect: "inicio" }, // /cliente → /cliente/inicio
  ],
};
