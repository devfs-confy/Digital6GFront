<template>
    <div class="flex flex-col gap-6 min-h-full pb-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-4">
            <div class="w-[80px]">
                <button @click="$router.back()" class="back-btn-3d">Volver</button>
            </div>
            <h2 class="text-xl font-black text-[#232B3A]">Información Personal</h2>
            <div class="w-[80px]" />
        </div>

        <!-- Avatar + nombre -->
        <div class="profile-hero">
            <div class="profile-avatar">
                <span class="profile-avatar__initials">{{ iniciales }}</span>
                <div class="profile-avatar__ring" />
            </div>
            <div class="profile-hero__info">
                <h3 class="profile-hero__name">{{ form.nombre }} {{ form.apellido }}</h3>
                <span class="profile-hero__doc">{{ form.tipoDoc }} · {{ form.documento }}</span>
            </div>
            <div class="profile-hero__badge">
                <span class="profile-badge-dot" />
                Cliente activo
            </div>
        </div>

        <!-- Secciones -->
        <div class="sections-grid">

            <!-- Datos personales -->
            <div class="section-card card-anim" style="animation-delay:0s">
                <div class="section-header">
                    <div class="section-icon section-icon--green">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="section-title">Datos personales</h4>
                        <p class="section-sub">Nombre, apellido e identificación</p>
                    </div>
                </div>

                <div class="fields-grid">
                    <div class="field-wrap">
                        <label class="field-lbl">Nombre</label>
                        <div class="field-box" :class="{ 'field-box--editing': editing.nombre }">
                            <input v-model="form.nombre" :disabled="!editing.nombre" class="field-input"
                                placeholder="Tu nombre" />
                            <!-- <button @click="toggleEdit('nombre')" class="field-edit-btn">
                                <span v-if="!editing.nombre" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button> -->
                        </div>
                    </div>

                    <div class="field-wrap">
                        <label class="field-lbl">Apellido</label>
                        <div class="field-box" :class="{ 'field-box--editing': editing.apellido }">
                            <input v-model="form.apellido" :disabled="!editing.apellido" class="field-input"
                                placeholder="Tu apellido" />
                            <!-- <button @click="toggleEdit('apellido')" class="field-edit-btn">
                                <span v-if="!editing.apellido" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button> -->
                        </div>
                    </div>

                    <!-- <div class="field-wrap">
                        <label class="field-lbl">Tipo de documento</label>
                        <div class="field-box" :class="{ 'field-box--editing': editing.tipoDoc }">
                            <select v-model="form.tipoDoc" :disabled="!editing.tipoDoc" class="field-input">
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="CE">Cédula de extranjería</option>
                                <option value="PA">Pasaporte</option>
                                <option value="TI">Tarjeta de identidad</option>
                            </select>
                            <button @click="toggleEdit('tipoDoc')" class="field-edit-btn">
                                <span v-if="!editing.tipoDoc" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button>
                        </div>
                    </div> -->

                    <div class="field-wrap">
                        <label class="field-lbl">Número de documento</label>
                        <div class="field-box" :class="{ 'field-box--editing': editing.documento }">
                            <input v-model="form.documento" :disabled="!editing.documento" class="field-input"
                                placeholder="Número de documento" />
                            <!-- <button @click="toggleEdit('documento')" class="field-edit-btn">
                                <span v-if="!editing.documento" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contacto -->
            <div class="section-card card-anim" style="animation-delay:0.08s">
                <div class="section-header">
                    <div class="section-icon section-icon--blue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="section-title">Contacto</h4>
                        <p class="section-sub">Correo electrónico y teléfono</p>
                    </div>
                </div>

                <div class="fields-grid">
                    <div class="field-wrap field-wrap--full">
                        <label class="field-lbl">Correo electrónico</label>
                        <div class="field-box" :class="{ 'field-box--editing': editing.correo }">
                            <input v-model="form.correo" :disabled="!editing.correo" type="email" class="field-input"
                                placeholder="correo@ejemplo.com" />
                            <button @click="toggleEdit('correo')" class="field-edit-btn">
                                <span v-if="!editing.correo" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button>
                        </div>
                    </div>

                    <div class="field-wrap field-wrap--full">
                        <label class="field-lbl">Teléfono</label>
                        <div class="field-box" :class="{ 'field-box--editing': editing.telefono }">
                            <span class="field-prefix">+57</span>
                            <input v-model="form.telefono" :disabled="!editing.telefono" type="tel"
                                class="field-input field-input--prefixed" placeholder="300 000 0000" maxlength="10" />
                            <button @click="toggleEdit('telefono')" class="field-edit-btn">
                                <span v-if="!editing.telefono" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contraseña -->
            <div class="section-card section-card--pass card-anim" style="animation-delay:0.16s">
                <div class="section-header">
                    <div class="section-icon section-icon--dark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="section-title">Contraseña</h4>
                        <p class="section-sub">Cambia tu contraseña de acceso</p>
                    </div>
                </div>

                <!-- Locked -->
                <div v-if="!showPassForm" class="pass-locked">
                    <p class="pass-locked__text">••••••••••••</p>
                    <button @click="showPassForm = true" class="pass-change-btn">
                        Cambiar contraseña
                    </button>
                </div>

                <!-- Formulario -->
                <div v-else class="fields-grid">
                    <div class="field-wrap field-wrap--full">
                        <label class="field-lbl">Contraseña actual</label>
                        <div class="field-box field-box--editing">
                            <input v-model="passForm.actual" :type="showPass.actual ? 'text' : 'password'"
                                class="field-input" placeholder="Tu contraseña actual" />
                            <button @click="showPass.actual = !showPass.actual" class="field-edit-btn">
                                <span v-if="showPass.actual" v-html="visibility"></span>
                                <span v-else v-html="visibilityoff"></span>
                            </button>
                        </div>
                    </div>

                    <div class="field-wrap field-wrap--full">
                        <label class="field-lbl">Nueva contraseña</label>
                        <div class="field-box field-box--editing">
                            <input v-model="passForm.nueva" :type="showPass.nueva ? 'text' : 'password'"
                                class="field-input" placeholder="Mínimo 8 caracteres" />
                            <button @click="showPass.nueva = !showPass.nueva" class="field-edit-btn">
                                <span v-if="showPass.nueva" v-html="visibility"></span>
                                <span v-else v-html="visibilityoff"></span>
                            </button>
                        </div>
                        <div v-if="passForm.nueva" class="pass-strength">
                            <div class="pass-strength__bars">
                                <div v-for="n in 4" :key="n" class="pass-strength__bar"
                                    :class="passStrength >= n ? `pass-bar--${passStrengthLabel.key}` : 'pass-bar--empty'" />
                            </div>
                            <span class="pass-strength__label" :class="`pass-lbl--${passStrengthLabel.key}`">
                                {{ passStrengthLabel.text }}
                            </span>
                        </div>
                    </div>

                    <div class="field-wrap field-wrap--full">
                        <label class="field-lbl">Confirmar contraseña</label>
                        <div class="field-box"
                            :class="passForm.confirmar && !passMatch ? 'field-box--error' : 'field-box--editing'">
                            <input v-model="passForm.confirmar" :type="showPass.confirmar ? 'text' : 'password'"
                                class="field-input" placeholder="Repite la nueva contraseña" />
                            <button @click="showPass.confirmar = !showPass.confirmar" class="field-edit-btn">
                                <span v-if="showPass.confirmar" v-html="visibility"></span>
                                <span v-else v-html="visibilityoff"></span>
                            </button>
                        </div>
                        <p v-if="passForm.confirmar && !passMatch" class="field-error">
                            Las contraseñas no coinciden
                        </p>
                    </div>

                    <div class="field-wrap field-wrap--full flex gap-3">
                        <button @click="cancelarPass" class="btn-cancel">Cancelar</button>
                        <button @click="guardarPass" :disabled="!passValida" class="btn-save">
                            Guardar contraseña
                        </button>
                    </div>
                </div>
            </div>

        </div>

        <!-- Barra guardar cambios (aparece si hay cambios pendientes) -->
        <div v-if="hayCambios" class="save-bar card-anim">
            <div class="save-bar__text">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {{ errCambios || 'Tienes cambios sin guardar' }}
            </div>
            <div class="flex gap-3">
                <button @click="descartarCambios" class="btn-cancel" :disabled="guardandoCambios">Descartar</button>
                <button @click="guardarCambios" class="btn-save" :disabled="guardandoCambios">
                    <span v-if="guardandoCambios">Guardando...</span>
                    <span v-else>Guardar cambios</span>
                </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import icoeditsquare from '@/assets/img/edit_square.svg?raw'
