// CORRECCIONES:
// - Doble `meta` en reportes eliminado
// - Todos los strings literales reemplazados por constantes PERMS
// - Dashboard sin restricción de permiso (acceso libre para cualquier admin)

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

// ── Ítems del menú lateral ─────────────────────────────────────────
// El sidebar filtra estos ítems según el permiso del usuario logueado.
export const adminMenuItems = [
  {
    label: "Dashboard",
    icon: icoDashboard,
    route: "/admin/dashboard",
    // Sin permiso → visible para cualquier rol autenticado
  },
  {
    label: "Clientes",
    icon: icoClientes,
    route: "/admin/clientes",
    permission: PERMS.USUARIOS_VER,
  },
  // {
  //   label: "Validar<br>Mensualidades",
  //   icon: icoValidar,
  //   route: "/admin/validar",
  //   permission: PERMS.MENSUALIDADES_VER,
  // },
  {
    label: "Solicitudes",
    icon: icoSolicitudes,
    route: "/admin/solicitudes",
    permission: PERMS.MENSUALIDADES_VER,
  },
  {
    label: "Reportes",
    icon: icoReportes,
    route: "/admin/reportes",
    permission: PERMS.SEDES_EDITAR,
  },
  {
    label: "Administrar<br>sedes",
    icon: icoSedes,
    route: "/admin/sedes",
    permission: PERMS.SEDES_VER,
  },
  {
    label: "Mensualidades",
    icon: icoMensual2,
    route: "/admin/mensualidades",
    permission: PERMS.MENSUALIDADES_VER,
  },
  {
    label: "Usuarios",
    icon: icoUsuarios,
    route: "/admin/usuarios",
    permission: PERMS.ROLES_VER,
  },

  // {
  //   label: "Inicio",
  //   icon: icoInicio,
  //   route: "/admin/inicio",
  //   permission: PERMS.CODIGOS_CREAR,
  // },

  {
    label: "Ver disponibilidad",
    icon: icoDisponibilidad,
    route: "/admin/disponibilidad",
    permission: PERMS.CODIGOS_CREAR,
  },
  {
    label: "Codigo verificacion",
    icon: IcoVerificacion,
    route: "/admin/verificacion",
    permission: PERMS.CODIGOS_CREAR,
  },
  {
    label: "Ver tarifas",
    icon: icoTarifas,
    route: "/admin/tarifas",
    permission: PERMS.CODIGOS_CREAR,
  },
  {
    label: "Tarjetas",
    icon: icoTarjetas,
    route: "/admin/tarjetas",
    permission: PERMS.CODIGOS_CREAR,
  },
];

// ── Rutas del router ───────────────────────────────────────────────
export const adminRoutes = {
  path: "/admin",
  component: () => import("@/layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, role: "admin" },
  children: [
    {
      path: "dashboard",
      component: () => import("@/views/administrador/Dashboard.vue"),
      // Sin meta.permission → cualquier admin puede acceder
    },
    {
      path: "clientes",
      component: () => import("@/views/administrador/Clientes.vue"),
      meta: { permission: PERMS.USUARIOS_VER },
    },
    // {
    //   path: "validar",
    //   component: () => import("@/views/administrador/ValidarMensualidades.vue"),
    //   meta: { permission: PERMS.MENSUALIDADES_VER },
    // },
    {
      path: "solicitudes",
      component: () => import("@/views/administrador/Solicitudes.vue"),
      meta: { permission: PERMS.MENSUALIDADES_VER },
    },
    {
      path: "reportes",
      component: () => import("@/views/administrador/Reportes.vue"),
      meta: { permission: PERMS.SEDES_EDITAR },
    },
    {
      path: "sedes",
      component: () => import("@/views/administrador/Sedes.vue"),
      meta: { permission: PERMS.SEDES_VER },
    },
    {
      path: "mensualidades",
      component: () => import("@/views/administrador/Mensualidades.vue"),
      meta: { permission: PERMS.MENSUALIDADES_VER },
    },
    {
      path: "usuarios",
      component: () => import("@/views/administrador/Usuarios.vue"),
      meta: { permission: PERMS.ROLES_VER },
    },

    // {
    //   path: "inicio",
    //   component: () => import("@/views/administrador/OperadorInicio.vue"),
    //   meta: { permission: PERMS.CODIGOS_CREAR },
    // },

    {
      path: "disponibilidad",
      component: () => import("@/views/administrador/VerDisponibilidad.vue"),
      meta: { permission: PERMS.CODIGOS_CREAR },
    },
    {
      path: "verificacion",
      component: () => import("@/views/administrador/CodigoVerificacion.vue"),
      meta: { permission: PERMS.CODIGOS_CREAR },
    },
    {
      path: "tarifas",
      component: () => import("@/views/administrador/Tarifas.vue"),
      meta: { permission: PERMS.CODIGOS_CREAR },
    },
    {
      path: "tarjetas",
      component: () => import("@/views/administrador/Tarjetas.vue"),
      meta: { permission: PERMS.CODIGOS_CREAR },
    },
    { path: "", redirect: "dashboard" },
  ],
};
