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
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Mis PQRS</h2>
            <button @click="abrirNuevaPqrs"
                class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline">Nueva</span>
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="border-collapse min-w-[700px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell">Radicado</th>
                            <th class="th-cell">Motivo</th>
                            <th class="th-cell">Descripción</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell">Fecha</th>
                            <th class="th-cell text-center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="text-center py-20">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando PQRS...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="listaPqrs.length === 0">
                            <td colspan="6" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                                    </svg>
                                    <span class="text-sm font-medium">No tienes PQRS registradas</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="pqrs in listaPqrs" :key="pqrs.id"
                            class="border-b border-[#e8f5e9] last:border-b-0 transition-colors duration-150 hover:bg-[#f0faf4] group">
                            <td class="td-cell font-mono tracking-wide text-[0.8rem]">#{{ pqrs.id }}</td>
                            <td class="td-cell">
                                <span
                                    class="inline-block px-[10px] py-[3px] rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                                    {{ pqrs.motivo?.nombre ?? pqrs.motivo ?? '—' }}
                                </span>
                            </td>
                            <td class="td-cell max-w-[220px]">
                                <span class="block truncate text-[0.82rem] text-gray-600">{{ pqrs.descripcion ?? '—'
                                }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="inline-flex items-center gap-1 text-[0.8rem] font-extrabold" :class="{
                                    'text-[#299261]': pqrs.estado === 'respondida' || pqrs.estado === 'cerrada',
                                    'text-amber-500': pqrs.estado === 'en_proceso' || pqrs.estado === 'pendiente',
                                    'text-gray-400': !pqrs.estado,
                                }">● {{ estadoLabel(pqrs.estado) }}</span>
                            </td>
                            <td class="td-cell text-[0.82rem] text-gray-500">{{ formatFecha(pqrs.createdAt) }}</td>
                            <td class="td-cell text-center">
                                <button @click="abrirDetalle(pqrs)"
                                    class="w-8 h-8 rounded-[10px] flex items-center justify-center border-none cursor-pointer bg-transparent text-gray-400 hover:bg-[#e8f5e9] hover:text-[#299261] transition-all mx-auto"
                                    title="Ver detalle">
                                    <AppIcon name="visibility" :size="20" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ───── MODAL: NUEVA PQRS ───── -->
        <Transition name="pqrs-modal">
            <div v-if="modalNuevo" class="pqrs-overlay" @click.self="modalNuevo = false">
                <div class="pqrs-card">

                    <!-- Head -->
                    <div class="pqrs-head">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="pqrs-head-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="pqrs-head-title">Nueva PQRS</p>
                                <p class="pqrs-head-sub">Completa los datos de tu solicitud</p>
                            </div>
                        </div>
                        <button @click="modalNuevo = false" class="pqrs-close-btn">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="pqrs-body">

                        <p class="pqrs-section-title">Información de la solicitud</p>

                        <!-- Tipo + Motivo -->
                        <div class="pqrs-grid-2">
                            <div class="pqrs-field">
                                <label class="pqrs-label">Tipo *</label>
                                <select v-model="fN.Tipo" class="pqrs-input">
                                    <option value="">Seleccionar tipo</option>
                                    <option value="PETICION">Petición</option>
                                    <option value="QUEJA">Queja</option>
                                    <option value="RECLAMO">Reclamo</option>
                                    <option value="SUGERENCIA">Sugerencia</option>
                                </select>
                            </div>
                            <div class="pqrs-field">
                                <label class="pqrs-label">Motivo *</label>
                                <div v-if="loadingMotivos" class="pqrs-loading-select">
                                    <div class="pqrs-spinner" />
                                    <span>Cargando...</span>
                                </div>
                                <select v-else v-model="fN.IdMotivo" class="pqrs-input">
                                    <option value="">Seleccionar motivo</option>
                                    <option v-for="m in motivos" :key="m.IdMotivo" :value="m.IdMotivo">{{ m.Nombre }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Asunto -->
                        <div class="pqrs-field">
                            <div class="pqrs-field-header">
                                <label class="pqrs-label">Asunto *</label>
                                <span class="pqrs-counter">{{ fN.Asunto.length }}/50</span>
                            </div>
                            <input v-model="fN.Asunto" type="text" class="pqrs-input"
                                placeholder="Ej: Problema con el acceso al parqueadero" maxlength="50" />
                        </div>

                        <!-- Descripción -->
                        <div class="pqrs-field">
                            <div class="pqrs-field-header">
                                <label class="pqrs-label">Descripción *</label>
                                <span class="pqrs-counter">{{ fN.Descripcion.length }}/250</span>
                            </div>
                            <textarea v-model="fN.Descripcion" class="pqrs-input pqrs-textarea"
                                placeholder="Describe con detalle tu petición, queja, reclamo o sugerencia..." rows="3"
                                maxlength="250" />
                        </div>

                        <p class="pqrs-section-title" style="margin-top: 4px">Datos de contacto</p>

                        <!-- Contacto grid -->
                        <div class="pqrs-grid-2">
                            <div class="pqrs-field">
                                <label class="pqrs-label">Nombre</label>
                                <input v-model="fN.NombreCliente" type="text" class="pqrs-input pqrs-input--readonly"
                                    readonly />
                            </div>
                            <div class="pqrs-field">
                                <label class="pqrs-label">Teléfono *</label>
                                <input v-model="fN.Telefono" type="text" class="pqrs-input" placeholder="3001234567"
                                    maxlength="10" @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" />
                            </div>
                            <div class="pqrs-field pqrs-field--full">
                                <label class="pqrs-label">Correo electrónico *</label>
                                <input v-model="fN.Email" type="email" class="pqrs-input"
                                    placeholder="correo@ejemplo.com" maxlength="250" />
                            </div>
                        </div>

                        <!-- Error -->
                        <div v-if="errNuevo" class="pqrs-error">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24" style="flex-shrink:0">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            {{ errNuevo }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="pqrs-foot">
                        <button @click="modalNuevo = false" class="pqrs-btn pqrs-btn--cancel">Cancelar</button>
                        <button @click="crearPqrs" :disabled="guardando" class="pqrs-btn pqrs-btn--confirm">
                            <span v-if="guardando" class="pqrs-btn-spinner" />
                            {{ guardando ? 'Enviando...' : 'Enviar PQRS' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ───── MODAL: DETALLE PQRS ───── -->
        <Transition name="pqrs-modal">
            <div v-if="modalDetalle" class="pqrs-overlay" @click.self="modalDetalle = false">
                <div class="pqrs-card pqrs-card--white">

                    <!-- Head -->
                    <div class="pqrs-head pqrs-head--light">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="pqrs-head-icon pqrs-head-icon--dark">
                                #{{ pqrsAccion?.id }}
                            </div>
                            <div>
                                <p class="pqrs-head-title pqrs-head-title--dark">
                                    {{ pqrsAccion?.motivo?.nombre ?? pqrsAccion?.motivo ?? 'PQRS' }}
                                </p>
                                <p class="pqrs-head-sub pqrs-head-sub--gray">{{ formatFecha(pqrsAccion?.createdAt) }}
                                </p>
                            </div>
                        </div>
                        <button @click="modalDetalle = false" class="pqrs-close-btn pqrs-close-btn--light">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="pqrs-body pqrs-body--white">
                        <div v-if="loadingDetalle" class="flex flex-col items-center gap-3 py-10">
                            <div
                                class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                            <span class="text-sm font-medium text-gray-400">Cargando detalle...</span>
                        </div>
                        <template v-else-if="detalleActivo">
                            <!-- Estado -->
                            <div class="pqrs-estado-row">
                                <span class="pqrs-detail-label">Estado</span>
                                <span class="pqrs-estado-val" :class="{
                                    'pqrs-estado-val--green': detalleActivo.estado === 'respondida' || detalleActivo.estado === 'cerrada',
                                    'pqrs-estado-val--amber': detalleActivo.estado === 'en_proceso' || detalleActivo.estado === 'pendiente',
                                    'pqrs-estado-val--gray': !detalleActivo.estado,
                                }">● {{ estadoLabel(detalleActivo.estado) }}</span>
                            </div>
                            <!-- Solicitud -->
                            <div class="pqrs-detail-section">
                                <p class="pqrs-section-title pqrs-section-title--light">Tu solicitud</p>
                                <p class="pqrs-detail-text">{{ detalleActivo.descripcion ?? '—' }}</p>
                            </div>
                            <!-- Respuesta -->
                            <div class="pqrs-detail-section">
                                <p class="pqrs-section-title pqrs-section-title--light">Respuesta</p>
                                <div v-if="detalleActivo.respuesta" class="pqrs-respuesta">{{ detalleActivo.respuesta }}
                                </div>
                                <div v-else class="pqrs-sin-respuesta">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#f59e0b"
                                        viewBox="0 0 24 24" style="flex-shrink:0">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <span>Aún no hay respuesta para esta solicitud.</span>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Foot -->
                    <div class="pqrs-foot pqrs-foot--light">
                        <button @click="modalDetalle = false" class="pqrs-btn pqrs-btn--confirm"
                            style="flex:1">Cerrar</button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import PqrsService from '@/api/services/pqrs.service'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import { useAuthStore } from '@/stores/auth'

const pqrsList = ref([])
const motivos = ref([])
const loading = ref(true)
const loadingMotivos = ref(false)
const loadingDetalle = ref(false)
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)
const authStore = useAuthStore()

const modalNuevo = ref(false)
const modalDetalle = ref(false)
const pqrsAccion = ref(null)
const detalleActivo = ref(null)
const guardando = ref(false)
const errNuevo = ref('')

const fN = reactive({
    IdMotivo: '', Tipo: '', Asunto: '', Descripcion: '',
    NombreCliente: '', Telefono: '', Email: '', IdPersonaAutorizada: null,
})

const listaPqrs = computed(() =>
    Array.isArray(pqrsList.value) ? pqrsList.value : (pqrsList.value?.data ?? [])
)

const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const estadoLabel = (estado) => {
    const map = { pendiente: 'Pendiente', en_proceso: 'En proceso', respondida: 'Respondida', cerrada: 'Cerrada' }
    return map[estado] ?? estado ?? '—'
}

const cargarPqrs = async () => {
    loading.value = true
    try {
        const res = await PqrsService.getMisPqrs({ page: paginaActual.value, limit: limit.value })
        if (res?.error || res?.status >= 400) { pqrsList.value = []; return }
        const datos = Array.isArray(res) ? res : (res?.data ?? [])
        pqrsList.value = datos
        totalRegistros.value = res?.total ?? res?.count ?? datos.length
        totalPaginas.value = res?.totalPages ?? res?.pages ?? Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        pqrsList.value = []
    } finally {
        loading.value = false
    }
}

const cargarMotivos = async () => {
    loadingMotivos.value = true
    try { motivos.value = await PqrsService.getMotivos() }
    catch (e) { console.error('[Motivos]', e) }
    finally { loadingMotivos.value = false }
}

onMounted(cargarPqrs)

const irPagina = (p) => { if (p < 1 || p > totalPaginas.value) return; paginaActual.value = p; cargarPqrs() }
const onLimitChange = (val) => { limit.value = val; paginaActual.value = 1; cargarPqrs() }

const abrirNuevaPqrs = async () => {
    errNuevo.value = ''
    const u = authStore.user
    Object.assign(fN, {
        IdMotivo: '', Tipo: '', Asunto: '', Descripcion: '',
        NombreCliente: `${u?.Nombres ?? u?.nombres ?? ''} ${u?.Apellidos ?? u?.apellidos ?? ''}`.trim(),
        Telefono: String(u?.Telefono ?? u?.telefono ?? ''),
        Email: String(u?.Email ?? u?.email ?? ''),
        IdPersonaAutorizada: null,
    })
    modalNuevo.value = true
    if (!motivos.value.length) await cargarMotivos()
}

const crearPqrs = async () => {
    errNuevo.value = ''
    if (!fN.IdMotivo) { errNuevo.value = 'Selecciona un motivo.'; return }
    if (!fN.Tipo) { errNuevo.value = 'Selecciona el tipo de PQRS.'; return }
    if (!fN.Asunto.trim()) { errNuevo.value = 'Escribe un asunto.'; return }
    if (!fN.Descripcion.trim()) { errNuevo.value = 'Escribe una descripción.'; return }
    if (!fN.Telefono.trim()) { errNuevo.value = 'El teléfono es requerido.'; return }
    if (!fN.Email.trim()) { errNuevo.value = 'El correo es requerido.'; return }
    guardando.value = true
    try {
        await PqrsService.create({
            IdMotivo: Number(fN.IdMotivo), Tipo: fN.Tipo,
            Asunto: fN.Asunto.trim(), Descripcion: fN.Descripcion.trim(),
            NombreCliente: fN.NombreCliente.trim(), Telefono: fN.Telefono.trim(),
            Email: fN.Email.trim(),
            ...(fN.IdPersonaAutorizada && { IdPersonaAutorizada: Number(fN.IdPersonaAutorizada) }),
        })
        modalNuevo.value = false
        paginaActual.value = 1
        await cargarPqrs()
    } catch (e) {
        const msg = e.response?.data?.message
        errNuevo.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al enviar la PQRS.')
    } finally {
        guardando.value = false
    }
}

const abrirDetalle = async (pqrs) => {
    pqrsAccion.value = pqrs
    detalleActivo.value = null
    modalDetalle.value = true
    loadingDetalle.value = true
    try { detalleActivo.value = await PqrsService.getById(pqrs.id) }
    catch (e) { console.error('[Detalle PQRS]', e) }
    finally { loadingDetalle.value = false }
}
</script>

<style scoped>
/* ── Overlay ── */
.pqrs-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(13, 41, 28, 0.6);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
}

