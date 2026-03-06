<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <div class="header-bar">
            <div class="header-bar__desktop">
                <button @click="$router.back()" class="add-btn">← Volver</button>
                <h2 class="header-bar__title">Códigos de Validación</h2>
                <div style="width:100px" />
            </div>
            <div class="header-bar__mobile">
                <h2 class="header-bar__title">Códigos de Validación</h2>
                <div class="header-bar__actions">
                    <button @click="$router.back()" class="add-btn">← Volver</button>
                </div>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="flex flex-col items-center justify-center flex-1 gap-8 px-4 py-10">

            <!-- Card central -->
            <div class="codigo-card">

                <!-- Icono decorativo -->
                <div class="codigo-card__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#7FD344" viewBox="0 0 24 24">
                        <path
                            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                </div>

                <!-- Texto -->
                <div class="text-center flex flex-col gap-2">
                    <h1 class="codigo-card__title">Generar Código de Validación</h1>
                    <p class="codigo-card__sub">
                        Genera un código único para que un cliente pueda registrarse en el sistema asociado a una sede y
                        autorización específica.
                    </p>
                </div>

                <!-- Lista de pasos -->
                <div class="codigo-steps">
                    <div class="codigo-step">
                        <div class="codigo-step__num">1</div>
                        <span class="codigo-step__txt">Selecciona la sede del parqueadero</span>
                    </div>
                    <div class="codigo-step">
                        <div class="codigo-step__num">2</div>
                        <span class="codigo-step__txt">Elige la autorización o mensualidad</span>
                    </div>
                    <div class="codigo-step">
                        <div class="codigo-step__num">3</div>
                        <span class="codigo-step__txt">Comparte el código generado con el cliente</span>
                    </div>
                </div>

                <!-- Botón generar -->
                <button @click="() => abrirModal()" class="btn-generar"> <svg xmlns="http://www.w3.org/2000/svg"
                        width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
                    </svg>
                    Generar código
                </button>

            </div>

            <!-- Historial de códigos generados en sesión -->
            <Transition name="reveal">
                <div v-if="codigosGenerados.length > 0" class="historial-wrap">
                    <p class="historial-titulo">Códigos generados en esta sesión</p>
                    <div class="flex flex-col gap-3">
                        <div v-for="(c, i) in codigosGenerados" :key="i" class="historial-item">
                            <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                                <span class="historial-item__sede">{{ c.sedeNombre }}</span>
                                <span class="historial-item__auth">Autorización #{{ c.idAutorizacion }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="historial-item__codigo">{{ c.codigo }}</span>
                                <button @click="copiarCodigo(c.codigo, i)" class="btn-copiar"
                                    :class="{ 'btn-copiar--ok': copiado === i }">
                                    <svg v-if="copiado !== i" xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

        </div>


        <!-- ══════════════════════════════════════════
             MODAL — GENERAR CÓDIGO
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalGenerar" class="modal-overlay" @click.self="cerrarModal">
                <div class="modal-card">

                    <!-- Head -->
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                </svg>
                            </div>
                            <div>
                                <p class="modal-head__name">Nuevo código</p>
                                <p class="modal-head__sub">Selecciona sede y autorización</p>
                            </div>
                        </div>
                        <button @click="cerrarModal" class="modal-close">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="modal-body">

                        <!-- Sede -->
                        <div class="field-group">
                            <label class="field-label">Sede <span class="text-red-400">*</span></label>
                            <div v-if="cargandoSedes"
                                class="flex items-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-100">
                                <span class="spinner-sm" />
                                <span class="text-[0.75rem] text-gray-400 font-semibold">Cargando sedes...</span>
                            </div>
                            <select v-model="form.idSede" class="field-input field-input--select"
                                @change="onSedeChange">
                                <option value="" disabled>Selecciona una sede</option>
                                <option v-for="s in sedes" :key="s.IdEstacionamiento"
                                    :value="Number(s.IdEstacionamiento)">
                                    {{ s.Nombre }}
                                </option>
                            </select>
                        </div>

                        <!-- Autorización -->
                        <!-- Autorización -->
                        <div class="field-group">
                            <label class="field-label">Autorización <span class="text-red-400">*</span></label>
                            <div v-if="cargandoTarifas"
                                class="flex items-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-100">
                                <span class="spinner-sm" />
                                <span class="text-[0.75rem] text-gray-400 font-semibold">Cargando
                                    autorizaciones...</span>
                            </div>
                            <select v-else v-model="form.idAutorizacion" class="field-input field-input--select"
                                :disabled="!form.idSede || tarifas.length === 0">
                                <option value="" disabled>
                                    {{ !form.idSede
                                        ? 'Primero selecciona una sede'
                                        : tarifas.length === 0
                                            ? 'Sin autorizaciones disponibles'
                                            : 'Selecciona una autorización' }}
                                </option>
                                <option v-for="t in tarifas" :key="t.IdAutorizacion" :value="t.IdAutorizacion">
                                    {{ t.label }}
                                </option>
                            </select>
                            <p v-if="form.idSede && tarifas.length === 0 && !cargandoTarifas"
                                class="text-[0.66rem] font-semibold text-amber-600 pl-0.5">
                                No hay autorizaciones disponibles para esta sede.
                            </p>
                        </div>

                        <!-- Error -->
                        <Transition name="fade">
                            <div v-if="errModal"
                                class="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[0.77rem] font-bold bg-red-50 text-red-700 border-2 border-red-300"
                                style="box-shadow:0 3px 0 #fca5a5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                    viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                {{ errModal }}
                            </div>
                        </Transition>

                    </div>

                    <!-- Foot -->
                    <div class="modal-foot">
                        <button @click="cerrarModal" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarGeneracion" class="btn-modal btn-modal--confirm"
                            :disabled="!form.idSede || !form.idAutorizacion || generando">
                            <span v-if="generando" class="spinner-sm spinner-sm--light" />
                            <template v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                </svg>
                                Generar
                            </template>
                        </button>
                    </div>

                </div>
            </div>
        </Transition>


        <!-- ══════════════════════════════════════════
             MODAL — CÓDIGO GENERADO (resultado)
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalResultado" class="modal-overlay" @click.self="cerrarResultado">
                <div class="modal-card modal-card--resultado">

                    <div class="modal-head" style="background:#0a1f15">
                        <div class="modal-head__left">
                            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style="background:rgba(127,211,68,0.2)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            </div>
                            <div>
                                <p class="modal-head__name">¡Código generado!</p>
                                <p class="modal-head__sub">{{ sedeNombreResultado }}</p>
                            </div>
                        </div>
                        <button @click="cerrarResultado" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body" style="background:#0D291C">

                        <p class="text-[0.72rem] font-semibold text-center" style="color:rgba(127,211,68,0.6)">
                            Comparte este código con el cliente para que complete su registro
                        </p>

                        <!-- Código grande -->
                        <div class="resultado-codigo-wrap">
                            <span class="resultado-codigo">{{ codigoResultado }}</span>
                        </div>

                        <!-- Botón copiar grande -->
                        <button @click="copiarResultado" class="btn-copiar-grande"
                            :class="{ 'btn-copiar-grande--ok': copiadoResultado }">
                            <svg v-if="!copiadoResultado" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            {{ copiadoResultado ? '¡Copiado!' : 'Copiar código' }}
                        </button>

                        <p class="text-[0.62rem] font-semibold text-center" style="color:rgba(127,211,68,0.35)">
                            El código es de un solo uso y tiene vigencia limitada
                        </p>

                    </div>

                    <div class="modal-foot" style="border-top:1.5px solid rgba(127,211,68,0.2);background:#0D291C">
                        <button @click="cerrarResultado" class="btn-modal btn-modal--cancel">Cerrar</button>
                        <button @click="generarOtro" class="btn-modal btn-modal--confirm"
                            style="display:flex;align-items:center;justify-content:center;gap:6px">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Generar otro
                        </button>
                    </div>

                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import SedesService from '@/api/services/sedes.service'
