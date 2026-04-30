<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <AdminPageHeader :title="sedeSeleccionada ? sedeSeleccionada.Nombre : 'Historial de Accesos'">
            <template #left>
                <button @click="sedeSeleccionada ? volverASedes() : $router.back()"
                    class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                    style="box-shadow: #595858 0px 2px 0">
                    <AppIcon name="arrow_left_alt" :size="14" />
                    <span class="hidden sm:inline">Volver</span>
                </button>
            </template>
        </AdminPageHeader>

        <!-- ── PANTALLA 1: Selección de sede ── -->
        <template v-if="!sedeSeleccionada">

            <div v-if="loadingSedes" class="flex flex-col items-center gap-3 py-16">
                <div class="w-8 h-8 rounded-full border-[3px] border-[#e8f5e9] border-t-[#299261] animate-spin" />
                <span class="text-sm font-semibold text-gray-400">Cargando sedes...</span>
            </div>

            <template v-else>
                <p class="text-[0.75rem] font-bold text-gray-400 uppercase tracking-[0.08em] pl-1">
                    Selecciona una sede para ver tus accesos
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button v-for="sede in sedes" :key="sede.IdEstacionamiento" @click="seleccionarSede(sede)"
                        class="bg-white rounded-2xl border-2 border-[#e8f5e9] p-5 flex items-center gap-4 text-left cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#299261] hover:shadow-[0_6px_0_#c8e6c9]"
                        style="box-shadow: 0 4px 0 #e2ede7">
                        <div
                            class="w-12 h-12 rounded-[14px] bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-sm flex-shrink-0">
                            {{ sede.Nombre.slice(0, 2).toUpperCase() }}
                        </div>
                        <div class="flex flex-col gap-1 min-w-0">
                            <span class="text-[1rem] font-black text-[#0D291C] truncate">{{ sede.Nombre }}</span>
                            <span class="text-[0.7rem] font-semibold text-gray-400">
                                {{ sede.personas.length }} persona{{ sede.personas.length !== 1 ? 's' : '' }}
                                autorizada{{ sede.personas.length !== 1 ? 's' : '' }}
                            </span>
                            <div class="flex flex-wrap gap-1 mt-1">
                                <span v-for="p in sede.personas" :key="p.IdPersonaAutorizada"
                                    class="text-[0.6rem] font-bold px-2 py-[2px] rounded-full bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                                    {{ p.Placa1 }}{{ p.Placa2 ? ` · ${p.Placa2}` : '' }}
                                </span>
                            </div>
                        </div>
                        <AppIcon name="arrow_right_alt" :size="20" class="text-gray-300 flex-shrink-0 ml-auto" />
                    </button>
                </div>
            </template>
        </template>

        <!-- ── PANTALLA 2: Filtros + Tabla ── -->
        <template v-else>

            <!-- Filtros -->
            <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
                <div class="flex flex-col gap-1 flex-[2] min-w-[180px]">
                    <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Buscar
                        placa</label>
                    <input v-model="busqueda" type="text" placeholder="Ej: ABC123" class="filter-pill" />
                </div>
                <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                    <label
                        class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Desde</label>
                    <input v-model="filtroDesde" type="date" class="filter-pill" />
                </div>
                <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                    <label
                        class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Hasta</label>
                    <input v-model="filtroHasta" type="date" class="filter-pill" />
                </div>
                <div class="flex flex-col gap-1 flex-1 min-w-[120px]">
                    <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Tipo</label>
                    <select v-model="filtroTipo" class="filter-pill">
                        <option value="">Todos</option>
                        <option value="carro">Carro</option>
                        <option value="moto">Moto</option>
                    </select>
                </div>
                <button v-if="hayFiltros" @click="limpiarFiltros"
                    class="self-end text-[0.75rem] font-bold text-red-600 bg-transparent border-2 border-red-300 rounded-full px-[14px] py-[7px] cursor-pointer whitespace-nowrap transition-colors hover:bg-red-50">
                    ✕ Limpiar
                </button>
            </div>

            <!-- Loading tabla -->
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
                                    class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-center whitespace-nowrap">
                                    Placa</th>
                                <th
                                    class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-center whitespace-nowrap">
                                    Vehículo</th>
                                <th
                                    class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-center whitespace-nowrap">
                                    Entrada</th>
                                <th
                                    class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-center whitespace-nowrap">
                                    Salida</th>
                                <th
                                    class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-center whitespace-nowrap">
                                    Duración</th>
                                <th
                                    class="bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black uppercase tracking-[0.08em] px-4 py-[14px] text-center whitespace-nowrap">
                                    Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="registrosPaginados.length === 0">
                                <td colspan="6" class="py-20 text-center text-gray-300">
                                    <div class="flex flex-col items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                        </svg>
                                        <span class="text-sm font-semibold">Sin registros encontrados</span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(r, i) in registrosPaginados" :key="r.id"
                                class="transition-colors duration-100 row-in"
                                :style="{ animationDelay: `${i * 0.04}s` }">

                                <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                    <div
                                        class="inline-flex items-center gap-1.5 bg-gray-50 border-[1.5px] border-gray-200 rounded-lg px-[10px] py-1">

                                        <span
                                            class="font-mono text-[0.82rem] font-black text-[#0D291C] tracking-[0.06em]">{{
                                                r.placa }}</span>
                                    </div>
                                </td>

                                <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                    <span
                                        class="inline-flex items-center gap-1.5 text-[0.72rem] font-bold px-[10px] py-1 rounded-full"
                                        :class="r.tipoVehiculo === 'carro' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'">
                                        {{ r.tipoVehiculo === 'carro' ? 'Carro' : 'Moto' }}
                                    </span>
                                </td>

                                <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                    <div class="flex flex-col gap-px">
                                        <span class="text-[0.8rem] font-bold text-[#232B3A]">{{ fmtFecha(r.entrada) }} ·
                                            {{ fmtHora(r.entrada) }}</span>
                                        <span class="text-[0.68rem] font-semibold text-gray-400">{{ r.moduloEntrada
                                            }}</span>
                                    </div>
                                </td>

                                <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                    <div v-if="r.salida" class="flex flex-col gap-px">
                                        <span class="text-[0.8rem] font-bold text-[#232B3A]">{{ fmtFecha(r.salida) }} ·
                                            {{ fmtHora(r.salida) }}</span>
                                        <span class="text-[0.68rem] font-semibold text-gray-400">{{ r.moduloSalida ??
                                            '—' }}</span>
                                    </div>
                                    <span v-else
                                        class="inline-flex items-center gap-1.5 text-[0.68rem] font-black uppercase tracking-[0.07em] text-[#299261]">
                                        <span class="w-[7px] h-[7px] rounded-full bg-[#299261] pulse-dot" />
                                        En sitio
                                    </span>
                                </td>

                                <td class="px-4 py-[13px] border-b border-gray-100 whitespace-nowrap">
                                    <span v-if="r.salida"
                                        class="text-[0.8rem] font-bold text-gray-700 bg-gray-100 px-2 py-[3px] rounded-md">
                                        {{ calcDuracion(r.entrada, r.salida) }}
                                    </span>
                                    <span v-else class="text-[0.75rem] font-semibold text-gray-400">—</span>
                                </td>

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
                <div
                    class="flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-gray-100 bg-white">
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
                        <template v-for="p in totalPaginas" :key="p">
                            <button @click="pagina = p" class="page-btn hidden sm:flex"
                                :class="pagina === p ? 'bg-[#0D291C] border-[#0D291C] text-[#7FD344]' : ''">{{ p
                                }}</button>
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

        </template>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MensualidadesService from '@/api/services/mensualidades.service'
