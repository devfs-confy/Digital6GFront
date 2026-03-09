<template>
    <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">

            <div class="modal-card">

                <!-- ── Head ─────────────────────────────────────── -->
                <div class="modal-head">
                    <div class="modal-head__left">
                        <div class="modal-head__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg>
                        </div>
                        <div>
                            <p class="modal-head__name">Datos de facturación</p>
                            <p class="modal-head__sub">¿A qué nombre deseas tu factura?</p>
                        </div>
                    </div>
                    <button @click="$emit('update:modelValue', false)" class="modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <!-- ── Body ─────────────────────────────────────── -->
                <div class="modal-body">

                    <!-- Row: Tipo Persona + Tipo Documento -->
                    <div class="form-grid">
                        <div class="field-group">
                            <label class="field-label">Tipo Persona <span class="required-star">*</span></label>
                            <div class="select-wrap">
                                <select v-model="form.tipoPersona" class="fact-select">
                                    <option value="">Seleccione...</option>
                                    <option value="natural">Persona Natural</option>
                                    <option value="juridica">Persona Jurídica</option>
                                </select>
                                <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                    fill="#0D291C" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                        </div>

                        <div class="field-group">
                            <label class="field-label">Tipo Documento <span class="required-star">*</span></label>
                            <div class="select-wrap">
                                <select v-model="form.tipoDocumento" class="fact-select">
                                    <option value="">Seleccione...</option>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                    <option value="NIT">NIT</option>
                                    <option value="PA">Pasaporte</option>
                                    <option value="TI">Tarjeta de Identidad</option>
                                </select>
                                <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                    fill="#0D291C" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Número documento -->
                    <div class="field-group">
                        <label class="field-label">
                            {{ form.tipoDocumento === 'NIT' ? 'NIT' : 'Nit - Documento' }}
                            <span class="required-star">*</span>
                        </label>
                        <input v-model="form.documento" type="text" class="fact-input"
                            :placeholder="form.tipoDocumento === 'NIT' ? '900123456-1' : '10000000'"
                            @input="form.documento = $event.target.value.replace(/[^0-9\-]/g, '')" />
                    </div>

                    <!-- Razón social / Nombre -->
                    <div class="field-group">
                        <label class="field-label">
                            {{ form.tipoPersona === 'juridica' ? 'Razón Social' : 'Nombre completo' }}
                            <span class="required-star">*</span>
                        </label>
                        <input v-model="form.razonSocial" type="text" class="fact-input"
                            :placeholder="form.tipoPersona === 'juridica' ? 'Empresa S.A.S' : 'Juan García'" />
                    </div>

                    <!-- Row: Correo + Teléfono -->
                    <div class="form-grid">
                        <div class="field-group">
                            <label class="field-label">Correo <span class="required-star">*</span></label>
                            <input v-model="form.correo" type="email" class="fact-input"
                                placeholder="correo@ejemplo.com" />
                        </div>
                        <div class="field-group">
                            <label class="field-label">Teléfono <span class="hint-opt">(opcional)</span></label>
                            <input v-model="form.telefono" type="tel" class="fact-input" placeholder="3001234567"
                                maxlength="10"
                                @input="form.telefono = $event.target.value.replace(/\D/g, '')" />
                        </div>
                    </div>

                    <!-- Error -->
                    <Transition name="fade">
                        <div v-if="error" class="error-alert">
                            <div class="error-alert__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            </div>
                            <span>{{ error }}</span>
                        </div>
                    </Transition>
                </div>

                <!-- ── Foot ─────────────────────────────────────── -->
                <div class="modal-foot">
                    <button @click="$emit('update:modelValue', false)" class="btn-modal btn-cancel">
                        Cancelar
                    </button>
                    <button @click="confirmar" :disabled="loading" class="btn-modal btn-save">
                        <span v-if="loading" class="spinner" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        {{ loading ? 'Guardando...' : 'Aceptar' }}
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    // Datos precargados opcionales
    datosIniciales: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'confirmar'])

const loading = ref(false)
const error = ref('')

const form = reactive({
    tipoPersona: '',
    tipoDocumento: '',
    documento: '',
    razonSocial: '',
    correo: '',
    telefono: '',
})

// Precarga si vienen datos del padre
watch(() => props.modelValue, (val) => {
    if (val) {
        error.value = ''
        Object.assign(form, {
            tipoPersona: props.datosIniciales?.tipoPersona ?? '',
            tipoDocumento: props.datosIniciales?.tipoDocumento ?? '',
            documento: props.datosIniciales?.documento ?? '',
            razonSocial: props.datosIniciales?.razonSocial ?? '',
            correo: props.datosIniciales?.correo ?? '',
            telefono: props.datosIniciales?.telefono ?? '',
        })
    }
})

