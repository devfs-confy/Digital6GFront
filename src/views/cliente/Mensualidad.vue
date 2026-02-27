<template>
    <div class="h-full flex flex-col gap-6">

        <!-- Header -->
        <div class="flex items-center justify-between relative bg-white rounded-full p-4">
            <div class="w-[80px]">
                <button @click="$router.back()" class="add-btn">
                    Volver
                </button>
            </div>
            <h2 class="text-2xl font-bold text-[#232B3A]">Mis Mensualidades</h2>
            <button @click="modalCodigo = true" class="add-btn">
                + Añadir
            </button>
        </div>

        <!-- Grid de tarjetas -->
        <div class="mensualidades-grid">

            <div v-if="mensualidades.length === 0" class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <p>No tienes mensualidades activas</p>
            </div>

            <div v-for="(m, i) in mensualidades" :key="m.id" class="mensualidad-card" :class="estadoClase(m)"
                :style="{ animationDelay: `${i * 0.08}s` }">
                <!-- Banda de estado superior -->
                <div class="card-band" :class="`card-band--${m.estado}`" />

                <!-- Cabecera de la tarjeta -->
                <div class="card-head">
                    <div class="card-avatar">
                        {{ iniciales(m.nombre) }}
                    </div>
                    <div class="card-head__info">
                        <h3 class="card-nombre">{{ m.nombre }}</h3>
                        <span class="card-estado-badge" :class="`badge--${m.estado}`">
                            {{ estadoLabel(m.estado) }}
                        </span>
                    </div>
                    <!-- Días restantes -->
                    <div class="card-dias" :class="`card-dias--${m.estado}`">
                        <span class="card-dias__num">{{ diasRestantes(m.fechaFin) }}</span>
                        <span class="card-dias__label">días</span>
                    </div>
                </div>

                <!-- Datos -->
                <div class="card-data">
                    <div class="card-data__item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                        </svg>
                        <span class="card-data__label">Vence</span>
                        <span class="card-data__val">{{ formatFecha(m.fechaFin) }}</span>
                    </div>
                    <div class="card-data__item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span class="card-data__label">Sede</span>
                        <span class="card-data__val">{{ m.sede }}</span>
                    </div>
                </div>

                <!-- Barra de progreso temporal -->
                <div class="card-progress-wrap">
                    <div class="card-progress-bar">
                        <div class="card-progress-fill" :class="`fill--${m.estado}`"
                            :style="{ width: `${porcentajeVigencia(m)}%` }" />
                    </div>
                    <span class="card-progress-label">
                        {{ porcentajeVigencia(m) }}% del periodo
                    </span>
                </div>

                <!-- Acciones -->
                <div class="card-actions">
                    <button @click="abrirPago(m)" class="btn-pagar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        Pagar
                    </button>
                    <button @click="abrirCongelar(m)" class="btn-congelar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z" />
                        </svg>
                        Congelar
                    </button>
                </div>
            </div>

        </div>


        <!-- ══════════════════════════════════════════
             MODAL — CÓDIGO DE VERIFICACIÓN (AÑADIR)
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalCodigo" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card">

                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
                                </svg>
                            </div>
                            <div>
                                <p class="modal-head__name">Añadir mensualidad</p>
                                <p class="modal-head__sub">Ingresa el código que te proporcionó la sede</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <div class="field-group">
                            <label class="field-label">Código de verificación</label>
                            <input v-model="codigoInput" type="text" class="field-input field-input--code"
                                placeholder="Ej: PARK-2024-XXXX" maxlength="20" @keyup.enter="confirmarCodigo"
                                autofocus />
                            <p class="field-hint">El código es entregado por el administrador de la sede al registrar tu
                                mensualidad.</p>
                        </div>
                    </div>

                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarCodigo" class="btn-modal btn-modal--confirm"
                            :disabled="!codigoInput.trim()">
                            Aceptar
                        </button>
                    </div>

                </div>
            </div>
        </Transition>


        <!-- ══════════════════════════════════════════
             MODAL — PAGAR
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalPago" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card">

                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-avatar-sm">{{ iniciales(mensualidadAccion?.nombre) }}</div>
                            <div>
                                <p class="modal-head__name">Renovar mensualidad</p>
                                <p class="modal-head__sub">{{ mensualidadAccion?.nombre }} · {{ mensualidadAccion?.sede
                                    }}</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <div class="pago-resumen">
                            <div class="pago-resumen__item">
                                <span class="pago-resumen__label">Sede</span>
                                <span class="pago-resumen__val">{{ mensualidadAccion?.sede }}</span>
                            </div>
                            <div class="pago-sep" />
                            <div class="pago-resumen__item">
                                <span class="pago-resumen__label">Vence</span>
                                <span class="pago-resumen__val">{{ formatFecha(mensualidadAccion?.fechaFin) }}</span>
                            </div>
                            <div class="pago-sep" />
                            <div class="pago-resumen__item">
                                <span class="pago-resumen__label">Valor</span>
                                <span class="pago-resumen__val pago-resumen__val--price">{{ mensualidadAccion?.valor
                                    }}</span>
                            </div>
                        </div>
                        <p class="field-hint mt-2">Al confirmar serás redirigido a la pasarela de pago de la sede.</p>
                    </div>

                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarPago" class="btn-modal btn-modal--confirm">
                            Ir a pagar
                        </button>
                    </div>

                </div>
            </div>
        </Transition>


        <!-- ══════════════════════════════════════════
             MODAL — CONGELAR
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalCongelar" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card modal-card--warn">

                    <div class="modal-head modal-head--warn">
                        <div class="modal-head__left">
                            <div class="modal-avatar-sm modal-avatar-sm--warn">{{ iniciales(mensualidadAccion?.nombre)
                                }}</div>
                            <div>
                                <p class="modal-head__name modal-head__name--warn">Congelar mensualidad</p>
                                <p class="modal-head__sub">{{ mensualidadAccion?.nombre }}</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body">
                        <div class="warn-alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#d97706"
                                viewBox="0 0 24 24" class="flex-shrink-0">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            <p>Al congelar tu mensualidad el tiempo se pausará. Podrás reactivarla cuando lo necesites
                                desde esta misma pantalla.</p>
                        </div>
                        <div class="field-group mt-3">
                            <label class="field-label">Motivo (opcional)</label>
                            <select class="field-input">
                                <option value="">Selecciona un motivo...</option>
                                <option value="viaje">Viaje</option>
                                <option value="lesion">Lesión o enfermedad</option>
                                <option value="vacaciones">Vacaciones</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarCongelar" class="btn-modal btn-modal--warn">
                            Congelar
                        </button>
                    </div>

                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref } from 'vue'

