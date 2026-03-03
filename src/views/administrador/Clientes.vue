<template>
    <div class="h-full flex flex-col gap-6">

        <!-- Header -->
        <div class="flex items-center justify-between relative bg-white rounded-full p-4">
            <div class="w-[80px]"></div>
            <h2 class="text-2xl font-bold text-[#232B3A]">Clientes</h2>
            <div class="back-btn flex items-center gap-2 bg-[#7FD344] text-[#232B3A] text-sm px-4 py-2 rounded-full">
                <button @click="$router.back()">Volver</button>
            </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 filters-bar">
            <div class="filter-field filter-field--search">
                <label class="filter-label">Buscar</label>
                <input v-model="busqueda" type="text" placeholder="Nombre o documento..." class="search-input w-full" />
            </div>
            <div class="filter-field">
                <label class="filter-label">Sede</label>
                <select v-model="filtroSede" @change="cargarClientes">
                    <option value="">Todas las sedes</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                        {{ s.Nombre }}
                    </option>
                </select>
            </div>
            <div class="filter-field">
                <label class="filter-label">Estado</label>
                <select v-model="filtroEstado">
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>
            <button v-if="busqueda || filtroSede || filtroEstado" @click="limpiarFiltros" class="filter-clear-btn">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="th-cell th-cell--sticky">Cliente</th>
                            <th class="th-cell">Documento</th>
                            <th class="th-cell">Correo</th>
                            <th class="th-cell">Teléfono</th>
                            <th class="th-cell">Placas</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell th-cell--actions">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="7" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando clientes...</span>
                                </div>
                            </td>
                        </tr>

                        <tr v-else-if="clientesPaginados.length === 0">
                            <td colspan="7" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron clientes</span>
                                </div>
                            </td>
                        </tr>

                        <tr v-else v-for="cliente in clientesPaginados" :key="cliente.Documento" class="table-row">

                            <td class="td-cell td-cell--sticky">
                                <div class="flex items-center gap-3">
                                    <div class="row-avatar">{{ iniciales(cliente.Nombres) }}</div>
                                    <div class="flex flex-col items-start min-w-0">
                                        <span class="font-semibold text-[#0D291C] leading-tight truncate max-w-[140px]">
                                            {{ cliente.Nombres }} {{ cliente.Apellidos }}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <td class="td-cell font-mono tracking-wide">{{ cliente.Documento }}</td>

                            <td class="td-cell">
                                <span class="sede-badge">{{ cliente.Email }}</span>
                            </td>

                            <td class="td-cell">{{ cliente.Telefono ?? '—' }}</td>

                            <td class="td-cell">
                                <div class="flex gap-1 flex-wrap">
                                    <span v-for="p in placasCliente(cliente)" :key="p"
                                        class="inline-block text-[0.6rem] font-black tracking-widest bg-[#0D291C] text-[#7FD344] px-2 py-0.5 rounded-lg">
                                        {{ p }}
                                    </span>
                                    <span v-if="!placasCliente(cliente).length" class="text-gray-300">—</span>
                                </div>
                            </td>

                            <td class="td-cell">
                                <span v-if="cliente.Estado" class="estado-badge-activo">● Activo</span>
                                <span v-else class="estado-badge-inactivo">● Inactivo</span>
                            </td>

                            <td class="td-cell td-cell--actions">
                                <div class="flex items-center justify-center gap-1">
                                    <!-- Editar -->
                                    <button @click="abrirEditar(cliente)" class="action-btn" title="Editar">
                                        <p v-html="editarcliente"></p>
                                    </button>
                                    <!-- Inhabilitar / Activar -->
                                    <button @click="abrirCambioEstado(cliente)"
                                        :class="['action-btn', cliente.Estado ? 'action-btn--danger' : 'action-btn--activate']"
                                        :title="cliente.Estado ? 'Inhabilitar' : 'Activar'">
                                        <p v-html="cliente.Estado ? inhabilitarSvg : activarSvg"></p>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div class="table-foot">
                <span class="foot-counter">
                    <strong>{{ rangoInicio }}–{{ rangoFin }}</strong> de <strong>{{ clientesFiltrados.length }}</strong>
                </span>
                <div class="flex items-center gap-1">
                    <button @click="paginaActual--" :disabled="paginaActual === 1" class="page-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <span class="page-mobile-indicator">{{ paginaActual }} / {{ totalPaginas }}</span>
                    <template v-for="p in totalPaginas" :key="p">
                        <button @click="paginaActual = p"
                            :class="['page-btn page-btn--num', paginaActual === p ? 'page-btn--active' : '']">
                            {{ p }}
                        </button>
                    </template>
                    <button @click="paginaActual++" :disabled="paginaActual === totalPaginas" class="page-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span class="hidden sm:inline">Filas:</span>
                    <select v-model.number="itemsPorPagina" @change="paginaActual = 1" class="paginator-select">
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="15">15</option>
                    </select>
                </div>
            </div>
        </div>


        <!-- ════════════════════════════════════════════════════════ -->
        <!-- MODAL NUEVO CLIENTE                                      -->
        <!-- ════════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalNuevo" class="modal-overlay" @click.self="modalNuevo = false">
                <div class="modal-card modal-card--wide">
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-avatar">+</div>
                            <div>
                                <p class="modal-head__name">Nuevo cliente</p>
                                <p class="modal-head__sub">Completa los datos de registro</p>
                            </div>
                        </div>
                        <button @click="modalNuevo = false" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <p class="modal-section-label">Datos personales</p>
                        <div class="modal-grid">
                            <div class="field-group">
                                <label class="field-label">Documento *</label>
                                <input v-model="fN.Documento" type="text" class="field-input"
                                    placeholder="1098617878" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Sede *</label>
                                <select v-model="fN.IdEstacionamiento" class="field-input">
                                    <option value="">Seleccionar</option>
                                    <option v-for="s in sedes" :key="s.IdEstacionamiento"
                                        :value="Number(s.IdEstacionamiento)">
                                        {{ s.Nombre }}</option>
                                </select>
                            </div>
                            <div class="field-group">
                                <label class="field-label">Nombres *</label>
                                <input v-model="fN.Nombres" type="text" class="field-input" placeholder="Juan Felipe" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Apellidos *</label>
                                <input v-model="fN.Apellidos" type="text" class="field-input"
                                    placeholder="García Ospina" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Teléfono *</label>
                                <input v-model="fN.Telefono" type="text" class="field-input" placeholder="3001234567" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Email *</label>
                                <input v-model="fN.Email" type="email" class="field-input"
                                    placeholder="correo@ejemplo.com" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Contraseña *</label>
                                <div class="relative">
                                    <input v-model="fN.Password" :type="verPass ? 'text' : 'password'"
                                        class="field-input pr-10" placeholder="••••••••" />
                                    <button type="button" @click="verPass = !verPass"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 opacity-50 hover:opacity-100 transition-opacity">
                                        <svg v-if="!verPass" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="#0D291C">
                                            <path
                                                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="#0D291C">
                                            <path
                                                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="field-group">
                                <label class="field-label">ID Autorización</label>
                                <input v-model.number="fN.IdAutorizacion" type="number" class="field-input"
                                    placeholder="123" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Fecha inicio</label>
                                <input v-model="fN.FechaInicio" type="date" class="field-input" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Fecha fin</label>
                                <input v-model="fN.FechaFin" type="date" class="field-input" />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-x-5 gap-y-2 mt-1">
                            <label class="check-label"><input type="checkbox" v-model="fN.Estado"
                                    class="check" /><span>Activo</span></label>
                            <label class="check-label"><input type="checkbox" v-model="fN.EstudianteUcc"
                                    class="check" /><span>Estudiante UCC</span></label>
                            <label class="check-label"><input type="checkbox" v-model="fN.Old"
                                    class="check" /><span>Registro
                                    antiguo</span></label>
                            <label class="check-label"><input type="checkbox" v-model="fN.Sincronizacion"
                                    class="check" /><span>Sincronizado</span></label>
                        </div>

                        <div v-if="fN.EstudianteUcc" class="field-group mt-2">
                            <label class="field-label">Código estudiante UCC</label>
                            <input v-model="fN.CodigoEstudianteUCC" type="text" class="field-input"
                                placeholder="765432" />
                        </div>

                        <p class="modal-section-label">Vehículos</p>
                        <div class="modal-grid">
                            <div v-for="(_, idx) in fN.placas" :key="idx" class="field-group">
                                <label class="field-label">Placa {{ idx + 1 }}{{ idx === 0 ? ' *' : '' }}</label>
                                <div class="flex gap-2 items-center">
                                    <input v-model="fN.placas[idx]" type="text" class="field-input placa-input flex-1"
                                        :placeholder="`ABC${idx + 1}23`" maxlength="6" />
                                    <button v-if="fN.placas.length > 1" type="button" @click="fN.placas.splice(idx, 1)"
                                        class="w-8 h-8 rounded-xl bg-red-100 border-none flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                            viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button v-if="fN.placas.length < 5" type="button" @click="fN.placas.push('')"
                            class="self-start flex items-center gap-1.5 text-[0.75rem] font-bold text-[#0D291C] hover:text-[#299261] transition-colors border-none bg-transparent p-0 cursor-pointer mt-1">
                            <span class="w-5 h-5 rounded-lg bg-[#0D291C] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                                    fill="#7FD344">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                            </span>
                            Agregar placa
                        </button>

                        <div v-if="errNuevo" class="err-box">⚠ {{ errNuevo }}</div>
                    </div>

                    <div class="modal-foot">
                        <button @click="modalNuevo = false"
                            class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button @click="crearCliente" :disabled="guardandoN" class="btn-modal-dark">
                            <span v-if="guardandoN"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin mr-1" />
                            {{ guardandoN ? 'Creando...' : 'Crear cliente' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>


        <!-- ════════════════════════════════════════ -->
        <!-- MODAL EDITAR                             -->
        <!-- ════════════════════════════════════════ -->
        <ModalEditar v-model="modalEditar" :cliente="clienteAccion" @guardar="editarCliente">
            <p class="modal-section-label">Datos personales</p>
            <div class="modal-grid">
                <div class="field-group">
                    <label class="field-label">Nombres *</label>
                    <input v-model="fE.Nombres" type="text" class="field-input" placeholder="Juan Felipe" />
                </div>
                <div class="field-group">
                    <label class="field-label">Apellidos *</label>
                    <input v-model="fE.Apellidos" type="text" class="field-input" placeholder="García Ospina" />
                </div>
                <div class="field-group">
                    <label class="field-label">Correo electrónico *</label>
                    <input v-model="fE.Email" type="email" class="field-input" placeholder="correo@ejemplo.com" />
                </div>
                <div class="field-group">
                    <label class="field-label">Teléfono *</label>
                    <input v-model="fE.Telefono" type="text" class="field-input" placeholder="3001234567"
                        @input="fE.Telefono = $event.target.value.replace(/\D/g, '')" />
                </div>
            </div>
            <div class="flex flex-wrap gap-x-5 gap-y-2">
                <label class="check-label">
                    <input type="checkbox" v-model="fE.Estado" class="check" />
                    <span>Cliente activo</span>
                </label>
            </div>
            <div v-if="errEditar" class="err-box">⚠ {{ errEditar }}</div>
        </ModalEditar>

        <!-- ════════════════════════════════════════ -->
        <!-- MODAL INHABILITAR / ACTIVAR             -->
        <!-- ════════════════════════════════════════ -->
        <ModalInhabilitar v-model="modalEstado" :cliente="clienteAccion" @confirmar="cambiarEstado" />

    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import editarcliente from '@/assets/img/person_edit.svg?raw'
import inhabilitarSvg from '@/assets/img/account_circle_off.svg?raw'
import activarSvg from '@/assets/img/how_to_reg.svg?raw'
import ClientService from '@/api/services/client.service'
import SedesService from '@/api/services/sedes.service'
import ModalEditar from '@/components/modals/ModalEditar.vue'
import ModalInhabilitar from '@/components/modals/ModalInhabilitar.vue'

// ── Estado ─────────────────────────────────────────────────────────
const clientes = ref([])
const sedes = ref([])
const loading = ref(true)
const busqueda = ref('')
const busquedaDebounced = ref('')
const filtroSede = ref('')
const filtroEstado = ref('')
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

// Modales
const modalNuevo = ref(false)
const modalEditar = ref(false)
const modalEstado = ref(false)
const clienteAccion = ref(null)
const verPass = ref(false)

// Guardado
const guardandoN = ref(false)
const guardandoE = ref(false)
const guardandoEstado = ref(false)
const errNuevo = ref('')
const errEditar = ref('')
const errEstado = ref('')

// ── Formularios ────────────────────────────────────────────────────
const fN = reactive({
    Documento: '', IdEstacionamiento: '', Nombres: '', Apellidos: '',
    Telefono: '', Email: '', Password: '', IdAutorizacion: null,
    FechaInicio: '', FechaFin: '', Estado: true, EstudianteUcc: false,
    CodigoEstudianteUCC: '', Old: false, Sincronizacion: false,
    placas: [''],
})

// fE ahora incluye todos los campos editables del endpoint PUT /{doc}
const fE = reactive({
    Nombres: '', Apellidos: '', Email: '', Telefono: '', Estado: true,
})

// ── Computed ───────────────────────────────────────────────────────
const listaClientes = computed(() =>
    Array.isArray(clientes.value) ? clientes.value : (clientes.value?.data ?? [])
)

const clientesFiltrados = computed(() => {
    const q = busquedaDebounced.value.toLowerCase()
    return listaClientes.value.filter(c => {
        const nombre = `${c.Nombres ?? ''} ${c.Apellidos ?? ''}`.toLowerCase()
        const doc = String(c.Documento ?? '').toLowerCase()
        const matchQ = !q || nombre.includes(q) || doc.includes(q)
        const matchE = filtroEstado.value === '' || String(c.Estado) === filtroEstado.value
        return matchQ && matchE
    })
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(clientesFiltrados.value.length / itemsPorPagina.value)))
const clientesPaginados = computed(() => {
    const ini = (paginaActual.value - 1) * itemsPorPagina.value
    return clientesFiltrados.value.slice(ini, ini + itemsPorPagina.value)
})
const rangoInicio = computed(() => clientesFiltrados.value.length === 0 ? 0 : (paginaActual.value - 1) * itemsPorPagina.value + 1)
const rangoFin = computed(() => Math.min(paginaActual.value * itemsPorPagina.value, clientesFiltrados.value.length))

// ── Debounce ───────────────────────────────────────────────────────
let debTimer = null
watch(busqueda, val => {
    clearTimeout(debTimer)
    debTimer = setTimeout(() => { busquedaDebounced.value = val; paginaActual.value = 1 }, 300)
})
watch([filtroEstado], () => { paginaActual.value = 1 })

// ── Helpers ────────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre ? nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '??'

const placasCliente = (c) =>
    ['Placa1', 'Placa2', 'Placa3', 'Placa4', 'Placa5']
        .map(k => c[k]).filter(Boolean)

// ── Carga ──────────────────────────────────────────────────────────
const cargarClientes = async () => {
    loading.value = true
    try {
        const params = filtroSede.value ? { sede: filtroSede.value } : {}
        clientes.value = await ClientService.getAllClients(params)
    } catch (e) {
        console.error('[Clientes]', e.response?.data ?? e.message)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await Promise.all([
        cargarClientes(),
        SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) }),
    ])
})

