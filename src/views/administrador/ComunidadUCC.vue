<template>
    <div class="h-full flex flex-col gap-4">

        <!-- Header -->
        <AdminPageHeader title="Comunidad UCC">
            <template #right>
                <div class="flex items-center gap-2">
                    <button @click="abrirModalExcel"
                        class="flex items-center gap-1.5 bg-white text-[#299261] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border-2 border-[#299261]"
                        style="box-shadow: #595858 0px 2px 0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                        </svg>
                        <span class="hidden sm:inline">Subir Excel</span>
                    </button>
                    <button @click="abrirModalRegistrar"
                        class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                        style="box-shadow: #595858 0px 2px 0">
                        <AppIcon name="add" :size="14" />
                        <span class="hidden sm:inline">Registrar</span>
                    </button>
                </div>
            </template>
        </AdminPageHeader>

        <!-- Buscador -->
        <div class="bg-white rounded-2xl px-4 py-3 flex gap-2 items-center flex-shrink-0 shadow-sm">
            <input v-model="busqueda" type="text" placeholder="Buscar por nombre o documento..."
                class="flex-1 min-w-0 bg-[#EAEAEA] border-2 border-[#299261] rounded-full px-4 py-2 text-sm text-[#232B3A] outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all" />
            <button v-if="busqueda" @click="busqueda = ''"
                class="text-xs font-bold text-gray-500 border border-gray-200 rounded-full px-3 py-2 hover:border-[#299261] hover:text-[#299261] transition-colors whitespace-nowrap flex-shrink-0">
                ✕
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div class="overflow-x-auto flex-1 scrollbar-thin">
                <table class="w-full border-collapse" style="min-width:300px">
                    <thead>
                        <tr>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344]">
                                Estudiante
                            </th>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden sm:table-cell">
                                Documento
                            </th>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden md:table-cell">
                                Apellidos
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="3" class="py-16 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div class="loader" />
                                    <span class="text-sm text-gray-400 font-semibold">Cargando estudiantes...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="estudiantesPaginados.length === 0">
                            <td colspan="3" class="py-16 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M12 3L1 9l4 2.18V15c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.82L23 9 12 3zm6 13c0 .5-2.13 1.5-6 1.5S6 16.5 6 16v-2.73L12 17l6-3.73V16zm-6-2.27L4.2 9 12 5.19 19.8 9 12 13.73z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron estudiantes</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="e in estudiantesPaginados" :key="e.Documento"
                            class="border-b border-[#e8f5e9] hover:bg-[#f0faf4] transition-colors last:border-0">
                            <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                                <div class="flex items-center gap-2 sm:gap-3">
                                    <div
                                        class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-xs border-2 border-[#e8f5e9] flex-shrink-0">
                                        {{ iniciales(e.Nombre1, e.Apellido1) }}
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-semibold text-[#0D291C] truncate text-sm leading-tight">
                                            {{ e.Nombre1 }} {{ e.Nombre2 }}
                                        </span>
                                        <span class="text-xs text-gray-400 font-mono sm:hidden">{{ e.Documento }}</span>
                                        <span class="text-xs text-gray-400 truncate hidden sm:block">{{ e.Apellido1 }}
                                            {{ e.Apellido2 }}</span>
                                    </div>
                                </div>
                            </td>
                            <td
                                class="px-3 sm:px-4 py-3 text-sm tracking-wide text-gray-600 whitespace-nowrap hidden sm:table-cell">
                                {{ e.Documento }}
                            </td>
                            <td class="px-3 sm:px-4 py-3 text-sm text-gray-700 hidden md:table-cell">
                                {{ e.Apellido1 }} {{ e.Apellido2 }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <TablePagination :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ── Modal Registrar Estudiante UCC ──────────────────────────── -->
        <BaseModal v-model="modalRegistrar" title="Registrar Estudiante UCC" subtitle="Completa los campos requeridos"
            size="md" confirm-label="Registrar" loading-label="Registrando..." :loading="guardando"
            :confirm-disabled="guardando" :close-on-backdrop="false" @confirm="guardarEstudiante">
            <template #icon>
                <div
                    class="w-9 h-9 rounded-xl bg-[#0D291C] border border-[#7FD344]/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344" viewBox="0 0 24 24">
                        <path
                            d="M12 3L1 9l4 2.18V15c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.82L23 9 12 3zm0 10.73L4.2 9 12 5.19 19.8 9 12 13.73z" />
                    </svg>
                </div>
            </template>

            <div class="p-5 flex flex-col gap-4">

                <!-- Error global -->
                <div v-if="errRegistrar" role="alert"
                    class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>{{ errRegistrar }}</span>
                </div>

                <!-- Documento -->
                <div class="flex flex-col gap-1.5">
                    <label class="field-label">Documento <span class="text-red-400">*</span></label>
                    <input v-model="form.Documento" type="text" class="field-input" placeholder="Ej: 123456789"
                        maxlength="20" />
                </div>

                <!-- Nombre1 + Nombre2 -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="field-label">Primer Nombre <span class="text-red-400">*</span></label>
                        <input v-model="form.Nombre1" type="text" class="field-input" placeholder="Ej: Juan" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="field-label">Segundo Nombre</label>
                        <input v-model="form.Nombre2" type="text" class="field-input" placeholder="Ej: Carlos" />
                    </div>
                </div>

                <!-- Apellido1 + Apellido2 -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="field-label">Primer Apellido <span class="text-red-400">*</span></label>
                        <input v-model="form.Apellido1" type="text" class="field-input" placeholder="Ej: Rodríguez" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="field-label">Segundo Apellido</label>
                        <input v-model="form.Apellido2" type="text" class="field-input" placeholder="Ej: López" />
                    </div>
                </div>

            </div>
        </BaseModal>

        <!-- ── Modal Subir Excel ──────────────────────────────────────── -->
        <BaseModal v-model="modalExcel" title="Subir Excel" subtitle="Carga masiva de estudiantes UCC" size="sm"
            confirm-label="Subir" loading-label="Subiendo..." :loading="subiendoExcel"
            :confirm-disabled="!archivoExcel || subiendoExcel" :close-on-backdrop="false" @confirm="subirExcel">
            <template #icon>
                <div
                    class="w-9 h-9 rounded-xl bg-[#0D291C] border border-[#7FD344]/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344" viewBox="0 0 24 24">
                        <path
                            d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                    </svg>
                </div>
            </template>

            <div class="p-5 flex flex-col gap-4">

                <!-- Error global -->
                <div v-if="errExcel" role="alert"
                    class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>{{ errExcel }}</span>
                </div>

                <!-- Zona de carga -->
                <label
                    class="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl px-4 py-8 cursor-pointer transition-colors"
                    :class="archivoExcel ? 'border-[#299261] bg-[#f0faf4]' : 'border-gray-300 bg-gray-50 hover:border-[#299261] hover:bg-[#f0faf4]'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                        :fill="archivoExcel ? '#299261' : '#9ca3af'" viewBox="0 0 24 24">
                        <path
                            d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    <div class="text-center">
                        <p v-if="archivoExcel" class="text-sm font-semibold text-[#299261]">{{ archivoExcel.name }}</p>
                        <p v-else class="text-sm font-medium text-gray-500">
                            Haz clic para seleccionar un archivo
                        </p>
                        <p class="text-xs text-gray-400 mt-1">Formatos: .xlsx, .xls</p>
                    </div>
                    <input ref="inputExcel" type="file" accept=".xlsx,.xls" class="hidden"
                        @change="onArchivoSeleccionado" />
                </label>

                <!-- Archivo seleccionado: botón eliminar -->
                <button v-if="archivoExcel" @click="limpiarArchivo"
                    class="text-xs text-gray-400 hover:text-red-500 transition-colors self-start flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                    Quitar archivo
                </button>

            </div>
        </BaseModal>

    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import TablePagination from '@/components/shared/Paginacion.vue'
import AppIcon from '@/components/shared/AppIcon.vue'
import comunidadUccService from '@/api/services/comunidadUcc.service'

// ── Estado principal ───────────────────────────────────────────────
const loading = ref(false)
const estudiantes = ref([])
const totalPaginas = ref(1)
const totalRegistros = ref(0)

// ── Búsqueda y paginación ──────────────────────────────────────────
const busqueda = ref('')
const paginaActual = ref(1)
const limit = ref(10)

const estudiantesPaginados = computed(() => estudiantes.value)

// ── Carga server-side ──────────────────────────────────────────────
const cargar = async () => {
    loading.value = true
    try {
        const params = {
            page: paginaActual.value,
            limit: limit.value,
        }
        if (busqueda.value.trim()) params.search = busqueda.value.trim()

        const res = await comunidadUccService.getAll(params)
        estudiantes.value = res?.data ?? (Array.isArray(res) ? res : [])
        totalRegistros.value = res?.total ?? estudiantes.value.length
        totalPaginas.value = res?.totalPages ?? Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        console.error('[ComunidadUCC]', e)
    } finally {
        loading.value = false
    }
}

let debounceTimer = null
watch(busqueda, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        paginaActual.value = 1
        cargar()
    }, 350)
})

