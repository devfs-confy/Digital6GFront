<template>
    <div class="flex flex-col gap-6 min-h-full pb-6">

        <!-- Header -->
        <AdminPageHeader title="Resultado del pago">
            <template #left>
                <button @click="$router.push('/cliente/mensualidad')"
                    class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                    style="box-shadow: #595858 0px 2px 0">
                    <AppIcon name="arrow_left_alt" :size="14" />
                    <span class="hidden sm:inline">Volver</span>
                </button>
            </template>
        </AdminPageHeader>

        <!-- Loading inicial -->
        <div v-if="cargando" class="estado-card">
            <div class="estado-spinner" />
            <p class="estado-titulo">Verificando tu pago...</p>
            <p class="estado-sub">Esto solo tomará un momento</p>
        </div>

        <!-- Error al procesar -->
        <div v-else-if="errorMsg" class="estado-card estado-card--error">
            <div class="estado-icono estado-icono--error">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
            </div>
            <p class="estado-titulo">No pudimos procesar tu pago</p>
            <p class="estado-sub">{{ errorMsg }}</p>
            <button @click="$router.push('/cliente/mensualidad')" class="btn-estado btn-estado--retry">
                Volver a mensualidades
            </button>
        </div>

        <!-- Sin token -->
        <div v-else-if="!token" class="estado-card estado-card--warn">
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


        <!-- Contenido principal -->
        <template v-else>
            <div class="sections-grid">

                <!-- Panel izquierdo: estado + info -->
                <div class="flex flex-col gap-4">

                    <!-- Info de la factura -->
                    <div v-if="factura" class="info-card">
                        <div class="info-card__rows">
                            <div class="info-row"
                                v-if="factura.referencia ?? factura.referenceCode ?? factura.transactionId">
                                <span class="info-row__label">Referencia</span>
                                <span class="info-row__val font-mono">{{ factura.referencia ?? factura.referenceCode ??
                                    factura.transactionId }}</span>
                            </div>
                            <div class="info-row" v-if="factura.fecha ?? factura.createdAt">
                                <span class="info-row__label">Fecha</span>
                                <span class="info-row__val">{{ formatFecha(factura.fecha ?? factura.createdAt) }}</span>
                            </div>
                            <div class="info-row" v-if="factura.valor ?? factura.amount ?? factura.total">
                                <span class="info-row__label">Valor pagado</span>
                                <span class="info-row__val info-row__val--precio">{{ formatPrecio(factura.valor ??
                                    factura.amount ?? factura.total) }}</span>
                            </div>
                            <div class="info-row" v-if="factura.sede ?? factura.estacionamiento">
                                <span class="info-row__label">Sede</span>
                                <span class="info-row__val">{{ factura.sede ?? factura.estacionamiento }}</span>
                            </div>
                            <div class="info-row" v-if="factura.modalidad ?? factura.plan">
                                <span class="info-row__label">Plan</span>
                                <span class="info-row__val">{{ factura.modalidad ?? factura.plan }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="flex flex-col gap-3">
                        <button v-if="pdfUrl" @click="descargarPdf" class="btn-accion btn-accion--pdf">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                            </svg>
                            Descargar factura PDF
                        </button>
                        <button @click="$router.push('/cliente/mensualidad')" class="btn-accion btn-accion--volver">

                            Ir a mis mensualidades
                        </button>
                    </div>

                </div>

                <!-- Panel derecho: iframe PDF -->
                <div class="pdf-panel">
                    <div v-if="cargandoPdf" class="pdf-loading">
                        <div class="estado-spinner" />
                        <span>Cargando factura...</span>
                    </div>
                    <div v-else-if="!pdfUrl" class="pdf-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#d1d5db"
                            viewBox="0 0 24 24">
                            <path
                                d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                        </svg>
                        <p>{{ estadoPago === 'aprobado' ? 'La factura no está disponible aún.'
                            : 'a factura se generará cuando el pago sea confirmado.' }}</p>
                    </div>
                    <div v-else>
                        <iframe :src="pdfUrl" :title="fileName" class="pdf-iframe" width="100%" height="600px" />
                    </div>
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

// ── Estado ────────────────────────────────────────────────────────
const cargando = ref(true)
const cargandoPdf = ref(false)
const errorMsg = ref('')
const factura = ref(null)
const pdfUrl = ref('')
const estadoPago = ref('aprobado')
const fileName = ref("factura.pdf")


// ── Token desde la URL ─────────────────────────────────────────────

const token = computed(() =>
    route.query.token
    ?? route.query.ref
    ?? route.query.referenceCode
    ?? route.query.reference
    ?? sessionStorage.getItem('pago_referencia')
    ?? null
)

// ── Labels ─────────────────────────────────────────────────────────
const estadoLabel = computed(() => ({
    aprobado: 'Pago aprobado',
    pendiente: 'Pago en verificación',
    rechazado: 'Pago rechazado',
})[estadoPago.value] ?? 'Estado desconocido')

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

// ── Lógica principal ─────────────────────────────────────────────
const cargarFactura = async () => {
    if (!token.value) { cargando.value = false; return }

    try {
        const res = await FacturaService.GetFacturaPos(token.value)

        if (res?.error === true) {
            const msg = res?.data?.message ?? 'Error al obtener la factura.'
            errorMsg.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }

        const data = res?.data ?? res

        // Guardar datos de la factura para mostrar el detalle
        factura.value = data

        // Determinar estado del pago desde la respuesta
        const status = (data?.estado ?? data?.status ?? data?.transactionState ?? '').toLowerCase()
        if (status.includes('aprobado') || status.includes('approved') || status === 'ok' || status === '1') {
            estadoPago.value = 'aprobado'
        } else if (status.includes('rechazad') || status.includes('declined') || status === '2') {
            estadoPago.value = 'rechazado'
        } else {
            estadoPago.value = 'aprobado'
        }

        // Si viene el PDF (base64 o URL directa)
        await cargarPdf()

    } catch (e) {
        errorMsg.value = 'Ocurrió un error inesperado al verificar el pago.'
        console.error('[PagoRetorno]', e)
    } finally {
        cargando.value = false
        // Limpiar sessionStorage si lo usamos como fallback
        sessionStorage.removeItem('pago_referencia')
    }
}
const cargarPdf = async () => {
    if (!token.value) return
    cargandoPdf.value = true
    try {
        const result = await FacturaService.GetFacturaPos(token.value)

        // Validar que sea un objeto con blob válido
        if (!result || result?.error === true || !(result.blob instanceof Blob)) {
            console.error('[PDF] No se recibió un blob válido', result)
            return
        }

        fileName.value = result.fileName  // ✅ Guardar nombre
        pdfUrl.value = URL.createObjectURL(result.blob)

    } catch (e) {
        console.error('[PagoRetorno PDF]', e)
    } finally {
        cargandoPdf.value = false
    }
}

const descargarPdf = () => {
    if (!pdfUrl.value) return
    const a = document.createElement('a')
    a.href = pdfUrl.value
    a.download = fileName.value
    a.click()
}

onMounted(cargarFactura)
</script>

<style scoped>
.btn-3d {
    pointer-events: none;
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(12px)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

/* ── Layout ── */
.sections-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 20px;
    align-items: start;
}

@media (max-width: 800px) {
    .sections-grid {
        grid-template-columns: 1fr
    }
}

/* ── Header ── */
.header-bar {
    background: white;
    border-radius: 24px;
    padding: 16px 20px
}

.header-bar__desktop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px
}

