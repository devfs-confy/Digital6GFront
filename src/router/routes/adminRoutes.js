// src/router/adminRoutes.js
import icoClientes from "@/assets/img/account_box.svg?raw";
import icoSolicitudes from "@/assets/img/receipt_long.svg?raw";
import icoReportes from "@/assets/img/assignment.svg?raw";
import icoSedes from "@/assets/img/emoji_transportation.svg?raw";
import icoMensual2 from "@/assets/img/calendar_add_on.svg?raw";
import icoUsuarios from "@/assets/img/manage_accounts.svg?raw";
import icoDashboard from "@/assets/img/home.svg?raw";
import icoDisponibilidad from "@/assets/img/calendar_check.svg?raw";
import IcoVerificacion from "@/assets/img/verified.svg?raw";
import icoTarifas from "@/assets/img/car_tag.svg?raw";
import icoTarjetas from "@/assets/img/credit_card_gear.svg?raw";
import icoRoles from "@/assets/img/dashboard_customize_white.svg?raw";

// ── Ítems del menú lateral ─────────────────────────────────────────
export const adminMenuItems = [
  { label: "Dashboard", icon: icoDashboard, route: "/admin/dashboard" },
  {
    label: "Clientes",
    icon: icoClientes,
    route: "/admin/clientes",
    permission: "VER-USUARIOS",
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
    permission: "EDITAR-SEDES",
  },
  {
    label: "Administrar<br>sedes",
    icon: icoSedes,
    route: "/admin/sedes",
    permission: "VER-SEDES",
  },
  {
    label: "Administrar<br>Tarifas",
    icon: icoTarifas,
    route: "/admin/tarifas-admin",
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
  {
    label: "Roles",
    icon: icoRoles,
    route: "/admin/roles",
    permission: "VER-ROLES",
  },
  {
    label: "Ver<br> disponibilidad",
    icon: icoDisponibilidad,
    route: "/admin/disponibilidad",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "Codigo<br> verificacion",
    icon: IcoVerificacion,
    route: "/admin/verificacion",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "Ver<br> tarifas",
    icon: icoTarifas,
    route: "/admin/tarifas",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "Tarjetas",
    icon: icoTarjetas,
    route: "/admin/tarjetas",
    permission: "CREAR-CODIGOS",
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
      path: "reportes",
      component: () => import("@/views/administrador/Reportes.vue"),
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
      path: "disponibilidad",
      component: () => import("@/views/administrador/VerDisponibilidad.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    {
      path: "verificacion",
      component: () => import("@/views/administrador/Codigo.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    {
      path: "tarifas",
      component: () => import("@/views/administrador/Tarifas.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    {
      path: "tarjetas",
      component: () => import("@/views/administrador/Tarjetas.vue"),
      meta: { permission: "CREAR-CODIGOS" },
    },
    { path: "", redirect: "dashboard" },
  ],
};
