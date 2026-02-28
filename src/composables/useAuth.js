import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

export function useAuth() {
  const authStore = useAuthStore();
  const { user, isAdmin } = storeToRefs(authStore);

  const hasPermission = (permission) => {
    if (isAdmin.value) return true;

    const userPermissions = user.value?.permisos || [];

    if (!permission) return true;

    return userPermissions.includes(permission.toUpperCase());
  };

  return {
    hasPermission,
    isAdmin,
    user,
  };
}
