<template>
    <div class="reg-root">
        <div class="blob blob-1" />
        <div class="blob blob-2" />

        <div class="reg-card">

            <!-- ── Panel izquierdo ──────────────────────────────── -->
            <div class="brand-side">
                <div class="brand-inner">
                    <img src="@/assets/img/confy-verde.png" alt="Logo" class="brand-logo"
                        @error="$event.target.style.display = 'none'" />
                    <div class="brand-copy">
                        <h2>Bienvenido al<br />sistema</h2>
                        <p>Gestiona tu mensualidad de parqueo de forma fácil y rápida.</p>
                    </div>
                </div>

                <div class="sede-badge-wrap">
                    <div class="sede-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {{ sedeNombre }}
                    </div>
                    <p class="sede-hint">Selecciona tu sede para comenzar el registro</p>
                </div>

                <div class="deco-circle deco-1" />
                <div class="deco-circle deco-2" />
                <div class="deco-circle deco-3" />
            </div>

            <!-- ── Panel formulario ─────────────────────────────── -->
            <div class="form-side">
                <div class="top-accent" />

                <!-- Header mobile -->
                <div class="mobile-header">
                    <button @click="$router.back()" class="back-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                        Volver
                    </button>
                    <div class="mobile-sede-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#7FD344"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {{ sedeNombre }}
                    </div>
                </div>

                <!-- Scroll -->
                <div class="form-scroll">

                    <!-- Encabezado -->
                    <div class="form-header">
                        <div class="form-icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                        </div>
                        <div>
                            <h1>{{ usuarioEncontrado ? 'Completa tu registro' : 'Crea tu cuenta' }}</h1>
                            <p>{{ usuarioEncontrado ? 'Encontramos tus datos — revísalos y crea tu contraseña.' :
                                'Ingresa tu documento para comenzar.' }}</p>
                        </div>
                    </div>

                    <!-- ── DOCUMENTO ──────────────────────────────── -->
                    <div class="section-block">
                        <p class="section-label">Identificación</p>
                        <div class="flex flex-col gap-1">
                            <label class="field-label-sm">Número de documento <span
                                    class="text-red-400">*</span></label>
                            <div class="relative">
                                <input v-model="form.Documento" type="text" class="field-input"
                                    :class="{ 'field-input--active': buscandoDoc }" placeholder="Ej: 109..."
                                    @input="onDocumentoInput" :disabled="formularioListo && !editandoDoc" />
                                <div v-if="buscandoDoc"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 flex">
                                    <span class="spinner-sm" />
                                </div>
                                <div v-else-if="usuarioEncontrado"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[#299261] flex">
                                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                </div>
                            </div>

                            <p v-if="msgDoc" class="text-[0.7rem] font-semibold pl-0.5 mt-0.5"
                                :class="usuarioEncontrado ? 'text-[#299261]' : 'text-gray-400'">
                                {{ msgDoc }}
                            </p>

                            <!-- Editar documento -->
                            <Transition name="fade">
                                <div v-if="formularioListo && !editandoDoc && !bloqueado"
                                    class="flex items-center justify-between flex-wrap gap-1.5 mt-1">
                                    <button type="button" @click="habilitarEdicionDoc" class="edit-doc-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                        </svg>
                                        ¿Documento incorrecto? Corregir
                                    </button>
                                    <span v-if="busquedasRealizadas > 1" class="attempts-badge">
                                        {{ LIMITE_BUSQUEDAS - busquedasRealizadas }} intentos restantes
                                    </span>
                                </div>
                            </Transition>

                            <!-- Bloqueado -->
                            <Transition name="fade">
                                <div v-if="bloqueado" class="alert-warn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                    </svg>
                                    Demasiados intentos. Recarga la página para continuar.
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <!-- ── ALERTA ESTUDIANTE sede 24 ──────────────── -->
                    <Transition name="fade">
                        <div v-if="esSede24 && formularioListo" class="student-card">
                            <div class="student-card__title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#0D291C"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                </svg>
                                ¿Eres estudiante UCC?
                            </div>
                            <div class="flex gap-2 mt-2.5">
                                <button @click="esEstudiante = true" class="est-btn"
                                    :class="{ 'est-btn--on': esEstudiante === true }">
                                    Sí, soy estudiante
                                </button>
                                <button @click="esEstudiante = false; form.CodigoEstudianteUCC = ''"
                                    class="est-btn" :class="{ 'est-btn--on': esEstudiante === false }">
                                    No, continuar
                                </button>
                            </div>
                            <Transition name="fade">
                                <div v-if="esEstudiante === true" class="flex flex-col gap-1 mt-3">
                                    <label class="field-label-sm">Código estudiante UCC <span
                                            class="text-red-400">*</span></label>
                                    <input v-model="form.CodigoEstudianteUCC" type="text" class="field-input"
                                        placeholder="" />
                                </div>
                            </Transition>
                        </div>
                    </Transition>

                    <!-- ── FORMULARIO COMPLETO ────────────────────── -->
                    <Transition name="reveal">
                        <div v-if="formularioListo" class="flex flex-col gap-5">

                            <!-- Banner encontrado -->
                            <div v-if="usuarioEncontrado" class="alert-success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#166534"
                                    viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Mensualidad encontrada — revisa tus datos y crea tu contraseña para acceder.
                            </div>

                            <!-- Datos personales -->
                            <div class="section-block">
                                <p class="section-label">Datos personales</p>
                                <div class="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
                                    <div class="flex flex-col gap-1">
                                        <label class="field-label-sm">Nombres <span
                                                class="text-red-400">*</span></label>
                                        <input v-model="form.Nombres" type="text" class="field-input"
                                            placeholder="" />
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <label class="field-label-sm">Apellidos <span
                                                class="text-red-400">*</span></label>
                                        <input v-model="form.Apellidos" type="text" class="field-input"
                                            placeholder="" />
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <label class="field-label-sm">Teléfono <span
                                                class="text-red-400">*</span></label>
                                        <input v-model="form.Telefono" type="text" class="field-input"
                                            placeholder=""
                                            @input="form.Telefono = $event.target.value.replace(/\D/g, '')" />
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <label class="field-label-sm">Correo electrónico <span
                                                class="text-red-400">*</span></label>
                                        <input v-model="form.Email" type="email" class="field-input"
                                            placeholder="" />
                                    </div>
                                    <div class="col-span-2 max-[480px]:col-span-1 flex flex-col gap-1">
                                        <label class="field-label-sm">Contraseña <span
                                                class="text-red-400">*</span></label>
                                        <div class="relative">
                                            <input v-model="form.Password"
                                                :type="verPass ? 'text' : 'password'" class="field-input"
                                                placeholder="Mínimo 8 caracteres" />
                                            <button type="button" @click="verPass = !verPass"
                                                class="pass-toggle">
                                                <svg v-if="!verPass" xmlns="http://www.w3.org/2000/svg"
                                                    width="15" height="15" fill="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                </svg>
                                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="15"
                                                    height="15" fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Vehículos -->
                            <div class="section-block">
                                <p class="section-label">Vehículos</p>
                                <div class="flex flex-col gap-2.5">
                                    <div v-for="(_, idx) in form.placas" :key="idx"
                                        class="flex flex-col gap-1">
                                        <label class="field-label-sm">Placa {{ idx + 1 }}{{ idx === 0 ? ' *'
                                            : '' }}</label>
                                        <div class="flex gap-2 items-center">
                                            <input v-model="form.placas[idx]" type="text"
                                                class="field-input placa-input flex-1" :placeholder="``"
                                                maxlength="7" />
                                            <button v-if="idx > 0" type="button"
                                                @click="form.placas.splice(idx, 1)"
                                                class="remove-placa-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                                                    fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button v-if="form.placas.length < 2" type="button"
                                        @click="form.placas.push('')" class="add-placa-btn">
                                        <span class="add-placa-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                                fill="#7FD344" viewBox="0 0 24 24">
                                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                            </svg>
                                        </span>
                                        Agregar otra placa
                                    </button>
                                </div>
                            </div>

                            <!-- Error 409 -->
                            <Transition name="fade">
                                <div v-if="errSubmit === '409'" class="alert-409">
                                    <div class="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="#92400e" viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                        <div>
                                            <p class="text-[0.8rem] font-black text-amber-800 leading-tight">
                                                Este documento ya tiene una cuenta
                                            </p>
                                            <p class="text-[0.72rem] font-semibold text-amber-700 mt-0.5 leading-snug">
                                                El documento <strong>{{ form.Documento }}</strong> ya está
                                                registrado en el sistema.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 mt-3">
                                        <router-link to="/login" class="btn-go-login">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                                            </svg>
                                            Iniciar sesión
                                        </router-link>
                                        <button type="button" @click="habilitarEdicionDoc"
                                            class="btn-fix-doc">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                            </svg>
                                            Corregir documento
                                        </button>
                                    </div>
                                </div>
                            </Transition>

                            <!-- Error genérico -->
                            <Transition name="fade">
                                <div v-if="errSubmit && errSubmit !== '409'" class="alert-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                        fill="currentColor" viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    {{ errSubmit }}
                                </div>
                            </Transition>

                            <!-- Submit -->
                            <button @click="submit" :disabled="guardando" class="submit-btn">
                                <span v-if="guardando" class="spinner-sm spinner-sm--light" />
                                {{ guardando ? 'Registrando...' : 'Crear cuenta' }}
                                <svg v-if="!guardando" xmlns="http://www.w3.org/2000/svg" width="15"
                                    height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5" class="btn-arrow">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>

                            <p class="text-center text-xs font-semibold text-gray-400">
                                ¿Ya tienes cuenta?
                                <router-link to="/login"
                                    class="font-bold text-[#299261] hover:underline">Inicia
                                    sesión</router-link>
                            </p>

                        </div>
                    </Transition>

                    <!-- ── MODAL ÉXITO ──────────────────────────────────────────── -->
                    <Transition name="modal">
                        <div v-if="modalExito"
                            class="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style="background:rgba(0,0,0,0.65)">
                            <div class="success-modal">
                                <div class="success-modal__head">
                                    <div class="success-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                            fill="#0D291C" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-[1rem] font-black text-white">¡Registro exitoso!</p>
                                        <p class="text-[0.68rem] font-semibold mt-1 text-white/50">
                                            Tu cuenta ha sido creada correctamente
                                        </p>
                                    </div>
                                </div>
                                <div class="success-modal__body">
                                    <p class="text-[0.82rem] font-semibold text-[#374151] text-center leading-relaxed">
                                        Ya puedes iniciar sesión con tu documento y contraseña en la sede
                                        <strong class="text-[#0D291C]">{{ sedeNombre }}</strong>.
                                    </p>
                                </div>
                                <div class="success-modal__foot">
                                    <button @click="router.push({ name: 'login' })" class="modal-cta-btn">
                                        Ir al inicio de sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition>

                    <!-- ── MODAL CÓDIGO DE VALIDACIÓN (comentado) ──────────────── -->
                    <!-- <Transition name="modal">
                        <div v-if="modalCodigo" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style="background:rgba(0,0,0,0.6)" @click.self="modalCodigo = false">
                            <div class="bg-[#B8E19E] border-2 border-[#0D291C] rounded-[28px] w-[30vw] max-w-[400px] overflow-hidden"
                                style="box-shadow:0 7px 0 #000">

                                <div class="flex items-center justify-between gap-3 px-6 py-5 bg-[#0D291C]">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                            style="background:rgba(127,211,68,0.2)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                fill="#7FD344" viewBox="0 0 24 24">
                                                <path
                                                    d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-[0.92rem] font-black text-white">Código de validación</p>
                                            <p class="text-[0.63rem] font-semibold" style="color:rgba(255,255,255,0.5)">
                                                Digita el código que te entregaron
                                            </p>
                                        </div>
                                    </div>
                                    <button @click="modalCodigo = false"
                                        class="text-white opacity-40 hover:opacity-100 bg-transparent border-none cursor-pointer text-lg font-black transition-opacity">✕</button>
                                </div>

                                <div class="px-6 py-5 flex flex-col gap-4">
                                    <p class="text-[0.78rem] font-semibold text-[#0D291C] leading-relaxed opacity-70">
                                        Para completar tu registro necesitas el código de validación que te entregaron
                                        personalmente en el parqueadero.
                                    </p>
                                    <div class="flex flex-col gap-1.5">
                                        <label
                                            class="text-[0.58rem] font-black uppercase tracking-wide text-[#0D291C] opacity-50 pl-0.5">
                                            Código <span class="text-red-500">*</span>
                                        </label>
                                        <input v-model="codigoValidacion" type="text"
                                            class="w-full box-border border-2 border-[#0D291C] rounded-[14px] px-4 py-3 text-[1.1rem] font-black text-[#0D291C] text-center tracking-[0.18em] uppercase outline-none bg-white transition-all"
                                            style="box-shadow:inset 0 2px 0 rgba(13,41,28,0.06)"
                                            placeholder="Ej: XYZ-9876"
                                            @input="codigoValidacion = $event.target.value.toUpperCase(); errCodigo = ''"
                                            @keyup.enter="submitConCodigo" />
                                    </div>
                                    <Transition name="fade">
                                        <div v-if="errCodigo"
                                            class="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[0.77rem] font-bold bg-red-50 text-red-700 border-2 border-red-300"
                                            style="box-shadow:0 3px 0 #fca5a5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                fill="currentColor" viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                                <path
                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                            </svg>
                                            {{ errCodigo }}
                                        </div>
                                    </Transition>
                                </div>

                                <div class="flex gap-2.5 px-6 pb-6 pt-1">
                                    <button @click="modalCodigo = false"
                                        class="flex-1 py-3 rounded-full text-[0.78rem] font-black uppercase tracking-wide cursor-pointer bg-white text-[#232B3A] border-2 border-black transition-colors hover:bg-gray-50"
                                        style="box-shadow:0 3px 0 #000">
                                        Cancelar
                                    </button>
                                    <button @click="submitConCodigo" :disabled="guardando || !codigoValidacion.trim()"
                                        class="flex-[2] py-3 rounded-full text-[0.78rem] font-black uppercase tracking-wide cursor-pointer bg-[#0D291C] text-white border-2 border-black flex items-center justify-center gap-2 transition-colors hover:bg-[#1a4a2e] disabled:opacity-40 disabled:cursor-not-allowed"
                                        style="box-shadow:0 3px 0 #000">
                                        <span v-if="guardando" class="spinner-sm spinner-sm--light" />
                                        {{ guardando ? 'Registrando...' : 'Confirmar registro' }}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </Transition> -->

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ClientService from '@/api/services/client.service'
import MensualidadesService from '@/api/services/mensualidades.service'

const route = useRoute()
const router = useRouter()

const idSede = computed(() => Number(route.query.sede))
const sedeNombre = computed(() => route.query.sedeNombre ?? 'Sede')
const esSede24 = computed(() => idSede.value === 24)

const buscandoDoc = ref(false)
const formularioListo = ref(false)
const usuarioEncontrado = ref(false)
const editandoDoc = ref(false)
const verPass = ref(false)
const guardando = ref(false)
const errSubmit = ref('')
const msgDoc = ref('')
const esEstudiante = ref(null)
const modalExito = ref(false)

// ── Anti-abuso ─────────────────────────────────────────────────────
const LIMITE_BUSQUEDAS = 4
const busquedasRealizadas = ref(0)
const documentosBuscados = ref(new Set())
const bloqueado = ref(false)

const mensualidadData = ref(null)

const form = reactive({
    Documento: '', Nombres: '', Apellidos: '',
    Telefono: '', Email: '', Password: '',
    CodigoEstudianteUCC: '', EstudianteUcc: false,
    placas: [''],
})

// ── Tipo de vehículo por placa (Colombia) ──────────────────────────
// Carro:  ABC123  → 3L + 3N
// Moto:   ABC12D  → 3L + 2N + 1L
const detectarTipoVehiculo = (placa) => {
    if (!placa) return null
    const p = placa.trim().toUpperCase()
    if (/^[A-Z]{3}[0-9]{3}$/.test(p)) return 1  // Carro
    if (/^[A-Z]{3}[0-9]{2}[A-Z]$/.test(p)) return 2  // Moto
    return null
}

// ── Editar documento ───────────────────────────────────────────────
const habilitarEdicionDoc = () => {
    if (bloqueado.value) return
    formularioListo.value = false
    usuarioEncontrado.value = false
    editandoDoc.value = true
    msgDoc.value = ''
    errSubmit.value = ''
    mensualidadData.value = null
    Object.assign(form, {
        Nombres: '', Apellidos: '', Telefono: '', Email: '',
        Password: '', CodigoEstudianteUCC: '', EstudianteUcc: false, placas: [''],
    })
    esEstudiante.value = null
}

// ── Input documento ────────────────────────────────────────────────
let docTimer = null

const onDocumentoInput = () => {
    if (bloqueado.value) return
    clearTimeout(docTimer)
    formularioListo.value = false
    usuarioEncontrado.value = false
    msgDoc.value = ''
    errSubmit.value = ''
    const doc = form.Documento.replace(/\D/g, '')
    form.Documento = doc
    if (doc.length >= 6) {
        docTimer = setTimeout(() => buscarDocumento(doc), 700)
    }
}

// ── Búsqueda ───────────────────────────────────────────────────────
const buscarDocumento = async (doc) => {
    if (!documentosBuscados.value.has(doc)) {
        if (busquedasRealizadas.value >= LIMITE_BUSQUEDAS) {
            bloqueado.value = true
            msgDoc.value = '⚠ Demasiados intentos. Recarga la página para continuar.'
            return
        }
        busquedasRealizadas.value++
        documentosBuscados.value.add(doc)
    }

    buscandoDoc.value = true
    editandoDoc.value = false

    try {
        const res = await MensualidadesService.getDesdeApiSede(idSede.value, doc)
        const esError = res?.error === true || res?.success === false || res?.statusCode >= 400

        if (esError) {
            usuarioEncontrado.value = false
            mensualidadData.value = null
            limpiarCampos()
            msgDoc.value = 'No se encontró mensualidad — completa el formulario'
            formularioListo.value = true
            return
        }

        const d = res.data ?? res
        mensualidadData.value = d
        usuarioEncontrado.value = true

        const partes = (d.nombreApellidos ?? '').trim().split(/\s+/)
        const mitad = Math.ceil(partes.length / 2)

        Object.assign(form, {
            Documento: String(d.documento ?? doc),
            Nombres: partes.slice(0, mitad).join(' '),
            Apellidos: partes.slice(mitad).join(' '),
            IdAutorizacion: d.idAutorizacion,
            Telefono: d.telefono ?? '',
            Email: d.email ?? '',
            Password: '',
            CodigoEstudianteUCC: '',
            EstudianteUcc: false,
            placas: [d.placa1, d.placa2, d.placa3, d.placa4, d.placa5].filter(Boolean),
        })
        if (form.placas.length === 0) form.placas = ['']

        msgDoc.value = '✓ Mensualidad encontrada — completa los datos faltantes'
        formularioListo.value = true

    } catch {
        mensualidadData.value = null
        usuarioEncontrado.value = false
        limpiarCampos()
        msgDoc.value = 'No se pudo verificar — completa el formulario manualmente'
        formularioListo.value = true
    } finally {
        buscandoDoc.value = false
    }
}

const limpiarCampos = () => {
    Object.assign(form, {
        Nombres: '', Apellidos: '', Telefono: '', Email: '',
        Password: '', CodigoEstudianteUCC: '', EstudianteUcc: false, placas: [''],
    })
    esEstudiante.value = null
}

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ── Validaciones comunes ───────────────────────────────────────────
const validarFormulario = () => {
    errSubmit.value = ''
    if (!form.Documento || !form.Nombres || !form.Apellidos) {
        errSubmit.value = 'Nombre, apellidos y documento son obligatorios.'; return false
    }
    if (!form.Telefono || form.Telefono.length < 7) {
        errSubmit.value = 'Ingresa un teléfono de contacto válido.'; return false
    }
    if (!form.Email || !emailValido(form.Email)) {
        errSubmit.value = 'Ingresa un correo electrónico válido.'; return false
    }
    if (!form.Password || form.Password.length < 8) {
        errSubmit.value = 'La contraseña debe tener mínimo 8 caracteres.'; return false
    }
    if (!form.placas[0]?.trim()) {
        errSubmit.value = 'Ingresa al menos la placa principal del vehículo.'; return false
    }
    if (detectarTipoVehiculo(form.placas[0]) === null) {
        errSubmit.value = 'El formato de la placa principal no es válido (ej: ABC123 para carro, ABC12D para moto).'; return false
    }
    if (esSede24.value && esEstudiante.value === null) {
        errSubmit.value = 'Indica si eres estudiante UCC o no.'; return false
    }
    if (esSede24.value && esEstudiante.value === true && !form.CodigoEstudianteUCC) {
        errSubmit.value = 'Ingresa tu código de estudiante UCC.'; return false
    }
    return true
}

// ── Construir payload ──────────────────────────────────────────────
const buildPayload = (esOld) => {
    const m = mensualidadData.value
    const { placas, CodigoEstudianteUCC, EstudianteUcc, ...rest } = form

    return {
        Documento: rest.Documento,
        Nombres: rest.Nombres,
        Apellidos: rest.Apellidos,
        Telefono: rest.Telefono,
        Email: rest.Email,
        Password: rest.Password,
        IdEstacionamiento: idSede.value,
        Estado: true,
        Sincronizacion: m?.sincronizacion ?? false,
        Old: esOld,
        ...(m?.idAutorizacion ? { IdAutorizacion: m.idAutorizacion } : {}),
        ...(esOld && m?.fechaInicio ? { FechaInicio: m.fechaInicio } : {}),
        ...(esOld && m?.fechaFin ? { FechaFin: m.fechaFin } : {}),
        Placa1: placas[0] || null,
        Placa2: placas[1] || null,
        Placa3: placas[2] || null,
        Placa4: placas[3] || null,
        Placa5: placas[4] || null,
        EstudianteUcc: esSede24.value ? (esEstudiante.value === true) : false,
        CodigoEstudianteUCC: esSede24.value && esEstudiante.value === true ? CodigoEstudianteUCC : '',
    }
}

// ── Manejar respuesta ──────────────────────────────────────────────
const manejarRespuesta = (res, esModal = false) => {
    if (res?.error === true || res?.success === false) {
        const status = res?.status ?? res?.data?.statusCode
        const message = res?.data?.message ?? res?.message ?? ''
        const msg = Array.isArray(message) ? message.join(', ') : (message || 'Error al registrar.')
        if (status === 409) errSubmit.value = '409'
        else if (esModal) errSubmit.value = msg
        else errSubmit.value = msg
        return false
    }
    return true
}

// ── Submit principal ───────────────────────────────────────────────
const submit = async () => {
    if (!validarFormulario()) return

    guardando.value = true
    errSubmit.value = ''

    try {
        const esOld = !!mensualidadData.value
        const payload = buildPayload(esOld)

        console.group(`📤 [submit] Old=${esOld}`)
        console.log('Payload:', JSON.stringify(payload, null, 2))
        console.groupEnd()

        const res = await ClientService.createClient(payload)

        if (!manejarRespuesta(res)) return

        modalExito.value = true

    } catch (e) {
        if (e.response?.status === 409) { errSubmit.value = '409'; return }
        const msg = e.response?.data?.message
        errSubmit.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al registrar. Intenta de nuevo.')
    } finally {
        guardando.value = false
    }
}
</script>

<script>

// ── Submit (código comentado) ───────────────────────────────────────────────────────
// const abrirModalCodigo = async () => {
//     errSubmit.value = ''
//     if (!form.Documento || !form.Nombres || !form.Apellidos) {
//         errSubmit.value = 'Nombre, apellidos y documento son obligatorios.'; return
//     }
//     if (!form.Telefono || form.Telefono.length < 7) {
//         errSubmit.value = 'Ingresa un teléfono de contacto válido.'; return
//     }
//     if (!form.Email || !emailValido(form.Email)) {
//         errSubmit.value = 'Ingresa un correo electrónico válido.'; return
//     }
//     if (!form.Password || form.Password.length < 8) {
//         errSubmit.value = 'La contraseña debe tener mínimo 8 caracteres.'; return
//     }
//     if (!form.placas[0]?.trim()) {
//         errSubmit.value = 'Ingresa al menos la placa principal del vehículo.'; return
//     }
//     if (esSede24.value && esEstudiante.value === null) {
//         errSubmit.value = 'Indica si eres estudiante UCC o no.'; return
//     }
//     if (esSede24.value && esEstudiante.value === true && !form.CodigoEstudianteUCC) {
//         errSubmit.value = 'Ingresa tu código de estudiante UCC.'; return
//     }

//     if (mensualidadData.value) {
//         guardando.value = true
//         await submitSinCodigo()
//         return
//     }

//     codigoValidacion.value = ''
//     errCodigo.value = ''
//     modalCodigo.value = true
// }


// const submitConCodigo = async () => {
//     if (!codigoValidacion.value.trim()) {
//         errCodigo.value = 'Ingresa el código de validación.'; return
//     }

//     guardando.value = true
//     errCodigo.value = ''

//     try {
//         const m = mensualidadData.value
//         const { placas, CodigoEstudianteUCC, EstudianteUcc, ...rest } = form

//         const payload = {
//             Documento: rest.Documento,
//             Nombres: rest.Nombres,
//             Apellidos: rest.Apellidos,
//             Telefono: rest.Telefono,
//             Email: rest.Email,
//             Password: rest.Password,
//             IdEstacionamiento: idSede.value,
//             Estado: true,
//             Sincronizacion: m?.sincronizacion ?? false,
//             Old: !!m,
//             ...(m?.idAutorizacion ? { IdAutorizacion: m.idAutorizacion } : {}),
//             Placa1: placas[0] || null,
//             Placa2: placas[1] || null,
//             Placa3: placas[2] || null,
//             Placa4: placas[3] || null,
//             Placa5: placas[4] || null,
//             EstudianteUcc: esSede24.value ? (esEstudiante.value === true) : false,
//             CodigoEstudianteUCC: esSede24.value && esEstudiante.value === true ? CodigoEstudianteUCC : '',
//             Codigo: codigoValidacion.value.trim(),
//         }

//         const res = await ClientService.createClientWithCodigo(payload)

//         if (res?.error === true || res?.success === false) {
//             const status = res?.status ?? res?.data?.statusCode
//             const message = res?.data?.message ?? res?.message ?? ''
//             if (status === 409) { modalCodigo.value = false; errSubmit.value = '409'; return }
//             errCodigo.value = Array.isArray(message) ? message.join(', ') : (message || 'Código inválido o error al registrar.')
//             return
//         }

//         router.push({ name: 'login', query: { registered: '1' } })

//     } catch (e) {
//         if (e.response?.status === 409) { modalCodigo.value = false; errSubmit.value = '409'; return }
//         const msg = e.response?.data?.message
//         errCodigo.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al registrar. Intenta de nuevo.')
//     } finally {
//         guardando.value = false
//     }
// }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
</style>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.reg-root {
    min-height: 100vh;
    width: 100%;
    background-color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
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
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(41, 146, 97, 0.22) 0%, transparent 70%);
    top: -140px;
    left: -140px;
}

