<template>
    <div class="flex flex-col gap-6 min-h-full pb-6">

        <!-- Header -->
        <div class="header-bar flex items-center justify-between px-5 py-4">
            <button @click="$router.push('/cliente/mensualidad')"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow:#595858 0px 2px 0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Resultado del pago</h2>
            <div class="w-[80px]" />
        </div>

        <!-- ── Cargando estado ── -->
        <div v-if="cargando" class="estado-card">
            <div class="estado-spinner" />
            <p class="estado-titulo">Verificando tu pago...</p>
            <p class="estado-sub">Esto solo tomará un momento</p>
        </div>

        <!-- ── Error ── -->
        <div v-else-if="errorMsg" class="estado-card estado-card--error">
            <div class="estado-icono estado-icono--error">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
            </div>
            <p class="estado-titulo">No pudimos procesar tu pago</p>
            <p class="estado-sub">{{ errorMsg }}</p>
            <button @click="$router.push('/cliente/mensualidad')" class="btn-estado btn-estado--retry">
                Volver a mensualidades
            </button>
        </div>

        <!-- ── Sin rquid ── -->
        <div v-else-if="!rquid" class="estado-card estado-card--warn">
            <div class="estado-icono estado-icono--warn">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
            </div>
            <p class="estado-titulo">Enlace inválido</p>
            <p class="estado-sub">No se encontró la referencia del pago en la URL.</p>
            <button @click="$router.push('/cliente/mensualidad')" class="btn-estado btn-estado--retry">
                Ir a mis mensualidades
            </button>
        </div>

        <!-- ── Contenido principal ── -->
<template v-else>

    <!-- Estado RECHAZADO: layout especial centrado, sin PDF -->
    <div v-if="estadoPago === 'rechazado'" class="rechazo-card">
        <div class="rechazo-icono">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
        </div>
        <h3 class="rechazo-titulo">Pago no procesado</h3>
        <p class="rechazo-sub">La transacción fue rechazada por la pasarela de pago.<br>Verifica tu método de pago e intenta de nuevo.</p>

        <!-- Datos mínimos de la transacción fallida -->
        <div v-if="transaccion" class="rechazo-datos">
            <!-- <div class="rechazo-dato" v-if="transaccion.RequestId">
                <span class="rechazo-dato__label">Request ID</span>
                <span class="rechazo-dato__val font-mono">{{ transaccion.RequestId }}</span>
            </div> -->
            <div class="rechazo-dato" v-if="transaccion.FechaCreacion">
                <span class="rechazo-dato__label">Fecha</span>
                <span class="rechazo-dato__val">{{ formatFecha(transaccion.FechaCreacion) }}</span>
            </div>
            <div class="rechazo-dato" v-if="transaccion.Valor">
                <span class="rechazo-dato__label">Monto intentado</span>
                <span class="rechazo-dato__val">{{ formatPrecio(transaccion.Valor) }}</span>
            </div>
            <div class="rechazo-dato" v-if="transaccion.MetodoPago">
                <span class="rechazo-dato__label">Método</span>
                <span class="rechazo-dato__val">{{ transaccion.MetodoPago }}</span>
            </div>
        </div>

        <div class="rechazo-acciones">
            <button @click="$router.push('/cliente/mensualidad')" class="btn-rechazo btn-rechazo--volver">
                Ir a mensualidades
            </button>
        </div>
    </div>

    <!-- Estado APROBADO / PENDIENTE: layout normal con PDF -->
    <div v-else class="sections-grid">

        <!-- Panel izquierdo -->
        <div class="flex flex-col gap-4">

            <!-- Badge de estado -->
            <div class="estado-badge-card" :class="`estado-badge-card--${estadoPago}`">
                <div class="estado-badge-icono" :class="`estado-badge-icono--${estadoPago}`">
                    <svg v-if="estadoPago === 'aprobado'" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="estado-badge-titulo">{{ estadoLabel }}</p>
                    <p class="estado-badge-sub">{{ estadoSubLabel }}</p>
                </div>
            </div>

            <!-- Info de la transacción -->
            <div v-if="transaccion" class="info-card">
                <div class="info-card__header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#299261" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                    </svg>
                    <span>Detalle de la transacción</span>
                </div>
                <div class="info-card__rows">
                    <!-- <div class="info-row" v-if="transaccion.RequestId">
                        <span class="info-row__label">Request ID</span>
                        <span class="info-row__val font-mono text-xs">{{ transaccion.RequestId }}</span>
                    </div> -->
                    <div class="info-row" v-if="transaccion.IdTransaccion">
                        <span class="info-row__label">Transacción</span>
                        <span class="info-row__val font-mono text-xs">{{ transaccion.IdTransaccion }}</span>
                    </div>
                    <div class="info-row" v-if="transaccion.FechaCreacion">
                        <span class="info-row__label">Fecha</span>
                        <span class="info-row__val">{{ formatFecha(transaccion.FechaCreacion) }}</span>
                    </div>
                    <div class="info-row" v-if="transaccion.MetodoPago">
                        <span class="info-row__label">Método de pago</span>
                        <span class="info-row__val flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#299261" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                            {{ transaccion.MetodoPago }}
                        </span>
                    </div>
                    <div class="info-row" v-if="transaccion.Concepto">
                        <span class="info-row__label">Concepto</span>
                        <span class="info-row__val" style="font-size:0.78rem">{{ transaccion.Concepto }}</span>
                    </div>
                    <div class="info-row" v-if="transaccion.Valor">
                        <span class="info-row__label">Valor pagado</span>
                        <span class="info-row__val info-row__val--precio">{{ formatPrecio(transaccion.Valor) }}</span>
                    </div>
                </div>
            </div>

            <!-- Acciones -->
            <div class="flex flex-col gap-3">
                <button v-if="pdfUrl" @click="descargarPdf" class="btn-accion btn-accion--pdf">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Descargar factura PDF
                </button>
                <button @click="$router.push('/cliente/mensualidad')" class="btn-accion btn-accion--volver">
                    Ir a mis mensualidades
                </button>
            </div>

            <!-- Aviso pendiente sin factura -->
            <div v-if="estadoPago === 'pendiente' && !tokenFactura"
                class="flex items-start gap-2.5 rounded-xl px-3.5 py-3 bg-amber-50 border border-amber-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706" viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
                <p class="text-[0.72rem] font-semibold text-amber-700 leading-snug">
                    La factura estará disponible una vez el pago sea confirmado.
                </p>
            </div>
        </div>

        <!-- Panel derecho: PDF -->
        <div class="pdf-panel">
            <div class="pdf-panel__header">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#299261" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
                <span>Comprobante de pago</span>
            </div>
            <div v-if="cargandoPdf" class="pdf-loading">
                <div class="estado-spinner" />
                <span>Cargando comprobante...</span>
            </div>
            <div v-else-if="!pdfUrl" class="pdf-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#d1d5db" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
                <p>{{ estadoPago === 'aprobado' ? 'El comprobante no está disponible aún.' : 'El comprobante se generará cuando el pago sea confirmado.' }}</p>
            </div>
            <iframe v-else :src="pdfUrl" :title="fileName" class="pdf-iframe" />
        </div>

    </div>
