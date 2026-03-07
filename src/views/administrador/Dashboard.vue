<template>
    <div class="grid gap-[18px] p-6 content-start w-full box-border
                grid-cols-3
                max-[900px]:grid-cols-2 max-[900px]:p-4
                max-[560px]:grid-cols-1 max-[560px]:p-3 max-[560px]:gap-3">

        <!-- Analítica 1: Mensualidades vencidas -->
        <div v-if="hasPermission(PERMS.MENSUALIDADES_VER)" class="chart-card card-animation">
            <div class="flex items-start justify-between gap-2.5">
                <div class="flex flex-col gap-[3px] min-w-0">
                    <span
                        class="inline-block text-[0.58rem] font-extrabold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full w-fit bg-red-100 text-red-600">Urgente</span>
                    <h3 class="text-[0.88rem] font-extrabold text-[#0D291C] leading-tight">Mensualidades vencidas</h3>
                    <p class="text-[0.68rem] text-gray-400 font-medium">Por sede · este mes</p>
                </div>
                <div class="flex flex-col items-end shrink-0">
                    <span class="text-[1.5rem] font-black leading-none text-red-600">{{ totalVencidas }}</span>
                    <span class="text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-red-400">vencidas</span>
                </div>
            </div>
            <div class="h-[180px] max-[560px]:h-[150px] relative">
                <Bar :data="vencidasData" :options="optsVencidas" />
            </div>
        </div>

        <!-- Analítica 2: Ingresos últimos 6 meses -->
        <div v-if="hasPermission(PERMS.MENSUALIDADES_VER)" class="chart-card card-animation">
            <div class="flex items-start justify-between gap-2.5">
                <div class="flex flex-col gap-[3px] min-w-0">
                    <span
                        class="inline-block text-[0.58rem] font-extrabold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full w-fit bg-green-100 text-green-700">Finanzas</span>
                    <h3 class="text-[0.88rem] font-extrabold text-[#0D291C] leading-tight">Ingresos mensuales</h3>
                    <p class="text-[0.68rem] text-gray-400 font-medium">6 mejores sedes</p>
                </div>
                <div class="flex flex-col items-end shrink-0">
                    <span class="text-[1.5rem] font-black leading-none text-[#299261]">{{ totalIngresos }}</span>
                    <span
                        class="text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#299261] opacity-60">total</span>
                </div>
            </div>
            <div class="h-[180px] max-[560px]:h-[150px] relative">
                <Bar :data="ingresosData" :options="optsIngresos" />
            </div>
        </div>

        <!-- Analítica 3: Disponibilidad por sede -->
        <div v-if="hasPermission(PERMS.SEDES_VER)" class="chart-card card-animation">
            <div class="flex items-start justify-between gap-2.5">
                <div class="flex flex-col gap-[3px]">
                    <span
                        class="inline-block text-[0.58rem] font-extrabold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full w-fit bg-blue-100 text-blue-600">Disponibilidad</span>
                    <h3 class="text-[0.88rem] font-extrabold text-[#0D291C] leading-tight">Capacidad por sede</h3>
                    <p class="text-[0.68rem] text-gray-400 font-medium">Mensualidades activas vs total</p>
                </div>
            </div>

            <select v-model="sedeSeleccionada"
                class="w-full text-[0.72rem] px-2.5 py-[5px] rounded-[10px] border-[1.5px] border-gray-200 bg-gray-50 text-gray-700 cursor-pointer outline-none focus:border-[#299261]">
                <option value="">Selecciona una sede...</option>
                <option v-for="s in sedesAgrupadas" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                    {{ s.Nombre }}
                </option>
            </select>

            <template v-if="sedeActual">
                <div v-for="v in sedeActual.vehiculos" :key="v.IdTipoVehiculo"
                    class="bg-gray-50 rounded-[14px] px-3.5 py-3 flex flex-col gap-2 border-[1.5px] border-gray-100 hover:border-[#e8f5e9] transition-colors">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-[1.1rem] leading-none">
                                <span v-if="v.TipoVehiculo === 'Moto'" v-html="motorbike" />
                                <span v-else v-html="car" />
                            </span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[0.7rem] font-bold text-[#299261]">{{ v.MensualidadesOcupadas }}
                                ocupadas</span>
                            <span class="text-[0.7rem] text-gray-300">·</span>
                            <span class="text-[0.7rem] font-bold text-gray-400">{{ v.Total }} total</span>
                        </div>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                            :class="pct(v) >= 90 ? 'bg-red-500' : pct(v) >= 70 ? 'bg-amber-400' : 'bg-[#7FD344]'"
                            :style="{ width: `${pct(v)}%` }" />
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-[0.62rem] font-bold text-gray-500">{{ v.MensualidadesDisponibles }}
                            disponibles</span>
                        <span class="text-[0.62rem] font-black tracking-[0.03em]"
                            :class="pct(v) >= 90 ? 'text-red-500' : pct(v) >= 70 ? 'text-amber-500' : 'text-[#299261]'">
                            {{ pct(v) }}% ocupado
                        </span>
                    </div>
                </div>
            </template>

            <div v-else
                class="flex flex-col items-center gap-2 py-5 text-gray-300 text-[0.72rem] font-semibold text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Selecciona una sede para ver su disponibilidad</span>
            </div>
        </div>

        <!-- Tarjetas acceso rápido -->
        <div v-for="opcion in opciones" :key="opcion.id" class="opcion-card card-animation flex flex-col items-center gap-3 bg-white rounded-[20px] p-5 cursor-pointer border-2 border-transparent
                   hover:border-[#299261] hover:-translate-y-0.5 active:translate-y-0.5
                   max-[560px]:flex-row max-[560px]:text-left max-[560px]:p-3.5 max-[560px]:gap-3.5"
            style="box-shadow:0 4px 0 #e2ede7,0 2px 12px rgba(13,41,28,0.07)" @click="router.push(opcion.route)">
            <div class="opcion-icon w-[60px] h-[60px] rounded-2xl bg-[#e8f5e9] flex items-center justify-center shrink-0 transition-colors
                        max-[560px]:w-11 max-[560px]:h-11 max-[560px]:rounded-xl">
                <span v-html="opcion.icon" />
            </div>
            <div class="flex flex-col gap-[3px] text-center max-[560px]:text-left">
                <h2 class="text-[0.88rem] font-extrabold text-[#0D291C] leading-tight">{{ opcion.titulo }}</h2>
                <p class="text-[0.75rem] font-semibold text-[#299261]">{{ opcion.sub }}</p>
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
    datasets: [{ label: 'Vencidas', data: vencidasRaw.value, backgroundColor: 'rgba(220,38,38,0.12)', borderColor: '#dc2626', borderWidth: 2, borderRadius: 6, borderSkipped: false }]
}))
const optsVencidas = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleColor: '#f9fafb', bodyColor: '#fca5a5', callbacks: { label: (ctx) => ` ${ctx.parsed.y} vencidas` } } },
    scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } }, y: { grid: { color: '#f9fafb' }, ticks: { color: '#9ca3af', font: { size: 11 } } } }
}

