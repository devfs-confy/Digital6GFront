<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Mis PQRS</h2>
            <button @click="abrirNuevaPqrs"
                class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline">Nueva</span>
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto">
                <table class="border-collapse min-w-[700px] w-full">
                    <thead>
                        <tr>
                            <th
                                class="px-4 py-3  text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#7FD344]  border-b-2 border-[#e8f5e9] bg-[#0D291C] whitespace-nowrap">
                                Radicado</th>
                            <th
                                class="px-4 py-3  text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#7FD344]  border-b-2 border-[#e8f5e9] bg-[#0D291C] whitespace-nowrap">
                                Motivo</th>
                            <th
                                class="px-4 py-3  text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#7FD344]  border-b-2 border-[#e8f5e9] bg-[#0D291C] whitespace-nowrap">
                                Descripción</th>
                            <th
                                class="px-4 py-3  text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#7FD344]  border-b-2 border-[#e8f5e9] bg-[#0D291C] whitespace-nowrap">
                                Estado</th>
                            <th
                                class="px-4 py-3  text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#7FD344]  border-b-2 border-[#e8f5e9] bg-[#0D291C] whitespace-nowrap">
                                Fecha</th>
                            <th
                                class="px-4 py-3  text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#7FD344]  border-b-2 border-[#e8f5e9] bg-[#0D291C] whitespace-nowrap">
                                Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="text-center py-20">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando PQRS...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="listaPqrs.length === 0">
                            <td colspan="6" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                                    </svg>
                                    <span class="text-sm font-medium">No tienes PQRS registradas</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="pqrs in listaPqrs" :key="pqrs.Id"
                            class="border-b border-[#e8f5e9] last:border-b-0 transition-colors duration-150 hover:bg-[#f0faf4]">
                            <td
                                class="px-4 py-3 text-[0.8rem] text-[#0D291C] font-mono tracking-wide whitespace-nowrap">
                                #{{ pqrs.Id }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span
                                    class="inline-block px-[10px] py-[3px] rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                                    {{ pqrs.Motivo?.Nombre ?? pqrs.Motivo ?? '—' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 max-w-[220px]">
                                <span class="block truncate text-[0.82rem] text-gray-600">{{ pqrs.Descripcion ?? '—'
                                }}</span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="inline-flex items-center gap-1 text-[0.8rem] font-extrabold" :class="{
                                    'text-[#299261]': pqrs.Estado === 'CERRADO',
                                    'text-amber-500': pqrs.Estado === 'EN_PROCESO' || pqrs.Estado === 'ABIERTO',
                                    'text-gray-400': !pqrs.Estado,
                                }">● {{ estadoLabel(pqrs.Estado) }}</span>
                            </td>
                            <td class="px-4 py-3 text-[0.82rem] text-gray-500 whitespace-nowrap">{{
                                formatFecha(pqrs.FechaCreacion) }}</td>
                            <td class="px-4 py-3 text-center">
                                <button @click="abrirDetalle(pqrs)"
                                    class="w-8 h-8 rounded-[10px] flex items-center justify-center cursor-pointer bg-transparent text-gray-400 hover:bg-[#e8f5e9] hover:text-[#299261] transition-all mx-auto border-0"
                                    title="Ver detalle">
                                    <AppIcon name="visibility" :size="20" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ───── MODAL: NUEVA PQRS ───── -->
        <Transition name="pqrs-modal">
            <div v-if="modalNuevo"
                class="fixed inset-0 z-[999] flex items-center justify-end-mobile justify-center p-4 bg-[#0D291C]/60 backdrop-blur-[6px]">
                <div
                    class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden pqrs-card-shadow">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <p
                                    class="text-[0.95rem] font-black text-white italic uppercase tracking-[-0.01em] leading-none">
                                    Nueva PQRS</p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    Completa los datos de tu solicitud</p>
                            </div>
                        </div>
                        <button @click="modalNuevo = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[0.85rem] font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div
                        class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-[14px] [scrollbar-width:thin] [scrollbar-color:rgba(13,41,28,0.2)_transparent]">

                        <p
                            class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-45 border-b border-[#0D291C]/12 pb-[5px]">
                            Información de la solicitud</p>

                        <!-- Tipo + Motivo -->
                        <div class="grid grid-cols-2 max-[480px]:grid-cols-1 gap-[10px]">
                            <div class="flex flex-col gap-[5px]">
                                <label
                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">Tipo
                                    *</label>
                                <select v-model="fN.Tipo" class="pqrs-input">
                                    <option value="">Seleccionar tipo</option>
                                    <option value="PETICION">Petición</option>
                                    <option value="QUEJA">Queja</option>
                                    <option value="RECLAMO">Reclamo</option>
                                    <option value="SUGERENCIA">Sugerencia</option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <label
                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">Motivo
                                    *</label>
                                <div v-if="loadingMotivos"
                                    class="flex items-center gap-2 bg-white/50 border-2 border-[#0D291C] rounded-[13px] px-[13px] py-[9px] text-[0.78rem] font-semibold text-[#0D291C] opacity-50">
                                    <div
                                        class="w-[14px] h-[14px] border-2 border-[#0D291C] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                    <span>Cargando...</span>
                                </div>
                                <select v-else v-model="fN.IdMotivo" class="pqrs-input">
                                    <option value="">Seleccionar motivo</option>
                                    <option v-for="m in motivos" :key="m.IdMotivo" :value="m.IdMotivo">{{ m.Nombre }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Asunto -->
                        <div class="flex flex-col gap-[5px]">
                            <div class="flex items-center justify-between">
                                <label
                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">Asunto
                                    *</label>
                                <span class="text-[0.58rem] font-semibold text-[#0D291C] opacity-35">{{ fN.Asunto.length
                                }}/50</span>
                            </div>
                            <input v-model="fN.Asunto" type="text" class="pqrs-input"
                                placeholder="Ej: Problema con el acceso al parqueadero" maxlength="50" />
                        </div>

                        <!-- Descripción -->
                        <div class="flex flex-col gap-[5px]">
                            <div class="flex items-center justify-between">
                                <label
                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">Descripción
                                    *</label>
                                <span class="text-[0.58rem] font-semibold text-[#0D291C] opacity-35">{{
                                    fN.Descripcion.length }}/250</span>
                            </div>
                            <textarea v-model="fN.Descripcion" class="pqrs-input resize-y min-h-[90px]"
                                placeholder="Describe con detalle tu petición, queja, reclamo o sugerencia..." rows="3"
                                maxlength="250" />
                        </div>

                        <!-- Imagen adjunta (opcional) -->
                        <div class="flex flex-col gap-[5px]">
                            <label
                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">
                                Imagen adjunta <span class="normal-case opacity-60 font-semibold">(opcional)</span>
                            </label>

                            <!-- Sin imagen seleccionada: zona de clic -->
                            <label v-if="!previewUrl"
                                class="flex flex-col items-center justify-center gap-2 px-4 py-5 border-2 border-dashed border-[#0D291C]/30 rounded-[13px] cursor-pointer bg-white/60 hover:bg-white hover:border-[#299261] transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0D291C"
                                    class="opacity-25" viewBox="0 0 24 24">
                                    <path
                                        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                                <span class="text-[0.72rem] font-semibold text-[#0D291C] opacity-40">Haz clic para
                                    adjuntar una imagen</span>
                                <span class="text-[0.62rem] text-[#0D291C] opacity-30">JPG, PNG o WEBP · máx. 5MB</span>
                                <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
                                    @change="handleFileChange" />
                            </label>

                            <!-- Con imagen seleccionada: preview + botón quitar -->
                            <div v-else
                                class="relative rounded-[13px] overflow-hidden border-2 border-[#299261] bg-white">
                                <img :src="previewUrl" alt="Preview" class="w-full max-h-[180px] object-cover" />
                                <button type="button" @click="quitarImagen"
                                    class="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white border-2 border-red-200 text-red-500 text-xs font-black flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors shadow-sm">
                                    ✕
                                </button>
                                <div class="px-3 py-1.5 bg-[#f0faf4] border-t border-[#c8e6c9]">
                                    <span class="text-[0.65rem] font-semibold text-[#299261] truncate block">{{
                                        selectedFile?.name }}</span>
                                </div>
                            </div>

                            <!-- Error de imagen -->
                            <p v-if="errImagen" class="text-[0.68rem] font-bold text-red-600 pl-1">{{ errImagen }}</p>
                        </div>


                        <p
                            class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-45 border-b border-[#0D291C]/12 pb-[5px] mt-1">
                            Datos de contacto</p>

                        <!-- Contacto grid -->
                        <div class="grid grid-cols-2 max-[480px]:grid-cols-1 gap-[10px]">
                            <div class="flex flex-col gap-[5px]">
                                <label
                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">Nombre</label>
                                <input v-model="fN.NombreCliente" type="text"
                                    class="pqrs-input opacity-50 !bg-white/50 !border-[#0D291C]/30 cursor-not-allowed"
                                    readonly />
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <label
                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">Teléfono
                                    *</label>
                                <input v-model="fN.Telefono" type="text" class="pqrs-input" placeholder="3001234567"
                                    maxlength="10" @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" />
                            </div>
                            <div class="flex flex-col gap-[5px] col-span-2 max-[480px]:col-span-1">
                                <label
                                    class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60 pl-[2px]">Correo
                                    electrónico *</label>
                                <input v-model="fN.Email" type="email" class="pqrs-input"
                                    placeholder="correo@ejemplo.com" maxlength="250" />
                            </div>
                        </div>

                        <!-- Error -->
                        <div v-if="errNuevo"
                            class="flex items-center gap-2 px-[13px] py-[10px] bg-red-50 border border-red-200 rounded-[12px] text-[0.76rem] font-bold text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24" class="flex-shrink-0">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            {{ errNuevo }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="flex gap-[10px] px-6 pt-[14px] pb-5 flex-shrink-0 border-t-2 border-[#0D291C]/14">
                        <button @click="modalNuevo = false" class="pqrs-btn-cancel">Cancelar</button>
                        <button @click="crearPqrs" :disabled="guardando" class="pqrs-btn-confirm">
                            <span v-if="guardando"
                                class="w-[14px] h-[14px] border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin flex-shrink-0" />
                            {{ guardando ? 'Enviando...' : 'Enviar PQRS' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ───── MODAL: DETALLE PQRS ───── -->
        <Transition name="pqrs-modal">
            <div v-if="modalDetalle"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0D291C]/60 backdrop-blur-[6px]">
                <div
                    class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden pqrs-card-shadow">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-[#f8fafb] border-b-2 border-[#e2e8f0]">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#0D291C] border border-[#e8f5e9] text-[#7FD344] font-black text-[0.72rem]">
                                #{{ pqrsAccion?.Id }}
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-[#0D291C] leading-none">
                                    {{ pqrsAccion?.Motivo?.Nombre ?? pqrsAccion?.Motivo ?? 'PQRS' }}
                                </p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-gray-400">
                                    {{ formatFecha(pqrsAccion?.FechaCreacion) }}</p>
                            </div>
                        </div>
                        <button @click="modalDetalle = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[0.85rem] font-black cursor-pointer flex-shrink-0 bg-[#f1f5f9] border border-[#cbd5e1] text-[#64748b] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div
                        class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-[14px] bg-white [scrollbar-width:thin] [scrollbar-color:#c8e6c9_transparent]">
                        <template v-if="detalleActivo">
                            <!-- Estado + Tipo -->
                            <div
                                class="flex items-center justify-between px-4 py-3 bg-[#f0faf4] border-2 border-[#e8f5e9] rounded-2xl">
                                <span
                                    class="text-[0.65rem] font-black uppercase tracking-[0.08em] text-gray-400">Estado</span>
                                <span class="text-[0.85rem] font-extrabold" :class="{
                                    'text-[#299261]': detalleActivo.Estado === 'CERRADO',
                                    'text-amber-500': detalleActivo.Estado === 'EN_PROCESO' || detalleActivo.Estado === 'ABIERTO',
                                }">● {{ estadoLabel(detalleActivo.Estado) }}</span>
                            </div>

                            <!-- Info general -->
                            <div class="flex flex-col gap-2">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                    Información
                                </p>
                                <div class="grid grid-cols-2 gap-2">
                                    <div
                                        class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <span
                                            class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Tipo</span>
                                        <span class="text-[0.8rem] font-bold text-[#0D291C]">{{ detalleActivo.Tipo
                                            }}</span>
                                    </div>
                                    <div
                                        class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <span
                                            class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Motivo</span>
                                        <span class="text-[0.8rem] font-bold text-[#0D291C]">{{
                                            detalleActivo.Motivo?.Nombre ?? '—' }}</span>
                                    </div>
                                    <div
                                        class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <span
                                            class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Prioridad</span>
                                        <span class="text-[0.8rem] font-bold text-[#0D291C]">{{ detalleActivo.Prioridad
                                            ?? '—' }}</span>
                                    </div>
                                    <div
                                        class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <span
                                            class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Fecha</span>
                                        <span class="text-[0.8rem] font-bold text-[#0D291C]">{{
                                            formatFecha(detalleActivo.FechaCreacion) }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Asunto -->
                            <div class="flex flex-col gap-2">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                    Asunto
                                </p>
                                <p class="text-[0.88rem] text-gray-700 leading-relaxed font-semibold px-[2px]">
                                    {{ detalleActivo.Asunto ?? '—' }}
                                </p>
                            </div>

                            <!-- Descripción -->
                            <div class="flex flex-col gap-2">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                    Tu solicitud
                                </p>
                                <p
                                    class="text-[0.88rem] text-gray-700 leading-relaxed font-medium whitespace-pre-wrap px-[2px]">
                                    {{ detalleActivo.Descripcion ?? '—' }}
                                </p>
                            </div>

                            <!-- Imagen adjunta -->
                            <div v-if="detalleActivo.Imagen" class="flex flex-col gap-2">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                    Imagen adjunta
                                </p>
                                <div v-if="loadingImagen"
                                    class="flex items-center justify-center gap-2 py-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                    <div
                                        class="w-5 h-5 border-2 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-[0.72rem] font-semibold text-gray-400">Cargando imagen...</span>
                                </div>
                                <div v-else-if="imagenDetalle"
                                    class="rounded-2xl overflow-hidden border-2 border-[#c8e6c9]">
                                    <img :src="`data:${imagenDetalle.contentType};base64,${imagenDetalle.data}`"
                                        alt="Imagen adjunta" class="w-full max-h-[220px] object-cover" />
                                    <div
                                        class="px-3 py-1.5 bg-[#f0faf4] border-t border-[#c8e6c9] flex items-center justify-between">
                                        <span class="text-[0.65rem] font-semibold text-gray-400">
                                            {{ imagenDetalle.contentType }} · {{ (imagenDetalle.contentLength /
                                                1024).toFixed(0) }}KB
                                        </span>
                                        <a :href="`data:${imagenDetalle.contentType};base64,${imagenDetalle.data}`"
                                            :download="`pqrs-${detalleActivo.Id}.${imagenDetalle.contentType.split('/')[1]}`"
                                            class="text-[0.65rem] font-black text-[#299261] hover:underline cursor-pointer">
                                            Descargar
                                        </a>
                                    </div>
                                </div>
                                <div v-else
                                    class="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-[0.78rem] font-semibold text-gray-400">
                                    No se pudo cargar la imagen.
                                </div>
                            </div>

                            <!-- Respuesta -->
                            <div class="flex flex-col gap-2">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                    Respuesta
                                </p>
                                <div v-if="detalleActivo.Respuesta"
                                    class="px-4 py-3 bg-[#f0faf4] border-2 border-[#c8e6c9] rounded-2xl text-[0.88rem] text-[#0D291C] leading-relaxed font-medium whitespace-pre-wrap">
                                    {{ detalleActivo.Respuesta }}
                                </div>
                                <div v-else
                                    class="flex items-center gap-2 px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-[0.8rem] font-semibold text-amber-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#f59e0b"
                                        viewBox="0 0 24 24" class="flex-shrink-0">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <span>Aún no hay respuesta para esta solicitud.</span>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Foot -->
                    <div class="flex gap-[10px] px-6 pt-[14px] pb-5 flex-shrink-0 border-t-2 border-[#e8f5e9]">
                        <button @click="modalDetalle = false" class="pqrs-btn-confirm flex-1">Cerrar</button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import PqrsService from '@/api/services/pqrs.service'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import { useAuthStore } from '@/stores/auth'

const pqrsList = ref([])
const motivos = ref([])
const loading = ref(true)
const loadingMotivos = ref(false)
const loadingDetalle = ref(false)
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)
const authStore = useAuthStore()

const modalNuevo = ref(false)
const modalDetalle = ref(false)
const pqrsAccion = ref(null)
const detalleActivo = ref(null)
const guardando = ref(false)
const errNuevo = ref('')

// ── Imagen ────────────────────────────────────────────────────
const previewUrl = ref('')
const selectedFile = ref(null)
const errImagen = ref('')
const imagenDetalle = ref(null)
const loadingImagen = ref(false)

const cargarImagenPqrs = async (id) => {
    imagenDetalle.value = null
    loadingImagen.value = true
    try {
        const res = await PqrsService.getImagenesPqrs(id)
        imagenDetalle.value = res?.data ?? null
        console.log('[Imagen]', imagenDetalle.value)
    } catch (e) {
        console.warn('[Imagen PQRS]', e)
    } finally {
        loadingImagen.value = false
    }
}

function handleFileChange(event) {
    const file = event.target.files?.[0]

    // ── LOG 5: ¿llega el evento con archivo? ──
    console.log('[FileChange] event.target.files:', event.target.files)
    console.log('[FileChange] file recibido:', file)

    if (!file) {
        console.warn('[FileChange] No se recibió archivo')
        return
    }

    const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
    const MAX_MB = 5

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
        errImagen.value = 'Solo se permiten imágenes JPG, PNG o WEBP.'
        console.warn('[FileChange] Tipo no permitido:', file.type)
        return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
        errImagen.value = `La imagen no puede superar ${MAX_MB}MB.`
        console.warn('[FileChange] Archivo muy grande:', file.size)
        return
    }

    errImagen.value = ''
    selectedFile.value = file

    // ── LOG 6: confirmar que se guardó en el ref ──
    console.log('[FileChange] selectedFile.value asignado:', selectedFile.value?.name)

    const reader = new FileReader()
    reader.onload = () => {
        previewUrl.value = reader.result
        console.log('[FileChange] previewUrl generado, longitud:', reader.result?.length)
    }
    reader.readAsDataURL(file)
}

function quitarImagen() {
    selectedFile.value = null
    previewUrl.value = ''
    errImagen.value = ''
}
// ─────────────────────────────────────────────────────────────

const fN = reactive({
    IdMotivo: '', Tipo: '', Asunto: '', Descripcion: '',
    NombreCliente: '', Telefono: '', Email: '', IdPersonaAutorizada: null,
})

const listaPqrs = computed(() =>
    Array.isArray(pqrsList.value) ? pqrsList.value : (pqrsList.value?.data ?? [])
)

const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}


const estadoLabel = (estado) => {
    const map = {
        ABIERTO: 'Abierto',
        EN_PROCESO: 'En proceso',
        CERRADO: 'Cerrado'
    }
    return map[estado] ?? estado ?? '—'
}

const cargarPqrs = async () => {
    loading.value = true
    try {
        const res = await PqrsService.getMisPqrs({ page: paginaActual.value, limit: limit.value })
        if (res?.error || res?.status >= 400) { pqrsList.value = []; return }
        const datos = Array.isArray(res) ? res : (res?.data ?? [])
        pqrsList.value = datos
        totalRegistros.value = res?.total ?? res?.count ?? datos.length
        totalPaginas.value = res?.totalPages ?? res?.pages ?? Math.max(1, Math.ceil(totalRegistros.value / limit.value))

        console.log('[PQRS]', { datos, total: totalRegistros.value, paginas: totalPaginas.value })

    } catch (e) {
        pqrsList.value = []
    } finally {
        loading.value = false
    }
}

const cargarMotivos = async () => {
    loadingMotivos.value = true
    try { motivos.value = await PqrsService.getMotivos() }
    catch (e) { console.error('[Motivos]', e) }
    finally { loadingMotivos.value = false }
}

onMounted(cargarPqrs)

const irPagina = (p) => { if (p < 1 || p > totalPaginas.value) return; paginaActual.value = p; cargarPqrs() }
const onLimitChange = (val) => { limit.value = val; paginaActual.value = 1; cargarPqrs() }

const abrirNuevaPqrs = async () => {
    errNuevo.value = ''
    quitarImagen()  // ← limpia imagen al abrir
    const u = authStore.user
    Object.assign(fN, {
        IdMotivo: '', Tipo: '', Asunto: '', Descripcion: '',
        NombreCliente: `${u?.Nombres ?? u?.nombres ?? ''} ${u?.Apellidos ?? u?.apellidos ?? ''}`.trim(),
        Telefono: String(u?.Telefono ?? u?.telefono ?? ''),
        Email: String(u?.Email ?? u?.email ?? ''),
        IdPersonaAutorizada: null,
    })
    modalNuevo.value = true
    if (!motivos.value.length) await cargarMotivos()
}


const crearPqrs = async () => {
    errNuevo.value = ''
    if (!fN.IdMotivo) { errNuevo.value = 'Selecciona un motivo.'; return }
    if (!fN.Tipo) { errNuevo.value = 'Selecciona el tipo de PQRS.'; return }
    if (!fN.Asunto.trim()) { errNuevo.value = 'Escribe un asunto.'; return }
    if (!fN.Descripcion.trim()) { errNuevo.value = 'Escribe una descripción.'; return }
    if (!fN.Telefono.trim()) { errNuevo.value = 'El teléfono es requerido.'; return }
    if (!fN.Email.trim()) { errNuevo.value = 'El correo es requerido.'; return }

    guardando.value = true
    try {
        const payload = new FormData()
        payload.append('IdMotivo', String(Number(fN.IdMotivo)))
        payload.append('Tipo', fN.Tipo)
        payload.append('Asunto', fN.Asunto.trim())
        payload.append('Descripcion', fN.Descripcion.trim())
        payload.append('NombreCliente', fN.NombreCliente.trim())
        payload.append('Telefono', fN.Telefono.trim())
        payload.append('Email', fN.Email.trim())
        if (fN.IdPersonaAutorizada)
            payload.append('IdPersonaAutorizada', String(Number(fN.IdPersonaAutorizada)))
        if (selectedFile.value)
            payload.append('Imagen', selectedFile.value)


        // ── LOG 2: ¿qué tiene el FormData? ──
        for (const [key, value] of payload.entries()) {
            console.log(`[PQRS FormData] ${key}:`, value)
        }

        const res = await PqrsService.create(payload)

        // ── LOG 3: ¿qué respondió el servidor? ──
        console.log('[PQRS] respuesta servidor:', res)

        modalNuevo.value = false
        quitarImagen()
        paginaActual.value = 1
        await cargarPqrs()
    } catch (e) {
        // ── LOG 4: error completo ──
        console.error('[PQRS] error completo:', e)
        console.error('[PQRS] error response:', e.response?.data)
        console.error('[PQRS] error status:', e.response?.status)
        const msg = e.response?.data?.message
        errNuevo.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al enviar la PQRS.')
    } finally {
        guardando.value = false
    }
}

const abrirDetalle = async (pqrs) => {
    pqrsAccion.value = pqrs
    detalleActivo.value = pqrs
    imagenDetalle.value = null
    modalDetalle.value = true
    loadingDetalle.value = true
    try {
        const res = await PqrsService.getById(pqrs.Id)
        detalleActivo.value = res?.data ?? res

        // ← carga imagen si existe
        if (detalleActivo.value?.Imagen) {
            await cargarImagenPqrs(pqrs.Id)
        }
    } catch (e) {
        console.error('[Detalle PQRS]', e)
    } finally {
        loadingDetalle.value = false
    }
}
</script>

<style scoped>
.pqrs-card-shadow {
    box-shadow: 0 7px 0 #0D291C;
}

.pqrs-input {
    background-color: white !important;
    border: 2px solid #0D291C !important;
    border-radius: 13px !important;
    padding: 9px 13px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.pqrs-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.18) !important;
}

.pqrs-btn-cancel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    font-family: inherit;
    background: rgba(13, 41, 28, 0.12);
    color: #0D291C;
    border: 2.5px solid rgba(13, 41, 28, 0.25);
    box-shadow: 0 4px 0 rgba(13, 41, 28, 0.2);
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
}

.pqrs-btn-cancel:hover {
    background: rgba(13, 41, 28, 0.2);
}

.pqrs-btn-cancel:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 rgba(13, 41, 28, 0.2);
}

.pqrs-btn-confirm {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    font-family: inherit;
    background: #0D291C;
    color: #7FD344;
    border: 2.5px solid #0D291C;
    box-shadow: 0 4px 0 #050e09;
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
}

.pqrs-btn-confirm:hover:not(:disabled) {
    background: #1a4a2e;
}

.pqrs-btn-confirm:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #050e09;
}

.pqrs-btn-confirm:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Animaciones del modal */
.pqrs-modal-enter-active {
    transition: opacity 0.2s ease;
}

.pqrs-modal-leave-active {
    transition: opacity 0.15s ease;
}

.pqrs-modal-enter-from,
.pqrs-modal-leave-to {
    opacity: 0;
}

.pqrs-modal-enter-active .pqrs-card-shadow {
    animation: pqrs-pop-in 0.28s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

.pqrs-modal-leave-active .pqrs-card-shadow {
    animation: pqrs-pop-out 0.18s ease-in both;
}

@keyframes pqrs-pop-in {
    from {
        transform: scale(0.88) translateY(20px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@keyframes pqrs-pop-out {
    from {
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    to {
        transform: scale(0.93) translateY(10px);
        opacity: 0;
    }
}

/* Mobile: modal desde abajo */
@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }

    .fixed.inset-0 {
        align-items: flex-end;
        padding: 12px;
    }

    .pqrs-card-shadow {
        border-radius: 22px 22px 0 0;
        max-height: 95vh;
        box-shadow: 0 -4px 0 #0D291C;
    }
}
</style>