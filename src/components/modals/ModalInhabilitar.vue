<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="modal-overlay" @click.self="emit('update:modelValue', false)">
                <div :class="['modal-card', esInhabilitar ? 'modal-card--danger' : 'modal-card--activate']">

                    <!-- Cabecera -->
                    <div :class="['modal-head', esInhabilitar ? 'modal-head--danger' : 'modal-head--activate']">
                        <div class="modal-head__left">
                            <div :class="['modal-avatar', esInhabilitar ? 'modal-avatar--danger' : 'modal-avatar--activate']">
                                {{ iniciales(cliente?.Nombres) }}
                            </div>
                            <div>
                                <p class="modal-head__name">{{ cliente?.Nombres }}</p>
                                <p class="modal-head__sub">
                                    {{ esInhabilitar ? 'Inhabilitar cliente' : 'Activar cliente' }}
                                </p>
                            </div>
                        </div>
                        <button @click="emit('update:modelValue', false)" class="modal-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Cuerpo -->
                    <div class="modal-body">

                        <div :class="['alert-box', !esInhabilitar && 'alert-box--activate']">
                            <div :class="['alert-icon', !esInhabilitar && 'alert-icon--activate']">
                                <svg v-if="esInhabilitar" xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                    fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                    fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                </svg>
                            </div>
                            <p class="alert-text">
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
                                    <label class="field-label">
                                        Motivo <span class="required-star">*</span>
                                    </label>
                                    <select v-model="motivoLocal" class="field-input">
                                        <option value="">Selecciona un motivo...</option>
                                        <option value="falta_pago">Falta de pago</option>
                                        <option value="solicitud">Solicitud del cliente</option>
                                        <option value="comportamiento">Comportamiento inapropiado</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div class="field-group field-group--full">
                                    <label class="field-label">Observaciones</label>
                                    <textarea v-model="observacionesLocal"
                                        class="field-input field-input--textarea" rows="2"
                                        placeholder="Detalles adicionales..."></textarea>
                                </div>
                            </div>
                        </template>

                        <!-- Al activar solo pide confirmación simple -->
                        <template v-else>
                            <div class="confirm-card">
                                <div class="confirm-avatar">{{ iniciales(cliente?.Nombres) }}</div>
                                <div class="confirm-info">
                                    <p class="confirm-name">{{ cliente?.Nombres }} {{ cliente?.Apellidos }}</p>
                                    <p class="confirm-doc">{{ cliente?.Documento }}</p>
                                </div>
                                <span class="estado-badge">● Inactivo</span>
                            </div>
                        </template>

                    </div>

                    <!-- Pie -->
                    <div class="modal-foot">
                        <button @click="emit('update:modelValue', false)" class="btn-modal btn-cancel">
                            Cancelar
                        </button>
                        <button @click="confirmar"
                            :class="['btn-modal', esInhabilitar ? 'btn-danger' : 'btn-activate']"
                            :disabled="esInhabilitar && !motivoLocal">
                            <svg v-if="esInhabilitar" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
</style>

<style scoped>
/* ── Overlay ──────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(9, 28, 19, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
}

/* ── Card ─────────────────────────────────────────── */
.modal-card {
    background: #ffffff;
    border-radius: 24px;
    width: 100%;
    max-width: 440px;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.modal-card--danger {
    border: 2px solid #b91c1c;
    box-shadow: 0 8px 0 #7f1d1d, 0 24px 60px rgba(185, 28, 28, 0.18);
}

.modal-card--activate {
    border: 2px solid #16a34a;
    box-shadow: 0 8px 0 #14532d, 0 24px 60px rgba(22, 163, 74, 0.18);
}

/* ── Head ─────────────────────────────────────────── */
.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 24px 18px;
    flex-shrink: 0;
}

.modal-head--danger {
    background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
}

.modal-head--activate {
    background: linear-gradient(135deg, #15803d 0%, #14532d 100%);
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.modal-avatar {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.88rem;
    flex-shrink: 0;
    letter-spacing: 0.02em;
}

.modal-avatar--danger {
    background: rgba(255, 255, 255, 0.12);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    color: #fecaca;
}

.modal-avatar--activate {
    background: rgba(255, 255, 255, 0.12);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    color: #bbf7d0;
}

.modal-head__name {
    font-size: 0.98rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
}

.modal-head__sub {
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 3px;
}

.modal-close {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
}

/* ── Body ─────────────────────────────────────────── */
.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
    background: #f9fafb;
}

.modal-body::-webkit-scrollbar {
    width: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 99px;
}

/* ── Alert ────────────────────────────────────────── */
.alert-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #fff;
    border: 1.5px solid #fca5a5;
    border-radius: 16px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(185, 28, 28, 0.07);
}

