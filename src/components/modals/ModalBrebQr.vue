<template>
    <Transition name="modal">
        <div v-if="modelValue" class="breb-overlay" @click.self="cerrar">
            <div class="breb-card">
                <!-- Head -->
                <div class="breb-head">
                    <div class="breb-head__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344" viewBox="0 0 24 24">
                            <path
                                d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="breb-head__title">Pago con BREB</p>
                        <p class="breb-head__sub">Escanea el código QR con tu app bancaria</p>
                    </div>
                    <button @click="cerrar" class="breb-close">✕</button>
                </div>

                <!-- Body -->
                <div class="breb-body">
                    <!-- QR -->
                    <div class="breb-qr-wrap">
                        <img v-if="qrImage" :src="qrImage" alt="QR de pago BREB" class="breb-qr" />
                        <div v-else class="breb-qr-placeholder">
                            <span>No se recibió el código QR.</span>
                        </div>
                    </div>

                    <button @click="descargarQr" :disabled="!qrImage" class="breb-btn breb-btn--download">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                        </svg>
                        Descargar QR
                    </button>

                    <button v-if="mostrarConsultar" @click="consultarPago" :disabled="consultando || !referencia"
                        class="breb-btn breb-btn--consultar">
                        <svg v-if="!consultando" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                        </svg>
                        <div v-else class="breb-spinner" />
                        {{ consultando ? 'Consultando...' : 'Consultar pago' }}
                    </button>

                    <div v-if="estadoPago" class="breb-estado"
                        :class="estadoPago === 'APROBADO' ? 'breb-estado--aprobado' : 'breb-estado--pendiente'">
                        El estado de su pago es: <strong>{{ estadoPago }}</strong>
                    </div>

                    <div v-if="socketMensaje" class="breb-estado"
                        :class="socketConectado ? 'breb-estado--socket' : 'breb-estado--pendiente'">
                        {{ socketMensaje }}
                    </div>

                    <!-- Instructions -->
                    <div class="breb-instrucciones">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#299261" viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <p class="breb-instrucciones__text">
                            Escanea el código con tu app bancaria, o descarga la imagen y cárgala desde tu banco.
                        </p>
                    </div>

                    <!-- Info -->
                    <div class="breb-info">
                        <div v-if="concepto" class="breb-info__row">
                            <span class="breb-info__label">Concepto</span>
                            <span class="breb-info__val">{{ concepto }}</span>
                        </div>
                        <div v-if="monto !== null && monto !== undefined" class="breb-info__row">
                            <span class="breb-info__label">Monto</span>
                            <span class="breb-info__val breb-info__val--monto">{{ formatPrecio(monto) }}</span>
                        </div>
                        <div v-if="referencia" class="breb-info__row">
                            <span class="breb-info__label">Referencia</span>
                            <span class="breb-info__val breb-info__val--mono">{{ referencia }}</span>
                        </div>
                    </div>
                </div>

                <!-- Foot -->
                <div class="breb-foot">
                    <button @click="cerrar"
                        class="breb-btn breb-btn--cancel">
                        Cerrar
                    </button>
                    <button @click="regenerar"
                        class="breb-btn breb-btn--regenerate">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                        Volver a generar
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'
import PagosService from '@/api/services/pagos.service'
import { showInfo, showError } from '@/utils/swal'

const props = defineProps({
    modelValue: Boolean,
    qrImage: { type: String, default: '' },
    referencia: { type: String, default: '' },
    invoiceNum: { type: String, default: '' },
    idTransaccion: { type: String, default: '' },
    monto: { type: Number, default: null },
    concepto: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'regenerar'])

const mostrarConsultar = ref(false)
const consultando = ref(false)
const estadoPago = ref('')
const timerConsultar = ref(null)
const socket = ref(null)
const socketConectado = ref(false)
const socketMensaje = ref('')

const iniciarTimer = () => {
    limpiarTimer()
    mostrarConsultar.value = false
    estadoPago.value = ''
    timerConsultar.value = setTimeout(() => {
        mostrarConsultar.value = true
    }, 60000)
}

const limpiarTimer = () => {
    if (timerConsultar.value) {
        clearTimeout(timerConsultar.value)
        timerConsultar.value = null
    }
}

const desconectarSocket = () => {
    if (socket.value) {
        socket.value.disconnect()
        socket.value = null
    }
    socketConectado.value = false
}

const redirigirAConfirmacion = (requestId) => {
    if (!requestId) return
    desconectarSocket()
    window.location.href = `${import.meta.env.VITE_API_URL}/v1/payments/mensualidad/verificar/${requestId}`
}

const conectarSocket = () => {
    if (!props.invoiceNum) return

    const authStore = useAuthStore()
    if (!authStore.token) return

    desconectarSocket()
    socketMensaje.value = 'Conectando a notificaciones...'

    const wsUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL
    socket.value = io(`${wsUrl}/pagos-breb`, {
        auth: { token: authStore.token },
        query: { requestId: props.invoiceNum },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 3,
    })

    socket.value.on('connect', () => {
        socketConectado.value = true
        socketMensaje.value = 'Conectado. Esperando confirmación del banco...'
    })

    socket.value.on('disconnect', () => {
        socketConectado.value = false
    })

    socket.value.on('connect_error', (err) => {
        socketConectado.value = false
        socketMensaje.value = 'No se pudo conectar a las notificaciones. Usa el botón "Consultar pago".'
    })

    socket.value.on('pago-actualizado', (data) => {
        const estado = data?.estado ?? null
        estadoPago.value = estado
        socketMensaje.value = `Notificación recibida: ${estado || 'Desconocido'}`
        showInfo('Notificación de pago BREB', `Estado recibido: ${estado || 'Desconocido'}`)

        if (estado === 'APROBADO') {
            const IdTransaccion = data?.IdTransaccion ?? props.idTransaccion
            redirigirAConfirmacion(IdTransaccion)
        }
    })
}

