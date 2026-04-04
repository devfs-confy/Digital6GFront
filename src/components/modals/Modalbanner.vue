<template>
    <Transition name="banner">
        <div v-if="visible" class="banner-overlay" @click.self="cerrar">
            <div class="banner-card">

                <!-- Botón cerrar -->
                <button @click="cerrar" class="banner-close" aria-label="Cerrar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>

                <!-- Imagen del banner -->
                <div class="banner-img-wrap">
                    <!-- Skeleton mientras carga -->
                    <div v-if="!imgCargada && !imgError" class="banner-skeleton" />

                    <!-- Error de carga -->
                    <div v-else-if="imgError" class="banner-error">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#d1d5db"
                            viewBox="0 0 24 24">
                            <path
                                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                        <span>Imagen no disponible</span>
                    </div>

                    <!-- Imagen real -->
                    <img v-show="imgCargada && !imgError" :src="imagenUrl" :alt="altTexto" class="banner-img"
                        @load="imgCargada = true" @error="imgError = true" />
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    // URL de la imagen — vendrá del endpoint cuando esté listo
    imagenUrl: { type: String, default: '' },
    altTexto: { type: String, default: 'Publicidad' },
    // Mostrar automáticamente al montar
    autoshow: { type: Boolean, default: true },
})

const emit = defineEmits(['cerrar'])

const visible = ref(false)
const imgCargada = ref(false)
const imgError = ref(false)

const cerrar = () => {
    visible.value = false
    emit('cerrar')
}

// Resetear estado de imagen cuando cambia la URL
watch(() => props.imagenUrl, () => {
    imgCargada.value = false
    imgError.value = false
})

onMounted(() => {
    if (props.autoshow) visible.value = true
})

// Exponer para abrir desde el padre cuando llegue el endpoint
defineExpose({ abrir: () => { visible.value = true } })
</script>

<style scoped>
/* ── Overlay ── */
.banner-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
}

/* ── Card 300×250 ── */
.banner-card {
    position: relative;
    width: 320px;
    height: 480px;
    border-radius: 20px;
    overflow: visible;
    border: 2.5px solid #0D291C;
    box-shadow: 0 8px 0 #0D291C, 0 20px 60px rgba(0, 0, 0, 0.35);
    flex-shrink: 0;
}

/* ── Botón cerrar ── */
.banner-close {
    position: absolute;
    top: -14px;
    right: -14px;
    z-index: 10;
    width: 32px;
    height: 32px;
    border-radius: 999px;
    background: white;
    border: 2.5px solid #0D291C;
    box-shadow: 0 3px 0 #0D291C;
    color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s, color 0.15s, border-color 0.15s;
}

.banner-close:hover {
    background: #fee2e2;
    border-color: #dc2626;
    box-shadow: 0 3px 0 #dc2626;
    color: #dc2626;
}

.banner-close:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #dc2626;
}

/* ── Imagen ── */
.banner-img-wrap {
    width: 100%;
    height: 100%;
    border-radius: 18px;
    overflow: hidden;
    background: #f3f4f6;
}

.banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* ── Skeleton ── */
.banner-skeleton {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

/* ── Error ── */
.banner-error {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #9ca3af;
    font-size: 0.72rem;
    font-weight: 600;
}

/* ── Animaciones ── */
.banner-enter-active {
    transition: opacity 0.25s ease;
}

.banner-leave-active {
    transition: opacity 0.18s ease;
}

.banner-enter-from,
.banner-leave-to {
    opacity: 0;
}

.banner-enter-active .banner-card {
    animation: popIn 0.32s cubic-bezier(0.34, 1.5, 0.64, 1) both;
}

.banner-leave-active .banner-card {
    animation: popOut 0.18s ease-in both;
}

@keyframes popIn {
    from {
        transform: scale(0.82) translateY(20px);
        opacity: 0
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1
    }
}

@keyframes popOut {
    from {
        transform: scale(1) translateY(0);
        opacity: 1
    }

    to {
        transform: scale(0.9) translateY(10px);
        opacity: 0
    }
}

/* ── Mobile ── */
@media (max-width: 360px) {
    .banner-card {
        width: 300px;
        height: 450px;
    }
}
</style>