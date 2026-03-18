<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <div class="flex items-center justify-between relative bg-white rounded-full p-4">
            <div class="w-[80px]">
                <button @click="$router.back()" class="btn-3d">Volver</button>
            </div>
            <h2 class="text-2xl font-bold text-[#232B3A]">Historial de Pagos</h2>
            <div class="w-[80px]" />
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 filters-bar">

            <div class="filter-field filter-field--search">
                <label class="filter-label">Buscar</label>
                <input v-model="busqueda" type="text" placeholder="Sede o referencia..." class="search-input w-full" />
            </div>

            <div class="filter-field">
                <label class="filter-label">Sede</label>
                <select v-model="filtroSede" class="filter-select">
                    <option value="">Todas las sedes</option>
                    <option v-for="s in sedesUnicas" :key="s" :value="s">{{ s }}</option>
                </select>
            </div>

            <div class="filter-field">
                <label class="filter-label">Período</label>
                <select v-model="filtroPeriodo" class="filter-select">
                    <option value="">Todos</option>
                    <option value="1">Último mes</option>
                    <option value="2">Últimos 2 meses</option>
                    <option value="3">Últimos 3 meses</option>
                </select>
            </div>

            <div class="filter-field">
                <label class="filter-label">Estado</label>
                <select v-model="filtroEstado" class="filter-select">
                    <option value="">Todos</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="rechazado">Rechazado</option>
                </select>
            </div>

            <button v-if="busqueda || filtroSede || filtroPeriodo || filtroEstado" @click="limpiarFiltros"
                class="filter-clear-btn">
                ✕ Limpiar
            </button>
        </div>

        <!-- Resumen rápido -->
        <div class="resumen-row">
            <div class="resumen-card resumen-card--total">
                <span class="resumen-card__num">{{ formatCOP(totalPagado) }}</span>
                <span class="resumen-card__label">Total pagado</span>
            </div>
            <div class="resumen-card resumen-card--count">
                <span class="resumen-card__num">{{ pagosFiltrados.length }}</span>
                <span class="resumen-card__label">Transacciones</span>
            </div>
            <div class="resumen-card resumen-card--aprobados">
                <span class="resumen-card__num">{{ countEstado('aprobado') }}</span>
                <span class="resumen-card__label">Aprobados</span>
            </div>
            <div class="resumen-card resumen-card--pendientes">
                <span class="resumen-card__num">{{ countEstado('pendiente') }}</span>
                <span class="resumen-card__label">Pendientes</span>
            </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">

            <div class="table-scroll-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="th-cell th-cell--sticky">Sede</th>
                            <th class="th-cell">Referencia</th>
                            <th class="th-cell">Valor</th>
                            <th class="th-cell">Fecha de pago</th>
                            <th class="th-cell">Estado</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-if="pagosPaginados.length === 0">
                            <td colspan="5" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron pagos</span>
                                </div>
                            </td>
                        </tr>

                        <tr v-for="(pago, i) in pagosPaginados" :key="pago.id" class="table-row"
                            :style="{ animationDelay: `${i * 0.04}s` }">

                            <!-- Sede sticky -->
                            <td class="td-cell td-cell--sticky">
                                <div class="flex items-center gap-3">
                                    <div class="sede-avatar">
                                        {{ pago.sede.slice(0, 2).toUpperCase() }}
                                    </div>
                                    <span class="font-semibold text-[#0D291C] truncate max-w-[120px]">
                                        {{ pago.sede }}
                                    </span>
                                </div>
                            </td>

                            <!-- Referencia -->
                            <td class="td-cell">
                                <span class="ref-code">{{ pago.referencia }}</span>
                            </td>

                            <!-- Valor -->
                            <td class="td-cell">
                                <span class="valor-text">{{ formatCOP(pago.valor) }}</span>
                            </td>

                            <!-- Fecha -->
                            <td class="td-cell">
                                <div class="fecha-wrap">
                                    <span class="fecha-dia">{{ formatDia(pago.fecha) }}</span>
                                    <span class="fecha-mes">{{ formatMes(pago.fecha) }}</span>
                                </div>
                            </td>

                            <!-- Estado -->
                            <td class="td-cell">
                                <span class="estado-badge" :class="`estado-badge--${pago.estado}`">
                                    <span class="estado-dot" />
                                    {{ estadoLabel(pago.estado) }}
                                </span>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div class="table-foot">
                <span class="foot-counter">
                    <strong>{{ rangoInicio }}–{{ rangoFin }}</strong> de
                    <strong>{{ pagosFiltrados.length }}</strong>
                </span>

                <div class="flex items-center gap-1">
                    <button @click="paginaActual--" :disabled="paginaActual === 1" class="page-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <span class="page-mobile-indicator">{{ paginaActual }} / {{ totalPaginas }}</span>
                    <template v-for="p in totalPaginas" :key="p">
                        <button @click="paginaActual = p"
                            :class="['page-btn page-btn--num', paginaActual === p ? 'page-btn--active' : '']">
                            {{ p }}
                        </button>
                    </template>
                    <button @click="paginaActual++" :disabled="paginaActual === totalPaginas" class="page-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>

                <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span class="hidden sm:inline">Filas:</span>
                    <select v-model.number="itemsPorPagina" @change="paginaActual = 1" class="paginator-select">
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

