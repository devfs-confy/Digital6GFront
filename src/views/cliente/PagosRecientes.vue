<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Historial de Pagos</h2>
            <button
                class=" cursor-none pointer-events-none flex items-center gap-1.5 bg-transparent text-transparent text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline"></span>
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center gap-3 py-16">
            <div class="det-loader" />
            <span class="text-sm font-semibold text-gray-400">Cargando historial...</span>
        </div>

        <!-- Error -->
        <div v-else-if="errorCarga"
            class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border-2 border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#dc2626" viewBox="0 0 24 24"
                class="shrink-0">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span class="text-sm font-semibold text-red-600 flex-1">{{ errorCarga }}</span>
            <button @click="cargarHistorial" class="text-xs font-black text-red-600 underline cursor-pointer">
                Reintentar
            </button>
        </div>

        <template v-else>

            <!-- Resumen rápido global (suma todas las sedes) -->
            <div class="resumen-row">
                <div class="resumen-card resumen-card--total">
                    <span class="resumen-card__num">{{ formatCOP(totalPagado) }}</span>
                    <span class="resumen-card__label">Total pagado</span>
                </div>
                <div class="resumen-card resumen-card--count">
                    <span class="resumen-card__num">{{ totalTx }}</span>
                    <span class="resumen-card__label">Transacciones</span>
                </div>
                <div class="resumen-card resumen-card--iva">
                    <span class="resumen-card__num">{{ formatCOP(totalIva) }}</span>
                    <span class="resumen-card__label">IVA total</span>
                </div>
                <div class="resumen-card resumen-card--subtotal">
                    <span class="resumen-card__num">{{ formatCOP(totalSubtotal) }}</span>
                    <span class="resumen-card__label">Subtotal</span>
                </div>
            </div>

            <!-- Una tabla por cada sede -->
            <div v-for="sede in sedes" :key="sede.idPersona"
                class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">

                <!-- Header de sede -->
                <div class="sede-header">
                    <div class="sede-header__avatar">
                        {{ sede.pagos[0]?.idModulo ?? sede.idEstacionamiento }}
                    </div>
                    <div>
                        <p class="sede-header__title">{{ sede.nombre }}</p>
                        <p class="sede-header__sub">
                            {{ sede.pagos.length }} pago{{ sede.pagos.length !== 1 ?
                                's' : '' }}
                        </p>
                    </div>
                </div>

                <div class="table-scroll-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th class="th-cell">N° Factura</th>
                                <th class="th-cell">Subtotal</th>
                                <th class="th-cell">IVA</th>
                                <th class="th-cell">Total</th>
                                <th class="th-cell">Fecha de pago</th>
                                <th class="th-cell">Factura</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="sede.pagos.length === 0">
                                <td colspan="6" class="text-center py-10 text-gray-300">
                                    <span class="text-sm font-medium">Sin pagos registrados</span>
                                </td>
                            </tr>
                            <tr v-for="(pago, i) in sede.pagos" :key="pago.id" class="table-row"
                                :style="{ animationDelay: `${i * 0.07}s` }">

                                <td class="td-cell">
                                    <span class="ref-code">{{ pago.numeroFactura }}</span>
                                </td>
                                <td class="td-cell">
                                    <span class="subtotal-text">{{ formatCOP(pago.subtotal) }}</span>
                                </td>
                                <td class="td-cell">
                                    <span class="iva-text">{{ formatCOP(pago.iva) }}</span>
                                </td>
                                <td class="td-cell">
                                    <span class="valor-text">{{ formatCOP(pago.total) }}</span>
                                </td>
                                <td class="td-cell">
                                    <div class="fecha-wrap">
                                        <span class="fecha-dia">{{ formatDia(pago.fecha) }}</span>
                                        <span class="fecha-mes">{{ formatMes(pago.fecha) }}</span>
                                    </div>
                                </td>
                                <td class="td-cell">
                                    <button v-if="pago.tokenFactura" @click="descargarFactura(pago)"
                                        :disabled="descargando === pago.numeroFactura" class="btn-factura"
                                        :class="{ 'btn-factura--loading': descargando === pago.numeroFactura }"
                                        title="Descargar factura electrónica">
                                        <div v-if="descargando === pago.numeroFactura" class="btn-factura__spinner" />
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                        </svg>
                                        <span>{{ descargando === pago.numeroFactura ? 'Descargando...' : 'Factura'
                                        }}</span>
                                    </button>
                                    <span v-else class="sin-factura">—</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Footer por sede -->
                <div class="table-foot">
                    <span class="foot-counter">
                        Mostrando <strong>{{ sede.pagos.length }}</strong>
                        pago{{ sede.pagos.length !== 1 ? 's' : '' }} recientes
                    </span>
                    <Transition name="err-slide">
                        <div v-if="errDescarga" class="err-descarga">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#dc2626"
                                viewBox="0 0 24 24" class="shrink-0">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            {{ errDescarga }}
                        </div>
                    </Transition>
                </div>

            </div>

        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PagosService from '@/api/services/pagos.service'
