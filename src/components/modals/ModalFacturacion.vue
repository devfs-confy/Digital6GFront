<template>
    <Transition name="modal">
        <div v-if="modelValue" class="factura-overlay" @click.self="$emit('update:modelValue', false)">
            <div class="factura-card">

                <!-- ── PASO 0: ¿Desea factura? ── -->
                <template v-if="paso === 'pregunta'">
                    <div class="factura-head">
                        <div class="factura-head__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="factura-head__title">Facturación electrónica</p>
                            <p class="factura-head__sub">¿Deseas factura para este pago?</p>
                        </div>
                        <button @click="$emit('update:modelValue', false)" class="factura-close">✕</button>
                    </div>

                    <div class="factura-body factura-body--center">
                        <div class="factura-receipt-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0D291C"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18zM6 15h12v2H6zm0-4h12v2H6zm0-4h12v2H6z" />
                            </svg>
                        </div>
                        <p class="factura-pregunta-txt">
                            Te enviaremos la factura electrónica al correo registrado.<br />
                            <span class="factura-pregunta-sub">Si no la necesitas, continuarás sin datos de
                                facturación.</span>
                        </p>

                        <div class="factura-opciones">
                            <button @click="elegirSi" class="factura-opcion factura-opcion--si">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                                Sí, quiero factura
                            </button>
                            <button @click="elegirNo" class="factura-opcion factura-opcion--no">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                                No, continuar sin factura
                            </button>
                        </div>
                    </div>
                </template>

                <!-- ── PASO 1: Buscar cliente ── -->
                <template v-else-if="paso === 'buscar'">
                    <div class="factura-head">
                        <button @click="paso = 'pregunta'" class="factura-back">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                        </button>
                        <div class="factura-head__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <p class="factura-head__title">Datos de facturación</p>
                            <p class="factura-head__sub">Ingresa tu documento de identificación</p>
                        </div>
                        <button @click="$emit('update:modelValue', false)" class="factura-close">✕</button>
                    </div>

                    <div class="factura-body">
                        <div class="factura-field-group">
                            <label class="factura-label">Número de documento <span class="req">*</span></label>
                            <div class="factura-input-wrap"
                                :class="{ 'factura-input-wrap--found': clienteEncontrado, 'factura-input-wrap--loading': buscando }">
                                <input v-model="docBusqueda" type="text" class="factura-input"
                                    placeholder="Ej: 1020304050" @input="onDocInput"
                                    :disabled="buscando || clienteEncontrado" />
                                <div v-if="buscando" class="factura-spinner" />
                                <svg v-else-if="clienteEncontrado" xmlns="http://www.w3.org/2000/svg" width="16"
                                    height="16" fill="#299261" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            </div>
                            <p v-if="msgBusqueda" class="factura-msg"
                                :class="clienteEncontrado ? 'factura-msg--ok' : 'factura-msg--hint'">
                                {{ msgBusqueda }}
                            </p>
                        </div>

                        <!-- Cliente encontrado: resumen -->
                        <Transition name="reveal">
                            <div v-if="clienteEncontrado && clienteData" class="factura-cliente-card">
                                <div class="factura-cliente-avatar">
                                    {{ iniciales(clienteData.RazonSocial ?? clienteData.razonSocial) }}
                                </div>
                                <div class="factura-cliente-info">
                                    <p class="factura-cliente-nombre">{{ clienteData.RazonSocial ??
                                        clienteData.razonSocial }}</p>
                                    <p class="factura-cliente-sub">{{ clienteData.Identificacion ??
                                        clienteData.identificacion }} · {{ clienteData.Email ?? clienteData.email }}</p>
                                    <p class="factura-cliente-sub">{{ clienteData.TipoDocumento ??
                                        clienteData.tipoDocumento }} · {{ clienteData.TipoPersona ??
                                            clienteData.tipoPersona }}</p>
                                </div>
                            </div>
                        </Transition>

                        <!-- No encontrado: ofrecer crear -->
                        <Transition name="reveal">
                            <div v-if="noEncontrado" class="factura-no-encontrado">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706"
                                    viewBox="0 0 24 24" class="shrink-0">
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                                <div>
                                    <p class="factura-no-txt">No encontramos un cliente con ese documento.</p>
                                    <button @click="irACrear" class="factura-link-btn">
                                        Crear nuevo cliente de facturación →
                                    </button>
                                </div>
                            </div>
                        </Transition>

                        <!-- Error general -->
                        <div v-if="errBusqueda" class="factura-err">{{ errBusqueda }}</div>
                    </div>

                    <div class="factura-foot">
                        <button @click="paso = 'pregunta'" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarConCliente" class="btn-modal btn-modal--confirm"
                            :disabled="!clienteEncontrado || buscando">
                            Usar este cliente →
                        </button>
                    </div>
                </template>

                <!-- ── PASO 2: Crear cliente ── -->
                <template v-else-if="paso === 'crear'">
                    <div class="factura-head">
                        <button @click="paso = 'buscar'" class="factura-back">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                        </button>
                        <div class="factura-head__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="factura-head__title">Nuevo cliente</p>
                            <p class="factura-head__sub">Completa los datos de facturación</p>
                        </div>
                        <button @click="$emit('update:modelValue', false)" class="factura-close">✕</button>
                    </div>

                    <div class="factura-body factura-body--scroll">

                        <div class="factura-grid">
                            <!-- Razón social -->
                            <div class="factura-field-group factura-col-2">
                                <label class="factura-label">Razón social / Nombre completo <span
                                        class="req">*</span></label>
                                <div class="factura-input-wrap">
                                    <input v-model="form.RazonSocial" type="text" class="factura-input"
                                        placeholder="Ej: Juan Pérez García" />
                                </div>
                            </div>

                            <!-- Tipo persona -->
                            <div class="factura-field-group">
                                <label class="factura-label">Tipo de persona <span class="req">*</span></label>
                                <div class="factura-segmented">
                                    <button @click="form.TipoPersona = 'Natural'"
                                        :class="{ 'factura-seg--on': form.TipoPersona === 'Natural' }">
                                        Natural
                                    </button>
                                    <button @click="form.TipoPersona = 'Juridica'"
                                        :class="{ 'factura-seg--on': form.TipoPersona === 'Juridica' }">
                                        Jurídica
                                    </button>
                                </div>
                            </div>

                            <!-- Tipo documento -->
                            <div class="factura-field-group">
                                <label class="factura-label">Tipo de documento <span class="req">*</span></label>
                                <div class="factura-segmented">
                                    <button v-for="t in ['CC', 'CE', 'NIT']" :key="t" @click="form.TipoDocumento = t"
                                        :class="{ 'factura-seg--on': form.TipoDocumento === t }">
                                        {{ t }}
                                    </button>
                                </div>
                            </div>

                            <!-- Identificación -->
                            <div class="factura-field-group">
                                <label class="factura-label">Número de identificación <span class="req">*</span></label>
                                <div class="factura-input-wrap">
                                    <input v-model="form.Identificacion" type="text" class="factura-input"
                                        placeholder="Ej: 900123456" />
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="factura-field-group">
                                <label class="factura-label">Correo para facturas <span class="req">*</span></label>
                                <div class="factura-input-wrap">
                                    <input v-model="form.Email" type="email" class="factura-input"
                                        placeholder="facturacion@empresa.com" />
                                </div>
                            </div>

                            <!-- Teléfono -->
                            <div class="factura-field-group">
                                <label class="factura-label">Teléfono</label>
                                <div class="factura-input-wrap">
                                    <input v-model="form.Telefono" type="text" class="factura-input"
                                        placeholder="3001234567"
                                        @input="form.Telefono = $event.target.value.replace(/\D/g, '')" />
                                </div>
                            </div>

                            <!-- Dirección -->
                            <div class="factura-field-group factura-col-2">
                                <label class="factura-label">Dirección</label>
                                <div class="factura-input-wrap">
                                    <input v-model="form.Direccion" type="text" class="factura-input"
                                        placeholder="Calle 10 # 20-30, Bogotá" />
                                </div>
                            </div>
                        </div>

                        <div v-if="errCrear" class="factura-err">{{ errCrear }}</div>
                    </div>

                    <div class="factura-foot">
                        <button @click="paso = 'buscar'" class="btn-modal btn-modal--cancel">Volver</button>
                        <button @click="confirmarCrear"
                            class="btn-modal btn-modal--confirm flex items-center justify-center gap-2"
                            :disabled="creando">
                            <div v-if="creando" class="btn-spinner" />
                            {{ creando ? 'Creando...' : 'Crear y pagar →' }}
                        </button>
                    </div>
                </template>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import ClientBillService from '@/api/services/clientefactura.service'

