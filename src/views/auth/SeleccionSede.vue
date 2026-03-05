<template>
    <div class="flex flex-col justify-center items-center min-h-screen w-full bg-[#0D291C] px-4 py-10 gap-8">

        <!-- Header -->
        <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-2xl bg-[#7FD344] flex items-center justify-center shadow-lg mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0D291C" viewBox="0 0 24 24">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
            </div>
            <h1 class="text-2xl font-black text-white tracking-tight">Elige tu sede</h1>
            <p class="text-sm font-medium" style="color:rgba(127,211,68,0.6)">
                Selecciona la sede donde tienes tu mensualidad
            </p>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="sedes-grid">
            <div v-for="n in 6" :key="n" class="h-[110px] rounded-[18px]"
                style="background:rgba(127,211,68,0.07);animation:shimmer 1.4s infinite;border:1.5px solid rgba(127,211,68,0.1)" />
        </div>

        <!-- Grid de sedes -->
        <div v-else class="sedes-grid">
            <div v-if="sedes.length === 0"
                class="col-span-full flex flex-col items-center gap-3 py-16 text-sm font-semibold"
                style="color:rgba(127,211,68,0.4)">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                No hay sedes disponibles
            </div>

            <div v-for="(sede, i) in sedes" :key="sede.IdEstacionamiento" class="sede-card"
                :class="{ 'sede-card--selected': sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento }"
                :style="{ animationDelay: `${i * 0.05}s` }" @click="seleccionarSede(sede)">

                <!-- Check -->
                <div class="sede-check"
                    :class="{ 'sede-check--on': sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                </div>

                <!-- Icono -->
                <div class="sede-icon"
                    :class="{ 'sede-icon--on': sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                </div>

                <p class="sede-nombre">{{ sede.Nombre }}</p>
                <p class="sede-id">ID {{ sede.IdEstacionamiento }}</p>

            </div>
        </div>

        <!-- Botón continuar -->
        <div class="flex flex-col items-center gap-3 w-full max-w-[340px]">
            <button @click="continuar" :disabled="!sedeSeleccionada" class="btn-continuar">
                Continuar
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </button>
            <button @click="$router.push('/login')"
                class="text-xs font-bold cursor-pointer bg-transparent border-none transition-colors"
                style="color:rgba(127,211,68,0.45)" onmouseover="this.style.color='rgba(127,211,68,0.9)'"
                onmouseout="this.style.color='rgba(127,211,68,0.45)'">
                ← Volver al inicio de sesión
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SedesService from '@/api/services/sedes.service'

const router = useRouter()
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

<style scoped>
@keyframes shimmer {
    0% {
        opacity: 0.4;
    }

    50% {
        opacity: 0.8;
    }

    100% {
        opacity: 0.4;
    }
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.96);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Grid */
.sedes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 560px;
}

@media (max-width: 600px) {
    .sedes-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 360px) {
    .sedes-grid {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }
}

/* Card */
.sede-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 18px 12px 14px;
    border-radius: 18px;
    border: 1.5px solid rgba(127, 211, 68, 0.18);
    background: rgba(127, 211, 68, 0.05);
    cursor: pointer;
    user-select: none;
    animation: cardIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) both;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.sede-card:hover {
    border-color: rgba(127, 211, 68, 0.45);
    background: rgba(127, 211, 68, 0.09);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.sede-card--selected {
    border-color: #7FD344 !important;
    background: rgba(127, 211, 68, 0.13) !important;
    box-shadow: 0 0 0 2px rgba(127, 211, 68, 0.25), 0 6px 20px rgba(0, 0, 0, 0.3) !important;
}

/* Check badge */
.sede-check {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #7FD344;
    color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sede-check--on {
    opacity: 1;
    transform: scale(1);
}

/* Icono */
.sede-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(127, 211, 68, 0.2);
    background: rgba(127, 211, 68, 0.07);
    color: rgba(127, 211, 68, 0.5);
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    flex-shrink: 0;
}

.sede-icon--on {
    background: #7FD344;
    color: #0D291C;
    border-color: #7FD344;
}

/* Textos */
.sede-nombre {
    font-size: 0.75rem;
    font-weight: 900;
    color: white;
    text-align: center;
    line-height: 1.2;
}

.sede-id {
    font-size: 0.55rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: rgba(127, 211, 68, 0.4);
}

/* Botón continuar */
.btn-continuar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #7FD344;
    color: #0D291C;
    font-size: 0.9rem;
    font-weight: 900;
    padding: 13px 28px;
    border-radius: 999px;
    border: 2px solid #5ab32a;
    box-shadow: 0 4px 0 #3d7d1c, 0 8px 24px rgba(127, 211, 68, 0.2);
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s, opacity 0.15s;
}

.btn-continuar:hover:not(:disabled) {
    box-shadow: 0 6px 0 #3d7d1c, 0 10px 28px rgba(127, 211, 68, 0.25);
    transform: translateY(-1px);
}

.btn-continuar:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #3d7d1c;
}

.btn-continuar:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
</style>