/* ── Card ── */
.pqrs-card {
    background: #B8E19E;
    border: 2.5px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 7px 0 #0D291C;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.pqrs-card--white {
    background: white;
}

/* ── Head ── */
.pqrs-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 24px 16px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #0D291C 0%, #1a4a2e 100%);
    border-bottom: 2px solid rgba(13, 41, 28, 0.3);
}

.pqrs-head--light {
    background: #f8fafb;
    border-bottom: 2px solid #e2e8f0;
}

.pqrs-head-icon {
    width: 40px;
    height: 40px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(127, 211, 68, 0.15);
    border: 1.5px solid rgba(127, 211, 68, 0.3);
}

.pqrs-head-icon--dark {
    background: #0D291C;
    border-color: #e8f5e9;
    color: #7FD344;
    font-weight: 900;
    font-size: 0.72rem;
}

.pqrs-head-title {
    font-size: 0.95rem;
    font-weight: 900;
    color: white;
    font-style: italic;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1;
}

.pqrs-head-title--dark {
    color: #0D291C;
    font-style: normal;
}

.pqrs-head-sub {
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.45);
}

.pqrs-head-sub--gray {
    color: #9ca3af;
}

.pqrs-close-btn {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 900;
    cursor: pointer;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.1);
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.55);
    transition: background 0.15s, color 0.15s;
}

