<template>
    <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay">
            <div class="modal-card">

                <div class="modal-head">
                    <div class="modal-head__left">
                        <div class="modal-avatar-sm">{{ iniciales(cliente?.NombreApellidos) }}</div>
                        <div>
                            <p class="modal-head__name">Congelar mensualidad</p>
                            <p class="modal-head__sub">{{ cliente?.T_Estacionamiento?.Nombre ?? '—' }}</p>
                        </div>
                    </div>
                    <button @click="cerrar" class="modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <div class="modal-body">

                    <!-- Loading info congelamiento -->
                    <div v-if="!infoCongelamiento" class="info-loading">
                        <div class="info-spinner" />
                        <span>Cargando información de congelamiento...</span>
                    </div>

                    <template v-else>

                        <!-- Bloqueo: no puede congelar -->
                        <div v-if="!puedeCongelar" class="block-alert">
                            <div class="block-alert__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="block-alert__title">No es posible congelar</p>
                                <p class="block-alert__msg">{{ estadoCongelamiento }}</p>
                            </div>
                        </div>

                        <template v-else>
                            <!-- Info disponibilidad -->
                            <div class="info-chips">
                                <div class="info-chip">
                                    <span class="info-chip__label">Días disponibles</span>
                                    <span class="info-chip__val info-chip__val--green">{{
                                        infoCongelamiento.DiasRestantes }}</span>
                                </div>
                                <div class="info-chip">
                                    <span class="info-chip__label">Periodo</span>
                                    <span class="info-chip__val">{{ formatFechaCorta(infoCongelamiento.FechaInicio) }} —
                                        {{ formatFechaCorta(infoCongelamiento.FechaFin) }}</span>
                                </div>
                                <div class="info-chip">
                                    <span class="info-chip__label">Días usados</span>
                                    <span class="info-chip__val">{{ infoCongelamiento.DiasUsados }} / {{
                                        infoCongelamiento.DiasTotalPeriodo }}</span>
                                </div>
                            </div>

                            <!-- Alerta info -->
                            <div class="info-alert">
                                <div class="info-alert__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                    </svg>
                                </div>
                                <p>El periodo se pausará desde la fecha que elijas. La fecha de vencimiento se extenderá
                                    automáticamente.</p>
                            </div>

                            <!-- Selector de fecha -->
                            <div class="field-group">
                                <label class="field-label">Fecha de inicio del congelamiento</label>
                                <div class="cal-wrapper">
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
                                    <div class="cal-grid">
                                        <span v-for="d in ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']" :key="d"
                                            class="cal-dow">{{ d }}</span>
                                        <span v-for="_ in primerDiaSemana" :key="'e' + _" />
                                        <button v-for="dia in diasDelMes" :key="dia" type="button"
                                            @click="seleccionarDia(dia)" :disabled="!esDiaValido(dia)" :class="['cal-day',
                                                diaSeleccionado === dia && mesVisible === hoyDate.getMonth() + (anioActual - hoyDate.getFullYear()) * 12 ? 'cal-day--selected' : '',
                                                esHoy(dia) ? 'cal-day--hoy' : '',
                                                !esDiaValido(dia) ? 'cal-day--disabled' : ''
                                            ]">
                                            {{ dia }}
                                        </button>
                                    </div>
                                </div>
                                <div v-if="fechaCongelar" class="fecha-elegida">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Congelar desde el {{ fechaFormateada }}
                                </div>
                                <p v-else class="field-hint">Selecciona la fecha desde la que se pausará la mensualidad.
                                </p>
                            </div>

                            <!-- Observación -->
                            <div class="field-group">
                                <label class="field-label">Observación <span class="hint-req">*</span></label>
                                <input v-model="observacion" type="text" class="field-input-text"
                                    placeholder="Ej: Viaje, lesión, vacaciones..." maxlength="200" />
                                <p v-if="!observacion.trim() && intentoEnvio" class="field-error">La observación es
                                    obligatoria.</p>
                            </div>

                            <!-- Error del backend -->
                            <div v-if="errExterno" class="backend-error">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                    viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                {{ errExterno }}
                            </div>

                        </template>
                    </template>
                </div>

                <div class="modal-foot">
                    <button @click="cerrar" class="btn-modal btn-cancel">Cancelar</button>
                    <button @click="confirmar"
                        :disabled="!puedeCongelar || !fechaCongelar || !infoCongelamiento || guardando"
                        class="btn-modal btn-freeze">
                        <div v-if="guardando" class="btn-spinner" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z" />
                        </svg>
                        Confirmar congelamiento
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
    infoCongelamiento: Object,   // { EstadoCongelamiento, DiasRestantes, FechaFin, FechaInicio, DiasTotalPeriodo, DiasUsados }
    errExterno: String,   // error que viene del backend tras intentar congelar
})

