<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Mis Mensualidades</h2>
            <button @click="modalCodigo = true"
                class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline">Añadir</span>
            </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 max-[700px]:grid-cols-1 gap-5 content-start items-start">
            <!-- Skeleton -->
            <template v-if="loading">
                <div v-for="n in 2" :key="n" class="h-80 rounded-3xl animate-pulse"
                    style="background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%" />
            </template>

            <!-- Card -->
            <div v-for="(m, i) in mensualidades" :key="m.id"
                class="bg-white rounded-3xl p-[22px] flex flex-col gap-4 relative overflow-hidden border-2 transition-all duration-200 hover:-translate-y-0.5 max-h-max"
                :class="[
                    m.estado === 'congelada'
                        ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 shadow-[0_4px_0_#93c5fd,0_2px_16px_rgba(59,130,246,0.10)] hover:shadow-[0_6px_0_#7db8f7,0_4px_20px_rgba(59,130,246,0.15)]'
                        : 'border-[#e8f5e9] shadow-[0_4px_0_#e2ede7,0_2px_16px_rgba(13,41,28,0.06)] hover:shadow-[0_6px_0_#c8ddd1,0_4px_20px_rgba(13,41,28,0.10)] '
                ]" :style="{ animationDelay: `${i * 0.08}s`, }">

                <!-- Top band -->
                <div class="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" :class="{
                    'bg-[#7FD344]': m.estado === 'activa',
                    'bg-amber-400': m.estado === 'por_vencer',
                    'bg-red-600': m.estado === 'vencida',
                    'bg-blue-400': m.estado === 'congelada',
                    'bg-[#b45309]': m.estado === 'pendiente',   // ← agregar
                }" />

                <!-- Card head -->
                <div class="flex items-start gap-3 mt-1.5">
                    <!-- Avatar -->
                    <div
                        class="w-11 h-11 rounded-[14px] bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-sm flex-shrink-0 border-2 border-[#e8f5e9]">
                        {{ iniciales(m.nombre) }}
                    </div>
                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-[0.88rem] font-extrabold text-[#0D291C] truncate leading-tight">{{ m.nombre }}
                        </h3>
                        <p class="text-[0.7rem] font-semibold text-gray-400 truncate mt-[2px]">CC {{ m.documento }}</p>
                        <!-- Badge -->
                        <span
                            class="inline-block text-[0.6rem] font-extrabold uppercase tracking-[0.07em] px-2 py-[2px] rounded-full mt-[4px] border"
                            :class="{
                                'bg-green-100 text-green-700 border-green-200': m.estado === 'activa',
                                'bg-amber-100 text-amber-600 border-amber-200': m.estado === 'por_vencer',
                                'bg-red-100   text-red-600   border-red-200': m.estado === 'vencida',
                                'bg-blue-100  text-blue-600  border-blue-200': m.estado === 'congelada',
                                'bg-[#fde68a] text-[#b45309] border-[#b45309]': m.estado === 'pendiente'
                            }">
                            {{ estadoLabel(m.estado) }}
                        </span>
                    </div>
                    <!-- Days counter -->
                    <div
                        class="flex flex-col items-center flex-shrink-0 bg-gray-50 rounded-xl px-3 py-2 border border-[1.5px] border-gray-200">
                        <span class="text-[1.4rem] font-black leading-none" :class="{
                            'text-[#299261]': m.estado === 'activa',
                            'text-amber-600': m.estado === 'por_vencer',
                            'text-red-600': m.estado === 'vencida',
                            'text-blue-500': m.estado === 'congelada',
                            'text-[#b45309]': m.estado === 'pendiente',
                        }">
                            {{ diasRestantes(m) }}
                        </span>
                        <span class="text-[0.58rem] font-bold uppercase tracking-[0.06em] opacity-50 text-black">
                            {{ m.estado === 'congelada' ? 'cong.' : 'días' }}
                        </span>
                    </div>
                </div>

                <!-- Sede · Mensualidad + Placas -->
                <div class="flex flex-col gap-2">
                    <p class="text-[0.7rem] font-bold text-gray-500 truncate">
                        <span class="text-[#0D291C]">{{ m.sede }}</span>
                        <span class="mx-1 opacity-40">·</span>
                        <span>{{ m.mensualidad }}</span>
                    </p>
                    <div v-if="m.placas.length" class="flex flex-wrap gap-1.5">
                        <span v-for="placa in m.placas" :key="placa"
                            class="inline-flex items-center gap-1 text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-[3px] rounded-lg bg-[#0D291C] text-[#7FD344] border border-[#1a3d2a]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                                <circle cx="7.5" cy="14.5" r="1.5" />
                                <circle cx="16.5" cy="14.5" r="1.5" />
                            </svg>
                            {{ placa }}
                        </span>
                    </div>
                    <p v-else class="text-[0.65rem] text-gray-400 italic">Sin placas registradas</p>
                </div>

                <!-- Dates block -->
                <template v-if="m.fechaInicio && m.fechaFin">
                    <div
                        class="flex flex-col gap-[7px] bg-gray-50 rounded-[14px] px-3.5 py-3 border border-[1.5px] border-gray-200">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                class="text-gray-400 flex-shrink-0" viewBox="0 0 24 24">
                                <path
                                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                            </svg>
                            <span
                                class="text-[0.72rem] font-bold text-gray-400 uppercase tracking-[0.05em] min-w-[44px]">Inicia</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatFecha(m.fechaInicio)
                            }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                class="text-gray-400 flex-shrink-0" viewBox="0 0 24 24">
                                <path
                                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                            </svg>
                            <span
                                class="text-[0.72rem] font-bold text-gray-400 uppercase tracking-[0.05em] min-w-[44px]">Vence</span>
                            <span class="text-[0.82rem] font-bold text-[#0D291C]">{{ formatFecha(m.fechaFin) }}</span>
                        </div>
                    </div>
                    <!-- Progress bar -->
                    <div class="flex flex-col gap-[5px]">
                        <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-[width] duration-500" :class="{
                                'bg-[#7FD344]': m.estado === 'activa',
                                'bg-amber-400': m.estado === 'por_vencer',
                                'bg-red-600': m.estado === 'vencida',
                                'bg-blue-400': m.estado === 'congelada',
                            }" :style="{ width: `${porcentajeVigencia(m)}%` }" />
                        </div>
                        <span class="text-[0.62rem] font-semibold text-gray-400 text-right">
                            {{ porcentajeVigencia(m) }}% del periodo
                        </span>
                    </div>

                    <button v-if="m.estado === 'activa' || m.estado === 'por_vencer' && m.cobroTarjetaPermitido"
                        @click="abrirModalTarjeta(m)"
                        class="w-full flex items-center justify-center gap-1.5 py-[7px] px-3 rounded-[12px] text-[0.7rem] font-black cursor-pointer border border-dashed border-red-200 text-red-400 bg-red-50/50 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        Perdí mi tarjeta
                    </button>
                </template>

                <!-- Pending payment notice -->
                <div v-else class="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-amber-50 border border-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706" viewBox="0 0 24 24"
                        class="shrink-0">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span class="text-[0.72rem] font-bold text-amber-700 leading-snug">
                        Pago pendiente — sin fechas de vigencia aún
                    </span>
                </div>

                <!-- Card actions -->
                <div class="grid grid-cols-2 gap-2 w-full">
                    <!-- Pay -->
                    <button @click="pagarDeshabilitado(m) ? null : abrirPago(m)" :disabled="pagarDeshabilitado(m)"
                        :class="pagarDeshabilitado(m)
                            ? 'bg-gray-100 text-gray-400 border-gray-200 shadow-none cursor-not-allowed'
                            : 'bg-[#0D291C] text-[#7FD344] border-[#0D291C] shadow-[0_3px_0_#051510] hover:bg-[#132e21] cursor-pointer active:translate-y-[2px]'"
                        class="flex items-center justify-center gap-1.5 py-[10px] px-3 rounded-[14px] text-[0.78rem] font-black border-2 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        Pagar
                    </button>
                    <!-- View -->
                    <button @click="abrirDetalle(m)"
                        class="flex items-center justify-center gap-1.5 py-[10px] px-3 rounded-[14px] text-[0.78rem] font-black cursor-pointer border-2 transition-all active:translate-y-[2px] bg-white text-[#299261] border-[#c8e6c9] shadow-[0_3px_0_#c8e6c9] hover:bg-[#f0faf4]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        <span class="xs:inline">Más info</span>
                    </button>
                    <!-- Freeze — fila completa si existe -->
                    <button v-if="mostrarCongelar(m)" @click="abrirCongelar(m)"
                        class=" col-span-2 flex items-center justify-center gap-1.5 py-[10px] px-3 rounded-[14px] text-[0.78rem] font-black cursor-pointer border-2 transition-all active:translate-y-[2px] bg-white text-blue-500 border-blue-200 shadow-[0_3px_0_#bfdbfe] hover:bg-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z" />
                        </svg>
                        Congelar mensualidad
                    </button>
                </div>
            </div>
        </div>

        <!-- ───────────────── MODAL: AÑADIR CÓDIGO ───────────────── -->
        <ModalCodigoMensualidad v-model="modalCodigo" @confirmado="cargarMisMensualidades" />

        <!-- ───────────────── MODAL: PAGO ───────────────── -->
        <Transition name="modal">
            <div v-if="modalPago"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
                <div
                    class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[420px] flex flex-col overflow-hidden max-h-[calc(100vh-32px)] max-[720px]:max-h-[95%]">
                    <!-- Head -->
                    <div
                        class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15] flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-full bg-[#0D291C] border border-[#7FD344]/40 text-[#7FD344] flex items-center justify-center font-black text-xs flex-shrink-0">
                                {{ iniciales(mensualidadAccion?.nombre) }}
                            </div>
                            <div>
                                <p class="text-[0.9rem] font-extrabold text-white">
                                    {{ infoExcedente ? 'Pago excedente' : 'Renovar mensualidad' }}
                                </p>
                                <p class="text-[0.65rem] text-white/50 font-semibold">{{ mensualidadAccion?.nombre }} ·
                                    {{ mensualidadAccion?.sede }}</p>
                            </div>
                        </div>
                        <button @click="cerrarModales"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body (scrollable) -->
                    <div ref="modalBodyRef"
                        class="flex flex-col bg-white overflow-y-auto flex-1 min-h-0 [scrollbar-width:thin] [scrollbar-color:#c8e6c9_transparent]">

                        <!-- Loading -->
                        <div v-if="loadingOpciones" class="flex flex-col items-center gap-3 py-10">
                            <div
                                class="w-8 h-8 rounded-full border-[3px] border-[#e8f5e9] border-t-[#299261] animate-spin" />
                            <span class="text-xs text-gray-400 font-semibold">Verificando estado del pago...</span>
                        </div>



                        <!-- Pending payment -->
                        <template v-else-if="pagoPendiente && !opcionesPago.length">
                            <div class="px-5 py-4 border-b border-gray-100">
                                <div
                                    class="flex flex-col gap-4 rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-4 shadow-[0_3px_0_#fde68a]">

                                    <!-- Header -->
                                    <!-- Header -->
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style="background:#f59e0b;box-shadow:0 2px 0 #b45309">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-[0.85rem] font-black" style="color:#92400e">Tienes un pago
                                                pendiente</p>
                                            <p class="text-[0.67rem] font-semibold mt-[1px]" style="color:#d97706">
                                                Complétalo antes de iniciar uno nuevo</p>
                                        </div>
                                    </div>

                                    <!-- Datos -->
                                    <div
                                        class="flex flex-col gap-1.5 bg-white rounded-xl border border-amber-200 px-3.5 py-3">
                                        <div v-if="pagoPendiente.valor" class="flex items-center justify-between">
                                            <span class="text-[0.62rem] font-black uppercase tracking-[0.08em]"
                                                style="color:#d97706">Valor</span>
                                            <span class="text-[0.85rem] font-black" style="color:#92400e">{{
                                                formatPrecio(pagoPendiente.valor) }}</span>
                                        </div>
                                        <div v-if="pagoPendiente.cus"
                                            class="flex items-center justify-between border-t border-amber-100 pt-1.5 mt-0.5">
                                            <span class="text-[0.62rem] font-black uppercase tracking-[0.08em]"
                                                style="color:#d97706">ID Transacción</span>
                                            <span class="font-mono text-[0.75rem] font-black" style="color:#92400e">{{
                                                pagoPendiente.cus }}</span>
                                        </div>
                                    </div>

                                    <!-- CTA -->
                                    <a :href="pagoPendiente.urlPago"
                                        class="flex items-center justify-center gap-2 py-[11px] px-4 rounded-[14px] text-[0.78rem] font-black border-2 text-white active:translate-y-[2px] transition-all cursor-pointer no-underline"
                                        style="background:#f59e0b;border-color:#d97706;box-shadow:0 3px 0 #b45309">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                        </svg>
                                        Continuar al pago pendiente
                                    </a>

                                </div>
                            </div>
                        </template>

                        <!-- Error -->
                        <div v-else-if="errPago && !opcionesPago.length" class="px-5 py-4 border-b border-gray-100">
                            <div
                                class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[0.72rem] font-semibold text-red-600">
                                {{ errPago }}
                            </div>
                        </div>

                        <!-- Options -->
                        <template v-else>

                            <!-- ── Excedente resumen (solo cuando infoExcedente) ── -->
                            <div v-if="infoExcedente" class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                    Pago excedente
                                </p>
                                <div class="flex flex-col gap-3 rounded-2xl border-2 border-[#c8e6c9] bg-[#f0fdf4] p-4">
                                    <div
                                        class="flex items-center justify-between text-[0.78rem] font-semibold text-gray-500">
                                        <span>{{ infoExcedente.autorizacionAnterior }}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#299261"
                                            viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        <span class="font-black text-[#0D291C]">{{ infoExcedente.autorizacionNueva
                                            }}</span>
                                    </div>
                                    <div
                                        class="flex flex-col gap-1.5 rounded-xl bg-white border border-[#c8e6c9] px-3 py-2.5">
                                        <div class="flex justify-between text-[0.7rem] font-semibold text-gray-500">
                                            <span>Subtotal</span><span>{{
                                                formatPrecio(infoExcedente.excedente?.subtotal) }}</span>
                                        </div>
                                        <div class="flex justify-between text-[0.7rem] font-semibold text-gray-500">
                                            <span>IVA</span><span>{{ formatPrecio(infoExcedente.excedente?.iva)
                                                }}</span>
                                        </div>
                                        <div
                                            class="flex justify-between text-[0.85rem] font-black text-[#0D291C] border-t border-[#e8f5e9] pt-1.5 mt-0.5">
                                            <span>Total a pagar</span>
                                            <span class="text-[#299261]">{{ formatPrecio(infoExcedente.excedente?.total)
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Plan selector (solo renovación normal) -->
                            <div v-if="!infoExcedente" class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                    Elige tu plan
                                </p>
                                <div class="flex flex-col gap-2">
                                    <button v-for="op in opcionesPago" :key="op.modalidad + op.cantidadMeses"
                                        @click="seleccionarOpcion(op)"
                                        class="flex flex-col gap-2.5 p-3.5 px-4 rounded-2xl border-2 bg-gray-50 cursor-pointer text-left w-full transition-all shadow-[0_2px_0_#e2e8f0] hover:border-[#c8e6c9] hover:bg-[#f0fdf4]"
                                        :class="opcionSeleccionada?.modalidad === op.modalidad
                                            ? 'border-[#299261] bg-[#f0fdf4] shadow-[0_2px_0_#c8e6c9]'
                                            : 'border-gray-200'">
                                        <div class="flex items-center justify-between">
                                            <div class="flex flex-col gap-0.5 text-left">
                                                <span class="text-[0.9rem] font-black text-[#0D291C]">{{ op.nombre
                                                }}</span>
                                                <span
                                                    class="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-wide">
                                                    {{ op.modalidad }}
                                                    <template v-if="op.cantidadMeses > 0">
                                                        · <template v-if="op.modalidad === 'QUINCENA'">15
                                                            días</template>
                                                        <template v-else>{{ op.cantidadMeses }} {{ op.cantidadMeses ===
                                                            1 ? 'mes' : 'meses' }}</template>
                                                    </template>
                                                </span>
                                            </div>
                                            <div class="flex flex-col items-end gap-0.5">
                                                <span class="text-base font-black text-[#299261]">{{
                                                    formatPrecio(op.totalFinal) }}</span>
                                                <span v-if="op.tarjeta"
                                                    class="text-[0.68rem] font-semibold text-gray-400">+ {{
                                                        formatPrecio(op.tarjeta.total) }} Tarjeta</span>
                                            </div>
                                        </div>
                                        <!-- Desglose -->
                                        <div v-if="opcionSeleccionada?.modalidad === op.modalidad"
                                            class="flex flex-col gap-[5px] pt-2.5 border-t border-gray-200">
                                            <div
                                                class="flex justify-between text-[0.82rem] font-semibold text-gray-500">
                                                <span>Subtotal</span><span>{{ formatPrecio(op.desglose.subtotal)
                                                }}</span>
                                            </div>
                                            <div
                                                class="flex justify-between text-[0.82rem] font-semibold text-gray-500">
                                                <span>IVA</span><span>{{ formatPrecio(op.desglose.iva) }}</span>
                                            </div>
                                            <div v-if="op.tarjeta"
                                                class="flex justify-between text-[0.82rem] font-semibold text-gray-500">
                                                <span>Cobro Tarjeta</span><span>{{ formatPrecio(op.tarjeta.total)
                                                }}</span>
                                            </div>
                                            <div
                                                class="flex justify-between text-[0.92rem] font-black text-[#0D291C] pt-[5px] border-t border-gray-200 mt-0.5">
                                                <span>Total a pagar</span><span class="text-[#299261]">{{
                                                    formatPrecio(op.totalFinal) }}</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <!-- Month selector -->
                            <div v-if="!infoExcedente && opcionSeleccionada && !esQuincena && !esSoloTarjeta"
                                class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                    Meses a renovar
                                </p>
                                <div class="flex gap-2.5">
                                    <button v-for="n in [1, 2]" :key="n" @click="seleccionarMesesExtra(n)"
                                        class="flex-1 flex flex-col items-center gap-0.5 py-3 px-2.5 rounded-[14px] border-2 cursor-pointer transition-all"
                                        :class="mesesExtra === n
                                            ? 'border-[#299261] bg-[#0D291C] shadow-[0_3px_0_#051510]'
                                            : 'border-gray-200 bg-gray-50 shadow-[0_2px_0_#e2e8f0] hover:border-[#c8e6c9] hover:bg-[#f0fdf4]'">
                                        <span class="text-[1.6rem] font-black leading-none transition-colors"
                                            :class="mesesExtra === n ? 'text-[#7FD344]' : 'text-[#0D291C]'">{{ n
                                            }}</span>
                                        <span
                                            class="text-[0.6rem] font-extrabold uppercase tracking-[0.08em] transition-colors"
                                            :class="mesesExtra === n ? 'text-[#7FD344]/60' : 'text-gray-400'">
                                            {{ n === 1 ? 'mes' : 'meses' }}
                                        </span>
                                    </button>
                                </div>
                                <p v-if="mesesExtra === 2"
                                    class="flex items-start gap-1.5 text-[0.7rem] font-semibold text-green-800 bg-[#f0fdf4] border border-[1.5px] border-[#c8e6c9] rounded-[10px] px-3 py-2 leading-relaxed">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#299261"
                                        viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Pagarás 2 meses de una vez — el segundo inicia cuando vence el primero.
                                </p>
                            </div>

                            <!-- Manual start date -->
                            <div v-if="!infoExcedente && (!mensualidadAccion?.fechaFin || mensualidadAccion?.estado === 'vencida') && !esSoloTarjeta"
                                class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                    Fecha de inicio
                                </p>
                                <div class="flex flex-col gap-1.5">
                                    <label
                                        class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">¿Desde
                                        cuándo
                                        inicia tu mensualidad?</label>
                                    <input v-model="fechaInicioManual" type="date"
                                        class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                                        :min="hoyISO" />
                                    <p class="text-[0.7rem] text-gray-500 leading-relaxed pl-0.5">Selecciona la fecha en
                                        que deseas activar tu
                                        mensualidad.</p>
                                </div>
                            </div>

                            <!-- Notice -->
                            <div class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                                <div
                                    class="flex items-start gap-2 px-3 py-2.5 bg-[#f0fdf4] border border-[1.5px] border-[#c8e6c9] rounded-[10px] text-[0.72rem] font-semibold text-green-800 leading-relaxed">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#299261"
                                        viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <p>Al confirmar serás redirigido a la página de pago.</p>
                                </div>
                                <div v-if="errPago"
                                    class="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[0.72rem] font-semibold text-red-600">
                                    {{ errPago }}
                                </div>
                                <div ref="formBillingRef" class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                                    <p class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2
              after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r
              after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                        Datos personales
                                    </p>
                                    <div class="flex flex-col gap-2.5">

                                        <!-- Tipo documento -->
                                        <div class="flex flex-col gap-1">
                                            <label
                                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-500 pl-0.5">
                                                Tipo de documento
                                            </label>
                                            <select v-model="avalpayinformacion.tipoDocumento" class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C]
                       outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15
                       transition-all w-full appearance-none cursor-pointer">
                                                <option value="" disabled>Selecciona...</option>
                                                <option value="CC">Cédula de Ciudadanía</option>
                                                <option value="CE">Cédula de Extranjería</option>
                                                <option value="TI">Tarjeta de Identidad</option>
                                                <option value="NIT">NIT - Identificación Tributaria</option>
                                                <option value="RUT">RUT - Registro Único Tributario</option>
                                            </select>
                                        </div>

                                        <!-- Documento -->
                                        <div class="flex flex-col gap-1">
                                            <label
                                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-500 pl-0.5">
                                                Número de documento
                                            </label>
                                            <input v-model="avalpayinformacion.documento" type="text"
                                                placeholder="Ej: 1234567890"
                                                @input="avalpayinformacion.documento = avalpayinformacion.documento.replace(/[^0-9]/g, '')"
                                                class="bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C]
           outline-none focus:ring-2 transition-all w-full placeholder:text-gray-300" :class="avalpayinformacion.documento && avalpayinformacion.tipoDocumento && !REGEX_DOCUMENTO[avalpayinformacion.tipoDocumento]?.test(avalpayinformacion.documento)
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
            : 'border-gray-300 focus:border-[#299261] focus:ring-[#299261]/15'" />

                                            <!-- Mensaje inline bajo el input -->
                                            <p v-if="avalpayinformacion.documento && avalpayinformacion.tipoDocumento && !REGEX_DOCUMENTO[avalpayinformacion.tipoDocumento]?.test(avalpayinformacion.documento)"
                                                class="text-[0.65rem] font-semibold text-red-500 pl-0.5">
                                                Formato inválido para {{ avalpayinformacion.tipoDocumento }}.
                                            </p>
                                        </div>

                                        <!-- Nombre + Apellido -->
                                        <div class="grid grid-cols-2 gap-2">
                                            <div class="flex flex-col gap-1">
                                                <label
                                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-500 pl-0.5">
                                                    Nombre
                                                </label>
                                                <input v-model="avalpayinformacion.nombre" type="text"
                                                    placeholder="Ej: Juan"
                                                    @input="avalpayinformacion.nombre = avalpayinformacion.nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')"
                                                    class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C]
                   outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15
                   transition-all w-full placeholder:text-gray-300" />
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <label
                                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-500 pl-0.5">
                                                    Apellido
                                                </label>
                                                <input v-model="avalpayinformacion.apellido" type="text"
                                                    placeholder="Ej: Pérez"
                                                    @input="avalpayinformacion.apellido = avalpayinformacion.apellido.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')"
                                                    class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C]
                   outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15
                   transition-all w-full placeholder:text-gray-300" />
                                            </div>
                                        </div>

                                        <!-- Teléfono -->
                                        <div class="flex flex-col gap-1">
                                            <label
                                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-500 pl-0.5">
                                                Teléfono
                                            </label>
                                            <input v-model="avalpayinformacion.telefono" type="tel"
                                                @input="avalpayinformacion.telefono = avalpayinformacion.telefono.replace(/[^0-9]/g, '')"
                                                placeholder="Ej: 3001234567" class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C]
                       outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15
                       transition-all w-full placeholder:text-gray-300" />
                                        </div>

                                        <!-- Correo -->
                                        <div class="flex flex-col gap-1">
                                            <label
                                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-500 pl-0.5">
                                                Correo electrónico
                                            </label>
                                            <input v-model="avalpayinformacion.correo" type="email"
                                                placeholder="Ej: juan@correo.com" class="bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C]
               outline-none focus:ring-2 transition-all w-full placeholder:text-gray-300" :class="avalpayinformacion.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(avalpayinformacion.correo)
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
                : 'border-gray-300 focus:border-[#299261] focus:ring-[#299261]/15'" />
                                            <p v-if="avalpayinformacion.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(avalpayinformacion.correo)"
                                                class="text-[0.65rem] font-semibold text-red-500 pl-0.5">
                                                Ingresa un correo electrónico válido.
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- ── Scroll hint al formulario ── -->
                        <div class="sticky bottom-0 left-0 right-0 px-4 py-2.5 bg-white/95 backdrop-blur-sm border-t border-[#c8e6c9] flex-shrink-0">
                                <button @click="scrollAlFormularioPago"
                                    class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0D291C] text-[#7FD344] text-[0.75rem] font-black border border-[#1a4a2e] transition-all active:translate-y-px">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
                                    </svg>
                                    Completar datos de facturación
                                </button>
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200 flex-shrink-0">
                        <button @click="cerrarModales"
                            class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            Cancelar
                        </button>
                        <button @click="confirmarPago" :disabled="(!infoExcedente && !opcionSeleccionada) || loadingOpciones || iniciandoPago
                            || (!infoExcedente && !mensualidadAccion?.fechaFin && !fechaInicioManual)
                            || !avalpayinformacion.tipoDocumento || !avalpayinformacion.documento
                            || !avalpayinformacion.nombre || !avalpayinformacion.apellido
                            || !avalpayinformacion.telefono || !avalpayinformacion.correo"
                            class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <div v-if="iniciandoPago"
                                class="w-[13px] h-[13px] flex-shrink-0 border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin" />
                            {{ iniciandoPago ? 'Redirigiendo...' : infoExcedente ? 'Pagar excedente (' +
                                formatPrecio(infoExcedente.excedente?.total) + ')'
                                : esSoloTarjeta ? 'Ir a pagar (solo tarjeta) ' : 'Ir a pagar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <ModalCongelar v-model="modalCongelar" :cliente="mensualidadAccion?._raw"
            :info-congelamiento="infoCongelamiento" :err-externo="errCongelar" :guardando-externo="guardandoCongelar"
            @confirmar="confirmarCongelar" @cerrar="errCongelar = ''" />

        <!-- ───────────────── MODAL: DETALLE ───────────────── -->
        <ModalDetalleMensualidad v-model="modalDetalle" :mensualidad="mensualidadAccion" :detalle="detalleCompleto"
            :placas="placasDetalle" :placa-cambiada="placaCambiada" :loading="loadingDetalle" :error="errDetalle"
            @cambiar-placa="abrirModalPlacas" @cambiar-tipo="abrirModalCambioTipo" />

        <!-- ───────────────── MODAL: CAMBIO DE PLACAS ───────────────── -->
        <Transition name="modal">
            <div v-if="modalPlacas"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-[60] p-4 ">
                <div class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[460px]  flex flex-col overflow-y-auto"
                    style="max-height: 100%;">
                    <!-- Head -->
                    <div class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15]">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-[#7FD344] flex items-center justify-center flex-shrink-0">
                                <AppIcon :name="mensualidadAccion?.esMoto ? 'two_wheeler' : 'car-side'" :size="18"
                                    class="text-[#0D291C]" />
                            </div>
                            <div>
                                <p class="text-[0.9rem] font-extrabold text-white">Cambio de placas</p>
                                <p class="text-[0.65rem] text-white/50 font-semibold">{{ mensualidadAccion?.sede }} · 1
                                    cambio
                                    por mes</p>
                            </div>
                        </div>
                        <button @click="modalPlacas = false"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>
                    <!-- Body -->
                    <div class="flex flex-col bg-white overflow-y-auto">
                        <!-- Warning -->
                        <div class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                            <div
                                class="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-[1.5px] border-amber-200 rounded-[10px] text-[0.72rem] font-semibold text-amber-800 leading-relaxed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706"
                                    viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                                <p>Solo se permite <strong>1 cambio de placas por mes</strong>. Una vez confirmado, no
                                    podrás
                                    realizar otro cambio hasta el próximo mes.</p>
                            </div>
                        </div>
                        <!-- Plate inputs -->
                        <div class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                Editar placas
                            </p>
                            <div class="flex flex-col gap-3">
                                <div v-for="(_, idx) in nuevasPlacas" :key="idx"
                                    class="flex flex-col gap-1 px-3 py-2.5 rounded-[14px] bg-gray-50 border border-[1.5px] border-gray-200">
                                    <div class="flex items-center mb-0.5">
                                        <span class="text-[0.6rem] font-black uppercase tracking-wide text-gray-400">
                                            {{ idx === 0 ? 'Principal' : `Placa ${idx + 1}` }}
                                        </span>
                                        <span v-if="idx === 0"
                                            class="text-[0.55rem] font-black px-1.5 py-0.5 rounded-full bg-[#0D291C] text-[#7FD344] ml-1.5">Requerida</span>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        <div
                                            class="flex items-center gap-2 flex-1 bg-white border-2 border-gray-300 rounded-[10px] px-3 py-2 transition-all focus-within:border-[#299261] focus-within:shadow-[0_0_0_3px_rgba(41,146,97,0.12)]">
                                            <AppIcon :name="mensualidadAccion?.esMoto ? 'two_wheeler' : 'car-side'"
                                                :size="14" :style="{ color: idx === 0 ? '#299261' : '#9ca3af' }" />
                                            <input v-model="nuevasPlacas[idx]" type="text" maxlength="6"
                                                class="flex-1 bg-transparent border-none outline-none font-mono font-black text-[0.95rem] tracking-[0.15em] uppercase text-[#0D291C] min-w-0 placeholder:text-gray-300 placeholder:font-semibold placeholder:tracking-[0.05em]"
                                                :placeholder="placasDetalle[idx] || (idx === 0 ? 'ABC123' : 'Opcional')"
                                                @input="nuevasPlacas[idx] = nuevasPlacas[idx].toUpperCase()" />
                                        </div>
                                        <button v-if="idx > 0 && nuevasPlacas[idx]" @click="nuevasPlacas[idx] = ''"
                                            class="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs font-black flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors flex-shrink-0">✕</button>
                                    </div>
                                    <div v-if="nuevasPlacas[idx] && nuevasPlacas[idx] !== placasDetalle[idx]"
                                        class="flex items-center gap-1.5 text-[0.62rem] font-semibold text-amber-600 mt-0.5">
                                        <span class="line-through opacity-60">{{ placasDetalle[idx] || '—' }}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        <span class="font-black text-[#299261]">{{ nuevasPlacas[idx] }}</span>
                                    </div>

                                </div>
                            </div>

                            <Transition name="modal">
                                <div v-if="infoExcedente"
                                    class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                                    <div
                                        class="flex flex-col gap-3 rounded-2xl border-2 border-[#c8e6c9] bg-[#f0fdf4] p-4">
                                        <div class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                fill="#299261" viewBox="0 0 24 24" class="shrink-0">
                                                <path
                                                    d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                            </svg>
                                            <span class="text-[0.82rem] font-black text-[#0D291C]">Cambio de
                                                autorización</span>
                                        </div>
                                        <div
                                            class="flex items-center justify-between text-[0.72rem] font-semibold text-gray-500">
                                            <span>{{ infoExcedente.autorizacionAnterior }}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                fill="#299261" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                            <span class="font-black text-[#0D291C]">{{ infoExcedente.autorizacionNueva
                                            }}</span>
                                        </div>
                                        <div
                                            class="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[0.7rem] font-semibold text-amber-800 leading-relaxed">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                                fill="#d97706" viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                            </svg>
                                            <span>
                                                Al confirmar pagarás un excedente por la diferencia de autorización de
                                                tu
                                                mensualidad actual.
                                                Al vencer, se te cobrará el valor completo de
                                                <strong>{{ infoExcedente.autorizacionNueva }}</strong>.
                                                Si prefieres no pagar el excedente ahora, espera a que termine tu
                                                mensualidad
                                                actual.
                                            </span>
                                        </div>
                                        <div
                                            class="flex flex-col gap-1.5 rounded-xl bg-white border border-[#c8e6c9] px-3 py-2.5">
                                            <div class="flex justify-between text-[0.7rem] font-semibold text-gray-500">
                                                <span>Subtotal</span><span>{{
                                                    formatPrecio(infoExcedente.excedente?.subtotal)
                                                }}</span>
                                            </div>
                                            <div class="flex justify-between text-[0.7rem] font-semibold text-gray-500">
                                                <span>IVA</span><span>{{ formatPrecio(infoExcedente.excedente?.iva)
                                                }}</span>
                                            </div>
                                            <div
                                                class="flex justify-between text-[0.82rem] font-black text-[#0D291C] border-t border-[#e8f5e9] pt-1.5 mt-0.5">
                                                <span>Total a pagar</span>
                                                <span class="text-[#299261]">{{
                                                    formatPrecio(infoExcedente.excedente?.total)
                                                }}</span>
                                            </div>
                                        </div>
                                        <p class="text-[0.68rem] font-semibold text-gray-400 leading-relaxed">
                                            Al confirmar serás redirigido a la pasarela de pago para cubrir el excedente
                                            por la
                                            diferencia de autorización.
                                        </p>
                                    </div>
                                </div>
                            </Transition>

                        </div>
                        <!-- Error -->
                        <div v-if="errPlacas"
                            class="mx-5 mb-1 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[0.72rem] font-semibold text-red-600">
                            {{ errPlacas }}
                        </div>
                    </div>

                    <!-- Excedente banner -->

                    <!-- :disabled="!nuevasPlacas[0]?.trim() || guardandoPlacas || cambioPlacaBloqueado ||
                                (usandoCambioAutorizacion && nuevasPlacas[0]?.trim().length >= 6 && placaPrincipalEsMoto === mensualidadAccion?.esMoto)" -->

                    <!-- Foot -->
                    <div class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200">
                        <button @click="infoExcedente ? (infoExcedente = null) : (modalPlacas = false)"
                            class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            {{ infoExcedente ? 'Volver' : 'Cancelar' }}
                        </button>
                        <button v-if="!infoExcedente" @click="confirmarCambioPlacas"
                            class="flex-1 flex items-center justify-center gap-2 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <div v-if="guardandoPlacas"
                                class="w-[13px] h-[13px] flex-shrink-0 border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin" />
                            Confirmar cambio
                        </button>
                        <button v-else @click="confirmarPagoExcedente"
                            class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                            Pagar excedente ({{ formatPrecio(infoExcedente?.excedente?.total) }})
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ───────────────── MODAL: TARJETA PERDIDA ───────────────── -->
        <Transition name="modal">
            <div v-if="modalTarjeta"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div
                    class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[400px] flex flex-col overflow-hidden">

                    <!-- Head -->
                    <div class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15]">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#f87171"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[0.9rem] font-extrabold text-white">¿Perdiste tu tarjeta?</p>
                                <p class="text-[0.65rem] text-white font-semibold">{{ mensualidadAccion?.sede }}</p>
                            </div>
                        </div>
                        <button @click="modalTarjeta = false"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="px-5 py-5 flex flex-col gap-4">
                        <div class="flex flex-col gap-3 p-4 bg-red-50 border-2 border-red-100 rounded-2xl">
                            <p class="text-[0.85rem] font-bold text-red-800 leading-relaxed">
                                Al confirmar, se habilitará el cobro de tarjeta de acceso para tu mensualidad en
                                <strong>{{ mensualidadAccion?.sede }}</strong>.
                            </p>
                            <p class="text-[0.75rem] font-semibold text-red-600 leading-relaxed">
                                Después podrás usar el botón <strong>Pagar</strong> para tramitar una nueva tarjeta.
                            </p>
                        </div>

                        <div class="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706"
                                viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            <span class="text-[0.7rem] font-semibold text-amber-800 leading-relaxed">
                                Esta acción no se puede deshacer. Asegúrate de haber perdido realmente tu tarjeta.
                            </span>
                        </div>

                        <div v-if="errTarjeta"
                            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                            ⚠ {{ errTarjeta }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200">
                        <button @click="modalTarjeta = false"
                            class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            Cancelar
                        </button>
                        <button @click="confirmarTarjetaPerdida" :disabled="guardandoTarjeta"
                            class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-red-600 bg-red-600 text-white shadow-[0_1px_0_#991b1b] hover:bg-red-700 active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <div v-if="guardandoTarjeta"
                                class="w-[13px] h-[13px] flex-shrink-0 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {{ guardandoTarjeta ? 'Procesando...' : 'Sí, perdí mi tarjeta' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
        <!-- ───────────────── MODAL: CONSENTIMIENTO ───────────────── -->
        <ModalConsentimiento v-model="modalConsentimiento" @confirmar="confirmarConsentimiento" />

        <ModalFacturacion v-model="modalFacturacion" :documento-usuario="avalpayinformacion.documento"
            :tipo-documento-usuario="avalpayinformacion.tipoDocumento"
            :nombre-usuario="avalpayinformacion.nombre + ' ' + avalpayinformacion.apellido"
            :email-usuario="avalpayinformacion.correo" :telefono-usuario="avalpayinformacion.telefono"
            @confirmar="ejecutarPago" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showError, showSuccess, showConfirm, showInfo } from '@/utils/swal'
import MensualidadesService from '@/api/services/mensualidades.service'
import PagoService from '@/api/services/pagos.service'
import ModalCodigoMensualidad from '@/components/modals/ModalCodigoMensualidad.vue'
import ModalConsentimiento from '@/components/modals/ModalConsentimiento.vue'
import ModalDetalleMensualidad from '@/components/modals/ModalDetalleMensualidad.vue'
import ModalCongelar from '@/components/modals/ModalCongelar.vue'
import ModalFacturacion from '@/components/modals/ModalFacturacion.vue'
import FormDate from '@/utils/formats.date'

// ── Stores ────────────────────────────────────────────────────
const authStore = useAuthStore()

// ── Estado global ─────────────────────────────────────────────
const loading = ref(false)
const mensualidades = ref([])

// ── Scroll hint formulario pago ───────────────────────────────
const modalBodyRef = ref(null)
const formBillingRef = ref(null)
const scrollAlFormularioPago = () => {
    formBillingRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Estado de modales ─────────────────────────────────────────
const modalCodigo = ref(false)
const modalPago = ref(false)
const modalCongelar = ref(false)
const modalDetalle = ref(false)
const modalPlacas = ref(false)
const modalConsentimiento = ref(false)
const modalFacturacion = ref(false)
const consentimientoAceptado = ref(false)
// ── Mensualidad en acción ─────────────────────────────────────
const mensualidadAccion = ref(null)

// ── Detalle ───────────────────────────────────────────────────
const loadingDetalle = ref(false)
const errDetalle = ref('')
const detalleCompleto = ref(null)
const placasDetalle = ref([])

// ── Placas ────────────────────────────────────────────────────
const nuevasPlacas = ref(['', '', '', '', ''])
const guardandoPlacas = ref(false)
const errPlacas = ref('')
const placaCambiada = ref(false)
const usandoCambioAutorizacion = ref(false)
const cambioPlacaBloqueado = ref(false)

// ── Cambio de autorización (moto↔carro) ───────────────────
const infoAutorizacion = ref(null)      // respuesta de getChangesByPersona
const infoExcedente = ref(null)         // data cuando requierePago: true
const loadingAutorizacion = ref(false)

// ── Congelamiento ─────────────────────────────────────────────
const infoCongelamiento = ref(null)
const errCongelar = ref('')
const guardandoCongelar = ref(false)

// ── Pago ──────────────────────────────────────────────────────
const codigoInput = ref('')
const opcionesPago = ref([])
const opcionSeleccionada = ref(null)
const loadingOpciones = ref(false)
const iniciandoPago = ref(false)
const errPago = ref('')
const fechaInicioManual = ref('')
const mesesExtra = ref(1)
const pagoPendiente = ref(null)

// ── envio de datos pasarela ────────────────────────────────────────
const avalpayinformacion = ref({
    tipoDocumento: '',
    documento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
})

const REGEX_DOCUMENTO = {
    CC: /^[1-9][0-9]{3,9}$/,
    CE: /^([a-zA-Z]{1,5})?[1-9][0-9]{3,7}$/,
    TI: /^[1-9][0-9]{4,11}$/,
    NIT: /^[1-9]\d{6,9}$/,
    RUT: /^[1-9]\d{6,9}$/,
}




// ── Tarjeta perdida ───────────────────────────────────────────
const modalTarjeta = ref(false)
const guardandoTarjeta = ref(false)
const errTarjeta = ref('')

// ── Constantes ────────────────────────────────────────────────
const hoyISO = new Date().toISOString().slice(0, 10)
const PLACA_KEYS = ['Placa1', 'Placa2', 'Placa3', 'Placa4', 'Placa5']

// ── Computeds ─────────────────────────────────────────────────
const esQuincena = computed(() => opcionSeleccionada.value?.modalidad === 'QUINCENA')
const esSoloTarjeta = computed(() => opcionSeleccionada.value?.modalidad === 'SOLO_TARJETA')

const mostrarCongelar = (m) =>
    m.conPago && m.estado !== 'congelada' && !m.esQuincena && !m.esMoto && m.estado !== 'activa' && m.estado !== 'pendiente' && m.estado !== 'por_vencer'


// ── Helpers de fecha ──────────────────────────────────────────
const parseLocal = (f) => f ? new Date(f.length === 10 ? f + 'T00:00:00' : f) : null

const formatFecha = (f) => {
    if (!f) return '—'
    const d = parseLocal(f)
    return d ? d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

}

// ── Helpers de UI ─────────────────────────────────────────────
const iniciales = (n = '') =>
    n.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

const formatPrecio = (v) =>
    (!v && v !== 0) ? '—' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

const estadoLabel = (e) =>
    ({ activa: 'Activa', por_vencer: 'Por vencer', vencida: 'Vencida', congelada: 'Congelada', pendiente: 'Pendiente' })[e] ?? e



const diasRestantes = (m) => {
    const ff = typeof m === 'object' ? m?.fechaFin : (typeof m === 'string' ? m : null)
    if (!ff) return 0
    const fin = parseLocal(ff)
    if (!fin) return 0
    const hoy = FormDate.getDateNow()
    hoy.setHours(0, 0, 0, 0)
    return Math.max(0, Math.ceil((fin - hoy) / 86400000))
}

const porcentajeVigencia = (m) => {
    if (!m?.fechaInicio || !m?.fechaFin) return 0
    const ini = parseLocal(m.fechaInicio)
    const fin = parseLocal(m.fechaFin)
    if (!ini || !fin) return 0
    return Math.min(100, Math.max(0, Math.round(((new Date() - ini) / (fin - ini)) * 100)))
}

// ── Resolver estado ───────────────────────────────────────────
const resolverEstado = (m) => {
    if (m.Congelado === true || m.EstadoCongelamiento === 'CONGELADO') return 'congelada'

    if (m.FechaInicio && m.FechaFin) {
        const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
        const inicio = parseLocal(m.FechaInicio)
        if (inicio > hoy) return 'congelada'
    }

    if (!m.Estado) return 'vencida'

    if (!m.FechaFin) return 'pendiente'

    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const fin = parseLocal(m.FechaFin)
    const dias = (fin - hoy) / 86400000
    if (dias < 0) return 'vencida'
    if (dias <= 7) return 'por_vencer'
    return 'activa'
}

const pagarDeshabilitado = (m) => {
    if (m.estado === 'congelada') return true
    if (m.estado === 'activa' && !m.cobroTarjetaPermitido) return true
    return false
}

const abrirModalTarjeta = (m) => {
    mensualidadAccion.value = m
    errTarjeta.value = ''
    modalTarjeta.value = true
}

const confirmarTarjetaPerdida = async () => {
    guardandoTarjeta.value = true
    try {
        await MensualidadesService.permitirCobroTarjeta(mensualidadAccion.value.id)
        const idx = mensualidades.value.findIndex(m => m.id === mensualidadAccion.value.id)
        if (idx !== -1) {
            mensualidades.value[idx].conPago = true
            mensualidades.value[idx].cobroTarjetaPermitido = true
        }
        modalTarjeta.value = false
        showSuccess('¡Tarjeta reportada!', 'Ya puedes usar el botón Pagar para tramitar una nueva.')
    } catch (e) {
        showError({ status: e?.response?.status, data: e?.response?.data })
    } finally {
        guardandoTarjeta.value = false
    }
}


// ── Cargar mensualidades ──────────────────────────────────────
const cargarMisMensualidades = async () => {
    loading.value = true
    try {
        const res = await MensualidadesService.getMisMensualidades()
        const raw = Array.isArray(res) ? res : (res?.data ?? [])
        mensualidades.value = raw.map(m => ({
            _raw: m,
            cobroTarjetaPermitido: !!(m.CobroTarjeta),
            id: m.IdPersonaAutorizada,
            nombre: m.NombreApellidos ?? '—',
            documento: m.Documento ?? '—',
            fechaInicio: m.FechaInicio ? m.FechaInicio : null,
            fechaFin: m.FechaFin ? m.FechaFin : null,
            sede: m.T_Estacionamiento?.Nombre?.trim() ?? '—',
            mensualidad: m.T_Autorizaciones?.NombreAutorizacion ?? '—',
            placas: PLACA_KEYS.map(k => m[k]).filter(Boolean),
            estado: resolverEstado(m),
            conPago: !!(m.FechaFin && parseLocal(m.FechaFin) > new Date()),
            esQuincena: !!(m.T_Autorizaciones?.NombreAutorizacion?.toUpperCase().includes('QUINCENA')
                || m.T_Autorizaciones?.Modalidad?.toUpperCase() === 'QUINCENA'),
            esMoto: (() => {
                const placa = (PLACA_KEYS.map(k => m[k]).filter(Boolean)[0] ?? '').toUpperCase().trim()
                return /^[A-Z]{3}\d{2}[A-Z]$/.test(placa)
            })(),
        }))
    } catch {
        mensualidades.value = []
    } finally {
        loading.value = false
    }
}
onMounted(cargarMisMensualidades)

// ── Detalle ───────────────────────────────────────────────────
const abrirDetalle = async (m) => {
    modalDetalle.value = true
    mensualidadAccion.value = m
    detalleCompleto.value = null
    placasDetalle.value = []
    errDetalle.value = ''
    loadingDetalle.value = true

    try {
        const res = await MensualidadesService.getMiMensualidadById(m.id)
        const data = res?.data ?? res
        placaCambiada.value = data?.solictud
        detalleCompleto.value = data
        placasDetalle.value = PLACA_KEYS.map(k => data[k]).filter(Boolean)
        const placaPrincipal = (placasDetalle.value[0] ?? '').toUpperCase().trim()
        mensualidadAccion.value = {
            ...mensualidadAccion.value,
            esMoto: /^[A-Z]{3}\d{2}[A-Z]$/.test(placaPrincipal),
        }


    } catch {
        placasDetalle.value = m.placas ?? []
    } finally {
        loadingDetalle.value = false
    }
}

const abrirModalCambioTipo = () => {
    cambioPlacaBloqueado.value = false
    errPlacas.value = ''
    infoExcedente.value = null
    usandoCambioAutorizacion.value = true
    nuevasPlacas.value = ['', '']
    modalPlacas.value = true
}

// ── Placas ────────────────────────────────────────────────────
const abrirModalPlacas = () => {
    if (placaCambiada.value) return
    cambioPlacaBloqueado.value = false
    errPlacas.value = ''
    infoExcedente.value = null
    infoAutorizacion.value = null
    usandoCambioAutorizacion.value = false

    // Si no hay placas del endpoint, mostrar 2 filas vacías por defecto
    const totalFilas = Math.max(placasDetalle.value.length, 2)
    nuevasPlacas.value = Array.from({ length: totalFilas }, (_, i) => placasDetalle.value[i] ?? '')

    modalPlacas.value = true

    loadingAutorizacion.value = true
    MensualidadesService.getChangesByPersona(mensualidadAccion.value.id)
        .then(res => { infoAutorizacion.value = res?.data ?? res })
        .catch(() => { infoAutorizacion.value = null })
        .finally(() => { loadingAutorizacion.value = false })
}

const confirmarCambioPlacas = async () => {
    errPlacas.value = ''
    infoExcedente.value = null

    if (!nuevasPlacas.value[0]?.trim()) {
        errPlacas.value = 'La placa principal es obligatoria.'
        return
    }


    guardandoPlacas.value = true

    if (usandoCambioAutorizacion.value) {
        const placasPayload = nuevasPlacas.value
            .map((val, i) => {
                const placa = val?.trim().toUpperCase() || null
                return placa ? [{ ColumnaPlaca: PLACA_KEYS[i], PlacaNueva: placa }] : []
            })
            .filter(arr => arr.length > 0)

        const payload = {
            IdPersonaAutorizada: Number(mensualidadAccion.value.id),
            Placas: placasPayload,
        }

        const res = await MensualidadesService.cambiarAutorizacion(payload)
        guardandoPlacas.value = false

        // 200 con requierePago: true → informativo, mostrar banner
        if (res?.data?.requierePago) {
            infoExcedente.value = res.data
            return
        }

        if (res?.error) {
            // 409 con requierePago → mostrar banner de excedente
            if (res.status === 409 && res.data?.data?.requierePago) {
                infoExcedente.value = res.data.data
                return
            }
            errPlacas.value = Array.isArray(res.data?.message)
                ? res.data.message.join(', ')
                : (res.data?.message ?? 'Error al procesar el cambio.')
            showError({ status: res.status, data: res.data })
            return
        }

        _aplicarCambioPlacasLocal()
        await cargarMisMensualidades()
        modalPlacas.value = false
        modalDetalle.value = false

    } else {
        const Detalles = PLACA_KEYS.map((columna, i) => {
            const nueva = nuevasPlacas.value[i]?.trim().toUpperCase() || null
            const actual = placasDetalle.value[i] ?? null
            return nueva !== actual ? { ColumnaPlaca: columna, PlacaNueva: nueva ?? '' } : null
        }).filter(Boolean)

        if (!Detalles.length) {
            errPlacas.value = 'No hay cambios para guardar.'
            guardandoPlacas.value = false
            return
        }

        const res = await MensualidadesService.cambiarPlacas({
            IdPersonaAutorizada: Number(mensualidadAccion.value.id),
            Detalles,
        })

        guardandoPlacas.value = false

        if (res?.error) {
            if (res.status === 409) {
                errPlacas.value = 'Ya realizaste un cambio de placas este mes.'
                cambioPlacaBloqueado.value = true
                showError({ status: res.status, data: res.data })
                return
            }
            errPlacas.value = Array.isArray(res.data?.message)
                ? res.data.message.join(', ')
                : (res.data?.message ?? 'Error al procesar el cambio.')
            showError({ status: res.status, data: res.data })
            return
        }

        _aplicarCambioPlacasLocal()
        modalPlacas.value = false
    }
}

// Helper: actualiza estado local de placas después de un cambio exitoso
const _aplicarCambioPlacasLocal = () => {
    const nuevas = nuevasPlacas.value.map(p => p?.trim().toUpperCase() || null).filter(Boolean)
    placasDetalle.value = nuevas
    const idx = mensualidades.value.findIndex(m => m.id === mensualidadAccion.value.id)
    if (idx !== -1) mensualidades.value[idx].placas = [...nuevas]
    placaCambiada.value = true

    // ← Recalcular esMoto con la nueva placa principal
    const placaPrincipal = (nuevas[0] ?? '').toUpperCase().trim()
    const esMotoNuevo = /^[A-Z]{3}\d{2}[A-Z]$/.test(placaPrincipal)
    mensualidadAccion.value = { ...mensualidadAccion.value, esMoto: esMotoNuevo }
    if (idx !== -1) mensualidades.value[idx].esMoto = esMotoNuevo
}

const confirmarPagoExcedente = () => {
    modalPlacas.value = false
    consentimientoAceptado.value = false
    errPago.value = ''
    modalPago.value = true  // necesita datos de facturación antes de proceder
}


// ── Congelamiento ─────────────────────────────────────────────
const abrirCongelar = async (m) => {
    mensualidadAccion.value = m
    infoCongelamiento.value = null
    errCongelar.value = ''
    modalCongelar.value = true
    try {
        const res = await MensualidadesService.getCongelamiento(m.id)
        const data = res?.data ?? res
        infoCongelamiento.value = data
    } catch (e) {
        console.error('[Congelar] getCongelamiento error:', e?.response?.status, e?.response?.data)
        infoCongelamiento.value = null
    }
}

const confirmarCongelar = async ({ FechaInicioPeriodoNvo, Observacion }) => {
    guardandoCongelar.value = true
    errCongelar.value = ''

    const res = await MensualidadesService.crearCongelamiento(mensualidadAccion.value.id, {
        FechaInicioPeriodoNvo,
        Observacion,
    })

    guardandoCongelar.value = false

    if (res?.error) {
        errCongelar.value = Array.isArray(res.data?.message)
            ? res.data.message.join(', ')
            : (res.data?.message ?? 'Error al congelar.')
        showError({ status: res.status, data: res.data })
        return
    }

    cerrarModales()
    await cargarMisMensualidades()
    showSuccess('¡Congelado!', 'Tu mensualidad ha sido congelada exitosamente.')
}

// ── Pago ──────────────────────────────────────────────────────
const abrirPago = async (m) => {
    mensualidadAccion.value = m
    opcionesPago.value = []
    opcionSeleccionada.value = null
    errPago.value = ''
    pagoPendiente.value = null
    mesesExtra.value = 1
    fechaInicioManual.value = (m.estado === 'vencida' || !m.fechaFin) ? hoyISO : ''
    loadingOpciones.value = true
    modalPago.value = true

    // Pre-cargar correo y celular del token
    const u = authStore.user
    if (u) {
        avalpayinformacion.value.telefono = avalpayinformacion.value.telefono || u.telefono || ''
        avalpayinformacion.value.correo = avalpayinformacion.value.correo || u.email || ''
    }

    try {
        // ── 1. Verificar pago pendiente
        try {
            const historial = await PagoService.getHistorialTransacciones()
            const transacciones = Array.isArray(historial) ? historial : (historial?.data ?? [])



            const pendiente = transacciones.find(t => t.Status === 'PENDIENTE')

            if (pendiente?.RequestId) {
                const estadoRes = await PagoService.getEstadoReferencia(pendiente.RequestId)

                const estado = estadoRes?.data ?? estadoRes
                const urlPago = estado?.UrlPago ?? estado?.urlPago ?? null

                if (urlPago) {
                    pagoPendiente.value = {
                        urlPago,
                        referencia: estado?.RequestId ?? pendiente?.Reference ?? null,
                        valor: estado?.Valor ?? pendiente?.Valor ?? null,
                        cus: estado?.IdTransaccion ?? null,
                    }
                    loadingOpciones.value = false
                    return
                }
            }
        } catch (e) {
            console.warn('[abrirPago] No se pudo verificar historial:', e)
        }

        // ── 2. Sin pendiente — cargar opciones normalmente
        const res = await PagoService.getOpcionesPago(m.id, 1)
        const data = res?.data ?? res
        if (res?.success === false) {
            errPago.value = res?.message ?? 'Error al cargar opciones.'
            return
        }
        opcionesPago.value = Array.isArray(data) ? data : []
        opcionSeleccionada.value = opcionesPago.value[0] ?? null

    } catch (e) {
        const msg = e?.response?.data?.message
        errPago.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'No se pudieron cargar las opciones de pago.')
    } finally {
        loadingOpciones.value = false
    }
}





const seleccionarOpcion = async (op) => {
    if (mesesExtra.value !== 1) {
        mesesExtra.value = 1
        loadingOpciones.value = true
        errPago.value = ''
        try {
            const res = await PagoService.getOpcionesPago(mensualidadAccion.value.id, 1)
            const data = res?.data ?? res
            if (res?.success === false) { errPago.value = res?.message ?? 'Error al recalcular.'; return }
            opcionesPago.value = Array.isArray(data) ? data : []
        } catch (e) {
            const msg = e?.response?.data?.message
            errPago.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al recalcular.')
            return
        } finally {
            loadingOpciones.value = false
        }
    }

    opcionSeleccionada.value = opcionesPago.value.find(o => o.modalidad === op.modalidad) ?? op
}

const seleccionarMesesExtra = async (n) => {
    if (mesesExtra.value === n) return
    mesesExtra.value = n
    loadingOpciones.value = true
    errPago.value = ''
    try {
        const res = await PagoService.getOpcionesPago(mensualidadAccion.value.id, n)
        const data = res?.data ?? res
        if (res?.success === false) { errPago.value = res?.message ?? 'Error al recalcular.'; return }
        opcionesPago.value = Array.isArray(data) ? data : []
        opcionSeleccionada.value =
            opcionesPago.value.find(op => op.modalidad === opcionSeleccionada.value?.modalidad)
            ?? opcionesPago.value[0]
            ?? null
    } catch (e) {
        const msg = e?.response?.data?.message
        errPago.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al recalcular.')
    } finally {
        loadingOpciones.value = false
    }
}

const confirmarPago = async () => {
    if (!infoExcedente.value && !opcionSeleccionada.value) return

    // Validar formulario

    const f = avalpayinformacion.value
    if (!f.tipoDocumento || !f.documento || !f.nombre || !f.apellido || !f.telefono || !f.correo) {
        errPago.value = 'Completa todos los datos de facturación antes de continuar.'
        return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) {
        errPago.value = 'El correo electrónico no es válido.'
        return
    }

    const regexDoc = REGEX_DOCUMENTO[f.tipoDocumento]
    if (regexDoc && !regexDoc.test(f.documento)) {
        errPago.value = `El número de documento no es válido para el tipo ${f.tipoDocumento}.`
        return
    }
    errPago.value = ''

    // Excedente: ir directo a pasarela, sin consent ni facturación
    if (infoExcedente.value) {
        modalPago.value = false
        await ejecutarPago({ IdentificacionCliente: '222222222222' })
        return
    }

    if (mensualidadAccion.value?.cobroTarjetaPermitido) {
        const { isConfirmed } = await showConfirm({
            title: '¿Recuerdas reclamar tu tarjeta?',
            text: `Después de completar el pago, dirígete al punto de atención de ${mensualidadAccion.value?.sede ?? 'tu sede'} para reclamar tu tarjeta de acceso.`,
            confirmText: 'Entendido, continuar',
            cancelText: 'Volver',
            icon: 'info',
        })
        if (!isConfirmed) return
    }

    modalPago.value = false
    modalConsentimiento.value = true
}


const confirmarConsentimiento = () => {
    modalConsentimiento.value = false
    modalFacturacion.value = true
}

const ejecutarPago = async ({ IdentificacionCliente }) => {
    errPago.value = ''
    iniciandoPago.value = true

    // ✅ Guardar snapshot por si hay error y necesitamos restaurar
    const excedentePendiente = infoExcedente.value
    const placasSnapshot = [...nuevasPlacas.value]

    try {
        const m = mensualidadAccion.value
        if (!m) {
            errPago.value = 'Error interno: no hay mensualidad seleccionada.'
            iniciandoPago.value = false
            return
        }
        const user = authStore.user

        // ── Caso: pago de excedente por cambio de autorización ──
        if (excedentePendiente) {
            // placasSnapshot capturado al inicio de ejecutarPago
            const placasPayload = placasSnapshot
                .map((val, i) => {
                    const placa = val?.trim().toUpperCase() || null
                    return placa ? [{ ColumnaPlaca: PLACA_KEYS[i], PlacaNueva: placa }] : []
                })
                .filter(arr => arr.length > 0)

            const body = {
                Email: avalpayinformacion.value.correo,
                Telefono: avalpayinformacion.value.telefono,
                TipoDocumento: avalpayinformacion.value.tipoDocumento,
                Documento: Number(avalpayinformacion.value.documento),
                Nombre: avalpayinformacion.value.nombre,
                Apellidos: avalpayinformacion.value.apellido,
                CantidadMeses: 1,
                ModalidadPago: 'CAMBIO_AUTORIZACION',
                IdAutorizacionNueva: Number(excedentePendiente.IdAutorizacionNueva),
                Placas: placasPayload,
            }

            const res = await PagoService.iniciarPago(m.id, body)
            const data = res?.data ?? res
            const url = data?.urlPago ?? null
            if (url) {
                showInfo("Un momento", "Redirigiendo a la página de pago...")
                window.location.href = url; return
            }

            infoExcedente.value = excedentePendiente
            nuevasPlacas.value = placasSnapshot
            errPago.value = 'No se recibió la URL de pago. Intenta de nuevo.'
            modalPlacas.value = true
            return
        }

        // ── Caso normal: renovación de mensualidad ──
        const cantidadMeses = esSoloTarjeta.value ? 1 : (opcionSeleccionada.value?.cantidadMeses ?? 1)
        const body = {
            Email: avalpayinformacion.value.correo,
            Telefono: avalpayinformacion.value.telefono,
            TipoDocumento: avalpayinformacion.value.tipoDocumento,
            Documento: Number(avalpayinformacion.value.documento),
            Nombre: avalpayinformacion.value.nombre,
            Apellidos: avalpayinformacion.value.apellido,
            CantidadMeses: cantidadMeses,
            ModalidadPago: opcionSeleccionada.value.modalidad,
            IdentificacionCliente: IdentificacionCliente ?? '222222222222',
            ...((!m.fechaFin || m.estado === 'vencida') && fechaInicioManual.value ? { FechaInicio: fechaInicioManual.value } : {}),
        }


        showInfo("Un momento", "Redirigiendo a la página de pago...")

        const res = await PagoService.iniciarPago(m.id, body)
        const data = res?.data ?? res
        const url = data?.urlPago ?? null
        if (url) {

            window.location.href = url; return
        }
        errPago.value = 'No se recibió la URL de pago. Intenta de nuevo.'
        modalFacturacion.value = false
        modalPago.value = true

    } catch (e) {
        const status = e?.response?.status
        const data = e?.response?.data
        const msg = data?.message
        if (status === 409 && data?.data?.UrlPago) {
            pagoPendiente.value = {
                urlPago: data.data.UrlPago,
                referencia: data.data.referencia ?? data.data.Reference ?? null,
                valor: data.data.valor ?? data.data.Valor ?? null,
                cus: data.data.cus ?? null,
            }
        }
        errPago.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al iniciar el pago.')
        modalFacturacion.value = false
        if (excedentePendiente) {
            // ✅ Restaurar banner en modal de placas
            infoExcedente.value = excedentePendiente
            nuevasPlacas.value = placasSnapshot
            modalPlacas.value = true
        } else {
            modalPago.value = true
        }
    } finally {
        iniciandoPago.value = false
    }
}
// ── Cerrar modales ────────────────────────────────────────────
const cerrarModales = () => {
    modalCodigo.value = false
    modalPago.value = false
    modalCongelar.value = false
    modalConsentimiento.value = false
    modalFacturacion.value = false
    modalPlacas.value = false
    pagoPendiente.value = null
    codigoInput.value = ''
    mensualidadAccion.value = null
    opcionesPago.value = []
    opcionSeleccionada.value = null
    fechaInicioManual.value = ''
    mesesExtra.value = 1
    errPago.value = ''
    errCongelar.value = ''
    iniciandoPago.value = false
    infoExcedente.value = null
    infoAutorizacion.value = null
    errPlacas.value = ''
    nuevasPlacas.value = ['', '', '', '', '']
    usandoCambioAutorizacion.value = false
    cambioPlacaBloqueado.value = false
    modalTarjeta.value = false
    errTarjeta.value = ''
    guardandoTarjeta.value = false
    avalpayinformacion.value = { tipoDocumento: '', documento: '', nombre: '', apellido: '', telefono: '', correo: '' }
}

</script>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.97)
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1)
    }
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

.modal-enter-active .modal-card {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both
}

.modal-leave-active .modal-card {
    animation: popOut 0.18s ease-in both
}

.hint-slide-enter-active,
.hint-slide-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.hint-slide-enter-from,
.hint-slide-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