import visibility from '@/assets/img/visibility.svg?raw'
import visibilityoff from '@/assets/img/visibility_off.svg?raw'
import ClientService from '@/api/services/client.service'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// ── Datos del usuario ──────────────────────────────────────────────
const form = reactive({
    nombre: '',
    apellido: '',
    tipoDoc: 'CC',
    documento: '',
    correo: '',
    telefono: '',
})

const original = reactive({ ...form })

onMounted(() => {
    const u = auth.user
    if (!u) return
    Object.assign(form, {
        nombre: u.nombres ?? '',
        apellido: u.apellidos ?? '',
        tipoDoc: 'CC',
        documento: u.documento ?? '',
        correo: u.email ?? '',
        telefono: u.telefono ?? '',
    })
    Object.assign(original, { ...form })
})

// ── Edición campo a campo ──────────────────────────────────────────
const editing = reactive({
    nombre: false, apellido: false,
    tipoDoc: false, documento: false,
    correo: false, telefono: false,
})

const toggleEdit = (campo) => { editing[campo] = !editing[campo] }

// ── Computed ───────────────────────────────────────────────────────
const iniciales = computed(() =>
    `${form.nombre?.[0] ?? ''}${form.apellido?.[0] ?? ''}`.toUpperCase()
)

// Solo correo y teléfono son editables vía API
const hayCambios = computed(() =>
    form.correo !== original.correo || form.telefono !== original.telefono
)