// ── Datos mock — últimos 3 meses ──────────────────────────────────
// TODO: reemplazar con → await PagosService.getMisPagos({ meses: 3 })
const mockPagos = ref([
    { id: 1, sede: 'Digital6G', referencia: 'REF-2026-0142', valor: 120000, fecha: '2026-01-15', estado: 'aprobado' },
    { id: 2, sede: 'CSU', referencia: 'REF-2026-0138', valor: 95000, fecha: '2026-01-10', estado: 'aprobado' },
    { id: 3, sede: 'Digital6G', referencia: 'REF-2025-0521', valor: 120000, fecha: '2025-12-15', estado: 'aprobado' },
    { id: 4, sede: 'CSU', referencia: 'REF-2025-0518', valor: 95000, fecha: '2025-12-10', estado: 'aprobado' },
    { id: 5, sede: 'Digital6G', referencia: 'REF-2025-0489', valor: 120000, fecha: '2025-12-01', estado: 'pendiente' },
    { id: 6, sede: 'Norte', referencia: 'REF-2025-0471', valor: 80000, fecha: '2025-11-28', estado: 'aprobado' },
    { id: 7, sede: 'CSU', referencia: 'REF-2025-0465', valor: 95000, fecha: '2025-11-15', estado: 'rechazado' },
    { id: 8, sede: 'Norte', referencia: 'REF-2025-0460', valor: 80000, fecha: '2025-11-10', estado: 'aprobado' },
    { id: 9, sede: 'Digital6G', referencia: 'REF-2025-0451', valor: 120000, fecha: '2025-11-05', estado: 'aprobado' },
    { id: 10, sede: 'CSU', referencia: 'REF-2025-0440', valor: 95000, fecha: '2025-11-01', estado: 'pendiente' },
    { id: 11, sede: 'Norte', referencia: 'REF-2025-0431', valor: 80000, fecha: '2025-10-20', estado: 'aprobado' },
    { id: 12, sede: 'Digital6G', referencia: 'REF-2025-0418', valor: 120000, fecha: '2025-10-15', estado: 'aprobado' },
])

// ── Filtros ───────────────────────────────────────────────────────
const busqueda = ref('')
const filtroSede = ref('')
const filtroPeriodo = ref('')
const filtroEstado = ref('')
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

const sedesUnicas = computed(() => [...new Set(mockPagos.value.map(p => p.sede))])

const pagosFiltrados = computed(() => {
    const q = busqueda.value.toLowerCase()
    const ahora = new Date()

    return mockPagos.value.filter(p => {
        const matchBusqueda = !q ||
            p.sede.toLowerCase().includes(q) ||
            p.referencia.toLowerCase().includes(q)

        const matchSede = !filtroSede.value || p.sede === filtroSede.value
        const matchEstado = !filtroEstado.value || p.estado === filtroEstado.value

        let matchPeriodo = true
        if (filtroPeriodo.value) {
            const meses = parseInt(filtroPeriodo.value)
            const limite = new Date(ahora)
            limite.setMonth(limite.getMonth() - meses)
            matchPeriodo = new Date(p.fecha) >= limite
        }

        return matchBusqueda && matchSede && matchEstado && matchPeriodo
    })
})

const pagosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * itemsPorPagina.value
    return pagosFiltrados.value.slice(inicio, inicio + itemsPorPagina.value)
})

const totalPaginas = computed(() =>
    Math.max(1, Math.ceil(pagosFiltrados.value.length / itemsPorPagina.value))
)
const rangoInicio = computed(() =>
    pagosFiltrados.value.length === 0 ? 0 : (paginaActual.value - 1) * itemsPorPagina.value + 1
)
const rangoFin = computed(() =>
    Math.min(paginaActual.value * itemsPorPagina.value, pagosFiltrados.value.length)
)

watch([busqueda, filtroSede, filtroPeriodo, filtroEstado], () => { paginaActual.value = 1 })

const limpiarFiltros = () => {
    busqueda.value = ''
    filtroSede.value = ''
    filtroPeriodo.value = ''
    filtroEstado.value = ''
}

// ── Resumen ───────────────────────────────────────────────────────
const totalPagado = computed(() =>
    pagosFiltrados.value
        .filter(p => p.estado === 'aprobado')
        .reduce((acc, p) => acc + p.valor, 0)
)
const countEstado = (estado) =>
    pagosFiltrados.value.filter(p => p.estado === estado).length

// ── Helpers ───────────────────────────────────────────────────────
const formatCOP = (valor) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(valor)

const formatDia = (fecha) =>
    new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })

const formatMes = (fecha) =>
    new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { year: 'numeric' })

const estadoLabel = (e) => ({ aprobado: 'Aprobado', pendiente: 'Pendiente', rechazado: 'Rechazado' })[e] ?? e
</script>