const props = defineProps({
    modelValue: Boolean,
    documentoUsuario: { type: String, default: '' },
    nombreUsuario: { type: String, default: '' },
    emailUsuario: { type: String, default: '' },
    telefonoUsuario: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'confirmar'])

// ── Estado ────────────────────────────────────────────────────────
const paso = ref('pregunta')

// Búsqueda
const docBusqueda = ref('')
const buscando = ref(false)
const clienteEncontrado = ref(false)
const noEncontrado = ref(false)
const clienteData = ref(null)
const msgBusqueda = ref('')
const errBusqueda = ref('')

// Crear
const creando = ref(false)
const errCrear = ref('')
const form = reactive({
    Identificacion: '',
    TipoPersona: 'Natural',
    TipoDocumento: 'CC',
    RazonSocial: '',
    Email: '',
    Telefono: '',
    Direccion: '',
})

// Reset al abrir/cerrar
watch(() => props.modelValue, (val) => {
    if (val) reset()
})

const reset = () => {
    paso.value = 'pregunta'
    docBusqueda.value = ''
    buscando.value = false
    clienteEncontrado.value = false
    noEncontrado.value = false
    clienteData.value = null
    msgBusqueda.value = ''
    errBusqueda.value = ''
    errCrear.value = ''
    creando.value = false
    Object.assign(form, {
        Identificacion: props.documentoUsuario ?? '',
        TipoPersona: 'Natural',
        TipoDocumento: 'CC',
        RazonSocial: props.nombreUsuario ?? '',
        Email: props.emailUsuario ?? '',
        Telefono: props.telefonoUsuario ?? '',
        Direccion: '',
    })
}