.pqrs-close-btn:hover {
    background: rgba(255, 255, 255, 0.22);
    color: white;
}

.pqrs-close-btn--light {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #64748b;
}

.pqrs-close-btn--light:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #dc2626;
}

/* ── Body ── */
.pqrs-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.2) transparent;
}

.pqrs-body--white {
    background: white;
}

.pqrs-body::-webkit-scrollbar {
    width: 3px;
}

.pqrs-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.2);
    border-radius: 99px;
}

/* ── Section title ── */
.pqrs-section-title {
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0D291C;
    opacity: 0.45;
    border-bottom: 1.5px solid rgba(13, 41, 28, 0.12);
    padding-bottom: 5px;
}

.pqrs-section-title--light {
    color: #0D291C;
    opacity: 0.45;
    border-bottom-color: #e8f5e9;
}

/* ── Grid 2 cols ── */
.pqrs-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

@media (max-width: 480px) {
    .pqrs-grid-2 {
        grid-template-columns: 1fr;
    }

    .pqrs-field--full {
        grid-column: 1;
    }
}

.pqrs-field--full {
    grid-column: 1 / -1;
}

/* ── Field ── */
.pqrs-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.pqrs-field-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.pqrs-label {
    font-size: 0.63rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.6;
    padding-left: 2px;
}

