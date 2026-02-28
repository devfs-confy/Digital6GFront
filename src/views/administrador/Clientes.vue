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
                <div class="relative">
                    <input v-model="busqueda" type="text" placeholder="Nombre o documento..."
                        class="search-input w-full" />
                </div>
            </div>
            <div class="filter-field">
                <label class="filter-label">Sede</label>
                <select v-model="filtroSede">
                    <option value="">Todas las sedes</option>
                    <option v-for="sede in sedes" :key="sede.IdEstacionamiento" :value="sede.IdEstacionamiento">
                        {{ sede.Nombre }}
                    </option>
                </select>
            </div>
            <div class="filter-field">
                <label class="filter-label">Estado</label>
                <select v-model="filtroEstado">
                    <option value="">Todos los estados</option>
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
                            <th class="th-cell">Estado membresía</th>
                            <th class="th-cell th-cell--actions">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="clientesPaginados.length === 0">
                            <td colspan="6" class="text-center py-20 text-gray-300">
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

                        <tr v-for="cliente in clientesPaginados" :key="cliente.Documento" class="table-row">
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
                            <td class="td-cell tracking-wide">{{ cliente.Documento }}</td>
                            <td class="td-cell">
                                <span class="sede-badge">{{ cliente.Email }}</span>
                            </td>
                            <td class="td-cell">
                                <span v-if="cliente.Estado" class="estado-badge-activo">Activo</span>
                                <span v-else class="estado-badge-inactivo">Inactivo</span>
                            </td>
                            <td class="td-cell td-cell--actions">
                                <div class="flex items-center justify-center gap-1">
                                    <button @click="editarCliente(cliente)" class="action-btn" title="Editar"
                                        v-html="person_edit">
                                    </button>
                                    <button @click="darDeBaja(cliente)" class="action-btn action-btn--danger"
                                        title="Inhabilitar" v-html="account_circle_off">
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


        <!-- ══════════════════════════════════════════════════ -->
        <!-- MODAL EDITAR                                      -->
        <!-- ══════════════════════════════════════════════════ -->
        <ModalEditar v-model="modalEditar" :cliente="clienteAccion" @guardar="actualizarCliente">
            <p class="modal-section-label">Datos personales</p>
            <div class="modal-grid">
                <div class="field-group">
                    <label class="field-label">Nombre</label>
                    <input v-model="clienteAccion.Nombres" type="text" class="field-input" placeholder="Nombre" />
                </div>
                <div class="field-group">
                    <label class="field-label">Apellido</label>
                    <input v-model="clienteAccion.Apellidos" type="text" class="field-input" placeholder="Apellido" />
                </div>
                <div class="field-group">
                    <label class="field-label">Documento</label>
                    <input v-model="clienteAccion.Documento" type="text" class="field-input"
                        placeholder="Número de documento" />
                </div>
                <div class="field-group">
                    <label class="field-label">Teléfono</label>
                    <input v-model="clienteAccion.Telefono" type="text" @input="validarTelefono" class="field-input"
                        placeholder="3XX XXX XXXX" />
                </div>
                <div class="field-group field-group--full">
                    <label class="field-label">Correo electrónico</label>
                    <input v-model="clienteAccion.Email" type="email" class="field-input"
                        placeholder="correo@ejemplo.com" />
                </div>
            </div>

            <p class="modal-section-label">Membresía</p>
            <div class="modal-grid">
                <div class="field-group">
                    <label class="field-label">Sede</label>
                    <select v-model="clienteAccion.sede" class="field-input">
                        <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">{{ s.Nombre
                            }}
                        </option>
                    </select>
                </div>
            </div>

            <p class="modal-section-label">Vehículos</p>
            <div class="modal-grid">
                <div class="field-group">
                    <label class="field-label">Placa 1</label>
                    <input v-model="clienteAccion.Placa1" type="text" class="field-input" placeholder="ABC-123" />
                </div>
                <div class="field-group">
                    <label class="field-label">Placa 2</label>
                    <input v-model="clienteAccion.placa2" type="text" class="field-input"
                        placeholder="DEF-456 (opcional)" />
                </div>
                <div class="field-group">
                    <label class="field-label">Placa 3</label>
                    <input v-model="clienteAccion.placa3" type="text" class="field-input"
                        placeholder="GHI-789 (opcional)" />
                </div>
            </div>
        </ModalEditar>


        <!-- ══════════════════════════════════════════════════ -->
        <!-- MODAL INHABILITAR                                 -->
        <!-- ══════════════════════════════════════════════════ -->
        <ModalInhabilitar v-model="modalInhabilitar" :cliente="clienteAccion" @confirmar="inhabilitarCliente" />

    </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ModalEditar from '@/components/modals/ModalEditar.vue'
import ModalInhabilitar from '@/components/modals/ModalInhabilitar.vue'
import person_edit from '@/assets/img/person_edit.svg?raw'
import account_circle_off from '@/assets/img/account_circle_off.svg?raw'
import UsersService from '@/api/services/users.service'
import sedesServices from '@/api/services/sedes.services'

