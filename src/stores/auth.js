import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/api/axios";

const roleRedirects = {
  administrador: "/admin/dashboard",
  admin: "/admin/dashboard",
  cliente: "/cliente/inicio",
};

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const token = ref(null);
    const role = ref(null);
    const loading = ref(false);
    const errorMsg = ref(null);

    // ── Computed ────────────────────────────────────────────────────
    const isLoggedIn = computed(() => !!token.value);
    const isAuthenticated = computed(() => !!token.value); // alias para authGuard
    const redirectTo = computed(() => roleRedirects[role.value] ?? "/login");
    const isAdmin = computed(() => {
      const nombreRol = user.value?.rol?.nombre?.toUpperCase();
      return (
        nombreRol === "SUPER-ADMIN" ||
        role.value === "admin" ||
        role.value === "administrador"
      );
    });
    const isCliente = computed(() => role.value === "cliente");

    // ── Login ───────────────────────────────────────────────────────
    async function login(documento, password) {
      loading.value = true;
      errorMsg.value = null;

      try {
        const { data } = await api.post("/auth/login", {
          Documento: documento,
          Password: password,
        });

        if (!data.success) {
          errorMsg.value = data.message ?? "Error al iniciar sesión.";
          return null;
        }

        token.value = data.data?.token ?? null;

        const payload = JSON.parse(atob(token.value.split(".")[1]));
        role.value = payload.tipoUsuario?.toLowerCase() ?? null;
        user.value = {
          nombres: payload.nombres,
          apellidos: payload.apellidos,
          email: payload.email,
          documento: payload.documento,
          permisos: payload.permisos ?? [],
          rol: payload.rol,
        };

        return roleRedirects[role.value] ?? "/login";
      } catch (err) {
        console.log(err);
        const status = err.response?.status;
        const mensaje = err.response?.data?.message;

        if (status === 429)
          errorMsg.value = "Demasiados intentos. Espera unos minutos.";
        else if (status === 409)
          errorMsg.value =
            mensaje ?? "Usuario inactivo. Contacta al administrador.";
        else if (status === 401 || status === 400)
          errorMsg.value = mensaje ?? "Documento o contraseña incorrectos.";
        else if (status === 404)
          errorMsg.value = mensaje ?? "Usuario no encontrado.";
        else if (status >= 500)
          errorMsg.value = "Petición fallida. Intenta de nuevo.";
        else if (!err.response)
          errorMsg.value = "Sin conexión con el servidor.";
        else errorMsg.value = mensaje ?? "Ocurrió un error inesperado.";

        return null;
      } finally {
        loading.value = false;
      }
    }

    // ── Logout ──────────────────────────────────────────────────────
    function logout() {
      user.value = null;
      token.value = null;
      role.value = null;
      errorMsg.value = null;
    }

    // ── Restore Session ─────────────────────────────────────────────
    // Lee el JWT guardado y restaura user/role sin llamar al backend.
    // Si el token venció hace logout para que el guard redirija a /login.
    async function restoreSession() {
      if (!token.value) return logout();

      try {
        const payload = JSON.parse(atob(token.value.split(".")[1]));
        const exp = payload.exp * 1000;

        if (Date.now() > exp) {
          const newToken = await refreshAccessToken();
          if (!newToken) return logout();
          return;
        }

        role.value = payload.tipoUsuario?.toLowerCase() ?? null;
        user.value = {
          nombres: payload.nombres,
          apellidos: payload.apellidos,
          email: payload.email,
          documento: payload.documento,
          telefono: payload.telefono,
          rol: payload.rol,
          permisos: payload.permisos ?? [],
        };
      } catch {
        logout();
      }
    }
    // ── Refresh Access Token ────────────────────────────────────────
    // Llamado desde el interceptor de axios cuando hay un 401.
    async function refreshAccessToken() {
      try {
        const { data } = await api.post("/api/auth/refresh");
        const newToken = data.data?.token ?? data.access_token ?? null;

        if (!newToken) throw new Error("No se recibió nuevo token");

        token.value = newToken;

        // Restaurar user/role desde el nuevo JWT
        const payload = JSON.parse(atob(newToken.split(".")[1]));
        role.value = payload.tipoUsuario?.toLowerCase() ?? null;
        user.value = {
          nombres: payload.nombres,
          apellidos: payload.apellidos,
          email: payload.email,
          documento: payload.documento,
        };

        return newToken;
      } catch {
        logout();
        return null;
      }
    }

    return {
      user,
      token,
      role,
      loading,
      errorMsg,
      isLoggedIn,
      isAuthenticated,
      redirectTo,
      isAdmin,
      isCliente,
      login,
      logout,
      restoreSession,
      refreshAccessToken,
    };
  },
  {
    persist: {
      pick: ["token", "role", "user"],
    },
  },
);
