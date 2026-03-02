// Directiva global — elimina el nodo del DOM si el usuario no tiene el permiso.
// Registro en main.js: app.directive('permission', vPermission)

import { useAuthStore } from "@/stores/auth";

export const vPermission = {
  mounted(el, binding) {
    const authStore = useAuthStore();

    const permission = binding.value; // "VER-USUARIOS"
    const userPermissions = authStore.user?.permisos ?? [];
    const isAdmin = authStore.isAdmin; // computed del store

    // Sin valor requerido → visible
    if (!permission) return;

    // SUPER-ADMIN / ADMIN → bypass total, siempre visible
    if (isAdmin) return;

    // Buscar el permiso en el array del JWT (case-insensitive)
    const hasPermission = userPermissions.some(
      (p) => p.toUpperCase() === permission.toUpperCase(),
    );

    if (!hasPermission) {
      el.parentNode?.removeChild(el);
    }
  },
};
