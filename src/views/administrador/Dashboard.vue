<template>
    <div class="db-root">

        <!-- ── Encabezado de página ─────────────────────── -->
        <div class="col-span-full db-header card-animation">
            <div class="db-header__text">
                <span class="db-header__badge">Panel de control</span>
                <h1>Dashboard</h1>
                <p>Resumen operativo y accesos rápidos del sistema</p>
            </div>
        </div>

        <!-- ── Gráfica 1: Mensualidades vencidas ────────── -->
        <div v-if="hasPermission(PERMS.MENSUALIDADES_VER)" class="chart-card card-animation">
            <div class="chart-accent chart-accent--red" />
            <div class="chart-head">
                <div class="chart-meta">
                    <span class="metric-badge metric-badge--red">Urgente</span>
                    <h3>Mensualidades vencidas</h3>
                    <p>Por sede · este mes</p>
                </div>
                <div class="chart-kpi">
                    <span class="chart-kpi__val text-red-600">{{ totalVencidas }}</span>
                    <span class="chart-kpi__label text-red-400">vencidas</span>
                </div>
            </div>
            <div class="chart-area">
                <Bar :data="vencidasData" :options="optsVencidas" />
            </div>
        </div>

        <!-- ── Gráfica 2: Ingresos mensuales ────────────── -->
        <div v-if="hasPermission(PERMS.MENSUALIDADES_VER)" class="chart-card card-animation">
            <div class="chart-accent chart-accent--green" />
            <div class="chart-head">
                <div class="chart-meta">
                    <span class="metric-badge metric-badge--green">Finanzas</span>
                    <h3>Ingresos mensuales</h3>
                    <p>6 mejores sedes</p>
                </div>
                <div class="chart-kpi">
                    <span class="chart-kpi__val chart-kpi__val--sm text-[#299261]">{{ totalIngresos }}</span>
                    <span class="chart-kpi__label text-[#299261] opacity-60">total</span>
                </div>
            </div>
            <div class="chart-area">
                <Bar :data="ingresosData" :options="optsIngresos" />
            </div>
        </div>

        <!-- ── Gráfica 3: Disponibilidad por sede ───────── -->
        <div v-if="hasPermission(PERMS.SEDES_VER)" class="chart-card card-animation">
            <div class="chart-accent chart-accent--blue" />
            <div class="chart-head">
                <div class="chart-meta">
                    <span class="metric-badge metric-badge--blue">Disponibilidad</span>
                    <h3>Capacidad por sede</h3>
                    <p>Mensualidades activas vs total</p>
                </div>
            </div>

            <select v-model="sedeSeleccionada" class="disp-select">
                <option value="">Selecciona una sede...</option>
                <option v-for="s in sedesAgrupadas" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                    {{ s.Nombre }}
                </option>
            </select>

            <template v-if="sedeActual">
                <div v-for="v in sedeActual.vehiculos" :key="v.IdTipoVehiculo" class="disp-row">
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-[1.05rem] leading-none">
                            <span v-if="v.TipoVehiculo === 'Moto'" v-html="motorbike" />
                            <span v-else v-html="car" />
                        </span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[0.7rem] font-bold text-[#299261]">{{ v.MensualidadesOcupadas }}
                                ocupadas</span>
                            <span class="text-[0.7rem] text-gray-300">·</span>
                            <span class="text-[0.7rem] font-bold text-gray-400">{{ v.Total }} total</span>
                        </div>
                    </div>
                    <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                            :class="pct(v) >= 90 ? 'bg-red-500' : pct(v) >= 70 ? 'bg-amber-400' : 'bg-[#7FD344]'"
                            :style="{ width: `${pct(v)}%` }" />
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-[0.62rem] font-semibold text-gray-400">{{ v.MensualidadesDisponibles }}
                            disponibles</span>
                        <span class="text-[0.62rem] font-black"
                            :class="pct(v) >= 90 ? 'text-red-500' : pct(v) >= 70 ? 'text-amber-500' : 'text-[#299261]'">
                            {{ pct(v) }}% ocupado
                        </span>
                    </div>
                </div>
            </template>

            <div v-else class="disp-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Selecciona una sede para ver su disponibilidad
            </div>
        </div>

        <!-- ── Accesos rápidos ───────────────────────────── -->
        <div v-for="(opcion, i) in opciones" :key="opcion.id" class="opcion-card card-animation"
            :style="{ animationDelay: `${i * 0.04}s` }" @click="router.push(opcion.route)">
            <div class="opcion-icon">
                <span v-html="opcion.icon" />
            </div>
            <div class="opcion-body">
                <h2>{{ opcion.titulo }}</h2>
                <p v-if="opcion.sub">{{ opcion.sub }}</p>
            </div>
            <div class="opcion-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </div>

    </div>
</template>

<script setup>
import { PERMS } from '@/constants/permisions'
import { useAuth } from '@/composables/useAuth'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import sedesServices from '@/api/services/sedes.service'
import UsersService from '@/api/services/client.service'
import SedesDisponibilidadService from '@/api/services/sedesdisponibilidad.service'

import clientes from '@/assets/img/account_box_green.svg?raw'
import mensualidades from '@/assets/img/calendar_add_on_green.svg?raw'
import solicitudes from '@/assets/img/contract_green.svg?raw'
import reportes from '@/assets/img/assignment_green.svg?raw'
import disponibilidad from '@/assets/img/event_available_green.svg?raw'
import verificacion from '@/assets/img/verified_green.svg?raw'
import tarifas from '@/assets/img/car_tag_green.svg?raw'
import tarjetas from '@/assets/img/payment_card_green.svg?raw'
import car from '@/assets/img/car-side.svg?raw'
import motorbike from '@/assets/img/two_wheeler.svg?raw'
import sedes from '@/assets/img/emoji_transportation_green.svg?raw'
import usuarios from '@/assets/img/manage_accounts_green.svg?raw'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const router = useRouter()
const Usuarios = ref([])
const Sedes = ref([])
const Sedesdata = ref([])
const { hasPermission } = useAuth()

const usuariostotales = computed(() => Usuarios.value?.total ?? '—')
const sedestotal = computed(() => Sedes.value.length)
const sedesLabels = computed(() => Sedes.value.map(s => s.Nombre).slice(0, 6))

// ── Gráfica 1 ─────────────────────────────────────────────────────
const vencidasRaw = ref([18, 24, 31, 27, 35, 42])
const totalVencidas = computed(() => vencidasRaw.value.reduce((a, b) => a + b, 0))
const vencidasData = computed(() => ({
    labels: sedesLabels.value,
    datasets: [{ label: 'Vencidas', data: vencidasRaw.value, backgroundColor: 'rgba(220,38,38,0.10)', borderColor: '#dc2626', borderWidth: 2, borderRadius: 6, borderSkipped: false }]
}))
const optsVencidas = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleColor: '#f9fafb', bodyColor: '#fca5a5', callbacks: { label: (ctx) => ` ${ctx.parsed.y} vencidas` } } },
    scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } }, y: { grid: { color: '#f8fafc' }, ticks: { color: '#9ca3af', font: { size: 11 } } } }
}