// ── Limpiar filtros ────────────────────────────────────────────────
const limpiarFiltros = () => {
    busqueda.value = ''
    busquedaDebounced.value = ''
    filtroSede.value = ''
    filtroEstado.value = ''
    paginaActual.value = 1
    cargarClientes()
}

// ── Modal Nuevo ────────────────────────────────────────────────────
const abrirNuevo = () => {
    errNuevo.value = ''
    verPass.value = false
    Object.assign(fN, {
        Documento: '', IdEstacionamiento: '', Nombres: '', Apellidos: '',
        Telefono: '', Email: '', Password: '', IdAutorizacion: null,
        FechaInicio: '', FechaFin: '', Estado: true, EstudianteUcc: false,
        CodigoEstudianteUCC: '', Old: false, Sincronizacion: false, placas: [''],
    })
    modalNuevo.value = true
}

const crearCliente = async () => {
    errNuevo.value = ''
    if (!fN.Documento || !fN.Nombres || !fN.Apellidos || !fN.Email || !fN.Telefono || !fN.Password) {
        errNuevo.value = 'Completa todos los campos obligatorios (*).'; return
    }
    guardandoN.value = true
    try {
        const { placas, ...rest } = fN
        await ClientService.createClient({
            ...rest,
            IdEstacionamiento: Number(rest.IdEstacionamiento) || 0,
            Placa1: placas[0] || null, Placa2: placas[1] || null,
            Placa3: placas[2] || null, Placa4: placas[3] || null, Placa5: placas[4] || null,
        })
        await cargarClientes()
        modalNuevo.value = false
    } catch (e) {
        const msg = e.response?.data?.message
        errNuevo.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al crear el cliente.')
    } finally {
        guardandoN.value = false
    }
}

