<template>
    <div class="login-root">
        <div class="blob blob-1" />
        <div class="blob blob-2" />

        <div class="login-card">
            <!-- Panel izquierdo: Marca -->
            <div class="brand-side">
                <div class="brand-inner">
                    <!-- <img src="@/assets/img/confy-blanco.png" alt="Confy" class="brand-logo" /> -->
                    <div class="brand-copy">
                        <h2>Bienvenido<br />de vuelta</h2>
                        <p>Plataforma de gestión<br />Digital 6G</p>
                    </div>
                </div>
                <img src="@/assets/img/locoshort.png" alt="" class="brand-illustration" />

            </div>

            <!-- Panel derecho: Formulario -->
            <div class="form-side">
                <div class="top-accent" />

                <!-- Logo móvil -->
                <img src="@/assets/img/confy.png" alt="Confy" class="mobile-logo" />

                <div class="form-inner">
                    <div class="form-header">
                        <span class="form-badge">Acceso seguro</span>
                        <h1>Inicio de Sesión</h1>
                        <p>Ingresa tus credenciales para continuar</p>
                    </div>

                    <div class="fields">
                        <!-- Documento -->
                        <div class="field-group">
                            <label for="document">Documento</label>
                            <div class="input-wrap" :class="{ error: auth.errorMsg }">
                                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input v-model="documento" id="document" type="text" placeholder="Número de documento"
                                    @keyup.enter="handleLogin" autocomplete="username" />
                            </div>
                        </div>

                        <!-- Contraseña -->
                        <div class="field-group">
                            <label for="password">Contraseña</label>
                            <div class="input-wrap" :class="{ error: auth.errorMsg }">
                                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input v-model="password" id="password" :type="verPassword ? 'text' : 'password'"
                                    placeholder="••••••••" @keyup.enter="handleLogin" autocomplete="current-password" />
                                <button type="button" @click="verPassword = !verPassword" class="eye-btn" tabindex="-1">
                                    <svg v-if="!verPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" viewBox="0 0 24 24">
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Olvidé mi contraseña -->
                        <div class="text-center -mt-1">
                            <router-link to="/forgot-password"
                                style="color:#299261;font-size:0.78rem;font-weight:700;text-decoration:none;"
                                onmouseover="this.style.textDecoration='underline'"
                                onmouseout="this.style.textDecoration='none'">
                                ¿Olvidaste tu contraseña?
                            </router-link>
                        </div>

                        <!-- Error -->
                        <Transition name="error">
                            <div v-if="auth.errorMsg" class="error-alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#dc2626"
                                    viewBox="0 0 24 24" class="shrink-0">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span>{{ auth.errorMsg }}</span>
                            </div>
                        </Transition>

                        <!-- Registro -->
                        <p class="register-text">
                            ¿No tienes cuenta?
                            <router-link to="/seleccionsede">Regístrate</router-link>
                        </p>

                        <!-- Botón -->
                        <button @click="handleLogin" class="submit-btn">
                            <span v-if="auth.loading" class="spinner" />
                            <span>{{ auth.loading ? 'Ingresando...' : 'Ingresar' }}</span>
                            <svg v-if="!auth.loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                class="btn-arrow">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <img src="@/assets/img/confy-negro.png" alt="" class="form-deco-logo" />
            </div>
        </div>

        <!-- ── Botón tutorial fijo ── -->
        <button @click="showTutorial = true" class="tutorial-fab">
            <AppIcon name="info_i_green" :size="25" />
            <span>Ayuda</span>
        </button>

        <!-- ── Modal tutorial ── -->
        <Transition name="tut">
            <div v-if="showTutorial" class="tutorial-overlay" @click.self="showTutorial = false">
                <div class="tutorial-card">

                    <!-- Header -->
                    <div class="tutorial-header">
                        <div class="tutorial-header-icon">
                            <AppIcon name="info_i" :size="18" />
                        </div>
                        <div class="tutorial-header-text">
                            <p class="tutorial-title">Guía de acceso</p>
                            <p class="tutorial-subtitle">¿Cómo usar esta pantalla?</p>
                        </div>
                        <button @click="showTutorial = false" class="tutorial-close">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="tutorial-body">

                        <div class="tutorial-divider">Opciones Principales</div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon" style="background:#f0faf4;border-color:#c8e6c9;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#299261" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">

                                <p class="tutorial-step-title">
                                    <!-- <div class="tutorial-step-num">1</div> -->
                                    Documento
                                </p>
                                <p class="tutorial-step-desc">Ingresa tu número de cédula o documento de identidad
                                    registrado en la plataforma.</p>
                            </div>
                        </div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon" style="background:#f0faf4;border-color:#c8e6c9;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#299261" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <rect width="18" height="11" x="3" y="11" rx="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">
                                    Contraseña</p>
                                <p class="tutorial-step-desc">Ingresa la contraseña asociada a tu cuenta. Usa el ojo
                                    para mostrarla u ocultarla.</p>
                            </div>
                        </div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon" style="background:#232b3a14;border-color:#232b3a22;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#232B3A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">
                                    Ingresar</p>
                                <p class="tutorial-step-desc">Presiona este el botón "ingresar" para acceder a tu cuenta
                                    con las
                                    credenciales ingresadas.</p>
                            </div>
                        </div>

                        <div class="tutorial-divider">Opciones adicionales</div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon"
                                style="background:#eff6ff;border-color:#bfdbfe;margin-left:0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <path d="M12 17h.01" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">¿Olvidaste tu contraseña?</p>
                                <p class="tutorial-step-desc">Si no recuerdas tu contraseña, haz clic en el boton
                                    "¿Olvidaste tu contraseña?" para
                                    recuperarla por correo electrónico.</p>
                            </div>
                        </div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon"
                                style="background:#f5f3ff;border-color:#ddd6fe;margin-left:0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#5b21b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <line x1="19" y1="8" x2="19" y2="14" />
                                    <line x1="22" y1="11" x2="16" y2="11" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">Regístrate</p>
                                <p class="tutorial-step-desc">¿No tienes cuenta aún? Crea una nueva cuenta en la
                                    plataforma desde aquí.</p>
                            </div>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div class="tutorial-footer">
                        <button @click="showTutorial = false" class="tutorial-btn-close">Entendido</button>
                    </div>

                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const documento = ref('')
