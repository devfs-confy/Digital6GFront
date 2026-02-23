<template>
    <div class="h-full flex flex-col gap-6">

        <!-- Header — mantenido igual, solo ajuste de centrado del título -->
        <div class="flex items-center justify-between relative bg-white rounded-full p-4">
            <div class="w-[80px]"></div>
            <h2 class="text-2xl font-bold text-[#232B3A]">Clientes</h2>
            <div class="flex items-center gap-2 bg-[#7FD344] text-[#232B3A] text-sm px-4 py-2 rounded-full">
                <button>Volver</button>
            </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 filters-bar">

            <!-- Búsqueda — ancho fijo en desktop, full en mobile -->
            <div class="filter-field filter-field--search">
                <label class="filter-label">Buscar</label>
                <div class="relative">
                    <input v-model="busqueda" type="text" placeholder="Nombre o documento..."
                        class="search-input w-full" />
                </div>
            </div>

            <!-- Sede -->
            <div class="filter-field">
                <label class="filter-label">Sede</label>
                <select v-model="filtroSede">
                    <option value="">Todas las sedes</option>
                    <option v-for="sede in sedes" :key="sede" :value="sede">{{ sede }}</option>
                </select>
            </div>

            <!-- Estado -->
            <div class="filter-field">
                <label class="filter-label">Estado</label>
                <select v-model="filtroEstado">
                    <option value="">Todos los estados</option>
                    <option value="al dia">Al día</option>
                    <option value="por vencer">Por vencer</option>
                    <option value="vencido">Vencido</option>
                </select>
            </div>

            <!-- Limpiar filtros -->
            <button v-if="busqueda || filtroSede || filtroEstado" @click="limpiarFiltros" class="filter-clear-btn">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">

            <!-- Wrapper con scroll horizontal -->
            <div class="table-scroll-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <!-- Columna nombre sticky — siempre visible al hacer scroll -->
                            <th class="th-cell th-cell--sticky">Cliente</th>
                            <th class="th-cell">Documento</th>
                            <th class="th-cell">Sede</th>
                            <th class="th-cell">Estado membresía</th>
                            <th class="th-cell">Próximo pago</th>
                            <th class="th-cell th-cell--actions">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Sin resultados -->
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

                        <!-- Filas -->
                        <tr v-for="(cliente, i) in clientesPaginados" :key="cliente.id" class="table-row">

                            <!-- Nombre sticky -->
                            <td class="td-cell td-cell--sticky">
                                <div class="flex items-center gap-3">
                                    <div class="row-avatar">{{ iniciales(cliente.nombre) }}</div>
                                    <div class="flex flex-col items-start min-w-0">
                                        <span
                                            class="font-semibold text-[#0D291C] leading-tight truncate max-w-[140px]">{{
                                            cliente.nombre }}</span>
                                        <span class="text-[10px] text-gray-400 font-mono truncate max-w-[140px]">{{
                                            cliente.correo }}</span>
                                    </div>
                                </div>
                            </td>

                            <!-- Documento -->
                            <td class="td-cell font-mono text-gray-500 tracking-wide">{{ cliente.documento }}</td>

                            <!-- Sede -->
                            <td class="td-cell">
                                <span class="sede-badge">{{ cliente.sede }}</span>
                            </td>

                            <!-- Estado -->
                            <td class="td-cell">
                                <span :class="['estado-badge', estadoClase(cliente.estado)]">
                                    {{ estadoLabel(cliente.estado) }}
                                </span>
                            </td>

                            <!-- Próximo pago -->
                            <td class="td-cell">
                                <span :class="['fecha-pago', fechaClase(cliente.estado)]">
                                    {{ formatFecha(cliente.proximoPago) }}
                                </span>
                            </td>

                            <!-- Opciones — también sticky a la derecha en mobile -->
                            <td class="td-cell td-cell--actions">
                                <div class="flex items-center justify-center gap-1">
                                    <button @click="editarCliente(cliente)" class="action-btn" title="Editar"
                                        v-html="person_edit">
                                    </button>
                                    <button @click="verPagos(cliente)" class="action-btn" title="Mensualidad"
                                        v-html="credit_card_gear">
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
                <!-- Contador — se oculta en pantallas muy pequeñas -->
                <span class="foot-counter">
                    <strong>{{ rangoInicio }}–{{ rangoFin }}</strong> de <strong>{{ clientesFiltrados.length }}</strong>
                </span>

                <!-- Páginas -->
                <div class="flex items-center gap-1">
                    <button @click="paginaActual--" :disabled="paginaActual === 1" class="page-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>

                    <!-- En mobile solo muestra página actual / total, en desktop los números -->
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

                <!-- Filas por página -->
                <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span class="hidden sm:inline">Filas:</span>
                    <select v-model.number="itemsPorPagina" @change="paginaActual = 1" class="paginator-select">
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                    </select>
                </div>
            </div>
        </div>


        <!-- ════════════════════════════════════════════════════════ -->
        <!-- MODAL 1 — EDITAR CLIENTE                               -->
        <!-- ════════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalEditar" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card modal-card--wide">

                    <!-- Cabecera fija -->
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-avatar">{{ iniciales(clienteAccion?.nombre) }}</div>
                            <div>
                                <p class="modal-head__name">{{ clienteAccion?.nombre }}</p>
                                <p class="modal-head__sub">Editando información</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close">✕</button>
                    </div>

                    <!-- Cuerpo con scroll -->
                    <div class="modal-body">

                        <p class="modal-section-label">Datos personales</p>
                        <div class="modal-grid">
                            <div class="field-group">
                                <label class="field-label">Nombre</label>
                                <input v-model="clienteAccion.nombre" type="text" class="field-input"
                                    placeholder="Nombre" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Apellido</label>
                                <input v-model="clienteAccion.apellido" type="text" class="field-input"
                                    placeholder="Apellido" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Documento</label>
                                <input v-model="clienteAccion.documento" type="text" class="field-input"
                                    placeholder="Número de documento" />
                            </div>
                            <div class="field-group">
                                <label class="field-label">Teléfono</label>
                                <input v-model="clienteAccion.telefono" type="tel" class="field-input"
                                    placeholder="3XX XXX XXXX" />
                            </div>
                            <div class="field-group field-group--full">
                                <label class="field-label">Correo electrónico</label>
                                <input v-model="clienteAccion.correo" type="email" class="field-input"
                                    placeholder="correo@ejemplo.com" />
                            </div>
                        </div>

                        <p class="modal-section-label">Membresía</p>
                        <div class="modal-grid">
                            <div class="field-group">
                                <label class="field-label">Sede</label>
                                <select v-model="clienteAccion.sede" class="field-input">
                                    <option v-for="s in sedes" :key="s" :value="s">{{ s }}</option>
                                </select>
                            </div>
                            <div class="field-group">
                                <label class="field-label">Plan</label>
                                <select v-model="clienteAccion.plan" class="field-input">
                                    <option>Mensual</option>
                                    <option>Trimestral</option>
                                    <option>Semestral</option>
                                    <option>Anual</option>
                                </select>
                            </div>
                        </div>

                        <p class="modal-section-label">Vehículos</p>
                        <div class="modal-grid">
                            <div class="field-group">
                                <label class="field-label">Placa 1</label>
                                <input v-model="clienteAccion.placa1" type="text" class="field-input"
                                    placeholder="ABC-123" />
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

                    </div>

                    <!-- Pie fijo -->
                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button class="btn-modal-dark">Actualizar datos</button>
                    </div>

                </div>
            </div>
        </Transition>


        <!-- ════════════════════════════════════════════════════════ -->
        <!-- MODAL 2 — MENSUALIDAD                                  -->
        <!-- ════════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalMensualidad" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card">

                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-avatar">{{ iniciales(clienteAccion?.nombre) }}</div>
                            <div>
                                <p class="modal-head__name">{{ clienteAccion?.nombre }}</p>
                                <p class="modal-head__sub">Gestión de mensualidad</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">

                        <!-- Resumen estado actual -->
                        <div class="plan-summary">
                            <div class="plan-summary__item">
                                <span class="plan-summary__label">Plan actual</span>
                                <span class="plan-summary__value">{{ clienteAccion?.plan }}</span>
                            </div>
                            <div class="plan-summary__sep"></div>
                            <div class="plan-summary__item">
                                <span class="plan-summary__label">Próximo pago</span>
                                <span class="plan-summary__value">{{ formatFecha(clienteAccion?.proximoPago) }}</span>
                            </div>
                            <div class="plan-summary__sep"></div>
                            <div class="plan-summary__item">
                                <span class="plan-summary__label">Estado</span>
                                <span :class="['estado-badge', estadoClase(clienteAccion?.estado)]">
                                    {{ estadoLabel(clienteAccion?.estado) }}
                                </span>
                            </div>
                        </div>

                        <p class="modal-section-label">Modificar plan</p>
                        <div class="modal-grid">
                            <div class="field-group">
                                <label class="field-label">Nuevo plan</label>
                                <select class="field-input">
                                    <option>Mensual</option>
                                    <option>Trimestral</option>
                                    <option>Semestral</option>
                                    <option>Anual</option>
                                </select>
                            </div>
                            <div class="field-group">
                                <label class="field-label">Nueva fecha de pago</label>
                                <input type="date" class="field-input" />
                            </div>
                            <div class="field-group field-group--full">
                                <label class="field-label">Observaciones</label>
                                <textarea class="field-input field-input--textarea" rows="2"
                                    placeholder="Ej: descuento aplicado, renovación anticipada..."></textarea>
                            </div>
                        </div>

                        <p class="modal-section-label">Acciones rápidas</p>
                        <div class="quick-actions">
                            <button class="quick-btn quick-btn--freeze">❄️ Congelar</button>
                            <button class="quick-btn quick-btn--pause">⏸ Pausar acceso</button>
                        </div>

                    </div>

                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button class="btn-modal-dark">Guardar cambios</button>
                    </div>

                </div>
            </div>
        </Transition>


        <!-- ════════════════════════════════════════════════════════ -->
        <!-- MODAL 3 — INHABILITAR                                  -->
        <!-- ════════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalInhabilitar" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card modal-card--danger">

                    <div class="modal-head modal-head--danger">
                        <div class="modal-head__left">
                            <div class="modal-avatar modal-avatar--danger">
                                {{ iniciales(clienteAccion?.nombre) }}
                            </div>
                            <div>
                                <p class="modal-head__name modal-head__name--danger">{{ clienteAccion?.nombre }}</p>
                                <p class="modal-head__sub modal-head__sub--danger">Inhabilitar cliente</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close modal-close--danger">✕</button>
                    </div>

                    <div class="modal-body">

                        <div class="danger-alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#b91c1c"
                                viewBox="0 0 24 24" class="flex-shrink-0 mt-0.5">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            <p>
                                Al inhabilitar a <strong>{{ clienteAccion?.nombre }}</strong>, no podrá
                                acceder al sistema ni renovar su membresía. Esta acción puede revertirse.
                            </p>
                        </div>

                        <div class="modal-grid">
                            <div class="field-group field-group--full">
                                <label class="field-label field-label--danger">
                                    Motivo <span class="text-red-500">*</span>
                                </label>
                                <select class="field-input field-input--danger">
                                    <option value="">Selecciona un motivo...</option>
                                    <option value="falta_pago">Falta de pago</option>
                                    <option value="solicitud">Solicitud del cliente</option>
                                    <option value="comportamiento">Comportamiento inapropiado</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            <div class="field-group field-group--full">
                                <label class="field-label field-label--danger">Observaciones</label>
                                <textarea class="field-input field-input--danger field-input--textarea" rows="2"
                                    placeholder="Detalles adicionales..."></textarea>
                            </div>
                        </div>

                    </div>

                    <div class="modal-foot modal-foot--danger">
                        <button @click="cerrarModales" class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button class="btn-modal-dark btn-modal-dark--danger">Inhabilitar</button>
                    </div>

                </div>
            </div>
        </Transition>

    </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import person_edit from '@/assets/img/person_edit.svg?raw'
