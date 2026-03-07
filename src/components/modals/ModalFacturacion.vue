<template>
    <Transition name="modal">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4"
            style="background:rgba(0,0,0,0.6)" @click.self="$emit('update:modelValue', false)">

            <div class="modal-card bg-[#B8E19E] border-2 border-[#0D291C] rounded-[28px] w-full max-w-[380px] overflow-hidden"
                style="box-shadow:0 7px 0 #000">

                <!-- ── Head ─────────────────────────────────────── -->
                <div class="flex items-center justify-between gap-3 px-6 py-5 bg-[#0D291C]">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style="background:rgba(127,211,68,0.2)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[0.92rem] font-black text-white leading-tight">Datos de facturación</p>
                            <p class="text-[0.63rem] font-semibold" style="color:rgba(255,255,255,0.5)">
                                ¿A qué nombre deseas tu factura?
                            </p>
                        </div>
                    </div>
                    <button @click="$emit('update:modelValue', false)"
                        class="text-white opacity-40 hover:opacity-100 bg-transparent border-none cursor-pointer text-lg font-black transition-opacity leading-none">✕</button>
                </div>

                <!-- ── Body ─────────────────────────────────────── -->
                <div class="px-6 py-5 flex flex-col gap-3.5">

                    <!-- Tipo Persona -->
                    <div class="flex flex-col gap-1.5">
                        <label class="field-lbl">Tipo Persona <span class="text-red-500">*</span></label>
                        <div class="select-wrap">
                            <select v-model="form.tipoPersona" class="fact-select">
                                <option value="">Seleccione...</option>
                                <option value="natural">Persona Natural</option>
                                <option value="juridica">Persona Jurídica</option>
                            </select>
                            <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="#0D291C" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </div>
                    </div>

                    <!-- Tipo Documento -->
                    <div class="flex flex-col gap-1.5">
                        <label class="field-lbl">Tipo Documento <span class="text-red-500">*</span></label>
                        <div class="select-wrap">
                            <select v-model="form.tipoDocumento" class="fact-select">
                                <option value="">Seleccione...</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="NIT">NIT</option>
                                <option value="PA">Pasaporte</option>
                                <option value="TI">Tarjeta de Identidad</option>
                            </select>
                            <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="#0D291C" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </div>
                    </div>

                    <!-- NIT / Documento -->
                    <div class="flex flex-col gap-1.5">
                        <label class="field-lbl">
                            {{ form.tipoDocumento === 'NIT' ? 'NIT' : 'Nit - Documento' }}
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.documento" type="text" class="fact-input"
                            :placeholder="form.tipoDocumento === 'NIT' ? '900123456-1' : '10000000'"
                            @input="form.documento = $event.target.value.replace(/[^0-9\-]/g, '')" />
                    </div>

                    <!-- Razón Social -->
                    <div class="flex flex-col gap-1.5">
                        <label class="field-lbl">
                            {{ form.tipoPersona === 'juridica' ? 'Razón Social' : 'Nombre completo' }}
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.razonSocial" type="text" class="fact-input"
                            :placeholder="form.tipoPersona === 'juridica' ? 'Empresa S.A.S' : 'Juan García'" />
                    </div>

                    <!-- Correo -->
                    <div class="flex flex-col gap-1.5">
                        <label class="field-lbl">Correo <span class="text-red-500">*</span></label>
                        <input v-model="form.correo" type="email" class="fact-input" placeholder="correo@ejemplo.com" />
                    </div>

                    <!-- Teléfono -->
                    <div class="flex flex-col gap-1.5">
                        <label class="field-lbl">Teléfono</label>
                        <input v-model="form.telefono" type="tel" class="fact-input" placeholder="3001234567"
                            maxlength="10" @input="form.telefono = $event.target.value.replace(/\D/g, '')" />
                    </div>

                    <!-- Error -->
                    <Transition name="fade">
                        <div v-if="error"
                            class="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[0.77rem] font-bold bg-red-50 text-red-700 border-2 border-red-300"
                            style="box-shadow:0 3px 0 #fca5a5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            {{ error }}
                        </div>
                    </Transition>
                </div>

                <!-- ── Foot ─────────────────────────────────────── -->
                <div class="flex gap-2.5 px-6 pb-6 pt-1">
                    <button @click="$emit('update:modelValue', false)"
                        class="flex-1 py-3 rounded-full text-[0.78rem] font-black uppercase tracking-wide cursor-pointer bg-white text-[#232B3A] border-2 border-black transition-colors hover:bg-gray-50"
                        style="box-shadow:0 3px 0 #000">
                        Cancelar
                    </button>
                    <button @click="confirmar" :disabled="loading"
                        class="flex-[2] py-3 rounded-full text-[0.78rem] font-black uppercase tracking-wide cursor-pointer bg-[#0D291C] text-white border-2 border-black flex items-center justify-center gap-2 transition-colors hover:bg-[#1a4a2e] disabled:opacity-40 disabled:cursor-not-allowed"
                        style="box-shadow:0 3px 0 #000">
                        <span v-if="loading" class="spinner" />
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

<style scoped>
/* ── Selects ───────────────────────────────────────────────────── */
.select-wrap {
    position: relative;
}

.fact-select {
    width: 100%;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    border: 2px solid #0D291C !important;
    border-radius: 14px !important;
    padding: 10px 38px 10px 14px !important;
    font-size: 0.875rem !important;
    font-weight: 700;
    color: #0D291C !important;
    background: white !important;
    outline: none !important;
    box-shadow: none !important;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}

.fact-select:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
}

.select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

/* ── Inputs ────────────────────────────────────────────────────── */
.fact-input {
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #0D291C !important;
    border-radius: 14px !important;
    padding: 10px 14px !important;
    font-size: 0.875rem !important;
    font-weight: 700;
    color: #0D291C !important;
    background: white !important;
    outline: none !important;
    box-shadow: none !important;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}

.fact-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
}

.fact-input::placeholder {
    color: #9ca3af;
    font-weight: 500;
}

/* ── Label ─────────────────────────────────────────────────────── */
.field-lbl {
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.6;
    padding-left: 3px;
}

/* ── Spinner ───────────────────────────────────────────────────── */
.spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}

/* ── Transiciones ──────────────────────────────────────────────── */
.modal-enter-active {
    transition: opacity 0.2s ease
}

.modal-leave-active {
    transition: opacity 0.15s ease
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0
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
        opacity: 0
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1
    }
}

@keyframes popOut {
    from {
        transform: scale(1) translateY(0);
        opacity: 1
    }

    to {
        transform: scale(0.92) translateY(12px);
        opacity: 0
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px)
}
</style>