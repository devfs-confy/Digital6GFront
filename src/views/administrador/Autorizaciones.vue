<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Autorizaciones">
            <template #right>
                <button @click="abrirCrear" :disabled="!filtros.sede"
                    class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black disabled:opacity-40 disabled:cursor-not-allowed"
                    style="box-shadow: #595858 0px 2px 0">
                    <AppIcon name="add" :size="14" />
                    <span class="hidden sm:inline">Nueva</span>
                </button>
            </template>
        </AdminPageHeader>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">
                    Sede <span class="text-red-400">*</span>
                </label>
                <select v-model="filtros.sede" @change="onSedeChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option value="">Seleccionar sede</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                        {{ s.Nombre }}
                    </option>

                </select>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[150px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Tipo</label>
                <select v-model="filtros.tipo" :disabled="!filtros.sede"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <option value="">Todos</option>
                    <option value="1">Mensualidad</option>
                    <option value="2">Quincena</option>
                </select>
            </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto flex-1">
                <table class="border-collapse min-w-[700px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell">Nombre</th>
                            <th class="th-cell">Sede</th>
                            <th class="th-cell">Tipo</th>
                            <th class="th-cell">Regla</th>
                            <th class="th-cell">Prioridad</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell text-center">Quincena</th>
                            <th class="th-cell text-center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>

                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="7" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando autorizaciones...</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Vacío -->
                        <tr v-else-if="autorizacionesPaginadas.length === 0">
                            <td colspan="7" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="key_off" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium text-gray-300">No se encontraron
                                        autorizaciones</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas -->
                        <tr v-else v-for="a in autorizacionesPaginadas"
                            :key="a.IdAutorizacion + '_' + a.IdEstacionamiento"
                            class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors">

                            <!-- Nombre -->
                            <td class="px-5 py-3">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        :class="a.IdTipo === 1 ? 'bg-[#0D291C]' : 'bg-amber-500'">
                                        <AppIcon :name="a.IdTipo === 1 ? 'calendar_month' : 'event_repeat'" :size="16"
                                            class="text-[#7FD344]" />
                                    </div>
                                    <span class="text-sm font-semibold text-[#0D291C]">{{ a.NombreAutorizacion }}</span>
                                </div>
                            </td>

                            <!-- Sede -->
                            <td class="px-5 py-3">
                                <span
                                    class="text-[0.72rem] font-bold text-[#299261] bg-[#f0faf4] border border-[#c8e6c9] px-2 py-0.5 rounded-full">
                                    {{ sedeNombre(a.IdEstacionamiento) }}
                                </span>
                            </td>

                            <!-- Tipo -->
                            <td class="px-5 py-3 whitespace-nowrap">
                                <span class="text-[0.72rem] font-black px-2.5 py-1 rounded-full" :class="a.IdTipo === 1
                                    ? 'bg-[#0D291C] text-[#7FD344]'
                                    : 'bg-amber-100 text-amber-700 border border-amber-300'">
                                    {{ a.IdTipo === 1 ? 'Mensualidad' : 'Quincena' }}
                                </span>
                            </td>

                            <!-- Regla -->
                            <td class="px-5 py-3">
                                <span class="font-mono text-xs text-gray-500">#{{ a.IdReglaAutorizacion }}</span>
                            </td>

                            <!-- Prioridad -->
                            <td class="px-5 py-3">
                                <span v-if="a.Prioridad" class="text-[#299261] font-extrabold text-[0.8rem]">●
                                    Alta</span>
                                <span v-else class="text-gray-400 font-extrabold text-[0.8rem]">● Normal</span>
                            </td>

                            <!-- Estado -->
                            <td class="px-5 py-3 whitespace-nowrap">
                                <span v-if="a.Estado" class="text-[#299261] font-extrabold text-[0.8rem]">●
                                    Activa</span>
                                <span v-else class="text-red-500 font-extrabold text-[0.8rem]">● Inactiva</span>
                            </td>

                            <!-- Toggle Quincena (solo IdTipo === 2) -->
                            <td class="px-5 py-3 text-center">
                                <template v-if="a.IdTipo === 2">
                                    <label @click.prevent="toggleQuincena(a)"
                                        class="inline-flex items-center cursor-pointer">
                                        <div class="relative">
                                            <div class="w-11 h-6 rounded-full transition-colors duration-200"
                                                :class="a.Estado ? 'bg-[#299261]' : 'bg-gray-300'">
                                                <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                                    :class="a.Estado ? 'translate-x-5' : 'translate-x-0'" />
                                            </div>
                                        </div>
                                    </label>
                                </template>
                                <span v-else class="text-gray-300 text-xs">—</span>
                            </td>

                            <td class="px-5 py-3 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="abrirEditar(a)"
                                        class="w-8 h-8 inline-flex items-center justify-center rounded-xl cursor-pointer border-none bg-transparent text-black hover:text-[#299261] hover:bg-[#e8f5e9] transition-all">
                                        <AppIcon name="edit_square" :size="30" />
                                    </button>

                                </div>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginasFiltradas"
                :total-registros="totalRegistrosFiltrados" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>



    </div>

    <AsideEditar v-model="panelAbierto" :titulo="modoEditar ? 'Editar autorización' : 'Nueva autorización'"
        :subtitulo="modoEditar ? autorizacionSeleccionada?.NombreAutorizacion : 'Completa los datos'"
        :label-guardar="modoEditar ? 'Guardar cambios' : 'Crear autorización'" :loading="guardando" :error="errGuardar"
        @guardar="guardar" @update:modelValue="cerrarPanel">

        <!-- ID Autorización (solo crear) -->
        <div v-if="!modoEditar" class="flex flex-col gap-1.5">
            <label class="aside-field-label">ID Autorización *</label>
            <input v-model="form.IdAutorizacion" type="number" class="aside-field-input" placeholder="Ej: 10" />
        </div>

        <!-- Sede (solo crear) -->
        <div v-if="!modoEditar" class="flex flex-col gap-1.5">
            <label class="aside-field-label">Sede *</label>
            <select v-model="form.IdEstacionamiento" class="aside-field-input cursor-pointer">
                <option :value="''">Seleccionar sede</option>
                <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="Number(s.IdEstacionamiento)">
                    {{ s.Nombre }}
                </option>
            </select>
        </div>

        <!-- Nombre -->
        <div class="flex flex-col gap-1.5">
            <label class="aside-field-label">Nombre *</label>
            <input v-model="form.NombreAutorizacion" type="text" maxlength="50" class="aside-field-input"
                placeholder="Ej: MENSUALIDAD CARRO" />
        </div>

        <!-- Tipo -->
        <div class="flex flex-col gap-1.5">
            <label class="aside-field-label">Tipo</label>
            <select v-model="form.IdTipo" class="aside-field-input cursor-pointer">
                <option :value="1">Mensualidad</option>
                <option :value="2">Quincena</option>
            </select>
        </div>

        <!-- Fechas -->
        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
                <label class="aside-field-label">Fecha inicial</label>
                <input v-model="form.FechaInicial" type="datetime-local" class="aside-field-input" />
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="aside-field-label">Fecha final</label>
                <input v-model="form.FechaFinal" type="datetime-local" class="aside-field-input" />
            </div>
        </div>

        <!-- Regla + Complementaria -->
        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
                <label class="aside-field-label">ID Regla</label>
                <input v-model="form.IdReglaAutorizacion" type="number" class="aside-field-input"
                    placeholder="Ej: 48" />
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="aside-field-label">ID Complementaria</label>
                <input v-model="form.IdAutorizacionComplementaria" type="number" class="aside-field-input"
                    placeholder="Ej: 2" />
            </div>
        </div>

        <!-- Toggles -->
        <div class="flex gap-3">
            <!-- Estado -->
            <label
                class="flex items-center gap-3 cursor-pointer select-none flex-1 p-3.5 bg-white rounded-xl border-2 transition-all"
                :class="form.Estado ? 'border-[#299261]' : 'border-red-300'">
                <div class="relative flex-shrink-0">
                    <input type="checkbox" v-model="form.Estado" class="sr-only" />
                    <div class="w-11 h-6 rounded-full transition-colors duration-200"
                        :class="form.Estado ? 'bg-[#299261]' : 'bg-red-400'">
                        <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            :class="form.Estado ? 'translate-x-5' : 'translate-x-0'" />
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="text-[0.78rem] font-black" :class="form.Estado ? 'text-[#299261]' : 'text-red-500'">
                        {{ form.Estado ? '● Activo' : '● Inactivo' }}
                    </span>
                    <span class="text-[0.65rem] text-gray-400 font-medium">Estado</span>
                </div>
            </label>

            <!-- Prioridad -->
            <label
                class="flex items-center gap-3 cursor-pointer select-none flex-1 p-3.5 bg-white rounded-xl border-2 transition-all"
                :class="form.Prioridad ? 'border-[#299261]' : 'border-gray-200'">
                <div class="relative flex-shrink-0">
                    <input type="checkbox" v-model="form.Prioridad" class="sr-only" />
                    <div class="w-11 h-6 rounded-full transition-colors duration-200"
                        :class="form.Prioridad ? 'bg-[#299261]' : 'bg-gray-300'">
                        <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            :class="form.Prioridad ? 'translate-x-5' : 'translate-x-0'" />
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="text-[0.78rem] font-black"
                        :class="form.Prioridad ? 'text-[#299261]' : 'text-gray-400'">
                        {{ form.Prioridad ? 'Alta' : 'Normal' }}
                    </span>
                    <span class="text-[0.65rem] text-gray-400 font-medium">Prioridad</span>
                </div>
            </label>
        </div>

        <!-- Sincronización -->
        <label
            class="flex items-center gap-3 cursor-pointer select-none p-3.5 bg-white rounded-xl border-2 transition-all"
            :class="form.Sincronizacion ? 'border-[#299261]' : 'border-gray-200'">
            <div class="relative flex-shrink-0">
                <input type="checkbox" v-model="form.Sincronizacion" class="sr-only" />
                <div class="w-11 h-6 rounded-full transition-colors duration-200"
                    :class="form.Sincronizacion ? 'bg-[#299261]' : 'bg-gray-300'">
                    <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                        :class="form.Sincronizacion ? 'translate-x-5' : 'translate-x-0'" />
                </div>
            </div>
            <div class="flex flex-col">
                <span class="text-[0.78rem] font-black"
                    :class="form.Sincronizacion ? 'text-[#299261]' : 'text-gray-400'">
                    {{ form.Sincronizacion ? 'Activa' : 'Inactiva' }}
                </span>
                <span class="text-[0.65rem] text-gray-400 font-medium">Sincronización</span>
            </div>
        </label>

    </AsideEditar>

</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import AutorizacionesService from '@/api/services/autorizaciones.service'
import SedesService from '@/api/services/sedes.service'
import { showConfirm, showSuccess, showError } from '@/utils/swal'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import AsideEditar from '@/components/aside/AsideEditar.vue'

// ── Estado ─────────────────────────────────────────────────────────
const autorizaciones = ref([])       // datos raw del API
const sedes = ref([])
const loading = ref(false)
const filtros = ref({ sede: '', tipo: '' })
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)