// ── Modal Editar ───────────────────────────────────────────────────
const abrirEditar = (c) => {
    clienteAccion.value = c
    // Precarga todos los campos editables del endpoint PUT /{doc}
    Object.assign(fE, {
        Nombres: c.Nombres ?? '',
        Apellidos: c.Apellidos ?? '',
        Email: c.Email ?? '',
        Telefono: String(c.Telefono ?? ''),  // ← forzar string
        Estado: c.Estado ?? true,
    })
    errEditar.value = ''
    modalEditar.value = true
}

const editarCliente = async () => {
    errEditar.value = ''
    if (!fE.Nombres || !fE.Apellidos || !fE.Email || !fE.Telefono) {
        errEditar.value = 'Nombres, Apellidos, Email y Teléfono son obligatorios.'; return
    }
    guardandoE.value = true
    try {
        const doc = clienteAccion.value?.Documento
        console.log('[editarCliente] Enviando datos:', { Documento: doc, ...fE })
        const response = await ClientService.updateClientByDoc(doc, {
            Nombres: fE.Nombres,
            Apellidos: fE.Apellidos,
            Email: fE.Email,
            Telefono: fE.Telefono,
            Estado: fE.Estado,
        })

        console.log({ response })
        //console.log('[editarCliente] Cliente editado:', { Documento: doc, ...fE })
        await cargarClientes()
        // Actualizar lista local sin recargar
        // const idx = listaClientes.value.findIndex(c => c.Documento === doc)
        // if (idx !== -1) listaClientes.value[idx] = { ...listaClientes.value[idx], ...fE }
        modalEditar.value = false
    } catch (e) {
        const msg = e.response?.data?.message
        errEditar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al editar el cliente.')
    } finally {
        guardandoE.value = false
    }
}