import ParqueosService from '@/api/services/parqueos.service'

// ── Sedes ─────────────────────────────────────────────────────────
const sedes = ref([])
const loadingSedes = ref(false)
const sedeSeleccionada = ref(null)

// ── Registros ─────────────────────────────────────────────────────
const registros = ref([])
const loading = ref(false)

// ── Filtros ───────────────────────────────────────────────────────
const busqueda = ref('')
const filtroDesde = ref('')
const filtroHasta = ref('')
const filtroTipo = ref('')
const pagina = ref(1)
const porPagina = ref(10)

const hayFiltros = computed(() => busqueda.value || filtroDesde.value || filtroHasta.value || filtroTipo.value)

const limpiarFiltros = () => {
    busqueda.value = ''
    filtroDesde.value = ''
    filtroHasta.value = ''
    filtroTipo.value = ''
}

// ── Cargar sedes desde mis mensualidades ─────────────────────────
const cargarSedes = async () => {
    loadingSedes.value = true
    try {
        const res = await MensualidadesService.getMisMensualidades()
        const lista = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])

        // Agrupar por IdEstacionamiento (puede haber varias personas en la misma sede)
        const mapa = {}
        for (const m of lista) {
            const id = m.T_Estacionamiento?.IdEstacionamiento
            if (!id) continue
            if (!mapa[id]) {
                mapa[id] = {
                    IdEstacionamiento: id,
                    Nombre: m.T_Estacionamiento?.Nombre ?? '—',
                    personas: [],
                }
            }
            mapa[id].personas.push(m)
        }
        sedes.value = Object.values(mapa)
    } catch (e) {
        console.error('[Accesos] cargarSedes:', e)
    } finally {
        loadingSedes.value = false
    }
}

