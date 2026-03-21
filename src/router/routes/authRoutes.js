export const authRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginVista.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/auth/ForgotPasswordVista.vue"),
  },
  {
    path: "/registro",
    name: "registro",
    component: () => import("@/views/auth/RegistroVista.vue"),
  },
  {
    path: "/seleccionsede",
    name: "seleccionsede",
    component: () => import("@/views/auth/SeleccionSede.vue"),
  },
];
