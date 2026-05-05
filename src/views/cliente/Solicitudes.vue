<template>
    <div class="h-full flex flex-col gap-4 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Mis Solicitudes" />

        <!-- Lista -->
        <div class="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 pb-2">

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-20">
                <div class="w-9 h-9 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                <span class="text-sm font-medium text-gray-400">Cargando solicitudes...</span>
            </div>

            <!-- Vacío -->
            <div v-else-if="solicitudes.length === 0"
                class="flex flex-col items-center justify-center gap-3 py-20 bg-white rounded-2xl">
                <AppIcon name="inbox" :size="48" class="text-gray-300" />
                <span class="text-sm font-medium text-gray-400">No tienes solicitudes registradas</span>
            </div>

            <!-- Cards -->
            <div v-else v-for="s in solicitudes" :key="s.Id"
                class="bg-white rounded-2xl p-4 shadow-sm border border-[#e8f5e9] hover:border-[#299261] transition-all cursor-pointer"
                @click="verDetalle(s.Id)">

                <div class="flex items-start justify-between gap-3">
                    <!-- Icono + contenido -->
                    <div class="flex items-start gap-3 flex-1 min-w-0">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            :class="iconoBg(s.Tipo)">
                            <AppIcon :name="iconoTipo(s.Tipo)" :size="20" class="text-white" />
                        </div>
                        <div class="flex flex-col gap-1 min-w-0">
                            <span class="text-sm font-bold text-[#0D291C] truncate">{{ s.Asunto }}</span>
                            <span class="text-xs text-gray-500 truncate">{{ s.Motivo?.Nombre ?? '—' }}</span>
                            <span class="text-xs text-gray-400">{{ formatFecha(s.FechaCreacion) }}</span>
                        </div>
                    </div>

                    <!-- Badges -->
                    <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span class="text-[0.65rem] font-black px-2 py-0.5 rounded-full"
                            :class="badgeTipo(s.Tipo)">{{ s.Tipo }}</span>
                        <span class="text-[0.65rem] font-black px-2 py-0.5 rounded-full"
                            :class="badgeEstado(s.Estado)">{{ s.Estado }}</span>
                        <span class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
                            :class="badgePrioridad(s.Prioridad)">{{ s.Prioridad }}</span>
                    </div>
                </div>

                <!-- Descripción preview -->
                <p class="mt-2 text-xs text-gray-500 line-clamp-2 pl-[52px]">{{ s.Descripcion }}</p>

                <!-- Ver detalle hint -->
                <div class="flex justify-end mt-2">
                    <span class="text-[0.7rem] text-[#299261] font-bold flex items-center gap-1">
                        Ver detalle <AppIcon name="chevron_right" :size="14" />
                    </span>
                </div>
            </div>

            <!-- Paginación -->
            <TablePaginacion v-if="!loading && solicitudes.length > 0"
                :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit"
                @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- Modal Detalle -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="modalAbierto"
                    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    style="background: rgba(13,41,28,0.55); backdrop-filter: blur(4px)"
                    @click.self="cerrarModal">

                    <div class="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                        <!-- Modal header -->
                        <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#e8f5e9]">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                    :class="detalle ? iconoBg(detalle.Tipo) : 'bg-gray-200'">
                                    <AppIcon v-if="detalle" :name="iconoTipo(detalle.Tipo)" :size="18" class="text-white" />
                                </div>
                                <div>
                                    <p class="text-xs font-black text-[#299261] uppercase tracking-wider">Solicitud #{{ detalle?.Id }}</p>
                                    <p class="text-sm font-bold text-[#0D291C]">{{ detalle?.Asunto }}</p>
                                </div>
                            </div>
                            <button @click="cerrarModal"
                                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                                <AppIcon name="close" :size="18" />
                            </button>
                        </div>

                        <!-- Modal body -->
                        <div class="overflow-y-auto flex-1 px-5 py-4">

                            <!-- Loading detalle -->
                            <div v-if="loadingDetalle" class="flex flex-col items-center py-12 gap-3">
                                <div class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                <span class="text-sm text-gray-400">Cargando detalle...</span>
                            </div>

                            <template v-else-if="detalle">

                                <!-- Badges fila -->
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <span class="text-[0.7rem] font-black px-3 py-1 rounded-full"
                                        :class="badgeTipo(detalle.Tipo)">{{ detalle.Tipo }}</span>
                                    <span class="text-[0.7rem] font-black px-3 py-1 rounded-full"
                                        :class="badgeEstado(detalle.Estado)">{{ detalle.Estado }}</span>
                                    <span class="text-[0.7rem] font-bold px-3 py-1 rounded-full"
                                        :class="badgePrioridad(detalle.Prioridad)">● {{ detalle.Prioridad }}</span>
                                </div>

                                <!-- Descripción -->
                                <div class="bg-[#f8fffe] rounded-xl border border-[#e8f5e9] p-3.5 mb-4">
                                    <p class="text-[0.65rem] font-black uppercase tracking-wider text-[#299261] mb-1.5">Descripción</p>
                                    <p class="text-sm text-[#232B3A] leading-relaxed">{{ detalle.Descripcion }}</p>
                                </div>

                                <!-- Grid datos -->
                                <div class="grid grid-cols-2 gap-3 mb-4">
                                    <div class="detail-field">
                                        <span class="detail-label">Motivo</span>
                                        <span class="detail-value">{{ detalle.Motivo?.Nombre ?? '—' }}</span>
                                    </div>
                                    <div class="detail-field">
                                        <span class="detail-label">Documento</span>
                                        <span class="detail-value font-mono">{{ detalle.DocumentoUsuario }}</span>
                                    </div>
                                    <div class="detail-field">
                                        <span class="detail-label">Creación</span>
                                        <span class="detail-value">{{ formatFecha(detalle.FechaCreacion) }}</span>
                                    </div>
                                    <div class="detail-field">
                                        <span class="detail-label">Respuesta</span>
                                        <span class="detail-value">{{ formatFecha(detalle.FechaRespuesta) }}</span>
                                    </div>
                                </div>

                                <!-- Datos de contacto -->
                                <div class="bg-[#f8fffe] rounded-xl border border-[#e8f5e9] p-3.5 mb-4">
                                    <p class="text-[0.65rem] font-black uppercase tracking-wider text-[#299261] mb-2">Datos de contacto</p>
                                    <div class="flex flex-col gap-1.5">
                                        <div class="flex items-center gap-2">
                                            <AppIcon name="person" :size="14" class="text-[#299261] flex-shrink-0" />
                                            <span class="text-sm text-[#232B3A] font-medium">{{ detalle.NombreCliente }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <AppIcon name="call" :size="14" class="text-[#299261] flex-shrink-0" />
                                            <span class="text-sm text-gray-600">{{ detalle.Telefono ?? '—' }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <AppIcon name="mail" :size="14" class="text-[#299261] flex-shrink-0" />
                                            <span class="text-sm text-gray-600 truncate">{{ detalle.Email ?? '—' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Respuesta admin (si existe) -->
                                <div v-if="detalle.Respuesta"
                                    class="bg-[#0D291C] rounded-xl p-3.5">
                                    <p class="text-[0.65rem] font-black uppercase tracking-wider text-[#7FD344] mb-1.5">Respuesta</p>
                                    <p class="text-sm text-white leading-relaxed">{{ detalle.Respuesta }}</p>
                                </div>

                            </template>
                        </div>

                        <!-- Modal footer -->
                        <div class="px-5 py-4 border-t border-[#e8f5e9]">
                            <button @click="cerrarModal"
                                class="w-full bg-[#0D291C] text-[#7FD344] font-bold py-2.5 rounded-full text-sm border border-black"
                                style="box-shadow: #595858 0px 2px 0">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppIcon from '@/components/shared/AppIcon.vue'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import PqrsService from '@/api/services/pqrs.service'
import formats from '@/utils/formats.date'

// ── Estado ─────────────────────────────────────────────────────────
const solicitudes = ref([])
const loading = ref(false)
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)

// Modal
const modalAbierto = ref(false)
const loadingDetalle = ref(false)
const detalle = ref(null)

// ── Carga ──────────────────────────────────────────────────────────
const cargar = async () => {
    loading.value = true
    try {
        const res = await PqrsService.getMisPqrs({ page: paginaActual.value, limit: limit.value })
        solicitudes.value = res?.data ?? (Array.isArray(res) ? res : [])
        totalRegistros.value = res?.total ?? solicitudes.value.length
        totalPaginas.value = res?.totalPages ?? Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        console.error('[Solicitudes]', e)
    } finally {
        loading.value = false
    }
}

const irPagina = p => { if (p >= 1 && p <= totalPaginas.value) { paginaActual.value = p; cargar() } }
const onLimitChange = val => { limit.value = Number(val); paginaActual.value = 1; cargar() }

onMounted(cargar)

// ── Modal detalle ──────────────────────────────────────────────────
const verDetalle = async (id) => {
    modalAbierto.value = true
    loadingDetalle.value = true
    detalle.value = null
    try {
        detalle.value = await PqrsService.getById(id)
    } catch (e) {
        console.error('[Solicitudes detalle]', e)
    } finally {
        loadingDetalle.value = false
    }
}

const cerrarModal = () => {
    modalAbierto.value = false
    detalle.value = null
}

// ── Helpers visuales ───────────────────────────────────────────────
const formatFecha = (f) => {
    if (!f) return '—'
    return formats.fechaSinDate(f)
}

const iconoTipo = (tipo) => {
    const map = { QUEJA: 'sentiment_dissatisfied', PETICION: 'assignment', RECLAMO: 'gavel', SUGERENCIA: 'lightbulb' }
    return map[tipo] ?? 'help'
}

const iconoBg = (tipo) => {
    const map = { QUEJA: 'bg-red-500', PETICION: 'bg-blue-500', RECLAMO: 'bg-amber-500', SUGERENCIA: 'bg-[#299261]' }
    return map[tipo] ?? 'bg-gray-400'
}

const badgeTipo = (tipo) => {
    const map = {
        QUEJA: 'bg-red-100 text-red-700 border border-red-200',
        PETICION: 'bg-blue-100 text-blue-700 border border-blue-200',
        RECLAMO: 'bg-amber-100 text-amber-700 border border-amber-200',
        SUGERENCIA: 'bg-[#e8f5e9] text-[#299261] border border-[#c8e6c9]',
    }
    return map[tipo] ?? 'bg-gray-100 text-gray-600'
}

const badgeEstado = (estado) => {
    const map = {
        ABIERTO: 'bg-[#e8f5e9] text-[#299261] border border-[#c8e6c9]',
        EN_PROCESO: 'bg-blue-100 text-blue-700 border border-blue-200',
        CERRADO: 'bg-gray-100 text-gray-500 border border-gray-200',
    }
    return map[estado] ?? 'bg-gray-100 text-gray-600'
}

const badgePrioridad = (p) => {
    const map = {
        ALTA: 'bg-red-100 text-red-600',
        MEDIA: 'bg-amber-100 text-amber-600',
        BAJA: 'bg-green-100 text-green-600',
    }
    return map[p] ?? 'bg-gray-100 text-gray-500'
}
</script>

<style scoped>
.detail-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: #f8fffe;
    border: 1px solid #e8f5e9;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
}

.detail-label {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #299261;
}

.detail-value {
    font-size: 0.82rem;
    font-weight: 600;
    color: #232B3A;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 640px) {
    .maincontainer {
        height: auto;
    }
}
</style>
