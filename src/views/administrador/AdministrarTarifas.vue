<template>
    <div class="h-full flex flex-col gap-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-4">
            <div class="w-20"></div>
            <h2 class="text-2xl font-bold text-[#232B3A]">Tarifas</h2>
            <button @click="$router.back()"
                class="flex items-center gap-2 bg-[#7FD344] text-[#232B3A] text-sm font-semibold px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                Volver
            </button>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">



            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Sede</label>
                <select v-model="filtros.idSede" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option :value="null">Todas</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                        {{ s.Nombre }}
                    </option>
                </select>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Vehículo</label>
                <select v-model="filtros.idTipoVehiculo" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option :value="null">Todos</option>
                    <option v-for="t in catTiposVehiculo" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                </select>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Tipo
                    pago</label>
                <select v-model="filtros.idTipoPago" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option :value="null">Todos</option>
                    <option v-for="t in catTiposPago" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                </select>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Autorización</label>
                <select v-model="filtros.idAutorizacion" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option :value="null">Todas</option>
                    <option v-for="a in catAutorizacionesFiltradas" :key="a.id" :value="a.id">
                        {{ a.nombre }}
                    </option>
                </select>
            </div>

            <button v-if="hayFiltros" @click="limpiarFiltros"
                class="self-end px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-50 border-[1.5px] border-gray-200 rounded-full hover:border-[#299261] hover:text-[#299261] transition-all whitespace-nowrap">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto flex-1 table-scroll-wrapper">
                <table class="border-collapse min-w-[760px] w-full">
                    <thead>
                        <tr>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] sticky left-0 z-10 shadow-[3px_0_8px_rgba(0,0,0,0.12)]">
                                #</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Sede</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Vehículo</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Tipo pago</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Autorización</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Valor</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Estado</th>
                        </tr>
                    </thead>
                    <tbody>

                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="7" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin">
                                    </div>
                                    <span class="text-sm font-medium text-gray-400">Cargando tarifas...</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Vacío -->
                        <tr v-else-if="tarifas.length === 0">
                            <td colspan="7" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron tarifas</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas -->
                        <tr v-else v-for="t in tarifas" :key="t.IdTarifa"
                            class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors group">

                            <td
                                class="px-5 py-3 font-mono font-bold text-sm text-[#0D291C] sticky left-0 bg-white group-hover:bg-[#f0faf4] shadow-[3px_0_8px_rgba(0,0,0,0.07)] transition-colors">
                                {{ t.IdTarifa }}
                            </td>

                            <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                                    {{sedes.find(s => String(s.IdEstacionamiento) ===
                                        String(t.IdEstacionamiento))?.Nombre ?? `Sede ${t.IdEstacionamiento}`}}
                                </span>
                            </td>

                            <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <div
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                    </svg>
                                    {{ String(t.IdTipoVehiculo) === '1' ? 'Carro' : 'Moto' }}
                                </div>
                            </td>

                            <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <div
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                    </svg>
                                    {{ t.TipoCobro }}
                                </div>
                            </td>

                            <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-violet-50 text-violet-800 border border-violet-200">
                                    {{ t.T_Autorizacion?.NombreAutorizacion ?? '—' }}
                                </span>
                            </td>

                            <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[0.78rem] font-black bg-[#0D291C] text-[#7FD344] tracking-wide">
                                    ${{ Number(t.Valor).toLocaleString('es-CO') }}
                                </span>
                            </td>

                            <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <span v-if="t.Estado" class="text-[#299261] font-extrabold text-[0.8rem]">●
                                    Activo</span>
                                <span v-else class="text-red-600 font-extrabold text-[0.8rem]">● Inactivo</span>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <!-- Paginación -->
            <TablePagination :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import TarifasService from '@/api/services/tarifas.service'
import SedesService from '@/api/services/sedes.service'
import TablePagination from '@/components/shared/Paginacion.vue'

const tarifas = ref([])
const todasLasTarifas = ref([])
const loading = ref(true)
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)
const sedes = ref([])

const catTiposVehiculo = ref([])
const catTiposPago = ref([])
const catAutorizaciones = ref([])

const filtros = reactive({
    idSede: null,
    idTipoVehiculo: null,
    idTipoPago: null,
    idAutorizacion: null,
})

