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
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Autorizaciones</h2>
            <div class="w-[72px] sm:w-[88px]" />
        </div>

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

                        <!-- Sin sede seleccionada -->
                        <tr v-else-if="!filtros.sede">
                            <td colspan="7" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="location_city" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium text-gray-400">Selecciona una sede para ver sus
                                        autorizaciones</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Vacío con sede seleccionada -->
                        <tr v-else-if="autorizacionesFiltradas.length === 0">
                            <td colspan="7" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="key_off" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium text-gray-300">No se encontraron
                                        autorizaciones</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas -->
                        <tr v-else v-for="a in autorizacionesFiltradas"
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
                                        class="inline-flex items-center cursor-pointer"
                                        :title="a.Estado ? 'Deshabilitar quincena' : 'Habilitar quincena'">
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

                        </tr>
                    </tbody>
                </table>
            </div>
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>



    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AutorizacionesService from '@/api/services/autorizaciones.service'
import SedesService from '@/api/services/sedes.service'
import { showConfirm, showSuccess, showError } from '@/utils/swal'
import TablePaginacion from '@/components/shared/Paginacion.vue'

// ── Estado ─────────────────────────────────────────────────────────
const autorizaciones = ref([])
const sedes = ref([])
const loading = ref(false)
const filtros = ref({ sede: '', tipo: '' })
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)

// ── Computed ───────────────────────────────────────────────────────
const autorizacionesFiltradas = computed(() => {
    let lista = autorizaciones.value

    if (filtros.value.tipo)
        lista = lista.filter(a => String(a.IdTipo) === filtros.value.tipo)

    totalRegistros.value = lista.length
    totalPaginas.value = Math.max(1, Math.ceil(lista.length / limit.value))

    const desde = (paginaActual.value - 1) * limit.value
    return lista.slice(desde, desde + limit.value)
})

// ── Helpers ────────────────────────────────────────────────────────
const sedeNombre = (idSede) =>
    sedes.value.find(s => String(s.IdEstacionamiento) === String(idSede))?.Nombre ?? `Sede ${idSede}`

// ── Carga ──────────────────────────────────────────────────────────
const cargar = async () => {
    if (!filtros.value.sede) {
        autorizaciones.value = []
        return
    }
    loading.value = true
    try {
        const res = await AutorizacionesService.getBySede(filtros.value.sede)
        autorizaciones.value = res?.data ?? res ?? []
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
    cargar()
}

// ── Paginación ─────────────────────────────────────────────────────
const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    paginaActual.value = p
}

const onLimitChange = (val) => {
    limit.value = Number(val)
    paginaActual.value = 1
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
        const res = await AutorizacionesService.enableAutorizacion(a.IdEstacionamiento, nuevoEstado)
        if (res?.error) {
            showError({ status: res.status, data: res.data })
            return
        }
        showSuccess('Quincena', res?.message ?? 'Estado actualizado correctamente.')
        await cargar()
    } catch (e) {
        console.error('[Toggle quincena]', e)
    }
}

// ── Mount ──────────────────────────────────────────────────────────
onMounted(async () => {
    sedes.value = await SedesService.getAll()
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
</style>