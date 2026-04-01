<template>
    <aside :class="[
        'sidebar',
        isOpen ? 'sidebar--open' : 'sidebar--closed',
        'max-lg:absolute max-lg:z-50 max-lg:top-0 max-lg:left-0',
        isOpen ? 'max-lg:!w-[280px]' : 'max-lg:!w-0'
    ]">

        <!-- Logo -->
        <div class="sidebar-logo">
            <span v-html="icoconfynormal" ref="logoRef"
                :class="['sidebar-logo__svg', isOpen ? 'opacity-100' : 'opacity-0']" />
        </div>

        <!-- Divider -->
        <div class="sidebar-divider" />

        <!-- Nav -->
        <nav class="sidebar-nav sidebar-scroll">

            <ul class="sidebar-list">
                <li v-for="(item, i) in menuItems" :key="item.route"
                    :class="['menu-item', isActive(item) ? 'menu-item--active' : '']"
                    :style="{ animationDelay: `${i * 0.04}s` }" @click="navigate(item.route)">

                    <span class="menu-icon" v-html="colorearSVG(item.icon, isActive(item) ? '#0D291C' : '#ffffff')" />

                    <p class="menu-label" v-html="item.label" :class="{ 'menu-label--active': isActive(item) }" />

                    <!-- Indicador activo -->
                    <span v-if="isActive(item)" class="menu-dot" />
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
/* ── Aside base ───────────────────────────────── */
.sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background: linear-gradient(175deg, #122e1e 0%, #0D291C 40%, #0a2016 100%);
    position: relative;
    overflow: hidden;
    /* transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); */
    flex-shrink: 0;
}

.sidebar--open {
    width: 20%;
}

.sidebar--closed {
    width: 0;
}

/* ── Logo ─────────────────────────────────────── */
.sidebar-logo {
    width: 100%;
    flex-shrink: 0;
}

.sidebar-logo__svg {
    display: block;
    width: 100%;
    transition: opacity 0.25s ease;
}

/* ── Divider ──────────────────────────────────── */
.sidebar-divider {
    width: 75%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(127, 211, 68, 0.2), transparent);
    flex-shrink: 0;
    margin-bottom: 4px;
}

/* ── Nav ──────────────────────────────────────── */
.sidebar-nav {
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 12.5% 16px;
    box-sizing: border-box;
}

.sidebar-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

/* ── Menu item ────────────────────────────────── */
.menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 48px;
    padding: 0 12px;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
    position: relative;
    transition:
        background 0.2s ease,
        transform 0.18s ease,
        box-shadow 0.2s ease;
    animation: itemFadeIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
    box-sizing: border-box;
    overflow: hidden;
}

@keyframes itemFadeIn {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.menu-item:hover:not(.menu-item--active) {
    background: rgba(255, 255, 255, 0.07);
    transform: translateX(2px);
}

.menu-item:active {
    transform: translateX(0) scale(0.98);
}

/* ── Active state ─────────────────────────────── */
.menu-item--active {
    background: white;
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.15),
        inset 3px 0 0 #7FD344;
}

.menu-item--active:hover {
    background: white;
    transform: none;
}

/* ── Icon ─────────────────────────────────────── */
.menu-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    transition: background 0.2s;
}

.menu-item--active .menu-icon {
    background: rgba(13, 41, 28, 0.07);
}

.menu-icon :deep(svg) {
    width: 30px;
    height: 30px;
    display: block;
    transition: fill 0.2s;
}

/* ── Label ────────────────────────────────────── */
.menu-label {
    color: rgba(255, 255, 255, 0.78);
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    transition: color 0.2s;
    letter-spacing: 0.005em;
}

.menu-item:hover:not(.menu-item--active) .menu-label {
    color: rgba(255, 255, 255, 0.95);
}

.menu-label--active {
    color: #0D291C !important;
    font-weight: 800;
}

/* ── Active dot ───────────────────────────────── */
.menu-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7FD344;
    flex-shrink: 0;
    animation: dotPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes dotPop {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

/* ── Scrollbar ────────────────────────────────── */
.sidebar-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
}

.sidebar-scroll::-webkit-scrollbar {
    width: 3px;
}

.sidebar-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 99px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* ── Reduced motion ───────────────────────────── */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