// ── Modal Cambio de Estado ─────────────────────────────────────────
const abrirCambioEstado = (c) => {
    clienteAccion.value = c
    errEstado.value = ''
    modalEstado.value = true
}

const cambiarEstado = async ({ nuevoEstado }) => {
    try {
        const doc = clienteAccion.value?.Documento
        await ClientService.updateClientEstado(doc, nuevoEstado)
        const idx = listaClientes.value.findIndex(c => c.Documento === doc)
        if (idx !== -1) listaClientes.value[idx].Estado = nuevoEstado
        modalEstado.value = false
    } catch (e) {
        console.error('[cambiarEstado]', e.response?.data ?? e.message)
    }
}
</script>

<style scoped>
/* ══ Filtros ══════════════════════════════════════════════════════ */
.filters-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 12px;
}

.filter-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 140px;
}

.filter-field--search {
    flex: 2;
    min-width: 200px;
}

.filter-label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #232B3A;
    padding-left: 4px;
}

.back-btn {
    border: 1px solid black;
    box-shadow: #595858 0px 2px 0;
}

@media (max-width: 600px) {
    .filters-bar {
        flex-direction: column;
        gap: 10px;
    }

    .filter-field,
    .filter-field--search {
        flex: none;
        width: 100%;
        min-width: unset;
    }
}