// Panel
const panelAbierto = ref(false)
const guardando = ref(false)
const errGuardar = ref('')
const modoEditar = ref(false)
const autorizacionSeleccionada = ref(null)

// ── Computed ───────────────────────────────────────────────────────
// Con sede: getBySede devuelve todo → filtrar tipo + paginar client-side
// Sin sede: getAll pagina server-side → mostrar directo
const autorizacionesFiltradas = computed(() => {
    if (!filtros.value.sede) return autorizaciones.value
    if (!filtros.value.tipo) return autorizaciones.value
    return autorizaciones.value.filter(a => String(a.IdTipo) === String(filtros.value.tipo))
})

const totalRegistrosFiltrados = computed(() =>
    filtros.value.sede ? autorizacionesFiltradas.value.length : totalRegistros.value
)
const totalPaginasFiltradas = computed(() =>
    filtros.value.sede
        ? Math.max(1, Math.ceil(totalRegistrosFiltrados.value / limit.value))
        : totalPaginas.value
)
const autorizacionesPaginadas = computed(() => {
    if (!filtros.value.sede) return autorizaciones.value
    const start = (paginaActual.value - 1) * limit.value
    return autorizacionesFiltradas.value.slice(start, start + limit.value)
})

const form = reactive({
    IdAutorizacion: null,
    IdEstacionamiento: '',
    NombreAutorizacion: '',
    FechaInicial: '',
    FechaFinal: '',
    Estado: true,
    Sincronizacion: false,
    IdTipo: 1,
    Prioridad: false,
    IdAutorizacionComplementaria: null,
    IdReglaAutorizacion: null,
})
// ── Helpers ────────────────────────────────────────────────────────
const sedeNombre = (idSede) =>
    sedes.value.find(s => String(s.IdEstacionamiento) === String(idSede))?.Nombre ?? `Sede ${idSede}`