import account_circle_off from '@/assets/img/account_circle_off.svg?raw'
import credit_card_gear from '@/assets/img/credit_card_gear.svg?raw'

// --- ESTADOS ---
const busqueda = ref('')
const filtroSede = ref('')
const filtroEstado = ref('')
const paginaActual = ref(1)
const itemsPorPagina = ref(10)
const sedes = ['Norte', 'Sur', 'Centro']

// Control de Modales
const modalEditar = ref(false)
const modalMensualidad = ref(false)
const modalInhabilitar = ref(false)
const clienteAccion = ref(null)

// --- MOCK DATA ---
const mockClientes = ref([
    { id: 1, nombre: 'Jean Carlos Pérez', documento: '123456789', sede: 'Norte', estado: 'al dia', proximoPago: '2026-03-05', plan: 'Mensual', correo: 'jean@ejemplo.com', telefono: '3001234567' },
    { id: 2, nombre: 'Laura Martínez', documento: '987654321', sede: 'Sur', estado: 'por vencer', proximoPago: '2026-03-01', plan: 'Trimestral', correo: 'laura@ejemplo.com', telefono: '3009876543' },
    { id: 3, nombre: 'Carlos Rodríguez', documento: '112233445', sede: 'Centro', estado: 'vencido', proximoPago: '2026-02-10', plan: 'Mensual', correo: 'carlos@ejemplo.com', telefono: '3011234567' },
    { id: 4, nombre: 'María Gómez', documento: '556677889', sede: 'Norte', estado: 'al dia', proximoPago: '2026-04-01', plan: 'Semestral', correo: 'maria@ejemplo.com', telefono: '3021234567' },
    { id: 5, nombre: 'Andrés Torres', documento: '998877665', sede: 'Sur', estado: 'al dia', proximoPago: '2026-03-20', plan: 'Mensual', correo: 'andres@ejemplo.com', telefono: '3031234567' },
    { id: 6, nombre: 'Sandra López', documento: '334455667', sede: 'Centro', estado: 'por vencer', proximoPago: '2026-02-28', plan: 'Mensual', correo: 'sandra@ejemplo.com', telefono: '3041234567' },
    { id: 7, nombre: 'Felipe Vargas', documento: '223344556', sede: 'Norte', estado: 'vencido', proximoPago: '2026-01-15', plan: 'Trimestral', correo: 'felipe@ejemplo.com', telefono: '3051234567' },
    { id: 8, nombre: 'Camila Herrera', documento: '445566778', sede: 'Sur', estado: 'al dia', proximoPago: '2026-03-10', plan: 'Mensual', correo: 'camila@ejemplo.com', telefono: '3061234567' },
    { id: 9, nombre: 'Julián Castro', documento: '667788990', sede: 'Centro', estado: 'al dia', proximoPago: '2026-03-15', plan: 'Semestral', correo: 'julian@ejemplo.com', telefono: '3071234567' },
    { id: 10, nombre: 'Valentina Díaz', documento: '778899001', sede: 'Norte', estado: 'por vencer', proximoPago: '2026-03-02', plan: 'Mensual', correo: 'valentina@ejemplo.com', telefono: '3081234567' },
    { id: 11, nombre: 'Rodrigo Medina', documento: '889900112', sede: 'Sur', estado: 'al dia', proximoPago: '2026-04-05', plan: 'Mensual', correo: 'rodrigo@ejemplo.com', telefono: '3091234567' },
    { id: 12, nombre: 'Natalia Ruiz', documento: '900011223', sede: 'Centro', estado: 'vencido', proximoPago: '2026-01-30', plan: 'Trimestral', correo: 'natalia@ejemplo.com', telefono: '3101234567' },
])

