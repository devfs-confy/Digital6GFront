<template>
  <div class="relative min-h-screen w-full bg-d6g-dark flex items-center justify-center px-4 py-8 overflow-hidden"
    style="font-family: Funnel Display">
    <!-- Blobs -->
    <div class="fixed rounded-full pointer-events-none z-0 blur-[90px] w-[520px] h-[520px] -top-[160px] -left-[160px]"
      style="background:radial-gradient(circle,rgba(41,146,97,0.28) 0%,transparent 70%)" />
    <div
      class="fixed rounded-full pointer-events-none z-0 blur-[90px] w-[420px] h-[420px] -bottom-[110px] -right-[110px]"
      style="background:radial-gradient(circle,rgba(127,211,68,0.18) 0%,transparent 70%)" />

    <!-- Card -->
    <div class="relative z-10 flex w-[92%] max-w-[860px] rounded-[28px] overflow-hidden"
      style="box-shadow:0 30px 70px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.04);animation:cardIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards">
      <!-- Brand side (desktop) -->
      <div class="hidden md:flex flex-col justify-between w-[44%] flex-shrink-0 px-9 py-11"
        style="background:linear-gradient(155deg,#1b4e32 0%,#0D291C 100%)">
        <div>
          <span class="block text-[0.67rem] font-bold tracking-[0.13em] uppercase mb-3"
            style="color:rgba(127,211,68,0.7)">
            Recuperación
          </span>
          <h2 class="text-white text-[1.65rem] font-extrabold leading-tight tracking-tight mb-2.5">
            Recupera<br />tu acceso
          </h2>
          <p class="text-[0.84rem] leading-relaxed" style="color:rgba(127,211,68,0.6)">
            Te enviaremos un código<br />de verificación a tu correo
          </p>
        </div>
        <img src="@/assets/img/locoshort.png" alt="" class="w-[100px] self-center" />
      </div>

      <!-- Form side -->
      <div
        class="flex-1 bg-white flex flex-col items-center justify-center px-11 py-[52px] max-md:px-7 max-md:py-9 relative overflow-hidden min-h-[540px]">
        <!-- Top accent -->
        <div class="absolute top-0 left-0 right-0 h-[3px]"
          style="background:linear-gradient(90deg,#299261,#7FD344 50%,#299261)" />

        <!-- Mobile logo -->
        <img src="@/assets/img/confy.png" alt="Confy" class="block md:hidden w-[88px] mb-7" />

        <div class="w-full max-w-[310px]">
          <Transition name="step-fade" mode="out-in">

            <!-- ── PASO 1: Documento ── -->
            <div v-if="step === 1" key="step1">
              <div class="mb-8">
                <span class="block text-[0.67rem] font-bold tracking-[0.13em] uppercase text-d6g-green mb-3">
                  Acceso seguro
                </span>
                <h1 class="text-[1.8rem] font-extrabold text-d6g-gray leading-tight tracking-tight mb-1.5">
                  Olvidé mi<br />contraseña
                </h1>
                <p class="text-slate-400 text-[0.84rem]">Por favor ingresa tu documento pimero para poder realizar la
                  recuperación
                </p>
              </div>

              <div class="flex flex-col gap-[18px]">
                <!-- Campo documento -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[0.7rem] font-bold text-d6g-gray tracking-[0.08em] uppercase">
                    Documento
                  </label>
                  <div class="relative flex items-center">
                    <svg class="absolute left-3 w-[15px] h-[15px] pointer-events-none transition-colors"
                      :class="errorMsg ? 'text-red-300' : 'text-slate-300'" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input v-model="documento" type="text" inputmode="numeric" placeholder="Número de documento"
                      @keyup.enter="handleSendCode"
                      class="w-full pl-[38px] pr-3.5 py-[11px] bg-slate-50 border-[1.5px] rounded-xl text-[0.875rem] text-d6g-gray outline-none transition-all placeholder:text-slate-300 focus:bg-white focus:border-d6g-green focus:shadow-[0_0_0_3px_rgba(41,146,97,0.1)]"
                      :class="errorMsg ? 'border-red-300' : 'border-slate-200'" />
                  </div>
                </div>

                <!-- Error -->
                <Transition name="err-slide">
                  <div v-if="errorMsg"
                    class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#dc2626" viewBox="0 0 24 24"
                      class="shrink-0">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span class="text-red-600 text-[0.75rem] font-medium leading-snug">{{ errorMsg }}</span>
                  </div>
                </Transition>

                <!-- Acciones inferiores -->
                <div class="flex items-center justify-between text-[0.82rem]">
                  <router-link to="/login"
                    class="text-slate-400 font-medium hover:text-d6g-gray no-underline transition-colors">
                    ← Volver al login
                  </router-link>
                  <button type="button" @click="goDirectToOtp" :disabled="!documento"
                    class="text-d6g-green font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:underline bg-transparent border-none cursor-pointer p-0 transition-colors">
                    Ya tengo un código
                  </button>
                </div>

                <!-- Botón enviar -->
                <button @click="handleSendCode" :disabled="loading || !documento"
                  class="submit-btn flex items-center justify-center gap-2 w-full py-[13px] px-5 bg-d6g-gray text-white rounded-[14px] text-[0.875rem] font-bold tracking-[0.01em] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <span v-if="loading"
                    class="w-[15px] h-[15px] border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>{{ loading ? 'Enviando...' : 'Enviar código' }}</span>
                  <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" class="btn-arrow">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- ── PASO 2: Código OTP ── -->
            <div v-else-if="step === 2" key="step2">
              <div class="mb-8">
                <span class="block text-[0.67rem] font-bold tracking-[0.13em] uppercase text-d6g-green mb-3">
                  Verificación
                </span>
                <h1 class="text-[1.8rem] font-extrabold text-d6g-gray leading-tight tracking-tight mb-1.5">
                  Código de<br />verificación
                </h1>
                <p class="text-slate-400 text-[0.84rem]">
                  Ingresa el código de 6 dígitos enviado a tu correo
                </p>
              </div>

              <div class="flex flex-col gap-5">
                <!-- Timer -->
                <div class="flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" class="shrink-0"
                    :class="skippedSend ? 'text-d6g-green' : 'text-slate-400'">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span v-if="skippedSend" class="text-[0.8rem] font-semibold text-d6g-green">
                    Código válido por 15 min desde su envío
                  </span>
                  <span v-else class="text-[0.8rem] font-semibold transition-colors"
                    :class="timeLeft > 60 ? 'text-slate-500' : timeLeft > 0 ? 'text-amber-500' : 'text-red-500'">
                    {{ timerDisplay }}
                    <span class="font-normal text-[0.75rem]">
                      — {{ timeLeft > 0 ? 'Código válido' : 'Código expirado' }}
                    </span>
                  </span>
                </div>

                <!-- Cuadritos OTP -->
                <div class="flex gap-2 justify-center">
                  <input v-for="(_, i) in 6" :key="i" :ref="el => { if (el) otpInputs[i] = el }" v-model="otpDigits[i]"
                    type="text" inputmode="numeric" maxlength="1" @input="onOtpInput(i, $event)"
                    @keydown="onOtpKeydown(i, $event)" @paste="onOtpPaste($event)"
                    class="w-11 h-14 text-center text-xl font-bold rounded-xl border-2 bg-slate-50 text-d6g-gray outline-none transition-all focus:ring-2 focus:ring-d6g-green/10"
                    :class="errorMsg && !otpDigits[i] ? 'border-red-300 bg-red-50/40'
                      : otpDigits[i] ? 'border-d6g-green bg-white'
                        : 'border-slate-200 focus:border-d6g-green focus:bg-white'
                      " />
                </div>

                <!-- Error -->
                <Transition name="err-slide">
                  <div v-if="errorMsg"
                    class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#dc2626" viewBox="0 0 24 24"
                      class="shrink-0">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span class="text-red-600 text-[0.75rem] font-medium leading-snug">{{ errorMsg }}</span>
                  </div>
                </Transition>

                <!-- Reenviar / cambiar doc -->
                <div class="flex items-center justify-between text-[0.8rem]">
                  <button @click="goBack"
                    class="text-slate-400 hover:text-d6g-gray transition-colors bg-transparent border-none cursor-pointer p-0 font-medium">
                    ← Cambiar documento
                  </button>
                  <button @click="handleResend" :disabled="loading || timeLeft > 0"
                    class="text-d6g-green font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:underline bg-transparent border-none cursor-pointer p-0 transition-colors">
                    Reenviar código
                  </button>
                </div>

                <!-- Botón verificar -->
                <button @click="handleVerifyCode"
                  :disabled="loading || !isOtpComplete || (!skippedSend && timeLeft === 0)"
                  class="submit-btn flex items-center justify-center gap-2 w-full py-[13px] px-5 bg-d6g-gray text-white rounded-[14px] text-[0.875rem] font-bold tracking-[0.01em] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <span v-if="loading"
                    class="w-[15px] h-[15px] border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>{{ loading ? 'Verificando...' : 'Verificar código' }}</span>
                  <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" class="btn-arrow">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- ── PASO 3: Nueva contraseña ── -->
            <div v-else-if="step === 3" key="step3">
              <div class="mb-8">
                <span class="block text-[0.67rem] font-bold tracking-[0.13em] uppercase text-d6g-green mb-3">
                  Último paso
                </span>
                <h1 class="text-[1.8rem] font-extrabold text-d6g-gray leading-tight tracking-tight mb-1.5">
                  Nueva<br />contraseña
                </h1>
                <p class="text-slate-400 text-[0.84rem]">Elige una contraseña segura para tu cuenta</p>
              </div>

              <div class="flex flex-col gap-[18px]">
                <!-- Nueva contraseña -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[0.7rem] font-bold text-d6g-gray tracking-[0.08em] uppercase">
                    Nueva contraseña
                  </label>
                  <div class="relative flex items-center">
                    <svg class="absolute left-3 w-[15px] h-[15px] pointer-events-none text-slate-300"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input v-model="newPassword" :type="showNew ? 'text' : 'password'" placeholder="••••••••"
                      @keyup.enter="handleResetPassword"
                      class="w-full pl-[38px] pr-10 py-[11px] bg-slate-50 border-[1.5px] rounded-xl text-[0.875rem] text-d6g-gray outline-none transition-all placeholder:text-slate-300 focus:bg-white focus:border-d6g-green focus:shadow-[0_0_0_3px_rgba(41,146,97,0.1)]"
                      :class="passwordMismatch ? 'border-red-300' : 'border-slate-200'" />
                    <button type="button" @click="showNew = !showNew"
                      class="absolute right-3 text-slate-400 hover:text-d6g-gray transition-colors bg-transparent border-none cursor-pointer p-0">
                      <svg v-if="!showNew" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Confirmar contraseña -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[0.7rem] font-bold text-d6g-gray tracking-[0.08em] uppercase">
                    Confirmar contraseña
                  </label>
                  <div class="relative flex items-center">
                    <svg class="absolute left-3 w-[15px] h-[15px] pointer-events-none text-slate-300"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="••••••••"
                      @keyup.enter="handleResetPassword"
                      class="w-full pl-[38px] pr-10 py-[11px] bg-slate-50 border-[1.5px] rounded-xl text-[0.875rem] text-d6g-gray outline-none transition-all placeholder:text-slate-300 focus:bg-white focus:border-d6g-green focus:shadow-[0_0_0_3px_rgba(41,146,97,0.1)]"
                      :class="passwordMismatch ? 'border-red-300' : 'border-slate-200'" />
                    <button type="button" @click="showConfirm = !showConfirm"
                      class="absolute right-3 text-slate-400 hover:text-d6g-gray transition-colors bg-transparent border-none cursor-pointer p-0">
                      <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    </button>
                  </div>
                  <!-- Mismatch hint -->
                  <Transition name="err-slide">
                    <span v-if="passwordMismatch" class="text-red-500 text-[0.72rem] font-medium mt-0.5">
                      Las contraseñas no coinciden
                    </span>
                  </Transition>
                </div>

                <!-- Error API -->
                <Transition name="err-slide">
                  <div v-if="errorMsg"
                    class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#dc2626" viewBox="0 0 24 24"
                      class="shrink-0">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span class="text-red-600 text-[0.75rem] font-medium leading-snug">{{ errorMsg }}</span>
                  </div>
                </Transition>

                <!-- Botón cambiar contraseña -->
                <button @click="handleResetPassword"
                  :disabled="loading || !newPassword || !confirmPassword || passwordMismatch"
                  class="submit-btn flex items-center justify-center gap-2 w-full py-[13px] px-5 bg-d6g-gray text-white rounded-[14px] text-[0.875rem] font-bold tracking-[0.01em] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <span v-if="loading"
                    class="w-[15px] h-[15px] border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>{{ loading ? 'Guardando...' : 'Cambiar contraseña' }}</span>
                  <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" class="btn-arrow">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

          </Transition>
        </div>

        <!-- Deco logo -->
        <img src="@/assets/img/confy-negro.png" alt=""
          class="absolute bottom-0 right-0 w-[72px] opacity-10 pointer-events-none" />
      </div>
    </div>

    <!-- ── Botón tutorial fijo ── -->
    <button @click="showTutorial = true" class="tutorial-fab">
      <AppIcon name="info_i_green" :size="20" />
      <span>Ayuda</span>
    </button>

    <!-- ── Modal tutorial ── -->
    <Transition name="tut">
      <div v-if="showTutorial" class="tutorial-overlay" @click.self="showTutorial = false">
        <div class="tutorial-card">
          <div class="tutorial-header">
            <div class="tutorial-header-icon">
              <AppIcon name="info_i" :size="18" />
            </div>
            <div class="tutorial-header-text">
              <p class="tutorial-title">Recuperar contraseña</p>
              <p class="tutorial-subtitle">¿Cómo funciona este proceso?</p>
            </div>
            <button @click="showTutorial = false" class="tutorial-close">✕</button>
          </div>
          <div class="tutorial-body">

            <div class="tutorial-divider">Opciones principales</div>


            <div class="tutorial-step">
              <div class="tutorial-step-icon" style="background:#f0faf4;border-color:#c8e6c9;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#299261"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div class="tutorial-step-body">
                <p class="tutorial-step-title">
                  <!-- <div class="tutorial-step-num">1</div> -->
                  Tu documento
                </p>
                <p class="tutorial-step-desc">Ingresa tu número de cédula. Verificaremos que tengas una cuenta
                  registrada en la plataforma.</p>
              </div>
            </div>

            <div class="tutorial-step">
              <div class="tutorial-step-icon" style="background:#232b3a14;border-color:#232b3a22;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#232B3A"
                  stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div class="tutorial-step-body">
                <p class="tutorial-step-title">
                  Enviar código</p>
                <p class="tutorial-step-desc">Te enviaremos un código OTP de 6 dígitos al correo registrado en tu
                  cuenta.</p>
              </div>
            </div>

            <div class="tutorial-step">
              <div class="tutorial-step-icon" style="background:#eff6ff;border-color:#bfdbfe;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#1e40af"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="4" height="4" rx="1" />
                  <rect x="10" y="3" width="4" height="4" rx="1" />
                  <rect x="17" y="3" width="4" height="4" rx="1" />
                  <rect x="3" y="10" width="4" height="4" rx="1" />
                  <rect x="10" y="10" width="4" height="4" rx="1" />
                  <rect x="17" y="10" width="4" height="4" rx="1" />
                  <rect x="3" y="17" width="4" height="4" rx="1" />
                  <rect x="10" y="17" width="4" height="4" rx="1" />
                  <rect x="17" y="17" width="4" height="4" rx="1" />
                </svg>
              </div>
              <div class="tutorial-step-body">
                <p class="tutorial-step-title">
                  Código de 6 dígitos</p>
                <p class="tutorial-step-desc">Ingresa el código recibido en tu correo. Tienes 15 minutos antes de que
                  expire.</p>
              </div>
            </div>

            <div class="tutorial-step">
              <div class="tutorial-step-icon" style="background:#f0faf4;border-color:#c8e6c9;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#299261"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <rect width="18" height="11" x="3" y="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div class="tutorial-step-body">
                <p class="tutorial-step-title">
                  Nueva contraseña</p>
                <p class="tutorial-step-desc">Elige tu nueva contraseña (mínimo 8 caracteres) y confírmala para guardar
                  el cambio.</p>
              </div>
            </div>

            <div class="tutorial-divider">Opciones adicionales</div>

            <div class="tutorial-step">
              <div class="tutorial-step-icon" style="background:#fefce8;border-color:#fde68a;margin-left:0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#854d0e"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div class="tutorial-step-body">
                <p class="tutorial-step-title">Ya tengo un código</p>
                <p class="tutorial-step-desc">Si ya solicitaste un código antes y no ha expirado, digita el documento
                  de identidad para
                  ir directo a verificarlo.</p>
              </div>
            </div>

            <div class="tutorial-step">
              <div class="tutorial-step-icon" style="background:#f5f3ff;border-color:#ddd6fe;margin-left:0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#5b21b6"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                </svg>
              </div>
              <div class="tutorial-step-body">
                <p class="tutorial-step-title">Reenviar código</p>
                <p class="tutorial-step-desc">Si el código expiró o no llegó, solicita uno nuevo desde el paso de
                  verificación.</p>
              </div>
            </div>

          </div>
          <div class="tutorial-footer">
            <button @click="showTutorial = false" class="tutorial-btn-close">Entendido</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const showTutorial = ref(false)