</template>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FacturaService from '@/api/services/factura.service'

const route = useRoute()

// ── Estado ─────────────────────────────────────────────────────────
const cargando    = ref(true)
const cargandoPdf = ref(false)
const errorMsg    = ref('')
const transaccion = ref(null)  
const tokenFactura = ref('')    
const pdfUrl      = ref('')
const fileName    = ref('factura.pdf')
const estadoPago  = ref('pendiente')

// ── rquid desde la URL ─────────────────────────────────────────────
// Ajusta el nombre del query param si tu pasarela usa otro nombre
const rquid = computed(() =>
    route.params.rquid
    ?? route.query.rquid
    ?? route.query.requestId
    ?? null
)

// ── Labels ─────────────────────────────────────────────────────────
const estadoLabel = computed(() => ({
    aprobado:  'Pago aprobado',
    pendiente: 'Pago en verificación',
    rechazado: 'Pago rechazado',
})[estadoPago.value] ?? 'Estado desconocido')

const estadoSubLabel = computed(() => ({
    aprobado:  'Tu mensualidad ha sido activada exitosamente.',
    pendiente: 'Estamos verificando tu transacción, esto puede tardar unos minutos.',
    rechazado: 'La transacción no fue procesada. Intenta con otro método de pago.',
})[estadoPago.value] ?? '')

// ── Helpers ─────────────────────────────────────────────────────────
const formatFecha = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}
const formatPrecio = (valor) => {
    if (!valor && valor !== 0) return '—'
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(valor)
}