// --- FILTROS Y PAGINACIÓN ---
const clientesFiltrados = computed(() => {
    return mockClientes.value.filter(c => {
        const q = busqueda.value.toLowerCase()
        const matchBusqueda = !q || c.nombre.toLowerCase().includes(q) || c.documento.includes(q)
        const matchSede = !filtroSede.value || c.sede === filtroSede.value
        const matchEstado = !filtroEstado.value || c.estado === filtroEstado.value
        return matchBusqueda && matchSede && matchEstado
    })
})

const clientesPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * itemsPorPagina.value
    return clientesFiltrados.value.slice(inicio, inicio + itemsPorPagina.value)
})

// --- FUNCIONES DE ACCIÓN ---
const editarCliente = (cliente) => {
    clienteAccion.value = { ...cliente }
    modalEditar.value = true
}
const verPagos = (cliente) => {
    clienteAccion.value = cliente
    modalMensualidad.value = true
}
const darDeBaja = (cliente) => {
    clienteAccion.value = cliente
    modalInhabilitar.value = true
}
const cerrarModales = () => {
    modalEditar.value = modalMensualidad.value = modalInhabilitar.value = false
    clienteAccion.value = null
}
const limpiarFiltros = () => {
    busqueda.value = ''; filtroSede.value = ''; filtroEstado.value = ''
}