const password = ref('')
const verPassword = ref(false)
const showTutorial = ref(false)

async function handleLogin() {
    if (!documento.value || !password.value) return
    const ruta = await auth.login(documento.value, password.value)
    if (ruta) router.push(ruta)
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.login-root {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    background-color: #0D291C;
    overflow: hidden;
    position: relative;
    font-family: 'Funnel Display', 'Roboto', sans-serif;
    padding: 24px 20px;
    box-sizing: border-box;
}

/* ── Background blobs ─────────────────────────── */
.blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    z-index: 0;
    pointer-events: none;
}

.blob-1 {
    width: 520px;
    height: 520px;
    background: radial-gradient(circle, rgba(41, 146, 97, 0.28) 0%, transparent 70%);
    top: -160px;
    left: -160px;
}

.blob-2 {
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(127, 211, 68, 0.18) 0%, transparent 70%);
    bottom: -110px;
    right: -110px;
}

/* ── Card ─────────────────────────────────────── */
.login-card {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: row;
    width: 94%;
    max-width: 960px;
    border-radius: 28px;
    overflow: hidden;
    box-shadow:
        0 30px 70px rgba(0, 0, 0, 0.55),
        0 0 0 1px rgba(255, 255, 255, 0.04);
    animation: cardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(26px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* ── Brand side ───────────────────────────────── */
.brand-side {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    padding: 44px 36px;
    background: linear-gradient(155deg, #1b4e32 0%, #0D291C 100%);
    width: 44%;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
}

.brand-inner {
    position: relative;
    z-index: 2;
}

.brand-logo {
    width: 110px;
    margin-bottom: 30px;
}

.brand-copy h2 {
    color: #fff;
    font-size: 1.65rem;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.03em;
    margin-bottom: 10px;
}

.brand-copy p {
    color: rgba(127, 211, 68, 0.6);
    font-size: 0.84rem;
    line-height: 1.55;
}

.brand-illustration {
    width: 100%;
    max-width: 100px;
    align-self: center;
    position: relative;
    z-index: 2;
}



/* ── Form side ────────────────────────────────── */
.form-side {
    flex: 1;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 44px;
    position: relative;
    overflow: hidden;
    min-height: 540px;
}

.top-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #299261, #7FD344 50%, #299261);
}

.mobile-logo {
    display: block;
    width: 88px;
    margin-bottom: 28px;
}

.form-inner {
    width: 100%;
    max-width: 360px;
}

/* ── Form header ──────────────────────────────── */
.form-header {
    margin-bottom: 32px;
}

.form-badge {
    display: inline-block;
    color: #299261;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    margin-bottom: 12px;
}

.form-header h1 {
    color: #232B3A;
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin-bottom: 7px;
}

.form-header p {
    color: #a0aec0;
    font-size: 0.84rem;
    line-height: 1.5;
}

/* ── Fields ───────────────────────────────────── */
.fields {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.field-group label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #232B3A;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

/* ── Inputs ───────────────────────────────────── */
.input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.field-icon {
    position: absolute;
    left: 14px;
    width: 17px;
    height: 17px;
    color: #b0bec5;
    transition: color 0.2s ease;
    pointer-events: none;
    flex-shrink: 0;
}

.input-wrap input {
    width: 100%;
    padding: 14px 16px 14px 42px;
    background: #f7f8fa;
    border: 1.5px solid #e8ecf0;
    border-radius: 14px;
    font-size: 0.95rem;
    font-family: 'Funnel Display', 'Roboto', sans-serif;
    color: #232B3A;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.input-wrap input::placeholder {
    color: #c8d0da;
}

.input-wrap:focus-within .field-icon {
    color: #299261;
}

.input-wrap input:focus {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.1);
    background: #fff;
}

.input-wrap.error input {
    border-color: #fca5a5;
}

.eye-btn {
    position: absolute;
    right: 11px;
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    color: #b0bec5;
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
}

.eye-btn:hover {
    color: #299261;
}

/* ── Error alert ──────────────────────────────── */
.error-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 12px;
}

.error-alert span {
    color: #dc2626;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
}

/* ── Register link ────────────────────────────── */
.register-text {
    font-size: 0.82rem;
    color: #9ca3af;
    text-align: center;
}

.register-text a {
    color: #299261;
    font-weight: 700;
    text-decoration: none;
    transition: opacity 0.2s;
}

.register-text a:hover {
    text-decoration: underline;
}

/* ── Submit button ────────────────────────────── */
.submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 13px 20px;
    background: #232B3A;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 0.875rem;
    font-weight: 700;
    font-family: 'Funnel Display', 'Roboto', sans-serif;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
    letter-spacing: 0.01em;
}

