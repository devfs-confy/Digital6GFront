<!-- layouts/ClienteLayout.vue -->
<template>
    <AppLayout :menuItems="clienteMenuItems" titulo="Dashboard" />
</template>

<script setup>
import AppLayout from './AppLayout.vue'
import { clienteMenuItems } from '../router/routes/clienteRoutes.js'
</script>