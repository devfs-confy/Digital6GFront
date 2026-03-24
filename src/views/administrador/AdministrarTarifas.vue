<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Tarifas</h2>
            <div class="w-[72px] sm:w-[88px]" />
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
                                    <AppIcon name="attach_money" :size="48" class="text-gray-300" />

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
                                    <AppIcon name="car-side" :size="12" />

                                    {{ String(t.IdTipoVehiculo) === '1' ? 'Carro' : 'Moto' }}
                                </div>
                            </td>

                            <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <div
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200">
                                    <AppIcon name="payment_card" :size="12" />

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

<style>
@media (max-width:780px) {
    .shadow-sm {
        height: auto;
    }

    .maincontainer {
        height: auto;
    }

    .td-cell--sticky {
        min-width: auto;
    }
}
</style>