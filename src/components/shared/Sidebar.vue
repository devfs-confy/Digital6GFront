<template>
    <aside :class="[
        'flex flex-col items-center h-screen bg-[#0D291C] overflow-hidden gap-[10%]',
        'relative',
        isOpen ? 'w-[20%]' : 'w-[0%]',
        'max-lg:absolute max-lg:z-50 max-lg:top-0 max-lg:left-0',
        isOpen ? 'max-lg:w-[280px]' : 'max-lg:w-[0%]'
    ]">

        <!-- Logo -->
        <span v-html="icoconfynormal" ref="logoRef"
            :class="['transition-opacity duration-300 w-full', isOpen ? 'opacity-100' : 'opacity-0']" />

        <!-- Menu items -->
        <div class="w-[75%] mt-[10%]">
            <ul class="flex flex-col items-start gap-4 w-full text-start">
                <li v-for="item in menuItems" :key="item.route" @click="navigate(item.route)" :class="[
                    'flex items-center gap-[5%] w-full h-[50px] cursor-pointer transition-all duration-200',
                    { selected: isActive(item) }
                ]">
                    <span v-html="colorearSVG(item.icon, isActive(item) ? '#232B3A' : '#ffffff')" />
                    <p v-html="item.label" class="text-white whitespace-nowrap"
                        :class="{ '!text-[#232B3A]': isActive(item) }" />
                </li>
            </ul>
        </div>

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

// ── Una sola isActive — soporta activeFor ─────────────────────────
const isActive = (item) => {
    if (item.activeFor) {
        return item.activeFor.some(r => route.path.startsWith(r))
    }
    return route.path === item.route
}

const colorearSVG = (svgRaw, color) => {
    return svgRaw
        .replace(/fill="[^"]*"/g, `fill="${color}"`)
        .replace(/fill:[^;"]*/g, `fill:${color}`)
}
</script>

<style scoped>
.selected {
    background-color: white;
    color: #232B3A;
    border-radius: 10px;
    padding-left: 15px;
}

aside {
    transition: width 0.3s ease;
}
</style>