// --- HELPERS ---
const iniciales = (nombre = '') =>
    nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

const totalPaginas = computed(() => Math.max(1, Math.ceil(clientesFiltrados.value.length / itemsPorPagina.value)))
const rangoInicio = computed(() => clientesFiltrados.value.length === 0 ? 0 : (paginaActual.value - 1) * itemsPorPagina.value + 1)
const rangoFin = computed(() => Math.min(paginaActual.value * itemsPorPagina.value, clientesFiltrados.value.length))

const formatFecha = (f) => {
    if (!f) return ''
    const [y, m, d] = f.split('-')
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    return `${d} ${meses[parseInt(m) - 1]} ${y}`
}

const estadoClase = (e) => ({
    'al dia': 'bg-[#7FD344]/15 text-[#299261]',
    'por vencer': 'bg-amber-100 text-amber-700',
    'vencido': 'bg-red-100 text-red-600',
})[e] || ''

const estadoLabel = (e) => ({ 'al dia': 'Al día', 'por vencer': 'Por vencer', 'vencido': 'Vencido' }[e] || e)

const fechaClase = (e) => ({
    'al dia': '',
    'por vencer': 'fecha-pago--warn',
    'vencido': 'fecha-pago--danger',
})[e] || ''

watch([busqueda, filtroSede, filtroEstado], () => { paginaActual.value = 1 })
</script>