const hayFiltros = computed(() =>
    filtros.idSede || filtros.idTipoVehiculo ||
    filtros.idTipoPago || filtros.idAutorizacion
)

const catAutorizacionesFiltradas = computed(() => {
    if (!filtros.idSede) return catAutorizaciones.value
    const authMap = new Map()
    todasLasTarifas.value
        .filter(t => String(t.IdEstacionamiento) === String(filtros.idSede))
        .forEach(t => {
            if (t.IdAutorizacion && !authMap.has(t.IdAutorizacion)) {
                authMap.set(t.IdAutorizacion, {
                    id: t.IdAutorizacion,
                    nombre: t.T_Autorizacion?.NombreAutorizacion ?? `Auth ${t.IdAutorizacion}`,
                })
            }
        })
    return [...authMap.values()]
})

watch(() => filtros.idSede, () => {
    const sigueExistiendo = catAutorizacionesFiltradas.value
        .some(a => String(a.id) === String(filtros.idAutorizacion))
    if (!sigueExistiendo) filtros.idAutorizacion = null
    paginaActual.value = 1
    cargarTarifas()
})

// Carga TODOS los registros una sola vez para poblar catálogos
const cargarCatalogos = async () => {
    try {
        const res = await TarifasService.getAll({ limit: 500 })
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])
        todasLasTarifas.value = data

        const vehiculosMap = new Map()
        const pagosMap = new Map()
        const authMap = new Map()

        data.forEach(t => {
            if (!vehiculosMap.has(t.IdTipoVehiculo))
                vehiculosMap.set(t.IdTipoVehiculo, {
                    id: t.IdTipoVehiculo,
                    nombre: String(t.IdTipoVehiculo) === '1' ? 'Carro' : 'Moto',
                })

            if (!pagosMap.has(t.IdTipoPago))
                pagosMap.set(t.IdTipoPago, {
                    id: t.IdTipoPago,
                    nombre: t.TipoCobro,
                })

            if (t.IdAutorizacion && !authMap.has(t.IdAutorizacion))
                authMap.set(t.IdAutorizacion, {
                    id: t.IdAutorizacion,
                    nombre: t.T_Autorizacion?.NombreAutorizacion ?? `Auth ${t.IdAutorizacion}`,
                })
        })

        catTiposVehiculo.value = [...vehiculosMap.values()]
        catTiposPago.value = [...pagosMap.values()]
        catAutorizaciones.value = [...authMap.values()]
    } catch (e) {
        console.error('[cargarCatalogos]', e.response?.data ?? e.message)
    }
}

const cargarTarifas = async () => {
    loading.value = true
    try {
        const params = { page: paginaActual.value, limit: limit.value }
        if (filtros.idSede) params.idSede = filtros.idSede
        if (filtros.idTipoVehiculo) params.idTipoVehiculo = filtros.idTipoVehiculo
        if (filtros.idTipoPago) params.idTipoPago = filtros.idTipoPago
        if (filtros.idAutorizacion) params.idAutorizacion = filtros.idAutorizacion

        const res = await TarifasService.getAll(params)
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])

        tarifas.value = data
        totalRegistros.value = res.total ?? res.count ?? data.length
        totalPaginas.value = res.totalPages ?? res.pages ??
            Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        console.error('[Tarifas]', e.response?.data ?? e.message)
        tarifas.value = []
    } finally {
        loading.value = false
    }
}

let debTimer = null
const onFiltroChange = () => {
    clearTimeout(debTimer)
    debTimer = setTimeout(() => {
        paginaActual.value = 1
        cargarTarifas()
    }, 350)
}

const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    paginaActual.value = p
    cargarTarifas()
}

const onLimitChange = (val) => {
    limit.value = val
    paginaActual.value = 1
    cargarTarifas()
}

const limpiarFiltros = () => {
    Object.assign(filtros, { idSede: null, idTipoVehiculo: null, idTipoPago: null, idAutorizacion: null })
    paginaActual.value = 1
    cargarTarifas()
}

onMounted(() => {
    Promise.all([
        cargarCatalogos(),
        cargarTarifas(),
        SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) }),
    ])
})
</script>