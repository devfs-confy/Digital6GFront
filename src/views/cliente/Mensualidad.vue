<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

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

        <div class="mensualidades-grid">
            <div v-if="loading" class="mensualidades-grid">
                <div v-for="n in 2" :key="n" class="h-[320px] rounded-[24px]"
                    style="background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite" />
            </div>
            <div v-for="(m, i) in mensualidades" :key="m.id" class="mensualidad-card" :class="estadoClase(m)"
                :style="{ animationDelay: `${i * 0.08}s` }">
                <div class="card-band" :class="`card-band--${m.estado}`" />
                <div class="card-head">
                    <div class="card-avatar">{{ iniciales(m.nombre) }}</div>
                    <div class="card-head__info">
                        <h3 class="card-nombre">{{ m.sede }}</h3>
                        <p class="text-[0.72rem] font-semibold text-gray-400 truncate mt-0.5">{{ m.mensualidad }}</p>
                        <span class="card-estado-badge" :class="`badge--${m.estado}`">{{ estadoLabel(m.estado) }}</span>
                    </div>
                    <div class="card-dias" :class="`card-dias--${m.estado}`">
                        <span class="card-dias__num">{{ diasRestantes(m) }}</span>
                        <span class="card-dias__label">{{ m.estado === 'congelada' ? 'cong.' : 'días' }}</span>
                    </div>
                </div>
                <template v-if="m.fechaInicio && m.fechaFin">
                    <div class="card-data">
                        <div class="card-data__item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                            </svg>
                            <span class="card-data__label">Inicia</span>
                            <span class="card-data__val">{{ formatFecha(m.fechaInicio) }}</span>
                        </div>
                        <div class="card-data__item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                            </svg>
                            <span class="card-data__label">Vence</span>
                            <span class="card-data__val">{{ formatFecha(m.fechaFin) }}</span>
                        </div>
                    </div>
                    <div class="card-progress-wrap">
                        <div class="card-progress-bar">
                            <div class="card-progress-fill" :class="`fill--${m.estado}`"
                                :style="{ width: `${porcentajeVigencia(m)}%` }" />
                        </div>
                        <span class="card-progress-label">{{ porcentajeVigencia(m) }}% del periodo</span>
                    </div>
                </template>
                <div v-else-if="m.estado"
                    class="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-amber-50 border border-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706" viewBox="0 0 24 24"
                        class="shrink-0">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span class="text-[0.72rem] font-bold text-amber-700 leading-snug">Pago pendiente — sin fechas de
                        vigencia aún</span>
                </div>
                <div v-else class="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-amber-50 border border-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706" viewBox="0 0 24 24"
                        class="shrink-0">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span class="text-[0.72rem] font-bold text-amber-700 leading-snug">Pago pendiente — sin fechas de
                        vigencia aún</span>
                </div>
                <div class="card-actions">
                    <button @click="abrirPago(m)"
                        class="flex-1 flex items-center justify-center gap-2 py-[10px] px-3 rounded-[14px] text-[0.78rem] font-black cursor-pointer border-2 transition-all active:translate-y-[2px] bg-[#0D291C] text-[#7FD344] border-[#0D291C] shadow-[0_3px_0_#051510] hover:bg-[#132e21]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        Pagar
                    </button>
                    <button @click="abrirDetalle(m)"
                        class="flex-1 flex items-center justify-center gap-2 py-[10px] px-3 rounded-[14px] text-[0.78rem] font-black cursor-pointer border-2 transition-all active:translate-y-[2px] bg-white text-[#299261] border-[#c8e6c9] shadow-[0_3px_0_#c8e6c9] hover:bg-[#f0faf4]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Ver
                    </button>
                    <button v-if="m.conPago && m.estado !== 'congelada'" @click="abrirCongelar(m)"
                        class="flex-1 flex items-center justify-center gap-2 py-[10px] px-3 rounded-[14px] text-[0.78rem] font-black cursor-pointer border-2 transition-all active:translate-y-[2px] bg-white text-[#3b82f6] border-[#bfdbfe] shadow-[0_3px_0_#bfdbfe] hover:bg-[#eff6ff]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z" />
                        </svg>
                        Congelar
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: Añadir mensualidad por código -->
        <Transition name="modal">
            <div v-if="modalCodigo" class="modal-overlay">
                <div class="modal-card">
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="w-9 h-9 rounded-xl bg-[#0D291C] flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
                                </svg>
                            </div>
                            <div>
                                <p class="modal-head__name">Añadir mensualidad</p>
                                <p class="modal-head__sub">Ingresa el código que te proporcionó la sede</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close-btn">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-section">
                            <div class="field-group">
                                <label class="field-label">Código de verificación</label>
                                <input v-model="codigoInput" type="text" class="field-input field-input--code"
                                    placeholder="Ej: PARK-2024-XXXX" maxlength="20" @keyup.enter="cerrarModales"
                                    autofocus />
                                <p class="field-hint">El código es entregado por el administrador de la sede.</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="cerrarModales" class="btn-modal btn-modal--confirm"
                            :disabled="!codigoInput.trim()">Aceptar</button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Modal: Pago -->
        <Transition name="modal">
            <div v-if="modalPago" class="modal-overlay modal-pago">
                <div class="modal-card">
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div
                                class="w-9 h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-xs flex-shrink-0">
                                {{ iniciales(mensualidadAccion?.nombre) }}</div>
                            <div>
                                <p class="modal-head__name">Renovar mensualidad</p>
                                <p class="modal-head__sub">{{ mensualidadAccion?.nombre }} · {{ mensualidadAccion?.sede
                                    }}</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close-btn">✕</button>
                    </div>
                    <div class="modal-body">
                        <div v-if="loadingOpciones" class="flex flex-col items-center gap-3 py-10">
                            <div class="det-loader" />
                            <span class="text-xs text-gray-400 font-semibold">Verificando estado del pago...</span>
                        </div>
                        <template v-else-if="pagoPendiente && !opcionesPago.length">
                            <div class="modal-section">
                                <div class="flex flex-col gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#d97706"
                                            viewBox="0 0 24 24" class="shrink-0">
                                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                        </svg>
                                        <span class="text-[0.82rem] font-black text-amber-800">Tienes un pago
                                            pendiente</span>
                                    </div>
                                    <p class="text-[0.72rem] font-semibold text-amber-700 leading-relaxed">
                                        Encontramos una transacción pendiente para esta mensualidad.
                                        Completa el pago antes de iniciar uno nuevo.
                                    </p>
                                    <div class="flex flex-col gap-1.5 text-[0.72rem] font-semibold text-amber-700">
                                        <!-- <div v-if="pagoPendiente.referencia" class="flex justify-between">
                                            <span
                                                class="text-amber-500 uppercase tracking-wide text-[0.62rem]">Referencia</span>
                                            <span class="font-mono font-black">{{ pagoPendiente.referencia }}</span>
                                        </div> -->
                                        <div v-if="pagoPendiente.valor" class="flex justify-between">
                                            <span
                                                class="text-amber-500 uppercase tracking-wide text-[0.62rem]">Valor</span>
                                            <span class="font-black text-amber-800">{{ formatPrecio(pagoPendiente.valor)
                                            }}</span>
                                        </div>
                                        <div v-if="pagoPendiente.cus" class="flex justify-between">
                                            <span class="text-amber-500 uppercase tracking-wide text-[0.62rem]">ID
                                                Transacción</span>
                                            <span class="font-mono font-black">{{ pagoPendiente.cus }}</span>
                                        </div>
                                    </div>
                                    <a :href="pagoPendiente.urlPago"
                                        class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-[14px] text-[0.78rem] font-black border-2 bg-amber-500 text-white border-amber-600 shadow-[0_3px_0_#b45309] hover:bg-amber-600 active:translate-y-[2px] transition-all cursor-pointer no-underline">
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

                        <div v-else-if="errPago && !opcionesPago.length" class="modal-section">
                            <div
                                class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[0.72rem] font-semibold text-red-600">
                                {{ errPago }}</div>
                        </div>
                        <template v-else>
                            <div class="modal-section">
                                <p class="modal-section__title">Elige tu plan</p>
                                <div class="flex flex-col gap-2">
                                    <button v-for="op in opcionesPago" :key="op.modalidad + op.cantidadMeses"
                                        @click="seleccionarOpcion(op)" class="pago-opcion"
                                        :class="{ 'pago-opcion--selected': opcionSeleccionada?.modalidad === op.modalidad }">
                                        <div class="flex items-center justify-between">
                                            <div class="flex flex-col gap-0.5 text-left">
                                                <span class="text-[0.9rem] font-black text-[#0D291C]">{{ op.nombre
                                                    }}</span>
                                                <span
                                                    class="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-wide">
                                                    {{ op.modalidad }}
                                                    <template v-if="op.cantidadMeses > 0">
                                                        · {{ op.cantidadMeses }} {{ op.cantidadMeses === 1 ? 'mes' :
                                                            'meses' }}
                                                    </template>
                                                </span>
                                            </div>
                                            <div class="flex flex-col items-end gap-0.5">
                                                <span class="text-[1rem] font-black text-[#299261]">{{
                                                    formatPrecio(op.totalFinal) }}</span>
                                                <span v-if="op.tarjeta"
                                                    class="text-[0.68rem] font-semibold text-gray-400">+
                                                    {{ formatPrecio(op.tarjeta.total) }} Tarjeta</span>
                                            </div>
                                        </div>
                                        <div v-if="opcionSeleccionada?.modalidad === op.modalidad"
                                            class="pago-desglose">
                                            <div class="pago-desglose__row">
                                                <span>Subtotal</span>
                                                <span>{{ formatPrecio(op.desglose.subtotal) }}</span>
                                            </div>
                                            <div class="pago-desglose__row">
                                                <span>IVA</span>
                                                <span>{{ formatPrecio(op.desglose.iva) }}</span>
                                            </div>
                                            <div v-if="op.tarjeta" class="pago-desglose__row">
                                                <span>Cobro Tarjeta</span>
                                                <span>{{ formatPrecio(op.tarjeta.total) }}</span>
                                            </div>
                                            <div class="pago-desglose__row pago-desglose__row--total">
                                                <span>Total a pagar</span>
                                                <span>{{ formatPrecio(op.totalFinal) }}</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <!-- Selector de meses: solo para MENSUALIDAD y RECARGA -->
                            <div v-if="opcionSeleccionada && !esQuincena && !esSoloTarjeta" class="modal-section">
                                <p class="modal-section__title">Meses a renovar</p>
                                <div class="meses-selector">
                                    <button v-for="n in [1, 2]" :key="n" @click="seleccionarMesesExtra(n)"
                                        class="mes-btn" :class="{ 'mes-btn--on': mesesExtra === n }">
                                        <span class="mes-btn__num">{{ n }}</span>
                                        <span class="mes-btn__label">{{ n === 1 ? 'mes' : 'meses' }}</span>
                                    </button>
                                </div>
                                <p v-if="mesesExtra === 2" class="meses-aviso">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#299261"
                                        viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Pagarás 2 meses de una vez — el segundo inicia cuando vence el primero.
                                </p>
                            </div>
                            <!-- Fecha de inicio manual: solo si no tiene vigencia activa -->
                            <div v-if="!mensualidadAccion?.fechaFin" class="modal-section">
                                <p class="modal-section__title">Fecha de inicio</p>
                                <div class="field-group">
                                    <label class="field-label">¿Desde cuándo inicia tu mensualidad?</label>
                                    <input v-model="fechaInicioManual" type="date" class="field-input" :min="hoyISO" />
                                    <p class="field-hint">Selecciona la fecha en que deseas activar tu mensualidad.</p>
                                </div>
                            </div>
                            <div class="modal-section">
                                <div class="modal-notice">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#299261"
                                        viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <p>Al confirmar serás redirigido a la página de pago.</p>
                                </div>
                                <div v-if="errPago"
                                    class="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[0.72rem] font-semibold text-red-600">
                                    {{ errPago }}</div>
                            </div>



                        </template>
                    </div>

                    <!-- Transacción pendiente
                    
                    (${mesesExtra} ${mesesExtra === 1 ? 'mes' : 'meses'})
                    
                    -->

                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarPago"
                            class="btn-modal btn-modal--confirm flex items-center justify-center gap-1.5"
                            :disabled="!opcionSeleccionada || loadingOpciones || iniciandoPago || (!mensualidadAccion?.fechaFin && !fechaInicioManual)">
                            <div v-if="iniciandoPago" class="btn-spinner" />
                            {{ iniciandoPago ? 'Redirigiendo...' : esSoloTarjeta ? 'Ir a pagar (solo tarjeta)' : `Ir a
                            pagar` }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <ModalCongelar v-model="modalCongelar" :cliente="mensualidadAccion?._raw"
            :info-congelamiento="infoCongelamiento" :err-externo="errCongelar" :guardando-externo="guardandoCongelar"
            @confirmar="confirmarCongelar" @cerrar="errCongelar = ''" />

        <!-- Modal: Detalle -->
        <Transition name="modal">
            <div v-if="modalDetalle" class="modal-overlay">
                <div class="modal-card modal-card--detalle">
                    <div class="det-head">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-sm flex-shrink-0">
                                {{ iniciales(mensualidadAccion?.nombre) }}</div>
                            <div>
                                <p class="text-[0.92rem] font-black text-[#0D291C]">{{ mensualidadAccion?.nombre }}</p>
                                <p class="text-[0.65rem] font-semibold text-gray-400">{{ mensualidadAccion?.sede }}</p>
                            </div>
                        </div>
                        <button @click="modalDetalle = false" class="modal-close-btn modal-close-btn--light">✕</button>
                    </div>
                    <div v-if="loadingDetalle" class="flex flex-col items-center justify-center gap-3 py-14">
                        <div class="det-loader" />
                        <span class="text-xs text-gray-400 font-semibold">Cargando información...</span>
                    </div>
                    <template v-else>
                        <div v-if="errDetalle"
                            class="mx-5 mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[0.72rem] font-semibold text-amber-700">
                            {{ errDetalle }}
                        </div>
                        <div class="modal-body det-body">
                            <div class="modal-section">
                                <div class="flex items-center justify-between gap-2">
                                    <span class="card-estado-badge" :class="`badge--${mensualidadAccion?.estado}`">{{
                                        estadoLabel(mensualidadAccion?.estado) }}</span>
                                    <span class="text-xs font-semibold text-gray-400">
                                        <strong class="font-black text-[#0D291C]">{{ diasRestantes(mensualidadAccion)
                                            }}</strong>
                                        días restantes
                                    </span>
                                </div>
                            </div>
                            <div class="modal-section">
                                <p class="modal-section__title">Datos personales</p>
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="det-field">
                                        <span class="det-label">Documento</span>
                                        <span class="det-val font-mono">{{ detalleCompleto?.Documento ??
                                            mensualidadAccion?._raw?.Documento ?? '—' }}</span>
                                    </div>
                                    <div class="det-field">
                                        <span class="det-label">Nombre</span>
                                        <span class="det-val" style="font-size:0.78rem">{{
                                            detalleCompleto?.NombreApellidos ?? mensualidadAccion?._raw?.NombreApellidos
                                            ?? '—' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-section">
                                <p class="modal-section__title">Vigencia</p>
                                <div class="grid grid-cols-2 gap-3 mb-3">
                                    <div class="det-field">
                                        <span class="det-label">Inicio</span>
                                        <span class="det-val">{{ formatFecha(mensualidadAccion?.fechaInicio) }}</span>
                                    </div>
                                    <div class="det-field">
                                        <span class="det-label">Fin</span>
                                        <span class="det-val">{{ formatFecha(mensualidadAccion?.fechaFin) }}</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                        <div class="h-full rounded-full transition-all duration-500"
                                            :class="`fill--${mensualidadAccion?.estado}`"
                                            :style="{ width: `${porcentajeVigencia(mensualidadAccion)}%` }" />
                                    </div>
                                    <span class="text-right text-[0.62rem] font-semibold text-gray-400">
                                        {{ porcentajeVigencia(mensualidadAccion) }}% del periodo
                                    </span>
                                </div>
                            </div>
                            <div class="modal-section">
                                <div class="flex items-center justify-between">
                                    <p class="modal-section__title" style="margin:0;flex:1">Vehículos registrados</p>
                                    <button @click="abrirModalPlacas"
                                        class="flex items-center gap-1.5 text-[0.65rem] font-black px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all ml-3 flex-shrink-0"
                                        :class="placaCambiada ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-[#0D291C] text-[#7FD344] border-[#0D291C] hover:opacity-80'"
                                        :disabled="placaCambiada">
                                        {{ placaCambiada ? 'Cambio realizado este mes' : 'Cambiar placa' }}
                                    </button>

                                    <button @click="abrirModalCambioTipo"
                                        class="flex items-center gap-1.5 text-[0.65rem] font-black px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all flex-shrink-0 bg-[#7FD344] text-[#0D291C] border-[#7FD344] hover:opacity-80">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M7.5 21.5l-5-5 5-5 1.41 1.41L6.33 15.5H13v2H6.33l2.58 2.59L7.5 21.5zm9-9l-1.41-1.41 2.58-2.59H11v-2h6.67l-2.58-2.59L16.5 2.5l5 5-5 5z" />
                                        </svg>
                                        Cambiar tipo
                                    </button>

                                </div>
                                <div v-if="placasDetalle.length" class="flex flex-col gap-2 mt-1">
                                    <div v-for="(placa, idx) in placasDetalle" :key="idx"
                                        class="flex items-center gap-2.5 px-3 py-2 rounded-xl border-2"
                                        :class="idx === 0 ? 'bg-[#f0fdf4] border-[#c8e6c9]' : 'bg-gray-50 border-gray-200'">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            :fill="idx === 0 ? '#299261' : '#9ca3af'" viewBox="0 0 24 24">
                                            <path
                                                d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                        </svg>
                                        <span class="text-[0.8rem] font-black tracking-widest uppercase flex-1"
                                            :class="idx === 0 ? 'text-[#0D291C]' : 'text-gray-500'">{{ placa }}</span>
                                        <span v-if="idx === 0"
                                            class="text-[0.55rem] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#0D291C] text-[#7FD344]">Principal</span>
                                    </div>
                                </div>
                                <p v-else class="text-xs font-semibold text-gray-400 mt-1">Sin vehículos registrados</p>
                            </div>
                            <div class="modal-section">
                                <p class="modal-section__title">Sede</p>
                                <div
                                    class="flex items-center gap-3 rounded-xl px-3.5 py-3 bg-white border-2 border-gray-200">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-[#0D291C] flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#7FD344"
                                            viewBox="0 0 24 24">
                                            <path
                                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </div>
                                    <p class="text-[0.85rem] font-bold text-[#0D291C]">{{
                                        detalleCompleto?.T_Estacionamiento?.Nombre ??
                                        mensualidadAccion?._raw?.T_Estacionamiento?.Nombre ?? '—' }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-foot det-foot">
                            <button @click="modalDetalle = false" class="btn-modal btn-modal--cancel">Cerrar</button>
                        </div>
                    </template>
                </div>
            </div>
        </Transition>

        <!-- Modal: Cambio de placas -->
        <Transition name="modal">
            <div v-if="modalPlacas" class="modal-overlay" style="z-index:60">
                <div class="modal-card modal-card--placas">
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="w-9 h-9 rounded-xl bg-[#7FD344] flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0D291C"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                </svg>
                            </div>
                            <div>
                                <p class="modal-head__name">Cambio de placas</p>
                                <p class="modal-head__sub">{{ mensualidadAccion?.sede }} · 1 cambio por mes</p>
                            </div>
                        </div>
                        <button @click="modalPlacas = false" class="modal-close-btn">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-section">
                            <div class="placa-aviso">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706"
                                    viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                                <p>Solo se permite <strong>1 cambio de placas por mes</strong>. Una vez confirmado, no
                                    podrás realizar otro cambio hasta el próximo mes.</p>
                            </div>
                        </div>
                        <div class="modal-section">
                            <p class="modal-section__title">Editar placas</p>
                            <div class="flex flex-col gap-3">
                                <div v-for="(_, idx) in nuevasPlacas" :key="idx" class="placa-row">
                                    <div class="placa-row__label">
                                        <span class="text-[0.6rem] font-black uppercase tracking-wide text-gray-400">{{
                                            idx === 0 ? 'Principal' : `Placa ${idx + 1}` }}</span>
                                        <span v-if="idx === 0"
                                            class="text-[0.55rem] font-black px-1.5 py-0.5 rounded-full bg-[#0D291C] text-[#7FD344] ml-1.5">Requerida</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="placa-input-wrap">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                                :fill="nuevasPlacas[idx] ? '#299261' : '#d1d5db'" viewBox="0 0 24 24">
                                                <path
                                                    d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                            </svg>
                                            <input v-model="nuevasPlacas[idx]" type="text" maxlength="7"
                                                class="placa-input"
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
                        </div>
                        <div v-if="errPlacas"
                            class="mx-5 mb-1 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[0.72rem] font-semibold text-red-600">
                            {{ errPlacas }}</div>
                    </div>
                    <!-- Banner: upgrade moto→carro requiere pago -->
                    <Transition name="modal">
                        <div v-if="infoExcedente" class="modal-section">
                            <div class="flex flex-col gap-3 rounded-2xl border-2 border-[#c8e6c9] bg-[#f0fdf4] p-4">
                                <div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#299261"
                                        viewBox="0 0 24 24" class="shrink-0">
                                        <path
                                            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                    </svg>
                                    <span class="text-[0.82rem] font-black text-[#0D291C]">Cambio de autorización</span>
                                </div>
                                <div
                                    class="flex items-center justify-between text-[0.72rem] font-semibold text-gray-500">
                                    <span>{{ infoExcedente.autorizacionAnterior }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#299261"
                                        viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    <span class="font-black text-[#0D291C]">{{ infoExcedente.autorizacionNueva }}</span>
                                </div>
                                <div
                                    class="flex flex-col gap-1.5 rounded-xl bg-white border border-[#c8e6c9] px-3 py-2.5">
                                    <div class="flex justify-between text-[0.7rem] font-semibold text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{{ formatPrecio(infoExcedente.excedente?.subtotal) }}</span>
                                    </div>
                                    <div class="flex justify-between text-[0.7rem] font-semibold text-gray-500">
                                        <span>IVA</span>
                                        <span>{{ formatPrecio(infoExcedente.excedente?.iva) }}</span>
                                    </div>
                                    <div
                                        class="flex justify-between text-[0.82rem] font-black text-[#0D291C] border-t border-[#e8f5e9] pt-1.5 mt-0.5">
                                        <span>Total a pagar</span>
                                        <span class="text-[#299261]">{{ formatPrecio(infoExcedente.excedente?.total)
                                        }}</span>
                                    </div>
                                </div>
                                <p class="text-[0.68rem] font-semibold text-gray-400 leading-relaxed">
                                    Al confirmar serás redirigido a la pasarela de pago para cubrir el excedente por la
                                    diferencia de autorización.
                                </p>
                            </div>
                        </div>
                    </Transition>


                    <div class="modal-foot">
                        <button @click="infoExcedente ? (infoExcedente = null) : (modalPlacas = false)"
                            class="btn-modal btn-modal--cancel">
                            {{ infoExcedente ? 'Volver' : 'Cancelar' }}
                        </button>
                        <button v-if="!infoExcedente" @click="confirmarCambioPlacas"
                            class="btn-modal btn-modal--confirm flex items-center justify-center gap-2"
                            :disabled="!nuevasPlacas[0]?.trim() || guardandoPlacas">
                            <div v-if="guardandoPlacas" class="btn-spinner" />
                            Confirmar cambio
                        </button>
                        <button v-else @click="confirmarPagoExcedente"
                            class="btn-modal btn-modal--confirm flex items-center justify-center gap-1.5">
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

        <!-- Modal: Consentimiento -->
        <Transition name="modal">
            <div v-if="modalConsentimiento" class="modal-overlay" style="z-index:55">
                <div class="modal-card modal-card--consentimiento">
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="w-9 h-9 rounded-xl bg-[#7FD344] flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0D291C"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z" />
                                </svg>
                            </div>
                            <div>
                                <p class="modal-head__name">Antes de continuar</p>
                                <p class="modal-head__sub">Tratamiento de datos personales</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close-btn">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-section" style="align-items:center; padding-top:28px; padding-bottom:20px;">
                            <img src="@/assets/img/logo-avalpay-center.webp" alt="AvalPay"
                                style="height:48px; object-fit:contain;"
                                @error="$event.target.style.display = 'none'" />
                            <p
                                style="font-size:0.72rem; color:#6b7280; font-weight:600; text-align:center; line-height:1.5; margin-top:4px;">
                                El proceso de pago es gestionado de forma segura por
                                <strong style="color:#0D291C;">AvalPay</strong>
                            </p>
                        </div>
                        <div class="modal-section">
                            <div class="consentimiento-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#299261"
                                    viewBox="0 0 24 24" class="shrink-0 mt-[1px]">
                                    <path
                                        d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                                <div>
                                    <p style="font-size:0.8rem; font-weight:800; color:#0D291C; margin-bottom:3px;">
                                        Política de Tratamiento de Datos
                                    </p>
                                    <p style="font-size:0.7rem; color:#6b7280; font-weight:600; line-height:1.55;">
                                        Al realizar este pago, tus datos personales serán tratados conforme a nuestra
                                        política de privacidad y las normas de la Ley 1581 de 2012.
                                    </p>
                                    <a href="https://parquearse.com/pdf/politicadetratamientosdedatos.pdf"
                                        target="_blank"
                                        style="display:inline-flex; align-items:center; gap:5px; margin-top:8px; font-size:0.7rem; font-weight:800; color:#299261; text-decoration:none; padding:5px 10px; border-radius:8px; border:1.5px solid #c8e6c9; background:#f0fdf4; transition:background 0.15s;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V9H10c.83 0 1.5.67 1.5 1.5v.5zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V9H15c.83 0 1.5.67 1.5 1.5v2zm4-3H19v1h1.5V11H19v2h-1.5V9h3v1zM9 10.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-2h-1v2z" />
                                        </svg>
                                        Ver política completa (PDF)
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="modal-section">
                            <label class="consentimiento-check"
                                :class="{ 'consentimiento-check--on': consentimientoAceptado }">
                                <input type="checkbox" v-model="consentimientoAceptado" style="display:none;" />
                                <div class="check-box" :class="{ 'check-box--on': consentimientoAceptado }">
                                    <svg v-if="consentimientoAceptado" xmlns="http://www.w3.org/2000/svg" width="12"
                                        height="12" fill="#7FD344" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                </div>
                                <span>He leído y acepto la <strong>Política de Tratamiento de Datos
                                        Personales</strong></span>
                            </label>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarConsentimiento"
                            class="btn-modal btn-modal--confirm flex items-center justify-center gap-1.5"
                            :disabled="!consentimientoAceptado">
                            Continuar al pago
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <ModalFacturacion v-model="modalFacturacion"
            :documento-usuario="String(authStore.user?.documento ?? authStore.user?.Documento ?? '')"
            :nombre-usuario="String((authStore.user?.nombres ?? authStore.user?.Nombres ?? '') + ' ' + (authStore.user?.apellidos ?? authStore.user?.Apellidos ?? '')).trim()"
            :email-usuario="String(authStore.user?.email ?? authStore.user?.Email ?? '')"
            :telefono-usuario="String(authStore.user?.telefono ?? authStore.user?.Telefono ?? '')"
            @confirmar="ejecutarPago" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MensualidadesService from '@/api/services/mensualidades.service'
import PagoService from '@/api/services/pagos.service'
import ModalCongelar from '@/components/modals/ModalCongelar.vue'
import ModalFacturacion from '@/components/modals/ModalFacturacion.vue'
import { useAuthStore } from '@/stores/auth'

// ── Stores ────────────────────────────────────────────────────
const authStore = useAuthStore()

// ── Estado global ─────────────────────────────────────────────
const loading = ref(false)
const mensualidades = ref([])

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
const usandoCambioAutorizacion = ref(false)  // ← agregar aquí

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
const pagoPendiente = ref(null) // { urlPago, referencia, valor, cus }

// ── Constantes ────────────────────────────────────────────────
const hoyISO = new Date().toISOString().slice(0, 10)
const PLACA_KEYS = ['Placa1', 'Placa2', 'Placa3', 'Placa4', 'Placa5']

// ── Computeds ─────────────────────────────────────────────────
const esQuincena = computed(() => opcionSeleccionada.value?.modalidad === 'QUINCENA')
const esSoloTarjeta = computed(() => opcionSeleccionada.value?.modalidad === 'SOLO_TARJETA')

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
    ({ activa: 'Activa', por_vencer: 'Por vencer', vencida: 'Vencida', congelada: 'Congelada' })[e] ?? e

const estadoClase = (m) => ({
    'card--activa': m.estado === 'activa',
    'card--por_vencer': m.estado === 'por_vencer',
    'card--vencida': m.estado === 'vencida',
    'card--congelada': m.estado === 'congelada',
})

const mesActual = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const verificarLimiteMensual = (id) =>
    localStorage.getItem(`placa_changed_${id}_${mesActual()}`) === '1'

const marcarCambioMensual = (id) =>
    localStorage.setItem(`placa_changed_${id}_${mesActual()}`, '1')

const diasRestantes = (m) => {
    const ff = typeof m === 'object' ? m?.fechaFin : (typeof m === 'string' ? m : null)
    const fi = typeof m === 'object' ? m?.fechaInicio : null
    if (!ff) return 0
    const fin = parseLocal(ff)
    const ini = fi ? parseLocal(fi) : null
    if (!fin) return 0
    if (ini) return Math.max(0, Math.round((fin - ini) / 86400000))
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    return Math.max(0, Math.round((fin - hoy) / 86400000))
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

    // FechaInicio futura = congelamiento programado, la vigencia aún no arrancó
    if (m.FechaInicio && m.FechaFin) {
        const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
        const inicio = parseLocal(m.FechaInicio)
        if (inicio > hoy) return 'congelada'
    }

    if (!m.Estado) return 'vencida'
    if (!m.FechaFin) return 'activa'
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const fin = parseLocal(m.FechaFin)
    const dias = (fin - hoy) / 86400000
    if (dias < 0) return 'vencida'
    if (dias <= 7) return 'por_vencer'
    return 'activa'
}

// ── Cargar mensualidades ──────────────────────────────────────
const cargarMisMensualidades = async () => {
    loading.value = true
    try {
        const res = await MensualidadesService.getMisMensualidades()
        const raw = Array.isArray(res) ? res : (res?.data ?? [])
        mensualidades.value = raw.map(m => ({
            _raw: m,
            id: m.IdPersonaAutorizada,
            nombre: m.NombreApellidos ?? '—',
            fechaInicio: m.FechaInicio ? m.FechaInicio.slice(0, 10) : null,
            fechaFin: m.FechaFin ? m.FechaFin.slice(0, 10) : null,
            sede: m.T_Estacionamiento?.Nombre ?? '—',
            mensualidad: m.T_Autorizaciones?.NombreAutorizacion ?? '—',
            placas: PLACA_KEYS.map(k => m[k]).filter(Boolean),
            estado: resolverEstado(m),
            conPago: !!(m.FechaFin && parseLocal(m.FechaFin) > new Date()),
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
    mensualidadAccion.value = m
    detalleCompleto.value = null
    placasDetalle.value = []
    errDetalle.value = ''
    placaCambiada.value = verificarLimiteMensual(m.id)
    loadingDetalle.value = true
    modalDetalle.value = true
    try {
        const res = await MensualidadesService.getMiMensualidadById(m.id)
        const data = res?.data ?? res
        detalleCompleto.value = data
        placasDetalle.value = PLACA_KEYS.map(k => data[k]).filter(Boolean)
    } catch {
        errDetalle.value = 'No se pudo cargar el detalle. Mostrando datos parciales.'
        placasDetalle.value = m.placas ?? []
    } finally {
        loadingDetalle.value = false
    }
}

const abrirModalCambioTipo = () => {
    errPlacas.value = ''
    infoExcedente.value = null
    usandoCambioAutorizacion.value = true
    nuevasPlacas.value = ['', '']
    modalPlacas.value = true
}

// ── Placas ────────────────────────────────────────────────────
const abrirModalPlacas = () => {
    if (placaCambiada.value) return
    errPlacas.value = ''
    infoExcedente.value = null
    infoAutorizacion.value = null
    usandoCambioAutorizacion.value = false  // ← siempre false al abrir cambio de placas normal
    const totalFilas = Math.max(placasDetalle.value.length, 2)
    nuevasPlacas.value = PLACA_KEYS.slice(0, totalFilas).map((_, i) => placasDetalle.value[i] ?? '')
    modalPlacas.value = true

    // Cargar info de autorización en paralelo (no bloquea apertura del modal)
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

    // ← Verificar límite mensual para AMBOS flujos antes de cualquier llamada
    if (verificarLimiteMensual(mensualidadAccion.value.id)) {
        errPlacas.value = 'Ya realizaste un cambio de placas o autorización este mes.'
        return
    }

    guardandoPlacas.value = true
    try {
        if (usandoCambioAutorizacion.value) {

            const placasPayload = nuevasPlacas.value
                .map((val, i) => {
                    const placa = val?.trim().toUpperCase() || null
                    return placa ? [{ ColumnaPlaca: PLACA_KEYS[i], PlacaNueva: placa }] : []
                })
                .filter(arr => arr.length > 0)

            await MensualidadesService.cambiarAutorizacion({
                IdPersonaAutorizada: Number(mensualidadAccion.value.id),
                Placas: placasPayload,
                // ← sin Email, Telefono, IdentificacionCliente
            })

            // 200 = downgrade carro→moto, aplicado directo
            _aplicarCambioPlacasLocal()
            await cargarMisMensualidades()
            modalPlacas.value = false
            modalDetalle.value = false

        } else {
            // ── Cambio de placas normal (mismo tipo) → cambio-placas

            const Detalles = PLACA_KEYS.map((columna, i) => {
                const nueva = nuevasPlacas.value[i]?.trim().toUpperCase() || null
                const actual = placasDetalle.value[i] ?? null
                return nueva !== actual ? { ColumnaPlaca: columna, PlacaNueva: nueva ?? '' } : null
            }).filter(Boolean)

            if (!Detalles.length) { errPlacas.value = 'No hay cambios para guardar.'; return }

            await MensualidadesService.cambiarPlacas({
                IdPersonaAutorizada: Number(mensualidadAccion.value.id),
                Detalles,
            })
            _aplicarCambioPlacasLocal()
            modalPlacas.value = false
        }

    } catch (e) {
        const status = e?.response?.status
        const responseData = e?.response?.data

        console.log('[cambioTipo] status:', status, 'data:', JSON.stringify(responseData))

        if (usandoCambioAutorizacion.value && status === 409 && responseData?.data?.requierePago) {
            console.log('[cambioTipo] infoExcedente seteado:', JSON.stringify(responseData.data))
            infoExcedente.value = responseData.data
            return
        }
        const msg = responseData?.message
        if (status === 409) errPlacas.value = 'Ya existe una solicitud de cambio de placas para este mes.'
        else if (status === 404) errPlacas.value = 'Persona autorizada no encontrada.'
        else if (status === 400) errPlacas.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Datos inválidos.')
        else errPlacas.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al procesar el cambio.')
    } finally {
        guardandoPlacas.value = false
    }
}

// Helper: actualiza estado local de placas después de un cambio exitoso
const _aplicarCambioPlacasLocal = () => {
    const nuevas = nuevasPlacas.value.map(p => p?.trim().toUpperCase() || null).filter(Boolean)
    placasDetalle.value = nuevas
    const idx = mensualidades.value.findIndex(m => m.id === mensualidadAccion.value.id)
    if (idx !== -1) mensualidades.value[idx].placas = [...nuevas]
    marcarCambioMensual(mensualidadAccion.value.id)
    placaCambiada.value = true
}

const confirmarPagoExcedente = () => {
    modalPlacas.value = false
    consentimientoAceptado.value = false
    modalConsentimiento.value = true
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
    try {
        const res = await MensualidadesService.crearCongelamiento(mensualidadAccion.value.id, {
            FechaInicioPeriodoNvo,
            Observacion,
        })
        cerrarModales()
        await cargarMisMensualidades()
    } catch (e) {
        const status = e?.response?.status
        const msg = e?.response?.data?.message
        console.error('[Congelar] crearCongelamiento error:', status, e?.response?.data)
        if (status === 409) errCongelar.value = 'Ya existe un congelamiento activo que se solapa.'
        else errCongelar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al congelar.')
    } finally {
        guardandoCongelar.value = false
    }
}

// ── Pago ──────────────────────────────────────────────────────
const abrirPago = async (m) => {
    mensualidadAccion.value = m
    opcionesPago.value = []
    opcionSeleccionada.value = null
    errPago.value = ''
    pagoPendiente.value = null
    mesesExtra.value = 1
    fechaInicioManual.value = m.fechaFin ? '' : hoyISO
    loadingOpciones.value = true
    modalPago.value = true

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
            // ✅ Fix 4: no dejar loadingOpciones colgado si el bloque interno falla
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
        // ✅ Fix 5: el finally siempre apaga el spinner, incluso si ya se apagó antes
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

const confirmarPago = () => {
    if (!opcionSeleccionada.value) return
    modalPago.value = false
    consentimientoAceptado.value = false
    modalConsentimiento.value = true
}

const confirmarConsentimiento = () => {
    if (!consentimientoAceptado.value) return
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
        const user = authStore.user
        const email = String(user?.email ?? user?.Email ?? '')
        const telefono = String(user?.telefono ?? user?.Telefono ?? '')

        if (!email) { errPago.value = 'No se encontró el email del usuario.'; return }

        // ── Caso: pago de excedente por cambio de autorización ──
        if (excedentePendiente) {
            const datosPago = excedentePendiente.datosPago
            const placasNuevas = datosPago?.placasNuevas ?? {}

            // ← filtrar las null, solo enviar las que tienen valor
            const placasPayload = PLACA_KEYS
                .filter(key => placasNuevas[key])
                .map(key => [{ ColumnaPlaca: key, PlacaNueva: placasNuevas[key] }])

            const body = {
                Email: email,
                Telefono: telefono,
                CantidadMeses: 1,
                ModalidadPago: 'CAMBIO_AUTORIZACION',
                IdentificacionCliente,
                IdAutorizacionNueva: Number(excedentePendiente.IdAutorizacionNueva),
                Placas: placasPayload,
            }

            const res = await PagoService.iniciarPago(m.id, body)
            const data = res?.data ?? res
            const url = data?.urlPago ?? null
            if (url) { window.location.href = url; return }

            infoExcedente.value = excedentePendiente
            nuevasPlacas.value = placasSnapshot
            errPago.value = 'No se recibió la URL de pago. Intenta de nuevo.'
            modalPlacas.value = true
            return
        }

        // ── Caso normal: renovación de mensualidad ──
        const cantidadMeses = esSoloTarjeta.value ? 1 : (opcionSeleccionada.value?.cantidadMeses ?? 1)
        const body = {
            Email: email,
            Telefono: telefono,
            CantidadMeses: cantidadMeses,
            ModalidadPago: opcionSeleccionada.value.modalidad,
            IdentificacionCliente,
            ...(!m.fechaFin && fechaInicioManual.value ? { FechaInicio: fechaInicioManual.value } : {}),
        }
        const res = await PagoService.iniciarPago(m.id, body)
        const data = res?.data ?? res
        const url = data?.urlPago ?? null
        if (url) { window.location.href = url; return }
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
    modalPlacas.value = false          // ← asegurarse que también cierra este
    pagoPendiente.value = null
    codigoInput.value = ''
    mensualidadAccion.value = null
    opcionesPago.value = []
    opcionSeleccionada.value = null
    fechaInicioManual.value = ''
    mesesExtra.value = 1
    errPago.value = ''
    errCongelar.value = ''
    consentimientoAceptado.value = false
    iniciandoPago.value = false
    infoExcedente.value = null
    infoAutorizacion.value = null
    errPlacas.value = ''
    nuevasPlacas.value = ['', '', '', '', '']
    usandoCambioAutorizacion.value = false

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

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}

.mensualidad-card {
    background: white;
    border-radius: 24px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 2px solid #e8f5e9;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 16px rgba(13, 41, 28, 0.06);
    position: relative;
    overflow: hidden;
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
    transition: box-shadow 0.18s, transform 0.18s
}

.mensualidad-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #c8ddd1, 0 4px 20px rgba(13, 41, 28, 0.1)
}

.card--congelada {
    background: linear-gradient(145deg, #eff6ff 0%, #f0f9ff 100%);
    border-color: #bfdbfe;
    box-shadow: 0 4px 0 #93c5fd, 0 2px 16px rgba(59, 130, 246, 0.1)
}

.card--congelada:hover {
    box-shadow: 0 6px 0 #7db8f7, 0 4px 20px rgba(59, 130, 246, 0.15)
}

.card-band {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 24px 24px 0 0
}

.card-band--activa {
    background: #7FD344
}

.card-band--por_vencer {
    background: #f59e0b
}

.card-band--vencida {
    background: #dc2626
}

.card-band--congelada {
    background: #60a5fa
}

.card-estado-badge {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 2px 8px;
    border-radius: 999px;
    margin-top: 3px;
    border: 1px solid
}

.badge--activa {
    background: #dcfce7;
    color: #16a34a;
    border-color: #bbf7d0
}

.badge--por_vencer {
    background: #fef3c7;
    color: #d97706;
    border-color: #fde68a
}

.badge--vencida {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fecaca
}

.badge--congelada {
    background: #dbeafe;
    color: #2563eb;
    border-color: #bfdbfe
}

.card-dias--activa .card-dias__num {
    color: #299261
}

.card-dias--por_vencer .card-dias__num {
    color: #d97706
}

.card-dias--vencida .card-dias__num {
    color: #dc2626
}

.card-dias--congelada .card-dias__num {
    color: #3b82f6
}

.fill--activa {
    background: #7FD344
}

.fill--por_vencer {
    background: #f59e0b
}

.fill--vencida {
    background: #dc2626
}

.fill--congelada {
    background: #60a5fa
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 16px
}

.modal-card {
    background: white;
    border: 2px solid #0D291C;
    border-radius: 24px;
    box-shadow: 0 6px 0 #000;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    overflow-y: auto
}

.modal-card--detalle {
    max-width: 440px
}

.modal-card--placas {
    max-width: 460px
}

.modal-card--consentimiento {
    max-width: 400px
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 14px;
    background: #0D291C;
    border-bottom: 2px solid #0a1f15
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px
}

.modal-head__name {
    font-size: 0.9rem;
    font-weight: 800;
    color: white
}

.modal-head__sub {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 600
}

.det-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 14px;
    background: #f8fafb;
    border-bottom: 2px solid #e2e8f0
}

.modal-close-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    font-weight: 900;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    transition: background 0.12s, color 0.12s, border-color 0.12s
}

.modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.22);
    color: white;
    border-color: rgba(255, 255, 255, 0.45)
}

.modal-close-btn--light {
    background: #f1f5f9;
    color: #64748b;
    border-color: #cbd5e1
}

.modal-close-btn--light:hover {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fca5a5
}

.modal-body {
    display: flex;
    flex-direction: column;
    background: white
}

.det-body {
    max-height: 62vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #c8e6c9 transparent
}

.modal-section {
    padding: 16px 20px;
    border-bottom: 1.5px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 10px
}

.modal-section:last-child {
    border-bottom: none
}

.modal-section__title {
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #299261;
    display: flex;
    align-items: center;
    gap: 8px
}

.modal-section__title::after {
    content: '';
    flex: 1;
    height: 1.5px;
    background: linear-gradient(90deg, #c8e6c9, transparent);
    border-radius: 99px
}

.modal-notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: #f0fdf4;
    border: 1.5px solid #c8e6c9;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #166534;
    line-height: 1.5
}

.modal-foot {
    display: flex;
    gap: 10px;
    padding: 12px 20px 18px;
    background: white;
    border-top: 2px solid #e2e8f0
}

.det-foot {
    border-top: 2px solid #e8f5e9
}

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
    transition: transform 0.1s, box-shadow 0.1s
}

.btn-modal:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important
}

.btn-modal:disabled {
    opacity: 0.4;
    cursor: not-allowed
}

.btn-modal--cancel {
    background: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 1px 0 #000
}

.btn-modal--confirm {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 1px 0 #051510
}

.btn-modal--confirm:hover:not(:disabled) {
    background: #132e21
}

.btn-spinner {
    display: inline-block;
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    border: 2px solid rgba(127, 211, 68, 0.3);
    border-top-color: #7FD344;
    border-radius: 50%;
    animation: spin 0.7s linear infinite
}

.meses-selector {
    display: flex;
    gap: 10px
}

.mes-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 12px 10px;
    border-radius: 14px;
    border: 2px solid #e2e8f0;
    background: #f8fafb;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 2px 0 #e2e8f0
}

.mes-btn:hover {
    border-color: #c8e6c9;
    background: #f0fdf4
}

.mes-btn--on {
    border-color: #299261 !important;
    background: #0D291C !important;
    box-shadow: 0 3px 0 #051510 !important
}

.mes-btn__num {
    font-size: 1.6rem;
    font-weight: 900;
    line-height: 1;
    color: #0D291C;
    transition: color 0.15s
}

.mes-btn--on .mes-btn__num {
    color: #7FD344
}

.mes-btn__label {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9ca3af;
    transition: color 0.15s
}

.mes-btn--on .mes-btn__label {
    color: rgba(127, 211, 68, 0.6)
}

.meses-aviso {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    color: #166534;
    background: #f0fdf4;
    border: 1.5px solid #c8e6c9;
    border-radius: 10px;
    padding: 8px 12px;
    line-height: 1.5
}

.pago-opcion {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 2px solid #e2e8f0;
    background: #f8fafb;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 0 #e2e8f0
}

.pago-opcion:hover {
    border-color: #c8e6c9;
    background: #f0fdf4
}

.pago-opcion--selected {
    border-color: #299261 !important;
    background: #f0fdf4 !important;
    box-shadow: 0 2px 0 #c8e6c9 !important
}

.pago-desglose {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-top: 10px;
    border-top: 1.5px solid #e2e8f0
}

.pago-desglose__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    font-weight: 600;
    color: #6b7280
}

.pago-desglose__row--total {
    font-size: 0.92rem;
    font-weight: 900;
    color: #0D291C;
    padding-top: 5px;
    border-top: 1.5px solid #e2e8f0;
    margin-top: 2px
}

.pago-desglose__row--total span:last-child {
    color: #299261
}

.det-field {
    display: flex;
    flex-direction: column;
    gap: 3px
}

.det-label {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #9ca3af
}

.det-val {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0D291C
}

.det-loader {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid #e8f5e9;
    border-top-color: #299261;
    animation: spin 0.7s linear infinite
}

.placa-aviso {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: #fffbeb;
    border: 1.5px solid #fde68a;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #92400e;
    line-height: 1.5
}

.placa-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 12px;
    border-radius: 14px;
    background: #f8fafb;
    border: 1.5px solid #e2e8f0
}

.placa-row__label {
    display: flex;
    align-items: center;
    margin-bottom: 2px
}

.placa-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    background: white;
    border: 2px solid #d1d5db;
    border-radius: 10px;
    padding: 8px 12px;
    transition: border-color 0.15s, box-shadow 0.15s
}

.placa-input-wrap:focus-within {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12)
}

.placa-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: monospace;
    font-weight: 900;
    font-size: 0.95rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #0D291C;
    min-width: 0
}

