<template>
    <AppLayout :menuItems="operadorMenuItems" titulo="Operador" />
</template>

<script setup>
import AppLayout from './AppLayout.vue'
import { operadorMenuItems } from '../router/routes/operadorRoutes.js'
</script>