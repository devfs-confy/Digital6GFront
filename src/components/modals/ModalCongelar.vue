<template>
    <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
            <div class="modal-card">

                <div class="modal-head">
                    <div class="modal-head__left">
                        <div class="modal-avatar-sm">{{ iniciales(cliente?.NombreApellidos) }}</div>
                        <div>
                            <p class="modal-head__name">Congelar mensualidad</p>
                            <p class="modal-head__sub">{{ cliente?.T_Estacionamiento?.Nombre ?? '—' }}</p>
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

                <div class="modal-body">

                    <!-- Alerta info -->
                    <div class="info-alert">
                        <div class="info-alert__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                        </div>
                        <p>El tiempo se pausará desde la fecha elegida. Podrás reactivarla cuando lo necesites.</p>
                    </div>

                    <!-- Selector de fecha visual -->
                    <div class="field-group">
                        <label class="field-label">Fecha de congelamiento</label>

                        <div class="cal-wrapper">
                            <!-- Header del calendario -->
                            <div class="cal-header">
                                <button type="button" @click="mesAnterior" class="cal-nav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                    </svg>
                                </button>
                                <span class="cal-mes-label">{{ mesLabel }} {{ anioActual }}</span>
                                <button type="button" @click="mesSiguiente" :disabled="!puedeAvanzar"
                                    class="cal-nav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Días de la semana -->
                            <div class="cal-grid">
                                <span v-for="d in ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']" :key="d"
                                    class="cal-dow">{{ d }}</span>

                                <!-- Espacios vacíos antes del día 1 -->
                                <span v-for="_ in primerDiaSemana" :key="'e' + _" />

                                <!-- Días del mes -->
                                <button v-for="dia in diasDelMes" :key="dia" type="button"
                                    @click="seleccionarDia(dia)" :disabled="!esDiaValido(dia)"
                                    :class="['cal-day',
                                        diaSeleccionado === dia ? 'cal-day--selected' : '',
                                        esHoy(dia) ? 'cal-day--hoy' : '',
                                        !esDiaValido(dia) ? 'cal-day--disabled' : ''
                                    ]">
                                    {{ dia }}
                                </button>
                            </div>
                        </div>

                        <!-- Fecha seleccionada -->
                        <div v-if="fechaCongelar" class="fecha-elegida">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            Congelar el {{ fechaFormateada }}
                        </div>
                        <p v-else class="field-hint">Solo puedes programar hasta 15 días adelante.</p>
                    </div>

                    <!-- Motivo -->
                    <div class="field-group">
                        <label class="field-label">Motivo <span class="hint-opt">(opcional)</span></label>
                        <select v-model="motivo" class="field-input">
                            <option value="">Selecciona un motivo...</option>
                            <option value="viaje">Viaje</option>
                            <option value="lesion">Lesión o enfermedad</option>
                            <option value="vacaciones">Vacaciones</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                </div>

                <div class="modal-foot">
                    <button @click="$emit('update:modelValue', false)" class="btn-modal btn-cancel">
                        Cancelar
                    </button>
                    <button @click="confirmar" :disabled="!fechaCongelar" class="btn-modal btn-freeze">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z" />
                        </svg>
                        Congelar
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    cliente: Object,
})
const emit = defineEmits(['update:modelValue', 'confirmar'])

const motivo = ref('')
const fechaCongelar = ref('')   // 'YYYY-MM-DD'
const diaSeleccionado = ref(null)

const hoyDate = new Date()
hoyDate.setHours(0, 0, 0, 0)

const maxDate = new Date(hoyDate)
maxDate.setDate(maxDate.getDate() + 15)

// Mes visible en el calendario
const mesVisible = ref(hoyDate.getMonth())
const anioActual = ref(hoyDate.getFullYear())

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const mesLabel = computed(() => MESES[mesVisible.value])

const puedeAvanzar = computed(() => {
    // No avanzar más allá del mes que contiene maxDate
    const limMes = maxDate.getMonth()
    const limAnio = maxDate.getFullYear()
    return anioActual.value < limAnio ||
        (anioActual.value === limAnio && mesVisible.value < limMes)
})

const mesAnterior = () => {
    // No retroceder antes del mes actual
    const hoyMes = hoyDate.getMonth()
    const hoyAnio = hoyDate.getFullYear()
    if (anioActual.value === hoyAnio && mesVisible.value === hoyMes) return
    if (mesVisible.value === 0) { mesVisible.value = 11; anioActual.value-- }
    else mesVisible.value--
}

const mesSiguiente = () => {
    if (!puedeAvanzar.value) return
    if (mesVisible.value === 11) { mesVisible.value = 0; anioActual.value++ }
    else mesVisible.value++
}

const diasDelMes = computed(() => {
    return new Date(anioActual.value, mesVisible.value + 1, 0).getDate()
})

const primerDiaSemana = computed(() => {
    return new Date(anioActual.value, mesVisible.value, 1).getDay()
})

const esDiaValido = (dia) => {
    const d = new Date(anioActual.value, mesVisible.value, dia)
    d.setHours(0, 0, 0, 0)
    return d >= hoyDate && d <= maxDate
}

const esHoy = (dia) => {
    return dia === hoyDate.getDate() &&
        mesVisible.value === hoyDate.getMonth() &&
        anioActual.value === hoyDate.getFullYear()
}

const seleccionarDia = (dia) => {
    if (!esDiaValido(dia)) return
    diaSeleccionado.value = dia
    const m = String(mesVisible.value + 1).padStart(2, '0')
    const d = String(dia).padStart(2, '0')
    fechaCongelar.value = `${anioActual.value}-${m}-${d}`
}