// ── Estado de modales ──────────────────────────────────────────────
const modalCodigo = ref(false)
const modalPago = ref(false)
const modalCongelar = ref(false)
const codigoInput = ref('')
const mensualidadAccion = ref(null)

// ── Datos mock — reemplazar con llamada al API ─────────────────────

const mensualidades = ref([
    {
        id: 1,
        nombre: 'Mensualidad Digital6G',
        fechaInicio: '2025-12-01',
        fechaFin: '2026-02-28',
        sede: 'Digital6G',
        estado: 'por_vencer',
        valor: '$120.000',
    },
    {
        id: 2,
        nombre: 'Mensualidad CSU',
        fechaInicio: '2025-11-01',
        fechaFin: '2026-03-31',
        sede: 'CSU',
        estado: 'activa',
        valor: '$95.000',
    },
    {
        id: 3,
        nombre: 'Mensualidad CSU',
        fechaInicio: '2025-11-01',
        fechaFin: '2026-10-31',
        sede: 'UCS',
        estado: 'congelada',
        valor: '$95.000',
    },
])

// ── Helpers ────────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

const diasRestantes = (fechaFin) => {
    if (!fechaFin) return 0
    const diff = new Date(fechaFin) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const porcentajeVigencia = (m) => {
    const total = new Date(m.fechaFin) - new Date(m.fechaInicio)
    const usado = new Date() - new Date(m.fechaInicio)
    const pct = Math.min(100, Math.max(0, Math.round((usado / total) * 100)))
    return pct
}

const estadoClase = (m) => ({
    'card--activa': m.estado === 'activa',
    'card--por_vencer': m.estado === 'por_vencer',
    'card--vencida': m.estado === 'vencida',
    'card--congelada': m.estado === 'congelada',
})

const estadoLabel = (estado) => ({
    activa: 'Activa',
    por_vencer: 'Por vencer',
    vencida: 'Vencida',
    congelada: 'Congelada',
})[estado] ?? estado

// ── Acciones ───────────────────────────────────────────────────────
const abrirPago = (m) => { mensualidadAccion.value = m; modalPago.value = true }
const abrirCongelar = (m) => { mensualidadAccion.value = m; modalCongelar.value = true }

const cerrarModales = () => {
    modalCodigo.value = false
    modalPago.value = false
    modalCongelar.value = false
    codigoInput.value = ''
    mensualidadAccion.value = null
}

const confirmarCodigo = () => {
    if (!codigoInput.value.trim()) return
    console.log('Código ingresado:', codigoInput.value)
    cerrarModales()
}

const confirmarPago = () => {
    console.log('Pagar:', mensualidadAccion.value)
    cerrarModales()
}

const confirmarCongelar = () => {
    console.log('Congelar:', mensualidadAccion.value)
    cerrarModales()
}
</script>

<style scoped>
/* ── Header ──────────────────────────────────────────────────────── */
.back-btn {
    font-size: 0.8rem;
    font-weight: 700;
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 999px;
    transition: background-color 0.15s, color 0.15s;
}

.back-btn:hover {
    background-color: #f3f4f6;
    color: #0D291C;
}

.add-btn {
    font-size: 0.82rem;
    font-weight: 800;
    color: #232B3A;
    background-color: #7FD344;
    border: none;
    cursor: pointer;
    padding: 8px 18px;
    border-radius: 999px;
    border: 2px solid #000;
    box-shadow: 0 3px 0 #000;
    transition: transform 0.1s, box-shadow 0.1s;
}

.add-btn:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #000;
}

