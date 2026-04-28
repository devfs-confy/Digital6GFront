<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Consignaciones">
            <template #right>
                <button @click="abrirGenerar"
                    class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                    style="box-shadow: #595858 0px 2px 0">
                    <AppIcon name="add" :size="14" />
                    <span class="hidden sm:inline">Generar</span>
                </button>
            </template>
        </AdminPageHeader>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[200px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Buscar</label>
                <div class="relative">
                    <input v-model="filtros.search" type="text" placeholder="Buscar consignación..."
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
                <table class="border-collapse min-w-[640px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell">#ID</th>
                            <th class="th-cell">Sede</th>
                            <th class="th-cell">Cant Facturas</th>
                            <th class="th-cell">Fecha</th>
                            <th class="th-cell">Valor</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell th-cell--center">Ver</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="py-20">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando consignaciones...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="registros.length === 0">
                            <td colspan="6" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="receipt_long" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium">No se encontraron consignaciones</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="c in registros" :key="c.IdConsignacion" class="tr-row">
                            <td class="td-cell">
                                <span class="font-mono text-xs text-gray-400">#{{ c.IdConsignacion }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="badge badge--green">
                                    {{ c.T_Estacionamientos?.Nombre ?? `Sede ${c.IdEstacionamiento}` }}
                                </span>
                            </td>
                            <td class="td-cell">
                                <span class="text-xs text-gray-600">{{ c.Cantidad }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="text-xs text-gray-600">{{ formatFecha(c.FechaConsignacion) }}</span>
                            </td>
                            <td class="td-cell font-bold text-[#0D291C]">
                                {{ formatPrecio(c.Valor) }}
                            </td>
                            <td class="td-cell">
                                <span v-if="c.Sincronizacion === true" class="estado--activo">● Sincronizada</span>
                                <span v-else class="text-amber-500 font-extrabold text-[0.8rem]">● Pendiente</span>
                            </td>
                            <td class="td-cell flex justify-center">
                                <button @click="verDetalle(c)" class="action-btn" title="Ver detalle">
                                    <AppIcon name="visibility" :size="30" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas" :total-registros="total"
                :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ───── ASIDE: DETALLE ───── -->
        <AsideEditar v-model="asideDetalle" :titulo="`Consignación #${activo?.IdConsignacion ?? ''}`"
            :subtitulo="activo?.T_Estacionamientos?.Nombre ?? ''" label-guardar="Cerrar" :loading="loadingDetalle"
            @guardar="asideDetalle = false">

            <div v-if="loadingDetalle" class="flex items-center justify-center py-10 gap-3">
                <div class="w-6 h-6 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                <span class="text-sm text-gray-400 font-semibold">Cargando...</span>
            </div>

            <template v-else-if="activo">

                <!-- Sede + Fecha -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Info general
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <div
                            class="col-span-2 flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Sede</span>
                            <span class="text-[0.82rem] font-bold text-[#299261]">
                                {{ activo.T_Estacionamientos?.Nombre ?? `Sede ${activo.IdEstacionamiento}` }}
                            </span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Fecha</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{
                                formatFecha(activo.FechaConsignacion) }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Estado</span>
                            <span v-if="activo.Sincronizacion === true"
                                class="text-[0.82rem] font-black text-[#299261]">● Sincronizada</span>
                            <span v-else class="text-[0.82rem] font-black text-amber-500">● Pendiente</span>
                        </div>
                        <div v-if="activo.Referencia"
                            class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Referencia</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C] uppercase">{{ activo.Referencia
                                }}</span>
                        </div>
                        <div v-if="activo.DocumentoUsuario"
                            class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Documento</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.DocumentoUsuario }}</span>
                        </div>
                        <div v-if="activo.IdTipoDeposito"
                            class="col-span-2 flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Tipo
                                depósito</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">#{{ activo.IdTipoDeposito }}</span>
                        </div>
                    </div>
                </section>

                <!-- Valores -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Valores
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <div
                            class="col-span-2 flex flex-col gap-0.5 bg-[#f0faf4] rounded-xl px-3 py-3 border-2 border-[#c8e6c9]">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Valor
                                total</span>
                            <span class="text-[1rem] font-black text-[#0D291C]">{{ formatPrecio(activo.Valor) }}</span>
                        </div>
                        <div v-if="activo.ValorEfectivo != null"
                            class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Efectivo</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatPrecio(activo.ValorEfectivo)
                                }}</span>
                        </div>
                        <div v-if="activo.ValorDatafono != null"
                            class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Datáfono</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatPrecio(activo.ValorDatafono)
                                }}</span>
                        </div>
                        <div v-if="activo.Producido != null"
                            class="col-span-2 flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Producido</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatPrecio(activo.Producido)
                                }}</span>
                        </div>
                    </div>
                </section>

                <!-- Transacciones -->
                <div v-if="activo.CantTransacciones != null"
                    class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <AppIcon name="receipt_long" :size="28" class="text-[#299261] flex-shrink-0" />
                    <div class="flex flex-col">
                        <span class="text-[1.1rem] font-black text-[#0D291C]">{{ activo.CantTransacciones }}</span>
                        <span class="text-[0.65rem] font-semibold text-gray-400">transacciones registradas</span>
                    </div>
                </div>

                <!-- Extra -->
                <section v-if="activo.Tipo || activo.IdModulo" class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Información adicional
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <div v-if="activo.Tipo"
                            class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Tipo</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.Tipo }}</span>
                        </div>
                        <div v-if="activo.IdModulo"
                            class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Módulo</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.IdModulo }}</span>
                        </div>
                    </div>
                </section>

            </template>
        </AsideEditar>

        <!-- ───── MODAL: GENERAR ───── -->
        <Transition name="modal">
            <div v-if="modalGenerar"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalGenerar = false">
                <div class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[380px] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344]">
                                <AppIcon name="calendar_add_on" :size="20" />
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">Generar
                                    consignación</p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    Selecciona la fecha</p>
                            </div>
                        </div>
                        <button @click="modalGenerar = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="px-6 py-5 flex flex-col gap-4">
                        <div class="flex flex-col gap-[5px]">
                            <label
                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60">Fecha
                                *</label>
                            <input v-model="fechaGenerar" type="date" class="aside-field-input" :max="ayerISO" />
                            <p class="text-[0.68rem] font-semibold text-gray-400 pl-1">
                                Se generarán las consignaciones de todas las sedes para esta fecha si tienen
                                movimientos.
                            </p>
                        </div>
                        <div v-if="errGenerar"
                            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                            ⚠ {{ errGenerar }}
                        </div>
                        <div v-if="msgGenerar"
                            class="flex items-center gap-2 px-3 py-2.5 bg-[#f0faf4] border border-[#c8e6c9] rounded-xl text-[0.76rem] font-bold text-[#299261]">
                            ✓ {{ msgGenerar }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                        <button @click="modalGenerar = false" class="btn-cancel">Cancelar</button>
                        <button @click="generarConsignacion" :disabled="!fechaGenerar || generando" class="btn-confirm">
                            <span v-if="generando"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                            {{ generando ? 'Generando...' : 'Generar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ConsignacionesService from '@/api/services/consignaciones.service'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import AppIcon from '@/components/shared/AppIcon.vue'
import { showSuccess, showError } from '@/utils/swal'

// ── Estado ─────────────────────────────────────────────────────────
const loading = ref(false)
const registros = ref([])
const total = ref(0)
const limit = ref(10)
const paginaActual = ref(1)
const sedes = ref([])
const filtros = ref({ search: '', sede: '' })
let busquedaTimer = null

// ── Aside detalle ──────────────────────────────────────────────────
const asideDetalle = ref(false)
const activo = ref(null)
const loadingDetalle = ref(false)

// ── Modal generar ──────────────────────────────────────────────────
const modalGenerar = ref(false)
const fechaGenerar = ref('')
const generando = ref(false)
const errGenerar = ref('')
const msgGenerar = ref('')

const hoy = new Date()
const ayerISO = new Date(hoy - 86400000).toISOString().slice(0, 10)

// ── Computed ───────────────────────────────────────────────────────
const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

// ── Helpers ────────────────────────────────────────────────────────
const formatFecha = (f) => {
    if (!f) return '—'
    const d = new Date(f)
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

const formatPrecio = (v) =>
    (!v && v !== 0) ? '—' : new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(v)

// ── Carga ──────────────────────────────────────────────────────────
const cargar = async (page = 1) => {
    loading.value = true
    try {
        const res = await ConsignacionesService.getAllArqueos({
            page,
            limit: limit.value,
            search: filtros.value.search,
            IdEstacionamiento: filtros.value.sede,
        })
        registros.value = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        total.value = res?.total ?? registros.value.length
        paginaActual.value = res?.page ?? page


    } catch (e) {
        console.error('[Consignaciones]', e)
        registros.value = []
    } finally {
        loading.value = false
    }
}


const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    cargar(p)
}

const onLimitChange = (val) => {
    limit.value = val
    cargar(1)
}

const onFiltroChange = () => cargar(1)

const onBusquedaChange = () => {
    clearTimeout(busquedaTimer)
    busquedaTimer = setTimeout(() => cargar(1), 400)
}

const limpiarFiltros = () => {
    filtros.value = { search: '', sede: '' }
    cargar(1)
}

onMounted(() => {
    SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) })
    cargar()
})