.filter-clear-btn {
    padding: 10px 18px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #6b7280;
    background-color: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 999px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    white-space: nowrap;
    align-self: flex-end;
}

.filter-clear-btn:hover {
    border-color: #299261;
    color: #299261;
}

@media (max-width: 600px) {
    .filter-clear-btn {
        width: 100%;
        text-align: center;
    }
}

/* ══ Tabla ════════════════════════════════════════════════════════ */
.table-scroll-wrapper {
    overflow-x: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: #0D291C33 #f0f9f4;
}

.table-scroll-wrapper::-webkit-scrollbar {
    height: 5px;
}

.table-scroll-wrapper::-webkit-scrollbar-track {
    background: #f0f9f4;
}

.table-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #0D291C44;
    border-radius: 99px;
}

.data-table {
    border-collapse: collapse;
    min-width: 700px;
    width: 100%;
}

.th-cell {
    padding: 13px 18px;
    text-align: left;
    font-size: 0.68rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #7FD344;
    background-color: #0D291C;
    white-space: nowrap;
    border-bottom: 3px solid #7FD344;
}

.th-cell--actions {
    text-align: center;
}

.th-cell--sticky {
    position: sticky;
    left: 0;
    z-index: 2;
    box-shadow: 3px 0 8px rgba(0, 0, 0, 0.12);
}

