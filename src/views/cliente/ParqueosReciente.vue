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
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Historial de Accesos</h2>
            <div class="w-[72px] sm:w-[88px]" />
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[180px]">
                <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Buscar
                    placa</label>
                <input v-model="busqueda" type="text" placeholder="Ej: ABC123" class="filter-pill" />
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Sede</label>
                <select v-model="filtroSede" class="filter-pill">
                    <option value="">Todas las sedes</option>
                    <option v-for="s in sedesUnicas" :key="s" :value="s">{{ s }}</option>
                </select>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Desde</label>
                <input v-model="filtroDesde" type="date" class="filter-pill" />
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Hasta</label>
                <input v-model="filtroHasta" type="date" class="filter-pill" />
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[120px]">
                <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Tipo</label>
                <select v-model="filtroTipo" class="filter-pill">
                    <option value="">Todos</option>
                    <option value="mensualidad">Mensualidad</option>
                    <option value="turno">Turno</option>
                </select>
            </div>
            <button v-if="hayFiltros" @click="limpiarFiltros"
                class="self-end text-[0.75rem] font-bold text-red-600 bg-transparent border-2 border-red-300 rounded-full px-[14px] py-[7px] cursor-pointer whitespace-nowrap transition-colors hover:bg-red-50">
                ✕ Limpiar
            </button>
        </div>

        <!-- Resumen -->
        <!-- <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 shadow-[0_3px_0_#e2ede7] border-2 border-gray-100 card-in"
                style="animation-delay:0s">
                <span class="text-[1.3rem] font-black leading-none text-[#0D291C]">{{ registrosFiltrados.length
                    }}</span>
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Total accesos</span>
            </div>
            <div class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 shadow-[0_3px_0_#e2ede7] border-2 border-gray-100 card-in"
                style="animation-delay:0.05s">
                <span class="text-[1.3rem] font-black leading-none text-[#299261]">{{ countActivos }}</span>
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">En sitio ahora</span>
            </div>
            <div class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 shadow-[0_3px_0_#e2ede7] border-2 border-gray-100 card-in"
                style="animation-delay:0.1s">
                <span class="text-[1.3rem] font-black leading-none text-gray-500">{{ duracionPromedio }}</span>
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Duración
                    promedio</span>
            </div>
            <div class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 shadow-[0_3px_0_#e2ede7] border-2 border-gray-100 card-in"
                style="animation-delay:0.15s">
                <span class="text-[1.3rem] font-black leading-none text-blue-600">{{ placasUnicas }}</span>
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Placas distintas</span>
            </div>
        </div> -->

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center gap-3 py-16">
            <div class="w-8 h-8 rounded-full border-[3px] border-[#e8f5e9] border-t-[#299261] animate-spin" />
            <span class="text-sm font-semibold text-gray-400">Cargando historial...</span>
        </div>

        <!-- Tabla -->
        <div v-else class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto flex-1" style="scrollbar-width:thin;scrollbar-color:#0D291C33 #f0f9f4">
                <table class="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr>
                            <th
                                class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-left whitespace-nowrap">
                                Placa</th>
                            <th
                                class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-left whitespace-nowrap sticky left-0 z-[3]">
                                Sede</th>
                            <th
                                class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-left whitespace-nowrap">
                                Vehículo</th>
                            <th
                                class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-left whitespace-nowrap">
                                Entrada</th>
                            <th
                                class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-left whitespace-nowrap">
                                Salida</th>
                            <th
                                class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-left whitespace-nowrap">
                                Duración</th>
                            <th
                                class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-left whitespace-nowrap">
                                Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!loading && registrosPaginados.length === 0">
                            <td colspan="7" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                    </svg>
                                    <span class="text-sm font-semibold">Sin registros encontrados</span>
                                </div>
                            </td>
                        </tr>

                        <tr v-for="(r, i) in registrosPaginados" :key="r.id"
                            class="transition-colors duration-100 row-in" :style="{ animationDelay: `${i * 0.04}s` }">

                            <!-- Placa -->
                            <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                <div
                                    class="inline-flex items-center gap-1.5 bg-gray-50 border-[1.5px] border-gray-200 rounded-lg px-[10px] py-1">
                                    <span class="text-[0.85rem] leading-none">🇨🇴</span>
                                    <span
                                        class="font-mono text-[0.82rem] font-black text-[#0D291C] tracking-[0.06em]">{{
                                            r.placa }}</span>
                                </div>
                            </td>

                            <!-- Sede sticky -->
                            <td
                                class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap sticky left-0 z-[2] bg-white shadow-[3px_0_8px_rgba(13,41,28,0.06)]">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-8 h-8 rounded-[9px] bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-[0.68rem] flex-shrink-0">
                                        {{ r.sede.slice(0, 2).toUpperCase() }}
                                    </div>
                                    <span class="font-semibold text-[#0D291C] text-sm truncate max-w-[110px]">{{ r.sede
                                    }}</span>
                                </div>
                            </td>

                            <!-- Vehículo -->
                            <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                <span
                                    class="inline-flex items-center gap-1.5 text-[0.72rem] font-bold px-[10px] py-1 rounded-full"
                                    :class="r.tipoVehiculo === 'carro' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'">
                                    <svg v-if="r.tipoVehiculo === 'carro'" xmlns="http://www.w3.org/2000/svg" width="13"
                                        height="13" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z M19 13h-2v3h2zm0-4h-2v2h2z" />
                                    </svg>
                                    {{ r.tipoVehiculo === 'carro' ? 'Carro' : 'Moto' }}
                                </span>
                            </td>

                            <!-- Entrada -->
                            <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                <div class="flex flex-col gap-px">
                                    <span class="text-[0.8rem] font-bold text-[#232B3A]">{{ fmtFecha(r.entrada) }} · {{
                                        fmtHora(r.entrada) }}</span>
                                    <span class="text-[0.68rem] font-semibold text-gray-400">{{ r.moduloEntrada
                                    }}</span>
                                </div>
                            </td>

                            <!-- Salida -->
                            <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                <div v-if="r.salida" class="flex flex-col gap-px">
                                    <span class="text-[0.8rem] font-bold text-[#232B3A]">{{ fmtFecha(r.salida) }} · {{
                                        fmtHora(r.salida) }}</span>
                                    <span class="text-[0.68rem] font-semibold text-gray-400">{{ r.moduloSalida ?? '—'
                                    }}</span>
                                </div>
                                <span v-else
                                    class="inline-flex items-center gap-1.5 text-[0.68rem] font-black uppercase tracking-[0.07em] text-[#299261]">
                                    <span class="w-[7px] h-[7px] rounded-full bg-[#299261] pulse-dot" />
                                    En sitio
                                </span>
                            </td>

                            <!-- Duración -->
                            <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                <span v-if="r.salida"
                                    class="text-[0.8rem] font-bold text-gray-700 bg-gray-100 px-2 py-[3px] rounded-md">
                                    {{ calcDuracion(r.entrada, r.salida) }}
                                </span>
                                <span v-else class="text-[0.75rem] font-semibold text-gray-400">—</span>
                            </td>

                            <!-- Estado -->
                            <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                <span
                                    class="inline-flex items-center gap-[5px] text-[0.68rem] font-black uppercase tracking-[0.07em] px-[10px] py-1 rounded-full"
                                    :class="r.salida ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'">
                                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        :class="r.salida ? 'bg-gray-400' : 'bg-green-600 pulse-dot'" />
                                    {{ r.salida ? 'Completado' : 'Activo' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div class="flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-gray-100 bg-white">
                <span class="text-xs text-gray-400">
                    <strong>{{ rangoInicio }}–{{ rangoFin }}</strong> de <strong>{{ registrosFiltrados.length
                        }}</strong>
                </span>
                <div class="flex items-center gap-1">
                    <button @click="pagina--" :disabled="pagina === 1" class="page-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <span class="sm:hidden text-xs font-bold text-gray-500 px-2">{{ pagina }}/{{ totalPaginas }}</span>
                    <template v-for="p in totalPaginas" :key="p">
                        <button @click="pagina = p" class="page-btn hidden sm:flex"
                            :class="pagina === p ? 'bg-[#0D291C] border-[#0D291C] text-[#7FD344]' : ''">
                            {{ p }}
                        </button>
                    </template>
                    <button @click="pagina++" :disabled="pagina === totalPaginas" class="page-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span class="hidden sm:inline">Filas:</span>
                    <select v-model.number="porPagina" @change="pagina = 1"
                        class="bg-gray-50 border-[1.5px] border-gray-200 rounded-lg px-2 py-1 text-[0.75rem] text-gray-700 cursor-pointer">
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="15">15</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { showError } from '@/utils/swal'
import ParqueosService from '@/api/services/parqueos.service'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// ── Estado ────────────────────────────────────────────────────────
const registros = ref([])
const loading = ref(false)

// ── Carga ─────────────────────────────────────────────────────────
const cargarAccesos = async () => {
    const id = authStore.user?.documento ?? authStore.user?.Documento
    if (!id) return

    loading.value = true
    const res = await ParqueosService.getallParqueos(id)
    loading.value = false

    if (res?.error) {
        showError({ status: res.status, data: res.data })
        return
    }

    const raw = Array.isArray(res?.data) ? res.data : []
    registros.value = raw.map(r => ({
        id: `${r.IdEstacionamiento}-${r.FechaEntrada}`,
        placa: r.PlacaEntrada ?? r.PlacaSalida ?? '—',
        sede: r.NombreEstacionamiento ?? '—',
        entrada: r.FechaEntrada,
        salida: r.FechaSalida ?? null,
        moduloEntrada: r.ModuloEntrada ?? '—',
        moduloSalida: r.ModuloSalida ?? null,
        tipoVehiculo: r.IdTipoVehiculo === 1 ? 'carro' : 'moto',
    }))
}

onMounted(cargarAccesos)

// ── Filtros ───────────────────────────────────────────────────────
const busqueda = ref('')
const filtroSede = ref('')
const filtroDesde = ref('')
const filtroHasta = ref('')
const filtroTipo = ref('')
const pagina = ref(1)
const porPagina = ref(10)

const sedesUnicas = computed(() => [...new Set(registros.value.map(r => r.sede))])
const hayFiltros = computed(() =>
    busqueda.value || filtroSede.value || filtroDesde.value || filtroHasta.value || filtroTipo.value
)

const registrosFiltrados = computed(() => {
    const q = busqueda.value.toLowerCase()
    return registros.value.filter(r => {
        const matchQ = !q || r.placa.toLowerCase().includes(q) || r.sede.toLowerCase().includes(q)
        const matchSede = !filtroSede.value || r.sede === filtroSede.value
        const matchTipo = !filtroTipo.value || r.tipo === filtroTipo.value
        const fechaEntry = new Date(r.entrada)
        const matchDesde = !filtroDesde.value || fechaEntry >= new Date(filtroDesde.value)
        const matchHasta = !filtroHasta.value || fechaEntry <= new Date(filtroHasta.value + 'T23:59:59')
        return matchQ && matchSede && matchTipo && matchDesde && matchHasta
    })
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(registrosFiltrados.value.length / porPagina.value)))
const registrosPaginados = computed(() => {
    const ini = (pagina.value - 1) * porPagina.value
    return registrosFiltrados.value.slice(ini, ini + porPagina.value)
})
const rangoInicio = computed(() =>
    registrosFiltrados.value.length === 0 ? 0 : (pagina.value - 1) * porPagina.value + 1
)
const rangoFin = computed(() => Math.min(pagina.value * porPagina.value, registrosFiltrados.value.length))

watch([busqueda, filtroSede, filtroDesde, filtroHasta, filtroTipo], () => { pagina.value = 1 })

const limpiarFiltros = () => {
    busqueda.value = filtroSede.value = filtroDesde.value = filtroHasta.value = filtroTipo.value = ''
}

// ── Resumen ───────────────────────────────────────────────────────
const countActivos = computed(() => registrosFiltrados.value.filter(r => !r.salida).length)
const placasUnicas = computed(() => new Set(registrosFiltrados.value.map(r => r.placa)).size)
const duracionPromedio = computed(() => {
    const completos = registrosFiltrados.value.filter(r => r.salida)
    if (!completos.length) return '—'
    const totalMin = completos.reduce((acc, r) =>
        acc + (new Date(r.salida) - new Date(r.entrada)) / 60000, 0)
    const avg = Math.round(totalMin / completos.length)
    return avg >= 60 ? `${Math.floor(avg / 60)}h ${avg % 60}m` : `${avg}m`
})

// ── Helpers ───────────────────────────────────────────────────────
const fmtFecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
const fmtHora = (iso) => new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

const calcDuracion = (entrada, salida) => {
    const min = Math.round((new Date(salida) - new Date(entrada)) / 60000)
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60), m = min % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
}
</script>

<style scoped>
/* Input/select pill — !important necesario para pisar estilos globales */
.filter-pill {
    background-color: #EAEAEA !important;
    border: 2px solid #299261 !important;
    border-radius: 999px !important;
    padding: 8px 14px !important;
    font-size: 0.82rem !important;
    color: #232B3A !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.filter-pill:focus {
    border-color: #0D291C !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
}

/* Animaciones */
.card-in {
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(12px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.row-in {
    animation: rowIn 0.28s ease both;
}

@keyframes rowIn {
    from {
        opacity: 0;
        transform: translateX(-6px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.pulse-dot {
    animation: pulseDot 1.4s infinite;
}

@keyframes pulseDot {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(0.75);
    }
}

/* Hover en filas sticky */
.table-row:hover .td--sticky {
    background-color: #f0faf4;
}

/* Page btn base */
.page-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    background-color: white;
    color: #374151;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s;
}

.page-btn:hover:not(:disabled) {
    border-color: #299261;
    color: #299261;
}

.page-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}
</style>