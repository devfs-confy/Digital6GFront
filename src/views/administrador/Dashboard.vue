<template>
    <div class="dashboard-grid">

        <!-- Analítica 1: Mensualidades vencidas -->
        <div class="chart-card card-animation">
            <div class="chart-card__head">
                <div class="chart-card__meta">
                    <span class="chart-card__tag chart-card__tag--danger">Urgente</span>
                    <h3 class="chart-card__title">Mensualidades vencidas</h3>
                    <p class="chart-card__sub">Por sede · este mes</p>
                </div>
                <div class="chart-card__stat chart-card__stat--danger">
                    <span class="chart-card__stat-num">{{ totalVencidas }}</span>
                    <span class="chart-card__stat-label">vencidas</span>
                </div>
            </div>
            <div class="chart-wrap">
                <Bar :data="vencidasData" :options="optsVencidas" />
            </div>
        </div>

        <!-- Analítica 2: Ingresos últimos 6 meses -->
        <div class="chart-card card-animation">
            <div class="chart-card__head">
                <div class="chart-card__meta">
                    <span class="chart-card__tag chart-card__tag--green">Finanzas</span>
                    <h3 class="chart-card__title">Ingresos mensuales</h3>
                    <p class="chart-card__sub">6 mejores sedes</p>
                </div>
                <div class="chart-card__stat chart-card__stat--green">
                    <span class="chart-card__stat-num">{{ totalIngresos }}</span>
                    <span class="chart-card__stat-label">total</span>
                </div>
            </div>
            <div class="chart-wrap">
                <Bar :data="ingresosData" :options="optsIngresos" />
            </div>
        </div>

        <!-- Analítica 3: Disponibilidad por sede -->
        <div class="chart-card card-animation">
            <div class="chart-card__head">
                <div class="chart-card__meta">
                    <span class="chart-card__tag chart-card__tag--blue">Disponibilidad</span>
                    <h3 class="chart-card__title">Capacidad por sede</h3>
                    <p class="chart-card__sub">Mensualidades activas vs total</p>
                </div>
            </div>

            <select v-model="sedeSeleccionada" class="chart-select">
                <option value="">Selecciona una sede...</option>
                <option v-for="s in sedesAgrupadas" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                    {{ s.Nombre }}
                </option>
            </select>

            <!-- Sede seleccionada -->
            <template v-if="sedeActual">
                <div v-for="v in sedeActual.vehiculos" :key="v.IdTipoVehiculo" class="disp-vehiculo">
                    <div class="disp-vehiculo__head">
                        <div class="disp-vehiculo__tipo">
                            <span class="disp-vehiculo__icon">{{ v.TipoVehiculo === 'Moto' ? '🏍️' : '🚗' }}</span>
                            <span class="disp-vehiculo__label">{{ v.TipoVehiculo }}s</span>
                        </div>
                        <div class="disp-vehiculo__nums">
                            <span class="disp-num disp-num--activas">{{ v.MensualidadesOcupadas }} ocupadas</span>
                            <span class="disp-sep">·</span>
                            <span class="disp-num disp-num--total">{{ v.Total }} total</span>
                        </div>
                    </div>
                    <div class="disp-bar-wrap">
                        <div class="disp-bar-fill"
                            :class="pct(v) >= 90 ? 'disp-bar-fill--danger' : pct(v) >= 70 ? 'disp-bar-fill--warn' : 'disp-bar-fill--ok'"
                            :style="{ width: `${pct(v)}%` }" />
                    </div>
                    <div class="disp-bar-labels">
                        <span class="disp-bar-labels__disponible">{{ v.MensualidadesDisponibles }} disponibles</span>
                        <span class="disp-bar-labels__pct"
                            :class="pct(v) >= 90 ? 'pct--danger' : pct(v) >= 70 ? 'pct--warn' : 'pct--ok'">
                            {{ pct(v) }}% ocupado
                        </span>
                    </div>
                </div>
            </template>

            <!-- Sin sede seleccionada -->
            <div v-else class="disp-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Selecciona una sede para ver su disponibilidad</span>
            </div>
        </div>

        <!-- Tarjetas de acceso rápido -->
        <div v-for="opcion in opciones" :key="opcion.id" class="opcion-card card-animation"
            @click="router.push(opcion.route)">
            <div class="opcion-icon">
                <span v-html="opcion.icon" />
            </div>
            <div class="opcion-text">
                <h2 class="opcion-title">{{ opcion.titulo }}</h2>
                <p class="opcion-sub">{{ opcion.sub }}</p>
            </div>
        </div>

    </div>