// ── Gráfica 2 ─────────────────────────────────────────────────────
const ingresosRaw = ref([4200000, 5100000, 5800000, 5900000, 6300000, 7200000])
const totalIngresos = computed(() => {
    const total = ingresosRaw.value.reduce((a, b) => a + b, 0)
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total)
})
const ingresosData = computed(() => ({
    labels: sedesLabels.value,
    datasets: [{ label: 'Ingresos', data: ingresosRaw.value, backgroundColor: 'rgba(41,146,97,0.10)', borderColor: '#299261', borderWidth: 2, borderRadius: 6, borderSkipped: false }]
}))
const optsIngresos = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleColor: '#f9fafb', bodyColor: '#86efac', callbacks: { label: (ctx) => ` ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(ctx.parsed.y)}` } } },
    scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } }, y: { grid: { color: '#f8fafc' }, ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => `$${(v / 1000000).toFixed(1)}M` } } }
}

// ── Disponibilidad ─────────────────────────────────────────────────
const sedeSeleccionada = ref('')

const sedesAgrupadas = computed(() => {
    if (!Array.isArray(Sedesdata.value) || !Sedesdata.value.length) return []
    const grupos = {}
    Sedesdata.value.forEach(item => {
        const id = Number(item.IdEstacionamiento)
        if (!grupos[id]) grupos[id] = { IdEstacionamiento: id, Nombre: item.Nombre, vehiculos: [] }
        grupos[id].vehiculos.push(item)
    })
    return Object.values(grupos)
})

const sedeActual = computed(() =>
    sedesAgrupadas.value.find(s => s.IdEstacionamiento === Number(sedeSeleccionada.value)) ?? null
)

const pct = (v) => (!v.Total || v.Total === 0) ? 0 : Math.round((v.MensualidadesOcupadas / v.Total) * 100)