watch(() => props.modelValue, (val) => {
    if (val) {
        iniciarTimer()
        conectarSocket()
    } else {
        limpiarTimer()
        desconectarSocket()
        socketMensaje.value = ''
    }
})

onUnmounted(() => {
    limpiarTimer()
    desconectarSocket()
})

const cerrar = () => {
    emit('update:modelValue', false)
}

const regenerar = () => {
    limpiarTimer()
    desconectarSocket()
    emit('regenerar')
}

const formatPrecio = (v) => {
    if (!v && v !== 0) return '—'
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
}

const descargarQr = () => {
    if (!props.qrImage) return

    const link = document.createElement('a')
    link.href = props.qrImage
    link.download = `qr-pago-breb-${props.referencia || 'pago'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const consultarPago = async () => {
    if (!props.referencia) return

    consultando.value = true
    estadoPago.value = ''

    try {
        const res = await PagosService.consultarEstadoBreb(props.referencia)
        console.log(res)
        const data = res?.data ?? res
        const estado = data?.estado ?? null

        estadoPago.value = estado
        showInfo('Estado del pago', `El estado de su pago es: ${estado || 'Desconocido'}`)

        if (estado === 'APROBADO') {
            const requestId = data?.requestId ?? props.requestId
            redirigirAConfirmacion(requestId)
            return
        }
    } catch (e) {
        showError({ status: e?.response?.status, data: e?.response?.data })
    } finally {
        consultando.value = false
    }
}
</script>

<style scoped>
/* Overlay */
.breb-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 70;
    padding: 16px;
}

/* Card */
.breb-card {
    background: white;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 8px 0 #000;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: brebIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

@keyframes brebIn {
    from {
        opacity: 0;
        transform: scale(0.88) translateY(28px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Head */
.breb-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px 14px;
    background: #0D291C;
    border-bottom: 2px solid #0a1f15;
    position: relative;
}

.breb-head__icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: rgba(127, 211, 68, 0.15);
    border: 1.5px solid rgba(127, 211, 68, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.breb-head__title {
    font-size: 0.92rem;
    font-weight: 600;
    color: white;
    line-height: 1.2;
}

.breb-head__sub {
    font-size: 0.64rem;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 600;
    margin-top: 1px;
}

.breb-close {
    margin-left: auto;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.12s;
}

.breb-close:hover {
    background: rgba(255, 255, 255, 0.18);
    color: white;
}

/* Body */
.breb-body {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: white;
}

.breb-qr-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background: #f8fafb;
    border: 2px dashed #c8e6c9;
    border-radius: 20px;
}

.breb-qr {
    max-width: 240px;
    width: 100%;
    height: auto;
    border-radius: 12px;
}

.breb-qr-placeholder {
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 0.8rem;
    font-weight: 600;
}

.breb-instrucciones {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: #f0fdf4;
    border: 1.5px solid #c8e6c9;
    border-radius: 14px;
}

.breb-instrucciones__text {
    font-size: 0.75rem;
    font-weight: 600;
    color: #166534;
    line-height: 1.5;
    margin: 0;
}

.breb-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    background: #f8fafb;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
}

.breb-info__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.breb-info__label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
}

.breb-info__val {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D291C;
    text-align: right;
}

.breb-info__val--monto {
    color: #299261;
    font-size: 0.95rem;
}

.breb-info__val--mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.75rem;
}

/* Foot */
.breb-foot {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 20px 20px;
    background: white;
    border-top: 2px solid #e2e8f0;
}

.breb-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
}

.breb-btn:active {
    transform: translateY(2px);
}

.breb-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.breb-btn--cancel {
    background: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 1px 0 #000;
}

.breb-btn--download {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 2px 0 #051510;
}

.breb-btn--download:hover:not(:disabled) {
    background: #132e21;
}

.breb-btn--regenerate {
    background: white;
    color: #299261;
    border-color: #c8e6c9;
    box-shadow: 0 2px 0 #c8e6c9;
}

.breb-btn--regenerate:hover {
    background: #f0fdf4;
}

.breb-btn--consultar {
    background: white;
    color: #0D291C;
    border-color: #0D291C;
    box-shadow: 0 2px 0 #051510;
}

.breb-btn--consultar:hover:not(:disabled) {
    background: #f0fdf4;
}

.breb-spinner {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border: 2px solid rgba(13, 41, 28, 0.25);
    border-top-color: #0D291C;
    border-radius: 50%;
    animation: brebSpin 0.7s linear infinite;
}

@keyframes brebSpin {
    to { transform: rotate(360deg); }
}

.breb-estado {
    text-align: center;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 0.78rem;
    font-weight: 600;
}

.breb-estado--aprobado {
    background: #f0fdf4;
    color: #166534;
    border: 1.5px solid #c8e6c9;
}

.breb-estado--pendiente {
    background: #fffbeb;
    color: #92400e;
    border: 1.5px solid #fde68a;
}

.breb-estado--socket {
    background: #eff6ff;
    color: #1e40af;
    border: 1.5px solid #bfdbfe;
}

/* Transitions */
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

.modal-enter-active .breb-card {
    animation: brebIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
</style>