</template>

<script setup>
// ── Todos los imports al principio ────────────────────────────────
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import sedesServices from '@/api/services/sedes.services'
import UsersService from '@/api/services/users.service'
import SedesDisponibilidadService from '@/api/services/sedesdisponibilidad.service'

import clientes from '@/assets/img/account_box_green.svg?raw'
import mensualidades from '@/assets/img/calendar_add_on_green.svg?raw'
import solicitudes from '@/assets/img/contract_green.svg?raw'
import reportes from '@/assets/img/assignment_green.svg?raw'
import sedes from '@/assets/img/emoji_transportation_green.svg?raw'
import usuarios from '@/assets/img/manage_accounts_green.svg?raw'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const router = useRouter()
const Usuarios = ref([])
const Sedes = ref([])
const Sedesdata = ref([])

// ── Computed helpers ───────────────────────────────────────────────
const usuariostotales = computed(() => Usuarios.value?.total ?? '—')
const sedestotal = computed(() => Sedes.value.length)
const sedesLabels = computed(() => Sedes.value.map(s => s.Nombre).slice(0, 6))

// ── Gráfica 1 ─────────────────────────────────────────────────────
const vencidasRaw = ref([18, 24, 31, 27, 35, 42])
const totalVencidas = computed(() => vencidasRaw.value.reduce((a, b) => a + b, 0))
const vencidasData = computed(() => ({
    labels: sedesLabels.value,
    datasets: [{
        label: 'Vencidas', data: vencidasRaw.value,
        backgroundColor: 'rgba(220,38,38,0.12)', borderColor: '#dc2626',
        borderWidth: 2, borderRadius: 6, borderSkipped: false
    }]
}))
const optsVencidas = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1f2937', titleColor: '#f9fafb', bodyColor: '#fca5a5',
            callbacks: { label: (ctx) => ` ${ctx.parsed.y} vencidas` }
        }
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
        y: { grid: { color: '#f9fafb' }, ticks: { color: '#9ca3af', font: { size: 11 } } }
    }
}

// ── Gráfica 2 ─────────────────────────────────────────────────────
const ingresosRaw = ref([4200000, 5100000, 5800000, 5900000, 6300000, 7200000])
const totalIngresos = computed(() => {
    const total = ingresosRaw.value.reduce((a, b) => a + b, 0)
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total)
})
const ingresosData = computed(() => ({
    labels: sedesLabels.value,
    datasets: [{
        label: 'Ingresos', data: ingresosRaw.value,
        backgroundColor: 'rgba(41,146,97,0.12)', borderColor: '#299261',
        borderWidth: 2, borderRadius: 6, borderSkipped: false
    }]
}))
const optsIngresos = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1f2937', titleColor: '#f9fafb', bodyColor: '#86efac',
            callbacks: {
                label: (ctx) => ` ${new Intl.NumberFormat('es-CO',
                    { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(ctx.parsed.y)}`
            }
        }
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
        y: {
            grid: { color: '#f9fafb' },
            ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => `$${(v / 1000000).toFixed(1)}M` }
        }
    }
}

// ── Analítica 3: disponibilidad ───────────────────────────────────
const sedeSeleccionada = ref('')

