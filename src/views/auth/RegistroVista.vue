<template>
    <!-- Root -->
    <div class="relative min-h-screen w-full bg-[#0D291C] flex items-center justify-center max-[767px]:items-start
                px-5 py-6 max-[767px]:px-4 max-[767px]:py-4 box-border overflow-hidden font-[Plus_Jakarta_Sans,sans-serif]">

        <!-- Blobs -->
        <div class="fixed rounded-full pointer-events-none z-0 blur-[90px]
                    w-[480px] h-[480px] -top-[140px] -left-[140px]"
            style="background:radial-gradient(circle,rgba(41,146,97,0.22) 0%,transparent 70%)" />
        <div class="fixed rounded-full pointer-events-none z-0 blur-[90px]
                    w-[380px] h-[380px] -bottom-[100px] -right-[100px]"
            style="background:radial-gradient(circle,rgba(127,211,68,0.15) 0%,transparent 70%)" />

        <!-- Card -->
        <div class="reg-card relative z-10 flex w-full max-w-[960px] rounded-[28px] max-[767px]:rounded-[20px]
                    overflow-hidden min-h-[580px] max-[767px]:min-h-0" style="border:1.5px solid rgba(127,211,68,0.15);
                   box-shadow:0 0 0 1px rgba(0,0,0,0.4),0 32px 80px rgba(0,0,0,0.55),0 0 60px rgba(127,211,68,0.05)">

            <!-- ── Panel formulario ───────────────────────────── -->
            <div class="flex-1 bg-white flex flex-col min-w-0 relative">

                <!-- Top accent -->
                <div class="absolute top-0 left-0 right-0 h-[3px] z-[2]"
                    style="background:linear-gradient(90deg,#299261,#7FD344 50%,#299261)" />

                <!-- Header mobile -->
                <div class="flex items-center justify-between px-5 py-3.5 border-b-[1.5px] border-slate-100 mt-[3px]
                            md:hidden">
                    <button @click="$router.back()"
                        class="flex items-center gap-1.5 text-[0.76rem] font-extrabold text-[#0D291C] bg-transparent border-none cursor-pointer p-0 transition-colors hover:text-[#299261]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                        Volver
                    </button>
                    <div
                        class="inline-flex items-center gap-1 bg-[#0D291C] text-[#7FD344] text-[0.62rem] font-black px-2.5 py-[5px] rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#7FD344"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {{ sedeNombre }}
                    </div>
                </div>

                <!-- Scroll -->
                <div class="flex-1 overflow-y-auto flex flex-col gap-5
                            px-8 pt-7 pb-8
                            md:px-12 md:pt-8 md:pb-11
                            max-[767px]:px-5 max-[767px]:py-5">


                    <button @click="$router.back()"
                        class="hidden md:flex items-center gap-1.5 text-[0.76rem] font-extrabold text-[#0D291C] bg-transparent border-none cursor-pointer p-0 transition-colors hover:text-[#299261] w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                        Volver
                    </button>
                    <!-- Encabezado -->
                    <div class="flex items-start gap-3">

                        <div class="w-10 h-10 rounded-[14px] bg-[#0D291C] flex items-center justify-center shrink-0"
                            style="box-shadow:0 3px 0 #051510">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-[1.2rem] font-black text-[#0D291C] leading-tight tracking-[-0.02em] mb-1">
                                {{ usuarioEncontrado ? 'Completa tu registro' : 'Crea tu cuenta' }}
                            </h1>
                            <p class="text-[0.75rem] font-semibold text-gray-400 leading-snug m-0">
                                {{ usuarioEncontrado ? 'Encontramos tus datos — revísalos y crea tu contraseña.' :
                                    'Ingresa tu documento para comenzar.' }}
                            </p>
                        </div>
                    </div>

                    <!-- ── DOCUMENTO ── -->
                    <div class="flex flex-col gap-2.5">
                        <p class="section-label">Identificación</p>
                        <div class="flex flex-col gap-1">
                            <label class="field-label-sm">Número de documento <span
                                    class="text-red-400">*</span></label>
                            <div class="relative">
                                <input v-model="form.Documento" type="text" class="field-input"
                                    :class="{ 'field-input--active': buscandoDoc }" placeholder="Ej: 109..."
                                    @input="onDocumentoInput" maxlength="10"
                                    :disabled="formularioListo && !editandoDoc" />
                                <div v-if="buscandoDoc" class="absolute right-3 top-1/2 -translate-y-1/2 flex">
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

                            <Transition name="fade">
                                <div v-if="formularioListo && !editandoDoc && !bloqueado"
                                    class="flex items-center justify-between flex-wrap gap-1.5 mt-1">
                                    <button type="button" @click="habilitarEdicionDoc"
                                        class="inline-flex items-center gap-1.5 text-[0.67rem] font-extrabold text-gray-400 bg-transparent border-none cursor-pointer p-0 underline underline-offset-2 transition-colors hover:text-[#299261]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                        </svg>
                                        ¿Documento incorrecto? Corregir
                                    </button>
                                    <span v-if="busquedasRealizadas > 1"
                                        class="text-[0.6rem] font-bold text-amber-800 bg-amber-50 border border-yellow-200 rounded-full px-2 py-0.5">
                                        {{ LIMITE_BUSQUEDAS - busquedasRealizadas }} intentos restantes
                                    </span>
                                </div>
                            </Transition>

                            <Transition name="fade">
                                <div v-if="bloqueado"
                                    class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[0.77rem] font-bold bg-amber-50 text-amber-800 border-[1.5px] border-yellow-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                    </svg>
                                    Demasiados intentos. Recarga la página para continuar.
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <!-- ── ESTUDIANTE sede 24 ── -->
                    <Transition name="fade">
                        <div v-if="esSede24 && formularioListo"
                            class="bg-green-50 border-[1.5px] border-green-300 rounded-2xl p-4">
                            <div class="flex items-center gap-2 text-[0.82rem] font-black text-[#0D291C]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#0D291C"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                </svg>
                                ¿Eres Comunidad UCC?
                            </div>
                            <div class="flex gap-2 mt-2.5">
                                <button @click="esEstudiante = true" class="est-btn"
                                    :class="{ 'est-btn--on': esEstudiante === true }">
                                    Sí, soy comunidad UCC
                                </button>
                                <button @click="esEstudiante = false; form.CodigoEstudianteUCC = ''" class="est-btn"
                                    :class="{ 'est-btn--on': esEstudiante === false }">
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

                    <!-- ── FORMULARIO COMPLETO ── -->
                    <Transition name="reveal">
                        <div v-if="formularioListo" class="flex flex-col gap-5">

                            <div v-if="usuarioEncontrado"
                                class="flex items-start gap-2 bg-green-50 border-[1.5px] border-green-300 rounded-xl px-3 py-2.5 text-[0.77rem] font-semibold text-green-800 leading-snug">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#166534"
                                    viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Mensualidad encontrada — revisa tus datos y crea tu contraseña para acceder.
                            </div>

                            <!-- Datos personales -->
                            <div class="flex flex-col gap-2.5">
                                <p class="section-label">Datos personales</p>
                                <div class="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
                                    <div class="flex flex-col gap-1">
                                        <label class="field-label-sm">Nombres <span
                                                class="text-red-400">*</span></label>
                                        <input ref="inputNombres" v-model="form.Nombres" type="text" class="field-input"
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
                                        <input v-model="form.Telefono" type="text" class="field-input" placeholder=""
                                            @input="form.Telefono = $event.target.value.replace(/\D/g, '')" />
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <label class="field-label-sm">Correo electrónico <span
                                                class="text-red-400">*</span></label>
                                        <input v-model="form.Email" type="email" class="field-input" placeholder="" />
                                    </div>
                                    <div class="col-span-2 max-[480px]:col-span-1 flex flex-col gap-1">
                                        <label class="field-label-sm">Contraseña <span
                                                class="text-red-400">*</span></label>
                                        <div class="relative">
                                            <input v-model="form.Password" :type="verPass ? 'text' : 'password'"
                                                class="field-input" placeholder="Mínimo 8 caracteres" />
                                            <button type="button" @click="verPass = !verPass"
                                                class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0 flex transition-colors hover:text-[#0D291C]">
                                                <svg v-if="!verPass" xmlns="http://www.w3.org/2000/svg" width="15"
                                                    height="15" fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                </svg>
                                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                                    fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Vehículos -->
                            <div class="flex flex-col gap-2.5">
                                <p class="section-label">Vehículos</p>

                                <!-- Aviso placas bloqueadas -->
                                <!-- <div v-if="placasBloqueadas"
                                    class="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[0.75rem] font-semibold bg-amber-50 text-amber-800 border-[1.5px] border-amber-200 leading-snug">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#92400e"
                                        viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                        <path
                                            d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                    </svg>
                                    <span>Tu mensualidad está vigente — las placas no se pueden modificar durante el
                                        registro. Si necesitas cambiarlas, hazlo desde el portal una vez activo tu
                                        usuario.</span>
                                </div> -->

                                <div class="flex flex-col gap-2.5">
                                    <div v-for="(_, idx) in form.placas" :key="idx" class="flex flex-col gap-1">
                                        <label class="field-label-sm">Placa {{ idx + 1 }}{{ idx === 0 ? ' *' : ''
                                            }}</label>
                                        <div class="flex gap-2 items-center">
                                            <input v-model="form.placas[idx]" type="text"
                                                class="field-input placa-input flex-1"
                                                :class="{ 'opacity-60 cursor-not-allowed bg-gray-50': placasBloqueadas }"
                                                placeholder="" maxlength="6" :disabled="placasBloqueadas" />
                                            <button v-if="idx > 0 && !placasBloqueadas" type="button"
                                                @click="form.placas.splice(idx, 1)"
                                                class="w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center bg-red-100 text-red-600 border-none cursor-pointer transition-all hover:bg-red-600 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                                                    fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button v-if="form.placas.length < 2 && !placasBloqueadas" type="button"
                                        @click="form.placas.push('')"
                                        class="flex items-center gap-1.5 w-fit text-[0.72rem] font-black text-[#0D291C] bg-transparent border-none cursor-pointer p-0 transition-colors hover:text-[#299261]">
                                        <span
                                            class="w-5 h-5 rounded-lg bg-[#0D291C] flex items-center justify-center shrink-0"
                                            style="box-shadow:0 2px 0 #051510">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                                fill="#7FD344" viewBox="0 0 24 24">
                                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                            </svg>
                                        </span>
                                        Agregar otra placa
                                    </button>
                                </div>
                            </div>

                            <!-- Términos y condiciones -->
                            <label class="flex items-start gap-2.5 cursor-pointer select-none">
                                <div class="relative flex-shrink-0 mt-0.5">
                                    <input type="checkbox" v-model="aceptoTerminos" class="sr-only" />
                                    <div class="w-4 h-4 rounded-[5px] border-2 flex items-center justify-center transition-all"
                                        :class="aceptoTerminos
                                            ? 'bg-[#0D291C] border-[#0D291C]'
                                            : 'bg-white border-gray-300'">
                                        <svg v-if="aceptoTerminos" xmlns="http://www.w3.org/2000/svg" width="9"
                                            height="9" fill="#7FD344" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </div>
                                </div>
                                <span class="text-[0.72rem] font-semibold text-gray-500 leading-snug">
                                    He leído y acepto los
                                    <a href="/terminos" target="_blank"
                                        class="font-black text-[#299261] hover:underline">
                                        Términos y condiciones
                                    </a>
                                    y la
                                    <a href="/privacidad" target="_blank"
                                        class="font-black text-[#299261] hover:underline">
                                        Política de privacidad
                                    </a>
                                </span>
                            </label>

                            <!-- Error 409 -->
                            <Transition name="fade">
                                <div v-if="errSubmit === '409'"
                                    class="px-4 py-3.5 rounded-[14px] bg-amber-50 border-[1.5px] border-yellow-200"
                                    style="box-shadow:0 3px 0 #fcd34d">
                                    <div class="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#92400e"
                                            viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                        <div>
                                            <p class="text-[0.8rem] font-black text-amber-800 leading-tight">Este
                                                documento ya tiene una cuenta</p>
                                            <p class="text-[0.72rem] font-semibold text-amber-700 mt-0.5 leading-snug">
                                                El documento <strong>{{ form.Documento }}</strong> ya está registrado en
                                                el sistema.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 mt-3">
                                        <router-link to="/login"
                                            class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-[0.72rem] font-black text-[#7FD344] bg-[#0D291C] border-none cursor-pointer no-underline transition-colors hover:bg-[#1a4a2e]"
                                            style="box-shadow:0 3px 0 #051510">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                                            </svg>
                                            Iniciar sesión
                                        </router-link>
                                        <button type="button" @click="habilitarEdicionDoc"
                                            class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-[0.72rem] font-black text-amber-800 bg-white border-[1.5px] border-yellow-200 cursor-pointer transition-colors hover:border-amber-400">
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

                            <!-- Error 409 — email duplicado -->
                            <Transition name="fade">
                                <div v-if="errSubmit === '409_email'"
                                    class="px-4 py-3.5 rounded-[14px] bg-blue-50 border-[1.5px] border-blue-200"
                                    style="box-shadow:0 3px 0 #bfdbfe">
                                    <div class="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1d4ed8"
                                            viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                            <path
                                                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                        <div>
                                            <p class="text-[0.8rem] font-black text-blue-900 leading-tight">Este correo
                                                ya tiene una cuenta</p>
                                            <p class="text-[0.72rem] font-semibold text-blue-700 mt-0.5 leading-snug">
                                                El correo <strong>{{ form.Email }}</strong> ya está registrado. Inicia
                                                sesión o usa otro correo.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 mt-3">
                                        <router-link to="/login"
                                            class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-[0.72rem] font-black text-[#7FD344] bg-[#0D291C] border-none cursor-pointer no-underline transition-colors hover:bg-[#1a4a2e]"
                                            style="box-shadow:0 3px 0 #051510">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                                            </svg>
                                            Iniciar sesión
                                        </router-link>
                                        <button type="button" @click="form.Email = ''; errSubmit = ''"
                                            class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-[0.72rem] font-black text-blue-800 bg-white border-[1.5px] border-blue-200 cursor-pointer transition-colors hover:border-blue-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                            </svg>
                                            Cambiar correo
                                        </button>
                                    </div>
                                </div>
                            </Transition>

                            <!-- Error genérico -->
                            <Transition name="fade">
                                <div v-if="errSubmit && errSubmit !== '409' && errSubmit !== '409_email'"
                                    class="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[0.77rem] font-bold bg-red-50 text-red-600 border-[1.5px] border-red-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                        viewBox="0 0 24 24" class="shrink-0 mt-0.5">
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
                                <svg v-if="!guardando" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                    class="btn-arrow transition-transform">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>

                            <p class="text-center text-xs font-semibold text-gray-400">
                                ¿Ya tienes cuenta?
                                <router-link to="/login" class="font-bold text-[#299261] hover:underline">Inicia
                                    sesión</router-link>
                            </p>
                        </div>
                    </Transition>



                    <!-- ── MODAL ÉXITO ── -->
                    <Transition name="modal">
                        <div v-if="modalExito" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style="background:rgba(0,0,0,0.65)">
                            <div class="bg-white border-2 border-[#0D291C] rounded-[28px] w-full max-w-[380px] overflow-hidden"
                                style="box-shadow:0 7px 0 #000">
                                <div class="bg-[#0D291C] px-6 py-7 flex flex-col items-center gap-3.5">
                                    <div class="w-14 h-14 rounded-[18px] bg-[#7FD344] flex items-center justify-center"
                                        style="box-shadow:0 4px 0 #4a8a1e">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0D291C"
                                            viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-[1rem] font-black text-white">¡Registro exitoso!</p>
                                        <p class="text-[0.68rem] font-semibold mt-1 text-white/50">Tu cuenta ha sido
                                            creada correctamente</p>
                                    </div>
                                </div>
                                <div class="px-6 py-5">
                                    <p class="text-[0.82rem] font-semibold text-gray-700 text-center leading-relaxed">
                                        Ya puedes iniciar sesión con tu documento y contraseña en la sede
                                        <strong class="text-[#0D291C]">{{ sedeNombre }}</strong>.
                                    </p>
                                </div>
                                <div class="px-6 pb-6">
                                    <button @click="router.push({ name: 'login' })"
                                        class="w-full py-3 rounded-full text-[0.82rem] font-black uppercase tracking-[0.06em] cursor-pointer bg-[#0D291C] text-[#7FD344] border-2 border-black transition-colors hover:bg-[#1a4a2e]"
                                        style="box-shadow:0 4px 0 #000">
                                        Ir al inicio de sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition>

                </div>
            </div>

            <!-- ── Panel visual (derecha) ── -->
            <div class="brand-side hidden md:flex flex-col items-center justify-between
                        px-8 pt-10 pb-11 w-[42%] shrink-0 relative overflow-hidden" style="background:linear-gradient(160deg,#183d26 0%,#0D291C 45%,#071810 100%);
                       border-left:1px solid rgba(255,255,255,0.05)">

                <!-- Logo -->
                <div class="w-full flex items-center justify-between relative z-[2]">
                    <img src="@/assets/img/confy-blanco.png" alt="Logo"
                        class="max-h-[52px] max-w-[130px] object-contain"
                        @error="$event.target.style.display = 'none'" />
                    <span class="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
                        style="color:rgba(127,211,68,0.6);background:rgba(127,211,68,0.08);border:1px solid rgba(127,211,68,0.2)">
                        Registro
                    </span>
                </div>

                <!-- Focal -->
                <div class="relative w-[180px] h-[180px] flex items-center justify-center z-[2]">
                    <div class="focal-ring absolute rounded-full w-[180px] h-[180px] focal-ring--outer"
                        style="border:1.5px solid rgba(127,211,68,0.15)" />
                    <div class="focal-ring absolute rounded-full w-[130px] h-[130px] focal-ring--mid"
                        style="border:1.5px solid rgba(127,211,68,0.22)" />
                    <div class="absolute rounded-full w-[88px] h-[88px]"
                        style="border:1.5px solid rgba(127,211,68,0.3);background:rgba(127,211,68,0.04)" />
                    <div class="w-[68px] h-[68px] rounded-[22px] flex items-center justify-center relative z-[2]"
                        style="background:linear-gradient(135deg,#1a5c36,#0a2516);border:1.5px solid rgba(127,211,68,0.3);box-shadow:0 0 0 4px rgba(127,211,68,0.07),0 8px 28px rgba(0,0,0,0.3)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#7FD344"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                    </div>
                </div>

                <!-- Copy -->
                <div class="text-center relative z-[2]">
                    <h2 class="text-[1.55rem] font-extrabold text-white leading-[1.18] tracking-[-0.03em] mb-2.5">
                        Tu parqueo,<br />tu control
                    </h2>
                    <p class="text-[0.76rem] font-medium leading-relaxed max-w-[220px] mx-auto"
                        style="color:rgba(255,255,255,0.38)">
                        Gestiona tu mensualidad de forma fácil, rápida y segura desde cualquier lugar.
                    </p>
                </div>

                <!-- Sede pill -->
                <div class="flex flex-col items-center gap-1.5 relative z-[2]">
                    <div class="inline-flex items-center gap-1.5 text-[#7FD344] text-[0.72rem] font-extrabold px-3.5 py-[7px] rounded-full"
                        style="background:rgba(127,211,68,0.12);border:1px solid rgba(127,211,68,0.28)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {{ sedeNombre }}
                    </div>
                    <p class="text-[0.6rem] font-medium text-center" style="color:rgba(255,255,255,0.25)">
                        Sede seleccionada para este registro
                    </p>
                </div>

                <!-- Decorativos -->
                <div class="absolute rounded-full w-[300px] h-[300px] -top-20 -right-20 pointer-events-none"
                    style="background:radial-gradient(circle,rgba(127,211,68,0.12) 0%,transparent 70%)" />
                <div class="absolute rounded-full w-[200px] h-[200px] -bottom-10 -left-[50px] pointer-events-none"
                    style="background:radial-gradient(circle,rgba(127,211,68,0.12) 0%,transparent 70%)" />
                <div class="absolute bottom-0 left-0 right-0 h-[160px] pointer-events-none"
                    style="background:linear-gradient(to top,rgba(127,211,68,0.04),transparent)" />
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
                            <p class="tutorial-title">Crear tu cuenta</p>
                            <p class="tutorial-subtitle">¿Cómo completar el registro?</p>
                        </div>
                        <button @click="showTutorial = false" class="tutorial-close">✕</button>
                    </div>
                    <div class="tutorial-body">

                        <div class="tutorial-divider">Opciones principales</div>

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
                                <p class="tutorial-step-desc">Ingresa tu cédula. Buscaremos automáticamente tu
                                    mensualidad activa en esta sede para pre-llenar los datos.</p>
                            </div>
                        </div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon" style="background:#eff6ff;border-color:#bfdbfe;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">
                                    Datos personales</p>
                                <p class="tutorial-step-desc">Revisa o completa tu nombre, apellidos, teléfono y correo
                                    electrónico.</p>
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
                                <p class="tutorial-step-desc">Crea una contraseña de mínimo 8 caracteres para acceder a
                                    tu cuenta.</p>
                            </div>
                        </div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon" style="background:#fefce8;border-color:#fde68a;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#854d0e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <rect x="1" y="3" width="15" height="13" rx="2" />
                                    <path d="M16 8h4l3 5v3h-7V8z" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">
                                    Vehículos / Placas</p>
                                <p class="tutorial-step-desc">Registra la placa de tu vehículo (ej: ABC123 carro ·
                                    ABC12D moto). Puedes agregar hasta 2 placas.</p>
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
                                    Crear cuenta</p>
                                <p class="tutorial-step-desc">Lee y acepta los términos y condiciones, luego presiona
                                    este
                                    botón para finalizar tu registro.</p>
                            </div>
                        </div>

                        <div class="tutorial-divider">Opciones adicionales</div>

                        <div class="tutorial-step">
                            <div class="tutorial-step-icon"
                                style="background:#f5f3ff;border-color:#ddd6fe;margin-left:0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    stroke="#5b21b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    viewBox="0 0 24 24">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            </div>
                            <div class="tutorial-step-body">
                                <p class="tutorial-step-title">¿Ya tienes cuenta?</p>
                                <p class="tutorial-step-desc">Si ya estás registrado, ve al inicio de sesión desde el
                                    enlace al final del formulario.</p>
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
import { ref, reactive, computed, nextTick } from 'vue'
import { showError, showSuccess, showConfirm } from '@/utils/swal'
import { useRoute, useRouter } from 'vue-router'
import ClientService from '@/api/services/client.service'
import MensualidadesService from '@/api/services/mensualidades.service'

const showTutorial = ref(false)
const inputNombres = ref(null)
const aceptoTerminos = ref(false)
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

const detectarTipoVehiculo = (placa) => {
    if (!placa) return null
    const p = placa.trim().toUpperCase()
    if (/^[A-Z]{3}[0-9]{3}$/.test(p)) return 1
    if (/^[A-Z]{3}[0-9]{2}[A-Z]$/.test(p)) return 2
    return null
}

const habilitarEdicionDoc = () => {
    if (bloqueado.value) return
    formularioListo.value = false
    usuarioEncontrado.value = false
    editandoDoc.value = true
    msgDoc.value = ''
    errSubmit.value = ''
    mensualidadData.value = null
    Object.assign(form, { Nombres: '', Apellidos: '', Telefono: '', Email: '', Password: '', CodigoEstudianteUCC: '', EstudianteUcc: false, placas: [''] })
    esEstudiante.value = null
}

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
    if (doc.length >= 7) docTimer = setTimeout(() => buscarDocumento(doc), 900)
}

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
            msgDoc.value = 'No se encontró mensualidad activa — completa el formulario'
            formularioListo.value = true
            enfocarNombres()
            return
        }
        const d = res.data ?? res
        console.log('[RegistroVista] usuario antiguo:', d)
        console.log('[RegistroVista] fechaFin:', d.fechaFin, '| hoy:', new Date().toISOString(), '| vigente:', d.fechaFin ? new Date(d.fechaFin) > new Date() : false)
        mensualidadData.value = d
        usuarioEncontrado.value = true
        const partes = (d.nombreApellidos ?? '').trim().split(/\s+/)
        const mitad = Math.ceil(partes.length / 2)
        Object.assign(form, {
            Documento: String(d.documento ?? doc),
            Nombres: partes.slice(0, mitad).join(' '),
            IdTarjeta: d.idTarjeta ?? null,
            Apellidos: partes.slice(mitad).join(' '),
            IdAutorizacion: d.idAutorizacion,
            FechaInicio: d.fechaInicio,
            FechaFin: d.fechaFin,
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
        enfocarNombres()
    } catch {
        mensualidadData.value = null
        usuarioEncontrado.value = false
        limpiarCampos()
        msgDoc.value = 'No se pudo verificar — completa el formulario manualmente'
        formularioListo.value = true
        enfocarNombres()
    } finally {
        buscandoDoc.value = false
    }
}

// Placas bloqueadas si el usuario ya existe en el sistema (usuario antiguo)
const placasBloqueadas = computed(() => {
    if (!usuarioEncontrado.value) return false
    const fechaFin = mensualidadData.value?.fechaFin
    if (!fechaFin) return false
    return new Date(fechaFin) > new Date()
})

const enfocarNombres = () => nextTick(() => inputNombres.value?.focus())

const limpiarCampos = () => {
    Object.assign(form, { Nombres: '', IdTarjeta: '', Apellidos: '', Telefono: '', Email: '', Password: '', CodigoEstudianteUCC: '', EstudianteUcc: false, placas: [''] })
    esEstudiante.value = null
}

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validarFormulario = () => {
    errSubmit.value = ''
    if (!form.Documento || !form.Nombres || !form.Apellidos) { errSubmit.value = 'Nombre, apellidos y documento son obligatorios.'; return false }
    if (!form.Telefono || form.Telefono.length < 7) { errSubmit.value = 'Ingresa un teléfono de contacto válido.'; return false }
    if (!form.Email || !emailValido(form.Email)) { errSubmit.value = 'Ingresa un correo electrónico válido.'; return false }
    if (!form.Password || form.Password.length < 8) { errSubmit.value = 'La contraseña debe tener mínimo 8 caracteres.'; return false }
    if (!placasBloqueadas.value) {
        if (!form.placas[0]?.trim()) { errSubmit.value = 'Ingresa al menos la placa principal del vehículo.'; return false }
        if (detectarTipoVehiculo(form.placas[0]) === null) { errSubmit.value = 'El formato de la placa principal no es válido (ej: ABC123 para carro, ABC12D para moto).'; return false }
    }
    if (esSede24.value && esEstudiante.value === null) { errSubmit.value = 'Indica si eres estudiante UCC o no.'; return false }
    if (esSede24.value && esEstudiante.value === true && !form.CodigoEstudianteUCC) { errSubmit.value = 'Ingresa tu código de estudiante UCC.'; return false }
    if (!aceptoTerminos.value) { errSubmit.value = 'Debes aceptar los términos y condiciones para continuar.'; return false }
    return true
}


const buildPayload = (esOld) => {
    const m = mensualidadData.value
    const { placas, CodigoEstudianteUCC, EstudianteUcc, ...rest } = form

    return {
        Documento: rest.Documento,
        Nombres: rest.Nombres,
        Apellidos: rest.Apellidos,
        IdTarjeta: m?.idTarjeta ?? rest.IdTarjeta ?? null,
        Telefono: rest.Telefono,
        Email: rest.Email,
        Password: rest.Password,
        IdEstacionamiento: idSede.value,
        Estado: true,
        Sincronizacion: m?.sincronizacion ?? false,
        Old: esOld,
        IdAutorizacion: m?.idAutorizacion ?? null,
        FechaInicio: esOld ? (m?.fechaInicio ?? null) : null,
        FechaFin: esOld ? (m?.fechaFin ?? null) : null,
        Placa1: placas[0] || null,
        Placa2: placas[1] || null,
        Placa3: placas[2] || null,
        Placa4: placas[3] || null,
        Placa5: placas[4] || null,
        EstudianteUcc: esSede24.value ? (esEstudiante.value === true) : false,
        CodigoEstudianteUCC: esSede24.value && esEstudiante.value === true ? CodigoEstudianteUCC : '',
    }
}

const submit = async () => {
    if (!validarFormulario()) return
    guardando.value = true
    errSubmit.value = ''

    const esOld = !!mensualidadData.value
    const payload = buildPayload(esOld)
    const res = await ClientService.createClient(payload)

    guardando.value = false

    if (res?.error) {
        const status = res.status
        const msg = res.data?.message ?? ''
        const msgStr = Array.isArray(msg) ? msg.join(', ') : msg

        if (status === 409) {
            if (msgStr.toLowerCase().includes('email')) {
                errSubmit.value = '409_email'
            } else if (msgStr.toLowerCase().includes('documento') || msgStr.toLowerCase().includes('usuario')) {
                errSubmit.value = '409'
            } else {
                // 409 genérico (placas, otros) → SweetAlert
                showError({ status, data: res.data })
            }
        } else {
            errSubmit.value = msgStr || 'Error al registrar. Intenta de nuevo.'
            showError({ status, data: res.data })
        }
        return
    }

    modalExito.value = true
}
</script>

<style scoped>
/* ── Animación card entrada ── */
.reg-card {
    animation: cardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(26px) scale(0.97)
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1)
    }
}

/* ── Anillos del focal con animación ── */
.focal-ring--outer {
    animation: ringPulse 3.5s ease-in-out infinite
}

.focal-ring--mid {
    animation: ringPulse 3.5s ease-in-out 0.5s infinite
}

@keyframes ringPulse {

    0%,
    100% {
        opacity: 0.6;
        transform: scale(1)
    }

    50% {
        opacity: 1;
        transform: scale(1.02)
    }
}

/* ── Inputs (múltiples !important para pisar estilos globales) ── */
.field-input {
    width: 100%;
    box-sizing: border-box;
    border: 1.5px solid #e8ecf0 !important;
    border-radius: 14px !important;
    padding: 13px 16px !important;
    font-size: 0.92rem !important;
    color: #0D291C !important;
    background: #f7f8fa !important;
    outline: none !important;
    box-shadow: none !important;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    font-family: "Funnel Display", sans-serif;
}

.field-input:focus {
    border-color: #299261 !important;
    background: white !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.1) !important
}

