<template>
    <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
            <div class="modal-card">

                <!-- Cabecera -->
                <div class="modal-head">
                    <div class="modal-head__left">
                        <div class="modal-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="modal-head__name">Permisos del usuario</p>
                            <p class="modal-head__sub">{{ usuario?.Nombres ?? usuario?.nombre ?? 'Usuario' }} · {{
                                usuario?.Email ?? usuario?.email ?? '' }}</p>
                        </div>
                    </div>
                    <button @click="$emit('update:modelValue', false)" class="modal-close">✕</button>
                </div>

                <!-- Toolbar: búsqueda + acciones rápidas -->
                <div class="modal-toolbar">
                    <div class="toolbar-search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#9ca3af"
                            viewBox="0 0 24 24">
                            <path
                                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        <input v-model="busqueda" type="text" placeholder="Buscar permiso..." class="toolbar-input" />
                        <button v-if="busqueda" @click="busqueda = ''" class="toolbar-clear">✕</button>
                    </div>
                    <div class="toolbar-actions">
                        <button @click="selectAll" class="quick-btn quick-btn--all">✓ Todos</button>
                        <button @click="clearAll" class="quick-btn quick-btn--none">✕ Ninguno</button>
                    </div>
                </div>

                <!-- Barra de progreso -->
                <div class="modal-counter">
                    <span class="counter-pill">
                        <span class="counter-num">{{ seleccionados.size }}</span> / {{ totalPermisos }} activos
                    </span>
                    <div class="counter-bar-wrap">
                        <div class="counter-bar-fill"
                            :style="{ width: `${(seleccionados.size / totalPermisos) * 100}%` }" />
                    </div>
                </div>

                <!-- Grid de tarjetas por categoría -->
                <div class="modal-body">

                    <div v-if="gruposFiltrados.length === 0" class="perm-empty">
                        Sin resultados para "<strong>{{ busqueda }}</strong>"
                    </div>

                    <div v-for="grupo in gruposFiltrados" :key="grupo.label" class="grupo-card"
                        :class="{ 'grupo-card--active': countActivos(grupo) > 0 }">

                        <!-- Cabecera de tarjeta -->
                        <div class="grupo-card__head">
                            <div class="grupo-card__head-left">
                                <span class="grupo-label">{{ grupo.label }}</span>
                            </div>
                            <div class="grupo-card__head-right">
                                <span class="grupo-count"
                                    :class="countActivos(grupo) > 0 ? 'grupo-count--on' : 'grupo-count--off'">
                                    {{ countActivos(grupo) }}/{{ grupo.permisos.length }}
                                </span>
                                <button @click="toggleGrupoPermisos(grupo)" class="grupo-toggle-btn"
                                    :class="countActivos(grupo) === grupo.permisos.length ? 'grupo-toggle-btn--on' : ''">
                                    {{ countActivos(grupo) === grupo.permisos.length ? 'Quitar' : 'Todos' }}
                                </button>
                            </div>
                        </div>

                        <!-- Lista de permisos -->
                        <div class="grupo-permisos">
                            <div v-for="perm in grupo.permisos" :key="perm.value" class="perm-item"
                                :class="{ 'perm-item--on': isSelected(perm.value) }" @click="togglePerm(perm.value)">
                                <div class="perm-check" :class="{ 'perm-check--on': isSelected(perm.value) }">
                                    <svg v-if="isSelected(perm.value)" xmlns="http://www.w3.org/2000/svg" width="10"
                                        height="10" fill="white" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                </div>
                                <span class="perm-label">{{ perm.label }}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Pie -->
                <div class="modal-foot">
                    <button @click="$emit('update:modelValue', false)"
                        class="btn-modal btn-modal--cancel">Cancelar</button>
                    <button @click="guardar" class="btn-modal btn-modal--confirm">Guardar permisos</button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    usuario: Object,
})
const emit = defineEmits(['update:modelValue', 'guardar'])

