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

                <!-- Carousel de imágenes -->
                <div class="banner-img-wrap">
                    <div class="carousel-track" :style="{ transform: `translateX(-${indiceActual * 100}%)` }">
                        <div v-for="(img, i) in imagenes" :key="i" class="carousel-slide">
                            <!-- Skeleton mientras carga -->
                            <div v-if="!imgEstados[i]?.cargada && !imgEstados[i]?.error" class="banner-skeleton" />

                            <!-- Error de carga -->
                            <div v-else-if="imgEstados[i]?.error" class="banner-error">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#d1d5db"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                                <span>Imagen no disponible</span>
                            </div>

                            <!-- Imagen real (base64 o URL) -->
                            <img v-show="imgEstados[i]?.cargada && !imgEstados[i]?.error"
                                :src="img"
                                :alt="`${altTexto} ${i + 1}`"
                                class="banner-img"
                                @load="imgEstados[i].cargada = true"
                                @error="imgEstados[i].error = true" />
                        </div>
                    </div>
                </div>

                <!-- Controles del carousel (solo si hay más de 1 imagen) -->
                <template v-if="imagenes.length > 1">
                    <button class="carousel-btn carousel-btn-prev" @click="anterior" aria-label="Anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    <button class="carousel-btn carousel-btn-next" @click="siguiente" aria-label="Siguiente">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>

                    <!-- Indicadores (dots) -->
                    <div class="carousel-dots">
                        <button v-for="(_, i) in imagenes" :key="i"
                            class="carousel-dot" :class="{ active: i === indiceActual }"
                            @click="indiceActual = i" :aria-label="`Ir a imagen ${i + 1}`" />
                    </div>
                </template>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, onMounted, reactive } from 'vue'

const props = defineProps({
    // Array de imágenes en base64 (ej: ['data:image/png;base64,...', ...]) o URLs
    imagenes: { type: Array, default: () => [] },
    altTexto: { type: String, default: 'Publicidad' },
    autoshow: { type: Boolean, default: true },
})

const emit = defineEmits(['cerrar'])

const visible = ref(false)
const indiceActual = ref(0)
const imgEstados = reactive([])

const inicializarEstados = () => {
    imgEstados.length = 0
    props.imagenes.forEach(() => {
        imgEstados.push({ cargada: false, error: false })
    })
}

const cerrar = () => {
    visible.value = false
    emit('cerrar')
}

const siguiente = () => {
    indiceActual.value = (indiceActual.value + 1) % props.imagenes.length
}

const anterior = () => {
    indiceActual.value = (indiceActual.value - 1 + props.imagenes.length) % props.imagenes.length
}

// Resetear cuando cambian las imágenes y mostrar si hay data
watch(() => props.imagenes, (nuevas) => {
    indiceActual.value = 0
    inicializarEstados()
    if (props.autoshow && nuevas.length > 0) {
        visible.value = true
    }
}, { immediate: true })

onMounted(() => {
    if (props.autoshow && props.imagenes.length > 0) visible.value = true
})

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

/* ── Card responsive ── */
.banner-card {
    position: relative;
    width: 90vw;
    max-width: 380px;
    aspect-ratio: 9 / 16;
    max-height: 60vh;
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

/* ── Imagen / Carousel ── */
.banner-img-wrap {
    width: 100%;
    height: 100%;
    border-radius: 18px;
    overflow: hidden;
    background: #f3f4f6;
}

.carousel-track {
    display: flex;
    height: 100%;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
    min-width: 100%;
    height: 100%;
    position: relative;
}

.banner-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    background: #f3f4f6;
}

/* ── Botones prev/next ── */
.carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #0D291C;
    box-shadow: 0 2px 0 #0D291C;
    color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
}

.carousel-btn:hover {
    background: white;
}

.carousel-btn:active {
    transform: translateY(calc(-50% + 2px));
    box-shadow: 0 0 0 #0D291C;
}

.carousel-btn-prev {
    left: -15px;
}

.carousel-btn-next {
    right: -15px;
}

/* ── Dots indicadores ── */
.carousel-dots {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
}

.carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    border: 1.5px solid #0D291C;
    background: white;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s;
}

.carousel-dot.active {
    background: #0D291C;
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

/* ── Tablet / Desktop ── */
@media (min-width: 768px) {
    .banner-card {
        max-width: 420px;
    }
}

/* ── Landscape mobile ── */
@media (max-height: 500px) {
    .banner-card {
        max-height: 80vh;
        aspect-ratio: auto;
        width: auto;
        height: 80vh;
    }

    .banner-card .banner-img {
        object-fit: contain;
    }
}
</style>