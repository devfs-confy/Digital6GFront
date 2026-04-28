<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Facturación" />

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[200px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Buscar</label>
                <div class="relative">
                    <input v-model="filtros.search" type="text" placeholder="Módulo, prefijo o resolución..."
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
            <div class="flex flex-col gap-1 flex-1 min-w-[140px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Estado</label>
                <select v-model="filtros.estado" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>
            <button v-if="filtros.search || filtros.sede || filtros.estado" @click="limpiarFiltros"
                class="self-end px-[18px] py-[10px] text-[0.8rem] font-bold text-gray-500 bg-gray-50 border-[1.5px] border-gray-200 rounded-full cursor-pointer transition-colors whitespace-nowrap hover:border-[#299261] hover:text-[#299261] max-[600px]:w-full max-[600px]:text-center">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="border-collapse min-w-[920px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell">#ID</th>
                            <th class="th-cell">Módulo</th>
                            <th class="th-cell">Sede</th>
                            <th class="th-cell">Prefijo</th>
                            <th class="th-cell">Resolución</th>
                            <th class="th-cell">Rango facturas</th>
                            <th class="th-cell">Actual</th>
                            <th class="th-cell">Vence</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell th-cell--center">Ver / Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="10" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando facturación...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="registros.length === 0">
                            <td colspan="10" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="receipt_long" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium text-gray-400">No se encontraron registros</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="r in registros" :key="r.IdFacturacion" class="tr-row">
                            <td class="td-cell">
                                <span class="font-mono text-xs text-gray-400">#{{ r.IdFacturacion }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="badge badge--dark">{{ r.IdModulo }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="badge badge--green">{{ nombreSede(r.IdEstacionamiento) }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="font-mono text-xs font-bold text-[#0D291C]">{{ r.Prefijo }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="font-mono text-xs text-gray-600">{{ r.NumeroResolucion }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="text-xs text-gray-600">{{ r.FacturaInicial }} — {{ r.FacturaFinal }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="text-xs font-bold text-[#0D291C]">{{ r.FacturaActual }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="text-xs text-gray-600">{{ r.FechaFinResolucion }}</span>
                            </td>
                            <td class="td-cell">
                                <span v-if="r.Estado" class="estado--activo">● Activo</span>
                                <span v-else class="estado--inactivo">● Inactivo</span>
                            </td>
                            <td class="td-cell td-cell--center">
                                <button @click="abrirDetalle(r)" class="action-btn" title="Ver / Editar">
                                    <AppIcon name="visibility" :size="30" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas" :total-registros="total"
                :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ───── ASIDE: VER + EDITAR ───── -->
        <AsideEditar v-model="asideDetalle" :titulo="`Facturación #${activo?.IdFacturacion ?? ''}`"
            :subtitulo="activo ? `${activo.IdModulo} · ${nombreSede(activo.IdEstacionamiento)}` : ''"
            label-guardar="Guardar cambios" :loading="guardando" :error="errGuardar" @guardar="guardar">

            <div v-if="loadingDetalle" class="flex items-center justify-center py-10 gap-3">
                <div class="w-6 h-6 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                <span class="text-sm text-gray-400 font-semibold">Cargando...</span>
            </div>

            <template v-else-if="activo">

                <!-- Info fija (solo lectura) -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Información general
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">ID</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">#{{ activo.IdFacturacion }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Módulo</span>
                            <span
                                class="text-[0.82rem] font-black text-[#7FD344] bg-[#0D291C] rounded-lg px-2 py-0.5 inline-block w-fit">{{
                                    activo.IdModulo }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Sede</span>
                            <span class="text-[0.82rem] font-bold text-[#299261]">{{
                                nombreSede(activo.IdEstacionamiento) }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Prefijo</span>
                            <span class="text-[0.82rem] font-mono font-bold text-[#0D291C]">{{ activo.Prefijo }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Factura
                                actual</span>
                            <span class="text-[0.82rem] font-bold text-[#299261]">{{ activo.FacturaActual }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Estado</span>
                            <span v-if="activo.Estado" class="text-[0.82rem] font-black text-[#299261]">● Activo</span>
                            <span v-else class="text-[0.82rem] font-black text-red-500">● Inactivo</span>
                        </div>
                    </div>

                    <!-- Barra de progreso -->
                    <div class="bg-white rounded-xl px-3 py-3 border border-gray-200">
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="text-[0.6rem] font-black uppercase tracking-wider text-gray-400">Uso del
                                rango</span>
                            <span class="text-[0.7rem] font-black text-[#299261]">{{ porcentajeUso(activo) }}%</span>
                        </div>
                        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-[#299261] to-[#7FD344] rounded-full transition-all duration-500"
                                :style="{ width: porcentajeUso(activo) + '%' }" />
                        </div>
                    </div>
                </section>

                <!-- Campos editables -->
                <section class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2">
                        Editar resolución y rango
                        <span class="flex-1 h-[1.5px] bg-gradient-to-r from-[#c8e6c9] to-transparent rounded-full" />
                    </p>
                    <div class="flex flex-col gap-3">

                        <div class="flex flex-col gap-[5px]">
                            <label class="field-label">Número de resolución *</label>
                            <input v-model="form.NumeroResolucion" type="text" class="field-input"
                                placeholder="Ej: 18764070868173" />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Factura inicial *</label>
                                <input v-model="form.FacturaInicial" type="number" min="1" class="field-input"
                                    placeholder="1" />
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Factura final *</label>
                                <input v-model="form.FacturaFinal" type="number" min="1" class="field-input"
                                    placeholder="50000" />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Fecha resolución *</label>
                                <input v-model="form.FechaResolucion" type="date" class="field-input" />
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Fecha fin resolución *</label>
                                <input v-model="form.FechaFinResolucion" type="date" class="field-input" />
                            </div>
                        </div>

                    </div>
                </section>

            </template>
        </AsideEditar>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FacturacionService from '@/api/services/facturacion.service'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import AppIcon from '@/components/shared/AppIcon.vue'
import { showSuccess } from '@/utils/swal'

// ── Estado ─────────────────────────────────────────────────────────
const loading = ref(false)
const registros = ref([])
const total = ref(0)
const limit = ref(10)
const paginaActual = ref(1)
const sedes = ref([])
const filtros = ref({ search: '', sede: '', estado: '' })
let busquedaTimer = null

// ── Aside ──────────────────────────────────────────────────────────
const asideDetalle = ref(false)
const activo = ref(null)
const loadingDetalle = ref(false)
const guardando = ref(false)
const errGuardar = ref('')
const form = ref({
    NumeroResolucion: '',
    FacturaInicial: '',
    FacturaFinal: '',
    FechaResolucion: '',
    FechaFinResolucion: '',
})

// ── Computed ───────────────────────────────────────────────────────
const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

// ── Helpers ────────────────────────────────────────────────────────
const nombreSede = (id) => {
    const s = sedes.value.find(s => String(s.IdEstacionamiento) === String(id))
    return s ? s.Nombre : `Sede ${id}`
}

const porcentajeUso = (r) => {
    const ini = Number(r.FacturaInicial) || 0
    const fin = Number(r.FacturaFinal) || 1
    const act = Number(r.FacturaActual) || ini
    return Math.min(100, Math.max(0, Math.round(((act - ini) / (fin - ini)) * 100)))
}

// "DD-MM-YYYY" → "YYYY-MM-DD" para input[type=date]
const toInputDate = (str) => {
    if (!str) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str
    const p = str.split('-')
    if (p.length === 3 && p[0].length === 2) return `${p[2]}-${p[1]}-${p[0]}`
    return str
}

// "YYYY-MM-DD" → "DD-MM-YYYY" para la API
const toApiDate = (str) => {
    if (!str) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const [y, m, d] = str.split('-')
        return `${d}-${m}-${y}`
    }
    return str
}

// ── Carga ──────────────────────────────────────────────────────────
const cargar = async (page = 1) => {
    loading.value = true
    try {
        const res = await FacturacionService.getAll({
            page,
            limit: limit.value,
            search: filtros.value.search,
            IdEstacionamiento: filtros.value.sede,
        })
        const dataRaw = res?.data ?? res
        if (Array.isArray(dataRaw)) {
            registros.value = dataRaw
            total.value = res?.total ?? dataRaw.length
            paginaActual.value = res?.page ?? page
        } else if (dataRaw && typeof dataRaw === 'object') {
            registros.value = [dataRaw]
            total.value = 1
            paginaActual.value = 1
        } else {
            registros.value = []
            total.value = 0
        }
        if (filtros.value.estado !== '') {
            const esActivo = filtros.value.estado === 'true'
            registros.value = registros.value.filter(r => r.Estado === esActivo)
        }
    } catch (e) {
        console.error('[Facturacion]', e)
        registros.value = []
    } finally {
        loading.value = false
    }
}

const irPagina = (p) => { if (p >= 1 && p <= totalPaginas.value) cargar(p) }
const onLimitChange = (val) => { limit.value = val; cargar(1) }
const onFiltroChange = () => cargar(1)
const onBusquedaChange = () => {
    clearTimeout(busquedaTimer)
    busquedaTimer = setTimeout(() => cargar(1), 400)
}
const limpiarFiltros = () => { filtros.value = { search: '', sede: '', estado: '' }; cargar(1) }

onMounted(() => {
    SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) })
    cargar()
})

// ── Abrir aside ────────────────────────────────────────────────────
const abrirDetalle = async (r) => {
    activo.value = r
    errGuardar.value = ''
    asideDetalle.value = true
    loadingDetalle.value = true
    try {
        const res = await FacturacionService.getById(r.IdFacturacion)
        activo.value = res?.data ?? res
    } catch (e) {
        console.error('[Facturacion detalle]', e)
    } finally {
        loadingDetalle.value = false
        if (activo.value) {
            form.value = {
                NumeroResolucion: activo.value.NumeroResolucion ?? '',
                FacturaInicial: activo.value.FacturaInicial ?? '',
                FacturaFinal: activo.value.FacturaFinal ?? '',
                FechaResolucion: toInputDate(activo.value.FechaResolucion),
                FechaFinResolucion: toInputDate(activo.value.FechaFinResolucion),
            }
        }
    }
}

// ── Guardar ────────────────────────────────────────────────────────
const guardar = async () => {
    errGuardar.value = ''
    const f = form.value
    if (!f.NumeroResolucion.trim()) { errGuardar.value = 'El número de resolución es obligatorio.'; return }
    if (!f.FacturaInicial || !f.FacturaFinal) { errGuardar.value = 'El rango de facturas es obligatorio.'; return }
    if (Number(f.FacturaInicial) >= Number(f.FacturaFinal)) { errGuardar.value = 'Factura inicial debe ser menor que la final.'; return }
    if (!f.FechaResolucion || !f.FechaFinResolucion) { errGuardar.value = 'Las fechas son obligatorias.'; return }

    guardando.value = true
    try {
        const dto = {
            NumeroResolucion: f.NumeroResolucion.trim(),
            FacturaInicial: String(f.FacturaInicial),
            FacturaFinal: String(f.FacturaFinal),
            FechaResolucion: toApiDate(f.FechaResolucion),
            FechaFinResolucion: toApiDate(f.FechaFinResolucion),
        }
        const res = await FacturacionService.update(activo.value.IdFacturacion, dto)
        const esError = res?.error === true || res?.success === false || (res?.statusCode ?? 0) >= 400
        if (esError) {
            const msg = res?.data?.message ?? res?.message ?? 'Error al actualizar.'
            errGuardar.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }
        asideDetalle.value = false
        await cargar(paginaActual.value)
        showSuccess('¡Actualizado!', 'La facturación fue actualizada correctamente.')
    } catch (e) {
        const msg = e?.response?.data?.message
        errGuardar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al actualizar.')
    } finally {
        guardando.value = false
    }
}
</script>

<style scoped>
.field-label {
    font-size: 0.63rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.6;
}

.field-input {
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
    font-family: inherit;
}

.field-input:focus {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15);
}

@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