import FacturaService from '@/api/services/factura.service'

// ── Estado ────────────────────────────────────────────────────────
const sedes = ref([])
const loading = ref(false)
const errorCarga = ref('')
const descargando = ref(null)
const errDescarga = ref('')

// ── Carga del historial ───────────────────────────────────────────
// Respuesta: { success, data: [{ IdEstacionamiento, pagos: [...] }] }
const cargarHistorial = async () => {
    loading.value = true
    errorCarga.value = ''
    try {
        const res = await PagosService.getHistorialPagos()
        const raw = Array.isArray(res?.data) ? res.data : []
        sedes.value = raw.map(sede => ({
            idPersona: sede.IdPersonaAutorizada,
            idEstacionamiento: sede.IdEstacionamiento,
            nombre: sede.NombreApellidos ?? '—',
            pagos: (sede.pagos ?? []).map(p => ({
                id: p.NumeroFactura,
                idModulo: p.IdModulo ?? '—',
                numeroFactura: p.NumeroFactura ?? '—',
                total: p.Total ?? 0,
                subtotal: p.Subtotal ?? 0,
                iva: p.Iva ?? 0,
                fecha: (p.FechaPago ?? '').slice(0, 10),
                tokenFactura: p.Token || null,
            }))
        }))
    } catch (e) {
        console.error('[HistorialPagos]', e)
        errorCarga.value = 'No se pudo cargar el historial de pagos.'
    } finally {
        loading.value = false
    }
}

onMounted(cargarHistorial)

