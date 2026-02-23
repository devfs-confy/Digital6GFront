export const authRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginVista.vue"),
  },
  {
    path: "/registro",
    name: "registro",
    component: () => import("@/views/auth/RegistroVista.vue"),
  },
];
