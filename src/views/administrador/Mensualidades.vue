<template>
    <div class="h-full flex flex-col gap-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-4">
            <div class="w-20"></div>
            <h2 class="text-2xl font-bold text-[#232B3A]">Mensualidades</h2>
            <button @click="$router.back()"
                class="flex items-center gap-2 bg-[#7FD344] text-[#232B3A] text-sm font-semibold px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                Volver
            </button>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">

            <div class="flex flex-col gap-1 flex-[2] min-w-[200px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Buscar</label>
                <div class="relative">
                    <input v-model="filtros.search" type="text" placeholder="Nombre, documento o placa..."
                        class="w-full rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all"
                        @input="onFiltroChange" />
                    <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                        fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                </div>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[150px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Sede <span
                        class="text-red-400">*</span></label>
                <select v-model="filtros.sede" @change="onSedeChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option value="">Seleccionar sede</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                        {{ s.Nombre }}
                    </option>
                </select>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Estado</label>
                <select v-model="filtros.estado" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>

        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto flex-1 table-scroll-wrapper">
                <table class="border-collapse min-w-[700px] w-full">
                    <thead>
                        <tr>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Titular</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] sticky left-0 z-10 shadow-[3px_0_8px_rgba(0,0,0,0.12)]">
                                Documento</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Sede
                            </th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Placas</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Vigencia</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Estado</th>
                            <th
                                class="px-5 py-3.5 text-center text-[0.68rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Opciones</th>
                        </tr>
                    </thead>
                    <tbody>



                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="6" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin">
                                    </div>
                                    <span class="text-sm font-medium text-gray-400">Cargando mensualidades...</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Vacío -->
                        <tr v-else-if="mensualidades.length === 0">
                            <td colspan="6" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron mensualidades</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas -->
                        <tr v-else v-for="m in mensualidadesFiltradas" :key="m.IdPersonaAutorizada"
                            class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors group">

                            <!-- Titular -->
                            <td class="px-5 py-3   shadow-[3px_0_8px_rgba(0,0,0,0.07)] transition-colors">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-9 h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-sm flex-shrink-0">
                                        {{ iniciales(m.NombreApellidos) }}
                                    </div>
                                    <span
                                        class="text-sm font-semibold text-[#0D291C] leading-tight max-w-[160px] truncate">
                                        {{ m.NombreApellidos }}
                                    </span>
                                </div>
                            </td>

                            <!-- Documento -->
                            <td
                                class="sticky left-0 bg-white group-hover:bg-[#f0faf4] px-5 py-3 font-mono text-sm text-gray-600 whitespace-nowrap">
                                {{ m.Documento }}
                            </td>

                            <td class="px-5 py-3 whitespace-nowrap">
                                <span
                                    class="text-[0.72rem] font-bold text-[#299261] bg-[#f0faf4] border border-[#c8e6c9] px-2 py-0.5 rounded-full">
                                    {{ m._sedeName || sedeNombre || '—' }}
                                </span>
                            </td>
                            <!-- Placas -->
                            <td class="px-5 py-3">
                                <div class="flex gap-1 flex-wrap">
                                    <span v-for="p in placas(m)" :key="p"
                                        class="inline-block text-[0.6rem] font-black tracking-widest bg-[#0D291C] text-[#7FD344] px-2 py-0.5 rounded-lg">
                                        {{ p }}
                                    </span>
                                    <span v-if="!placas(m).length" class="text-gray-300 text-sm">—</span>
                                </div>
                            </td>



                            <!-- Vigencia -->
                            <td class="px-5 py-3 whitespace-nowrap">
                                <div v-if="m.FechaInicio || m.FechaFin" class="flex flex-col gap-0.5">
                                    <span class="text-[0.72rem] font-semibold text-gray-500">
                                        {{ formatFecha(m.FechaInicio) }} → {{ formatFecha(m.FechaFin) }}
                                    </span>
                                    <span :class="['text-[0.65rem] font-bold', vigenciaClass(m)]">
                                        {{ vigenciaLabel(m) }}
                                    </span>
                                </div>
                                <span v-else class="text-gray-300 text-sm">Sin fechas</span>
                            </td>

                            <!-- Estado -->
                            <td class="px-5 py-3 whitespace-nowrap">
                                <span v-if="m.Estado" class="text-[#299261] font-extrabold text-[0.8rem]">●
                                    Activo</span>
                                <span v-else class="text-red-600 font-extrabold text-[0.8rem]">● Inactivo</span>
                            </td>

                            <!-- Opciones -->
                            <td class="px-5 py-3 text-center">
                                <button @click="abrirDetalle(m)"
                                    class="inline-flex items-center gap-1.5 text-[#7FD344] text-[0.75rem] font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer hover:text-white transition-colors"
                                    title="Ver / Editar">
                                    <span v-html="credit_card_gear"></span>
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div
                class="flex items-center justify-between gap-3 px-5 py-3 border-t-2 border-[#f0f9f4] bg-[#fafffe] flex-wrap">
                <span class="text-xs text-gray-400">
                    Pág. <strong class="text-[#0D291C]">{{ paginaActual }}</strong> de
                    <strong class="text-[#0D291C]">{{ totalPaginas }}</strong>
                    · <strong class="text-[#0D291C]">{{ totalRegistros }}</strong> registros
                </span>
                <div class="flex items-center gap-1">
                    <button @click="irPagina(paginaActual - 1)" :disabled="paginaActual === 1"
                        class="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-transparent text-gray-500 hover:bg-[#e8f5e9] hover:text-[#0D291C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <span class="sm:hidden text-sm font-bold text-[#0D291C] px-2">{{ paginaActual }} / {{ totalPaginas
                    }}</span>
                    <template v-for="p in paginasVisibles" :key="p">
                        <button @click="irPagina(p)"
                            :class="['hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-sm font-bold border-none cursor-pointer transition-colors',
                                paginaActual === p ? 'bg-[#0D291C] text-[#7FD344] shadow-[0_2px_0_rgba(13,41,28,0.3)]' : 'bg-transparent text-gray-500 hover:bg-[#e8f5e9] hover:text-[#0D291C]']">
                            {{ p }}
                        </button>
                    </template>
                    <button @click="irPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas"
                        class="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-transparent text-gray-500 hover:bg-[#e8f5e9] hover:text-[#0D291C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span class="hidden sm:inline">Filas:</span>
                    <select v-model.number="limit" @change="onLimitChange"
                        class="rounded-xl bg-gray-50 border border-gray-200 px-2 py-1 text-xs text-gray-600 outline-none focus:border-[#299261] cursor-pointer">
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- ── Overlay ───────────────────────────────────────────── -->
        <!-- ── Panel mensualidad ─────────────────────────────────────────── -->
        <AsideEditar v-model="panelAbierto" :titulo="detalle?.NombreApellidos ?? '—'"
            :subtitulo="(detalle?.T_Estacionamiento?.Nombre ?? sedeNombre) + ' · Doc. ' + (detalle?.Documento ?? '')"
            label-guardar="Guardar cambios" :loading="guardando || loadingDetalle" :error="errGuardar"
            @guardar="guardar" @update:modelValue="cerrarPanel">

            <!-- Loading skeleton mientras carga el detalle -->
            <template v-if="loadingDetalle">
                <div v-for="i in 5" :key="i" class="h-12 bg-gray-200 rounded-xl animate-pulse" />
            </template>

            <template v-else>

                <!-- Estado + CobroTarjeta -->
                <div class="flex gap-3">
                    <!-- Toggle Estado -->
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
                            <span class="text-[0.78rem] font-black"
                                :class="form.Estado ? 'text-[#299261]' : 'text-red-500'">
                                {{ form.Estado ? '● Activo' : '● Inactivo' }}
                            </span>
                            <span class="text-[0.65rem] text-gray-400 font-medium">Estado mensualidad</span>
                        </div>
                    </label>

                    <!-- CobroTarjeta solo lectura -->
                    <div class="flex items-center gap-2.5 flex-1 p-3.5 bg-white rounded-xl border-2 border-gray-200">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            :class="detalle?.CobroTarjeta ? 'bg-[#dcfce7]' : 'bg-gray-100'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                :class="detalle?.CobroTarjeta ? 'text-[#299261]' : 'text-gray-400'" viewBox="0 0 24 24">
                                <path
                                    d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[0.78rem] font-black"
                                :class="detalle?.CobroTarjeta ? 'text-[#299261]' : 'text-gray-400'">
                                {{ detalle?.CobroTarjeta ? 'Con tarjeta' : 'Sin tarjeta' }}
                            </span>
                            <span class="text-[0.65rem] text-gray-400 font-medium">Cobro tarjeta</span>
                        </div>
                    </div>
                </div>

                <!-- Nombre titular -->
                <div class="flex flex-col gap-1.5">
                    <label class="aside-field-label">Nombre completo</label>
                    <input v-model="form.NombreApellidos" type="text" placeholder="JUAN CARLOS RODRÍGUEZ"
                        class="aside-field-input" />
                </div>

                <!-- NIT + Empresa -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">NIT</label>
                        <input v-model="form.Nit" type="text" placeholder="900123456" class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Empresa</label>
                        <input v-model="form.NombreEmpresa" type="text" placeholder="Empresa SAS"
                            class="aside-field-input" />
                    </div>
                </div>

                <!-- Fechas -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Fecha inicio</label>
                        <input v-model="form.FechaInicio" type="date" class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Fecha fin</label>
                        <input v-model="form.FechaFin" type="date" class="aside-field-input" />
                    </div>
                </div>

                <!-- Placas -->
                <div class="flex flex-col gap-2">
                    <label class="aside-field-label">Vehículos</label>
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="(_, idx) in form.placas" :key="idx" class="flex flex-col gap-1">
                            <label class="text-[0.62rem] font-bold text-gray-400 uppercase tracking-wider pl-1">
                                Placa {{ idx + 1 }}
                            </label>
                            <input v-model="form.placas[idx]" type="text" maxlength="7"
                                class="aside-field-input aside-field-mini uppercase tracking-widest font-bold text-center" />
                        </div>
                    </div>
                </div>

            </template>

        </AsideEditar>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import MensualidadesService from '@/api/services/mensualidades.service'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import credit_card_gear from '@/assets/img/credit_card_gear.svg?raw'