/* ── Grid de mensualidades ───────────────────────────────────────── */
.mensualidades-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-content: start;
}

@media (max-width: 700px) {
    .mensualidades-grid {
        grid-template-columns: 1fr;
    }
}

/* ── Estado vacío ────────────────────────────────────────────────── */
.empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 60px 20px;
    color: #d1d5db;
    font-size: 0.9rem;
    font-weight: 600;
}

/* ── Tarjeta de mensualidad ──────────────────────────────────────── */
.mensualidad-card {
    background-color: white;
    border-radius: 24px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 2px solid #e8f5e9;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 16px rgba(13, 41, 28, 0.06);
    position: relative;
    overflow: hidden;
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
    transition: box-shadow 0.18s, transform 0.18s;
}

.mensualidad-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #c8ddd1, 0 4px 20px rgba(13, 41, 28, 0.1);
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.card-band {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 24px 24px 0 0;
}

.card-band--activa {
    background-color: #7FD344;
}

.card-band--por_vencer {
    background-color: #f59e0b;
}

.card-band--vencida {
    background-color: #dc2626;
}

.card-band--congelada {
    background-color: #60a5fa;
}

.card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
}

.card-avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background-color: #0D291C;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.85rem;
    flex-shrink: 0;
    border: 2px solid #e8f5e9;
}

.card-head__info {
    flex: 1;
    min-width: 0;
}

.card-nombre {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D291C;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-estado-badge {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 2px 8px;
    border-radius: 999px;
    margin-top: 3px;
}

.badge--activa {
    background-color: #dcfce7;
    color: #16a34a;
}

.badge--por_vencer {
    background-color: #fef3c7;
    color: #d97706;
}

.badge--vencida {
    background-color: #fee2e2;
    color: #dc2626;
}

.badge--congelada {
    background-color: #dbeafe;
    color: #2563eb;
}

.card-dias {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    background-color: #f9fafb;
    border-radius: 12px;
    padding: 8px 12px;
}

.card-dias__num {
    font-size: 1.4rem;
    font-weight: 900;
    line-height: 1;
}

.card-dias__label {
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.5;
    color: #232B3A;
}

.card-dias--activa .card-dias__num {
    color: #299261;
}

.card-dias--por_vencer .card-dias__num {
    color: #d97706;
}

.card-dias--vencida .card-dias__num {
    color: #dc2626;
}

.card-dias--congelada .card-dias__num {
    color: #3b82f6;
}

.card-data {
    display: flex;
    flex-direction: column;
    gap: 7px;
    background-color: #f9fafb;
    border-radius: 14px;
    padding: 12px 14px;
}

.card-data__item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.card-data__item svg {
    color: #9ca3af;
    flex-shrink: 0;
}

.card-data__label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    min-width: 44px;
}