.blob-2 {
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, rgba(127, 211, 68, 0.15) 0%, transparent 70%);
    bottom: -100px;
    right: -100px;
}

/* ── Card ─────────────────────────────────────── */
.reg-card {
    position: relative;
    z-index: 10;
    display: flex;
    width: 100%;
    max-width: 900px;
    border-radius: 28px;
    overflow: hidden;
    border: 1.5px solid rgba(127, 211, 68, 0.2);
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.45),
        0 32px 64px rgba(0, 0, 0, 0.5),
        0 0 60px rgba(127, 211, 68, 0.06);
    min-height: 580px;
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
    padding: 40px 28px;
    background: linear-gradient(155deg, #1b4e32 0%, #0D291C 100%);
    width: 220px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    border-right: 1px solid rgba(255, 255, 255, 0.04);
}

.brand-inner {
    position: relative;
    z-index: 2;
}

.brand-logo {
    max-height: 68px;
    max-width: 100%;
    object-fit: contain;
    margin-bottom: 24px;
}

.brand-copy h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
    letter-spacing: -0.025em;
    margin-bottom: 8px;
}

.brand-copy p {
    font-size: 0.76rem;
    font-weight: 500;
    color: rgba(127, 211, 68, 0.6);
    line-height: 1.55;
}

.sede-badge-wrap {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.sede-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(127, 211, 68, 0.12);
    color: #7FD344;
    font-size: 0.67rem;
    font-weight: 700;
    padding: 6px 11px;
    border-radius: 100px;
    width: fit-content;
    border: 1px solid rgba(127, 211, 68, 0.25);
}