// ── Guardar / descartar cambios ────────────────────────────────────
const guardandoCambios = ref(false)
const errCambios = ref('')

const descartarCambios = () => {
    form.correo = original.correo
    form.telefono = original.telefono
    editing.correo = false
    editing.telefono = false
    errCambios.value = ''
}

const guardarCambios = async () => {
    errCambios.value = ''
    guardandoCambios.value = true
    try {
        const dto = {
            Email: form.correo,
            Telefono: form.telefono,
        }
        const res = await ClientService.updateOwnProfile(dto)

        if (res?.error === true || res?.success === false) {
            const msg = res?.data?.message ?? res?.message ?? 'Error al guardar.'
            errCambios.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }

        // Actualiza snapshot y store
        original.correo = form.correo
        original.telefono = form.telefono
        if (auth.user) {
            auth.user.Email = form.correo
            auth.user.Telefono = form.telefono
        }
        editing.correo = false
        editing.telefono = false
    } catch (e) {
        const msg = e.response?.data?.message
        errCambios.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar.')
    } finally {
        guardandoCambios.value = false
    }
}

// ── Contraseña ─────────────────────────────────────────────────────
const showPassForm = ref(false)
const passForm = reactive({ actual: '', nueva: '', confirmar: '' })
const showPass = reactive({ actual: false, nueva: false, confirmar: false })

const passMatch = computed(() => passForm.nueva === passForm.confirmar)
const passValida = computed(() =>
    passForm.actual.length > 0 && passForm.nueva.length >= 8 && passMatch.value
)

const passStrength = computed(() => {
    const p = passForm.nueva
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
})

const passStrengthLabel = computed(() => {
    const map = [
        { key: 'weak', text: 'Muy débil' },
        { key: 'weak', text: 'Débil' },
        { key: 'fair', text: 'Regular' },
        { key: 'good', text: 'Buena' },
        { key: 'strong', text: 'Muy segura' },
    ]
    return map[passStrength.value] ?? map[0]
})