// ── Paso 0: Elección ─────────────────────────────────────────────
const elegirNo = () => {
    // Sin factura: IdentificacionCliente estándar 222222222222
    emit('confirmar', { IdentificacionCliente: '222222222222' })
    emit('update:modelValue', false)
}

const elegirSi = () => {
    paso.value = 'buscar'
}

// ── Paso 1: Buscar ───────────────────────────────────────────────
let searchTimer = null
const onDocInput = () => {
    clienteEncontrado.value = false
    noEncontrado.value = false
    clienteData.value = null
    msgBusqueda.value = ''
    errBusqueda.value = ''
    clearTimeout(searchTimer)
    const val = docBusqueda.value.replace(/\D/g, '')
    docBusqueda.value = val
    if (val.length >= 5) {
        searchTimer = setTimeout(() => buscarCliente(val), 700)
    }
}

const buscarCliente = async (id) => {
    buscando.value = true
    errBusqueda.value = ''
    try {
        const res = await ClientBillService.GetFacturacionCliente(id)
        const esError = res?.error === true || res?.success === false || (res?.statusCode ?? 0) >= 400
        if (esError) {
            noEncontrado.value = true
            msgBusqueda.value = ''
            // Prellenar form con el doc buscado para facilitar creación
            form.Identificacion = id
            return
        }
        const data = res?.data ?? res
        clienteData.value = data
        clienteEncontrado.value = true
        msgBusqueda.value = '✓ Cliente de facturación encontrado'
    } catch {
        noEncontrado.value = true
        msgBusqueda.value = ''
        form.Identificacion = id
    } finally {
        buscando.value = false
    }
}

const confirmarConCliente = () => {
    if (!clienteData.value) return
    const idCliente = clienteData.value.Identificacion
        ?? clienteData.value.identificacion
        ?? clienteData.value.id
        ?? docBusqueda.value
    emit('confirmar', { IdentificacionCliente: String(idCliente) })
    emit('update:modelValue', false)
}

// ── Paso 2: Crear ────────────────────────────────────────────────
const irACrear = () => {
    errCrear.value = ''
    paso.value = 'crear'
}