const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

const confirmar = async () => {
    error.value = ''

    if (!form.tipoPersona) { error.value = 'Selecciona el tipo de persona.'; return }
    if (!form.tipoDocumento) { error.value = 'Selecciona el tipo de documento.'; return }
    if (!form.documento.trim()) { error.value = 'Ingresa el número de documento.'; return }
    if (!form.razonSocial.trim()) {
        error.value = form.tipoPersona === 'juridica'
            ? 'Ingresa la razón social.'
            : 'Ingresa el nombre completo.'
        return
    }
    if (!form.correo || !emailValido(form.correo)) {
        error.value = 'Ingresa un correo electrónico válido.'; return
    }

    loading.value = true
    try {
        // Emite los datos al padre para que haga la llamada API
        await emit('confirmar', { ...form })
        emit('update:modelValue', false)
    } finally {
        loading.value = false
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
</style>

<style scoped>
/* ── Overlay ──────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
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
    border: 2px solid #0D291C;
    border-radius: 24px;
    box-shadow: 0 8px 0 #000, 0 24px 60px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Head ─────────────────────────────────────────── */
.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 22px 16px;
    background: linear-gradient(135deg, #122e1e 0%, #0D291C 100%);
    flex-shrink: 0;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-head__icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(127, 211, 68, 0.15);
    border: 1.5px solid rgba(127, 211, 68, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-head__name {
    font-size: 0.92rem;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
    letter-spacing: -0.01em;
}

.modal-head__sub {
    font-size: 0.62rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.45);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-top: 2px;
}

.modal-close {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
}

/* ── Body ─────────────────────────────────────────── */
.modal-body {
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 13px;
    overflow-y: auto;
    flex: 1;
    background: #f8faf8;
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.12) transparent;
}

.modal-body::-webkit-scrollbar {
    width: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.15);
    border-radius: 99px;
}

/* ── Form grid ────────────────────────────────────── */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

/* ── Field group ──────────────────────────────────── */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field-label {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #374151;
    padding-left: 2px;
}

.required-star {
    color: #ef4444;
}

.hint-opt {
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    color: #9ca3af;
    font-size: 0.64rem;
}

/* ── Select wrapper ───────────────────────────────── */
.select-wrap {
    position: relative;
}

.fact-select {
    width: 100%;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    background: #ffffff !important;
    border: 1.5px solid #d1d9d1 !important;
    border-radius: 12px !important;
    padding: 10px 36px 10px 13px !important;
    font-size: 0.86rem !important;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #111827 !important;
    outline: none !important;
    box-shadow: none !important;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.fact-select:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12) !important;
}

.select-arrow {
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.5;
}

/* ── Inputs ───────────────────────────────────────── */
.fact-input {
    width: 100%;
    box-sizing: border-box;
    background: #ffffff !important;
    border: 1.5px solid #d1d9d1 !important;
    border-radius: 12px !important;
    padding: 10px 13px !important;
    font-size: 0.86rem !important;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #111827 !important;
    outline: none !important;
    box-shadow: none !important;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.fact-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12) !important;
}

.fact-input::placeholder {
    color: #bdc5bc;
    font-weight: 500;
}

/* ── Error alert ──────────────────────────────────── */
.error-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1.5px solid #fca5a5;
    border-radius: 12px;
    padding: 10px 13px;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
}

.error-alert__icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #fee2e2;
    color: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.error-alert span {
    font-size: 0.78rem;
    font-weight: 600;
    color: #b91c1c;
    line-height: 1.4;
}

/* ── Foot ─────────────────────────────────────────── */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 14px 22px 20px;
    border-top: 1.5px solid #e8ede8;
    background: #ffffff;
    flex-shrink: 0;
}

/* ── Buttons ──────────────────────────────────────── */
.btn-modal {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 18px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
}

.btn-cancel {
    background: #f3f4f6;
    color: #374151;
    border: 1.5px solid #e5e7eb;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-save {
    flex: 2;
    background: #0D291C;
    color: #ffffff;
    border: 1.5px solid #0D291C;
    box-shadow: 0 4px 14px rgba(13, 41, 28, 0.25);
}

.btn-save:hover:not(:disabled) {
    background: #1a4a2e;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(13, 41, 28, 0.35);
}

.btn-save:active:not(:disabled),
.btn-cancel:active {
    transform: translateY(0);
}

.btn-modal:disabled {
    opacity: 0.42;
    cursor: not-allowed;
}

/* ── Spinner ──────────────────────────────────────── */
.spinner {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Transitions ──────────────────────────────────── */
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 480px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .modal-card {
        border-radius: 20px;
    }

    .modal-body {
        padding: 16px 18px;
    }

    .modal-foot {
        padding: 12px 18px 18px;
    }
}
</style>
