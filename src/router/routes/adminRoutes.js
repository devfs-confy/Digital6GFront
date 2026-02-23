import icoClientes from "@/assets/img/account_box.svg?raw";
import icoValidar from "@/assets/img/calendar_check.svg?raw";
import icoSolicitudes from "@/assets/img/receipt_long.svg?raw";
import icoReportes from "@/assets/img/assignment.svg?raw";
import icoSedes from "@/assets/img/emoji_transportation.svg?raw";
import icoMensual2 from "@/assets/img/calendar_add_on.svg?raw";
import icoUsuarios from "@/assets/img/manage_accounts.svg?raw";
import icoDashboard from "@/assets/img/home.svg?raw";

export const adminMenuItems = [
  { label: "Dashboard", icon: icoDashboard, route: "/admin/dashboard" },
  { label: "Clientes", icon: icoClientes, route: "/admin/clientes" },
  {
    label: "Validar<br>Mensualidades",
    icon: icoValidar,
    route: "/admin/validar",
  },
  { label: "Solicitudes", icon: icoSolicitudes, route: "/admin/solicitudes" },
  { label: "Reportes", icon: icoReportes, route: "/admin/reportes" },
  { label: "Administrar<br>sedes", icon: icoSedes, route: "/admin/sedes" },
  { label: "Mensualidades", icon: icoMensual2, route: "/admin/mensualidades" },
  { label: "Usuarios", icon: icoUsuarios, route: "/admin/usuarios" },
];

export const adminRoutes = {
  path: "/admin",
  component: () => import("@/layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, role: "administrador" },
  children: [
    {
      path: "dashboard",
      component: () => import("@/views/administrador/Dashboard.vue"),
    },
    {
      path: "clientes",
      component: () => import("@/views/administrador/Clientes.vue"),
    },
    {
      path: "validar",
      component: () => import("@/views/administrador/ValidarMensualidades.vue"),
    },
    {
      path: "solicitudes",
      component: () => import("@/views/administrador/Solicitudes.vue"),
    },
    {
      path: "reportes",
      component: () => import("@/views/administrador/Reportes.vue"),
    },
    {
      path: "sedes",
      component: () => import("@/views/administrador/Sedes.vue"),
    },
    {
      path: "mensualidades",
      component: () => import("@/views/administrador/Mensualidades.vue"),
    },
    {
      path: "usuarios",
      component: () => import("@/views/administrador/Usuarios.vue"),
    },
    { path: "", redirect: "dashboard" },
  ],
};
