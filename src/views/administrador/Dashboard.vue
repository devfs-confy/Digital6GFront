<template>
    <div class="dashboard-grid">

        <!-- Analítica 1: Mensualidades vencidas -->
        <div class="chart-card card-animation">
            <div class="chart-card__head">
                <div class="chart-card__meta">
                    <span class="chart-card__tag chart-card__tag--danger">Urgente</span>
                    <h3 class="chart-card__title">Mensualidades vencidas</h3>
                    <p class="chart-card__sub">Por sede · últimos 6 meses</p>
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
                    <p class="chart-card__sub">Últimos 6 meses · todas las sedes</p>
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

        <!-- Analítica 3: Estado de sedes -->
        <div class="chart-card card-animation">
            <div class="chart-card__head">
                <div class="chart-card__meta">
                    <span class="chart-card__tag chart-card__tag--blue">Sedes</span>
                    <h3 class="chart-card__title">Estado de sedes</h3>
                    <p class="chart-card__sub">{{ sedesActivas }} activas · {{ sedesInactivas }} inactivas</p>
                </div>
                <div class="sedes-legend">
                    <span class="sedes-legend__item sedes-legend__item--activa">● Activa</span>
                    <span class="sedes-legend__item sedes-legend__item--inactiva">● Inactiva</span>
                </div>
            </div>
            <div class="sedes-list ">
                <div v-if="Sedes.length === 0" class="sedes-empty">Cargando sedes...</div>
                <div v-for="sede in Sedes" :key="sede.IdEstacionamiento" class="sede-row"
                    :class="sede.Estado ? 'sede-row--activa' : 'sede-row--inactiva'">
                    <div class="sede-dot" :class="sede.Estado ? 'sede-dot--activa' : 'sede-dot--inactiva'" />
                    <span class="sede-nombre">{{ sede.Nombre }}</span>
                    <div class="sede-bar-wrap">
                        <div class="sede-bar" :class="sede.Estado ? 'sede-bar--activa' : 'sede-bar--inactiva'"
                            :style="{ width: sede.Estado ? '100%' : '30%' }" />
                    </div>
                    <span class="sede-badge" :class="sede.Estado ? 'sede-badge--activa' : 'sede-badge--inactiva'">
                        {{ sede.Estado ? 'Activa' : 'Inactiva' }}
                    </span>
                </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import sedesServices from '@/api/services/sedes.services'

import clientes from '@/assets/img/account_box_green.svg?raw'
import mensualidades from '@/assets/img/calendar_add_on_green.svg?raw'
import solicitudes from '@/assets/img/contract_green.svg?raw'
import reportes from '@/assets/img/assignment_green.svg?raw'
import sedes from '@/assets/img/emoji_transportation_green.svg?raw'
import usuarios from '@/assets/img/manage_accounts_green.svg?raw'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const router = useRouter()

// Sedes
const Sedes = ref([])
const sedesActivas = computed(() => Sedes.value.filter(s => s.Estado).length)
const sedesInactivas = computed(() => Sedes.value.filter(s => !s.Estado).length)

// Meses label
const meses = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene']

// ── Gráfica 1: Mensualidades vencidas ─────────────────────────────
// TODO: reemplazar con → vencidasRaw.value = await EstadisticasService.getVencidas()
const vencidasRaw = ref([18, 24, 31, 27, 35, 42])

const totalVencidas = computed(() => vencidasRaw.value.at(-1))

const vencidasData = computed(() => ({
    labels: meses,
    datasets: [{
        label: 'Vencidas',
        data: vencidasRaw.value,
        backgroundColor: 'rgba(220, 38, 38, 0.12)',
        borderColor: '#dc2626',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
    }]
}))

const optsVencidas = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f9fafb',
            bodyColor: '#fca5a5',
            callbacks: { label: (ctx) => ` ${ctx.parsed.y} vencidas` }
        }
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
        y: { grid: { color: '#f9fafb' }, ticks: { color: '#9ca3af', font: { size: 11 } } }
    }
}

// ── Gráfica 2: Ingresos ────────────────────────────────────────────
// TODO: reemplazar con → ingresosRaw.value = await EstadisticasService.getIngresos()
const ingresosRaw = ref([4200000, 5800000, 5100000, 6300000, 5900000, 7200000])