.sede-hint {
    font-size: 0.61rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.3);
    padding-left: 2px;
}

.deco-circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(41, 146, 97, 0.2);
    background: transparent;
}

.deco-1 {
    width: 190px;
    height: 190px;
    top: -70px;
    right: -60px;
}

.deco-2 {
    width: 100px;
    height: 100px;
    bottom: 55px;
    right: -30px;
}

.deco-3 {
    width: 55px;
    height: 55px;
    bottom: 20px;
    right: 48px;
}

/* ── Form side ────────────────────────────────── */
.form-side {
    flex: 1;
    background: #fff;
    display: flex;
    flex-direction: column;
    min-width: 0;
    position: relative;
}

.top-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #299261, #7FD344 50%, #299261);
    z-index: 2;
}

/* ── Mobile header ────────────────────────────── */
.mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1.5px solid #f1f5f9;
    margin-top: 3px;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.76rem;
    font-weight: 800;
    color: #0D291C;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: color 0.2s;
}

.back-btn:hover {
    color: #299261;
}

.mobile-sede-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #0D291C;
    color: #7FD344;
    font-size: 0.62rem;
    font-weight: 900;
    padding: 5px 10px;
    border-radius: 100px;
}

/* ── Form scroll area ─────────────────────────── */
.form-scroll {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px 28px 28px;
}