.pqrs-counter {
    font-size: 0.58rem;
    font-weight: 600;
    color: #0D291C;
    opacity: 0.35;
}

/* ── Inputs ── */
.pqrs-input {
    background-color: white !important;
    border: 2px solid #0D291C !important;
    border-radius: 13px !important;
    padding: 9px 13px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.pqrs-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.18) !important;
}

.pqrs-input--readonly {
    opacity: 0.5;
    background-color: rgba(255, 255, 255, 0.5) !important;
    border-color: rgba(13, 41, 28, 0.3) !important;
    cursor: not-allowed;
}

.pqrs-textarea {
    resize: vertical;
    min-height: 90px;
    border-radius: 13px !important;
}

/* ── Loading select ── */
.pqrs-loading-select {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.5);
    border: 2px solid #0D291C;
    border-radius: 13px;
    padding: 9px 13px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #0D291C;
    opacity: 0.5;
}

.pqrs-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #0D291C;
    border-top-color: transparent;
    border-radius: 50%;
    animation: pqrs-spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes pqrs-spin {
    to {
        transform: rotate(360deg)
    }
}

/* ── Error ── */
.pqrs-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 13px;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 12px;
    font-size: 0.76rem;
    font-weight: 700;
    color: #b91c1c;
}

/* ── Detail sections ── */
.pqrs-estado-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f0faf4;
    border: 2px solid #e8f5e9;
    border-radius: 16px;
}