const confirmarCrear = async () => {
    errCrear.value = ''
    if (!form.RazonSocial.trim()) { errCrear.value = 'La razón social es obligatoria.'; return }
    if (!form.Identificacion.trim()) { errCrear.value = 'El número de identificación es obligatorio.'; return }
    if (!form.Email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
        errCrear.value = 'Ingresa un correo electrónico válido.'; return
    }

    creando.value = true
    try {
        const dto = {
            Identificacion: form.Identificacion,
            TipoPersona: form.TipoPersona,
            TipoDocumento: form.TipoDocumento,
            RazonSocial: form.RazonSocial,
            Email: form.Email,
            Telefono: form.Telefono,
            Direccion: form.Direccion,
        }
        // El path param es el documento del usuario de la plataforma
        const res = await ClientBillService.CreateFacturacionCliente(props.documentoUsuario, dto)
        const esError = res?.error === true || res?.success === false || (res?.statusCode ?? 0) >= 400
        if (esError) {
            const msg = res?.data?.message ?? res?.message ?? 'Error al crear el cliente.'
            errCrear.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }
        const data = res?.data ?? res
        // Intentar obtener la Identificacion del cliente creado
        const idCliente = data?.Identificacion ?? data?.identificacion ?? form.Identificacion
        emit('confirmar', { IdentificacionCliente: String(idCliente) })
        emit('update:modelValue', false)
    } catch (e) {
        const msg = e.response?.data?.message
        errCrear.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al crear el cliente. Intenta de nuevo.')
    } finally {
        creando.value = false
    }
}

// ── Helpers ──────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
</script>

<style scoped>
/* ── Overlay ── */
.factura-overlay {
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

/* ── Card ── */
.factura-card {
    background: white;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 8px 0 #000;
    width: 100%;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: facturaIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

@keyframes facturaIn {
    from {
        opacity: 0;
        transform: scale(0.88) translateY(28px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* ── Head ── */
.factura-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px 14px;
    background: #0D291C;
    border-bottom: 2px solid #0a1f15;
    position: relative;
}

.factura-head__icon {
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

.factura-head__title {
    font-size: 0.92rem;
    font-weight: 800;
    color: white;
    line-height: 1.2;
}

.factura-head__sub {
    font-size: 0.64rem;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 600;
    margin-top: 1px;
}

.factura-close {
    margin-left: auto;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 900;
    cursor: pointer;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.12s;
}

.factura-close:hover {
    background: rgba(255, 255, 255, 0.18);
    color: white;
}

.factura-back {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.12s;
}

.factura-back:hover {
    background: rgba(255, 255, 255, 0.18);
    color: white;
}

/* ── Body ── */
.factura-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: white;
}

.factura-body--center {
    align-items: center;
    text-align: center;
    padding: 28px 24px;
}

.factura-body--scroll {
    max-height: 58vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #c8e6c9 transparent;
}

/* ── Paso 0: Icono y opciones ── */
.factura-receipt-icon {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    background: linear-gradient(135deg, #e8f5e9, #f0fdf4);
    border: 2px solid #c8e6c9;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 0 #c8e6c9;
    margin-bottom: 4px;
}

.factura-pregunta-txt {
    font-size: 0.85rem;
    font-weight: 600;
    color: #0D291C;
    line-height: 1.6;
}

.factura-pregunta-sub {
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 500;
}

.factura-opciones {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 4px;
}

.factura-opcion {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 20px;
    border-radius: 16px;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    border: 2px solid;
    transition: all 0.15s;
    width: 100%;
}

.factura-opcion--si {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 4px 0 #051510;
}

.factura-opcion--si:hover {
    background: #1a4a2e;
    transform: translateY(-1px);
    box-shadow: 0 5px 0 #051510;
}

.factura-opcion--si:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #051510;
}

.factura-opcion--no {
    background: white;
    color: #6b7280;
    border-color: #e2e8f0;
    box-shadow: 0 3px 0 #e2e8f0;
}

.factura-opcion--no:hover {
    border-color: #cbd5e1;
    color: #374151;
    transform: translateY(-1px);
}

.factura-opcion--no:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #e2e8f0;
}

/* ── Paso 1: Buscar ── */
.factura-field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.factura-col-2 {
    grid-column: 1 / -1;
}

.factura-label {
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #0D291C;
    opacity: 0.5;
}

.req {
    color: #ef4444;
    opacity: 1;
}

.factura-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 14px;
    background: #f8fafb;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

.factura-input-wrap:focus-within {
    border-color: #299261;
    background: white;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.1);
}

.factura-input-wrap--found {
    border-color: #299261 !important;
    background: #f0fdf4 !important;
}

.factura-input-wrap--loading {
    border-color: #299261;
}

.factura-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0D291C;
    min-width: 0;
}

.factura-input::placeholder {
    color: #c1c7d0;
    font-weight: 500;
}

.factura-input:disabled {
    color: #6b7280;
    cursor: not-allowed;
}

.factura-spinner {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border: 2px solid rgba(41, 146, 97, 0.25);
    border-top-color: #299261;
    border-radius: 50%;
    animation: factSpin 0.7s linear infinite;
}

@keyframes factSpin {
    to {
        transform: rotate(360deg);
    }
}

.factura-msg {
    font-size: 0.7rem;
    font-weight: 700;
    padding-left: 2px;
}

.factura-msg--ok {
    color: #299261;
}

.factura-msg--hint {
    color: #9ca3af;
}

/* Cliente encontrado card */
.factura-cliente-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #f0fdf4;
    border: 2px solid #c8e6c9;
    border-radius: 16px;
    box-shadow: 0 3px 0 #c8e6c9;
}