// ── Ver detalle ────────────────────────────────────────────────────
const verDetalle = async (c) => {
    activo.value = c
    asideDetalle.value = true
    loadingDetalle.value = true
    try {
        const id = c.IdConsignacion ?? c.id
        const res = await ConsignacionesService.getById(id)
        activo.value = res?.data ?? res
    } catch (e) {
        console.error('[Consignación detalle]', e)
    } finally {
        loadingDetalle.value = false
    }
}

// ── Generar ────────────────────────────────────────────────────────
const abrirGenerar = () => {
    fechaGenerar.value = ayerISO
    errGenerar.value = ''
    msgGenerar.value = ''
    modalGenerar.value = true
}

const generarConsignacion = async () => {
    if (!fechaGenerar.value) { errGenerar.value = 'Selecciona una fecha.'; return }
    errGenerar.value = ''
    msgGenerar.value = ''
    generando.value = true
    try {
        const res = await ConsignacionesService.generarConsignaciones(fechaGenerar.value)
        if (res?.error || res?.success === false) {
            errGenerar.value = res?.message ?? 'Error al generar las consignaciones.'
            return
        }
        modalGenerar.value = false
        await cargar(1)
        showSuccess('¡Consignaciones generadas!', `Proceso finalizado para ${fechaGenerar.value}.`)
    } catch (e) {
        errGenerar.value = e?.response?.data?.message ?? 'Error al generar las consignaciones.'
    } finally {
        generando.value = false
    }
}
</script>

<style scoped>
.aside-field-input {
    border: 2px solid #d1d5db;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.88rem;
    color: #0D291C;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.aside-field-input:focus {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15);
}

.btn-cancel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    font-family: inherit;
    background: rgba(13, 41, 28, 0.12);
    color: #0D291C;
    border: 2.5px solid rgba(13, 41, 28, 0.25);
    box-shadow: 0 4px 0 rgba(13, 41, 28, 0.2);
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
}

.btn-cancel:hover {
    background: rgba(13, 41, 28, 0.2);
}

.btn-cancel:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 rgba(13, 41, 28, 0.2);
}

.btn-confirm {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    font-family: inherit;
    background: #0D291C;
    color: #7FD344;
    border: 2.5px solid #0D291C;
    box-shadow: 0 4px 0 #050e09;
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
}

.btn-confirm:hover:not(:disabled) {
    background: #1a4a2e;
}

.btn-confirm:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #050e09;
}

.btn-confirm:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
    transform: scale(0.93) translateY(12px);
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
    transition: transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
}

@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }
}
</style>