.pqrs-detail-label {
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9ca3af;
}

.pqrs-estado-val {
    font-size: 0.85rem;
    font-weight: 800;
}

.pqrs-estado-val--green {
    color: #299261;
}

.pqrs-estado-val--amber {
    color: #f59e0b;
}

.pqrs-estado-val--gray {
    color: #9ca3af;
}

.pqrs-detail-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.pqrs-detail-text {
    font-size: 0.88rem;
    color: #374151;
    line-height: 1.6;
    font-weight: 500;
    white-space: pre-wrap;
    padding: 0 2px;
}

.pqrs-respuesta {
    padding: 12px 16px;
    background: #f0faf4;
    border: 2px solid #c8e6c9;
    border-radius: 16px;
    font-size: 0.88rem;
    color: #0D291C;
    line-height: 1.6;
    font-weight: 500;
    white-space: pre-wrap;
}

.pqrs-sin-respuesta {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #fffbeb;
    border: 2px solid #fde68a;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #92400e;
}

/* ── Foot ── */
.pqrs-foot {
    display: flex;
    gap: 10px;
    padding: 14px 24px 20px;
    flex-shrink: 0;
    border-top: 2px solid rgba(13, 41, 28, 0.14);
}

.pqrs-foot--light {
    border-top-color: #e8f5e9;
}

/* ── Buttons ── */
.pqrs-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    border: 2.5px solid;
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
    font-family: inherit;
}

.pqrs-btn:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 !important;
}

.pqrs-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.pqrs-btn--cancel {
    background: rgba(13, 41, 28, 0.12);
    color: #0D291C;
    border-color: rgba(13, 41, 28, 0.25);
    box-shadow: 0 4px 0 rgba(13, 41, 28, 0.2);
}

.pqrs-btn--cancel:hover {
    background: rgba(13, 41, 28, 0.2);
}

.pqrs-btn--confirm {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 4px 0 #050e09;
}

.pqrs-btn--confirm:hover:not(:disabled) {
    background: #1a4a2e;
}

.pqrs-btn-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(127, 211, 68, 0.3);
    border-top-color: #7FD344;
    border-radius: 50%;
    animation: pqrs-spin 0.7s linear infinite;
    flex-shrink: 0;
}

/* ── Animaciones ── */
.pqrs-modal-enter-active {
    transition: opacity 0.2s ease;
}

.pqrs-modal-leave-active {
    transition: opacity 0.15s ease;
}

.pqrs-modal-enter-from,
.pqrs-modal-leave-to {
    opacity: 0;
}

.pqrs-modal-enter-active .pqrs-card {
    animation: pqrs-pop-in 0.28s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

.pqrs-modal-leave-active .pqrs-card {
    animation: pqrs-pop-out 0.18s ease-in both;
}

@keyframes pqrs-pop-in {
    from {
        transform: scale(0.88) translateY(20px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@keyframes pqrs-pop-out {
    from {
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    to {
        transform: scale(0.93) translateY(10px);
        opacity: 0;
    }
}

@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }

    .pqrs-card {
        max-width: 100%;
        border-radius: 22px;
    }

    .pqrs-overlay {
        padding: 12px;
        align-items: flex-end;
    }

    .pqrs-card {
        border-radius: 22px 22px 0 0;
        max-height: 95vh;
        box-shadow: 0 -4px 0 #0D291C;
    }
}
</style>