<style scoped>
/* ══════════════════════════════════════════════════════════════════
   FILTROS RESPONSIVE
   ══════════════════════════════════════════════════════════════════ */
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

/* Búsqueda ocupa más espacio en desktop */
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

/* En mobile todos los filtros van full width apilados */
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

/* ══════════════════════════════════════════════════════════════════
   TABLA RESPONSIVE
   ══════════════════════════════════════════════════════════════════ */

/* Wrapper: habilita scroll horizontal en el eje X */
.table-scroll-wrapper {
    overflow-x: auto;
    flex: 1;
    /* Scrollbar estilizada — visible para que el usuario sepa que puede deslizar */
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

/* La tabla NO usa width:100% — así puede crecer más que el contenedor y activar el scroll */
.data-table {
    border-collapse: collapse;
    min-width: 700px;
    /* ancho mínimo antes de activar el scroll horizontal */
    width: 100%;
}

/* ── Cabeceras ─────────────────────────────────────────────────────── */
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

/* Columna nombre sticky a la izquierda */
.th-cell--sticky {
    position: sticky;
    left: 0;
    z-index: 2;
    /* Sombra derecha sutil para indicar que hay contenido detrás */
    box-shadow: 3px 0 8px rgba(0, 0, 0, 0.12);
}

/* ── Filas ─────────────────────────────────────────────────────────── */
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

/* Al hover la celda sticky también cambia */
.table-row:hover .td-cell--sticky {
    background-color: #f0faf4;
}

/* ── Celdas ─────────────────────────────────────────────────────────── */
.td-cell {
    padding: 12px 18px;
    font-size: 0.82rem;
    color: #374151;
    font-weight: 500;
    vertical-align: middle;
    text-align: left;
    white-space: nowrap;
}

/* Celda de nombre sticky — fondo blanco para tapar el contenido que pasa por debajo */
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

/* Avatar de iniciales */
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

/* Badge de sede */
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

/* Badge de estado */
.estado-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    white-space: nowrap;
}