const GRUPOS = [
    {
        label: 'Usuarios',
        permisos: [
            { value: 'VER-USUARIOS', label: 'Ver usuarios' },
            { value: 'CREAR-USUARIOS', label: 'Crear usuarios' },
            { value: 'EDITAR-USUARIOS', label: 'Editar usuarios' },
            { value: 'INACTIVAR-USUARIOS', label: 'Inactivar usuarios' },
        ],
    },
    {
        label: 'Roles',
        permisos: [
            { value: 'VER-ROLES', label: 'Ver roles' },
            { value: 'CREAR-ROLES', label: 'Crear roles' },
            { value: 'EDITAR-ROLES', label: 'Editar roles' },
        ],
    },
    {
        label: 'Permisos',
        permisos: [
            { value: 'VER-PERMISOS', label: 'Ver permisos' },
            { value: 'ASIGNAR-PERMISOS', label: 'Asignar permisos' },
            { value: 'INACTIVAR-PERMISOS', label: 'Inactivar permisos' },
        ],
    },
    {
        label: 'Mensualidades',
        permisos: [
            { value: 'VER-MENSUALIDADES', label: 'Ver mensualidades' },
            { value: 'CREAR-MENSUALIDADES', label: 'Crear mensualidades' },
            { value: 'EDITAR-MENSUALIDADES', label: 'Editar mensualidades' },
            { value: 'INACTIVAR-MENSUALIDADES', label: 'Inactivar mensualidades' },
        ],
    },
    {
        label: 'Sedes',
        permisos: [
            { value: 'VER-SEDES', label: 'Ver sedes' },
            { value: 'CREAR-SEDES', label: 'Crear sedes' },
            { value: 'EDITAR-SEDES', label: 'Editar sedes' },
            { value: 'INACTIVAR-SEDES', label: 'Inactivar sedes' },
        ],
    },
    {
        label: 'Códigos',
        permisos: [
            { value: 'CREAR-CODIGOS', label: 'Crear códigos' },
        ],
    },
]

const busqueda = ref('')
// Set wrapeado en ref — recrear con new Set() en cada mutación garantiza reactividad
const seleccionados = ref(new Set())
const totalPermisos = GRUPOS.reduce((acc, g) => acc + g.permisos.length, 0)

watch(() => props.modelValue, (val) => {
    if (val) {
        seleccionados.value = new Set(props.usuario?.permisos ?? [])
        busqueda.value = ''
    }
})

// Array reactivo para usar en template (Set.has no es reactivo en Vue 3)
const seleccionadosArr = computed(() => [...seleccionados.value])
const isSelected = (value) => seleccionadosArr.value.includes(value)

const gruposFiltrados = computed(() => {
    const q = busqueda.value.toLowerCase().trim()
    if (!q) return GRUPOS
    return GRUPOS.map(g => ({
        ...g,
        permisos: g.permisos.filter(p =>
            p.label.toLowerCase().includes(q) || p.value.toLowerCase().includes(q)
        ),
    })).filter(g => g.permisos.length > 0)
})

const countActivos = (grupo) =>
    grupo.permisos.filter(p => seleccionadosArr.value.includes(p.value)).length

const togglePerm = (value) => {
    const s = new Set(seleccionados.value)
    s.has(value) ? s.delete(value) : s.add(value)
    seleccionados.value = new Set(s)
}

const toggleGrupoPermisos = (grupo) => {
    const s = new Set(seleccionados.value)
    const todosOn = grupo.permisos.every(p => s.has(p.value))
    grupo.permisos.forEach(p => todosOn ? s.delete(p.value) : s.add(p.value))
    seleccionados.value = new Set(s)
}

const selectAll = () => {
    seleccionados.value = new Set(GRUPOS.flatMap(g => g.permisos.map(p => p.value)))
}
const clearAll = () => { seleccionados.value = new Set([]) }

const guardar = () => {
    emit('guardar', [...seleccionados.value])
    emit('update:modelValue', false)
}
</script>

<style scoped>
/* ── Overlay ──────────────────────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
    padding: 16px;
}

.modal-card {
    background-color: #f8faf9;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 8px 0 #000;
    width: 100%;
    max-width: 640px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ── Cabecera ─────────────────────────────────────────────────────── */
.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 14px;
    background-color: #0D291C;
    flex-shrink: 0;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background-color: rgba(127, 211, 68, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-head__name {
    font-size: 0.9rem;
    font-weight: 800;
    color: white;
}

.modal-head__sub {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 600;
    margin-top: 1px;
}

.modal-close {
    font-size: 1rem;
    font-weight: 900;
    color: white;
    opacity: 0.4;
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
}

/* ── Toolbar ──────────────────────────────────────────────────────── */
.modal-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 14px 18px 0;
    flex-shrink: 0;
    background-color: white;
}

.toolbar-search {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 160px;
    background-color: #f3f4f6;
    border-radius: 999px;
    padding: 8px 14px;
    border: 1.5px solid #e5e7eb;
    transition: border-color 0.15s, background-color 0.15s;
}

.toolbar-search:focus-within {
    border-color: #299261;
    background-color: white;
}

.toolbar-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.82rem;
    color: #374151;
    flex: 1;
    min-width: 0;
}

.toolbar-clear {
    font-size: 0.7rem;
    font-weight: 900;
    color: #9ca3af;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 2px;
    line-height: 1;
    transition: color 0.12s;
}

.toolbar-clear:hover {
    color: #dc2626;
}

.toolbar-actions {
    display: flex;
    gap: 6px;
}

.quick-btn {
    font-size: 0.7rem;
    font-weight: 800;
    border-radius: 999px;
    padding: 7px 14px;
    cursor: pointer;
    border: 1.5px solid;
    transition: all 0.12s;
    white-space: nowrap;
}