const cancelarPass = () => {
    showPassForm.value = false
    Object.assign(passForm, { actual: '', nueva: '', confirmar: '' })
    Object.assign(showPass, { actual: false, nueva: false, confirmar: false })
}

const guardarPass = async () => {
    if (!passValida.value) return
    // TODO: conectar endpoint de cambio de contraseña cuando esté disponible
    console.log('Cambiar contraseña:', passForm.actual, '→', passForm.nueva)
    cancelarPass()
}
</script>

<style scoped>
.back-btn-3d {
    font-size: 0.78rem;
    font-weight: 900;
    color: #0D291C;
    background-color: #7FD344;
    border: 2px solid #000;
    border-radius: 999px;
    padding: 7px 16px;
    cursor: pointer;
    box-shadow: 0 4px 0 #000;
    transition: transform 0.1s, box-shadow 0.1s;
    white-space: nowrap;
}

.back-btn-3d:hover {
    background-color: #6fc23a;
}

.back-btn-3d:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #000;
}

/* ── Hero ─────────────────────────────────────────────────────────── */
.profile-hero {
    background-color: #0D291C;
    border-radius: 24px;
    padding: 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
}

.profile-hero::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(127, 211, 68, 0.07);
}

.profile-hero::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -20px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(127, 211, 68, 0.05);
}

.profile-avatar {
    position: relative;
    flex-shrink: 0;
}

.profile-avatar__initials {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    background-color: #7FD344;
    color: #0D291C;
    font-size: 1.6rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
}

.profile-avatar__ring {
    position: absolute;
    inset: -4px;
    border-radius: 26px;
    border: 2px solid rgba(127, 211, 68, 0.3);
    pointer-events: none;
}

.profile-hero__info {
    flex: 1;
    min-width: 0;
}

.profile-hero__name {
    font-size: 1.25rem;
    font-weight: 900;
    color: white;
    line-height: 1.2;
}

.profile-hero__doc {
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 4px;
    display: block;
}

.profile-hero__badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background-color: rgba(127, 211, 68, 0.12);
    border: 1.5px solid rgba(127, 211, 68, 0.25);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.72rem;
    font-weight: 800;
    color: #7FD344;
    white-space: nowrap;
}

.profile-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #7FD344;
    animation: blink 1.6s infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
}

/* ── Grid secciones ───────────────────────────────────────────────── */
.sections-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

@media (max-width: 700px) {
    .sections-grid {
        grid-template-columns: 1fr;
    }
}

