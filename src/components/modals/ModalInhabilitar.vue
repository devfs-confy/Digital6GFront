<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="modal-overlay" @click.self="emit('update:modelValue', false)">
                <div class="modal-card modal-card--danger">

                    <!-- Cabecera -->
                    <div class="modal-head modal-head--danger">
                        <div class="modal-head__left">
                            <div class="modal-avatar modal-avatar--danger">
                                {{ iniciales(cliente?.Nombres) }}
                            </div>
                            <div>
                                <p class="modal-head__name modal-head__name--danger">{{ cliente?.Nombres }}</p>
                                <p class="modal-head__sub modal-head__sub--danger">
                                    {{ esInhabilitar ? 'Inhabilitar cliente' : 'Activar cliente' }}
                                </p>
                            </div>
                        </div>
                        <button @click="emit('update:modelValue', false)"
                            class="modal-close modal-close--danger">✕</button>
                    </div>

                    <!-- Cuerpo -->
                    <div class="modal-body">

                        <div :class="['danger-alert', !esInhabilitar && 'danger-alert--activate']">
                            <svg v-if="esInhabilitar" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                fill="#b91c1c" viewBox="0 0 24 24" class="flex-shrink-0 mt-0.5">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#16a34a"
                                viewBox="0 0 24 24" class="flex-shrink-0 mt-0.5">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                            </svg>
                            <p>
                                <template v-if="esInhabilitar">
                                    Al inhabilitar a <strong>{{ cliente?.Nombres }}</strong>, no podrá
                                    acceder al sistema ni renovar su membresía. Esta acción puede revertirse.
                                </template>
                                <template v-else>
                                    Al activar a <strong>{{ cliente?.Nombres }}</strong>, recuperará
                                    el acceso completo al sistema y podrá renovar su membresía.
                                </template>
                            </p>
                        </div>

                        <!-- Motivo y observaciones solo al inhabilitar -->
                        <template v-if="esInhabilitar">
                            <div class="modal-grid">
                                <div class="field-group field-group--full">
                                    <label class="field-label field-label--danger">
                                        Motivo <span style="color:#ef4444">*</span>
                                    </label>
                                    <select v-model="motivoLocal" class="field-input field-input--danger">
                                        <option value="">Selecciona un motivo...</option>
                                        <option value="falta_pago">Falta de pago</option>
                                        <option value="solicitud">Solicitud del cliente</option>
                                        <option value="comportamiento">Comportamiento inapropiado</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div class="field-group field-group--full">
                                    <label class="field-label field-label--danger">Observaciones</label>
                                    <textarea v-model="observacionesLocal"
                                        class="field-input field-input--danger field-input--textarea" rows="2"
                                        placeholder="Detalles adicionales..."></textarea>
                                </div>
                            </div>
                        </template>

                        <!-- Al activar solo pide confirmación simple -->
                        <template v-else>
                            <div class="confirm-card">
                                <div class="row-avatar">{{ iniciales(cliente?.Nombres) }}</div>
                                <div>
                                    <p class="font-bold text-[#0D291C] text-sm">{{ cliente?.Nombres }} {{
                                        cliente?.Apellidos }}</p>
                                    <p class="text-xs text-gray-500 font-mono">{{ cliente?.Documento }}</p>
                                </div>
                                <span class="estado-badge-inactivo ml-auto">● Inactivo</span>
                            </div>
                        </template>

                    </div>

                    <!-- Pie -->
                    <div class="modal-foot modal-foot--danger">
                        <button @click="emit('update:modelValue', false)" class="btn-modal-dark btn-modal-dark--cancel">
                            Cancelar
                        </button>
                        <button @click="confirmar"
                            :class="['btn-modal-dark', esInhabilitar ? 'btn-modal-dark--danger' : 'btn-modal-dark--activate']"
                            :disabled="esInhabilitar && !motivoLocal">
                            {{ esInhabilitar ? 'Inhabilitar' : 'Activar cliente' }}
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    cliente: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'confirmar'])

const motivoLocal = ref('')
const observacionesLocal = ref('')

// true = inhabilitar, false = activar
const esInhabilitar = computed(() => !!props.cliente?.Estado)

watch(() => props.modelValue, (open) => {
    if (open) {
        motivoLocal.value = ''
        observacionesLocal.value = ''
    }
})

const confirmar = () => {
    if (esInhabilitar.value && !motivoLocal.value) return
    emit('confirmar', {
        nuevoEstado: !props.cliente?.Estado,
        motivo: motivoLocal.value,
        observaciones: observacionesLocal.value,
    })
}

const iniciales = (nombre = '') =>
    nombre ? nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '??'
</script>

<style scoped>
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

.modal-card--danger {
    background-color: #fde8e8;
    border-color: #b91c1c;
    box-shadow: 0 7px 0 #7f1d1d;
    max-width: 440px;
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
    background: none;
    border: none;
    cursor: pointer;
}

.modal-close:hover {
    opacity: 1;
}

.modal-close--danger {
    color: #b91c1c;
}

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

.field-label--danger {
    color: #7f1d1d;
    opacity: 1;
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

.field-input--danger {
    border-color: #b91c1c !important;
}

.field-input--danger:focus {
    border-color: #b91c1c !important;
    box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.15) !important;
}

.field-input--textarea {
    border-radius: 14px !important;
    resize: none;
}

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

.danger-alert--activate {
    border-color: #16a34a;
    color: #14532d;
}

/* Tarjeta de confirmación para activar */
.confirm-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border: 1.5px solid rgba(22, 163, 74, 0.25);
    border-radius: 16px;
    padding: 12px 16px;
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
    font-size: 0.72rem;
    flex-shrink: 0;
}

.estado-badge-inactivo {
    color: #dc2626;
    font-weight: 800;
    font-size: 0.75rem;
}

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

.btn-modal-dark:disabled {
    opacity: 0.45;
    cursor: not-allowed;
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

.btn-modal-dark--danger:active {
    box-shadow: 0 1px 0px #7f1d1d;
}

.btn-modal-dark--activate {
    background-color: #15803d;
    color: white;
    border-color: #14532d;
    box-shadow: 0 4px 0px #14532d;
}

.btn-modal-dark--activate:active {
    box-shadow: 0 1px 0px #14532d;
}

/* Animación */
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

@media (max-width: 500px) {
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

    .modal-grid {
        grid-template-columns: 1fr;
    }
}
</style>