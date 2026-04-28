<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Historial de Pagos" />

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <!-- Sede -->
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
            <!-- Módulo -->
            <div class="flex flex-col gap-1 flex-1 min-w-[140px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Módulo</label>
                <div class="relative">
                    <input v-model="filtros.modulo" type="text" placeholder="Ej: VUPT"
                        class="w-full rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all"
                        @input="onDebounce" />
                    <AppIcon name="category" :size="18"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <!-- N° Factura -->
            <div class="flex flex-col gap-1 flex-1 min-w-[140px] max-[600px]:flex-none max-[600px]:w-full">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">N°
                    Factura</label>
                <div class="relative">
                    <input v-model="filtros.factura" type="text" placeholder="Número..."
                        class="w-full rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all"
                        @input="onDebounce" />
                    <AppIcon name="receipt" :size="18"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <!-- Transacción -->
            <div class="flex flex-col gap-1 flex-1 min-w-[140px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Transacción</label>
                <div class="relative">
                    <input v-model="filtros.transaccion" type="text" placeholder="ID transacción..."
                        class="w-full rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all"
                        @input="onDebounce" />
                    <AppIcon name="tag" :size="18"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <!-- Limpiar -->
            <button v-if="hayFiltros" @click="limpiarFiltros"
                class="self-end px-[18px] py-[10px] text-[0.8rem] font-bold text-gray-500 bg-gray-50 border-[1.5px] border-gray-200 rounded-full cursor-pointer transition-colors whitespace-nowrap hover:border-[#299261] hover:text-[#299261] max-[600px]:w-full max-[600px]:text-center">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="border-collapse min-w-[700px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell">#Pago</th>
                            <th class="th-cell">Sede</th>
                            <th class="th-cell">Fecha</th>
                            <th class="th-cell">Módulo</th>
                            <th class="th-cell">Factura</th>
                            <th class="th-cell">Total</th>
                            <th class="th-cell th-cell--center">Tipo</th>
                            <th class="th-cell th-cell--center">Ver</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="8" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando pagos...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="registros.length === 0">
                            <td colspan="8" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="receipt_long" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium">No se encontraron pagos</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="p in registros" :key="p.IdPago" class="tr-row">
                            <td class="td-cell">
                                <span class="font-mono text-xs text-gray-400">#{{ p.IdPago }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="badge badge--green">
                                    {{ (p.T_Estacionamientos?.Nombre ?? `Sede ${p.IdEstacionamiento}`).trim() }}
                                </span>
                            </td>
                            <td class="td-cell">
                                <span class="text-xs text-gray-600">{{ formatFecha(p.FechaPago) }}</span>
                            </td>
                            <td class="td-cell">
                                <span
                                    class="font-mono text-xs font-bold text-[#0D291C] bg-gray-100 px-2 py-0.5 rounded-full">
                                    {{ p.IdModulo ?? '—' }}
                                </span>
                            </td>
                            <td class="td-cell">
                                <span class="text-sm font-semibold text-gray-700"># {{ p.NumeroFactura ?? '—' }}</span>
                            </td>
                            <td class="td-cell font-bold text-[#0D291C]">
                                {{ formatPrecio(p.Total) }}
                            </td>
                            <td class="td-cell td-cell--center">
                                <div class="flex items-center justify-center gap-1.5 flex-wrap">
                                    <span v-if="p.PagoMensual" class="estado--activo">Mensual</span>
                                    <span v-if="p.Anulada"
                                        class="text-[0.72rem] font-extrabold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                        Anulada
                                    </span>
                                    <span v-if="!p.PagoMensual && !p.Anulada" class="text-gray-400 text-xs">—</span>
                                </div>
                            </td>
                            <td class="td-cell flex justify-center ">
                                <button @click="verDetalle(p)" class="action-btn th-cell--center" title="Ver detalle">
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
        <AsideEditar v-model="asideDetalle" :titulo="`Pago #${activo?.IdPago ?? ''}`"
            :subtitulo="(activo?.T_Estacionamientos?.Nombre ?? '').trim()" label-guardar="Cerrar" :loading="false"
            @guardar="asideDetalle = false">

            <template v-if="activo">

                <!-- Info general -->
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
                                {{ (activo.T_Estacionamientos?.Nombre ?? `Sede ${activo.IdEstacionamiento}`).trim() }}
                            </span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Fecha
                                pago</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatFecha(activo.FechaPago)
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">ID
                                Transacción</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C] font-mono">{{ activo.IdTransaccion
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Módulo</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C] font-mono">{{ activo.IdModulo ?? '—'
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">N°
                                Factura</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.NumeroFactura ?? '—'
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">ID
                                Autorizado</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.IdAutorizado ?? '—'
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Tipo
                                pago</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.IdTipoPago ?? '—' }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Forma
                                pago</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.IdFormaPago?.trim() ?? '—'
                            }}</span>
                        </div>
                        <div
                            class="col-span-2 flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Identificación
                                cliente</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ activo.IdentificacionCliente ?? '—'
                            }}</span>
                        </div>
                    </div>
                </section>

                <!-- Estado -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Estado
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Pago
                                mensual</span>
                            <span v-if="activo.PagoMensual" class="text-[0.82rem] font-black text-[#299261]">● Sí</span>
                            <span v-else class="text-[0.82rem] font-black text-gray-400">● No</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Anulada</span>
                            <span v-if="activo.Anulada" class="text-[0.82rem] font-black text-red-500">● Sí</span>
                            <span v-else class="text-[0.82rem] font-black text-[#299261]">● No</span>
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
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Total</span>
                            <span class="text-[1rem] font-black text-[#0D291C]">{{ formatPrecio(activo.Total) }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Subtotal</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatPrecio(activo.Subtotal)
                            }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">IVA</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatPrecio(activo.Iva) }}</span>
                        </div>
                    </div>
                </section>

            </template>
        </AsideEditar>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FacturaService from '@/api/services/factura.service'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import AppIcon from '@/components/shared/AppIcon.vue'

const loading = ref(false)
const registros = ref([])
const total = ref(0)
const limit = ref(20)
const paginaActual = ref(1)
const sedes = ref([])
const filtros = ref({ sede: '', modulo: '', factura: '', transaccion: '' })
let debounceTimer = null

const asideDetalle = ref(false)
const activo = ref(null)

const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))
const hayFiltros = computed(() => filtros.value.sede || filtros.value.modulo || filtros.value.factura || filtros.value.transaccion)

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

const cargar = async (page = 1) => {
    loading.value = true
    try {
        const res = await FacturaService.GetFacturasAdmin({
            page,
            limit: limit.value,
            IdSede: filtros.value.sede,
            IdModulo: filtros.value.modulo,
            NumeroFactura: filtros.value.factura,
            IdTransaccion: filtros.value.transaccion,
        })
        const d = res?.data
        registros.value = Array.isArray(d?.data) ? d.data : (Array.isArray(d) ? d : [])
        total.value = d?.meta?.total ?? registros.value.length
        paginaActual.value = d?.meta?.page ?? page
    } catch (e) {
        console.error('[HistorialPagos]', e)
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

const onDebounce = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => cargar(1), 400)
}

const limpiarFiltros = () => {
    filtros.value = { sede: '', modulo: '', factura: '', transaccion: '' }
    cargar(1)
}

const verDetalle = (p) => {
    activo.value = p
    asideDetalle.value = true
}

onMounted(() => {
    SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) })
    cargar()
})
</script>

<style scoped>
@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }
}
</style>
