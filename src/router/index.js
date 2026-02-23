import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "./routes/authRoutes";
import { clienteRoutes } from "./routes/clienteRoutes";
import { adminRoutes } from "./routes/adminRoutes";
// import { operadorRoutes } from "./routes/operadorRoutes";
import { authGuard } from "./guards/authGuards";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    clienteRoutes,
    adminRoutes,
    // operadorRoutes,
    { path: "/", redirect: "/login" },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
  ],
});

router.beforeEach(authGuard);
export default router;
