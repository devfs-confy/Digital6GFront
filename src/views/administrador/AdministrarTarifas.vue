<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Tarifas" />

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">



            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Sede</label>
                <select v-model="filtros.idSede" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option :value="null">Todas</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                        {{ s.Nombre }}
                    </option>
                </select>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Vehículo</label>
                <select v-model="filtros.idTipoVehiculo" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option :value="null">Todos</option>
                    <option v-for="t in catTiposVehiculo" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                </select>
            </div>


            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Autorización</label>
                <select v-model="filtros.idAutorizacion" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option :value="null">Todas</option>
                    <option v-for="a in catAutorizacionesFiltradas" :key="a.id" :value="a.id">
                        {{ a.nombre }}
                    </option>
                </select>
            </div>

            <button v-if="hayFiltros" @click="limpiarFiltros"
                class="self-end px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-50 border-[1.5px] border-gray-200 rounded-full hover:border-[#299261] hover:text-[#299261] transition-all whitespace-nowrap">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="border-collapse min-w-[760px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell th-cell--sticky w-[60px]">
                                #</th>
                            <th class="th-cell">
                                Sede</th>
                            <th class="th-cell">
                                Vehículo</th>
                            <!-- <th
                                class="th-cell">
                                Tipo pago</th> -->
                            <th class="th-cell">
                                Autorización</th>
                            <th class="th-cell">
                                Valor</th>
                            <th class="th-cell">
                                Estado</th>
                            <th class="th-cell th-cell--center">
                                Opciones</th>
                        </tr>
                    </thead>
                    <tbody>


                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="7" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin">
                                    </div>
                                    <span class="text-sm font-medium text-gray-400">Cargando tarifas...</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Vacío -->
                        <tr v-else-if="tarifas.length === 0">
                            <td colspan="7" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="attach_money" :size="48" class="text-gray-300" />

                                    <span class="text-sm font-medium">No se encontraron tarifas</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas -->
                        <tr v-else v-for="t in tarifas" :key="t.IdTarifa"
                            class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors group">

                            <td class="td-cell  w-[60px] font-mono font-bold group-hover:bg-[#f0faf4]">
                                {{ t.IdTarifa }}
                            </td>

                            <td class="td-cell td-cell--sticky w-[200px] ">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                                    {{sedes.find(s => String(s.IdEstacionamiento) ===
                                        String(t.IdEstacionamiento))?.Nombre ?? `Sede ${t.IdEstacionamiento}`}}
                                </span>
                            </td>

                            <td class="td-cell">
                                <div
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                    <AppIcon name="car-side" :size="12" />

                                    {{ String(t.IdTipoVehiculo) === '1' ? 'Carro' : 'Moto' }}
                                </div>
                            </td>

                            <!-- <td class="px-5 py-3 text-sm whitespace-nowrap">
                                <div
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200">
                                    <AppIcon name="payment_card" :size="12" />

                                    {{ t.TipoCobro }}
                                </div>
                            </td> -->

                            <td class="td-cell">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-violet-50 text-violet-800 border border-violet-200">
                                    {{ t.T_Autorizacion?.NombreAutorizacion ?? '—' }}
                                </span>
                            </td>

                            <td class="td-cell">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[0.78rem] font-black bg-[#0D291C] text-[#7FD344] tracking-wide">
                                    ${{ Number(t.Valor).toLocaleString('es-CO') }}
                                </span>
                            </td>

                            <td class="td-cell">
                                <span v-if="t.Estado" class="text-[#299261] font-extrabold text-[0.8rem]">●
                                    Activo</span>
                                <span v-else class="text-red-600 font-extrabold text-[0.8rem]">● Inactivo</span>
                            </td>
                            <td class="td-cell td-cell--center">
                                <button v-permission="'EDITAR-TARIFAS'" @click="abrirEditar(t)"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.72rem] font-bold text-[#0D291C]  transition-all">
                                    <AppIcon name="car_tag" :size="30" />

                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <TablePagination :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>
    </div>


    <AsideEditar v-model="modalEditar" :titulo="`Tarifa #${tarifaActual?.IdTarifa ?? ''}`" subtitulo="Configurar valor"
        label-guardar="Guardar tarifa" :loading="guardando" :error="errEditar" @guardar="guardarTarifa"
        @update:modelValue="v => { if (!v) { modalEditar = false; errEditar = '' } }">

        <div class="flex flex-wrap gap-2 pb-3 border-b border-gray-100">
            <span
                class="px-2.5 py-1 rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                {{sedes.find(s => String(s.IdEstacionamiento) === String(tarifaActual?.IdEstacionamiento))?.Nombre ??
                    '—'}}
            </span>
            <span
                class="px-2.5 py-1 rounded-full text-[0.72rem] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {{ String(tarifaActual?.IdTipoVehiculo) === '1' ? 'Carro' : 'Moto' }}
            </span>
            <span
                class="px-2.5 py-1 rounded-full text-[0.72rem] font-bold bg-violet-50 text-violet-800 border border-violet-200">
                {{ tarifaActual?.T_Autorizacion?.NombreAutorizacion ?? '—' }}
            </span>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-[0.72rem] font-extrabold text-gray-600 uppercase tracking-[0.05em] pl-0.5">
                Valor <span class="text-red-400">*</span>
            </label>
            <input v-model.number="formEditar.Valor" type="number" min="0" placeholder="50000"
                class="aside-field-input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>

        <div class="flex flex-col gap-[3px] px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
            <span class="text-[0.6rem] font-black uppercase tracking-wide text-gray-400">Valor actual</span>
            <span class="text-[1rem] font-black text-[#0D291C] font-mono">
                ${{ Number(tarifaActual?.Valor ?? 0).toLocaleString('es-CO') }}
            </span>
        </div>

    </AsideEditar>
    <!-- ───── MODAL: CONFIRMAR ACTUALIZACIÓN ───── -->
    <Transition name="modal">
        <div v-if="modalConfirmar"
            class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
            @click.self="modalConfirmar = false">
            <div class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[400px] flex flex-col overflow-hidden"
                style="box-shadow: 0 7px 0 #0D291C">

                <!-- Head -->
                <div
                    class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                    <div class="flex items-center gap-3 min-w-0">
                        <div
                            class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344]">
                            <AppIcon name="warning" :size="20" />
                        </div>
                        <div>
                            <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">Confirmar
                                actualización</p>
                            <p class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                Tarifa #{{ tarifaActual?.IdTarifa }} · {{sedes.find(s => String(s.IdEstacionamiento)
                                    === String(tarifaActual?.IdEstacionamiento))?.Nombre ?? '—'}}
                            </p>
                        </div>
                    </div>
                    <button @click="modalConfirmar = false"
                        class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                </div>

                <!-- Body -->
                <div class="px-6 py-5 flex flex-col gap-4">
                    <p class="text-[0.9rem] font-semibold text-[#0D291C] text-center leading-relaxed">
                        ¿Estás seguro que deseas realizar la actualización de la tarifa?
                    </p>

                    <!-- Comparativa de valores -->
                    <div class="grid grid-cols-2 gap-2.5">
                        <div
                            class="flex flex-col gap-[3px] px-3.5 py-2.5 bg-[#f0faf4] rounded-[14px] border-[1.5px] border-[#e8f5e9]">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wide text-[#0D291C] opacity-50">Valor
                                actual</span>
                            <span class="text-[1rem] font-black text-[#0D291C] font-mono">
                                ${{ Number(tarifaActual?.Valor ?? 0).toLocaleString('es-CO') }}
                            </span>
                        </div>
                        <div
                            class="flex flex-col gap-[3px] px-3.5 py-2.5 bg-[#0D291C] rounded-[14px] border-[1.5px] border-[#0D291C]">
                            <span
                                class="text-[0.6rem] font-black uppercase tracking-wide text-[#7FD344] opacity-70">Nuevo
                                valor</span>
                            <span class="text-[1rem] font-black text-[#7FD344] font-mono">
                                ${{ Number(formEditar.Valor ?? 0).toLocaleString('es-CO') }}
                            </span>
                        </div>
                    </div>

                    <!-- Pills de contexto -->
                    <div class="flex flex-wrap gap-1.5">
                        <span
                            class="px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                            {{sedes.find(s => String(s.IdEstacionamiento) ===
                                String(tarifaActual?.IdEstacionamiento))?.Nombre ?? '—'}}
                        </span>
                        <span
                            class="px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            {{ String(tarifaActual?.IdTipoVehiculo) === '1' ? 'Carro' : 'Moto' }}
                        </span>
                        <span
                            class="px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-violet-50 text-violet-800 border border-violet-200">
                            {{ tarifaActual?.T_Autorizacion?.NombreAutorizacion ?? '—' }}
                        </span>
                    </div>
                </div>

                <!-- Foot -->
                <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                    <button @click="modalConfirmar = false"
                        class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                    <button @click="confirmarGuardarTarifa" :disabled="guardando" class="btn-modal-dark">
                        <span v-if="guardando"
                            class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                        {{ guardando ? 'Guardando...' : 'Confirmar' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import TarifasService from '@/api/services/tarifas.service'
import SedesService from '@/api/services/sedes.service'
import TablePagination from '@/components/shared/Paginacion.vue'
import AsideEditar from '@/components/aside/AsideEditar.vue'

const tarifas = ref([])
const todasLasTarifas = ref([])
const loading = ref(true)
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)
const sedes = ref([])

const catTiposVehiculo = ref([])
const catAutorizaciones = ref([])

const filtros = reactive({
    idSede: null,
    idTipoVehiculo: null,
    idAutorizacion: null,
})

const modalEditar = ref(false)
const tarifaActual = ref(null)
const guardando = ref(false)
const errEditar = ref('')
const formEditar = reactive({ Valor: 0 })


const modalConfirmar = ref(false)

// El AsideEditar ahora abre el modal de confirmación


// Este es el que realmente llama a la API
const confirmarGuardarTarifa = async () => {
    guardando.value = true
    try {
        await TarifasService.update(tarifaActual.value.IdTarifa, formEditar.Valor)
        modalConfirmar.value = false
        cargarTarifas()
    } catch (e) {
        errEditar.value = e?.response?.data?.message ?? 'Error al guardar'
        modalConfirmar.value = false
        modalEditar.value = true  // reabre el aside con el error
    } finally {
        guardando.value = false
    }
}
const abrirEditar = (tarifa) => {
    tarifaActual.value = tarifa
    formEditar.Valor = tarifa.Valor
    errEditar.value = ''
    modalEditar.value = true
}


const guardarTarifa = async () => {
    if (!formEditar.Valor || formEditar.Valor <= 0) {
        errEditar.value = 'El valor debe ser mayor a 0'
        return
    }
    errEditar.value = ''
    modalEditar.value = false
    modalConfirmar.value = true
}



const hayFiltros = computed(() =>
    filtros.idSede || filtros.idTipoVehiculo || filtros.idAutorizacion
)

const catAutorizacionesFiltradas = computed(() => {
    if (!filtros.idSede) return catAutorizaciones.value
    const authMap = new Map()
    todasLasTarifas.value
        .filter(t => String(t.IdEstacionamiento) === String(filtros.idSede))
        .forEach(t => {
            if (t.IdAutorizacion && !authMap.has(t.IdAutorizacion)) {
                authMap.set(t.IdAutorizacion, {
                    id: t.IdAutorizacion,
                    nombre: t.T_Autorizacion?.NombreAutorizacion ?? `Auth ${t.IdAutorizacion}`,
                })
            }
        })
    return [...authMap.values()]
})

watch(() => filtros.idSede, () => {
    const sigueExistiendo = catAutorizacionesFiltradas.value
        .some(a => String(a.id) === String(filtros.idAutorizacion))
    if (!sigueExistiendo) filtros.idAutorizacion = null
    paginaActual.value = 1
    cargarTarifas()
})

// Carga TODOS los registros una sola vez para poblar catálogos
const cargarCatalogos = async () => {
    try {
        const res = await TarifasService.getAll({ limit: 500 })
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])
        todasLasTarifas.value = data

        const vehiculosMap = new Map()
        const authMap = new Map()

        data.forEach(t => {
            if (!vehiculosMap.has(t.IdTipoVehiculo))
                vehiculosMap.set(t.IdTipoVehiculo, {
                    id: t.IdTipoVehiculo,
                    nombre: String(t.IdTipoVehiculo) === '1' ? 'Carro' : 'Moto',
                })

            if (t.IdAutorizacion && !authMap.has(t.IdAutorizacion))
                authMap.set(t.IdAutorizacion, {
                    id: t.IdAutorizacion,
                    nombre: t.T_Autorizacion?.NombreAutorizacion ?? `Auth ${t.IdAutorizacion}`,
                })
        })

        catTiposVehiculo.value = [...vehiculosMap.values()]
        catAutorizaciones.value = [...authMap.values()]
    } catch (e) {
        console.error('[cargarCatalogos]', e.response?.data ?? e.message)
    }
}

