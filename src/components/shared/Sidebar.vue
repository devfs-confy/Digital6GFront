<template>
    <aside :class="[
        'flex flex-col items-center h-screen bg-[#0D291C]',
        'relative transition-[width] duration-300 ease-in-out overflow-hidden',
        isOpen ? 'w-[20%]' : 'w-0',
        'max-lg:absolute max-lg:z-50 max-lg:top-0 max-lg:left-0',
        isOpen ? 'max-lg:w-[280px]' : 'max-lg:w-0'
    ]">

        <!-- Logo — altura fija, nunca se comprime -->
        <div class="w-full flex-shrink-0">
            <span v-html="icoconfynormal" ref="logoRef"
                :class="['transition-opacity duration-300 w-full block', isOpen ? 'opacity-100' : 'opacity-0']" />
        </div>

        <!-- Menu items — ocupa el espacio restante y hace scroll si se desborda -->
        <nav class="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-[12.5%] py-4 sidebar-scroll">
            <ul class="flex flex-col gap-4 w-full">
                <li v-for="item in menuItems" :key="item.route" @click="navigate(item.route)" :class="[
                    'flex items-center gap-3 w-full h-[55px] px-3 cursor-pointer text-lg',
                    'rounded-xl transition-all duration-200 select-none',
                    'hover:bg-white/10',
                    isActive(item) ? 'selected' : ''
                ]">
                    <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                        v-html="colorearSVG(item.icon, isActive(item) ? '#232B3A' : '#ffffff')" />
                    <p v-html="item.label"
                        class="text-white text-start  leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
                        :class="{ '!text-[#232B3A]': isActive(item) }" />
                </li>
            </ul>
        </nav>

    </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import icoconfynormal from '@/assets/img/confyaside.svg?raw'

const logoRef = ref(null)

defineProps({
    menuItems: Array,
    isOpen: Boolean
})

const emit = defineEmits(['toggle'])
const router = useRouter()
const route = useRoute()

onMounted(() => {
    const gCerrar = logoRef.value?.querySelector('#cerrar')
    if (gCerrar) {
        gCerrar.style.cursor = 'pointer'
        gCerrar.addEventListener('click', () => emit('toggle'))
    }
})

const navigate = (ruta) => router.push(ruta)

const isActive = (item) => {
    if (item.activeFor) return item.activeFor.some(r => route.path.startsWith(r))
    return route.path === item.route
}

const colorearSVG = (svgRaw, color) =>
    svgRaw
        .replace(/fill="[^"]*"/g, `fill="${color}"`)
        .replace(/fill:[^;"]*/g, `fill:${color}`)
</script>

<style scoped>
aside {
    transition: width 0.3s ease;
}

.selected {
    background-color: white;
    color: #232B3A;
    border-radius: 10px;
    padding-left: 12px;
}

/* Scrollbar visible pero discreta — solo aparece cuando hay overflow */
.sidebar-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.sidebar-scroll::-webkit-scrollbar {
    width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 99px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.4);
}
</style>