@keyframes card-anim-kf {
    from {
        opacity: 0;
        transform: translateY(14px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.card-anim {
    animation: card-anim-kf 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

/* ── Tarjeta sección ──────────────────────────────────────────────── */
.section-card {
    background-color: white;
    border-radius: 22px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    border: 2px solid #f3f4f6;
    box-shadow: 0 4px 0 #e8f5e9;
}

.section-card--pass {
    grid-column: 1 / -1;
    border-color: #e8f5e9;
    box-shadow: 0 4px 0 #c8e6c9;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.section-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.section-icon--green {
    background-color: #dcfce7;
    color: #16a34a;
}

.section-icon--blue {
    background-color: #dbeafe;
    color: #2563eb;
}

.section-icon--dark {
    background-color: #0D291C;
    color: #7FD344;
}

.section-title {
    font-size: 0.95rem;
    font-weight: 900;
    color: #0D291C;
}

.section-sub {
    font-size: 0.68rem;
    color: #9ca3af;
    font-weight: 600;
    margin-top: 2px;
}

/* ── Campos ───────────────────────────────────────────────────────── */
.fields-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
}

@media (max-width: 560px) {
    .fields-grid {
        grid-template-columns: 1fr;
    }
}

.field-wrap {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field-wrap--full {
    grid-column: 1 / -1;
}

.field-lbl {
    font-size: 0.62rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9ca3af;
    padding-left: 4px;
}

.field-box {
    display: flex;
    align-items: center;
    background-color: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 14px;
    padding: 2px 4px 2px 14px;
    transition: border-color 0.18s, box-shadow 0.18s, background-color 0.18s;
}

.field-box--editing {
    border-color: #299261;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.1);
}

.field-box--error {
    border-color: #dc2626;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.field-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.88rem;
    font-weight: 700;
    color: #0D291C;
    padding: 9px 0;
    min-width: 0;
    width: 100%;
}

.field-input:disabled {
    color: #6b7280;
    cursor: default;
}

.field-input--prefixed {
    padding-left: 6px;
}

.field-prefix {
    font-size: 0.82rem;
    font-weight: 800;
    color: #9ca3af;
    padding-right: 8px;
    border-right: 1.5px solid #e5e7eb;
    white-space: nowrap;
    flex-shrink: 0;
}

.field-edit-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    flex-shrink: 0;
    transition: background-color 0.15s;
}

.field-edit-btn:hover {
    background-color: #f3f4f6;
}

.field-error {
    font-size: 0.65rem;
    font-weight: 700;
    color: #dc2626;
    padding-left: 4px;
}

/* Contraseña bloqueada */
.pass-locked {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background-color: #f9fafb;
    border-radius: 16px;
    padding: 16px 20px;
    flex-wrap: wrap;
}

.pass-locked__text {
    font-size: 1.4rem;
    letter-spacing: 0.15em;
    color: #9ca3af;
    font-weight: 900;
}

.pass-change-btn {
    font-size: 0.78rem;
    font-weight: 800;
    color: #0D291C;
    background-color: #7FD344;
    border: 2px solid #000;
    border-radius: 999px;
    padding: 8px 18px;
    cursor: pointer;
    box-shadow: 0 3px 0 #000;
    transition: transform 0.1s, box-shadow 0.1s;
}

.pass-change-btn:hover {
    background-color: #6fc23a;
}

.pass-change-btn:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #000;
}

/* Fortaleza de contraseña */
.pass-strength {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 2px 0;
}

.pass-strength__bars {
    display: flex;
    gap: 4px;
    flex: 1;
}

.pass-strength__bar {
    flex: 1;
    height: 5px;
    border-radius: 999px;
    transition: background-color 0.3s;
}

.pass-bar--empty {
    background-color: #e5e7eb;
}

.pass-bar--weak {
    background-color: #dc2626;
}

.pass-bar--fair {
    background-color: #f59e0b;
}

.pass-bar--good {
    background-color: #3b82f6;
}

.pass-bar--strong {
    background-color: #16a34a;
}

.pass-strength__label {
    font-size: 0.65rem;
    font-weight: 800;
    white-space: nowrap;
}

.pass-lbl--weak {
    color: #dc2626;
}

.pass-lbl--fair {
    color: #d97706;
}

.pass-lbl--good {
    color: #2563eb;
}

.pass-lbl--strong {
    color: #16a34a;
}

/* ── Save bar ─────────────────────────────────────────────────────── */
.save-bar {
    position: sticky;
    bottom: 0;
    background-color: #0D291C;
    border-radius: 20px;
    padding: 16px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    box-shadow: 0 -4px 24px rgba(13, 41, 28, 0.25);
    border: 2px solid rgba(127, 211, 68, 0.2);
}

.save-bar__text {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    color: white;
}

/* Botones */
.btn-cancel {
    font-size: 0.78rem;
    font-weight: 800;
    color: #374151;
    background-color: white;
    border: 2px solid #000;
    border-radius: 999px;
    padding: 9px 20px;
    cursor: pointer;
    box-shadow: 0 3px 0 #000;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-cancel:hover {
    background-color: #f3f4f6;
}

.btn-cancel:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #000;
}

.btn-save {
    font-size: 0.78rem;
    font-weight: 800;
    color: #0D291C;
    background-color: #7FD344;
    border: 2px solid #000;
    border-radius: 999px;
    padding: 9px 20px;
    cursor: pointer;
    box-shadow: 0 3px 0 #000;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-save:hover {
    background-color: #6fc23a;
}

.btn-save:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #000;
}

.btn-save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}
</style>