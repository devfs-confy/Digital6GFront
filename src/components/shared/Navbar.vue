<template>
    <div
        class="flex justify-between items-center text-white bg-[#0D291C] mx-4 mt-4 px-4 rounded-[5vw] p-[0.5%] h-[10%]">

        <!-- Izquierda: botón colapsar + título -->
        <div class="flex items-center gap-3 min-w-0">
            <span v-html="colapsenobg" @click="emit('toggle')" :class="[
                'cursor-pointer transition-all duration-300 flex-shrink-0',
                isOpen ? 'w-0 opacity-0 pointer-events-none hidden' : 'w-8 opacity-100'
            ]" />

            <!-- Título: completo en desktop, truncado en tablet, oculto en mobile -->
            <h1 class="font-bold titulo-nav truncate">{{ titulo }}</h1>
        </div>

        <!-- Derecha: usuario + dropdown -->
        <div class="relative flex items-center gap-2 flex-shrink-0">

            <!-- Nombre del usuario — visible en sm en adelante -->
            <div class="user-info">
                <span class="user-role">{{ auth.user?.email ?? '' }}</span>
                <span class="user-name">{{ auth.user?.nombres ?? 'Usuario' }}</span>
            </div>

            <!-- Botón avatar con inicial + ícono -->
            <button @click="dropdownOpen = !dropdownOpen" class="avatar-btn"
                :class="{ 'avatar-btn--open': dropdownOpen }">
                <!-- Inicial del nombre -->
                <span class="avatar-initial">
                    {{ inicial(auth.user?.nombres ?? '') }}
                </span>
                <!-- Flecha chevron -->
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"
                    class="chevron-icon" :class="{ 'chevron-icon--open': dropdownOpen }">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
                <div v-if="dropdownOpen" class="dropdown-menu">

                    <!-- Header del dropdown -->
                    <div class="dropdown-header">
                        <div class="dropdown-avatar">{{ inicial(auth.user?.nombres ?? '') }}</div>
                        <div class="dropdown-user-info">
                            <p class="dropdown-name">{{ auth.user?.nombres ?? 'Usuario' }}</p>
                            <p class="dropdown-role">{{ auth.user?.tipoUsuario ?? '' }}</p>
                        </div>
                    </div>

                    <div class="dropdown-divider"></div>

                    <button @click="handleLogout" class="dropdown-item dropdown-item--danger">
                        <!-- Ícono salir -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Cerrar sesión
                    </button>
                </div>
            </Transition>
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
import { addonCategoryNames } from '@vueuse/core/metadata.mjs'

defineProps({
    isOpen: Boolean,
    titulo: String
})

const emit = defineEmits(['toggle'])
const auth = useAuthStore()
const router = useRouter()
const dropdownOpen = ref(false)

const inicial = (nombre = '') =>
    nombre.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

function handleLogout() {
    dropdownOpen.value = false
    auth.logout()
    router.push('/login')
}
</script>

<style scoped>
.titulo-nav {
    font-size: clamp(1rem, 3vw, 1.75rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 30vw;
}

@media (max-width: 480px) {
    .titulo-nav {
        display: none;
    }
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;
}

.user-role {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7FD344;
    opacity: 0.85;
}

.user-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
}

@media (max-width: 480px) {
    .user-info {
        display: none;
    }
}

.avatar-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    /* background-color: rgba(127, 211, 68, 0.15);
    border: 1.5px solid rgba(127, 211, 68, 0.3); */
    border-radius: 999px;
    padding: 5px 10px 5px 5px;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.2s;
    color: white;
}

.avatar-btn:hover,
.avatar-btn--open {
    /* background-color: rgba(127, 211, 68, 0.25); */
    /* border-color: #7FD344; */
    border-color: rgb(13 41 28 / var(--tw-bg-opacity, 1));
}

.avatar-initial {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #7FD344;
    color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.72rem;
    flex-shrink: 0;
}

@media (max-width: 480px) {
    .avatar-initial {
        width: 34px;
        height: 34px;
        font-size: 0.8rem;
    }

    .avatar-btn {
        padding: 4px 8px 4px 4px;
    }
}

.chevron-icon {
    transition: transform 0.2s ease;
    opacity: 0.7;
    flex-shrink: 0;
}

.chevron-icon--open {
    transform: rotate(180deg);
    opacity: 1;
}

.dropdown-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    background-color: white;
    color: #232B3A;
    border-radius: 18px;
    box-shadow: 0 8px 30px rgba(13, 41, 28, 0.2), 0 3px 0 #0D291C;
    border: 1.5px solid #e8f5e9;
    width: 210px;
    z-index: 50;
    overflow: hidden;
}

.dropdown-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background-color: #0D291C;
}

.dropdown-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #7FD344;
    color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.8rem;
    flex-shrink: 0;
}

.dropdown-user-info {
    min-width: 0;
}

.dropdown-name {
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dropdown-role {
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #7FD344;
    opacity: 0.8;
}

.dropdown-divider {
    height: 1px;
    background-color: #e8f5e9;
    margin: 0;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 16px;
    font-size: 0.84rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s;
}

.dropdown-item:hover {
    background-color: #f9fafb;
}

.dropdown-item--danger {
    color: #dc2626;
}

.dropdown-item--danger:hover {
    background-color: #fff1f2;
}

.dropdown-enter-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-leave-active {
    transition: opacity 0.12s ease, transform 0.12s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
}
</style>