/* ── Form header ──────────────────────────────── */
.form-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.form-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    background: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 0 #051510;
}

.form-header h1 {
    font-size: 1.2rem;
    font-weight: 900;
    color: #0D291C;
    line-height: 1.2;
    margin: 0 0 4px;
    letter-spacing: -0.02em;
}

.form-header p {
    font-size: 0.75rem;
    font-weight: 600;
    color: #9ca3af;
    line-height: 1.4;
    margin: 0;
}

/* ── Section blocks ───────────────────────────── */
.section-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.section-label {
    font-size: 0.56rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #0D291C;
    opacity: 0.32;
    border-bottom: 1px solid rgba(13, 41, 28, 0.08);
    padding-bottom: 5px;
    margin: 0;
}

/* ── Inputs ───────────────────────────────────── */
.field-input {
    width: 100%;
    box-sizing: border-box;
    border: 1.5px solid #e8ecf0 !important;
    border-radius: 12px !important;
    padding: 10px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    background: #f7f8fa !important;
    outline: none !important;
    box-shadow: none !important;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.field-input:focus {
    border-color: #299261 !important;
    background: white !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.1) !important;
}

.field-input:disabled {
    background: #f3f4f6 !important;
    color: #9ca3af !important;
    cursor: not-allowed;
}