const cargarTarifas = async () => {
    loading.value = true
    try {
        const params = { page: paginaActual.value, limit: limit.value }
        if (filtros.idSede) params.idSede = filtros.idSede
        if (filtros.idTipoVehiculo) params.idTipoVehiculo = filtros.idTipoVehiculo
        if (filtros.idAutorizacion) params.idAutorizacion = filtros.idAutorizacion

        const res = await TarifasService.getAll(params)
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])

        tarifas.value = data
        totalRegistros.value = res.total ?? res.count ?? data.length
        totalPaginas.value = res.totalPages ?? res.pages ??
            Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        console.error('[Tarifas]', e.response?.data ?? e.message)
        tarifas.value = []
    } finally {
        loading.value = false
    }
}

let debTimer = null
const onFiltroChange = () => {
    clearTimeout(debTimer)
    debTimer = setTimeout(() => {
        paginaActual.value = 1
        cargarTarifas()
    }, 350)
}

const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    paginaActual.value = p
    cargarTarifas()
}

const onLimitChange = (val) => {
    limit.value = val
    paginaActual.value = 1
    cargarTarifas()
}

const limpiarFiltros = () => {
    Object.assign(filtros, { idSede: null, idTipoVehiculo: null, idAutorizacion: null })
    paginaActual.value = 1
    cargarTarifas()
}