.header-bar__mobile {
    display: none
}

.header-bar__title {
    font-size: 1.3rem;
    font-weight: 900;
    color: #232B3A;
    text-align: center
}


@media (max-width: 560px) {
    .header-bar__desktop {
        display: none
    }

    .header-bar__mobile {
        display: flex;
        flex-direction: column;
        gap: 12px
    }
}

/* ── Estado loading / error / vacío ── */
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

.estado-card--error {
    border-color: #fecaca;
    box-shadow: 0 4px 0 #fecaca
}

.estado-card--warn {
    border-color: #fde68a;
    box-shadow: 0 4px 0 #fde68a
}

.estado-spinner {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid #e8f5e9;
    border-top-color: #299261;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

.estado-titulo {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0D291C
}

.estado-sub {
    font-size: 0.82rem;
    font-weight: 600;
    color: #6b7280;
    line-height: 1.5
}

.estado-icono {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.estado-icono--error {
    background: #fee2e2;
    color: #dc2626
}

.estado-icono--warn {
    background: #fef3c7;
    color: #d97706
}

.btn-estado {
    padding: 11px 24px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 3px 0;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-estado:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important
}

.btn-estado--retry {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 3px 0 #051510;
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


.info-card__rows {
    display: flex;
    flex-direction: column
}

.info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 18px;
    border-bottom: 1px solid #f8faf8;
}

.info-row:last-child {
    border-bottom: none
}

.info-row__label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
}

.info-row__val {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0D291C;
    text-align: right
}

.info-row__val--precio {
    color: #299261;
    font-size: 1rem;
    font-weight: 900
}

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

.btn-accion:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important
}

.btn-accion--pdf {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 3px 0 #051510;
}

.btn-accion--pdf:hover {
    background: #132e21
}

.btn-accion--volver {
    background: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-accion--volver:hover {
    background: #f8fafb
}

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
}

@media (max-width: 767px) {
    @keyframes fadeUp { from { opacity:1; transform:none; } to { opacity:1; transform:none; } }
}
</style>