const toInputDate = (f) => {
    if (!f) return ''
    const d = new Date(f)
    if (isNaN(d)) return ''
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const toApiDate = (f) => {
    if (!f) return undefined
    return new Date(f).toISOString()
}

const abrirCrear = () => {
    modoEditar.value = false
    autorizacionSeleccionada.value = null
    errGuardar.value = ''
    Object.assign(form, {
        IdAutorizacion: null,
        IdEstacionamiento: Number(filtros.value.sede) || '',
        NombreAutorizacion: '',
        FechaInicial: '',
        FechaFinal: '',
        Estado: true,
        Sincronizacion: false,
        IdTipo: 1,
        Prioridad: false,
        IdAutorizacionComplementaria: null,
        IdReglaAutorizacion: null,
    })
    panelAbierto.value = true
}

const abrirEditar = (a) => {
    modoEditar.value = true
    autorizacionSeleccionada.value = a
    errGuardar.value = ''
    Object.assign(form, {
        IdAutorizacion: Number(a.IdAutorizacion),
        IdEstacionamiento: Number(a.IdEstacionamiento),
        NombreAutorizacion: a.NombreAutorizacion ?? '',
        FechaInicial: toInputDate(a.FechaInicial),
        FechaFinal: toInputDate(a.FechaFinal),
        Estado: a.Estado ?? true,
        Sincronizacion: a.Sincronizacion ?? false,
        IdTipo: a.IdTipo ?? 1,
        Prioridad: a.Prioridad ?? false,
        IdAutorizacionComplementaria: a.IdAutorizacionComplementaria ? Number(a.IdAutorizacionComplementaria) : null,
        IdReglaAutorizacion: a.IdReglaAutorizacion ? Number(a.IdReglaAutorizacion) : null,
    })
    panelAbierto.value = true
}

const cerrarPanel = () => {
    panelAbierto.value = false
    autorizacionSeleccionada.value = null
    errGuardar.value = ''
}

const guardar = async () => {
    errGuardar.value = ''
    if (!form.NombreAutorizacion?.trim()) { errGuardar.value = 'El nombre es obligatorio.'; return }
    if (!form.IdAutorizacion) { errGuardar.value = 'El ID de autorización es obligatorio.'; return }
    if (!form.IdEstacionamiento) { errGuardar.value = 'La sede es obligatoria.'; return }

    guardando.value = true
    try {
        const dto = {
            NombreAutorizacion: form.NombreAutorizacion.trim(),
            FechaInicial: toApiDate(form.FechaInicial),
            FechaFinal: toApiDate(form.FechaFinal),
            Estado: form.Estado,
            Sincronizacion: form.Sincronizacion,
            IdTipo: Number(form.IdTipo),
            Prioridad: form.Prioridad,
            ...(form.IdAutorizacionComplementaria && { IdAutorizacionComplementaria: Number(form.IdAutorizacionComplementaria) }),
            ...(form.IdReglaAutorizacion && { IdReglaAutorizacion: Number(form.IdReglaAutorizacion) }),
        }

        let res
        if (modoEditar.value) {
            res = await AutorizacionesService.modify(form.IdAutorizacion, form.IdEstacionamiento, dto)
        } else {
            res = await AutorizacionesService.create({
                ...dto,
                IdAutorizacion: Number(form.IdAutorizacion),
                IdEstacionamiento: Number(form.IdEstacionamiento),
            })
        }

        if (res?.error) { showError({ data: res }); return }
        showSuccess('Autorización', res?.message ?? 'Guardado correctamente.')
        cerrarPanel()
        await cargar()
    } catch (e) {
        console.error('[guardar autorización]', e)
        errGuardar.value = 'Error inesperado al guardar.'
    } finally {
        guardando.value = false
    }
}


// ── Carga ──────────────────────────────────────────────────────────
const cargar = async () => {
    loading.value = true
    try {
        let res

        if (filtros.value.sede) {
            // Endpoint dedicado por sede, devuelve todos → paginamos client-side
            res = await AutorizacionesService.listarPorSede(parseInt(filtros.value.sede, 10))
            if (res?.error) { showError({ status: res.status, data: res.data }); autorizaciones.value = []; return }
            autorizaciones.value = res?.data ?? (Array.isArray(res) ? res : [])
        } else {
            // Sin sede: getAll paginado server-side
            res = await AutorizacionesService.getAll({
                page: parseInt(paginaActual.value, 10),
                limit: parseInt(limit.value, 10),
            })
            if (res?.error) { showError({ status: res.status, data: res.data }); autorizaciones.value = []; return }
            autorizaciones.value = res?.data ?? (Array.isArray(res) ? res : [])
            totalRegistros.value = res?.total ?? autorizaciones.value.length
            totalPaginas.value = res?.totalPages ?? Math.max(1, Math.ceil(totalRegistros.value / limit.value))
        }
    } catch (e) {
        console.error('[Autorizaciones]', e)
        autorizaciones.value = []
    } finally {
        loading.value = false
    }
}

// ── Filtros ────────────────────────────────────────────────────────
const onSedeChange = () => {
    paginaActual.value = 1
    filtros.value.tipo = ''
    filtros.value.sede = filtros.value.sede ? Number(filtros.value.sede) : ''
    cargar()
}

watch(() => filtros.value.tipo, () => {
    paginaActual.value = 1
    // Con sede activa: el filtro tipo es client-side, no recarga
    if (!filtros.value.sede) cargar()
})

// ── Paginación ─────────────────────────────────────────────────────
const irPagina = (p) => {
    if (p < 1 || p > totalPaginasFiltradas.value) return
    paginaActual.value = p
    if (!filtros.value.sede) cargar()
}

const onLimitChange = (val) => {
    limit.value = Number(val)
    paginaActual.value = 1
    if (!filtros.value.sede) cargar()
}

// ── Toggle quincena ────────────────────────────────────────────────
const toggleQuincena = async (a) => {
    const nuevoEstado = !a.Estado
    const { isConfirmed } = await showConfirm({
        title: nuevoEstado ? '¿Habilitar quincena?' : '¿Deshabilitar quincena?',
        text: `Se ${nuevoEstado ? 'habilitará' : 'deshabilitará'} la quincena "${a.NombreAutorizacion}".`,
        confirmText: 'Sí, confirmar',
        cancelText: 'Cancelar',
        icon: 'warning',
    })
    if (!isConfirmed) return

    try {
        const res = await AutorizacionesService.modify(a.IdAutorizacion, a.IdEstacionamiento, {
            Estado: nuevoEstado
        })
        if (res?.error) { showError({ status: res.status, data: res.data }); return }
        showSuccess('Quincena', res?.message ?? 'Estado actualizado correctamente.')
        await cargar()
    } catch (e) {
        console.error('[Toggle quincena]', e)
    }
}

// ── Mount ──────────────────────────────────────────────────────────
onMounted(async () => {
    const [sedesRes] = await Promise.all([SedesService.getAll(), cargar()])
    sedes.value = Array.isArray(sedesRes) ? sedesRes : (sedesRes?.data ?? [])
})

</script>

<style scoped>
.th-cell {
    padding: 14px 20px;
    text-align: left;
    font-size: 0.68rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: white;
    background: #0D291C;
    border-bottom: 3px solid #7FD344;
    white-space: nowrap;
}

@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }
}

.aside-field-label {
    font-size: 0.72rem;
    font-weight: 800;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-left: 2px;
}

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

input[type="checkbox"].sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>