// ── Estado ─────────────────────────────────────────────────────────
const busqueda = ref('')
const busquedaDebounced = ref('')
const filtroEstado = ref('')
const filtroSede = ref('')
const paginaActual = ref(1)
const itemsPorPagina = ref(10)
const mockClientes = ref([])
const sedes = ref([])

// ── Modales ────────────────────────────────────────────────────────
const modalEditar = ref(false)
const modalInhabilitar = ref(false)

// clienteAccion con valor por defecto vacío para evitar errores de v-model
// cuando el modal aún no tiene cliente asignado
const clienteAccion = ref({
    Nombres: '', Apellidos: '', Documento: '',
    Telefono: '', Email: '', sede: '',
    Placa1: '', placa2: '', placa3: '',
})

import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

onMounted(async () => {
    try {

        const [responseClientes, responseSedes] = await Promise.all([
            UsersService.getAllClients({ page: 1, limit: 15 }),
            sedesServices.getAll(),
        ])
        mockClientes.value = responseClientes?.data || []
        sedes.value = responseSedes || []
    } catch (error) {
        console.error('Error cargando datos:', error)
    }

})

// ── Debounce búsqueda ──────────────────────────────────────────────
let debounceTimer = null
watch(busqueda, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        busquedaDebounced.value = val
        paginaActual.value = 1
    }, 300)
})
watch([filtroSede, filtroEstado], () => { paginaActual.value = 1 })

// ── Filtros y paginación ───────────────────────────────────────────
const clientesFiltrados = computed(() => {
    return mockClientes.value.filter(c => {
        const q = busquedaDebounced.value.toLowerCase()
        const matchBusqueda = !q ||
            c.Nombres?.toLowerCase().includes(q) ||
            c.Documento?.toString().includes(q)
        const matchSede = !filtroSede.value || c.sede === filtroSede.value
        const matchEstado = filtroEstado.value === '' || filtroEstado.value === undefined ||
            c.Estado === (filtroEstado.value === 'true')
        return matchBusqueda && matchSede && matchEstado
    })
})

const totalPaginas = computed(() =>
    Math.max(1, Math.ceil(clientesFiltrados.value.length / itemsPorPagina.value))
)
const clientesPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * itemsPorPagina.value
    return clientesFiltrados.value.slice(inicio, inicio + itemsPorPagina.value)
})
const rangoInicio = computed(() =>
    clientesFiltrados.value.length === 0 ? 0 : (paginaActual.value - 1) * itemsPorPagina.value + 1
)
const rangoFin = computed(() =>
    Math.min(paginaActual.value * itemsPorPagina.value, clientesFiltrados.value.length)
)

// ── Acciones ───────────────────────────────────────────────────────
const editarCliente = (cliente) => {
    clienteAccion.value = { ...cliente }
    modalEditar.value = true
}

const darDeBaja = (cliente) => {
    clienteAccion.value = { ...cliente }
    modalInhabilitar.value = true
}

const actualizarCliente = async () => {
    try {

        console.log('Guardando:', clienteAccion.value)
        modalEditar.value = false
    } catch (error) {
        console.error('Error actualizando:', error)
    }
}

const inhabilitarCliente = async ({ motivo, observaciones }) => {
    try {

        console.log('Inhabilitando:', clienteAccion.value.Documento, motivo, observaciones)

        const idx = mockClientes.value.findIndex(c => c.Documento === clienteAccion.value.Documento)
        if (idx !== -1) mockClientes.value[idx].Estado = false
        modalInhabilitar.value = false
    } catch (error) {
        console.error('Error inhabilitando:', error)
    }
}

const limpiarFiltros = () => {
    busqueda.value = ''
    busquedaDebounced.value = ''
    filtroSede.value = ''
    filtroEstado.value = ''
}

const validarTelefono = (event) => {
    clienteAccion.value.Telefono = event.target.value.replace(/\D/g, '')
}

const iniciales = (nombre = '') => {
    if (!nombre) return '??'
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}
</script>


<style scoped>
/* ══ Estilos de la vista (tabla, filtros, etc.) ══════════════════════
   Los estilos de los modales están en cada componente modal.
   ══════════════════════════════════════════════════════════════════ */

.estado-badge-activo {
    color: #299261;
    font-weight: bold;
}

.estado-badge-inactivo {
    color: #dc2626;
    font-weight: bold;
}

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
    text-align: left;
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

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    transition: background-color 0.15s;
    flex-shrink: 0;
}

.action-btn:hover {
    background-color: #e8f5e9;
}

.action-btn--danger:hover {
    background-color: #fee2e2;
}

:deep(.action-btn svg) {
    width: 20px;
    height: 20px;
    fill: #6b7280;
    transition: fill 0.15s;
    display: block;
}

.action-btn:hover :deep(svg) {
    fill: #299261;
}

.action-btn--danger:hover :deep(svg) {
    fill: #dc2626;
}

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

/* ── Estilos de campos del slot (heredados por el modal editar) ── */
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

.field-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.field-group--full {
    grid-column: 1 / -1;
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
    transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.2) !important;
}

@media (max-width: 500px) {
    .modal-grid {
        grid-template-columns: 1fr;
    }
}
</style>