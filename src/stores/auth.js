import { defineStore } from "pinia";
import { ref, computed } from "vue";

const mockUsuarios = [
  {
    id: 1,
    nombre: "Jean Carlos",
    documento: "123456",
    password: "1234",
    role: "cliente",
  },
  {
    id: 2,
    nombre: "Admin User",
    documento: "654321",
    password: "1234",
    role: "administrador",
  },
  {
    id: 3,
    nombre: "Operador",
    documento: "111111",
    password: "1234",
    role: "operador",
  },
];

const roleRedirects = {
  administrador: "/admin/dashboard",
  cliente: "/cliente/inicio",
  operador: "/operador/inicio",
};

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const token = ref(null);
    const role = ref(null);

    const isLoggedIn = computed(() => !!token.value);
    const userRole = computed(() => role.value);
    const redirectTo = computed(() => roleRedirects[role.value] ?? "/login");

    function login(documento, password) {
      // simula búsqueda en base de datos
      const encontrado = mockUsuarios.find(
        (u) => u.documento === documento && u.password === password,
      );

      if (!encontrado) {
        throw new Error("Documento o contraseña incorrectos");
      }

      // simula token
      user.value = { id: encontrado.id, nombre: encontrado.nombre };
      token.value = "mock-token-" + encontrado.id;
      role.value = encontrado.role;
    }

    function logout() {
      user.value = null;
      token.value = null;
      role.value = null;
    }

    return {
      user,
      token,
      role,
      isLoggedIn,
      userRole,
      redirectTo,
      login,
      logout,
    };
  },
  { persist: true },
);