const sedesAgrupadas = computed(() => {
    if (!Array.isArray(Sedesdata.value) || Sedesdata.value.length === 0) return []

    const grupos = {}
    Sedesdata.value.forEach(item => {
        const id = item.IdEstacionamiento
        if (!grupos[id]) {
            grupos[id] = { IdEstacionamiento: id, Nombre: item.Nombre, vehiculos: [] }
        }
        grupos[id].vehiculos.push(item)
    })
    return Object.values(grupos)
})

const sedeActual = computed(() =>
    sedesAgrupadas.value.find(s => s.IdEstacionamiento === sedeSeleccionada.value) ?? null
)

const pct = (v) => {
    if (!v.Total || v.Total === 0) return 0
    return Math.round((v.MensualidadesOcupadas / v.Total) * 100)
}

// ── Menú rápido ───────────────────────────────────────────────────
const opciones = computed(() => [
    { id: 1, icon: clientes, titulo: 'Clientes', sub: `${usuariostotales.value} usuarios`, route: '/admin/clientes' },
    { id: 2, icon: mensualidades, titulo: 'Mensualidades', sub: 'Al día', route: '/admin/mensualidades' },
    { id: 3, icon: solicitudes, titulo: 'Solicitudes', sub: '3 pendientes', route: '/admin/solicitudes' },
    { id: 4, icon: reportes, titulo: 'Reportes', sub: 'Ver estadísticas', route: '/admin/reportes' },
    { id: 5, icon: sedes, titulo: 'Administrar sedes', sub: `${sedestotal.value} sedes`, route: '/admin/sedes' },
    { id: 6, icon: usuarios, titulo: 'Usuarios', sub: 'Gestionar accesos', route: '/admin/usuarios' },
])

// ── Un solo onMounted con todas las llamadas ──────────────────────
onMounted(async () => {
    try {
        const [sedesRes, usuariosRes, dispRes] = await Promise.all([
            sedesServices.getAll(),
            UsersService.getAllClients(),
            SedesDisponibilidadService.getDisponibilidadDetalle()
        ])

        Sedes.value = sedesRes ?? []
        Usuarios.value = usuariosRes ?? []


        const rawDisp = Array.isArray(dispRes) ? dispRes : (dispRes?.data ?? [])
        Sedesdata.value = rawDisp

        if (sedesAgrupadas.value.length > 0) {
            sedeSeleccionada.value = sedesAgrupadas.value[0].IdEstacionamiento
        }

    } catch (e) {
        console.error('Error cargando dashboard:', e)
    }
})
</script>

<style scoped>
.card-animation {
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    padding: 24px;
    align-content: start;
    width: 100%;
    box-sizing: border-box;
}

@media (max-width: 900px) {
    .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
        padding: 16px;
    }
}

@media (max-width: 560px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
        padding: 12px;
        gap: 12px;
    }
}

.chart-card {
    background-color: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 12px rgba(13, 41, 28, 0.07);
    border: 2px solid transparent;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: border-color 0.18s;
}

.chart-card:hover {
    border-color: #e8f5e9;
}

.chart-card__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
}

.chart-card__meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.chart-card__tag {
    display: inline-block;
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 999px;
    width: fit-content;
}

.chart-card__tag--danger {
    background-color: #fee2e2;
    color: #dc2626;
}

.chart-card__tag--green {
    background-color: #dcfce7;
    color: #16a34a;
}

.chart-card__tag--blue {
    background-color: #dbeafe;
    color: #2563eb;
}

.chart-card__title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D291C;
    line-height: 1.2;
}

.chart-card__sub {
    font-size: 0.68rem;
    color: #9ca3af;
    font-weight: 500;
}

.chart-card__stat {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
}

.chart-card__stat-num {
    font-size: 1.5rem;
    font-weight: 900;
    line-height: 1;
}

.chart-card__stat-label {
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.6;
}

.chart-card__stat--danger .chart-card__stat-num {
    color: #dc2626;
}

.chart-card__stat--danger .chart-card__stat-label {
    color: #dc2626;
}