onMounted(cargarSedes)

// ── Seleccionar sede y cargar accesos ────────────────────────────
const seleccionarSede = async (sede) => {
    sedeSeleccionada.value = sede
    limpiarFiltros()
    pagina.value = 1
    registros.value = []
    loading.value = true

    try {
        // Toma el IdPersonaAutorizada de la primera persona de esa sede
        const idPersona = sede.personas[0]?.IdPersonaAutorizada
        if (!idPersona) return

        const res = await ParqueosService.getallParqueos(idPersona)
        const raw = (Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []))
            .filter(r => Number(r.idEstacionamiento) === Number(sede.IdEstacionamiento))

        const isValidSalida = (f) => f && !f.startsWith('1900')

        registros.value = raw.map(r => ({
            Nombre: `${r.nombreEstacionamiento}`,
            placa: r.placaEntrada ?? r.placaSalida ?? '—',
            entrada: r.fechaEntrada,
            salida: isValidSalida(r.fechaSalida) ? r.fechaSalida : null,
            moduloEntrada: r.moduloEntrada ?? '—',
            moduloSalida: r.moduloSalida ?? null,
            tipoVehiculo: r.idTipoVehiculo === 1 ? 'carro' : 'moto',
        }))
    } finally {
        loading.value = false
    }
}

const volverASedes = () => {
    sedeSeleccionada.value = null
    registros.value = []
    limpiarFiltros()
    pagina.value = 1
}

// ── Filtrado y paginación ────────────────────────────────────────
const registrosFiltrados = computed(() => {
    const q = busqueda.value.toLowerCase()
    return registros.value
        .filter(r => {
            const matchQ = !q || r.placa.toLowerCase().includes(q)
            const matchTipo = !filtroTipo.value || r.tipoVehiculo === filtroTipo.value
            const fechaEntry = new Date(r.entrada)
            const matchDesde = !filtroDesde.value || fechaEntry >= new Date(filtroDesde.value)
            const matchHasta = !filtroHasta.value || fechaEntry <= new Date(filtroHasta.value + 'T23:59:59')
            return matchQ && matchTipo && matchDesde && matchHasta
        })
        .sort((a, b) => new Date(b.entrada) - new Date(a.entrada))
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(registrosFiltrados.value.length / porPagina.value)))
const registrosPaginados = computed(() => {
    const ini = (pagina.value - 1) * porPagina.value
    return registrosFiltrados.value.slice(ini, ini + porPagina.value)
})
const rangoInicio = computed(() => registrosFiltrados.value.length === 0 ? 0 : (pagina.value - 1) * porPagina.value + 1)
const rangoFin = computed(() => Math.min(pagina.value * porPagina.value, registrosFiltrados.value.length))

watch([busqueda, filtroDesde, filtroHasta, filtroTipo], () => { pagina.value = 1 })

// ── Helpers ───────────────────────────────────────────────────────
const fmtFecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', day: '2-digit', month: 'short' })
const fmtHora = (iso) => new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
const calcDuracion = (entrada, salida) => {
    const min = Math.round((new Date(salida) - new Date(entrada)) / 60000)
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60), m = min % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
}
</script>

<style scoped>
.filter-pill {
    background-color: #EAEAEA !important;
    border: 2px solid #299261 !important;
    border-radius: 999px !important;
    padding: 8px 14px !important;
    font-size: 0.82rem !important;
    color: #232B3A !important;
    outline: none !important;
    width: 100%;
    transition: border-color 0.15s;
}

.filter-pill:focus {
    border-color: #0D291C !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
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
        opacity: .5;
        transform: scale(.75);
    }
}

.page-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    background: white;
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

@media (max-width: 767px) {
    @keyframes pulseDot {

        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }

        50% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes rowIn {
        from {
            opacity: 1;
            transform: none;
        }

        to {
            opacity: 1;
            transform: none;
        }
    }
}
</style>