.card-data__val {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D291C;
}

/* Barra de progreso */
.card-progress-wrap {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card-progress-bar {
    height: 6px;
    background-color: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.card-progress-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.6s ease;
}

.fill--activa {
    background-color: #7FD344;
}

.fill--por_vencer {
    background-color: #f59e0b;
}

.fill--vencida {
    background-color: #dc2626;
}

.fill--congelada {
    background-color: #60a5fa;
}

.card-progress-label {
    font-size: 0.62rem;
    font-weight: 600;
    color: #9ca3af;
    text-align: right;
}

.card-actions {
    display: flex;
    gap: 10px;
}

.btn-pagar,
.btn-congelar {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px;
    border-radius: 14px;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
    border: 2px solid;
    transition: transform 0.1s, box-shadow 0.1s, background-color 0.15s;
}

.btn-pagar:active,
.btn-congelar:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important;
}

.btn-pagar {
    background-color: #0D291C;
    color: #ffffff;
    border-color: #0D291C;
    box-shadow: 0 3px 0 #051510;
}

.btn-pagar:hover {
    background-color: #132e21;
}

.btn-congelar {
    background-color: white;
    color: #3b82f6;
    border-color: #bfdbfe;
    box-shadow: 0 3px 0 #bfdbfe;
}

.btn-congelar:hover {
    background-color: #eff6ff;
}

/* ── Modal base ──────────────────────────────────────────────────── */
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
    background-color: #B8E19E;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 7px 0 #000;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-card--warn {
    background-color: #fefce8;
    border-color: #92400e;
    box-shadow: 0 7px 0 #78350f;
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 14px;
    background-color: #0D291C;
}

.modal-head--warn {
    background-color: #92400e;
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

.modal-avatar-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #7FD344;
    color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.75rem;
    flex-shrink: 0;
}

.modal-avatar-sm--warn {
    background-color: #fcd34d;
    color: #78350f;
}

.modal-head__name {
    font-size: 0.9rem;
    font-weight: 800;
    color: white;
}

.modal-head__name--warn {
    color: #fef3c7;
}

.modal-head__sub {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 600;
}

.modal-close {
    font-size: 1rem;
    font-weight: 900;
    color: white;
    opacity: 0.4;
    transition: opacity 0.15s;
    background: none;
    border: none;
    cursor: pointer;
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

/* Resumen de pago */
.pago-resumen {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, 0.6);
    border: 2px solid #0D291C;
    border-radius: 18px;
    padding: 14px 18px;
    gap: 8px;
    flex-wrap: wrap;
}

.pago-resumen__item {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.pago-resumen__label {
    font-size: 0.58rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.5;
}

.pago-resumen__val {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D291C;
}

.pago-resumen__val--price {
    color: #299261;
    font-size: 1rem;
}

.pago-sep {
    width: 1.5px;
    height: 30px;
    background-color: rgba(13, 41, 28, 0.15);
    border-radius: 99px;
}

/* Alerta warn */
.warn-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background-color: rgba(255, 255, 255, 0.6);
    border: 1.5px solid #d97706;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 0.82rem;
    color: #78350f;
    line-height: 1.55;
}

/* Campos */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
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
    padding: 10px 14px !important;
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

.field-input--code {
    font-family: monospace;
    letter-spacing: 0.1em;
    font-size: 1rem !important;
    text-align: center;
}

.field-hint {
    font-size: 0.7rem;
    color: #0D291C;
    opacity: 0.5;
    line-height: 1.5;
    padding-left: 3px;
}

.mt-2 {
    margin-top: 8px;
}

.mt-3 {
    margin-top: 12px;
}

/* Pie del modal */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 12px 22px 20px;
    border-top: 2px solid rgba(13, 41, 28, 0.1);
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

.btn-modal--confirm {
    background-color: #232B3A;
    color: white;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-modal--warn {
    background-color: #92400e;
    color: white;
    border-color: #78350f;
    box-shadow: 0 3px 0 #78350f;
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