import CodigosService from '@/api/services/codigos.service'
import AutorizacionesService from '@/api/services/autorizaciones.service'

const router = useRouter()

const modalGenerar = ref(false)
const modalResultado = ref(false)

const sedes = ref([])
const tarifas = ref([])
const cargandoSedes = ref(false)
const cargandoTarifas = ref(false)
const generando = ref(false)
const errModal = ref('')
const codigosGenerados = ref([])
const codigoResultado = ref('')
const sedeNombreResultado = ref('')
const copiado = ref(null)
const copiadoResultado = ref(false)

const form = reactive({
    idSede: null,
    idAutorizacion: null,
})

// ── Abrir modal y cargar sedes ─────────────────────────────────────
const abrirModal = async () => {
    console.log('🟢 abrirModal called')
    modalGenerar.value = true  // ← mueve esta línea AL INICIO, antes del await
    errModal.value = ''

    if (sedes.value.length > 0) return

    cargandoSedes.value = true
    try {
        const res = await SedesService.getAll()
        sedes.value = Array.isArray(res) ? res : (res?.data ?? [])
        console.log('🏢 Sedes cargadas:', sedes.value)
    } catch (e) {
        console.error('[CodigoVerificacion] Error cargando sedes:', e)
        sedes.value = []
    } finally {
        cargandoSedes.value = false
    }
}