const emit = defineEmits(['update:modelValue', 'confirmar'])

// ── Estado interno ─────────────────────────────────────────────────
const observacion = ref('')
const fechaCongelar = ref('')   // 'YYYY-MM-DD'
const diaSeleccionado = ref(null)
const intentoEnvio = ref(false)
const guardando = ref(false)

const hoyDate = new Date()
hoyDate.setHours(0, 0, 0, 0)

// Límite: hoy + 2 meses (regla de negocio fija)
const maxDate = computed(() => {
    const d = new Date(hoyDate)
    d.setMonth(d.getMonth() + 2)
    d.setHours(0, 0, 0, 0)
    return d
})

// ── Puede congelar ─────────────────────────────────────────────────
const estadoCongelamiento = computed(() => props.infoCongelamiento?.EstadoCongelamiento ?? '')
const puedeCongelar = computed(() => estadoCongelamiento.value === 'PUEDE CONGELAR')

// ── Calendario ────────────────────────────────────────────────────
const mesVisible = ref(hoyDate.getMonth())
const anioActual = ref(hoyDate.getFullYear())

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const mesLabel = computed(() => MESES[mesVisible.value])

const puedeAvanzar = computed(() => {
    const limMes = maxDate.value.getMonth()
    const limAnio = maxDate.value.getFullYear()
    return anioActual.value < limAnio ||
        (anioActual.value === limAnio && mesVisible.value < limMes)
})

const mesAnterior = () => {
    if (anioActual.value === hoyDate.getFullYear() && mesVisible.value === hoyDate.getMonth()) return
    if (mesVisible.value === 0) { mesVisible.value = 11; anioActual.value-- }
    else mesVisible.value--
    diaSeleccionado.value = null
}

const mesSiguiente = () => {
    if (!puedeAvanzar.value) return
    if (mesVisible.value === 11) { mesVisible.value = 0; anioActual.value++ }
    else mesVisible.value++
    diaSeleccionado.value = null
}

const diasDelMes = computed(() =>
    new Date(anioActual.value, mesVisible.value + 1, 0).getDate()
)

const primerDiaSemana = computed(() =>
    new Date(anioActual.value, mesVisible.value, 1).getDay()
)

const esDiaValido = (dia) => {
    const d = new Date(anioActual.value, mesVisible.value, dia)
    d.setHours(0, 0, 0, 0)
    return d >= hoyDate && d <= maxDate.value
}

const esHoy = (dia) =>
    dia === hoyDate.getDate() &&
    mesVisible.value === hoyDate.getMonth() &&
    anioActual.value === hoyDate.getFullYear()

const esDiaSeleccionado = (dia) => {
    if (!fechaCongelar.value) return false
    const [y, m, d] = fechaCongelar.value.split('-').map(Number)
    return d === dia && (m - 1) === mesVisible.value && y === anioActual.value
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
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    })
})

const formatFechaCorta = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

// ── Reset al cerrar ────────────────────────────────────────────────
watch(() => props.modelValue, (v) => {
    if (!v) {
        fechaCongelar.value = ''
        diaSeleccionado.value = null
        observacion.value = ''
        intentoEnvio.value = false
        guardando.value = false
        mesVisible.value = hoyDate.getMonth()
        anioActual.value = hoyDate.getFullYear()
    }
})

const cerrar = () => emit('update:modelValue', false)

const iniciales = (nombre = '') =>
    (nombre ?? '').trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

// ── Confirmar ──────────────────────────────────────────────────────
const confirmar = () => {
    intentoEnvio.value = true
    if (!fechaCongelar.value || !observacion.value.trim()) return

    // Emitir con los nombres exactos que espera el backend
    emit('confirmar', {
        FechaInicioPeriodoNvo: `${fechaCongelar.value}T00:00:00`,
        Observacion: observacion.value.trim(),
    })
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
    max-width: 420px;
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
    gap: 12px
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
    flex-shrink: 0
}

.modal-head__name {
    font-size: 0.92rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.2
}

.modal-head__sub {
    font-size: 0.62rem;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 2px
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
    transition: background 0.15s, color 0.15s
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.22);
    color: #fff
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

/* ── Loading ──────────────────────────────────────── */
.info-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
}

.info-spinner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2.5px solid #e0f2fe;
    border-top-color: #0369a1;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}

/* ── Bloqueo ──────────────────────────────────────── */
.block-alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 14px;
    padding: 14px;
}

.block-alert__icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #fee2e2;
    color: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0
}

.block-alert__title {
    font-size: 0.85rem;
    font-weight: 800;
    color: #991b1b
}

.block-alert__msg {
    font-size: 0.75rem;
    font-weight: 600;
    color: #b91c1c;
    margin-top: 3px;
    line-height: 1.4
}