.quick-btn--all {
    background-color: #dcfce7;
    color: #16a34a;
    border-color: #86efac;
}

.quick-btn--all:hover {
    background-color: #bbf7d0;
}

.quick-btn--none {
    background-color: #fee2e2;
    color: #dc2626;
    border-color: #fca5a5;
}

.quick-btn--none:hover {
    background-color: #fecaca;
}

/* ── Contador ─────────────────────────────────────────────────────── */
.modal-counter {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 18px 12px;
    flex-shrink: 0;
    background-color: white;
    border-bottom: 2px solid #f3f4f6;
}

.counter-pill {
    font-size: 0.68rem;
    font-weight: 700;
    color: #0D291C;
    background-color: #f0faf4;
    border-radius: 999px;
    padding: 3px 12px;
    white-space: nowrap;
    border: 1.5px solid #c8e6c9;
}

.counter-num {
    font-weight: 900;
    color: #299261;
    font-size: 0.8rem;
}

.counter-bar-wrap {
    flex: 1;
    height: 7px;
    background-color: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.counter-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #299261, #7FD344);
    border-radius: 999px;
    transition: width 0.3s ease;
}

/* ── Body: grid de tarjetas ───────────────────────────────────────── */
.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 18px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    align-content: start;
    scrollbar-width: thin;
    scrollbar-color: #0D291C22 transparent;
}

@media (max-width: 500px) {
    .modal-body {
        grid-template-columns: 1fr;
    }
}

.perm-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px 20px;
    color: #9ca3af;
    font-size: 0.85rem;
    font-weight: 600;
}

/* ── Tarjeta de grupo ─────────────────────────────────────────────── */
.grupo-card {
    background-color: white;
    border-radius: 18px;
    border: 2px solid #f3f4f6;
    box-shadow: 0 2px 0 #e8ede9;
    transition: border-color 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
}

.grupo-card--active {
    border-color: #c8e6c9;
    box-shadow: 0 2px 0 #a5d6a7;
}

.grupo-card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background-color: #f9fafb;
    border-bottom: 1.5px solid #f3f4f6;
    gap: 6px;
}

.grupo-card--active .grupo-card__head {
    background-color: #f0faf4;
    border-bottom-color: #d7eeda;
}

.grupo-card__head-left {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
}

.grupo-emoji {
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
}

.grupo-label {
    font-size: 0.78rem;
    font-weight: 800;
    color: #0D291C;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.grupo-card__head-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.grupo-count {
    font-size: 0.6rem;
    font-weight: 900;
    border-radius: 999px;
    padding: 1px 7px;
}

.grupo-count--on {
    background-color: #0D291C;
    color: #7FD344;
}

.grupo-count--off {
    background-color: #e5e7eb;
    color: #9ca3af;
}

.grupo-toggle-btn {
    font-size: 0.6rem;
    font-weight: 800;
    border-radius: 999px;
    padding: 3px 9px;
    cursor: pointer;
    border: 1.5px solid;
    white-space: nowrap;
    transition: all 0.12s;
    background-color: #e8f5e9;
    color: #299261;
    border-color: #a5d6a7;
}

.grupo-toggle-btn--on {
    background-color: #fee2e2;
    color: #dc2626;
    border-color: #fca5a5;
}

.grupo-toggle-btn:hover {
    opacity: 0.85;
}

/* ── Permisos dentro de la tarjeta ────────────────────────────────── */
.grupo-permisos {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.perm-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.1s;
    user-select: none;
}

.perm-item:hover {
    background-color: #f0faf4;
}

.perm-item--on {
    background-color: #f0faf4;
}

.perm-check {
    width: 17px;
    height: 17px;
    border-radius: 5px;
    flex-shrink: 0;
    border: 2px solid #d1d5db;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
}

.perm-check--on {
    background-color: #0D291C;
    border-color: #0D291C;
}

.perm-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #4b5563;
    line-height: 1.3;
    flex: 1;
}

.perm-item--on .perm-label {
    color: #0D291C;
    font-weight: 700;
}

/* ── Pie ──────────────────────────────────────────────────────────── */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 14px 22px 20px;
    border-top: 2px solid #f3f4f6;
    flex-shrink: 0;
    background-color: white;
}

.btn-modal {
    flex: 1;
    padding: 11px 18px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 3px 0;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-modal:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important;
}

.btn-modal--cancel {
    background-color: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-modal--cancel:hover {
    background-color: #f3f4f6;
}

.btn-modal--confirm {
    background-color: #0D291C;
    color: white;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-modal--confirm:hover {
    background-color: #132e21;
}

/* ── Animaciones ──────────────────────────────────────────────────── */
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
        transform: scale(0.88) translateY(20px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@keyframes popOut {
    from {
        transform: scale(1);
        opacity: 1;
    }

    to {
        transform: scale(0.93) translateY(10px);
        opacity: 0;
    }
}
</style>