.field-input--active {
    border-color: #299261 !important;
}

.field-label-sm {
    font-size: 0.58rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.5;
    padding-left: 2px;
}

.placa-input {
    text-transform: uppercase !important;
    letter-spacing: 0.12em !important;
    font-weight: 800 !important;
}

/* ── Password toggle ──────────────────────────── */
.pass-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 0;
    display: flex;
    transition: color 0.2s;
}

.pass-toggle:hover {
    color: #0D291C;
}

/* ── Edit doc button ──────────────────────────── */
.edit-doc-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.67rem;
    font-weight: 800;
    color: #9ca3af;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s;
}

.edit-doc-btn:hover {
    color: #299261;
}

.attempts-badge {
    font-size: 0.6rem;
    font-weight: 700;
    color: #92400e;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 100px;
    padding: 2px 8px;
}

/* ── Alerts ───────────────────────────────────── */
.alert-warn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    font-size: 0.77rem;
    font-weight: 700;
    background: #fffbeb;
    color: #92400e;
    border: 1.5px solid #fde68a;
}

.alert-success {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 0.77rem;
    font-weight: 600;
    color: #166534;
    line-height: 1.45;
}

.alert-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    font-size: 0.77rem;
    font-weight: 700;
    background: #fef2f2;
    color: #dc2626;
    border: 1.5px solid #fecaca;
}