.placa-input::placeholder {
    color: #d1d5db;
    font-weight: 600;
    letter-spacing: 0.05em
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px
}

.field-label {
    font-size: 0.63rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #374151;
    padding-left: 2px
}

.field-hint {
    font-size: 0.7rem;
    color: #6b7280;
    line-height: 1.5;
    padding-left: 2px
}

.field-input {
    background: white !important;
    border: 2px solid #d1d5db !important;
    border-radius: 12px !important;
    padding: 10px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s
}

.field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important
}

.field-input--code {
    font-family: monospace;
    letter-spacing: 0.1em;
    font-size: 1rem !important;
    text-align: center
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

.mensualidades-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    align-content: start
}

@media (max-width: 700px) {
    .mensualidades-grid {
        grid-template-columns: 1fr
    }

    .card-actions {
        grid-template-columns: repeat(3, 1fr)
    }

    .card-actions:has(> :nth-child(3))> :first-child {
        grid-column: auto
    }
}

.card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 6px
}

.card-head__info {
    flex: 1;
    min-width: 0
}

.card-nombre {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D291C;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

.card-avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.85rem;
    flex-shrink: 0;
    border: 2px solid #e8f5e9
}

.card-dias {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    background: #f8fafb;
    border-radius: 12px;
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0
}

