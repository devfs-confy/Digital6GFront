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
                </div>
            </template>
        </AdminPageHeader>

        <!-- Tabs -->
        <div class="bg-white rounded-2xl px-3 sm:px-4 py-2 flex gap-2 shadow-sm flex-shrink-0 overflow-x-auto">
            <button v-for="tab in tabs" :key="tab.key" @click="cambiarTab(tab.key)"
                :class="['px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap', tabActiva === tab.key ? 'bg-[#0D291C] text-[#7FD344]' : 'text-gray-500 hover:text-[#0D291C] hover:bg-[#f0faf4]']">
                {{ tab.label }}
            </button>
        </div>

        <!-- Buscador -->
        <div class="bg-white rounded-2xl px-4 py-3 flex gap-2 items-center flex-shrink-0 shadow-sm">
            <input v-model="busqueda" type="text" :placeholder="placeholderBusqueda"
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
                    <!-- Encabezados Estudiantes Universidad -->
                    <thead v-if="tabActiva === 'estudiantes-universidad'">
                        <tr>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344]">
                                Estudiante
                            </th>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden sm:table-cell">
                                Correo
                            </th>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden md:table-cell">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <!-- Encabezados Personal Universidad -->
                    <thead v-else-if="tabActiva === 'personal-universidad'">
                        <tr>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344]">
                                Empleado
                            </th>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden sm:table-cell">
                                Tipo
                            </th>
                            <th
                                class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden md:table-cell">
                                Estado
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="loading">
                            <td :colspan="colspanTabla" class="py-16 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div class="loader" />
                                    <span class="text-sm text-gray-400 font-semibold">Cargando...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="lista.length === 0">
                            <td :colspan="colspanTabla" class="py-16 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M12 3L1 9l4 2.18V15c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.82L23 9 12 3zm6 13c0 .5-2.13 1.5-6 1.5S6 16.5 6 16v-2.73L12 17l6-3.73V16zm-6-2.27L4.2 9 12 5.19 19.8 9 12 13.73z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron registros</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas Estudiantes Universidad -->
                        <template v-if="tabActiva === 'estudiantes-universidad'">
                            <tr v-for="e in lista" :key="e.IdEstudiante"
                                class="border-b border-[#e8f5e9] hover:bg-[#f0faf4] transition-colors last:border-0">
                                <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                                    <div class="flex items-center gap-2 sm:gap-3">
                                        <div
                                            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-xs border-2 border-[#e8f5e9] flex-shrink-0">
                                            {{ inicialesNombre(e.NombreApellidos) }}
                                        </div>
                                        <div class="flex flex-col min-w-0">
                                            <span class="font-semibold text-[#0D291C] truncate text-sm leading-tight">
                                                {{ e.NombreApellidos }}
                                            </span>
                                            <span class="text-xs text-gray-400 font-mono sm:hidden">{{ e.IdEstudiante }}</span>
                                            <span class="text-xs text-gray-400 truncate hidden sm:block">{{ e.Correo }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    class="px-3 sm:px-4 py-3 text-sm tracking-wide text-gray-600 whitespace-nowrap hidden sm:table-cell">
                                    {{ e.Correo }}
                                </td>
                                <td class="px-3 sm:px-4 py-3 hidden md:table-cell">
                                    <span v-if="e.Estado"
                                        class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[0.65rem] font-bold text-green-700 uppercase tracking-wide border border-green-200">
                                        <span class="h-1.5 w-1.5 rounded-full bg-green-600" />
                                        Activo
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[0.65rem] font-bold text-red-600 uppercase tracking-wide border border-red-200">
                                        <span class="h-1.5 w-1.5 rounded-full bg-red-500" />
                                        Inactivo
                                    </span>
                                </td>
                            </tr>
                        </template>

                        <!-- Filas Personal Universidad -->
                        <template v-if="tabActiva === 'personal-universidad'">
                            <tr v-for="e in lista" :key="e.IdEmpleado"
                                class="border-b border-[#e8f5e9] hover:bg-[#f0faf4] transition-colors last:border-0">
                                <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                                    <div class="flex items-center gap-2 sm:gap-3">
                                        <div
                                            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-xs border-2 border-[#e8f5e9] flex-shrink-0">
                                            {{ inicialesNombre(e.NombreApellidos) }}
                                        </div>
                                        <div class="flex flex-col min-w-0">
                                            <span class="font-semibold text-[#0D291C] truncate text-sm leading-tight">
                                                {{ e.NombreApellidos }}
                                            </span>
                                            <span class="text-xs text-gray-400 font-mono sm:hidden">{{ e.IdEmpleado }}</span>
                                            <span class="text-xs text-gray-400 truncate hidden sm:block">{{ e.TipoEmpleado || '-' }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    class="px-3 sm:px-4 py-3 text-sm tracking-wide text-gray-600 whitespace-nowrap hidden sm:table-cell">
                                    {{ e.TipoEmpleado || '-' }}
                                </td>
                                <td class="px-3 sm:px-4 py-3 hidden md:table-cell">
                                    <span v-if="e.Estado"
                                        class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[0.65rem] font-bold text-green-700 uppercase tracking-wide border border-green-200">
                                        <span class="h-1.5 w-1.5 rounded-full bg-green-600" />
                                        Activo
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[0.65rem] font-bold text-red-600 uppercase tracking-wide border border-red-200">
                                        <span class="h-1.5 w-1.5 rounded-full bg-red-500" />
                                        Inactivo
                                    </span>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <TablePagination :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ── Modal Subir Excel ──────────────────────────────────────── -->
        <BaseModal v-model="modalExcel" title="Subir Excel" :subtitle="subtituloExcel" size="sm"
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

        <!-- ── Modal Confirmar Desactivación ──────────────────────────── -->
        <BaseModal v-model="modalDesactivar" title="Confirmar desactivación"
            subtitle="Las siguientes personas no aparecen en el Excel importado y serán desactivadas" size="lg"
            confirm-label="Confirmar desactivación" loading-label="Procesando..." :loading="desactivando"
            :confirm-disabled="desactivando || listaDesactivados.length === 0" :close-on-backdrop="false"
            @confirm="confirmarDesactivacion">
            <template #icon>
                <div
                    class="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ef4444" viewBox="0 0 24 24">
                        <path
                            d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                </div>
            </template>

            <div class="p-5 flex flex-col gap-4">
                <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    <span>Total de personas a desactivar: <strong>{{ listaDesactivados.length }}</strong></span>
                </div>

                <div class="max-h-80 overflow-y-auto rounded-xl border border-gray-200 scrollbar-thin">
                    <table class="w-full border-collapse">
                        <thead class="sticky top-0 bg-gray-50 z-10">
                            <tr>
                                <th class="px-3 py-2 text-left text-[0.65rem] font-black uppercase tracking-widest text-gray-600 border-b border-gray-200">ID</th>
                                <th class="px-3 py-2 text-left text-[0.65rem] font-black uppercase tracking-widest text-gray-600 border-b border-gray-200">Nombre</th>
                                <th class="px-3 py-2 text-left text-[0.65rem] font-black uppercase tracking-widest text-gray-600 border-b border-gray-200">Correo / Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in listaDesactivados" :key="idx" class="border-b border-gray-100 last:border-0">
                                <td class="px-3 py-2 text-xs text-gray-600 font-mono">{{ item.IdEstudiante || item.IdEmpleado }}</td>
                                <td class="px-3 py-2 text-sm text-[#0D291C] font-semibold">{{ item.NombreApellidos }}</td>
                                <td class="px-3 py-2 text-xs text-gray-500">{{ item.Correo || item.TipoEmpleado || '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseModal>

    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import TablePagination from '@/components/shared/Paginacion.vue'
import comunidadUccService from '@/api/services/comunidadUcc.service'

// ── Tabs ───────────────────────────────────────────────────────────
const tabs = [
    { key: 'estudiantes-universidad', label: 'Estudiantes Universidad' },
    { key: 'personal-universidad', label: 'Personal Universidad' },
]
const tabActiva = ref('estudiantes-universidad')

const placeholderBusqueda = computed(() => {
    if (tabActiva.value === 'estudiantes-universidad') return 'Buscar por nombre o correo...'
    return 'Buscar por nombre o tipo...'
})

// ── Estado principal ───────────────────────────────────────────────
const loading = ref(false)
const lista = ref([])
const totalPaginas = ref(1)
const totalRegistros = ref(0)

// ── Búsqueda y paginación ──────────────────────────────────────────
const busqueda = ref('')
const paginaActual = ref(1)
const limit = ref(10)

// ── Carga server-side ──────────────────────────────────────────────
const cargar = async () => {
    loading.value = true
    try {
        const params = {
            page: paginaActual.value,
            limit: limit.value,
        }
        if (busqueda.value.trim()) params.search = busqueda.value.trim()

        let res
        if (tabActiva.value === 'estudiantes-universidad') {
            res = await comunidadUccService.getEstudiantesUniversidad(params)
        } else if (tabActiva.value === 'personal-universidad') {
            res = await comunidadUccService.getEmpleadosUniversidad(params)
        }

        lista.value = res?.data ?? (Array.isArray(res) ? res : [])
        totalRegistros.value = res?.total ?? lista.value.length
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

const cambiarTab = (key) => {
    if (tabActiva.value === key) return
    tabActiva.value = key
    busqueda.value = ''
    paginaActual.value = 1
    limit.value = 10
    lista.value = []
    cargar()
}

// ── Carga inicial ──────────────────────────────────────────────────
onMounted(cargar)

// ── Modal Excel ────────────────────────────────────────────────────
const modalExcel = ref(false)
const subiendoExcel = ref(false)
const errExcel = ref('')
const archivoExcel = ref(null)
const inputExcel = ref(null)

const subtituloExcel = computed(() => {
    if (tabActiva.value === 'estudiantes-universidad') return 'Carga masiva de estudiantes universidad'
    if (tabActiva.value === 'personal-universidad') return 'Carga masiva de personal universidad'
    return 'Carga masiva'
})

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
        let res
        if (tabActiva.value === 'estudiantes-universidad') {
            res = await comunidadUccService.uploadExcelEstudiantes(archivoExcel.value)
        } else if (tabActiva.value === 'personal-universidad') {
            res = await comunidadUccService.uploadExcelPersonal(archivoExcel.value)
        }

        modalExcel.value = false

        // Manejar desactivados
        const desactivados = res?.data?.desactivados ?? []
        if (desactivados.length > 0) {
            listaDesactivados.value = desactivados
            modalDesactivar.value = true
        } else {
            await cargar()
        }
    } catch (e) {
        if (e?.code === 'ECONNABORTED' || e?.message?.toLowerCase().includes('timeout')) {
            errExcel.value = 'El archivo está siendo procesado. Por favor espera un momento y refresca la tabla.'
        } else {
            const msg = e?.response?.data?.message
            errExcel.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al subir el archivo.')
        }
    } finally {
        subiendoExcel.value = false
    }
}

// ── Modal Desactivación ────────────────────────────────────────────
const modalDesactivar = ref(false)
const desactivando = ref(false)
const listaDesactivados = ref([])

const confirmarDesactivacion = async () => {
    if (listaDesactivados.value.length === 0) return
    desactivando.value = true
    try {
        if (tabActiva.value === 'estudiantes-universidad') {
            await comunidadUccService.desactivarEstudiantes(listaDesactivados.value)
        } else if (tabActiva.value === 'personal-universidad') {
            await comunidadUccService.desactivarPersonal(listaDesactivados.value)
        }
        modalDesactivar.value = false
        listaDesactivados.value = []
        await cargar()
    } catch (e) {
        console.error('[Desactivación]', e)
    } finally {
        desactivando.value = false
    }
}

// ── Utilidades ─────────────────────────────────────────────────────
const inicialesNombre = (nombreCompleto = '') => {
    const partes = nombreCompleto.trim().split(/\s+/)
    const n = partes[0]?.[0] ?? ''
    const a = partes[1]?.[0] ?? ''
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
