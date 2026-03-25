<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Historial de Accesos</h2>
            <button
                class=" cursor-none pointer-events-none flex items-center gap-1.5 bg-transparent text-transparent text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline"></span>
            </button>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">

            <div class="flex flex-col gap-1 flex-[2] min-w-[180px]">
                <label class="filter-label">Buscar placa</label>
                <input v-model="busqueda" type="text" placeholder="Ej: ABC-123" class="field-pill" />
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label class="filter-label">Sede</label>
                <select v-model="filtroSede" class="field-pill">
                    <option value="">Todas las sedes</option>
                    <option v-for="s in sedesUnicas" :key="s" :value="s">{{ s }}</option>
                </select>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label class="filter-label">Desde</label>
                <input v-model="filtroDesde" type="date" class="field-pill" />
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label class="filter-label">Hasta</label>
                <input v-model="filtroHasta" type="date" class="field-pill" />
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[120px]">
                <label class="filter-label">Tipo</label>
                <select v-model="filtroTipo" class="field-pill">
                    <option value="">Todos</option>
                    <option value="mensualidad">Mensualidad</option>
                    <option value="turno">Turno</option>
                </select>
            </div>

            <button v-if="hayFiltros" @click="limpiarFiltros" class="filter-clear-btn self-end">
                ✕ Limpiar
            </button>
        </div>

        <!-- Resumen -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="resumen-card" style="animation-delay:0s">
                <span class="resumen-num text-[#0D291C]">{{ registrosFiltrados.length }}</span>
                <span class="resumen-lbl">Total accesos</span>
            </div>
            <div class="resumen-card" style="animation-delay:0.05s">
                <span class="resumen-num text-[#299261]">{{ countActivos }}</span>
                <span class="resumen-lbl">En sitio ahora</span>
            </div>
            <div class="resumen-card" style="animation-delay:0.1s">
                <span class="resumen-num text-[#6b7280]">{{ duracionPromedio }}</span>
                <span class="resumen-lbl">Duración promedio</span>
            </div>
            <div class="resumen-card" style="animation-delay:0.15s">
                <span class="resumen-num text-[#2563eb]">{{ placasUnicas }}</span>
                <span class="resumen-lbl">Placas distintas</span>
            </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto flex-1" style="scrollbar-width:thin;scrollbar-color:#0D291C33 #f0f9f4">
                <table class="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr>
                            <th class="th">Placa</th>
                            <th class="th th--sticky">Sede</th>
                            <th class="th">Fecha entrada</th>
                            <th class="th">Fecha salida</th>
                            <th class="th">Duración</th>
                            <th class="th">Tipo</th>
                            <th class="th">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="registrosPaginados.length === 0">
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

                        <tr v-for="(r, i) in registrosPaginados" :key="r.id" class="table-row"
                            :style="{ animationDelay: `${i * 0.04}s` }">

                            <!-- Placa -->
                            <td class="td">
                                <div class="placa-chip">
                                    <span class="placa-flag">🇨🇴</span>
                                    <span class="placa-text">{{ r.placa }}</span>
                                </div>
                            </td>

                            <!-- Sede sticky -->
                            <td class="td td--sticky">
                                <div class="flex items-center gap-2">
                                    <div class="sede-avatar">{{ r.sede.slice(0, 2).toUpperCase() }}</div>
                                    <span class="font-semibold text-[#0D291C] text-sm truncate max-w-[110px]">
                                        {{ r.sede }}
                                    </span>
                                </div>
                            </td>

                            <!-- Fecha entrada -->
                            <td class="td">
                                <div class="fecha-wrap">
                                    <span class="fecha-main">{{ fmtFecha(r.entrada) }}</span>
                                    <span class="fecha-hora">{{ fmtHora(r.entrada) }}</span>
                                </div>
                            </td>

                            <!-- Fecha salida -->
                            <td class="td">
                                <div v-if="r.salida" class="fecha-wrap">
                                    <span class="fecha-main">{{ fmtFecha(r.salida) }}</span>
                                    <span class="fecha-hora">{{ fmtHora(r.salida) }}</span>
                                </div>
                                <span v-else class="en-sitio-badge">
                                    <span class="en-sitio-dot" />
                                    En sitio
                                </span>
                            </td>

                            <!-- Duración -->
                            <td class="td">
                                <span v-if="r.salida" class="duracion-text">
                                    {{ calcDuracion(r.entrada, r.salida) }}
                                </span>
                                <span v-else class="text-[#9ca3af] text-xs font-semibold">—</span>
                            </td>

                            <!-- Tipo -->
                            <td class="td">
                                <span class="tipo-badge" :class="`tipo-badge--${r.tipo}`">
                                    {{ r.tipo === 'mensualidad' ? '📅 Mensualidad' : '🕐 Turno' }}
                                </span>
                            </td>

                            <!-- Estado -->
                            <td class="td">
                                <span class="estado-badge"
                                    :class="r.salida ? 'estado-badge--salida' : 'estado-badge--activo'">
                                    <span class="estado-dot" />
                                    {{ r.salida ? 'Completado' : 'Activo' }}
                                </span>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div class="flex items-center justify-between flex-wrap gap-3 px-4 py-3
                        border-t border-gray-100 bg-white">
                <span class="text-xs text-gray-400">
                    <strong>{{ rangoInicio }}–{{ rangoFin }}</strong> de
                    <strong>{{ registrosFiltrados.length }}</strong>
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
                        <button @click="pagina = p" class="page-btn page-btn--num"
                            :class="pagina === p ? 'page-btn--active' : ''">
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
                    <select v-model.number="porPagina" @change="pagina = 1" class="paginator-select">
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
import { ref, computed, watch } from 'vue'