// ── Descarga de factura electrónica ──────────────────────────────
const descargarFactura = async (pago) => {
    if (descargando.value) return
    errDescarga.value = ''
    descargando.value = pago.numeroFactura

    try {
        const res = await FacturaService.GetFacturaPos(pago.tokenFactura)

        if (!res?.blob) {
            errDescarga.value = 'No se pudo obtener la factura. Intenta de nuevo.'
            return
        }

        const url = URL.createObjectURL(res.blob)
        const a = document.createElement('a')
        a.href = url
        a.download = res.fileName ?? `factura-${pago.numeroFactura}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    } catch (e) {
        console.error('[DescargarFactura]', e)
        errDescarga.value = 'Error al descargar la factura.'
    } finally {
        descargando.value = null
        if (errDescarga.value) {
            setTimeout(() => { errDescarga.value = '' }, 4000)
        }
    }
}

// ── Computeds resumen global (todas las sedes) ────────────────────
const todosPagos = computed(() => sedes.value.flatMap(s => s.pagos))
const totalTx = computed(() => todosPagos.value.length)
const totalPagado = computed(() => todosPagos.value.reduce((acc, p) => acc + p.total, 0))
const totalIva = computed(() => todosPagos.value.reduce((acc, p) => acc + p.iva, 0))
const totalSubtotal = computed(() => todosPagos.value.reduce((acc, p) => acc + p.subtotal, 0))

// ── Helpers ───────────────────────────────────────────────────────
const formatCOP = (valor) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(valor ?? 0)

const formatDia = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

const formatMes = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { year: 'numeric' })
}
</script>

<style scoped>
/* ── Resumen ─────────────────────────────────────────────────────── */
.resumen-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

@media (max-width: 700px) {
    .resumen-row {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 400px) {
    .resumen-row {
        grid-template-columns: 1fr;
    }
}

.resumen-card {
    background-color: white;
    border-radius: 18px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 2px solid transparent;
    box-shadow: 0 3px 0 #e2ede7;
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(12px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.resumen-card__num {
    font-size: 1.2rem;
    font-weight: 900;
    line-height: 1;
}

.resumen-card__label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #9ca3af;
}

.resumen-card--total {
    border-color: #e8f5e9;
}

.resumen-card--total .resumen-card__num {
    color: #0D291C;
}

.resumen-card--count .resumen-card__num {
    color: #6b7280;
}

.resumen-card--iva {
    border-color: #fef3c7;
}

.resumen-card--iva .resumen-card__num {
    color: #d97706;
}

.resumen-card--subtotal {
    border-color: #dbeafe;
}

.resumen-card--subtotal .resumen-card__num {
    color: #2563eb;
}

/* ── Header de sede ──────────────────────────────────────────────── */
.sede-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px 16px;
    border-bottom: 2px solid #f3f4f6;
    background: linear-gradient(135deg, #f8fafb 0%, #ffffff 100%);
}

.sede-header__avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background-color: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.82rem;
    flex-shrink: 0;
    border: 2px solid #e8f5e9;
}

.sede-header__title {
    font-size: 0.95rem;
    font-weight: 900;
    color: #0D291C;
    line-height: 1.2;
}

.sede-header__sub {
    font-size: 0.68rem;
    font-weight: 600;
    color: #9ca3af;
    margin-top: 3px;
}

/* ── Tabla ───────────────────────────────────────────────────────── */
.table-scroll-wrapper {
    overflow-x: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: #0D291C33 #f0f9f4;
}

.data-table {
    width: 100%;
    min-width: 620px;
    border-collapse: collapse;
}

.th-cell {
    background-color: #0D291C;
    color: #7FD344;
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 12px 16px;
    text-align: left;
    white-space: nowrap;
}

.td-cell {
    padding: 13px 16px;
    font-size: 0.84rem;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
    white-space: nowrap;
}

.table-row {
    transition: background-color 0.12s;
    animation: rowIn 0.32s ease both;
}

.table-row:hover .td-cell {
    background-color: #f0faf4;
}

@keyframes rowIn {
    from {
        opacity: 0;
        transform: translateX(-8px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* N° Factura */
.ref-code {
    font-family: monospace;
    font-size: 0.78rem;
    font-weight: 700;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.04em;
}

/* Valores */
.valor-text {
    font-weight: 900;
    color: #0D291C;
    font-size: 0.9rem;
}

.subtotal-text {
    font-weight: 700;
    color: #374151;
    font-size: 0.84rem;
}

.iva-text {
    font-weight: 700;
    color: #d97706;
    font-size: 0.84rem;
}

/* Fecha */
.fecha-wrap {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.fecha-dia {
    font-size: 0.82rem;
    font-weight: 700;
    color: #232B3A;
}

.fecha-mes {
    font-size: 0.68rem;
    font-weight: 600;
    color: #9ca3af;
}

/* ── Botón factura ───────────────────────────────────────────────── */
.btn-factura {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    border: 2px solid #0D291C;
    background: white;
    color: #0D291C;
    font-size: 0.68rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 #0D291C;
    transition: transform 0.1s, box-shadow 0.1s, background 0.12s, color 0.12s;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.btn-factura:hover:not(:disabled) {
    background: #0D291C;
    color: #7FD344;
    transform: translateY(-1px);
    box-shadow: 0 3px 0 #051510;
}

.btn-factura:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 0 0 0 #0D291C;
}

.btn-factura:disabled,
.btn-factura--loading {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none !important;
}

.btn-factura__spinner {
    width: 11px;
    height: 11px;
    border: 2px solid rgba(13, 41, 28, 0.2);
    border-top-color: #0D291C;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

.sin-factura {
    font-size: 0.78rem;
    font-weight: 600;
    color: #d1d5db;
}

/* ── Footer ──────────────────────────────────────────────────────── */
.table-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid #f3f4f6;
    background-color: white;
    gap: 12px;
    flex-wrap: wrap;
    min-height: 48px;
}

.foot-counter {
    font-size: 0.75rem;
    color: #9ca3af;
}

.err-descarga {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #dc2626;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 999px;
    padding: 4px 12px;
}

/* ── Loader ──────────────────────────────────────────────────────── */
.det-loader {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid #e8f5e9;
    border-top-color: #299261;
    animation: spin 0.7s linear infinite;
}

/* ── Transitions ─────────────────────────────────────────────────── */
.err-slide-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.err-slide-leave-active {
    transition: opacity 0.15s ease;
}

.err-slide-enter-from {
    opacity: 0;
    transform: translateY(-4px);
}

.err-slide-leave-to {
    opacity: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>