.factura-cliente-avatar {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    background: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.factura-cliente-nombre {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D291C;
    line-height: 1.2;
}

.factura-cliente-sub {
    font-size: 0.65rem;
    font-weight: 600;
    color: #6b7280;
    margin-top: 2px;
}

/* No encontrado */
.factura-no-encontrado {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    background: #fffbeb;
    border: 1.5px solid #fde68a;
    border-radius: 14px;
    font-size: 0.75rem;
}

.factura-no-txt {
    font-weight: 700;
    color: #92400e;
    line-height: 1.4;
}

.factura-link-btn {
    display: inline-block;
    margin-top: 4px;
    font-size: 0.72rem;
    font-weight: 900;
    color: #299261;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.12s;
}

.factura-link-btn:hover {
    color: #0D291C;
}

/* ── Paso 2: Form grid ── */
.factura-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

@media (max-width: 420px) {
    .factura-grid {
        grid-template-columns: 1fr;
    }

    .factura-col-2 {
        grid-column: 1;
    }
}

/* Segmented control */
.factura-segmented {
    display: flex;
    gap: 6px;
}

.factura-segmented button {
    flex: 1;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 800;
    cursor: pointer;
    border: 1.5px solid #e2e8f0;
    background: #f8fafb;
    color: #6b7280;
    transition: all 0.12s;
}

.factura-segmented button:hover {
    border-color: #c8e6c9;
    color: #299261;
}

.factura-seg--on {
    background: #0D291C !important;
    color: #7FD344 !important;
    border-color: #0D291C !important;
    box-shadow: 0 2px 0 #051510;
}

/* Error */
.factura-err {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    font-size: 0.75rem;
    font-weight: 700;
    color: #dc2626;
}

/* ── Footer ── */
.factura-foot {
    display: flex;
    gap: 10px;
    padding: 12px 20px 18px;
    background: white;
    border-top: 2px solid #e2e8f0;
}

/* Reusar clases del padre */
.btn-modal {
    flex: 1;
    padding: 11px 14px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 1px 0;
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
    box-shadow: 0 1px 0 #000;
}

.btn-modal--confirm {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 1px 0 #051510;
}

.btn-modal--confirm:hover:not(:disabled) {
    background: #132e21;
}

.btn-spinner {
    display: inline-block;
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    border: 2px solid rgba(127, 211, 68, 0.3);
    border-top-color: #7FD344;
    border-radius: 50%;
    animation: factSpin 0.7s linear infinite;
}

/* ── Transiciones ── */
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

.reveal-enter-active {
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.reveal-leave-active {
    transition: opacity 0.15s ease;
}

.reveal-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.reveal-leave-to {
    opacity: 0;
}
</style>