.chart-card__stat--green .chart-card__stat-num {
    color: #299261;
}

.chart-card__stat--green .chart-card__stat-label {
    color: #299261;
}

.chart-select {
    font-size: 0.72rem !important;
    padding: 5px 10px !important;
    border-radius: 10px !important;
    border: 1.5px solid #e5e7eb !important;
    background-color: #f9fafb !important;
    color: #374151 !important;
    cursor: pointer;
    width: 100%;
}

.chart-select:focus {
    border-color: #299261 !important;
    outline: none;
    box-shadow: none !important;
}

.chart-wrap {
    height: 180px;
    position: relative;
}

@media (max-width: 560px) {
    .chart-wrap {
        height: 150px;
    }
}

/* ── Disponibilidad ──────────────────────────────────────────────── */
.disp-vehiculo {
    background-color: #f9fafb;
    border-radius: 14px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1.5px solid #f3f4f6;
    transition: border-color 0.15s;
}

.disp-vehiculo:hover {
    border-color: #e8f5e9;
}

.disp-vehiculo__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.disp-vehiculo__tipo {
    display: flex;
    align-items: center;
    gap: 8px;
}

.disp-vehiculo__icon {
    font-size: 1.1rem;
    line-height: 1;
}

.disp-vehiculo__label {
    font-size: 0.82rem;
    font-weight: 800;
    color: #0D291C;
}

.disp-vehiculo__nums {
    display: flex;
    align-items: center;
    gap: 6px;
}

.disp-num {
    font-size: 0.7rem;
    font-weight: 700;
}

.disp-num--activas {
    color: #299261;
}

.disp-num--total {
    color: #9ca3af;
}

.disp-sep {
    color: #d1d5db;
    font-size: 0.7rem;
}

.disp-bar-wrap {
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.disp-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.5s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.disp-bar-fill--ok {
    background-color: #7FD344;
}

.disp-bar-fill--warn {
    background-color: #f59e0b;
}

.disp-bar-fill--danger {
    background-color: #dc2626;
}

.disp-bar-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.disp-bar-labels__disponible {
    font-size: 0.62rem;
    font-weight: 700;
    color: #6b7280;
}

.disp-bar-labels__pct {
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.03em;
}

.pct--ok {
    color: #299261;
}

.pct--warn {
    color: #d97706;
}

.pct--danger {
    color: #dc2626;
}

.disp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 0 8px;
    color: #d1d5db;
    font-size: 0.72rem;
    font-weight: 600;
    text-align: center;
}

/* ── Tarjetas acceso rápido ──────────────────────────────────────── */
.opcion-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background-color: white;
    border-radius: 20px;
    padding: 20px 18px;
    cursor: pointer;
    border: 2px solid transparent;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 12px rgba(13, 41, 28, 0.07);
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.15s;
    text-align: center;
}

.opcion-card:hover {
    border-color: #299261;
    box-shadow: 0 4px 0 #0D291C, 0 2px 16px rgba(13, 41, 28, 0.12);
    transform: translateY(-2px);
}

.opcion-card:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #0D291C;
}

.opcion-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background-color: #e8f5e9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.18s;
}

.opcion-card:hover .opcion-icon {
    background-color: #0D291C;
}

:deep(.opcion-icon svg) {
    width: 32px;
    height: 32px;
    fill: #0D291C;
    transition: fill 0.18s;
    display: block;
}

.opcion-card:hover :deep(.opcion-icon svg) {
    fill: #7FD344;
}

.opcion-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.opcion-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D291C;
}

.opcion-sub {
    font-size: 0.75rem;
    font-weight: 600;
    color: #299261;
}

@media (max-width: 560px) {
    .opcion-card {
        flex-direction: row;
        text-align: left;
        padding: 14px 16px;
        gap: 14px;
    }

    .opcion-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
    }

    :deep(.opcion-icon svg) {
        width: 22px;
        height: 22px;
    }

    .opcion-title {
        white-space: normal;
    }
}
</style>