const step = ref(1)
const documento = ref('')
const otpDigits = reactive(Array(6).fill(''))
const otpInputs = ref([])
const errorMsg = ref('')
const loading = ref(false)
const timeLeft = ref(900)
let timerInterval = null

const skippedSend = ref(false)

// Paso 3
const newPassword = ref('')
const confirmPassword = ref('')
const showNew = ref(false)
const showConfirm = ref(false)
const passwordMismatch = computed(
  () => !!confirmPassword.value && newPassword.value !== confirmPassword.value
)

// ── Timer ────────────────────────────────────────────────────────────
const timerDisplay = computed(() => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
  const s = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

function startTimer() {
  timeLeft.value = 900
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else clearInterval(timerInterval)
  }, 1000)
}

onUnmounted(() => clearInterval(timerInterval))

// ── Paso 1: enviar código ────────────────────────────────────────────
async function handleSendCode() {
  if (!documento.value || loading.value) return
  loading.value = true
  errorMsg.value = ''
  const result = await auth.sendForgotCode(documento.value)
  loading.value = false
  if (result?.success) {
    skippedSend.value = false
    step.value = 2
    startTimer()
    otpDigits.fill('')
  } else {
    errorMsg.value = result?.message ?? auth.errorMsg ?? 'Error al enviar el código.'
  }
}

