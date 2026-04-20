// src/router/adminRoutes.js
import icoClientes from "@/assets/img/account_box.svg?raw";
import icoSolicitudes from "@/assets/img/receipt_long.svg?raw";
import icoArqueos from "@/assets/img/assignment.svg?raw";
import icoSedes from "@/assets/img/emoji_transportation.svg?raw";
import icoMensual2 from "@/assets/img/calendar_add_on.svg?raw";
import icoUsuarios from "@/assets/img/manage_accounts.svg?raw";
import icoDashboard from "@/assets/img/home.svg?raw";
import icoDisponibilidad from "@/assets/img/calendar_check.svg?raw";
import IcoVerificacion from "@/assets/img/verified.svg?raw";
import icoTarifas from "@/assets/img/car_tag.svg?raw";
import icoTarjetas from "@/assets/img/credit_card_gear.svg?raw";
import icoRoles from "@/assets/img/dashboard_customize_white.svg?raw";
import icoUCC from "@/assets/img/how_to_reg.svg?raw";
import icoAuth from "@/assets/img/fact_check.svg?raw";
import icoPlacas from "@/assets/img/flowsheet.svg?raw";

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
    label: "Mensualidades",
    icon: icoMensual2,
    route: "/admin/mensualidades",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Solicitudes <br> PQRS",
    icon: icoSolicitudes,
    route: "/admin/solicitudes",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Historial Cambio <br> Placas",
    icon: icoPlacas,
    route: "/admin/historial-cambio-placas",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Consignaciones",
    icon: icoArqueos,
    route: "/admin/consignaciones",
    permission: "EDITAR-SEDES",
  },
  {
    label: "Administrar<br>Sedes",
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
    label: "Ver<br> Disponibilidad",
    icon: icoDisponibilidad,
    route: "/admin/disponibilidad",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "Codigo<br> Verificacion",
    icon: IcoVerificacion,
    route: "/admin/verificacion",
    permission: "CREAR-CODIGOS",
  },

  {
    label: "Autorizaciones",
    icon: icoAuth,
    route: "/admin/autorizaciones",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "Banner",
    icon: icoTarjetas,
    route: "/admin/banner",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "Modalidades<br>de Pago",
    icon: icoTarifas,
    route: "/admin/modalidades-pagos",
    permission: "VER-SEDES",
  },
  {
    label: "Comunidad<br>UCC",
    icon: icoUCC,
    route: "/admin/comunidad-ucc",
    permission: "VER-USUARIOS",
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
      path: "historial-cambio-placas",
      component: () =>
        import("@/views/administrador/HistorialCambioPlacas.vue"),
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