const irPagina = p => {
    if (p >= 1 && p <= totalPaginas.value) { paginaActual.value = p; cargar() }
}
const onLimitChange = val => { limit.value = Number(val); paginaActual.value = 1; cargar() }

// ── Carga inicial ──────────────────────────────────────────────────
onMounted(cargar)

// ── Modal Registrar ────────────────────────────────────────────────
const modalRegistrar = ref(false)
const guardando = ref(false)
const errRegistrar = ref('')
const form = ref({
    Documento: '',
    Nombre1: '',
    Nombre2: '',
    Apellido1: '',
    Apellido2: '',
})

const abrirModalRegistrar = () => {
    errRegistrar.value = ''
    form.value = { Documento: '', Nombre1: '', Nombre2: '', Apellido1: '', Apellido2: '' }
    modalRegistrar.value = true
}

const guardarEstudiante = async () => {
    errRegistrar.value = ''
    const f = form.value

    if (!f.Documento.trim()) { errRegistrar.value = 'El documento es requerido.'; return }
    if (!f.Nombre1.trim()) { errRegistrar.value = 'El primer nombre es requerido.'; return }
    if (!f.Apellido1.trim()) { errRegistrar.value = 'El primer apellido es requerido.'; return }

    guardando.value = true
    try {
        const res = await comunidadUccService.create({ ...f })
        if (res?.error) { errRegistrar.value = res?.message ?? 'Error al registrar.'; return }
        modalRegistrar.value = false
        await cargar()
    } catch (e) {
        const msg = e?.response?.data?.message
        errRegistrar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al registrar el estudiante.')
    } finally {
        guardando.value = false
    }
}

