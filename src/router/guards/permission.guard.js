import { useAuthStore } from "@/stores/auth";

export const permissionGuard = (to, from, next) => {
  const authStore = useAuthStore();
  const requiredPermission = to.meta?.permission;

  // 1. Ruta sin restricción → libre
  if (!requiredPermission) return next();

  // 2. SUPER-ADMIN / ADMIN → bypass total
  if (authStore.isAdmin) return next();

  // 3. Verificar en el array de permisos del JWT
  const userPermissions = authStore.user?.permisos ?? [];
  const hasAccess = userPermissions.includes(requiredPermission);

  if (hasAccess) {
    return next();
  }

  // Sin acceso → redirigir al inicio del rol (computed redirectTo del store)
  console.warn(
    `[Guard] Permiso requerido: "${requiredPermission}" | Ruta: ${to.path}`,
  );
  return next(authStore.redirectTo);
};