// ── Paso 2: OTP handlers ─────────────────────────────────────────────
const isOtpComplete = computed(() => otpDigits.every(d => d !== ''))

function onOtpInput(index, event) {
  const val = event.target.value.replace(/\D/g, '').slice(-1)
  otpDigits[index] = val
  event.target.value = val
  if (val && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

function onOtpKeydown(index, event) {
  if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

function onOtpPaste(event) {
  const text = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6)
  if (!text) return
  event.preventDefault()
  text.split('').forEach((char, i) => {
    if (i < 6) otpDigits[i] = char
  })
  const focusIndex = Math.min(text.length, 5)
  otpInputs.value[focusIndex]?.focus()
}

// ── Paso 2: verificar código ─────────────────────────────────────────
async function handleVerifyCode() {
  if (!isOtpComplete.value || loading.value || timeLeft.value === 0) return
  loading.value = true
  errorMsg.value = ''
  const result = await auth.verifyForgotCode(documento.value, otpDigits.join(''))
  loading.value = false
  if (result?.success) {
    step.value = 3
    errorMsg.value = ''
  } else {
    errorMsg.value = result?.message ?? auth.errorMsg ?? 'Código inválido o expirado.'
    otpDigits.fill('')
    otpInputs.value[0]?.focus()
  }
}

// ── Paso 3: cambiar contraseña ───────────────────────────────────────
async function handleResetPassword() {
  if (!newPassword.value || !confirmPassword.value || passwordMismatch.value || loading.value) return
  loading.value = true
  errorMsg.value = ''
  const result = await auth.resetPassword(documento.value, otpDigits.join(''), newPassword.value)
  loading.value = false
  if (result?.success) {
    router.push('/login')
  } else {
    errorMsg.value = result?.message ?? auth.errorMsg ?? 'Error al cambiar la contraseña.'
  }
}

async function handleResend() {
  errorMsg.value = ''
  await handleSendCode()
}

function goDirectToOtp() {
  if (!documento.value) return
  skippedSend.value = true
  errorMsg.value = ''
  otpDigits.fill('')
  step.value = 2
}

function goBack() {
  step.value = 1
  errorMsg.value = ''
  skippedSend.value = false
  otpDigits.fill('')
  clearInterval(timerInterval)
}
</script>

<style scoped>
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

/* Step transition */
.step-fade-enter-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.step-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateX(18px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}

/* Error transition */
.err-slide-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.err-slide-leave-active {
  transition: opacity 0.15s ease;
}

.err-slide-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}

.err-slide-leave-to {
  opacity: 0;
}

/* Button hover */
.submit-btn:hover:not(:disabled) {
  background: #299261;
  box-shadow: 0 8px 24px rgba(41, 146, 97, 0.38);
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(4px);
}

.btn-arrow {
  transition: transform 0.2s ease;
}
</style>