// ── Menú rápido ────────────────────────────────────────────────────
const opciones = computed(() => [
    { id: 1, icon: clientes, titulo: 'Clientes', sub: `${usuariostotales.value} usuarios`, route: '/admin/clientes', permission: PERMS.USUARIOS_VER },
    { id: 2, icon: mensualidades, titulo: 'Mensualidades', sub: 'Al día', route: '/admin/mensualidades', permission: PERMS.MENSUALIDADES_VER },
    { id: 3, icon: solicitudes, titulo: 'Solicitudes', sub: '3 pendientes', route: '/admin/solicitudes', permission: PERMS.MENSUALIDADES_VER },
    { id: 4, icon: reportes, titulo: 'Reportes', sub: 'Ver estadísticas', route: '/admin/reportes', permission: PERMS.USUARIOS_VER },
    { id: 5, icon: sedes, titulo: 'Administrar sedes', sub: `${sedestotal.value} sedes`, route: '/admin/sedes', permission: PERMS.SEDES_VER },
    { id: 6, icon: usuarios, titulo: 'Usuarios', sub: 'Gestionar accesos', route: '/admin/usuarios', permission: PERMS.ROLES_VER },
    { id: 7, icon: disponibilidad, titulo: 'Ver disponibilidad', sub: '', route: '/admin/disponibilidad', permission: PERMS.CODIGOS_CREAR },
    { id: 8, icon: verificacion, titulo: 'Codigo verificacion', sub: '', route: '/admin/verificacion', permission: PERMS.CODIGOS_CREAR },
    { id: 9, icon: tarifas, titulo: 'Ver tarifas', sub: '', route: '/admin/tarifas', permission: PERMS.CODIGOS_CREAR },
    { id: 10, icon: tarjetas, titulo: 'Tarjeta', sub: '', route: '/admin/tarjetas', permission: PERMS.CODIGOS_CREAR },
].filter(item => hasPermission(item.permission)))

// ── onMounted ──────────────────────────────────────────────────────
onMounted(async () => {
    try {
        const [sedesRes, usuariosRes, dispRes] = await Promise.all([
            (hasPermission(PERMS.SEDES_VER) || hasPermission(PERMS.MENSUALIDADES_VER))
                ? sedesServices.getAll() : Promise.resolve([]),
            hasPermission(PERMS.USUARIOS_VER)
                ? UsersService.getAllClients() : Promise.resolve([]),
            hasPermission(PERMS.SEDES_VER)
                ? SedesDisponibilidadService.getDisponibilidadDetalle() : Promise.resolve([]),
        ])

        // console.group('📊 [Dashboard] onMounted')
        // console.log('dispRes raw:', dispRes)
        // console.log('dispRes tipo:', Array.isArray(dispRes) ? 'array' : typeof dispRes)
        // console.log('dispRes keys:', dispRes && typeof dispRes === 'object' ? Object.keys(dispRes) : '—')
        // console.groupEnd()

        Sedes.value = sedesRes ?? []
        Usuarios.value = usuariosRes ?? []
        Sedesdata.value = Array.isArray(dispRes) ? dispRes : (dispRes?.data ?? [])

        // console.log('Sedesdata.value:', Sedesdata.value)
        // console.log('sedesAgrupadas:', sedesAgrupadas.value)

        if (sedesAgrupadas.value.length > 0)
            sedeSeleccionada.value = sedesAgrupadas.value[0].IdEstacionamiento

    } catch (e) {
        console.error('Error cargando dashboard:', e)
    }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
</style>

<style scoped>
/* ── Root grid ────────────────────────────────── */
.db-root {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    align-content: start;
    width: 100%;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Page header ──────────────────────────────── */
.db-header {
    grid-column: 1 / -1;
    padding-bottom: 16px;
    border-bottom: 1.5px solid #e8ecf0;
    margin-bottom: 4px;
}

.db-header__badge {
    display: inline-block;
    font-size: 0.67rem;
    font-weight: 700;
    color: #299261;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 6px;
}

.db-header h1 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0D291C;
    letter-spacing: -0.025em;
    line-height: 1.15;
    margin: 0 0 4px;
}

.db-header p {
    font-size: 0.82rem;
    color: #94a3b8;
    margin: 0;
    font-weight: 500;
}

/* ── Chart card base ──────────────────────────── */
.chart-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    border: 1.5px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
}

.chart-card:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* ── Top accent ───────────────────────────────── */
.chart-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
}

