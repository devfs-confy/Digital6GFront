<template>
    <div class="ss-root">
        <div class="blob blob-1" />
        <div class="blob blob-2" />

        <div class="ss-card">
            <div class="top-accent" />

            <!-- Volver desktop -->
            <button @click="$router.push('/login')"
                class="flex items-center gap-1.5 text-[0.76rem] font-extrabold bg-transparent border-none cursor-pointer p-0 transition-colors w-fit mb-4"
                style="color:#0D291C; font-family:'Funnel Display','Roboto',sans-serif"
                onmouseover="this.style.color='#299261'" onmouseout="this.style.color='#0D291C'">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Volver
            </button>
            <!-- Header -->
            <div class="ss-header">
                <div class="ss-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344" viewBox="0 0 24 24">
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                </div>
                <div>
                    <span class="ss-badge">Registro</span>
                    <h1>Elige tu sede</h1>
                    <p>Selecciona la sede donde tienes tu mensualidad</p>
                </div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="sedes-grid">
                <div v-for="n in 6" :key="n" class="skeleton-card" />
            </div>

            <!-- Grid de sedes -->
            <div v-else class="sedes-grid">
                <div v-if="sedes.length === 0" class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    No hay sedes disponibles
                </div>

                <div v-for="(sede, i) in sedes" :key="sede.IdEstacionamiento" class="sede-card"
                    :class="{ 'sede-card--selected': sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento }"
                    :style="{ animationDelay: `${i * 0.05}s` }" @click="seleccionarSede(sede)">

                    <div class="sede-check"
                        :class="{ 'sede-check--on': sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    </div>

                    <div class="sede-icon"
                        :class="{ 'sede-icon--on': sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                    </div>

                    <p class="sede-nombre">{{ sede.Nombre }}</p>
                </div>
            </div>

            <!-- Acciones -->
            <div class="ss-actions">
                <button @click="continuar" :disabled="!sedeSeleccionada" class="btn-continuar">
                    <span>Continuar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" class="btn-arrow">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
                <button @click="$router.push('/login')" class="btn-volver">
                    ← Volver al inicio de sesión
                </button>
            </div>
        </div>

        <!-- ── Botón tutorial fijo ── -->
        <button @click="showTutorial = true" class="tutorial-fab">
            <AppIcon name="info_i_green" :size="20" />
            <span>Ayuda</span>
        </button>

        <!-- ── Modal tutorial ── -->
        <Transition name="tut">
            <div v-if="showTutorial" class="tutorial-overlay" @click.self="showTutorial = false">
                <div class="tutorial-card">
                    <div class="tutorial-header">
                        <div class="tutorial-header-icon">
                            <AppIcon name="info_i" :size="18" />
                        </div>
                        <div class="tutorial-header-text">
                            <p class="tutorial-title">Seleccionar sede</p>
                            <p class="tutorial-subtitle">¿Cómo usar esta pantalla?</p>
                        </div>
                        <button @click="showTutorial = false" class="tutorial-close">✕</button>
                    </div>
                    <div class="tutorial-body">

                        <div class="tutorial-step">
                            <div class="tutorial-step-num">1</div>
                            <div class="tutorial-step-icon" style="background:#f0faf4;border-color:#c8e6c9;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#299261"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">Elige tu sede</p>
                                <p class="tutorial-step-desc">Selecciona la sede donde tienes activa o deseas activar tu
                                    mensualidad de parqueo. Toca una tarjeta para marcarla.</p>
                            </div>
                        </div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-num">2</div>
                            <div class="tutorial-step-icon" style="background:#232b3a14;border-color:#232b3a22;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#232B3A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">Continuar</p>
                                <p class="tutorial-step-desc">Una vez seleccionada la sede, presiona este botón para
                                    avanzar al formulario de registro.</p>
                            </div>
                        </div>

                        <div class="tutorial-divider">Opciones adicionales</div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon"
                                style="background:#fef2f2;border-color:#fecaca;margin-left:0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">Volver al inicio de sesión</p>
                                <p class="tutorial-step-desc">Si ya tienes una cuenta registrada, regresa al inicio de
                                    sesión desde este botón.</p>
                            </div>
                        </div>

                    </div>
                    <div class="tutorial-footer">
                        <button @click="showTutorial = false" class="tutorial-btn-close">Entendido</button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SedesService from '@/api/services/sedes.service'

const router = useRouter()
const showTutorial = ref(false)
const sedes = ref([])
const loading = ref(true)
const sedeSeleccionada = ref(null)

const cargarSedes = async () => {
    loading.value = true
    try {
        const res = await SedesService.getAll()
        sedes.value = (Array.isArray(res) ? res : (res?.data ?? []))
            .filter(s => s.Estado)
    } catch (e) {
        console.error('[SeleccionSede]', e.response?.data ?? e.message)
        sedes.value = []
    } finally {
        loading.value = false
    }
}