// ── Al cambiar sede → cargar tarifas filtradas por esa sede ────────
const onSedeChange = async () => {
    form.idAutorizacion = ''
    tarifas.value = []
    errModal.value = ''

    if (!form.idSede) return

    cargandoTarifas.value = true
    try {
        const res = await AutorizacionesService.getBySede(form.idSede)
        const raw = Array.isArray(res) ? res : (res?.data ?? res?.items ?? [])

        tarifas.value = raw
            .filter(a => a.Estado)
            .map(a => ({
                IdAutorizacion: Number(a.IdAutorizacion),
                label: a.NombreAutorizacion ?? `Autorización #${a.IdAutorizacion}`,
            }))

        console.log('📋 Autorizaciones:', tarifas.value)
    } catch (e) {
        console.error('[onSedeChange]', e)
        tarifas.value = []
    } finally {
        cargandoTarifas.value = false
    }
}
// ── Generar código ─────────────────────────────────────────────────
const confirmarGeneracion = async () => {
    if (!form.idSede || !form.idAutorizacion) return
    errModal.value = ''
    generando.value = true

    try {
        const res = await CodigosService.generarCodigo(form.idSede, form.idAutorizacion)

        if (res?.error || res?.success === false) {
            const msg = res?.data?.message ?? res?.message ?? 'Error al generar el código'
            errModal.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }

        // Ajusta el campo según lo que devuelva tu API
        const codigo = res?.data?.codigo ?? res?.data?.Codigo ?? res?.codigo ?? res?.Codigo ?? String(res?.data ?? '—')
        const sedeObj = sedes.value.find(s => s.IdEstacionamiento === form.idSede || s.id === form.idSede)

        codigoResultado.value = String(codigo)
        sedeNombreResultado.value = sedeObj?.Nombre ?? `Sede ${form.idSede}`
        copiadoResultado.value = false

        codigosGenerados.value.unshift({
            codigo,
            sedeNombre: sedeNombreResultado.value,
            idAutorizacion: form.idAutorizacion,
        })

        modalGenerar.value = false
        modalResultado.value = true

        form.idSede = ''
        form.idAutorizacion = ''
        tarifas.value = []

    } catch (e) {
        console.error('[confirmarGeneracion] ERROR:', e)
        const msg = e.response?.data?.message
        errModal.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al generar el código.')
    } finally {
        generando.value = false
    }
}

// ── Helpers ────────────────────────────────────────────────────────
const cerrarModal = () => {
    modalGenerar.value = false
    errModal.value = ''
    form.idSede = ''
    form.idAutorizacion = ''
    tarifas.value = []
}

const cerrarResultado = () => {
    modalResultado.value = false
    copiadoResultado.value = false
}

const generarOtro = () => {
    modalResultado.value = false
    abrirModal()
}

const copiarCodigo = async (codigo, idx) => {
    try {
        await navigator.clipboard.writeText(codigo)
        copiado.value = idx
        setTimeout(() => { copiado.value = null }, 2000)
    } catch { /* silent */ }
}

const copiarResultado = async () => {
    try {
        await navigator.clipboard.writeText(codigoResultado.value)
        copiadoResultado.value = true
        setTimeout(() => { copiadoResultado.value = false }, 2000)
    } catch { /* silent */ }
}
</script>

<style scoped>
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Header */
.header-bar {
    background: white;
    border-radius: 24px;
    padding: 16px 20px;
}

.header-bar__desktop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.header-bar__mobile {
    display: none;
}

.header-bar__title {
    font-size: 1.4rem;
    font-weight: 900;
    color: #232B3A;
    text-align: center;
}

.add-btn {
    font-size: 0.82rem;
    font-weight: 800;
    color: #232B3A;
    background: #7FD344;
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

@media (max-width: 560px) {
    .header-bar__desktop {
        display: none;
    }

    .header-bar__mobile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
    }

    .header-bar__actions {
        display: flex;
        gap: 12px;
        width: 100%;
        justify-content: center;
    }
}

