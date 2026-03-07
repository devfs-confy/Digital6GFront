<template>
    <div class="min-h-screen w-full bg-[#0D291C] flex items-center justify-center p-4 md:p-6 box-border">
        <div class="w-full max-w-[820px] flex rounded-[28px] overflow-hidden border-2 border-[rgba(127,211,68,0.25)] min-h-[580px]"
            style="box-shadow:0 0 0 1px rgba(0,0,0,0.5),0 32px 64px rgba(0,0,0,0.55),0 0 60px rgba(127,211,68,0.08)">

            <!-- ── Panel izquierdo ──────────────────────────────── -->
            <div
                class="hidden md:flex w-[260px] shrink-0 bg-[#7FD344] p-8 flex-col justify-between relative overflow-hidden border-r-2 border-[rgba(13,41,28,0.15)]">

                <!-- Logo --><img src="@/assets/img/confy-verde.png" alt="Logo"
                    class="max-h-full  object-contain max-w-full" @error="$event.target.style.display = 'none'" />


                <!-- Texto -->
                <div class="relative z-10">
                    <h2 class="text-[1.3rem] font-black text-[#0D291C] leading-tight mb-2">Bienvenido al<br />sistema
                    </h2>
                    <p class="text-[0.76rem] font-semibold text-[rgba(13,41,28,0.6)] leading-relaxed">
                        Gestiona tu mensualidad de parqueo de forma fácil y rápida.
                    </p>
                </div>

                <!-- Sede -->
                <div class="relative z-10 flex flex-col gap-1.5">
                    <div class="inline-flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-[0.68rem] font-black px-3 py-1.5 rounded-full w-fit"
                        style="box-shadow:0 3px 0 rgba(5,21,16,0.4)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="#7FD344"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {{ sedeNombre }}
                    </div>
                    <p class="text-[0.62rem] font-semibold text-[rgba(13,41,28,0.45)] pl-0.5">
                        Selecciona tu sede para comenzar el registro
                    </p>
                </div>

                <!-- Círculos decorativos -->
                <div class="absolute rounded-full bg-[rgba(13,41,28,0.07)]"
                    style="width:200px;height:200px;top:-70px;right:-70px" />
                <div class="absolute rounded-full bg-[rgba(13,41,28,0.07)]"
                    style="width:130px;height:130px;bottom:50px;right:-40px" />
                <div class="absolute rounded-full bg-[rgba(13,41,28,0.07)]"
                    style="width:70px;height:70px;bottom:-15px;left:10px" />
            </div>

            <!-- ── Panel formulario ─────────────────────────────── -->
            <div class="flex-1 bg-white flex flex-col min-w-0">

                <!-- Header mobile -->
                <div class="flex md:hidden items-center justify-between px-5 py-3.5 border-b-[1.5px] border-gray-100">
                    <button @click="$router.back()"
                        class="flex items-center gap-1.5 text-[0.76rem] font-black text-[#0D291C] bg-transparent border-none cursor-pointer p-0 hover:text-[#299261] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                        Volver
                    </button>
                    <div
                        class="inline-flex items-center gap-1 bg-[#0D291C] text-[#7FD344] text-[0.62rem] font-black px-2.5 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#7FD344"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {{ sedeNombre }}
                    </div>
                </div>

                <!-- Scroll -->
                <div class="flex-1 overflow-y-auto flex flex-col gap-5 p-7 sm:p-4">

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
                            <h1 class="text-[1.25rem] font-black text-[#0D291C] leading-tight m-0 mb-0.5">
                                {{ usuarioEncontrado ? 'Completa tu registro' : 'Crea tu cuenta' }}
                            </h1>
                            <p class="text-[0.75rem] font-semibold text-gray-400 leading-snug">
                                {{ usuarioEncontrado ? 'Encontramos tus datos — revísalos y crea tu contraseña.' :
                                    'Ingresa tu documento para comenzar.' }}
                            </p>
                        </div>
                    </div>

                    <!-- ── DOCUMENTO ──────────────────────────────── -->
                    <div class="flex flex-col gap-2.5">
                        <p
                            class="text-[0.56rem] font-black uppercase tracking-widest text-[#0D291C] opacity-35 border-b border-[rgba(13,41,28,0.08)] pb-1">
                            Identificación</p>
                        <div class="flex flex-col gap-1">
                            <label
                                class="text-[0.58rem] font-black uppercase tracking-wide text-[#0D291C] opacity-50 pl-0.5">
                                Número de documento <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <input v-model="form.Documento" type="text" class="field-input"
                                    :class="{ 'field-input--active': buscandoDoc }" placeholder="Ej: 109..."
                                    @input="onDocumentoInput" :disabled="formularioListo && !editandoDoc" />
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

                            <p v-if="msgDoc" class="text-[0.66rem] font-semibold pl-0.5"
                                :class="usuarioEncontrado ? 'text-[#299261]' : 'text-gray-400'">
                                {{ msgDoc }}
                            </p>

                            <!-- Editar documento -->
                            <Transition name="fade">
                                <div v-if="formularioListo && !editandoDoc && !bloqueado"
                                    class="flex items-center justify-between flex-wrap gap-1.5 mt-0.5">
                                    <button type="button" @click="habilitarEdicionDoc"
                                        class="inline-flex items-center gap-1.5 text-[0.67rem] font-black text-gray-400 bg-transparent border-none cursor-pointer p-0 underline underline-offset-2 hover:text-[#299261] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                        </svg>
                                        ¿Documento incorrecto? Corregir
                                    </button>
                                    <span v-if="busquedasRealizadas > 1"
                                        class="text-[0.6rem] font-bold text-amber-600 bg-amber-50 border border-amber-300 rounded-full px-2 py-0.5">
                                        {{ LIMITE_BUSQUEDAS - busquedasRealizadas }} intentos restantes
                                    </span>
                                </div>
                            </Transition>

                            <!-- Bloqueado -->
                            <Transition name="fade">
                                <div v-if="bloqueado"
                                    class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[0.77rem] font-bold bg-amber-50 text-amber-800 border-2 border-amber-300"
                                    style="box-shadow:0 3px 0 #fcd34d">
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

                    <!-- ── ALERTA ESTUDIANTE sede 24 ──────────────── -->
                    <Transition name="fade">
                        <div v-if="esSede24 && formularioListo"
                            class="bg-[#f0fdf4] border-2 border-[#86efac] rounded-2xl p-4"
                            style="box-shadow:0 3px 0 #c8e6c9">
                            <div class="flex items-center gap-2 text-[0.82rem] font-black text-[#0D291C]">
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
                                <button @click="esEstudiante = false; form.CodigoEstudianteUCC = ''" class="est-btn"
                                    :class="{ 'est-btn--on': esEstudiante === false }">
                                    No, continuar
                                </button>
                            </div>
                            <Transition name="fade">
                                <div v-if="esEstudiante === true" class="flex flex-col gap-1 mt-3">
                                    <label
                                        class="text-[0.58rem] font-black uppercase tracking-wide text-[#0D291C] opacity-50 pl-0.5">
                                        Código estudiante UCC <span class="text-red-400">*</span>
                                    </label>
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
                            <div v-if="usuarioEncontrado"
                                class="flex items-start gap-2 bg-[#f0fdf4] border-2 border-[#86efac] rounded-xl px-3 py-2.5 text-[0.77rem] font-semibold text-[#166534] leading-snug"
                                style="box-shadow:0 3px 0 #c8e6c9">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#166534"
                                    viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Mensualidad encontrada — revisa tus datos y crea tu contraseña para acceder.
                            </div>

                            <!-- Datos personales -->
                            <div class="flex flex-col gap-2.5">
                                <p
                                    class="text-[0.56rem] font-black uppercase tracking-widest text-[#0D291C] opacity-35 border-b border-[rgba(13,41,28,0.08)] pb-1">
                                    Datos personales</p>
                                <div class="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
                                    <div class="flex flex-col gap-1">
                                        <label class="field-label-sm">Nombres <span
                                                class="text-red-400">*</span></label>
                                        <input v-model="form.Nombres" type="text" class="field-input" placeholder="" />
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
                                                class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0 hover:text-[#0D291C] transition-colors">
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
                                <p
                                    class="text-[0.56rem] font-black uppercase tracking-widest text-[#0D291C] opacity-35 border-b border-[rgba(13,41,28,0.08)] pb-1">
                                    Vehículos</p>
                                <div class="flex flex-col gap-2.5">
                                    <div v-for="(_, idx) in form.placas" :key="idx" class="flex flex-col gap-1">
                                        <label class="field-label-sm">Placa {{ idx + 1 }}{{ idx === 0 ? ' *' : ''
                                            }}</label>
                                        <div class="flex gap-2 items-center">
                                            <input v-model="form.placas[idx]" type="text"
                                                class="field-input placa-input flex-1" :placeholder="``"
                                                maxlength="7" />
                                            <button v-if="idx > 0" type="button" @click="form.placas.splice(idx, 1)"
                                                class="w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center bg-red-100 text-red-600 border-none cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                                                    fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button v-if="form.placas.length < 2" type="button" @click="form.placas.push('')"
                                        class="flex items-center gap-1.5 w-fit text-[0.72rem] font-black text-[#0D291C] bg-transparent border-none cursor-pointer p-0 hover:text-[#299261] transition-colors">
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

                            <!-- Error -->
                            <Transition name="fade">
                                <div v-if="errSubmit === '409'"
                                    class="flex flex-col gap-3 px-4 py-3.5 rounded-xl border-2 border-amber-300 bg-amber-50"
                                    style="box-shadow:0 3px 0 #fcd34d">
                                    <div class="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#92400e"
                                            viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                        <div>
                                            <p class="text-[0.8rem] font-black text-amber-800 leading-tight">
                                                Este documento ya tiene una cuenta
                                            </p>
                                            <p class="text-[0.72rem] font-semibold text-amber-700 mt-0.5 leading-snug">
                                                El documento <strong>{{ form.Documento }}</strong> ya está registrado en
                                                el sistema.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <router-link to="/login"
                                            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.72rem] font-black text-[#7FD344] bg-[#0D291C] border-none cursor-pointer no-underline transition-all hover:bg-[#1a4a2e]"
                                            style="box-shadow:0 3px 0 #051510">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                                            </svg>
                                            Iniciar sesión
                                        </router-link>
                                        <button type="button" @click="habilitarEdicionDoc"
                                            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.72rem] font-black text-amber-800 bg-white border-2 border-amber-300 cursor-pointer transition-all hover:border-amber-500">
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
                                <div v-if="errSubmit && errSubmit !== '409'"
                                    class="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[0.77rem] font-bold bg-red-50 text-red-700 border-2 border-red-300"
                                    style="box-shadow:0 3px 0 #fca5a5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                        viewBox="0 0 24 24" class="shrink-0 mt-0.5">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    {{ errSubmit }}
                                </div>
                            </Transition>

                            <!-- Submit -->
                            <button @click="submit" :disabled="guardando"
                                class="w-full py-3 bg-[#0D291C] text-[#7FD344] border-2 border-[#0D291C] rounded-xl text-[0.88rem] font-black cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#1a4a2e] active:translate-y-[3px]"
                                style="box-shadow:0 4px 0 #051510">
                                <span v-if="guardando" class="spinner-sm spinner-sm--light" />
                                {{ guardando ? 'Registrando...' : 'Crear cuenta' }}
                            </button>

                            <p class="text-center text-xs font-semibold text-gray-400 -mt-2">
                                ¿Ya tienes cuenta?
                                <router-link to="/login" class="font-black text-[#299261] hover:underline">Inicia
                                    sesión</router-link>
                            </p>

                        </div>




                    </Transition>

                    <!-- ── MODAL ÉXITO ──────────────────────────────────────────── -->
                    <Transition name="modal">
                        <div v-if="modalExito" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style="background:rgba(0,0,0,0.6)">
                            <div class="bg-white border-2 border-[#0D291C] rounded-[28px] w-full max-w-[380px] overflow-hidden"
                                style="box-shadow:0 7px 0 #000">

                                <!-- Head -->
                                <div class="bg-[#0D291C] px-6 py-6 flex flex-col items-center gap-3">
                                    <div class="w-14 h-14 rounded-2xl bg-[#7FD344] flex items-center justify-center"
                                        style="box-shadow:0 4px 0 #4a8a1e">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0D291C"
                                            viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-[1rem] font-black text-white">¡Registro exitoso!</p>
                                        <p class="text-[0.68rem] font-semibold mt-1"
                                            style="color:rgba(255,255,255,0.5)">
                                            Tu cuenta ha sido creada correctamente
                                        </p>
                                    </div>
                                </div>

                                <!-- Body -->
                                <div class="px-6 py-5">
                                    <p class="text-[0.82rem] font-semibold text-[#374151] text-center leading-relaxed">
                                        Ya puedes iniciar sesión con tu documento y contraseña en la sede
                                        <strong class="text-[#0D291C]">{{ sedeNombre }}</strong>.
                                    </p>
                                </div>

                                <!-- Foot -->
                                <div class="px-6 pb-6">
                                    <button @click="router.push({ name: 'login' })"
                                        class="w-full py-3 rounded-full text-[0.82rem] font-black uppercase tracking-wide cursor-pointer bg-[#0D291C] text-[#7FD344] border-2 border-black transition-colors hover:bg-[#1a4a2e]"
                                        style="box-shadow:0 4px 0 #000">
                                        Ir al inicio de sesión
                                    </button>
                                </div>

                            </div>
                        </div>
                    </Transition>

                    <!-- ── MODAL CÓDIGO DE VALIDACIÓN ──────────────────────────── -->
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

// ── Submit ─────────────────────────────────────────────────────────
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

<style scoped>
/* Solo lo que Tailwind no puede hacer inline */

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

.modal-enter-active .bg-\[\#B8E19E\] {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.modal-leave-active .bg-\[\#B8E19E\] {
    animation: popOut 0.18s ease-in both;
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


.field-input {
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #e5e7eb !important;
    border-radius: 12px !important;
    padding: 10px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    background: #f9fafb !important;
    outline: none !important;
    box-shadow: none !important;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    font-family: inherit;
}

.field-input:focus {
    border-color: #299261 !important;
    background: white !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12) !important;
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

.est-btn {
    flex: 1;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 800;
    cursor: pointer;
    border: 2px solid #d1d5db;
    background: white;
    color: #6b7280;
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
    border-color: rgba(127, 211, 68, 0.3);
    border-top-color: #7FD344;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
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
</style>