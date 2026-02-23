// import icoInicio from "@/assets/img/home.svg?raw";
// import icoDisponibilidad from "@/assets/img/calendar_check.svg?raw";
// import IcoVerificacion from "@/assets/img/verified.svg?raw";
// import icoTarifas from "@/assets/img/car_tag.svg?raw";
// import icoTarjetas from "@/assets/img/credit_card_gear.svg?raw";

// export const operadorMenuItems = [
//   { label: "Inicio", icon: icoInicio, route: "/operador/inicio" },
//   {
//     label: "Ver disponibilidad",
//     icon: icoDisponibilidad,
//     route: "/operador/disponibilidad",
//   },
//   {
//     label: "Codigo verificacion",
//     icon: IcoVerificacion,
//     route: "/operador/verificacion",
//   },
//   { label: "Ver tarifas", icon: icoTarifas, route: "/operador/tarifas" },
//   { label: "Tarjetas", icon: icoTarjetas, route: "/operador/tarjetas" },
// ];

// export const operadorRoutes = {
//   path: "/operador",
//   component: () => import("@/layouts/OperadorLayout.vue"),
//   meta: { requiresAuth: true, role: "operador" },
//   children: [
//     {
//       path: "inicio",
//       component: () => import("@/views/operador/OperadorInicio.vue"),
//     },
//     {
//       path: "disponibilidad",
//       component: () => import("@/views/operador/VerDisponibilidad.vue"),
//     },
//     {
//       path: "verificacion",
//       component: () => import("@/views/operador/Verificacion.vue"),
//     },
//     {
//       path: "tarifas",
//       component: () => import("@/views/operador/Tarifas.vue"),
//     },
//     {
//       path: "tarjetas",
//       component: () => import("@/views/operador/Tarjetas.vue"),
//     },
//     { path: "", redirect: "inicio" },
//   ],
// };
