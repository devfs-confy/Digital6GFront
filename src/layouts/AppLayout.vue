<!-- layouts/AppLayout.vue -->
<template>
    <div class="flex h-screen w-full bg-[#F0F0F0] overflow-hidden">

        <div v-if="isOpen && isMobile" @click="isOpen = false" class="fixed inset-0 bg-black/50 z-40" />


        <Sidebar :menuItems="menuItems" :isOpen="isOpen" @toggle="isOpen = !isOpen" />

        <div class="flex flex-col flex-1 h-screen w-full">
            <Navbar :isOpen="isOpen" @toggle="isOpen = !isOpen" :titulo="titulo" />
            <main class="flex-1 overflow-auto p-6 styled-scrollbar">
                <router-view />
            </main>
        </div>

    </div>

    <ModalBanner :imagenes="bannerUrl" :autoshow="true" />


</template>

<style></style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '../components/shared/Sidebar.vue'
import Navbar from '../components/shared/Navbar.vue'
import ModalBanner from '@/components/modals/ModalBanner.vue'
import publicidadService from '@/api/services/publicidad.service'
const bannerUrl = ref([])


onMounted(async () => {
    const publicidad =  await publicidadService.getMiPublicidad()
    if(publicidad?.data?.length > 0) {
        bannerUrl.value = publicidad.data.map(item => item.Imagen)
    }
    console.log('Publicidad obtenida:', bannerUrl.value)
})

defineProps({
    menuItems: Array,
    titulo: String
})

// await new Promise(r => setTimeout(r, 2000))

const isOpen = ref(window.innerWidth >= 1024)
const isMobile = ref(window.innerWidth < 1024)

const checkMobile = () => {
    const mobile = window.innerWidth < 1024
    if (isMobile.value !== mobile) {
        isMobile.value = mobile
        isOpen.value = !mobile
    }
}

onMounted(() => window.addEventListener('resize', checkMobile))
onUnmounted(() => window.removeEventListener('resize', checkMobile))
</script>