/* ── Alert 409 ────────────────────────────────── */
.alert-409 {
    padding: 14px 16px;
    border-radius: 14px;
    background: #fffbeb;
    border: 1.5px solid #fde68a;
    box-shadow: 0 3px 0 #fcd34d;
}

.btn-go-login {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 900;
    color: #7FD344;
    background: #0D291C;
    border: none;
    cursor: pointer;
    text-decoration: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.2s;
    box-shadow: 0 3px 0 #051510;
}

.btn-go-login:hover {
    background: #1a4a2e;
}

.btn-fix-doc {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 900;
    color: #92400e;
    background: white;
    border: 1.5px solid #fde68a;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.2s;
}

.btn-fix-doc:hover {
    border-color: #f59e0b;
}

/* ── Student card ─────────────────────────────── */
.student-card {
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 16px;
    padding: 16px;
}

.student-card__title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    font-weight: 900;
    color: #0D291C;
}

/* ── Est buttons ──────────────────────────────── */
.est-btn {
    flex: 1;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 800;
    cursor: pointer;
    border: 1.5px solid #d1d5db;
    background: white;
    color: #6b7280;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
}

.est-btn:hover {
    border-color: #299261;
    color: #299261;
}

.est-btn--on {
    background: #0D291C !important;
    color: #7FD344 !important;
    border-color: #0D291C !important;
    box-shadow: 0 3px 0 #051510;
}