.card-dias__num {
    font-size: 1.4rem;
    font-weight: 900;
    line-height: 1
}

.card-dias__label {
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.5;
    color: black
}

.card-data {
    display: flex;
    flex-direction: column;
    gap: 7px;
    background: #f8fafb;
    border-radius: 14px;
    padding: 12px 14px;
    border: 1.5px solid #e2e8f0
}

.card-data__item {
    display: flex;
    align-items: center;
    gap: 8px
}

.card-data__item svg {
    color: #9ca3af;
    flex-shrink: 0
}

.card-data__label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    min-width: 44px
}

.card-data__val {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D291C
}

.card-progress-wrap {
    display: flex;
    flex-direction: column;
    gap: 5px
}

.card-progress-bar {
    height: 6px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden
}

.card-progress-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.6s ease
}

.card-progress-label {
    font-size: 0.62rem;
    font-weight: 600;
    color: #9ca3af;
    text-align: right
}

.card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%
}

.card-actions:has(> :nth-child(3))> :first-child {
    grid-column: 1 / -1
}

.consentimiento-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    background: #f0fdf4;
    border: 1.5px solid #c8e6c9;
    border-radius: 16px
}

.consentimiento-check {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 14px;
    border: 2px solid #e2e8f0;
    background: #f8fafb;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 600;
    color: #374151;
    line-height: 1.5;
    transition: border-color 0.15s, background 0.15s;
    user-select: none
}

.consentimiento-check--on {
    border-color: #299261 !important;
    background: #f0fdf4 !important
}

.check-box {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 2px solid #d1d5db;
    background: white;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, background 0.15s;
    margin-top: 1px
}

.check-box--on {
    background: #0D291C;
    border-color: #0D291C
}

.modal-pago .modal-card {
    max-height: calc(100vh - 32px)
}

.modal-pago .modal-body {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: #c8e6c9 transparent
}

.modal-pago .modal-foot {
    flex-shrink: 0
}

@media (max-width: 720px) {
    .modal-pago .modal-card {
        max-height: 95%;
    }
}
</style>