onMounted(cargarSedes)

const seleccionarSede = (sede) => { sedeSeleccionada.value = sede }

const continuar = () => {
    if (!sedeSeleccionada.value) return
    router.push({
        name: 'registro',
        query: {
            sede: sedeSeleccionada.value.IdEstacionamiento,
            sedeNombre: sedeSeleccionada.value.Nombre,
        }
    })
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
</style>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.ss-root {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    background-color: #0D291C;
    padding: 24px 16px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    font-family: 'Funnel Display', 'Roboto', sans-serif;
}

/* ── Background blobs ─────────────────────────── */
.blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    z-index: 0;
    pointer-events: none;
}

.blob-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(41, 146, 97, 0.24) 0%, transparent 70%);
    top: -150px;
    left: -150px;
}

.blob-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(127, 211, 68, 0.15) 0%, transparent 70%);
    bottom: -110px;
    right: -110px;
}

/* ── Card ─────────────────────────────────────── */
.ss-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 640px;
    background: #fff;
    border-radius: 28px;
    overflow: hidden;
    padding: 40px 44px 44px;
    box-sizing: border-box;
    box-shadow:
        0 30px 70px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.04);
    animation: cardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(26px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.top-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #299261, #7FD344 50%, #299261);
}

/* ── Header ───────────────────────────────────── */
.ss-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 28px;
}

.ss-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 0 #051510;
}

.ss-badge {
    display: inline-block;
    color: #299261;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    margin-bottom: 6px;
}

.ss-header h1 {
    font-size: 1.55rem;
    font-weight: 800;
    color: #232B3A;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin: 0 0 5px;
}

.ss-header p {
    font-size: 0.84rem;
    color: #a0aec0;
    margin: 0;
    line-height: 1.45;
}

/* ── Grid ─────────────────────────────────────── */
.sedes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 28px;
}

@media (max-width: 520px) {
    .sedes-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* ── Skeleton ─────────────────────────────────── */
.skeleton-card {
    height: 108px;
    border-radius: 16px;
    background: #f1f5f9;
    animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {

    0%,
    100% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }
}

/* ── Empty state ──────────────────────────────── */
.empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 40px 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: #c4cdd8;
}

/* ── Sede card ────────────────────────────────── */
.sede-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 18px 10px 14px;
    border-radius: 16px;
    border: 1.5px solid #e8ecf0;
    background: #f7f8fa;
    cursor: pointer;
    user-select: none;
    animation: cardItemIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
}

@keyframes cardItemIn {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.sede-card:hover {
    border-color: #b8e6cc;
    background: #f0fdf4;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(41, 146, 97, 0.12);
}

.sede-card--selected {
    border-color: #299261 !important;
    background: #f0fdf4 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12), 0 6px 18px rgba(41, 146, 97, 0.12) !important;
}

/* ── Check badge ──────────────────────────────── */
.sede-check {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #299261;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.2s, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sede-check--on {
    opacity: 1;
    transform: scale(1);
}

/* ── Sede icon ────────────────────────────────── */
.sede-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #e8ecf0;
    background: #fff;
    color: #b0bec5;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    flex-shrink: 0;
}

.sede-icon--on {
    background: #299261;
    color: #fff;
    border-color: #299261;
}

/* ── Sede text ────────────────────────────────── */
.sede-nombre {
    font-size: 0.73rem;
    font-weight: 800;
    color: #232B3A;
    text-align: center;
    line-height: 1.2;
    margin: 0;
}

.sede-id {
    font-size: 0.56rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #b0bec5;
    margin: 0;
}

/* ── Actions ──────────────────────────────────── */
.ss-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

/* ── Continue button ──────────────────────────── */
.btn-continuar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #232B3A;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
    font-family: 'Funnel Display', 'Roboto', sans-serif;
    padding: 13px 28px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
}

.btn-continuar:hover:not(:disabled) {
    background: #299261;
    box-shadow: 0 8px 24px rgba(41, 146, 97, 0.35);
    transform: translateY(-1px);
}

.btn-continuar:active:not(:disabled) {
    transform: translateY(0);
}

.btn-continuar:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.btn-arrow {
    transition: transform 0.2s ease;
}

.btn-continuar:hover:not(:disabled) .btn-arrow {
    transform: translateX(4px);
}

/* ── Back link ────────────────────────────────── */
.btn-volver {
    font-size: 0.78rem;
    font-weight: 600;
    font-family: "Funnel Display", "Roboto", sans-serif;
    color: #a0aec0;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
}

.btn-volver:hover {
    color: #299261;
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

/* ── Responsive ───────────────────────────────── */
@media (max-width: 480px) {
    .ss-card {
        padding: 32px 20px 36px;
        border-radius: 22px;
    }

    .ss-header h1 {
        font-size: 1.35rem;
    }
}
</style>
