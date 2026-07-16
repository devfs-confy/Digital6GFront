<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <AdminPageHeader title="Correos Masivos">
            <template #right>
                <span v-if="estacionamientosSeleccionados.length > 0"
                    class="hidden sm:inline-flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs font-bold px-3 py-2 rounded-full border border-black"
                    style="box-shadow: #595858 0px 2px 0">
                    <AppIcon name="group" :size="14" />
                    {{ estacionamientosSeleccionados.length }} sede{{ estacionamientosSeleccionados.length > 1 ? 's' : '' }}
                </span>
            </template>
        </AdminPageHeader>

        <!-- Alerta informativa -->
        <div
            class="bg-[#f0fdf4] border-2 border-[#299261]/30 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-[0_3px_0_#e2ede7]">
            <div class="w-8 h-8 rounded-lg bg-[#299261]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#299261" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
            </div>
            <div class="flex flex-col gap-1">
                <p class="text-[0.82rem] font-black text-[#0D291C]">Destinatarios válidos</p>
                <p class="text-[0.75rem] font-semibold text-[#0D291C]/70 leading-relaxed">
                    Los correos se envían <strong>únicamente a clientes activos y vigentes</strong> con autorización válida
                    (<strong>mínimo 4 días de vigencia</strong>). Emails duplicados se deduplican automáticamente. Los
                    destinatarios se envían por <strong>BCC</strong> para proteger su privacidad.
                </p>
            </div>
        </div>

        <!-- Formulario principal -->
        <div class="bg-white rounded-2xl border-2 border-gray-100 shadow-[0_4px_0_#e2ede7] p-5 sm:p-6 flex flex-col gap-5">

            <!-- Estacionamientos -->
            <div class="flex flex-col gap-2">
                <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">
                    Estacionamientos <span class="text-red-500">*</span>
                </label>
                <p class="text-[0.72rem] font-semibold text-gray-400 -mt-1">Selecciona uno o más estacionamientos</p>

                <div v-if="loadingSedes" class="flex items-center gap-2 text-[0.8rem] text-gray-400 py-2">
                    <div class="w-4 h-4 rounded-full border-2 border-gray-200 border-t-[#299261] animate-spin" />
                    Cargando estacionamientos...
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                    <label v-for="s in sedes" :key="s.IdEstacionamiento"
                        class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all"
                        :class="formData.IdEstacionamientos.includes(String(s.IdEstacionamiento))
                            ? 'border-[#299261] bg-[#f0fdf4]'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'">
                        <input type="checkbox" :value="String(s.IdEstacionamiento)"
                            v-model="formData.IdEstacionamientos" class="sr-only" />
                        <div class="w-4 h-4 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-all"
                            :class="formData.IdEstacionamientos.includes(String(s.IdEstacionamiento))
                                ? 'bg-[#299261] border-[#299261]'
                                : 'border-gray-300'">
                            <svg v-if="formData.IdEstacionamientos.includes(String(s.IdEstacionamiento))"
                                xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white"
                                viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                        <span class="text-[0.82rem] font-semibold text-[#0D291C]">{{ s.Nombre }}</span>
                    </label>
                </div>

                <p v-if="errEstacionamientos" class="text-[0.72rem] font-bold text-red-600">
                    ⚠ {{ errEstacionamientos }}
                </p>
            </div>

            <!-- Asunto -->
            <div class="flex flex-col gap-1">
                <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">
                    Asunto <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.Asunto" type="text" maxlength="100"
                    class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                    placeholder="Ej: Cambio de horarios de operación" />
                <div class="flex justify-between px-1">
                    <span v-if="errAsunto" class="text-[0.72rem] font-bold text-red-600">⚠ {{ errAsunto }}</span>
                    <span class="text-[0.65rem] font-semibold text-gray-400 ml-auto">{{ formData.Asunto.length }}/100</span>
                </div>
            </div>

            <!-- Mensaje -->
            <div class="flex flex-col gap-1">
                <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">
                    Mensaje <span class="text-red-500">*</span>
                </label>
                <p class="text-[0.72rem] font-semibold text-gray-400 -mt-0.5">Puede incluir HTML. Se insertará dentro del
                    template visual de Confy.</p>
                <textarea v-model="formData.Mensaje" rows="6"
                    class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full resize-none font-mono"
                    placeholder="Escriba el mensaje para sus clientes..." />
                <div class="flex justify-between px-1">
                    <span v-if="errMensaje" class="text-[0.72rem] font-bold text-red-600">⚠ {{ errMensaje }}</span>
                    <span class="text-[0.65rem] font-semibold text-gray-400 ml-auto">{{ formData.Mensaje.length }}
                        caracteres</span>
                </div>
            </div>

            <!-- Error general -->
            <div v-if="errGeneral"
                class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                ⚠ {{ errGeneral }}
            </div>

            <!-- Acciones -->
            <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button @click="abrirVistaPrevia"
                    :disabled="!puedePrevisualizar"
                    class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    Vista previa
                </button>
                <button v-permission="'ENVIAR-CORREOS'" @click="enviarCorreo" :disabled="enviando"
                    class="flex-[2] flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <div v-if="enviando"
                        class="w-[13px] h-[13px] flex-shrink-0 border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin" />
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    {{ enviando ? 'Enviando...' : 'Enviar correo' }}
                </button>
            </div>
        </div>

        <!-- ── MODAL VISTA PREVIA ── -->
        <Transition name="modal">
            <div v-if="modalPreview"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div
                    class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[560px] flex flex-col overflow-hidden max-h-[calc(100vh-32px)]">
                    <!-- Head -->
                    <div
                        class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15] flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-xl bg-[#7FD344]/20 border border-[#7FD344]/30 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[0.9rem] font-extrabold text-white">Vista previa del correo</p>
                                <p class="text-[0.65rem] text-white/50 font-semibold">Así verán el mensaje los
                                    clientes</p>
                            </div>
                        </div>
                        <button @click="modalPreview = false"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto flex flex-col gap-0 [scrollbar-width:thin]">
                        <!-- Banner asunto -->
                        <div class="bg-[#0D291C] px-5 py-4 flex items-center gap-3">
                            <div
                                class="w-8 h-8 rounded-lg bg-[#7FD344]/20 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[0.65rem] font-bold text-white/50 uppercase tracking-wide">Asunto</p>
                                <p class="text-[0.85rem] font-black text-white">{{ formData.Asunto || 'Sin asunto' }}</p>
                            </div>
                        </div>

                        <!-- Sedes seleccionadas -->
                        <div class="bg-[#f0fdf4] border-b border-[#299261]/20 px-5 py-3">
                            <p class="text-[0.65rem] font-bold text-[#299261] uppercase tracking-wide mb-1.5">
                                Estacionamientos seleccionados
                            </p>
                            <div class="flex flex-wrap gap-1.5">
                                <span v-for="id in formData.IdEstacionamientos" :key="id"
                                    class="text-[0.62rem] font-black px-2 py-[3px] rounded-full bg-[#0D291C] text-[#7FD344]">
                                    {{ nombreSede(id) }}
                                </span>
                            </div>
                        </div>

                        <!-- Contenido HTML -->
                        <div class="px-5 py-5">
                            <div class="prose prose-sm max-w-none text-[#0D291C]"
                                v-html="mensajeSanitizado || '<p class=\'text-gray-400 italic\'>Sin contenido</p>'" />
                        </div>

                        <!-- Footer branding -->
                        <div class="px-5 py-4 bg-gray-50 border-t border-gray-200">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded-md bg-[#0D291C] flex items-center justify-center">
                                    <span class="text-[0.55rem] font-black text-[#7FD344]">C</span>
                                </div>
                                <span class="text-[0.7rem] font-bold text-gray-400">Confy — Comunicaciones</span>
                            </div>
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200 flex-shrink-0">
                        <button @click="modalPreview = false"
                            class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            Cerrar
                        </button>
                        <button v-permission="'ENVIAR-CORREOS'" @click="modalPreview = false; enviarCorreo()"
                            :disabled="enviando"
                            class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <div v-if="enviando"
                                class="w-[13px] h-[13px] flex-shrink-0 border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin" />
                            {{ enviando ? 'Enviando...' : 'Confirmar envío' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showError, showSuccess } from '@/utils/swal'
import SedesService from '@/api/services/sedes.service'
import CorreosService from '@/api/services/correos.service'

// ── Estado ────────────────────────────────────────────────────────
const sedes = ref([])
const loadingSedes = ref(false)
const enviando = ref(false)
const modalPreview = ref(false)

const formData = ref({
    Asunto: '',
    Mensaje: '',
    IdEstacionamientos: [],
})

const errEstacionamientos = ref('')
const errAsunto = ref('')
const errMensaje = ref('')
const errGeneral = ref('')

// ── Computed ─────────────────────────────────────────────────────
const estacionamientosSeleccionados = computed(() => formData.value.IdEstacionamientos)

const puedePrevisualizar = computed(() => {
    return formData.value.Asunto.trim().length > 0 || formData.value.Mensaje.trim().length > 0
})

const nombreSede = (id) => {
    const s = sedes.value.find(s => String(s.IdEstacionamiento) === String(id))
    return s?.Nombre ?? id
}

// Sanitizar HTML básico para la vista previa (evita XSS)
const mensajeSanitizado = computed(() => {
    const raw = formData.value.Mensaje?.trim() ?? ''
    if (!raw) return ''
    // Permitir tags básicos de email, eliminar scripts/eventos peligrosos
    return raw
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
})

// ── Carga inicial ─────────────────────────────────────────────────
onMounted(async () => {
    loadingSedes.value = true
    try {
        const sedesRes = await SedesService.getAll()
        sedes.value = Array.isArray(sedesRes) ? sedesRes : (sedesRes?.data ?? [])
    } catch (e) {
        console.error('[sedes]', e)
    } finally {
        loadingSedes.value = false
    }
})

// ── Validación ────────────────────────────────────────────────────
const validarFormulario = () => {
    errEstacionamientos.value = ''
    errAsunto.value = ''
    errMensaje.value = ''
    errGeneral.value = ''

    let valido = true

    if (!formData.value.IdEstacionamientos?.length) {
        errEstacionamientos.value = 'Selecciona al menos un estacionamiento.'
        valido = false
    }
    if (!formData.value.Asunto?.trim()) {
        errAsunto.value = 'El asunto es obligatorio.'
        valido = false
    }
    if (!formData.value.Mensaje?.trim()) {
        errMensaje.value = 'El mensaje es obligatorio.'
        valido = false
    }

    return valido
}

// ── Vista previa ──────────────────────────────────────────────────
const abrirVistaPrevia = () => {
    if (!validarFormulario()) return
    modalPreview.value = true
}

// ── Enviar correo ─────────────────────────────────────────────────
const enviarCorreo = async () => {
    if (!validarFormulario()) return

    enviando.value = true
    try {
        const payload = {
            Asunto: formData.value.Asunto.trim(),
            Mensaje: formData.value.Mensaje.trim(),
            IdEstacionamientos: formData.value.IdEstacionamientos,
        }

        const res = await CorreosService.enviarMasivo(payload)

        if (res?.error) {
            showError({ status: res.status, data: res.data })
            return
        }

        const destinatarios = res?.data?.destinatarios ?? 0
        const IdCorreo = res?.data?.IdCorreo ?? '—'

        if (destinatarios === 0) {
            showSuccess(
                'Correo creado',
                'No se encontraron personas autorizadas con email en los estacionamientos seleccionados.'
            )
        } else {
            showSuccess(
                'Correo encolado exitosamente',
                `Se enviará a ${destinatarios} destinatario${destinatarios > 1 ? 's' : ''}. ID: ${IdCorreo}`
            )
        }

        // Limpiar formulario
        formData.value = {
            Asunto: '',
            Mensaje: '',
            IdEstacionamientos: [],
        }
        modalPreview.value = false
    } catch (e) {
        errGeneral.value = 'Error inesperado al enviar el correo. Intenta nuevamente.'
    } finally {
        enviando.value = false
    }
}
</script>

<style scoped>
.modal-enter-active {
    transition: opacity 0.2s ease
}

.modal-leave-active {
    transition: opacity 0.15s ease
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0
}
</style>