/* ── Vehicle buttons ──────────────────────────── */
.remove-placa-btn {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
}

.remove-placa-btn:hover {
    background: #dc2626;
    color: white;
}

.add-placa-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
    font-size: 0.72rem;
    font-weight: 900;
    color: #0D291C;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: color 0.2s;
}

.add-placa-btn:hover {
    color: #299261;
}

.add-placa-icon {
    width: 20px;
    height: 20px;
    border-radius: 8px;
    background: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 0 #051510;
}

/* ── Submit button ────────────────────────────── */
.submit-btn {
    width: 100%;
    padding: 13px 20px;
    background: #0D291C;
    color: #7FD344;
    border: none;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
    box-shadow: 0 4px 0 #051510;
}

.submit-btn:hover:not(:disabled) {
    background: #1a4a2e;
    box-shadow: 0 6px 20px rgba(13, 41, 28, 0.4);
    transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 0 #051510;
}

.submit-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.btn-arrow {
    transition: transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) .btn-arrow {
    transform: translateX(4px);
}

/* ── Spinners ─────────────────────────────────── */
.spinner-sm {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(41, 146, 97, 0.3);
    border-top-color: #299261;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

.spinner-sm--light {
    border-color: rgba(127, 211, 68, 0.3);
    border-top-color: #7FD344;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Success modal ────────────────────────────── */
.success-modal {
    background: white;
    border: 2px solid #0D291C;
    border-radius: 28px;
    width: 100%;
    max-width: 380px;
    overflow: hidden;
    box-shadow: 0 7px 0 #000;
}

.success-modal__head {
    background: #0D291C;
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
}

.success-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    background: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 0 #4a8a1e;
}

.success-modal__body {
    padding: 20px 24px;
}

.success-modal__foot {
    padding: 0 24px 24px;
}

.modal-cta-btn {
    width: 100%;
    padding: 12px;
    border-radius: 100px;
    font-size: 0.82rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    background: #0D291C;
    color: #7FD344;
    border: 2px solid black;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.2s;
    box-shadow: 0 4px 0 #000;
}

.modal-cta-btn:hover {
    background: #1a4a2e;
}

/* ── Transitions ──────────────────────────────── */
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

.modal-enter-active .success-modal {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.modal-leave-active .success-modal {
    animation: popOut 0.18s ease-in both;
}

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
    }

    .mobile-header {
        display: none;
    }

    .form-scroll {
        padding: 28px 44px 40px;
    }
}

@media (max-width: 767px) {
    .reg-root {
        align-items: flex-start;
        padding: 12px;
    }

    .reg-card {
        min-height: auto;
        border-radius: 20px;
    }

    .form-scroll {
        padding: 20px 18px 24px;
    }
}
</style>