// ── Estado ─────────────────────────────────────────────────────────
const mensualidades = ref([])
const sedes = ref([])
const loading = ref(false)
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)

// Panel
const panelAbierto = ref(false)
const loadingDetalle = ref(false)
const guardando = ref(false)
const errGuardar = ref('')
const detalle = ref(null)

// Filtros
const filtros = reactive({ search: '', sede: '', estado: '' })

const form = reactive({
    NombreApellidos: '',
    Nit: '',
    NombreEmpresa: '',
    FechaInicio: '',
    FechaFin: '',
    Estado: true,
    placas: ['', '', '', '', ''],
})

// ── Computed ───────────────────────────────────────────────────────
const sedeNombre = computed(() =>
    sedes.value.find(s => String(s.IdEstacionamiento) === String(filtros.sede))?.Nombre ?? ''
)

const mensualidadesFiltradas = computed(() => {
    if (!filtros.estado) return mensualidades.value
    return mensualidades.value.filter(m => String(m.Estado) === filtros.estado)
})

const paginasVisibles = computed(() => {
    const total = totalPaginas.value
    const actual = paginaActual.value
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
    const start = Math.max(1, Math.min(actual - 2, total - 4))
    return Array.from({ length: 5 }, (_, i) => start + i)
})

// ── Helpers ────────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre ? nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '??'

