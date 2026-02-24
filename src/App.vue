<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

// Al arrancar la app verifica si el token guardado sigue vigente.
// Si venció lo renueva automáticamente — el usuario no nota nada.
// Si el refresh también falló hace logout y el guard redirige a /login.
onMounted(async () => {
  await auth.restoreSession();
});
</script>