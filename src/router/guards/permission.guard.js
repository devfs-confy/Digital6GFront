import { useAuthStore } from "@/stores/auth";

export const permissionGuard = (to, from, next) => {
  const authStore = useAuthStore();

  // 1. Si la ruta no tiene definido un permiso, dejar pasar
  const requiredPermission = to.meta.permission;
  if (!requiredPermission) {
    return next();
  }

  // 2. Si es Administrador, tiene pase libre (según tu lógica de isAdmin)
  if (authStore.isAdmin) {
    return next();
  }

  // 3. Verificar si el permiso requerido está en el array del usuario
  const userPermissions = authStore.user?.permisos || [];
  const hasAccess = userPermissions.includes(requiredPermission);

  if (hasAccess) {
    next();
  } else {
    console.warn(
      `Acceso denegado a: ${to.path}. Falta permiso: ${requiredPermission}`,
    );
    next(authStore.redirectTo);
  }
};