.field-input:disabled {
    background: #f3f4f6 !important;
    color: #9ca3af !important;
    cursor: not-allowed
}

.field-input--active {
    border-color: #299261 !important
}

.field-label-sm {
    font-size: 0.58rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.5;
    padding-left: 2px;
}

.placa-input {
    text-transform: uppercase !important;
    letter-spacing: 0.12em !important;
    font-weight: 600 !important
}

/* ── Section label ── */
.section-label {
    font-size: 0.56rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #0D291C;
    opacity: 0.32;
    border-bottom: 1px solid rgba(13, 41, 28, 0.08);
    padding-bottom: 5px;
    margin: 0;
}

/* ── Est buttons ── */
.est-btn {
    flex: 1;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    border: 1.5px solid #d1d5db;
    background: white;
    color: #6b7280;
    font-family: "Funnel Display", sans-serif;
    transition: all 0.15s;
}

.est-btn:hover {
    border-color: #299261;
    color: #299261
}

.est-btn--on {
    background: #0D291C !important;
    color: #7FD344 !important;
    border-color: #0D291C !important;
    box-shadow: 0 3px 0 #051510
}

/* ── Submit ── */
.submit-btn {
    width: 100%;
    padding: 13px 20px;
    background: #0D291C;
    color: #7FD344;
    border: none;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 700;
    font-family: "Funnel Display", sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
    box-shadow: 0 4px 0 #051510;
}