/* Fecha de pago */
.fecha-pago {
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
}

.fecha-pago--warn {
    color: #d97706;
    font-weight: 700;
}

.fecha-pago--danger {
    color: #dc2626;
    font-weight: 700;
}

/* ── Botones de acción ─────────────────────────────────────────────── */
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

/* ── Pie de tabla ──────────────────────────────────────────────────── */
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

/* Indicador "1 / 3" solo visible en mobile */
.page-mobile-indicator {
    display: none;
    font-size: 0.8rem;
    font-weight: 700;
    color: #0D291C;
    padding: 0 8px;
}

/* Números de página solo en desktop */
.page-btn--num {
    display: flex;
}

@media (max-width: 600px) {
    .foot-counter {
        display: none;
    }

    /* contador se oculta en móvil */
    .page-mobile-indicator {
        display: block;
    }

    /* aparece "1 / 3" */
    .page-btn--num {
        display: none;
    }

    /* se ocultan los números individuales */
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

/* Inputs globales — se usan en filtros */
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


/* ══════════════════════════════════════════════════════════════════════
   MODALES
   ══════════════════════════════════════════════════════════════════════ */

/* Overlay */
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

/* ── Tarjeta base ──────────────────────────────────────────────────── */
.modal-card {
    background-color: #B8E19E;
    border: 2.5px solid #0D291C;
    border-radius: 40px;
    box-shadow: 0 7px 0 #0D291C;
    /* sombra 3D coherente con .btn-modal-dark */
    width: 100%;
    max-width: 500px;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    /* cabecera fija + body scroll + pie fijo */
    overflow: hidden;
}

.modal-card--wide {
    max-width: 660px;
}

.modal-card--danger {
    background-color: #fde8e8;
    border-color: #b91c1c;
    box-shadow: 0 7px 0 #7f1d1d;
    max-width: 440px;
}

/* ── Cabecera — siempre visible, no hace scroll ─────────────────── */
.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 22px 26px 16px;
    border-bottom: 2px solid rgba(13, 41, 28, 0.14);
    flex-shrink: 0;
}

.modal-head--danger {
    border-bottom-color: rgba(185, 28, 28, 0.2);
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

.modal-avatar--danger {
    background-color: #b91c1c;
    color: #fee2e2;
    border-color: #7f1d1d;
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

.modal-head__name--danger {
    color: #7f1d1d;
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

.modal-head__sub--danger {
    color: #b91c1c;
    opacity: 0.85;
}

.modal-close {
    font-size: 1.1rem;
    font-weight: 900;
    color: #0D291C;
    opacity: 0.35;
    transition: opacity 0.15s;
    flex-shrink: 0;
    line-height: 1;
}

.modal-close:hover {
    opacity: 1;
}

.modal-close--danger {
    color: #b91c1c;
}

/* ── Cuerpo scrolleable ─────────────────────────────────────────── */
.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 26px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.2) transparent;
}

.modal-body::-webkit-scrollbar {
    width: 5px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.25);
    border-radius: 99px;
}

/* Etiqueta de sección */
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

/* ── Grid 2 columnas → 1 en mobile ─────────────────────────────── */
.modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px;
}