const resolverEstado = (status = '') => {
    const s = status.toLowerCase()
    if (s.includes('aprobado') || s.includes('approved') || s === 'ok' || s === '1') return 'aprobado'
    if (s.includes('rechazad') || s.includes('declined') || s === '2')               return 'rechazado'
    return 'pendiente'
}

// ── Flujo principal ─────────────────────────────────────────────────
const cargarEstado = async () => {
    if (!rquid.value) { cargando.value = false; return }

    try {
        // 1. Consultar estado de la transacción
        const res = await FacturaService.GetEstado(rquid.value)

        if (res?.error === true || res?.success === false) {
            const msg = res?.data?.message ?? res?.message ?? 'Error al obtener el estado del pago.'
            errorMsg.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }

        const data = res?.data ?? res
        transaccion.value = data
        estadoPago.value  = resolverEstado(data?.Status ?? '')

        // 2. Si hay Token, cargar la factura PDF
        if (data?.Token) {
            tokenFactura.value = data.Token
            await cargarPdf(data.Token)
        }

    } catch (e) {
        errorMsg.value = 'Ocurrió un error inesperado al verificar el pago.'
        console.error('[EstadoTransaccion]', e)
    } finally {
        cargando.value = false
    }
}

const cargarPdf = async (token) => {
    cargandoPdf.value = true
    try {
        const result = await FacturaService.GetFacturaPos(token)

        if (!result || result?.error === true || !(result.blob instanceof Blob)) {
            console.warn('[PDF] No se recibió un blob válido', result)
            return
        }

        fileName.value = result.fileName ?? 'factura.pdf'
        pdfUrl.value   = URL.createObjectURL(result.blob)

    } catch (e) {
        console.error('[EstadoTransaccion PDF]', e)
    } finally {
        cargandoPdf.value = false
    }
}

const descargarPdf = () => {
    if (!pdfUrl.value) return
    const a = document.createElement('a')
    a.href     = pdfUrl.value
    a.download = fileName.value
    a.click()
}

onMounted(cargarEstado)
</script>

<style scoped>
@keyframes spin {
    to { transform: rotate(360deg) }
}
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px) }
    to   { opacity: 1; transform: translateY(0) }
}

/* ── Layout ── */
.sections-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 20px;
    align-items: start;
}
@media (max-width: 800px) {
    .sections-grid { grid-template-columns: 1fr }
}

/* ── Header ── */
.header-bar {
    background: white;
    border-radius: 9999px;
}