/* Card central */
.codigo-card {
    width: 100%;
    max-width: 480px;
    background: white;
    border-radius: 28px;
    border: 2px solid #e8f5e9;
    box-shadow: 0 6px 0 #e2ede7, 0 2px 24px rgba(13, 41, 28, 0.07);
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

.codigo-card__icon {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    background: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 0 #051510;
    flex-shrink: 0;
}

.codigo-card__title {
    font-size: 1.3rem;
    font-weight: 900;
    color: #0D291C;
    line-height: 1.2;
}

.codigo-card__sub {
    font-size: 0.78rem;
    font-weight: 600;
    color: #9ca3af;
    line-height: 1.6;
    max-width: 340px;
    margin: 0 auto;
}

/* Pasos */
.codigo-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.codigo-step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 14px;
    background: #f9fafb;
    border: 1.5px solid #f0f0f0;
}

.codigo-step__num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #0D291C;
    color: #7FD344;
    font-size: 0.72rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 0 #051510;
}

.codigo-step__txt {
    font-size: 0.78rem;
    font-weight: 700;
    color: #374151;
}

/* Botón generar */
.btn-generar {
    width: 100%;
    padding: 14px;
    background: #0D291C;
    color: #7FD344;
    border: 2px solid #0D291C;
    border-radius: 14px;
    font-size: 0.92rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 5px 0 #051510;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
}

.btn-generar:hover {
    background: #1a4a2e;
}

.btn-generar:active {
    transform: translateY(4px);
    box-shadow: 0 1px 0 #051510;
}

/* Historial */
.historial-wrap {
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.historial-titulo {
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #9ca3af;
    padding-left: 4px;
}

.historial-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: white;
    border: 2px solid #e8f5e9;
    border-radius: 16px;
    padding: 12px 16px;
    box-shadow: 0 3px 0 #e2ede7;
}

.historial-item__sede {
    font-size: 0.82rem;
    font-weight: 800;
    color: #0D291C;
}

.historial-item__auth {
    font-size: 0.65rem;
    font-weight: 600;
    color: #9ca3af;
}

.historial-item__codigo {
    font-family: monospace;
    font-size: 0.85rem;
    font-weight: 900;
    color: #299261;
    letter-spacing: 0.08em;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 8px;
    padding: 4px 10px;
}

.btn-copiar {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: #f3f4f6;
    border: 1.5px solid #e5e7eb;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
}

.btn-copiar:hover {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
}

.btn-copiar--ok {
    background: #dcfce7 !important;
    color: #16a34a !important;
    border-color: #86efac !important;
}

/* Modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 16px;
}

.modal-card {
    background: #B8E19E;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 7px 0 #000;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-card--resultado {
    background: #0D291C;
    border-color: #7FD344;
    box-shadow: 0 7px 0 #051510;
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 14px;
    background: #0D291C;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-head__name {
    font-size: 0.9rem;
    font-weight: 800;
    color: white;
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

.modal-foot {
    display: flex;
    gap: 10px;
    padding: 12px 22px 20px;
    border-top: 2px solid rgba(13, 41, 28, 0.1);
}

.modal-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(127, 211, 68, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Resultado */
.resultado-codigo-wrap {
    background: rgba(127, 211, 68, 0.08);
    border: 2px solid rgba(127, 211, 68, 0.3);
    border-radius: 18px;
    padding: 22px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.resultado-codigo {
    font-family: monospace;
    font-size: 1.6rem;
    font-weight: 900;
    color: #7FD344;
    letter-spacing: 0.18em;
    word-break: break-all;
    text-align: center;
}

.btn-copiar-grande {
    width: 100%;
    padding: 12px;
    background: rgba(127, 211, 68, 0.12);
    color: #7FD344;
    border: 2px solid rgba(127, 211, 68, 0.35);
    border-radius: 14px;
    font-size: 0.82rem;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.15s;
}

.btn-copiar-grande:hover {
    background: rgba(127, 211, 68, 0.2);
    border-color: #7FD344;
}

.btn-copiar-grande--ok {
    background: rgba(127, 211, 68, 0.25) !important;
    color: #a3e635 !important;
}

/* Botones modal */
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
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
    background: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-modal--confirm {
    background: #232B3A;
    color: white;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

/* Fields */
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
    background: white !important;
    border: 2px solid #0D291C !important;
    border-radius: 14px !important;
    padding: 10px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}

.field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.2) !important;
}

.field-input:disabled {
    background: #f3f4f6 !important;
    color: #9ca3af !important;
    cursor: not-allowed;
}

.field-input--select {
    cursor: pointer;
    appearance: auto;
}

/* Spinners */
.spinner-sm {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(41, 146, 97, 0.3);
    border-top-color: #299261;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

.spinner-sm--light {
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: white;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

.reveal-enter-active {
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.reveal-leave-active {
    transition: opacity 0.15s ease;
}

.reveal-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.reveal-leave-to {
    opacity: 0;
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
</style>