const placas = (m) =>
    ['Placa1', 'Placa2', 'Placa3', 'Placa4', 'Placa5'].map(k => m[k]).filter(Boolean)

const formatFecha = (f) => {
    if (!f) return '—'
    return new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const vigenciaClass = (m) => {
    if (!m.FechaFin) return 'text-gray-400'
    const diff = new Date(m.FechaFin) - new Date()
    if (diff < 0) return 'text-red-500'
    if (diff < 86400000 * 7) return 'text-amber-500'
    return 'text-[#299261]'
}

const vigenciaLabel = (m) => {
    if (!m.FechaFin) return ''
    const diff = new Date(m.FechaFin) - new Date()
    if (diff < 0) return 'Vencida'
    if (diff < 86400000 * 7) return 'Por vencer'
    return 'Vigente'
}
const cargarTodasLasMensualidades = async () => {
    if (!sedes.value.length) return
    loading.value = true
    try {
        const resultados = await Promise.all(
            sedes.value.map(s =>
                MensualidadesService.getAllBySede({
                    sede: s.IdEstacionamiento,
                    page: 1,
                    limit: 999,
                })
            )
        )
        // Combina y agrega el nombre de sede a cada mensualidad
        mensualidades.value = resultados.flatMap((res, idx) => {
            const items = res?.data?.data ?? res?.data ?? []
            return items.map(m => ({
                ...m,
                _sedeName: sedes.value[idx]?.Nombre ?? '',
            }))
        })
        totalRegistros.value = mensualidades.value.length
        totalPaginas.value = Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        console.error('[Mensualidades todas]', e.response?.data ?? e.message)
        mensualidades.value = []
    } finally {
        loading.value = false
    }
}

// ── Carga ──────────────────────────────────────────────────────────
const cargarMensualidades = async () => {
    if (!filtros.sede) {
        await cargarTodasLasMensualidades()
        return
    }
    loading.value = true
    try {
        const res = await MensualidadesService.getAllBySede({
            sede: filtros.sede,
            page: paginaActual.value,
            limit: limit.value,
            search: filtros.search,
        })
        mensualidades.value = (res?.data?.data ?? res?.data ?? []).map(m => ({
            ...m,
            _sedeName: sedeNombre.value,
        }))
        totalRegistros.value = res?.data?.total ?? res?.total ?? mensualidades.value.length
        totalPaginas.value = res?.data?.totalPages ?? res?.totalPages ??
            Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        console.error('[Mensualidades]', e.response?.data ?? e.message)
        mensualidades.value = []
    } finally {
        loading.value = false
    }
}

const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    paginaActual.value = p
    cargarMensualidades()
}

