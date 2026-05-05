<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Historial Cambio de Placas" />

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[200px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Buscar</label>
                <div class="relative">
                    <input v-model="filtros.search" type="text" placeholder="Nombre, documento o placa..."
                        class="w-full rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all"
                        @input="onBusquedaChange" />
                    <AppIcon name="search" :size="20"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[160px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Sede</label>
                <select v-model="filtros.sede" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option value="">Todas las sedes</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                        {{ s.Nombre }}
                    </option>
                </select>
            </div>
            <button v-if="filtros.search || filtros.sede" @click="limpiarFiltros"
                class="self-end px-[18px] py-[10px] text-[0.8rem] font-bold text-gray-500 bg-gray-50 border-[1.5px] border-gray-200 rounded-full cursor-pointer transition-colors whitespace-nowrap hover:border-[#299261] hover:text-[#299261] max-[600px]:w-full max-[600px]:text-center">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="border-collapse min-w-[860px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell">#ID</th>
                            <th class="th-cell">Nombre</th>
                            <th class="th-cell">Documento</th>
                            <th class="th-cell">Sede</th>
                            <th class="th-cell">Placas</th>
                            <th class="th-cell">Aplicación</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell">Fecha</th>
                            <th class="th-cell th-cell--center">Ver</th>
                        </tr>
                    </thead>
                    <tbody>

                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="9" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando historial...</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Vacío -->
                        <tr v-else-if="registrosFiltrados.length === 0">
                            <td colspan="9" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="history" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium text-gray-300">No hay registros de cambio de
                                        placas</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas -->
                        <tr v-else v-for="r in registrosFiltrados" :key="r.IdSolicitud" class="tr-row">

                            <td class="td-cell">
                                <span class="font-mono text-xs text-gray-400">#{{ r.IdSolicitud }}</span>
                            </td>

                            <td class="td-cell font-semibold text-[#0D291C] max-w-[140px]  truncate">
                                {{ r.T_PersonasAutorizadas?.NombreApellidos ?? '—' }}
                            </td>

                            <td class="td-cell">
                                <span class="font-mono text-xs">{{ r.DocumentoUsuario }}</span>
                            </td>

                            <td class="td-cell">
                                <span class="badge badge--green">
                                    {{ r.T_PersonasAutorizadas?.T_Estacionamiento?.Nombre?.trim() ?? '—' }}
                                </span>
                            </td>

                            <td class="td-cell">
                                <div class="flex flex-col gap-1">
                                    <div v-for="(d, i) in r.Detalles" :key="i"
                                        class="flex items-center gap-1.5 text-[0.7rem]">
                                        <span class="font-mono text-gray-400">{{ d.PlacaAnterior ?? '—' }}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#299261"
                                            viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        <span class="font-mono font-bold text-[#0D291C]">{{ d.PlacaNueva ?? '—'
                                        }}</span>
                                    </div>
                                </div>
                            </td>

                            <td class="td-cell">
                                {{ nombreMes(r.MesAplicacion) }} {{ r.AnioAplicacion }}
                            </td>

                            <td class="td-cell">
                                <span v-if="r.Estado === 1" class="estado--activo">● Aplicado</span>
                                <span v-else class="text-amber-500 font-extrabold text-[0.8rem]">● Pendiente</span>
                            </td>

                            <td class="td-cell">
                                <span class="text-xs text-gray-500">{{ formatFecha(r.FechaCreacion) }}</span>
                            </td>

                            <td class="td-cell td-cell--center">
                                <button @click="abrirDetalle(r.IdSolicitud)" class="action-btn" title="Ver detalle">
                                    <AppIcon name="visibility" :size="30" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="filtros.search ? registrosFiltrados.length : total"
                :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- Aside Detalle -->
        <AsideEditar v-model="asideDetalle" titulo="Cambio de Placas" subtitulo="Detalle de la solicitud"
            label-guardar="Cerrar" :loading="loadingDetalle" @guardar="asideDetalle = false">

            <!-- Loading -->
            <div v-if="loadingDetalle" class="flex items-center justify-center py-10">
                <div class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
            </div>

            <template v-else-if="detalle">

                <!-- Persona -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Persona
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <div
                            class="col-span-2 flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Nombre</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{
                                detalle.T_PersonasAutorizadas?.NombreApellidos ?? '—' }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Documento</span>
                            <span class="font-mono text-[0.82rem] font-bold text-[#0D291C]">{{ detalle.DocumentoUsuario
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Sede</span>
                            <span class="text-[0.82rem] font-bold text-[#299261]">{{
                                detalle.T_PersonasAutorizadas?.T_Estacionamiento?.Nombre?.trim() ?? '—' }}</span>
                        </div>
                    </div>
                </section>

                <!-- Autorización -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Autorización
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-1 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Anterior</span>
                            <span class="text-[0.78rem] font-bold text-gray-600">{{
                                detalle.AutorizacionAnterior?.NombreAutorizacion ?? '—' }}</span>
                        </div>
                        <div class="flex flex-col gap-1 bg-[#f0faf4] rounded-xl px-3 py-2.5 border border-[#c8e6c9]">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-[#299261]">Nueva</span>
                            <span class="text-[0.78rem] font-bold text-[#0D291C]">{{
                                detalle.AutorizacionNueva?.NombreAutorizacion ?? '—' }}</span>
                        </div>
                    </div>
                </section>

                <!-- Placas -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Placas cambiadas
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="flex flex-col gap-2">
                        <div v-for="(d, i) in detalle.Detalles" :key="i"
                            class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200">
                            <div class="flex flex-col items-center gap-0.5 flex-1">
                                <span
                                    class="text-[0.58rem] font-black uppercase tracking-wider text-gray-400">Anterior</span>
                                <span class="font-mono text-sm font-bold text-gray-500">{{ d.PlacaAnterior ?? '—'
                                }}</span>
                            </div>
                            <div
                                class="w-8 h-8 rounded-full bg-[#0D291C] flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <div class="flex flex-col items-center gap-0.5 flex-1">
                                <span
                                    class="text-[0.58rem] font-black uppercase tracking-wider text-[#299261]">Nueva</span>
                                <span class="font-mono text-sm font-bold text-[#0D291C]">{{ d.PlacaNueva ?? '—'
                                }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Info -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Info
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-3 gap-2">
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Mes</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ nombreMes(detalle.MesAplicacion)
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Año</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ detalle.AnioAplicacion }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Estado</span>
                            <span v-if="detalle.Estado === 1" class="text-[0.78rem] font-black text-[#299261]">●
                                Aplicado</span>
                            <span v-else class="text-[0.78rem] font-black text-amber-500">● Pendiente</span>
                        </div>
                        <div
                            class="col-span-3 flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Fecha de
                                creación</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatFecha(detalle.FechaCreacion)
                            }}</span>
                        </div>
                    </div>
                </section>

            </template>
        </AsideEditar>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppIcon from '@/components/shared/AppIcon.vue'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import MensualidadesService from '@/api/services/mensualidades.service'
import SedesService from '@/api/services/sedes.service'
import FormDate from '@/utils/formats.date'

// ── Estado ────────────────────────────────────────────────────
const loading = ref(false)
const registros = ref([])
const total = ref(0)
const limit = ref(10)
const paginaActual = ref(1)
const sedes = ref([])

const asideDetalle = ref(false)
const loadingDetalle = ref(false)
const detalle = ref(null)

const filtros = ref({ search: '', sede: '' })
let busquedaTimer = null

// ── Computed ──────────────────────────────────────────────────
const registrosFiltrados = computed(() => {
    const q = filtros.value.search.trim().toLowerCase()
    if (!q) return registros.value
    return registros.value.filter(r => {
        const nombre = (r.T_PersonasAutorizadas?.NombreApellidos ?? '').toLowerCase()
        const documento = (r.DocumentoUsuario ?? '').toLowerCase()
        const placas = (r.Detalles ?? []).flatMap(d => [d.PlacaAnterior, d.PlacaNueva]).join(' ').toLowerCase()
        return nombre.includes(q) || documento.includes(q) || placas.includes(q)
    })
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

// ── Helpers ───────────────────────────────────────────────────
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const nombreMes = (n) => MESES[(n ?? 1) - 1] ?? n
const formatFecha = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// ── Data ──────────────────────────────────────────────────────
const cargarHistorial = async (page = 1) => {
    loading.value = true
    try {
        const res = await MensualidadesService.getHistorialCambioPlacas({
            page,
            limit: 9999,
            sede: filtros.value.sede,
        })
        registros.value = Array.isArray(res?.data) ? res.data : []
        total.value = res?.total ?? registros.value.length
        paginaActual.value = page
    } catch (e) {
        console.error('[HistorialCambioPlacas]', e)
    } finally {
        loading.value = false
    }
}

const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    cargarHistorial(p)
}

const onLimitChange = (val) => {
    limit.value = val
    cargarHistorial(1)
}

const onFiltroChange = () => cargarHistorial(1)

const onBusquedaChange = () => {
    clearTimeout(busquedaTimer)
    busquedaTimer = setTimeout(() => cargarHistorial(1), 400)
}

const limpiarFiltros = () => {
    filtros.value = { search: '', sede: '' }
    cargarHistorial(1)
}

const abrirDetalle = async (id) => {
    detalle.value = null
    asideDetalle.value = true
    loadingDetalle.value = true
    try {
        const res = await MensualidadesService.getDetalleCambioPlacas(id)
        detalle.value = res?.data ?? res
    } catch (e) {
        console.error('[HistorialCambioPlacas] detalle:', e)
    } finally {
        loadingDetalle.value = false
    }
}

onMounted(() => {
    SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) })
    cargarHistorial()
})
</script>

<style scoped>
@media (max-width: 780px) {
    .shadow-sm {
        height: auto;
    }

    .maincontainer {
        height: auto;
    }
}
</style>
