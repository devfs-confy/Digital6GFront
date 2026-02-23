import { useAuthStore } from "@/stores/auth";

const roleRedirects = {
  administrador: "/admin/dashboard",
  cliente: "/cliente/inicio",
  operador: "/operador/inicio",
};

export function authGuard(to, from, next) {
  const auth = useAuthStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRole = to.matched.find((record) => record.meta.role)?.meta.role;

  if (!requiresAuth) return next();
  if (!auth.isLoggedIn) return next("/login");
  if (requiredRole && auth.userRole !== requiredRole) {
    return next(roleRedirects[auth.userRole]);
  }

  next();
}