const onLimitChange = () => {
    paginaActual.value = 1
    cargarMensualidades()
}

let debTimer = null
const onFiltroChange = () => {
    clearTimeout(debTimer)
    debTimer = setTimeout(() => {
        paginaActual.value = 1
        cargarMensualidades()
    }, 350)
}

const onSedeChange = () => {
    paginaActual.value = 1
    mensualidades.value = []
    cargarMensualidades()
}

onMounted(async () => {
    sedes.value = await SedesService.getAll()
    await cargarTodasLasMensualidades()
})

// ── Panel ──────────────────────────────────────────────────────────
const abrirDetalle = async (m) => {
    panelAbierto.value = true
    loadingDetalle.value = true
    errGuardar.value = ''
    detalle.value = null

    try {
        const res = await MensualidadesService.getDetalleById(m.IdPersonaAutorizada)
        detalle.value = res?.data ?? res

        const d = detalle.value
        Object.assign(form, {
            NombreApellidos: d.NombreApellidos ?? '',
            Nit: d.Nit ?? '',
            NombreEmpresa: d.NombreEmpresa ?? '',
            FechaInicio: d.FechaInicio ? d.FechaInicio.slice(0, 10) : '',
            FechaFin: d.FechaFin ? d.FechaFin.slice(0, 10) : '',
            Estado: d.Estado ?? true,
            placas: [
                d.Placa1 ?? '', d.Placa2 ?? '', d.Placa3 ?? '',
                d.Placa4 ?? '', d.Placa5 ?? '',
            ],
        })
    } catch (e) {
        console.error('[Mensualidades detalle]', e.response?.data ?? e.message)
    } finally {
        loadingDetalle.value = false
    }
}

const cerrarPanel = () => {
    panelAbierto.value = false
    detalle.value = null
    errGuardar.value = ''
    guardando.value = false
}

// ── Guardar ────────────────────────────────────────────────────────
const guardar = async () => {
    errGuardar.value = ''
    guardando.value = true
    try {
        const id = detalle.value?.IdPersonaAutorizada
        const dto = {
            NombreApellidos: form.NombreApellidos || undefined,
            Estado: form.Estado,
            Placa1: form.placas[0] || null,
            Placa2: form.placas[1] || null,
            Placa3: form.placas[2] || null,
            Placa4: form.placas[3] || null,
            Placa5: form.placas[4] || null,
            ...(form.Nit && { Nit: form.Nit }),
            ...(form.NombreEmpresa && { NombreEmpresa: form.NombreEmpresa }),
            ...(form.FechaInicio && { FechaInicio: form.FechaInicio }),
            ...(form.FechaFin && { FechaFin: form.FechaFin }),
        }

        await MensualidadesService.updateById(id, dto)

        // Actualizar fila en tabla localmente
        const idx = mensualidades.value.findIndex(m => m.IdPersonaAutorizada === id)
        if (idx !== -1) {
            mensualidades.value[idx] = {
                ...mensualidades.value[idx],
                NombreApellidos: form.NombreApellidos,
                Estado: form.Estado,
                Placa1: form.placas[0] || null,
                Placa2: form.placas[1] || null,
                FechaInicio: form.FechaInicio || null,
                FechaFin: form.FechaFin || null,
            }
        }
        cerrarPanel()
    } catch (e) {
        const msg = e.response?.data?.message
        errGuardar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar.')
        console.error('[Mensualidades guardar]', e.response?.data ?? e.message)
    } finally {
        guardando.value = false
    }
}
</script>

<style scoped>
/* ── Field helpers para usar dentro del slot del AsideEditar ─────── */
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

.aside-field-mini {
    padding-top: 7px;
    padding-bottom: 7px;
    font-size: 0.82rem;
}

/* ── Toggle switch ────────────────────────────────────────────────── */
input[type="checkbox"].sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
}

/* ── Tabla mobile: max 5 filas visibles con scroll ────────────────── */
@media (max-width: 640px) {
    .table-scroll-wrapper {
        max-height: calc(5 * 56px + 44px);
        overflow-y: auto;
    }

    .td-nombre-truncate {
        max-width: 100px !important;
    }
}

/* ── Transición overlay del aside (ya la maneja el componente) ────── */
.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.25s;
}
</style>