.alert-box--activate {
    border-color: #86efac;
    box-shadow: 0 2px 8px rgba(22, 163, 74, 0.07);
}

.alert-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #fee2e2;
    color: #b91c1c;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.alert-icon--activate {
    background: #dcfce7;
    color: #16a34a;
}

.alert-text {
    font-size: 0.8rem;
    color: #374151;
    line-height: 1.55;
    flex: 1;
}

.alert-text strong {
    font-weight: 800;
    color: #111827;
}

/* ── Grid & Fields ────────────────────────────────── */
.modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field-group--full {
    grid-column: 1 / -1;
}

.field-label {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #374151;
    padding-left: 2px;
}

.required-star {
    color: #ef4444;
}

.field-input {
    background: #ffffff !important;
    border: 1.5px solid #d1d5db !important;
    border-radius: 12px !important;
    padding: 9px 13px !important;
    font-size: 0.86rem !important;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #111827 !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
    border-color: #b91c1c !important;
    box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1) !important;
}

.field-input--textarea {
    resize: none;
    line-height: 1.5;
}

/* ── Confirm card ─────────────────────────────────── */
.confirm-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    border: 1.5px solid #bbf7d0;
    border-radius: 16px;
    padding: 13px 16px;
    box-shadow: 0 2px 8px rgba(22, 163, 74, 0.07);
}

.confirm-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #15803d, #14532d);
    color: #bbf7d0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.72rem;
    flex-shrink: 0;
}

.confirm-info {
    flex: 1;
    min-width: 0;
}

.confirm-name {
    font-size: 0.82rem;
    font-weight: 800;
    color: #111827;
    line-height: 1.2;
}

.confirm-doc {
    font-size: 0.7rem;
    color: #9ca3af;
    font-family: 'SF Mono', 'Fira Code', monospace;
    margin-top: 2px;
}

.estado-badge {
    color: #dc2626;
    font-weight: 800;
    font-size: 0.72rem;
    white-space: nowrap;
}

/* ── Foot ─────────────────────────────────────────── */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 14px 24px 20px;
    border-top: 1.5px solid #f3f4f6;
    flex-shrink: 0;
    background: #ffffff;
}

/* ── Buttons ──────────────────────────────────────── */
.btn-modal {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 11px 18px;
    border-radius: 12px;
    font-weight: 800;
    font-size: 0.8rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s, opacity 0.2s;
}

.btn-cancel {
    background: #f3f4f6;
    color: #374151;
    border: 1.5px solid #e5e7eb;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-danger {
    background: #b91c1c;
    color: #fff;
    border: 1.5px solid #991b1b;
    box-shadow: 0 4px 14px rgba(185, 28, 28, 0.28);
}

.btn-danger:hover:not(:disabled) {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(185, 28, 28, 0.38);
}

.btn-activate {
    background: #15803d;
    color: #fff;
    border: 1.5px solid #14532d;
    box-shadow: 0 4px 14px rgba(22, 163, 74, 0.28);
}

.btn-activate:hover:not(:disabled) {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(22, 163, 74, 0.38);
}

.btn-modal:disabled {
    opacity: 0.42;
    cursor: not-allowed;
}

.btn-modal:active:not(:disabled) {
    transform: translateY(0);
}

/* ── Animations ───────────────────────────────────── */
.modal-enter-active {
    transition: opacity 0.22s ease;
}

.modal-leave-active {
    transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-card {
    animation: popIn 0.3s cubic-bezier(0.34, 1.5, 0.64, 1) both;
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
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    to {
        transform: scale(0.93) translateY(10px);
        opacity: 0;
    }
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 500px) {
    .modal-card {
        border-radius: 20px;
    }

    .modal-head {
        padding: 16px 18px 14px;
    }

    .modal-body {
        padding: 14px 18px;
    }

    .modal-foot {
        padding: 12px 18px 18px;
    }

    .modal-grid {
        grid-template-columns: 1fr;
    }
}
</style>