/* ── Info chips ───────────────────────────────────── */
.info-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.info-chip {
    flex: 1;
    min-width: 90px;
    background: #fff;
    border: 1.5px solid #bae6fd;
    border-radius: 12px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.info-chip__label {
    font-size: 0.55rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b
}

.info-chip__val {
    font-size: 0.85rem;
    font-weight: 800;
    color: #0c4a6e
}

.info-chip__val--green {
    color: #16a34a
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
    flex-shrink: 0
}

.info-alert p {
    font-size: 0.78rem;
    color: #0c4a6e;
    line-height: 1.5;
    flex: 1
}

/* ── Field group ──────────────────────────────────── */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 7px
}

.field-label {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #0c4a6e;
    padding-left: 2px
}

.hint-req {
    color: #dc2626;
    font-weight: 700
}

.field-hint {
    font-size: 0.68rem;
    color: #64748b;
    line-height: 1.5;
    padding-left: 2px
}

.field-error {
    font-size: 0.68rem;
    color: #dc2626;
    font-weight: 700;
    padding-left: 2px
}

/* ── Calendar ─────────────────────────────────────── */
.cal-wrapper {
    background: #fff;
    border: 1.5px solid #bae6fd;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(3, 105, 161, 0.07)
}

.cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #0369a1, #0c4a6e);
    padding: 10px 14px
}

.cal-mes-label {
    font-size: 0.82rem;
    font-weight: 800;
    color: #fff;
    text-transform: capitalize;
    letter-spacing: -0.01em
}

.cal-nav {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s
}

.cal-nav:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.28)
}

.cal-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed
}

.cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 10px 10px 12px
}

.cal-dow {
    text-align: center;
    font-size: 0.57rem;
    font-weight: 800;
    color: #0369a1;
    text-transform: uppercase;
    padding: 4px 0;
    letter-spacing: 0.04em
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
    font-family: 'Plus Jakarta Sans', sans-serif
}

.cal-day:hover:not(.cal-day--disabled):not(.cal-day--selected) {
    background: #e0f2fe;
    color: #0369a1;
    transform: scale(1.05)
}

.cal-day--hoy {
    font-weight: 900;
    color: #0369a1;
    background: #e0f2fe;
    border: 1.5px solid #7dd3fc
}

.cal-day--selected {
    background: linear-gradient(135deg, #0369a1, #0284c7) !important;
    color: #fff !important;
    font-weight: 800;
    box-shadow: 0 2px 8px rgba(3, 105, 161, 0.35);
    transform: scale(1.08)
}

.cal-day--disabled {
    color: #cbd5e1;
    cursor: not-allowed
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
    text-transform: capitalize
}

/* ── Textarea ─────────────────────────────────────── */
.field-input-text {
    background: #fff !important;
    border: 1.5px solid #bae6fd !important;
    border-radius: 12px !important;
    padding: 10px 13px !important;
    font-size: 0.86rem !important;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1e3a5f !important;
    outline: none !important;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input-text:focus {
    border-color: #0369a1 !important;
    box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.12) !important
}

/* ── Error backend ────────────────────────────────── */
.backend-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #b91c1c;
    line-height: 1.5;
}

/* ── Foot ─────────────────────────────────────────── */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 14px 20px 20px;
    border-top: 1.5px solid #e0f2fe;
    background: #fff;
    flex-shrink: 0
}

/* ── Buttons — misma temática 3D del sistema ──────── */
.btn-modal {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 14px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 3px 0;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
}

.btn-modal:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important;
}

.btn-modal:disabled {
    opacity: 0.4;
    cursor: not-allowed
}

/* Cancelar — blanco con borde negro */
.btn-cancel {
    background: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-cancel:hover:not(:disabled) {
    background: #f1f5f9
}

/* Congelar — azul 3D */
.btn-freeze {
    background: #0369a1;
    color: #fff;
    border-color: #0c4a6e;
    box-shadow: 0 3px 0 #0c4a6e;
}

.btn-freeze:hover:not(:disabled) {
    background: #0284c7
}

.btn-spinner {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0
}

/* ── Animations ───────────────────────────────────── */
.modal-enter-active {
    transition: opacity 0.22s ease
}

.modal-leave-active {
    transition: opacity 0.15s ease
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0
}

.modal-enter-active .modal-card {
    animation: popIn 0.3s cubic-bezier(0.34, 1.5, 0.64, 1) both
}

.modal-leave-active .modal-card {
    animation: popOut 0.18s ease-in both
}

@media (max-width: 600px) {
    .btn-modal {
        font-size: 0.7rem
    }

}

@keyframes popIn {
    from {
        transform: scale(0.88) translateY(20px);
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
        transform: scale(0.93) translateY(10px);
        opacity: 0
    }
}
</style>