.submit-btn:hover:not(:disabled) {
    background: #1a4a2e;
    box-shadow: 0 6px 20px rgba(13, 41, 28, 0.4);
    transform: translateY(-1px)
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 0 #051510
}

.submit-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed
}

.submit-btn:hover:not(:disabled) .btn-arrow {
    transform: translateX(4px)
}

/* ── Spinner ── */
.spinner-sm {
    display: inline-block;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border: 2px solid rgba(41, 146, 97, 0.3);
    border-top-color: #299261;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

.spinner-sm--light {
    border-color: rgba(127, 211, 68, 0.3);
    border-top-color: #7FD344
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}

/* ── Vue Transitions ── */
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

.modal-enter-active .success-modal {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both
}

.modal-leave-active .success-modal {
    animation: popOut 0.18s ease-in both
}

@keyframes popIn {
    from {
        transform: scale(0.86) translateY(24px);
        opacity: 0
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1
    }
}

@keyframes popOut {
    from {
        transform: scale(1) translateY(0);
        opacity: 1
    }

    to {
        transform: scale(0.92) translateY(12px);
        opacity: 0
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px)
}

.reveal-enter-active {
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)
}

.reveal-leave-active {
    transition: opacity 0.15s ease
}

.reveal-enter-from {
    opacity: 0;
    transform: translateY(10px)
}

.reveal-leave-to {
    opacity: 0
}

@media (prefers-reduced-motion:reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important
    }
}
</style>