// ── Mock data ─────────────────────────────────────────────────────
// TODO: reemplazar con → await AccesosService.getMisAccesos({ meses: 3 })
const mockRegistros = ref([
    { id: 1, placa: 'ABC-123', sede: 'Digital6G', entrada: '2026-01-27T08:14:00', salida: '2026-01-27T10:45:00', tipo: 'mensualidad' },
    { id: 2, placa: 'XYZ-456', sede: 'CSU', entrada: '2026-01-27T09:00:00', salida: null, tipo: 'turno' },
    { id: 3, placa: 'DEF-789', sede: 'Norte', entrada: '2026-01-26T07:30:00', salida: '2026-01-26T09:00:00', tipo: 'mensualidad' },
    { id: 4, placa: 'ABC-123', sede: 'Digital6G', entrada: '2026-01-25T08:10:00', salida: '2026-01-25T11:20:00', tipo: 'mensualidad' },
    { id: 5, placa: 'GHI-321', sede: 'CSU', entrada: '2026-01-24T14:00:00', salida: '2026-01-24T15:30:00', tipo: 'turno' },
    { id: 6, placa: 'JKL-654', sede: 'Norte', entrada: '2026-01-23T06:55:00', salida: '2026-01-23T08:10:00', tipo: 'mensualidad' },
    { id: 7, placa: 'ABC-123', sede: 'Digital6G', entrada: '2026-01-22T08:05:00', salida: '2026-01-22T10:00:00', tipo: 'mensualidad' },
    { id: 8, placa: 'XYZ-456', sede: 'CSU', entrada: '2026-01-21T11:00:00', salida: '2026-01-21T13:45:00', tipo: 'turno' },
    { id: 9, placa: 'MNO-987', sede: 'Digital6G', entrada: '2026-01-20T08:30:00', salida: null, tipo: 'mensualidad' },
    { id: 10, placa: 'DEF-789', sede: 'Norte', entrada: '2026-01-19T07:00:00', salida: '2026-01-19T08:30:00', tipo: 'mensualidad' },
    { id: 11, placa: 'GHI-321', sede: 'CSU', entrada: '2026-01-18T16:00:00', salida: '2026-01-18T17:00:00', tipo: 'turno' },
    { id: 12, placa: 'JKL-654', sede: 'Digital6G', entrada: '2026-01-17T08:00:00', salida: '2026-01-17T10:30:00', tipo: 'mensualidad' },
    { id: 13, placa: 'ABC-123', sede: 'Norte', entrada: '2025-12-20T08:00:00', salida: '2025-12-20T09:45:00', tipo: 'mensualidad' },
    { id: 14, placa: 'XYZ-456', sede: 'Digital6G', entrada: '2025-12-15T09:30:00', salida: '2025-12-15T11:00:00', tipo: 'turno' },
    { id: 15, placa: 'MNO-987', sede: 'CSU', entrada: '2025-11-10T07:45:00', salida: '2025-11-10T09:15:00', tipo: 'mensualidad' },
])

// ── Filtros ───────────────────────────────────────────────────────
const busqueda = ref('')
const filtroSede = ref('')
const filtroDesde = ref('')
const filtroHasta = ref('')
const filtroTipo = ref('')
const pagina = ref(1)
const porPagina = ref(10)

