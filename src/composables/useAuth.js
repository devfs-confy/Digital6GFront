// Composable para validación de permisos en <script setup> y templates.
// Para ocultar del DOM usa v-permission (más seguro).
// Para lógica JS o v-if usa hasPermission() de este composable.

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

export function useAuth() {
  const authStore = useAuthStore();
  const { user, role } = storeToRefs(authStore);
  const { isAdmin } = storeToRefs(authStore);

  /**
   * El usuario tiene el permiso indicado.
   * @param {string} permission  Ej: "VER-USUARIOS" o PERMS.USUARIOS_VER
   */
  const hasPermission = (permission) => {
    if (!permission) return true; // sin restricción → libre
    if (isAdmin.value) return true; // bypass para admins

    const userPermissions = user.value?.permisos ?? [];
    return userPermissions.some(
      (p) => p.toUpperCase() === permission.toUpperCase(),
    );
  };

  /**
   * El usuario tiene TODOS los permisos del array.
   * Útil para secciones que requieren múltiples permisos simultáneos.
   * @param {string[]} permissions
   */
  const hasAllPermissions = (permissions = []) =>
    permissions.every((p) => hasPermission(p));

  /**
   * El usuario tiene AL MENOS UNO de los permisos.
   * Útil para mostrar un módulo si tiene cualquier permiso dentro de él.
   * @param {string[]} permissions
   */
  const hasAnyPermission = (permissions = []) =>
    permissions.some((p) => hasPermission(p));

  return {
    user,
    role,
    isAdmin,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };
}
