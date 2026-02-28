import icoClientes from "@/assets/img/account_box.svg?raw";
import icoValidar from "@/assets/img/calendar_check.svg?raw";
import icoSolicitudes from "@/assets/img/receipt_long.svg?raw";
import icoReportes from "@/assets/img/assignment.svg?raw";
import icoSedes from "@/assets/img/emoji_transportation.svg?raw";
import icoMensual2 from "@/assets/img/calendar_add_on.svg?raw";
import icoUsuarios from "@/assets/img/manage_accounts.svg?raw";
import icoDashboard from "@/assets/img/home.svg?raw";
import icoInicio from "@/assets/img/home.svg?raw";
import icoDisponibilidad from "@/assets/img/calendar_check.svg?raw";
import IcoVerificacion from "@/assets/img/verified.svg?raw";
import icoTarifas from "@/assets/img/car_tag.svg?raw";
import icoTarjetas from "@/assets/img/credit_card_gear.svg?raw";
import { PERMS } from "@/constants/permisions";

export const adminMenuItems = [
  { label: "Dashboard", icon: icoDashboard, route: "/admin/dashboard" }, // General
  {
    label: "Clientes",
    icon: icoClientes,
    route: "/admin/clientes",
    permission: "VER-USUARIOS",
  },
  {
    label: "Validar<br>Mensualidades",
    icon: icoValidar,
    route: "/admin/validar",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Solicitudes",
    icon: icoSolicitudes,
    route: "/admin/solicitudes",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Reportes",
    icon: icoReportes,
    route: "/admin/reportes",
    permission: "VER-USUARIOS",
  },
  {
    label: "Administrar<br>sedes",
    icon: icoSedes,
    route: "/admin/sedes",
    permission: "VER-SEDES",
  },
  {
    label: "Mensualidades",
    icon: icoMensual2,
    route: "/admin/mensualidades",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Usuarios",
    icon: icoUsuarios,
    route: "/admin/usuarios",
    permission: "VER-ROLES",
  },
  // Rutas Operador
  {
    label: "Inicio",
    icon: icoInicio,
    route: "/admin/inicio",
  },
  {
    label: "Ver disponibilidad",
    icon: icoDisponibilidad,
    route: "/admin/disponibilidad",
  },
  {
    label: "Codigo verificacion",
    icon: IcoVerificacion,
    route: "/admin/verificacion",
  },
  {
    label: "Ver tarifas",
    icon: icoTarifas,
    route: "/admin/tarifas",
  },
  {
    label: "Tarjetas",
    icon: icoTarjetas,
    route: "/admin/tarjetas",
  },
];

export const adminRoutes = {
  path: "/admin",
  component: () => import("@/layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, role: "admin" },
  children: [
    {
      path: "dashboard",
      component: () => import("@/views/administrador/Dashboard.vue"),
      meta: { permission: PERMS.USUARIOS_VER },
    },
    {
      path: "clientes",
      component: () => import("@/views/administrador/Clientes.vue"),
      meta: { permission: PERMS.USUARIOS_VER },
    },
    {
      path: "validar",
      component: () => import("@/views/administrador/ValidarMensualidades.vue"),
      meta: { permission: PERMS.MENSUALIDADES_VER },
    },
    {
      path: "solicitudes",
      component: () => import("@/views/administrador/Solicitudes.vue"),
      meta: { permission: PERMS.MENSUALIDADES_VER },
    },
    {
      path: "reportes",
      component: () => import("@/views/administrador/Reportes.vue"),
      meta: { permission: "VER-USUARIOS" },
    },
    {
      path: "sedes",
      component: () => import("@/views/administrador/Sedes.vue"),
      meta: { permission: PERMS.SEDES_VER },
    },
    {
      path: "mensualidades",
      component: () => import("@/views/administrador/Mensualidades.vue"),
      meta: { permission: "VER-MENSUALIDADES" },
    },
    {
      path: "usuarios",
      component: () => import("@/views/administrador/Usuarios.vue"),
      meta: { permission: "VER-ROLES" },
    },
    // Rutas para Operador
    {
      path: "inicio",
      component: () => import("@/views/administrador/OperadorInicio.vue"),
      meta: { permission: "VER-USUARIOS" },
    },
    {
      path: "disponibilidad",
      component: () => import("@/views/administrador/VerDisponibilidad.vue"),
      meta: { permission: "VER-SEDES" },
    },
    {
      path: "verificacion",
      component: () => import("@/views/administrador/Verificacion.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    {
      path: "tarifas",
      component: () => import("@/views/administrador/Tarifas.vue"),
      meta: { permission: "VER-MENSUALIDADES" },
    },
    {
      path: "tarjetas",
      component: () => import("@/views/administrador/Tarjetas.vue"),
      meta: { permission: "VER-USUARIOS" },
    },

    // {
    //   path: "inicio",
    //   component: () => import("@/views/administrador/OperadorInicio.vue"),
    // },
    // {
    //   path: "disponibilidad",
    //   component: () => import("@/views/administrador/VerDisponibilidad.vue"),
    // },
    // {
    //   path: "verificacion",
    //   component: () => import("@/views/administrador/Verificacion.vue"),
    // },
    // {
    //   path: "tarifas",
    //   component: () => import("@/views/administrador/Tarifas.vue"),
    // },
    // {
    //   path: "tarjetas",
    //   component: () => import("@/views/administrador/Tarjetas.vue"),
    // },

    { path: "", redirect: "dashboard" },
  ],
};