.chart-accent--red {
    background: linear-gradient(90deg, #dc2626, #f87171);
}

.chart-accent--green {
    background: linear-gradient(90deg, #299261, #7FD344);
}

.chart-accent--blue {
    background: linear-gradient(90deg, #2563eb, #60a5fa);
}

/* ── Chart head ───────────────────────────────── */
.chart-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding-top: 5px;
}

.chart-meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.chart-meta h3 {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D291C;
    line-height: 1.2;
    margin: 0;
}

.chart-meta p {
    font-size: 0.68rem;
    color: #94a3b8;
    font-weight: 500;
    margin: 0;
}

/* ── Metric badges ────────────────────────────── */
.metric-badge {
    display: inline-block;
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 3px 8px;
    border-radius: 100px;
    width: fit-content;
    margin-bottom: 2px;
}

.metric-badge--red {
    background: #fef2f2;
    color: #dc2626;
}

.metric-badge--green {
    background: #f0fdf4;
    color: #15803d;
}

.metric-badge--blue {
    background: #eff6ff;
    color: #2563eb;
}

/* ── KPI value ────────────────────────────────── */
.chart-kpi {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
}

.chart-kpi__val {
    font-size: 1.6rem;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.02em;
}

.chart-kpi__val--sm {
    font-size: 0.92rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    text-align: right;
    line-height: 1.3;
}

.chart-kpi__label {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-top: 3px;
}

/* ── Chart area ───────────────────────────────── */
.chart-area {
    height: 178px;
    position: relative;
}

/* ── Disponibilidad select ────────────────────── */
.disp-select {
    width: 100%;
    font-size: 0.72rem;
    padding: 7px 10px;
    border-radius: 10px;
    border: 1.5px solid #e8ecf0;
    background: #f7f8fa;
    color: #374151;
    cursor: pointer;
    outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.15s;
}

.disp-select:focus {
    border-color: #299261;
}

/* ── Disponibilidad row ───────────────────────── */
.disp-row {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 12px 13px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    border: 1.5px solid #f1f5f9;
    transition: border-color 0.15s;
}

.disp-row:hover {
    border-color: #d1fae5;
}

/* ── Disponibilidad empty ─────────────────────── */
.disp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 0;
    font-size: 0.72rem;
    font-weight: 600;
    color: #c4cdd8;
    text-align: center;
}

/* ── Quick access card ────────────────────────── */
.opcion-card {
    background: white;
    border-radius: 18px;
    padding: 18px 16px;
    cursor: pointer;
    border: 1.5px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    gap: 13px;
    transition: border-color 0.18s, background 0.18s, transform 0.15s, box-shadow 0.18s;
    position: relative;
}

.opcion-card:hover {
    background: #0D291C;
    border-color: #0D291C;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(13, 41, 28, 0.22);
}

.opcion-card:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(13, 41, 28, 0.15);
}

/* ── Opcion icon ──────────────────────────────── */
.opcion-icon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    background: #f0f9f4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.18s;
}

.opcion-card:hover .opcion-icon {
    background: rgba(127, 211, 68, 0.15);
}

.opcion-icon :deep(svg) {
    width: 24px;
    height: 24px;
    fill: #0D291C;
    display: block;
    transition: fill 0.18s;
}

.opcion-card:hover .opcion-icon :deep(svg) {
    fill: #7FD344;
}

/* ── Opcion text ──────────────────────────────── */
.opcion-body {
    flex: 1;
    min-width: 0;
}

.opcion-body h2 {
    font-size: 0.84rem;
    font-weight: 800;
    color: #0D291C;
    line-height: 1.2;
    margin: 0 0 3px;
    transition: color 0.18s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.opcion-card:hover .opcion-body h2 {
    color: white;
}

.opcion-body p {
    font-size: 0.71rem;
    font-weight: 600;
    color: #299261;
    margin: 0;
    transition: color 0.18s;
}

.opcion-card:hover .opcion-body p {
    color: rgba(127, 211, 68, 0.65);
}

/* ── Arrow ────────────────────────────────────── */
.opcion-arrow {
    color: #d1d5db;
    flex-shrink: 0;
    transition: color 0.18s, transform 0.2s ease;
}

.opcion-card:hover .opcion-arrow {
    color: #7FD344;
    transform: translateX(3px);
}

/* ── Animations ───────────────────────────────── */
.card-animation {
    animation: cardIn 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(14px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* ── Reduced motion ───────────────────────────── */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 900px) {
    .db-root {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 560px) {
    .db-root {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .chart-area {
        height: 150px;
    }

    .opcion-card {
        padding: 14px 12px;
    }

    .opcion-icon {
        width: 40px;
        height: 40px;
        border-radius: 11px;
    }

    .opcion-icon :deep(svg) {
        width: 20px;
        height: 20px;
    }
}
</style>