// ── Gráfica 2 ─────────────────────────────────────────────────────
const ingresosRaw = ref([4200000, 5100000, 5800000, 5900000, 6300000, 7200000])
const totalIngresos = computed(() => {
    const total = ingresosRaw.value.reduce((a, b) => a + b, 0)
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total)
})
const ingresosData = computed(() => ({
    labels: sedesLabels.value,
    datasets: [{ label: 'Ingresos', data: ingresosRaw.value, backgroundColor: 'rgba(41,146,97,0.12)', borderColor: '#299261', borderWidth: 2, borderRadius: 6, borderSkipped: false }]
}))
const optsIngresos = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleColor: '#f9fafb', bodyColor: '#86efac', callbacks: { label: (ctx) => ` ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(ctx.parsed.y)}` } } },
    scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } }, y: { grid: { color: '#f9fafb' }, ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => `$${(v / 1000000).toFixed(1)}M` } } }
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

<style scoped>
.card-animation {
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.97)
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1)
    }
}

/* ── Chart card base (box-shadow no soportado en Tailwind sin config) ── */
.chart-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    border: 2px solid transparent;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 12px rgba(13, 41, 28, 0.07);
    transition: border-color 0.18s;
}

.chart-card:hover {
    border-color: #e8f5e9
}

/* ── Hover box-shadow opcion-card ── */
.opcion-card:hover {
    box-shadow: 0 4px 0 #0D291C, 0 2px 16px rgba(13, 41, 28, 0.12) !important;
}

.opcion-card:active {
    box-shadow: 0 1px 0 #0D291C !important;
}

/* ── SVG icono dentro de opcion-card ── */
.opcion-icon :deep(svg) {
    width: 32px;
    height: 32px;
    fill: #0D291C;
    transition: fill 0.18s;
    display: block;
}

.opcion-card:hover .opcion-icon {
    background-color: #0D291C;
}

.opcion-card:hover .opcion-icon :deep(svg) {
    fill: #7FD344;
}

@media (max-width: 560px) {
    .opcion-icon :deep(svg) {
        width: 22px;
        height: 22px
    }
}
</style>