const totalIngresos = computed(() => {
    const total = ingresosRaw.value.reduce((a, b) => a + b, 0)
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total)
})

const ingresosData = computed(() => ({
    labels: meses,
    datasets: [{
        label: 'Ingresos',
        data: ingresosRaw.value,
        backgroundColor: 'rgba(41, 146, 97, 0.12)',
        borderColor: '#299261',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
    }]
}))

const optsIngresos = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f9fafb',
            bodyColor: '#86efac',
            callbacks: {
                label: (ctx) => ` ${new Intl.NumberFormat('es-CO', {
                    style: 'currency', currency: 'COP', maximumFractionDigits: 0
                }).format(ctx.parsed.y)}`
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


// ── Menú rápido ────────────────────────────────────────────────────
const opciones = computed(() => [
    { id: 1, icon: clientes, titulo: 'Clientes', sub: '128 registrados', route: '/admin/clientes' },
    { id: 2, icon: mensualidades, titulo: 'Mensualidades', sub: 'Al día', route: '/admin/mensualidades' },
    { id: 3, icon: solicitudes, titulo: 'Solicitudes', sub: '3 pendientes', route: '/admin/solicitudes' },
    { id: 4, icon: reportes, titulo: 'Reportes', sub: 'Ver estadísticas', route: '/admin/reportes' },
    { id: 5, icon: sedes, titulo: 'Administrar sedes', sub: `${Sedes.value.length} sedes`, route: '/admin/sedes' },
    { id: 6, icon: usuarios, titulo: 'Usuarios', sub: 'Gestionar accesos', route: '/admin/usuarios' },
],)
// ── onMounted ──────────────────────────────────────────────────────
onMounted(async () => {
    try {
        Sedes.value = await sedesServices.getAll()



    } catch (e) {
        console.error('Error cargando sedes:', e)
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

/* ── Tarjeta gráfica ─────────────────────────────────────────────── */
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
    flex-shrink: 0;
    align-self: flex-start;
}

.chart-select:focus {
    border-color: #299261 !important;
    outline: none;
    box-shadow: none !important;
}

/* Altura fija para la gráfica — evita que se deforme */
.chart-wrap {
    height: 180px;
    position: relative;
}

@media (max-width: 560px) {
    .chart-wrap {
        height: 150px;
    }
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

/* En mobile las tarjetas van horizontales */
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

/* ── Lista de sedes (analítica 3) ─────────────────────────────────── */
.sedes-legend {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
}

.sedes-legend__item {
    font-size: 0.65rem;
    font-weight: 700;
}

.sedes-legend__item--activa {
    color: #299261;
}

.sedes-legend__item--inactiva {
    color: #9ca3af;
}

.sedes-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 180px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #e2ede7 transparent;
}

.sedes-empty {
    font-size: 0.78rem;
    color: #9ca3af;
    text-align: center;
    padding: 20px 0;
}

.sede-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 12px;
    transition: background-color 0.15s;
}

.sede-row--activa {
    background-color: #f0faf4;
}

.sede-row--inactiva {
    background-color: #f9fafb;
}

.sede-row:hover {
    filter: brightness(0.97);
}

.sede-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.sede-dot--activa {
    background-color: #299261;
}

.sede-dot--inactiva {
    background-color: #d1d5db;
}

.sede-nombre {
    font-size: 0.8rem;
    font-weight: 700;
    min-width: 80px;
    flex-shrink: 0;
}

.sede-row--activa .sede-nombre {
    color: #0D291C;
}

.sede-row--inactiva .sede-nombre {
    color: #9ca3af;
}

.sede-bar-wrap {
    flex: 1;
    height: 6px;
    background-color: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.sede-bar {
    height: 100%;
    border-radius: 999px;
    transition: width 0.4s ease;
}

.sede-bar--activa {
    background-color: #7FD344;
}

.sede-bar--inactiva {
    background-color: #d1d5db;
}

.sede-badge {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 2px 8px;
    border-radius: 999px;
    flex-shrink: 0;
}

.sede-badge--activa {
    background-color: #dcfce7;
    color: #16a34a;
}

.sede-badge--inactiva {
    background-color: #f3f4f6;
    color: #9ca3af;
}
</style>