const sedesUnicas = computed(() => [...new Set(mockRegistros.value.map(r => r.sede))])
const hayFiltros = computed(() => busqueda.value || filtroSede.value || filtroDesde.value || filtroHasta.value || filtroTipo.value)

const registrosFiltrados = computed(() => {
    const q = busqueda.value.toLowerCase()
    return mockRegistros.value.filter(r => {
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
const rangoInicio = computed(() => registrosFiltrados.value.length === 0 ? 0 : (pagina.value - 1) * porPagina.value + 1)
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
    const totalMin = completos.reduce((acc, r) => {
        return acc + (new Date(r.salida) - new Date(r.entrada)) / 60000
    }, 0)
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
.filter-label {
    font-size: 0.62rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9ca3af;
    padding-left: 4px;
}

.field-pill {
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

.field-pill:focus {
    border-color: #0D291C !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
}

.filter-clear-btn {
    font-size: 0.75rem;
    font-weight: 700;
    color: #dc2626;
    background: none;
    border: 2px solid #fca5a5;
    border-radius: 999px;
    padding: 7px 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.15s;
}

.filter-clear-btn:hover {
    background-color: #fee2e2;
}

/* ── Resumen ───────────────────────────────────────────────────── */
.resumen-card {
    background-color: white;
    border-radius: 18px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 3px 0 #e2ede7;
    border: 2px solid #f3f4f6;
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

.resumen-num {
    font-size: 1.3rem;
    font-weight: 900;
    line-height: 1;
}

.resumen-lbl {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #9ca3af;
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

/* ── Tabla ───────────────────────────────────────────────────────── */
.th {
    background-color: #0D291C;
    color: #7FD344;
    font-size: 0.68rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 14px 16px;
    text-align: left;
    white-space: nowrap;
}

.th--sticky {
    position: sticky;
    left: 0;
    z-index: 3;
    background-color: #0D291C;
}

.td {
    padding: 13px 16px;
    font-size: 0.83rem;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
    white-space: nowrap;
}

.td--sticky {
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: white;
    box-shadow: 3px 0 8px rgba(13, 41, 28, 0.06);
}

.table-row {
    animation: rowIn 0.28s ease both;
    transition: background-color 0.1s;
}

.table-row:hover .td {
    background-color: #f0faf4;
}

.table-row:hover .td--sticky {
    background-color: #f0faf4;
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

/* Placa */
.placa-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    padding: 4px 10px;
}

.placa-flag {
    font-size: 0.85rem;
    line-height: 1;
}

.placa-text {
    font-family: monospace;
    font-size: 0.82rem;
    font-weight: 800;
    color: #0D291C;
    letter-spacing: 0.06em;
}

/* Sede avatar */
.sede-avatar {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background-color: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.68rem;
    flex-shrink: 0;
}

/* Fechas */
.fecha-wrap {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.fecha-main {
    font-size: 0.8rem;
    font-weight: 700;
    color: #232B3A;
}

.fecha-hora {
    font-size: 0.68rem;
    font-weight: 600;
    color: #9ca3af;
}

/* En sitio */
.en-sitio-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #299261;
}

.en-sitio-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #299261;
    animation: pulse-dot 1.4s infinite;
}

@keyframes pulse-dot {

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

/* Duración */
.duracion-text {
    font-size: 0.8rem;
    font-weight: 700;
    color: #374151;
    background-color: #f3f4f6;
    padding: 3px 8px;
    border-radius: 6px;
}

/* Tipo badge */
.tipo-badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
}

.tipo-badge--mensualidad {
    background-color: #dbeafe;
    color: #2563eb;
}

.tipo-badge--turno {
    background-color: #f3f4f6;
    color: #6b7280;
}

/* Estado badge */
.estado-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 4px 10px;
    border-radius: 999px;
}

.estado-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.estado-badge--activo {
    background-color: #dcfce7;
    color: #16a34a;
}

.estado-badge--activo .estado-dot {
    background-color: #16a34a;
    animation: pulse-dot 1.4s infinite;
}

.estado-badge--salida {
    background-color: #f3f4f6;
    color: #6b7280;
}

.estado-badge--salida .estado-dot {
    background-color: #9ca3af;
}

/* Paginación */
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

.page-btn--active {
    background-color: #0D291C !important;
    border-color: #0D291C !important;
    color: #7FD344 !important;
}

.page-btn--num {
    display: none;
}

@media (min-width: 500px) {
    .page-btn--num {
        display: flex;
    }
}

.paginator-select {
    background-color: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 0.75rem;
    color: #374151;
    cursor: pointer;
}
</style>