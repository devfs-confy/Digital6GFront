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
    const refreshToken = ref(null);
    const role = ref(null);
    const loading = ref(false);
    const errorMsg = ref(null);

    // ── Computed ────────────────────────────────────────────────────
    const isLoggedIn = computed(() => !!token.value);
    const isAuthenticated = computed(() => !!token.value); // alias para authGuard
    const redirectTo = computed(() => roleRedirects[role.value] ?? "/login");
    const isAdmin = computed(() => {
      const nombreRol = user.value?.rol?.nombre?.toUpperCase();
      return nombreRol === "SUPER-ADMIN" || nombreRol === "ADMIN";
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
        refreshToken.value = data.data?.refreshToken ?? null;

        const payload = JSON.parse(atob(token.value.split(".")[1]));
        role.value = payload.tipoUsuario?.toLowerCase() ?? null;
        user.value = {
          nombres: payload.nombres,
          apellidos: payload.apellidos,
          email: payload.email,
          documento: payload.documento,
          telefono: payload.telefono,
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
    async function logout() {
      user.value = null;
      token.value = null;
      refreshToken.value = null;
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
        const response = await api.post("/auth/refresh", {
          refreshToken: refreshToken.value,
        });
        const result = await response.data;
        console.log({result})
        const newToken = result.data?.token ?? null;
        const newRefresh = result.data?.refreshToken ?? null;

        if (!newToken) throw new Error("No se recibió nuevo token");

        token.value = newToken;
        if (newRefresh) refreshToken.value = newRefresh;

        // Restaurar user/role desde el nuevo JWT
        const payload = JSON.parse(atob(newToken.split(".")[1]));
        role.value = payload.tipoUsuario?.toLowerCase() ?? null;
        user.value = {
          nombres: payload.nombres,
          apellidos: payload.apellidos,
          email: payload.email,
          documento: payload.documento,
          telefono: payload.telefono,
          permisos: payload.permisos ?? [],
          rol: payload.rol,
        };

        return newToken;
      } catch {
        logout();
        return null;
      }
    }
    // ── Forgot Password ─────────────────────────────────────────────
    async function sendForgotCode(documento) {
      loading.value = true;
      errorMsg.value = null;
      try {
        const { data } = await api.post("auth/forgot-password", {
          Documento: documento,
        });

        if (!data?.success) {
          errorMsg.value = data?.message ?? "Error al enviar el código.";
          return null;
        }
        return data;
      } catch (err) {
        console.log(err);
        const status = err.response?.status;
        const mensaje = err.response?.data?.message;
        if (status === 404)
          errorMsg.value = mensaje ?? "Documento no encontrado.";
        else if (status === 429)
          errorMsg.value = "Demasiados intentos. Espera unos minutos.";
        else if (!err.response)
          errorMsg.value = "Sin conexión con el servidor.";
        else errorMsg.value = mensaje ?? "Error al enviar el código.";
        return null;
      } finally {
        loading.value = false;
      }
    }

    async function verifyForgotCode(documento, codigo) {
      loading.value = true;
      errorMsg.value = null;
      try {
        const { data } = await api.post("/auth/verify-code", {
          Documento: documento,
          Codigo: codigo,
        });
        if (!data?.success) {
          errorMsg.value = data?.message ?? "Código inválido.";
          return null;
        }
        return data;
      } catch (err) {
        const status = err.response?.status;
        const mensaje = err.response?.data?.message;
        if (status === 400) errorMsg.value = mensaje ?? "Código inválido.";
        else if (status === 410)
          errorMsg.value = "El código ha expirado. Solicita uno nuevo.";
        else if (status === 404)
          errorMsg.value = mensaje ?? "Documento no encontrado.";
        else if (!err.response)
          errorMsg.value = "Sin conexión con el servidor.";
        else errorMsg.value = mensaje ?? "Error al verificar el código.";
        return null;
      } finally {
        loading.value = false;
      }
    }

    async function resetPassword(documento, codigo, newPassword) {
      loading.value = true;
      errorMsg.value = null;
      try {
        const { data } = await api.post("/auth/reset-password", {
          Documento: documento,
          Codigo: codigo,
          NewPassword: newPassword,
        });
        if (!data?.success) {
          errorMsg.value = data?.message ?? "Error al cambiar la contraseña.";
          return null;
        }
        return data;
      } catch (err) {
        const status = err.response?.status;
        const mensaje = err.response?.data?.message;
        if (status === 400)
          errorMsg.value = mensaje ?? "Código o contraseña inválidos.";
        else if (status === 410)
          errorMsg.value = "El código ha expirado. Inicia el proceso de nuevo.";
        else if (status === 404)
          errorMsg.value = mensaje ?? "Documento no encontrado.";
        else if (!err.response)
          errorMsg.value = "Sin conexión con el servidor.";
        else errorMsg.value = mensaje ?? "Error al cambiar la contraseña.";
        return null;
      } finally {
        loading.value = false;
      }
    }

    const hasPermiso = (permiso) => {
      if (!permiso) return true; // rutas sin permiso → libre
      return user.value?.permisos?.includes(permiso) ?? false;
    };

    return {
      user,
      token,
      refreshToken,
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
      sendForgotCode,
      verifyForgotCode,
      resetPassword,
      hasPermiso,
    };
  },
  {
    persist: {
      pick: ["token", "refreshToken", "role", "user"],
    },
  },
);