/* ── Estado cards (loading / error / warn) ── */
.estado-card {
    background: white;
    border-radius: 24px;
    border: 2px solid #e8f5e9;
    box-shadow: 0 4px 0 #e2ede7;
    padding: 48px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    text-align: center;
    animation: fadeUp 0.35s ease both;
}
.estado-card--error { border-color: #fecaca; box-shadow: 0 4px 0 #fecaca }
.estado-card--warn  { border-color: #fde68a; box-shadow: 0 4px 0 #fde68a }

.estado-spinner {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid #e8f5e9;
    border-top-color: #299261;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

.estado-titulo { font-size: 1.05rem; font-weight: 800; color: #0D291C }
.estado-sub    { font-size: 0.82rem; font-weight: 600; color: #6b7280; line-height: 1.5 }

.estado-icono {
    width: 56px; height: 56px;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.estado-icono--error { background: #fee2e2; color: #dc2626 }
.estado-icono--warn  { background: #fef3c7; color: #d97706 }

.btn-estado {
    padding: 11px 24px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 1px 0;
    transition: transform 0.1s, box-shadow 0.1s;
}
.btn-estado:active { transform: translateY(2px); box-shadow: 0 1px 0 !important }
.btn-estado--retry { background: #0D291C; color: #7FD344; border-color: #0D291C; box-shadow: 0 1px 0 #051510 }

/* ── Badge de estado (aprobado / pendiente / rechazado) ── */
.estado-badge-card {
    border-radius: 20px;
    border: 2px solid;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    animation: fadeUp 0.35s ease both;
}
.estado-badge-card--aprobado  { background: #f0fdf4; border-color: #c8e6c9; box-shadow: 0 3px 0 #c8e6c9 }
.estado-badge-card--pendiente { background: #fffbeb; border-color: #fde68a; box-shadow: 0 3px 0 #fde68a }
.estado-badge-card--rechazado { background: #fff1f2; border-color: #fecaca; box-shadow: 0 3px 0 #fecaca }

.estado-badge-icono {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.estado-badge-icono--aprobado  { background: #0D291C; color: #7FD344 }
.estado-badge-icono--pendiente { background: #d97706; color: white }
.estado-badge-icono--rechazado { background: #dc2626; color: white }

.estado-badge-titulo {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D291C;
}
.estado-badge-sub {
    font-size: 0.7rem;
    font-weight: 600;
    color: #6b7280;
    line-height: 1.5;
    margin-top: 2px;
}

/* ── Info card ── */
.info-card {
    background: white;
    border-radius: 20px;
    border: 2px solid #e8f5e9;
    box-shadow: 0 3px 0 #e2ede7;
    overflow: hidden;
    animation: fadeUp 0.35s 0.05s ease both;
}
.info-card__header {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 18px;
    background: #f0fdf4;
    border-bottom: 1.5px solid #e8f5e9;
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #299261;
}
.info-card__rows { display: flex; flex-direction: column }
.info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 18px;
    border-bottom: 1px solid #f8faf8;
}
.info-row:last-child { border-bottom: none }
.info-row__label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
}
.info-row__val         { font-size: 0.85rem; font-weight: 700; color: #0D291C; text-align: right }
.info-row__val--precio { color: #299261; font-size: 1rem; font-weight: 900 }

/* ── Botones de acción ── */
.btn-accion {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 18px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 3px 0;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
}
.btn-accion:active { transform: translateY(2px); box-shadow: 0 1px 0 !important }
.btn-accion--pdf    { background: #0D291C; color: #7FD344; border-color: #0D291C; box-shadow: 0 3px 0 #051510 }
.btn-accion--pdf:hover { background: #132e21 }
.btn-accion--volver { background: white; color: #232B3A; border-color: #000; box-shadow: 0 3px 0 #000 }
.btn-accion--volver:hover { background: #f8fafb }

/* ── Panel PDF ── */
.pdf-panel {
    background: white;
    border-radius: 20px;
    border: 2px solid #e8f5e9;
    box-shadow: 0 4px 0 #e2ede7;
    overflow: hidden;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    animation: fadeUp 0.35s 0.08s ease both;
}
.pdf-panel__header {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 18px;
    background: #f0fdf4;
    border-bottom: 1.5px solid #e8f5e9;
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #299261;
    flex-shrink: 0;
}
.pdf-loading,
.pdf-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 48px 24px;
    text-align: center;
    color: #9ca3af;
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.5;
}
.pdf-iframe {
    width: 100%;
    flex: 1;
    min-height: 600px;
    border: none;
    display: block;
}

/* ── Tarjeta de rechazo ── */
.rechazo-card {
    background: white;
    border-radius: 24px;
    border: 2px solid #fecaca;
    box-shadow: 0 4px 0 #fecaca;
    padding: 48px 32px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
    max-width: 520px;
    margin: 0 auto;
    width: 100%;
    animation: fadeUp 0.35s ease both;
}

.rechazo-icono {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    background: #fee2e2;
    color: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 2px solid #fecaca;
}

.rechazo-titulo {
    font-size: 1.25rem;
    font-weight: 900;
    color: #0D291C;
}

.rechazo-sub {
    font-size: 0.82rem;
    font-weight: 600;
    color: #6b7280;
    line-height: 1.65;
}

.rechazo-datos {
    width: 100%;
    background: #fff8f8;
    border: 1.5px solid #fecaca;
    border-radius: 16px;
    overflow: hidden;
    margin-top: 4px;
}

.rechazo-dato {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 1px solid #fee2e2;
}

.rechazo-dato:last-child { border-bottom: none }

.rechazo-dato__label {
    font-size: 0.65rem;
    font-weight: 700;
    color: #f87171;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
}

.rechazo-dato__val {
    font-size: 0.82rem;
    font-weight: 700;
    color: #7f1d1d;
    text-align: right;
}

.rechazo-acciones {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 4px;
}

.btn-rechazo {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 18px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 3px 0;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
}

.btn-rechazo:active { transform: translateY(2px); box-shadow: 0 1px 0 !important }

.btn-rechazo--reintentar {
    background: #dc2626;
    color: white;
    border-color: #dc2626;
    box-shadow: 0 3px 0 #991b1b;
}
.btn-rechazo--reintentar:hover { background: #b91c1c }

.btn-rechazo--volver {
    background: white;
    color: #374151;
    border-color: #d1d5db;
    box-shadow: 0 3px 0 #d1d5db;
}
.btn-rechazo--volver:hover { background: #f9fafb }
</style>