.table-row {
    border-bottom: 1px solid #e8f5e9;
    transition: background-color 0.15s;
}

.table-row:last-child {
    border-bottom: none;
}

.table-row:hover {
    background-color: #f0faf4;
}

.table-row:hover .td-cell--sticky {
    background-color: #f0faf4;
}

.td-cell {
    padding: 12px 18px;
    font-size: 0.82rem;
    color: #374151;
    font-weight: 500;
    vertical-align: middle;
    white-space: nowrap;
}

.td-cell--sticky {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: white;
    box-shadow: 3px 0 8px rgba(0, 0, 0, 0.07);
    min-width: 200px;
}

.td-cell--actions {
    text-align: center;
}

.row-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.75rem;
    flex-shrink: 0;
    border: 2px solid #e8f5e9;
}

.sede-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    background-color: #e8f5e9;
    color: #1b5e20;
    border: 1px solid #c8e6c9;
}

.estado-badge-activo {
    color: #299261;
    font-weight: 800;
    font-size: 0.8rem;
}

.estado-badge-inactivo {
    color: #dc2626;
    font-weight: 800;
    font-size: 0.8rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: transparent;
    transition: background-color 0.15s;
    flex-shrink: 0;
    cursor: pointer;
}

.action-btn :deep(svg),
.action-btn :deep(p) {
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn :deep(svg) {
    fill: #6b7280;
    transition: fill 0.15s;
    width: 20px;
    height: 20px;
}

.action-btn:hover {
    background-color: #e8f5e9;
}

.action-btn:hover :deep(svg) {
    fill: #299261;
}

.action-btn--danger:hover {
    background-color: #fee2e2;
}

.action-btn--danger:hover :deep(svg) {
    fill: #dc2626;
}

.action-btn--activate:hover {
    background-color: #dcfce7;
}

.action-btn--activate:hover :deep(svg) {
    fill: #16a34a;
}

/* ══ Paginación ═══════════════════════════════════════════════════ */
.table-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 20px;
    border-top: 2px solid #f0f9f4;
    background-color: #fafffe;
    flex-shrink: 0;
    flex-wrap: wrap;
}

.foot-counter {
    font-size: 0.75rem;
    color: #9ca3af;
}

.foot-counter strong {
    color: #0D291C;
}

.page-mobile-indicator {
    display: none;
    font-size: 0.8rem;
    font-weight: 700;
    color: #0D291C;
    padding: 0 8px;
}

.page-btn--num {
    display: flex;
}

@media (max-width: 600px) {
    .foot-counter {
        display: none;
    }

    .page-mobile-indicator {
        display: block;
    }

    .page-btn--num {
        display: none;
    }

    .table-foot {
        padding: 10px 14px;
        justify-content: space-between;
    }
}

