<template>
    <Suspense>
        <template #default>
            <AppLayout :menuItems="menuFiltrado" titulo="Administrador" />
        </template>
        <template #fallback>
            <AppLayoutSkeleton :menuItems="menuFiltrado" titulo="Administrador" />
        </template>
    </Suspense>
</template>

<script setup>
import { computed } from 'vue'
import AppLayout from './AppLayout.vue'
import AppLayoutSkeleton from './AppLayout.skeleton.vue'
import { adminMenuItems } from '../router/routes/adminRoutes.js'
import { useAuth } from '@/composables/useAuth'

const { hasPermission } = useAuth()

const menuFiltrado = computed(() => {
    return adminMenuItems.filter(item => {
        return !item.permission || hasPermission(item.permission)
    })
})
</script>