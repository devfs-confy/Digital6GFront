<!-- layouts/AppLayout.vue -->
<template>
    <div class="flex h-screen w-screen bg-[#F0F0F0] overflow-hidden">

        <div v-if="isOpen && isMobile" @click="isOpen = false" class="fixed inset-0 bg-black/50 z-40" />

        <Sidebar :menuItems="menuItems" :isOpen="isOpen" @toggle="isOpen = !isOpen" />

        <div class="flex flex-col flex-1 h-screen">
            <Navbar :isOpen="isOpen" @toggle="isOpen = !isOpen" :titulo="titulo" />
            <main class="flex-1 overflow-auto p-6">
                <router-view />
            </main>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '../components/shared/Sidebar.vue'
import Navbar from '../components/shared/Navbar.vue'

defineProps({
    menuItems: Array,
    titulo: String
})

const isOpen = ref(window.innerWidth >= 768)
const isMobile = ref(window.innerWidth < 768)

const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) isOpen.value = false
}

onMounted(() => window.addEventListener('resize', checkMobile))
onUnmounted(() => window.removeEventListener('resize', checkMobile))
</script>