.field-group--full {
    grid-column: 1 / -1;
}

@media (max-width: 500px) {
    .modal-grid {
        grid-template-columns: 1fr;
    }

    .modal-card {
        border-radius: 26px;
    }

    .modal-head {
        padding: 16px 18px 14px;
    }

    .modal-body {
        padding: 14px 18px;
    }

    .modal-foot {
        padding: 10px 18px 18px;
    }
}

/* ── Campo ──────────────────────────────────────────────────────── */
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

.field-label--danger {
    color: #7f1d1d;
    opacity: 1;
}

/* Override total del reset global para inputs dentro del modal */
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

.field-input--textarea {
    border-radius: 14px !important;
    resize: none;
}

.field-input--danger {
    border-color: #b91c1c !important;
}

.field-input--danger:focus {
    border-color: #b91c1c !important;
    box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.15) !important;
}

/* ── Resumen plan (modal mensualidad) ───────────────────────────── */
.plan-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    background-color: rgba(255, 255, 255, 0.5);
    border: 2px solid #0D291C;
    border-radius: 22px;
    padding: 14px 18px;
}

.plan-summary__item {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.plan-summary__label {
    font-size: 0.58rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.5;
}

.plan-summary__value {
    font-size: 0.9rem;
    font-weight: 800;
    color: #0D291C;
}

.plan-summary__sep {
    width: 1.5px;
    height: 30px;
    align-self: center;
    background-color: rgba(13, 41, 28, 0.18);
    border-radius: 99px;
}

/* ── Acciones rápidas (modal mensualidad) ───────────────────────── */
.quick-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.quick-btn {
    flex: 1;
    min-width: 110px;
    padding: 10px 14px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border: 2px solid;
    background-color: white;
    cursor: pointer;
    box-shadow: 0 3px 0;
    transition: transform 0.1s, box-shadow 0.1s;
}

.quick-btn:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0;
}

.quick-btn--freeze {
    color: #1d4ed8;
    border-color: #1d4ed8;
    box-shadow: 0 3px 0 #1e3a8a;
}

.quick-btn--pause {
    color: #92400e;
    border-color: #92400e;
    box-shadow: 0 3px 0 #78350f;
}

/* ── Aviso rojo (modal inhabilitar) ────────────────────────────── */
.danger-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background-color: rgba(255, 255, 255, 0.65);
    border: 2px solid #b91c1c;
    border-radius: 18px;
    padding: 14px 16px;
    font-size: 0.82rem;
    color: #7f1d1d;
    line-height: 1.55;
}

/* ── Pie — siempre visible, no hace scroll ──────────────────────── */
.modal-foot {
    display: flex;
    gap: 12px;
    padding: 12px 26px 22px;
    border-top: 2px solid rgba(13, 41, 28, 0.12);
    flex-shrink: 0;
}

.modal-foot--danger {
    border-top-color: rgba(185, 28, 28, 0.15);
}

/* Botones del pie — idénticos al .btn-modal-dark del proyecto */
.btn-modal-dark {
    flex: 1;
    padding: 12px 20px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 2px solid #000;
    box-shadow: 0 4px 0px #000;
    background-color: #232B3A;
    color: white;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-modal-dark:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0px #000;
}

.btn-modal-dark--cancel {
    background-color: white;
    color: #232B3A;
}

.btn-modal-dark--danger {
    background-color: #b91c1c;
    color: white;
    border-color: #7f1d1d;
    box-shadow: 0 4px 0px #7f1d1d;
}

/* ── Animaciones ─────────────────────────────────────────────────── */
.modal-enter-active {
    transition: opacity 0.2s ease;
}

.modal-leave-active {
    transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-card {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.modal-leave-active .modal-card {
    animation: popOut 0.18s ease-in both;
}

@keyframes popIn {
    from {
        transform: scale(0.86) translateY(24px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@keyframes popOut {
    from {
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    to {
        transform: scale(0.92) translateY(12px);
        opacity: 0;
    }
}
</style>