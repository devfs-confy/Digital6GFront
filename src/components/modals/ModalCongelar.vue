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
                    <button @click="$emit('update:modelValue', false)" class="modal-close">✕</button>
                </div>

                <div class="modal-body">

                    <!-- Alerta info -->
                    <div class="info-alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0369a1"
                            viewBox="0 0 24 24" class="flex-shrink-0 mt-0.5">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        <p>El tiempo se pausará desde la fecha elegida. Podrás reactivarla cuando lo necesites.</p>
                    </div>

                    <!-- Selector de fecha visual -->
                    <div class="field-group">
                        <label class="field-label">Fecha de congelamiento</label>

                        <!-- Header del calendario -->
                        <div class="cal-header">
                            <button type="button" @click="mesAnterior" class="cal-nav">‹</button>
                            <span class="cal-mes-label">{{ mesLabel }} {{ anioActual }}</span>
                            <button type="button" @click="mesSiguiente" :disabled="!puedeAvanzar"
                                class="cal-nav">›</button>
                        </div>

                        <!-- Días de la semana -->
                        <div class="cal-grid">
                            <span v-for="d in ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']" :key="d" class="cal-dow">{{ d
                                }}</span>

                            <!-- Espacios vacíos antes del día 1 -->
                            <span v-for="_ in primerDiaSemana" :key="'e' + _" />

                            <!-- Días del mes -->
                            <button v-for="dia in diasDelMes" :key="dia" type="button" @click="seleccionarDia(dia)"
                                :disabled="!esDiaValido(dia)" :class="['cal-day',
                                    diaSeleccionado === dia ? 'cal-day--selected' : '',
                                    esHoy(dia) ? 'cal-day--hoy' : '',
                                    !esDiaValido(dia) ? 'cal-day--disabled' : ''
                                ]">
                                {{ dia }}
                            </button>
                        </div>

                        <!-- Fecha seleccionada -->
                        <div v-if="fechaCongelar" class="fecha-elegida">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#0369a1"
                                viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            Congelar el {{ fechaFormateada }}
                        </div>
                        <p v-else class="field-hint">Solo puedes programar hasta 15 días adelante.</p>
                    </div>

                    <!-- Motivo -->
                    <div class="field-group">
                        <label class="field-label">Motivo (opcional)</label>
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
                    <button @click="$emit('update:modelValue', false)" class="btn-modal btn-modal--cancel">
                        Cancelar
                    </button>
                    <button @click="confirmar" :disabled="!fechaCongelar" class="btn-modal btn-modal--freeze">
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

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 16px;
}

.modal-card {
    background-color: #e0f2fe;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 7px 0 #0c4a6e;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 14px;
    background-color: #0369a1;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-avatar-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #bae6fd;
    color: #0369a1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.75rem;
    flex-shrink: 0;
}

.modal-head__name {
    font-size: 0.9rem;
    font-weight: 800;
    color: white;
}

.modal-head__sub {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
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
}

.modal-close:hover {
    opacity: 1;
}

.modal-body {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.info-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    border: 1.5px solid #7dd3fc;
    border-radius: 14px;
    padding: 11px 14px;
    font-size: 0.8rem;
    color: #0c4a6e;
    line-height: 1.5;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-label {
    font-size: 0.63rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0c4a6e;
    padding-left: 3px;
}

/* ── Calendario ──────────────────────────────────────────────────── */
.cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #0369a1;
    border-radius: 14px 14px 0 0;
    padding: 10px 14px;
}

.cal-mes-label {
    font-size: 0.82rem;
    font-weight: 800;
    color: white;
    text-transform: capitalize;
}

.cal-nav {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 8px;
    width: 28px;
    height: 28px;
    color: white;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
}

.cal-nav:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
}

.cal-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
    background-color: white;
    border: 2px solid #0369a1;
    border-top: none;
    border-radius: 0 0 14px 14px;
    padding: 8px 10px 10px;
}

.cal-dow {
    text-align: center;
    font-size: 0.58rem;
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
    color: #0D291C;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cal-day:hover:not(.cal-day--disabled):not(.cal-day--selected) {
    background-color: #bae6fd;
    color: #0369a1;
}

.cal-day--hoy {
    font-weight: 900;
    color: #0369a1;
    border: 1.5px solid #7dd3fc;
}

.cal-day--selected {
    background-color: #0369a1 !important;
    color: white !important;
    font-weight: 800;
}

.cal-day--disabled {
    color: #d1d5db;
    cursor: not-allowed;
}

.fecha-elegida {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #0369a1;
    background: rgba(255, 255, 255, 0.7);
    border: 1.5px solid #7dd3fc;
    border-radius: 10px;
    padding: 8px 12px;
    text-transform: capitalize;
}

.field-hint {
    font-size: 0.68rem;
    color: #0c4a6e;
    opacity: 0.55;
    line-height: 1.5;
    padding-left: 3px;
}

.field-input {
    background-color: white !important;
    border: 2px solid #0369a1 !important;
    border-radius: 14px !important;
    padding: 10px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s;
}

.field-input:focus {
    border-color: #0284c7 !important;
    box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.2) !important;
}

.modal-foot {
    display: flex;
    gap: 10px;
    padding: 12px 22px 20px;
    border-top: 2px solid rgba(3, 105, 161, 0.15);
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-modal:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important;
}

.btn-modal:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-modal--cancel {
    background-color: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-modal--freeze {
    background-color: #0369a1;
    color: white;
    border-color: #0c4a6e;
    box-shadow: 0 3px 0 #0c4a6e;
}

.btn-modal--freeze:hover:not(:disabled) {
    background-color: #0284c7;
}

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