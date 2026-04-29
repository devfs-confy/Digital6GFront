<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Historial de Transacciones - Pasarela de Pagos
            </h2>
            <div
                class="flex items-center gap-1.5 bg-transparent text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full" />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center gap-3 py-16">
            <div class="w-8 h-8 rounded-full border-[3px] border-[#e8f5e9] border-t-[#299261] animate-spin" />
            <span class="text-sm font-semibold text-gray-400">Cargando historial...</span>
        </div>

        <!-- Error -->
        <div v-else-if="errorCarga"
            class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border-2 border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#dc2626" viewBox="0 0 24 24"
                class="shrink-0">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span class="text-sm font-semibold text-red-600 flex-1">{{ errorCarga }}</span>
            <button @click="cargarHistorial" class="text-xs font-black text-red-600 underline cursor-pointer">
                Reintentar
            </button>
        </div>

        <template v-else>
            <!-- Resumen -->
            <div class="grid grid-cols-2 gap-3">
                <div
                    class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 border-2 border-[#e8f5e9] shadow-[0_3px_0_#e2ede7]">
                    <span class="text-[1.2rem] font-black text-[#0D291C] leading-none">{{ formatCOP(totalPagado)
                        }}</span>
                    <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Total pagado</span>
                </div>
                <div
                    class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 border-2 border-gray-100 shadow-[0_3px_0_#e5e7eb]">
                    <span class="text-[1.2rem] font-black text-gray-600 leading-none">{{ transacciones.length }}</span>
                    <span
                        class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Transacciones</span>
                </div>
            </div>

            <!-- Tabla transacciones -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <!-- Head tabla -->
                <div class="px-5 py-3.5 bg-[#0D291C] border-b-[3px] border-[#7FD344] flex items-center justify-between">
                    <span class="text-[0.68rem] font-black uppercase tracking-widest text-white">Últimas
                        transacciones</span>
                    <span class="text-[0.65rem] font-bold text-[#7FD344]/70">{{ transacciones.length }} registros</span>
                </div>

                <!-- Vacío -->
                <div v-if="transacciones.length === 0" class="flex flex-col items-center gap-3 py-16 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                    </svg>
                    <span class="text-sm font-semibold">Sin transacciones registradas</span>
                </div>

                <!-- Lista de transacciones -->
                <div v-else class="flex flex-col divide-y divide-gray-50">
                    <div v-for="(tx, i) in transacciones" :key="tx.RequestId"
                        class="flex items-center gap-4 px-5 py-4 hover:bg-[#f0faf4] transition-colors">

                        <!-- Icono estado -->
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="{
                            'bg-green-100': tx.Status === 'APROBADO',
                            'bg-amber-100': tx.Status === 'PENDIENTE',
                            'bg-red-100': tx.Status === 'RECHAZADO' || tx.Status === 'FALLIDO',
                            'bg-gray-100': !['APROBADO', 'PENDIENTE', 'RECHAZADO', 'FALLIDO'].includes(tx.Status)
                        }">
                            <!-- Aprobado -->
                            <svg v-if="tx.Status === 'APROBADO'" xmlns="http://www.w3.org/2000/svg" width="18"
                                height="18" fill="#16a34a" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            <!-- Pendiente -->
                            <svg v-else-if="tx.Status === 'PENDIENTE'" xmlns="http://www.w3.org/2000/svg" width="18"
                                height="18" fill="#d97706" viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <!-- Rechazado / Fallido -->
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#dc2626"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <p class="text-[0.85rem] font-black text-[#0D291C] truncate text-left">{{ tx.Concepto }}</p>
                            <div class="flex items-center gap-2 mt-[3px] flex-wrap">
                                <!-- Badge estado -->
                                <span
                                    class="text-[0.6rem] font-black uppercase tracking-[0.06em] px-2 py-[2px] rounded-full border"
                                    :class="{
                                        'bg-green-100 text-green-700 border-green-200': tx.Status === 'APROBADO',
                                        'bg-amber-100 text-amber-600 border-amber-200': tx.Status === 'PENDIENTE',
                                        'bg-red-100 text-red-600 border-red-200': tx.Status === 'RECHAZADO' || tx.Status === 'FALLIDO',
                                        'bg-gray-100 text-gray-500 border-gray-200': !['APROBADO', 'PENDIENTE', 'RECHAZADO', 'FALLIDO'].includes(tx.Status)
                                    }">
                                    {{ tx.Status }}
                                </span>
                                <!-- Referencia -->
                                <span class="text-[0.68rem] font-mono font-semibold text-gray-400">
                                    #{{ tx.RequestId }}
                                </span>
                                <!-- Fecha -->
                                <span class="text-[0.68rem] font-semibold text-gray-400">
                                    {{ formatFecha(tx.FechaCreacion) }}
                                </span>
                            </div>
                        </div>

                        <!-- Valor -->
                        <div class="flex flex-col items-end flex-shrink-0">
                            <span class="text-[0.95rem] font-black text-[#0D291C]">{{ formatCOP(tx.Valor) }}</span>
                            <span class="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-wide">{{
                                tx.Moneda }}</span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-5 py-3 border-t border-gray-100 bg-white">
                    <span class="text-[0.75rem] text-gray-400">
                        Mostrando <strong class="text-[#0D291C]">{{ transacciones.length }}</strong> transacciones
                        recientes
                    </span>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PagosService from '@/api/services/pagos.service'
import { DateTime } from 'luxon'

const transacciones = ref([])
const loading = ref(true)
const errorCarga = ref('')

const cargarHistorial = async () => {
    loading.value = true
    errorCarga.value = ''
    try {
        const res = await PagosService.getHistorialTransacciones()
        transacciones.value = res?.data ?? []
    } catch (e) {
        console.error('[HistorialTransacciones]', e)
        errorCarga.value = 'No se pudo cargar el historial de transacciones.'
    } finally {
        loading.value = false
    }
}

onMounted(cargarHistorial)

const totalPagado = computed(() =>
    transacciones.value
        .filter(t => t.Status === 'APROBADO')
        .reduce((acc, t) => acc + (t.Valor ?? 0), 0)
)

const formatCOP = (valor) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(valor ?? 0)

const stripZ = (s) => s.replace('Z', '').replace(/[+-]\d{2}:\d{2}$/, '')

const formatFecha = (f) => {
    if (!f) return '—'
    return DateTime.fromISO(stripZ(f), { zone: 'America/Bogota' }).toFormat('dd/MM/yyyy HH:mm')
}
</script>