.page-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #6b7280;
    transition: background-color 0.15s, color 0.15s;
    flex-shrink: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.page-btn:hover:not(:disabled) {
    background-color: #e8f5e9;
    color: #0D291C;
}

.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-btn--active {
    background-color: #0D291C;
    color: #7FD344;
    box-shadow: 0 2px 0 rgba(13, 41, 28, 0.3);
}

/* ══ Inputs globales (filtros + modal nuevo) ══════════════════════ */
input,
select {
    border-radius: 999px !important;
    background-color: #EAEAEA !important;
    border: 2px solid #299261 !important;
    padding: 10px 15px !important;
    color: black !important;
    box-shadow: none !important;
    outline: none !important;
}

input:focus,
select:focus {
    border-color: #0D291C !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.18) !important;
}

input.search-input {
    padding-right: 45px !important;
    background-image: url(@/assets/img/search.svg);
    background-size: 25px;
    background-position: right 10px center;
    background-repeat: no-repeat;
}

select.paginator-select {
    border-radius: 12px !important;
    padding: 4px 28px 4px 10px !important;
    font-size: 0.75rem !important;
    border: 1px solid #d1d5db !important;
    background-color: #f9fafb !important;
    color: #4b5563 !important;
}

select.paginator-select:focus {
    border-color: #299261 !important;
    box-shadow: none !important;
}

/* ══ Modal Nuevo (inline, aún no es componente) ═══════════════════ */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: rgba(13, 41, 28, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.modal-card {
    background-color: #B8E19E;
    border: 2.5px solid #0D291C;
    border-radius: 40px;
    box-shadow: 0 7px 0 #0D291C;
    width: 100%;
    max-width: 500px;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-card--wide {
    max-width: 660px;
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 22px 26px 16px;
    border-bottom: 2px solid rgba(13, 41, 28, 0.14);
    flex-shrink: 0;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.modal-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.9rem;
    flex-shrink: 0;
    border: 2px solid rgba(13, 41, 28, 0.4);
}

.modal-head__name {
    font-size: 1rem;
    font-weight: 900;
    color: #0D291C;
    font-style: italic;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.modal-head__sub {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #0D291C;
    opacity: 0.45;
    margin-top: 2px;
}

.modal-close {
    font-size: 1.1rem;
    font-weight: 900;
    color: #0D291C;
    opacity: 0.35;
    transition: opacity 0.15s;
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    line-height: 1;
}

.modal-close:hover {
    opacity: 1;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 26px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.2) transparent;
}

.modal-body::-webkit-scrollbar {
    width: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.2);
    border-radius: 99px;
}

.modal-foot {
    padding: 16px 26px;
    border-top: 2px solid rgba(13, 41, 28, 0.1);
    display: flex;
    gap: 10px;
    flex-shrink: 0;
}

.modal-section-label {
    font-size: 0.62rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0D291C;
    opacity: 0.45;
    border-bottom: 1.5px solid rgba(13, 41, 28, 0.12);
    padding-bottom: 5px;
    margin-top: 2px;
}

.modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px;
}

@media (max-width: 500px) {
    .modal-grid {
        grid-template-columns: 1fr;
    }
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.field-label {
    font-size: 0.63rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.6;
    padding-left: 3px;
}

.field-input {
    background-color: white !important;
    border: 2px solid #0D291C !important;
    border-radius: 14px !important;
    padding: 9px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}

.field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.2) !important;
}

.placa-input {
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    font-weight: 700 !important;
}

.check-label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 700;
    color: #0D291C;
}

.check {
    accent-color: #0D291C;
    width: 14px;
    height: 14px;
    cursor: pointer;
    border-radius: 4px !important;
    border: 1.5px solid #0D291C !important;
    padding: 0 !important;
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

.err-box {
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 0.78rem;
    font-weight: 700;
    background: #fee2e2;
    border: 1.5px solid #fca5a5;
    color: #b91c1c;
}

/* ══ Transición modal nuevo ═══════════════════════════════════════ */
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

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
    transition: transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
}
</style>