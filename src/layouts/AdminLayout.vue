<!-- layouts/AdminLayout.vue -->
<template>
    <Suspense>
        <template #default>
            <AppLayout :menuItems="adminMenuItems" titulo="Administrador" />
        </template>
        <template #fallback>
            <AppLayoutSkeleton :menuItems="adminMenuItems" titulo="Administrador" />
        </template>
    </Suspense>
</template>

<script setup>
import AppLayout from './AppLayout.vue'
import { adminMenuItems } from '../router/routes/adminRoutes.js'
import AppLayoutSkeleton from './AppLayout.skeleton.vue';
</script>