onMounted(() => {
    Promise.all([
        cargarCatalogos(),
        cargarTarifas(),
        SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) }),
    ])
})
</script>

<style>
.aside-field-input {
    border: 2px solid #d1d5db !important;
    border-radius: 0.75rem !important;
    padding: 0.625rem 0.75rem !important;
    font-size: 0.88rem !important;
    color: #0D291C !important;
    outline: none !important;
    width: 100%;
    box-sizing: border-box;
    background-color: white !important;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.aside-field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
}

.btn-modal-dark {
    flex: 1;
    background-color: #0D291C;
    color: #7FD344;
    border: 2.5px solid #0D291C;
    border-radius: 14px;
    padding: 12px 20px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 4px 0 #050e09;
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-modal-dark:hover:not(:disabled) {
    background-color: #1a4a2e;
}

.btn-modal-dark:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #050e09;
}

.btn-modal-dark:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-modal-dark--cancel {
    background-color: rgba(13, 41, 28, 0.12);
    color: #0D291C;
    box-shadow: 0 4px 0 rgba(13, 41, 28, 0.2);
}

.btn-modal-dark--cancel:hover {
    background-color: rgba(13, 41, 28, 0.2);
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

@media (max-width:780px) {
    .shadow-sm {
        height: auto;
    }

    .maincontainer {
        height: auto;
    }

    .td-cell--sticky {
        min-width: auto;
    }
}
</style>