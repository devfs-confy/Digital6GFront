<template>
    <div
        class="flex justify-between items-center text-white bg-[#0D291C] mx-4 mt-4 px-4 rounded-[5vw] p-[0.5%] h-[10%]">

        <div class="flex items-center gap-4">
            <span v-html="colapsenobg" @click="emit('toggle')" :class="[
                'cursor-pointer transition-all duration-300',
                isOpen ? 'w-0 opacity-0 pointer-events-none hidden' : 'w-8 opacity-100'
            ]" />
            <h1 class="font-bold text-2xl md:text-3xl p-[1vw]">{{ titulo }}</h1>
        </div>

        <!-- Dropdown usuario -->
        <div class="relative flex items-center gap-4">
            <p>{{ auth.user?.nombre ?? 'Usuario' }}</p>

            <!-- Botón icono -->
            <span v-html="icoaccount" @click="dropdownOpen = !dropdownOpen" class="cursor-pointer" />

            <!-- Dropdown -->
            <div v-if="dropdownOpen"
                class="absolute right-0 top-[120%] bg-white text-[#232B3A] rounded-xl shadow-lg py-2 w-[160px] z-50">
                <button @click="handleLogout"
                    class="flex itemsacenter gap-2 w-full px-4 py-2 hover:bg-[#f0f0f0] transition-colors text-sm font-medium">
                    Cerrar sesión
                </button>
            </div>
        </div>

    </div>

    <!-- Overlay para cerrar al hacer click fuera -->
    <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 z-40" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import colapsenobg from '@/assets/img/colapsenobg.svg?raw'
import icoaccount from '@/assets/img/account_circle.svg?raw'

defineProps({
    isOpen: Boolean,
    titulo: String
})

const emit = defineEmits(['toggle'])
const auth = useAuthStore()
const router = useRouter()
const dropdownOpen = ref(false)

function handleLogout() {
    dropdownOpen.value = false
    auth.logout()
    router.push('/login')
}
</script>
