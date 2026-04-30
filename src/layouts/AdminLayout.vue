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
import { adminMenuItems } from '../router/routes/adminMenu.js'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const menuFiltrado = computed(() => {
    return adminMenuItems.filter(item => {
        // Sin permiso definido → visible para todos
        if (!item.permission) return true

        // SOLO bypass si es SUPER-ADMIN o ADMIN real (NO "administrador" genérico)
        const nombreRol = authStore.user?.rol?.nombre?.toUpperCase()
        const esSuperAdmin = nombreRol === 'SUPER-ADMIN' || nombreRol === 'ADMIN'
        if (esSuperAdmin) return true

        // Para todos los demás (EMPLEADO, GESTOR, etc.) → verificar permisos
        return authStore.user?.permisos?.includes(item.permission) ?? false
    })
})
</script>