// ── Modal Excel ────────────────────────────────────────────────────
const modalExcel = ref(false)
const subiendoExcel = ref(false)
const errExcel = ref('')
const archivoExcel = ref(null)
const inputExcel = ref(null)

const abrirModalExcel = () => {
    errExcel.value = ''
    archivoExcel.value = null
    modalExcel.value = true
}

const onArchivoSeleccionado = (event) => {
    const file = event.target.files?.[0]
    if (file) archivoExcel.value = file
}

const limpiarArchivo = () => {
    archivoExcel.value = null
    if (inputExcel.value) inputExcel.value.value = ''
}

const subirExcel = async () => {
    if (!archivoExcel.value) return
    errExcel.value = ''
    subiendoExcel.value = true
    try {
        await comunidadUccService.uploadExcel(archivoExcel.value)
        await cargar()
        modalExcel.value = false
    } catch (e) {
        const msg = e?.response?.data?.message
        errExcel.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al subir el archivo.')
    } finally {
        subiendoExcel.value = false
    }
}

// ── Utilidades ─────────────────────────────────────────────────────
const iniciales = (nombre1 = '', apellido1 = '') => {
    const n = nombre1.trim()[0] ?? ''
    const a = apellido1.trim()[0] ?? ''
    return (n + a).toUpperCase() || '??'
}
</script>

<style scoped>
.field-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-left: 2px;
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
}

.field-input:focus {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15);
}

.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #0D291C22 transparent;
}

.loader {
    width: 28px;
    height: 28px;
    border: 3px solid #e8f5e9;
    border-top-color: #299261;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}
</style>
