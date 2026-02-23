<!-- layouts/AdminLayout.vue -->
<template>
    <AppLayout :menuItems="adminMenuItems" titulo="Administrador" />
</template>

<script setup>
import AppLayout from './AppLayout.vue'
import { adminMenuItems } from '../router/routes/adminRoutes.js'
</script>