const fechaFormateada = computed(() => {
    if (!fechaCongelar.value) return ''
    return new Date(fechaCongelar.value + 'T12:00:00').toLocaleDateString('es-CO', {
        weekday: 'long', day: '2-digit', month: 'long'
    })
})

// Reset al cerrar
watch(() => props.modelValue, (v) => {
    if (!v) {
        fechaCongelar.value = ''
        diaSeleccionado.value = null
        motivo.value = ''
        mesVisible.value = hoyDate.getMonth()
        anioActual.value = hoyDate.getFullYear()
    }
})

const iniciales = (nombre = '') =>
    (nombre ?? '').trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

const confirmar = () => {
    if (!fechaCongelar.value) return
    emit('confirmar', { fecha: fechaCongelar.value, motivo: motivo.value })
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
    background: rgba(9, 28, 19, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 16px;
}

/* ── Card ─────────────────────────────────────────── */
.modal-card {
    background: #ffffff;
    border: 2px solid #0369a1;
    border-radius: 24px;
    box-shadow: 0 8px 0 #0c4a6e, 0 24px 60px rgba(3, 105, 161, 0.2);
    width: 100%;
    max-width: 410px;
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
    padding: 18px 22px 16px;
    background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%);
    flex-shrink: 0;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-avatar-sm {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    color: #bae6fd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.78rem;
    flex-shrink: 0;
    letter-spacing: 0.02em;
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
    color: rgba(255, 255, 255, 0.55);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 2px;
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
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    flex: 1;
    background: #f0f9ff;
    scrollbar-width: thin;
    scrollbar-color: rgba(3, 105, 161, 0.15) transparent;
}

/* ── Info alert ───────────────────────────────────── */
.info-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #ffffff;
    border: 1.5px solid #bae6fd;
    border-radius: 14px;
    padding: 12px 14px;
    box-shadow: 0 2px 8px rgba(3, 105, 161, 0.07);
}

.info-alert__icon {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: #e0f2fe;
    color: #0369a1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.info-alert p {
    font-size: 0.78rem;
    color: #0c4a6e;
    line-height: 1.5;
    flex: 1;
}

/* ── Field group ──────────────────────────────────── */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.field-label {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #0c4a6e;
    padding-left: 2px;
}

.hint-opt {
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    color: #64748b;
    font-size: 0.68rem;
}

/* ── Calendar wrapper ─────────────────────────────── */
.cal-wrapper {
    background: #ffffff;
    border: 1.5px solid #bae6fd;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(3, 105, 161, 0.07);
}

/* ── Calendar header ──────────────────────────────── */
.cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #0369a1, #0c4a6e);
    padding: 10px 14px;
}

.cal-mes-label {
    font-size: 0.82rem;
    font-weight: 800;
    color: #ffffff;
    text-transform: capitalize;
    letter-spacing: -0.01em;
}

.cal-nav {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
}

.cal-nav:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.28);
}

.cal-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* ── Calendar grid ────────────────────────────────── */
.cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 10px 10px 12px;
}

.cal-dow {
    text-align: center;
    font-size: 0.57rem;
    font-weight: 800;
    color: #0369a1;
    text-transform: uppercase;
    padding: 4px 0;
    letter-spacing: 0.04em;
}

.cal-day {
    aspect-ratio: 1;
    border-radius: 8px;
    border: none;
    background: transparent;
    font-size: 0.78rem;
    font-weight: 600;
    color: #1e3a5f;
    cursor: pointer;
    transition: background 0.12s, color 0.12s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.cal-day:hover:not(.cal-day--disabled):not(.cal-day--selected) {
    background: #e0f2fe;
    color: #0369a1;
    transform: scale(1.05);
}

.cal-day--hoy {
    font-weight: 900;
    color: #0369a1;
    background: #e0f2fe;
    border: 1.5px solid #7dd3fc;
}

.cal-day--selected {
    background: linear-gradient(135deg, #0369a1, #0284c7) !important;
    color: #ffffff !important;
    font-weight: 800;
    box-shadow: 0 2px 8px rgba(3, 105, 161, 0.35);
    transform: scale(1.08);
}

.cal-day--disabled {
    color: #cbd5e1;
    cursor: not-allowed;
}

/* ── Fecha elegida ────────────────────────────────── */
.fecha-elegida {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #0369a1;
    background: #e0f2fe;
    border: 1.5px solid #7dd3fc;
    border-radius: 11px;
    padding: 9px 13px;
    text-transform: capitalize;
}

.field-hint {
    font-size: 0.68rem;
    color: #64748b;
    line-height: 1.5;
    padding-left: 2px;
}

/* ── Select ───────────────────────────────────────── */
.field-input {
    background: #ffffff !important;
    border: 1.5px solid #bae6fd !important;
    border-radius: 12px !important;
    padding: 10px 13px !important;
    font-size: 0.86rem !important;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1e3a5f !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
    border-color: #0369a1 !important;
    box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.12) !important;
}

/* ── Foot ─────────────────────────────────────────── */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 14px 20px 20px;
    border-top: 1.5px solid #e0f2fe;
    background: #ffffff;
    flex-shrink: 0;
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
    font-size: 0.8rem;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
}

.btn-cancel {
    background: #f1f5f9;
    color: #374151;
    border: 1.5px solid #e2e8f0;
}

.btn-cancel:hover {
    background: #e2e8f0;
}

.btn-freeze {
    background: #0369a1;
    color: #ffffff;
    border: 1.5px solid #0c4a6e;
    box-shadow: 0 4px 14px rgba(3, 105, 161, 0.3);
}

.btn-freeze:hover:not(:disabled) {
    background: #0284c7;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(3, 105, 161, 0.4);
}

.btn-freeze:active:not(:disabled),
.btn-cancel:active {
    transform: translateY(0);
}

.btn-modal:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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
</style>