<style scoped>
/* ── Filtros ─────────────────────────────────────────────────────── */
.filters-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 12px;
}

.filter-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 140px;
}

.filter-field--search {
    flex: 2;
    min-width: 200px;
}

.filter-label {
    font-size: 0.62rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9ca3af;
    padding-left: 4px;
}

.search-input,
.filter-select {
    background-color: #EAEAEA !important;
    border: 2px solid #299261 !important;
    border-radius: 999px !important;
    padding: 8px 14px !important;
    font-size: 0.82rem !important;
    color: #232B3A !important;
    outline: none !important;
    box-shadow: none !important;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
}

.search-input:focus,
.filter-select:focus {
    border-color: #0D291C !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
}

.filter-clear-btn {
    align-self: flex-end;
    font-size: 0.75rem;
    font-weight: 700;
    color: #dc2626;
    background: none;
    border: 2px solid #fca5a5;
    border-radius: 999px;
    padding: 7px 14px;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
    white-space: nowrap;
}

.filter-clear-btn:hover {
    background-color: #fee2e2;
}

@media (max-width: 600px) {
    .filters-bar {
        flex-direction: column;
    }

    .filter-field,
    .filter-field--search {
        width: 100%;
        min-width: unset;
    }
}

/* ── Resumen rápido ──────────────────────────────────────────────── */
.resumen-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

@media (max-width: 700px) {
    .resumen-row {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 400px) {
    .resumen-row {
        grid-template-columns: 1fr;
    }
}

.resumen-card {
    background-color: white;
    border-radius: 18px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 2px solid transparent;
    box-shadow: 0 3px 0 #e2ede7;
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

.resumen-card__num {
    font-size: 1.3rem;
    font-weight: 900;
    line-height: 1;
}

.resumen-card__label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #9ca3af;
}

.resumen-card--total {
    border-color: #e8f5e9;
}

.resumen-card--total .resumen-card__num {
    color: #0D291C;
}

.resumen-card--count .resumen-card__num {
    color: #6b7280;
}

.resumen-card--aprobados .resumen-card__num {
    color: #299261;
}

.resumen-card--pendientes .resumen-card__num {
    color: #d97706;
}

/* ── Tabla ───────────────────────────────────────────────────────── */
.table-scroll-wrapper {
    overflow-x: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: #0D291C33 #f0f9f4;
}

.data-table {
    width: 100%;
    min-width: 620px;
    border-collapse: collapse;
}

.th-cell {
    background-color: #0D291C;
    color: #7FD344;
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 14px 16px;
    text-align: left;
    white-space: nowrap;
}

.th-cell--sticky {
    position: sticky;
    left: 0;
    z-index: 3;
    background-color: #0D291C;
}

.td-cell {
    padding: 14px 16px;
    font-size: 0.84rem;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
    white-space: nowrap;
}

.td-cell--sticky {
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: white;
    box-shadow: 3px 0 8px rgba(13, 41, 28, 0.06);
}

.table-row {
    transition: background-color 0.12s;
    animation: rowIn 0.3s ease both;
}

.table-row:hover .td-cell {
    background-color: #f0faf4;
}

.table-row:hover .td-cell--sticky {
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

/* Avatar de sede */
.sede-avatar {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background-color: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.7rem;
    flex-shrink: 0;
}

/* Referencia */
.ref-code {
    font-family: monospace;
    font-size: 0.78rem;
    font-weight: 700;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.04em;
}

/* Valor */
.valor-text {
    font-weight: 800;
    color: #0D291C;
    font-size: 0.88rem;
}

/* Fecha */
.fecha-wrap {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.fecha-dia {
    font-size: 0.82rem;
    font-weight: 700;
    color: #232B3A;
}

.fecha-mes {
    font-size: 0.68rem;
    font-weight: 600;
    color: #9ca3af;
}

/* Badges de estado */
.estado-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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

.estado-badge--aprobado {
    background-color: #dcfce7;
    color: #16a34a;
}

.estado-badge--aprobado .estado-dot {
    background-color: #16a34a;
}

.estado-badge--pendiente {
    background-color: #fef3c7;
    color: #d97706;
}

.estado-badge--pendiente .estado-dot {
    background-color: #d97706;
}

.estado-badge--rechazado {
    background-color: #fee2e2;
    color: #dc2626;
}

.estado-badge--rechazado .estado-dot {
    background-color: #dc2626;
}

/* ── Paginación ──────────────────────────────────────────────────── */
.table-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid #f3f4f6;
    background-color: white;
    gap: 12px;
    flex-wrap: wrap;
}

.foot-counter {
    font-size: 0.75rem;
    color: #9ca3af;
}

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
    background-color: #0D291C;
    border-color: #0D291C;
    color: #7FD344;
}

.page-btn--num {
    display: none;
}

.page-mobile-indicator {
    font-size: 0.78rem;
    font-weight: 700;
    color: #6b7280;
    padding: 0 4px;
}

@media (min-width: 500px) {
    .page-btn--num {
        display: flex;
    }

    .page-mobile-indicator {
        display: none;
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