.submit-btn:hover:not(:disabled) {
    background: #299261;
    box-shadow: 0 8px 24px rgba(41, 146, 97, 0.38);
    transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.38;
    cursor: not-allowed;
}

.btn-arrow {
    transition: transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) .btn-arrow {
    transform: translateX(4px);
}

/* ── Decorative bottom logo ───────────────────── */
.form-deco-logo {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 72px;
    opacity: 0.1;
    pointer-events: none;
}

/* ── Spinner ──────────────────────────────────── */
.spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Error transition ─────────────────────────── */
.error-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.error-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.error-enter-from {
    opacity: 0;
    transform: translateY(-6px);
}

.error-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* ── Reduced motion ───────────────────────────── */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* ── Responsive ───────────────────────────────── */
@media (min-width: 768px) {
    .brand-side {
        display: flex;
        justify-content: space-around;
    }

    .mobile-logo {
        display: none;
    }
}

@media (max-width: 767px) {
    .login-card {
        flex-direction: column;
        max-width: 420px;
        width: 95%;
    }

    .form-side {
        padding: 36px 28px;
        min-height: auto;
    }
}

@media (max-width: 400px) {
    .form-side {
        padding: 28px 20px;
    }

    .form-header h1 {
        font-size: 1.5rem;
    }
}
</style>
