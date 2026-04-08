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
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">PQRS</h2>
            <button @click="abrirMotivos"
                class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="assignment" :size="14" />
                <span class="hidden sm:inline">Motivos</span>
            </button>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[200px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Buscar</label>
                <input v-model="busqueda" type="text" placeholder="Nombre, asunto..." class="search-input w-full" />
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[130px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Tipo</label>
                <select v-model="filtroTipo" @change="() => { paginaActual = 1; cargarPqrs() }">
                    <option value="">Todos</option>
                    <option value="PETICION">Petición</option>
                    <option value="QUEJA">Queja</option>
                    <option value="RECLAMO">Reclamo</option>
                    <option value="SUGERENCIA">Sugerencia</option>
                </select>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[130px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Estado</label>
                <select v-model="filtroEstado" @change="() => { paginaActual = 1; cargarPqrs() }">
                    <option value="">Todos</option>
                    <option value="ABIERTO">Abierto</option>
                    <option value="EN_PROCESO">En proceso</option>
                    <option value="CERRADO">Cerrado</option>
                </select>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[130px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Prioridad</label>
                <select v-model="filtroPrioridad" @change="() => { paginaActual = 1; cargarPqrs() }">
                    <option value="">Todas</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                </select>
            </div>
            <button v-if="busqueda || filtroTipo || filtroEstado || filtroPrioridad" @click="limpiarFiltros"
                class="self-end px-[18px] py-[10px] text-[0.8rem] font-bold text-gray-500 bg-gray-50 border-[1.5px] border-gray-200 rounded-full cursor-pointer transition-colors whitespace-nowrap hover:border-[#299261] hover:text-[#299261] max-[600px]:w-full max-[600px]:text-center">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="border-collapse min-w-[800px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell">#</th>
                            <th class="th-cell">Cliente</th>
                            <th class="th-cell">Tipo / Motivo</th>
                            <th class="th-cell">Asunto</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell">Prioridad</th>
                            <th class="th-cell">Fecha</th>
                            <th class="th-cell text-center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="8" class="text-center py-20">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando PQRS...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="listaPqrs.length === 0">
                            <td colspan="8" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron PQRS</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="pqrs in listaPqrs" :key="pqrs.Id"
                            class="border-b border-[#e8f5e9] last:border-b-0 transition-colors duration-150 hover:bg-[#f0faf4] group">
                            <td class="td-cell font-mono text-[0.8rem] text-gray-400">#{{ pqrs.Id }}</td>
                            <td class="td-cell">
                                <div class="flex flex-col">
                                    <span class="font-semibold text-[#0D291C] text-[0.85rem]">{{ pqrs.NombreCliente
                                        }}</span>
                                    <span class="text-[0.72rem] text-gray-400">{{ pqrs.Email }}</span>
                                </div>
                            </td>
                            <td class="td-cell">
                                <div class="flex flex-col gap-1 items-center">
                                    <span
                                        class="inline-block px-[10px] py-[2px] rounded-full text-[0.68rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9] w-fit">
                                        {{ tipoLabel(pqrs.Tipo) }}
                                    </span>
                                    <span class="text-[0.72rem] text-gray-400">{{ pqrs.Motivo?.Nombre ?? '—' }}</span>
                                </div>
                            </td>
                            <td class="td-cell max-w-[180px]">
                                <span class="block truncate text-[0.82rem] text-gray-600">{{ pqrs.Asunto ?? '—'
                                    }}</span>
                            </td>
                            <td class="td-cell">
                                <span class="inline-flex items-center gap-1 text-[0.8rem] font-extrabold" :class="{
                                    'text-[#299261]': pqrs.Estado === 'CERRADO',
                                    'text-amber-500': pqrs.Estado === 'EN_PROCESO',
                                    'text-blue-500': pqrs.Estado === 'ABIERTO',
                                }">● {{ estadoLabel(pqrs.Estado) }}</span>
                            </td>
                            <td class="td-cell">
                                <span
                                    class="inline-block px-[10px] py-[2px] rounded-full text-[0.68rem] font-bold border"
                                    :class="{
                                        'bg-red-50 text-red-600 border-red-200': pqrs.Prioridad === 'ALTA',
                                        'bg-amber-50 text-amber-600 border-amber-200': pqrs.Prioridad === 'MEDIA',
                                        'bg-gray-50 text-gray-500 border-gray-200': pqrs.Prioridad === 'BAJA',
                                    }">{{ pqrs.Prioridad ?? '—' }}</span>
                            </td>
                            <td class="td-cell text-[0.82rem] text-gray-500 whitespace-nowrap">{{
                                formatFecha(pqrs.FechaCreacion) }}</td>
                            <td class="td-cell text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <button @click="abrirDetalle(pqrs)" title="Ver y responder"
                                        class="w-8 h-8 rounded-[10px] flex items-center justify-center cursor-pointer bg-transparent  hover:bg-[#e8f5e9] hover:text-[#299261] transition-all border-0">
                                        <AppIcon name="visibility" :size="30" />
                                    </button>
                                    <button @click="abrirCambioEstado(pqrs)" title="Cambiar estado"
                                        class="w-8 h-8 rounded-[10px] flex items-center justify-center cursor-pointer bg-transparent  hover:bg-blue-50 hover:text-blue-500 transition-all border-0">
                                        <AppIcon name="gpp_maybe" :size="30" />
                                    </button>
                                    <button @click="abrirCambioPrioridad(pqrs)" title="Cambiar prioridad"
                                        class="w-8 h-8 rounded-[10px] flex items-center justify-center cursor-pointer bg-transparent  hover:bg-amber-50 hover:text-amber-500 transition-all border-0">
                                        <AppIcon name="arrow_shape_up_stack" :size="30" />
                                    </button>
                                    <button @click="abrirAsignar(pqrs)" title="Asignar"
                                        class="w-8 h-8 rounded-[10px] flex items-center justify-center cursor-pointer bg-transparent  hover:bg-purple-50 hover:text-purple-500 transition-all border-0">
                                        <AppIcon name="manage_accounts" :size="30" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ───── MODAL: DETALLE + RESPONDER ───── -->
        <Transition name="modal">
            <div v-if="modalDetalle"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalDetalle = false">
                <div class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[520px] max-h-[90vh] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344] font-black text-[0.72rem]">
                                #{{ pqrsAccion?.Id }}
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">
                                    {{ pqrsAccion?.Motivo?.Nombre ?? 'PQRS' }}
                                </p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    {{ pqrsAccion?.NombreCliente }} · {{ formatFecha(pqrsAccion?.FechaCreacion) }}
                                </p>
                            </div>
                        </div>
                        <button @click="modalDetalle = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div
                        class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 [scrollbar-width:thin] [scrollbar-color:#c8e6c9_transparent]">

                        <!-- Info pills -->
                        <div class="grid grid-cols-3 gap-2">
                            <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                <span
                                    class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Tipo</span>
                                <span class="text-[0.8rem] font-bold text-[#0D291C]">{{ tipoLabel(pqrsAccion?.Tipo)
                                    }}</span>
                            </div>
                            <div class="flex flex-col gap-[3px] px-3 py-2 rounded-xl border" :class="{
                                'bg-red-50 border-red-100': pqrsAccion?.Prioridad === 'ALTA',
                                'bg-amber-50 border-amber-100': pqrsAccion?.Prioridad === 'MEDIA',
                                'bg-gray-50 border-gray-100': pqrsAccion?.Prioridad === 'BAJA',
                            }">
                                <span
                                    class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Prioridad</span>
                                <span class="text-[0.8rem] font-bold" :class="{
                                    'text-red-600': pqrsAccion?.Prioridad === 'ALTA',
                                    'text-amber-600': pqrsAccion?.Prioridad === 'MEDIA',
                                    'text-gray-500': pqrsAccion?.Prioridad === 'BAJA',
                                }">{{ pqrsAccion?.Prioridad ?? '—' }}</span>
                            </div>
                            <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                <span
                                    class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Estado</span>
                                <span class="text-[0.8rem] font-bold" :class="{
                                    'text-[#299261]': pqrsAccion?.Estado === 'CERRADO',
                                    'text-amber-500': pqrsAccion?.Estado === 'EN_PROCESO',
                                    'text-blue-500': pqrsAccion?.Estado === 'ABIERTO',
                                }">{{ estadoLabel(pqrsAccion?.Estado) }}</span>
                            </div>
                        </div>

                        <!-- Asunto -->
                        <div class="flex flex-col gap-2">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                Asunto</p>
                            <p class="text-[0.88rem] font-semibold text-[#0D291C]">{{ pqrsAccion?.Asunto ?? '—' }}</p>
                        </div>

                        <!-- Descripción -->
                        <div class="flex flex-col gap-2">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                Descripción del cliente</p>
                            <p class="text-[0.88rem] text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{{
                                pqrsAccion?.Descripcion ?? '—' }}</p>
                        </div>

                        <!-- Imagen adjunta -->
                        <div v-if="detalleActivo.Imagen" class="flex flex-col gap-2">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                Imagen adjunta
                            </p>
                            <!-- Loading imagen -->
                            <div v-if="loadingImagen"
                                class="flex items-center justify-center gap-2 py-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                <div
                                    class="w-5 h-5 border-2 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                <span class="text-[0.72rem] font-semibold text-gray-400">Cargando imagen...</span>
                            </div>
                            <!-- Imagen cargada -->
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
                            <!-- Error cargando -->
                            <div v-else
                                class="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-[0.78rem] font-semibold text-gray-400">
                                No se pudo cargar la imagen.
                            </div>
                        </div>

                        <!-- Respuesta existente -->
                        <div v-if="pqrsAccion?.Respuesta" class="flex flex-col gap-2">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                Respuesta enviada</p>
                            <div
                                class="px-4 py-3 bg-[#f0faf4] border-2 border-[#c8e6c9] rounded-2xl text-[0.88rem] text-[#0D291C] font-medium leading-relaxed whitespace-pre-wrap">
                                {{ pqrsAccion.Respuesta }}
                            </div>
                        </div>

                        <!-- Formulario responder -->
                        <div class="flex flex-col gap-3 mt-1">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                {{ pqrsAccion?.Respuesta ? 'Actualizar respuesta' : 'Responder' }}
                            </p>
                            <div class="flex flex-col gap-[5px]">
                                <div class="flex items-center justify-between">
                                    <label class="field-label">Respuesta *</label>
                                    <span class="text-[0.58rem] font-semibold text-[#0D291C] opacity-35">{{
                                        fR.Respuesta.length }}/250</span>
                                </div>
                                <textarea v-model="fR.Respuesta" class="field-input resize-y min-h-[100px]"
                                    placeholder="Escribe la respuesta para el cliente..." maxlength="250" />
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Estado al responder</label>
                                <select v-model="fR.Estado" class="field-input">
                                    <option value="ABIERTO">Abierto</option>
                                    <option value="EN_PROCESO">En proceso</option>
                                    <option value="CERRADO">Cerrado</option>
                                </select>
                            </div>
                            <div v-if="errResponder"
                                class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                                ⚠ {{ errResponder }}
                            </div>
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                        <button @click="modalDetalle = false"
                            class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button @click="responderPqrs" :disabled="guardandoR" class="btn-modal-dark">
                            <span v-if="guardandoR"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                            {{ guardandoR ? 'Enviando...' : 'Enviar respuesta' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ───── MODAL: CAMBIO DE ESTADO ───── -->
        <Transition name="modal">
            <div v-if="modalEstado"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalEstado = false">
                <div class="bg-[#B8E19E] border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[380px] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344]">
                                <AppIcon name="gpp_maybe" :size="20" />
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">Cambiar
                                    estado</p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    #{{ pqrsAccion?.Id }} · {{ pqrsAccion?.NombreCliente }}
                                </p>
                            </div>
                        </div>
                        <button @click="modalEstado = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>
                    <div class="px-6 py-5 flex flex-col gap-3">
                        <div class="flex flex-col gap-2">
                            <button v-for="est in ['ABIERTO', 'EN_PROCESO', 'CERRADO']" :key="est"
                                @click="fEstado = est"
                                class="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all"
                                :class="fEstado === est
                                    ? 'bg-[#0D291C] text-[#7FD344] border-[#0D291C] shadow-[0_3px_0_#050e09]'
                                    : 'bg-white text-[#0D291C] border-[#0D291C]/15 hover:border-[#0D291C]/40 hover:bg-[#f0faf4]'">
                                <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                                    :class="fEstado === est ? 'bg-[#7FD344]/20' : 'bg-gray-100'">
                                    <AppIcon name="gpp_maybe" :size="16"
                                        :class="fEstado === est ? 'text-[#7FD344]' : 'text-gray-400'" />
                                </div>
                                <div class="flex flex-col items-start gap-[2px]">
                                    <span class="text-[0.85rem] font-black">{{ estadoLabel(est) }}</span>
                                    <span class="text-[0.62rem] font-semibold opacity-50">
                                        {{ {
                                            ABIERTO: 'Sin gestión aún', EN_PROCESO: 'En seguimiento', CERRADO:
                                                'Resuelto y cerrado'
                                        }[est] }}
                                    </span>
                                </div>
                                <span v-if="pqrsAccion?.Estado === est"
                                    class="ml-auto text-[0.6rem] font-black uppercase tracking-wide px-2 py-[2px] rounded-full"
                                    :class="fEstado === est ? 'bg-[#7FD344]/20 text-[#7FD344]' : 'bg-gray-100 text-gray-400'">
                                    actual
                                </span>
                            </button>
                        </div>

                        <div v-if="errEstado"
                            class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                            ⚠ {{ errEstado }}
                        </div>
                    </div>
                    <!-- Foot -->
                    <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                        <button @click="modalEstado = false"
                            class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button @click="cambiarEstado" :disabled="guardandoEstado || fEstado === pqrsAccion?.Estado"
                            class="btn-modal-dark">
                            <span v-if="guardandoEstado"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                            {{ guardandoEstado ? 'Guardando...' : 'Confirmar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ───── MODAL: GESTIÓN DE MOTIVOS ───── -->
        <Transition name="modal">
            <div v-if="modalMotivos"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalMotivos = false">
                <div class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344]">
                                <AppIcon name="assignment" :size="18" />
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">Motivos
                                    PQRS</p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    Gestiona los motivos disponibles</p>
                            </div>
                        </div>
                        <button @click="modalMotivos = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div
                        class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 [scrollbar-width:thin] [scrollbar-color:#c8e6c9_transparent]">

                        <!-- Formulario crear/editar -->
                        <div class="flex flex-col gap-3 p-4 rounded-2xl border-2 border-[#e8f5e9] bg-[#f0faf4]">
                            <p class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60">
                                {{ motivoEditando ? 'Editar motivo' : 'Nuevo motivo' }}
                            </p>
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Nombre *</label>
                                <input v-model="fMotivo.Nombre" type="text" class="field-input"
                                    placeholder="Ej: Problema de acceso" maxlength="70" />
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Descripción</label>
                                <input v-model="fMotivo.Descripcion" type="text" class="field-input"
                                    placeholder="Descripción opcional..." maxlength="200" />
                            </div>
                            <div class="flex items-center gap-2">
                                <label
                                    class="flex items-center gap-2 cursor-pointer text-[0.8rem] font-bold text-[#0D291C]">
                                    <input type="checkbox" v-model="fMotivo.Estado" class="check" />
                                    <span>Activo</span>
                                </label>
                            </div>
                            <div v-if="errMotivo" class="text-[0.76rem] font-bold text-red-700">⚠ {{ errMotivo }}</div>
                            <div class="flex gap-2">
                                <button v-if="motivoEditando" @click="cancelarEditarMotivo"
                                    class="btn-modal-dark btn-modal-dark--cancel flex-none px-4">
                                    Cancelar
                                </button>
                                <button @click="guardarMotivo" :disabled="guardandoMotivo" class="btn-modal-dark">
                                    <span v-if="guardandoMotivo"
                                        class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                                    {{ guardandoMotivo ? 'Guardando...' : motivoEditando ?
                                        'Guardar cambios' : 'Crear motivo' }} </button>
                            </div>
                        </div>

                        <!-- Lista de motivos -->
                        <div class="flex flex-col gap-2">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-[#e8f5e9] pb-[5px]">
                                Motivos registrados
                            </p>
                            <div v-if="loadingMotivos" class="flex items-center justify-center gap-2 py-6">
                                <div
                                    class="w-5 h-5 border-2 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                <span class="text-[0.72rem] font-semibold text-gray-400">Cargando...</span>
                            </div>
                            <div v-else-if="motivos.length === 0"
                                class="text-center py-6 text-[0.8rem] text-gray-400 font-semibold">
                                No hay motivos registrados.
                            </div>
                            <div v-else v-for="m in motivos" :key="m.IdMotivo"
                                class="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
                                :class="m.Estado ? 'border-[#e8f5e9] bg-white' : 'border-gray-100 bg-gray-50 opacity-60'">
                                <div class="flex flex-col gap-[2px] min-w-0">
                                    <span class="text-[0.85rem] font-bold text-[#0D291C] truncate">{{ m.Nombre }}</span>
                                    <span v-if="m.Descripcion" class="text-[0.7rem] text-gray-400 truncate">{{
                                        m.Descripcion }}</span>
                                </div>
                                <div class="flex items-center gap-2 flex-shrink-0">
                                    <span class="text-[0.65rem] font-black px-2 py-[2px] rounded-full border"
                                        :class="m.Estado ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'">
                                        {{ m.Estado ? 'Activo' : 'Inactivo' }}
                                    </span>
                                    <button @click="editarMotivo(m)"
                                        class="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-transparent text-gray-400 hover:bg-[#e8f5e9] hover:text-[#299261] transition-all border-0">
                                        <AppIcon name="edit_square" :size="16" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex-shrink-0">
                        <button @click="modalMotivos = false" class="btn-modal-dark btn-modal-dark--cancel w-full">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ───── MODAL: CAMBIO DE PRIORIDAD ───── -->
        <Transition name="modal">
            <div v-if="modalPrioridad"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalPrioridad = false">
                <div class="bg-[#B8E19E] border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[380px] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344]">
                                <AppIcon name="arrow_shape_up_stack" :size="20" />
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">Cambiar
                                    prioridad</p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    #{{ pqrsAccion?.Id }} · {{ pqrsAccion?.NombreCliente }}
                                </p>
                            </div>
                        </div>
                        <button @click="modalPrioridad = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>
                    <div class="px-6 py-5 flex flex-col gap-3">
                        <div class="flex flex-col gap-2">
                            <button v-for="pri in ['ALTA', 'MEDIA', 'BAJA']" :key="pri" @click="fPrioridad = pri"
                                class="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all"
                                :class="fPrioridad === pri
                                    ? {
                                        'bg-red-600 text-white border-red-700 shadow-[0_3px_0_#991b1b]': pri === 'ALTA',
                                        'bg-amber-500 text-white border-amber-600 shadow-[0_3px_0_#b45309]': pri === 'MEDIA',
                                        'bg-[#0D291C] text-[#7FD344] border-[#0D291C] shadow-[0_3px_0_#050e09]': pri === 'BAJA',
                                    }
                                    : 'bg-white text-[#0D291C] border-[#0D291C]/15 hover:border-[#0D291C]/40 hover:bg-[#f0faf4]'">
                                <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                                    :class="fPrioridad === pri
                                        ? 'bg-white/20'
                                        : {
                                            'bg-red-50': pri === 'ALTA',
                                            'bg-amber-50': pri === 'MEDIA',
                                            'bg-gray-100': pri === 'BAJA',
                                        }">
                                    <AppIcon name="arrow_shape_up_stack" :size="16" :class="fPrioridad === pri
                                        ? 'text-white'
                                        : {
                                            'text-red-500': pri === 'ALTA',
                                            'text-amber-500': pri === 'MEDIA',
                                            'text-gray-400': pri === 'BAJA',
                                        }" />
                                </div>
                                <div class="flex flex-col items-start gap-[2px]">
                                    <span class="text-[0.85rem] font-black">{{ pri }}</span>
                                    <span class="text-[0.62rem] font-semibold opacity-60">
                                        {{ {
                                            ALTA: 'Atención inmediata', MEDIA: 'Seguimiento normal',
                                            BAJA: 'Sin urgencia'
                                        }[pri] }}
                                    </span>
                                </div>
                                <span v-if="pqrsAccion?.Prioridad === pri"
                                    class="ml-auto text-[0.6rem] font-black uppercase tracking-wide px-2 py-[2px] rounded-full"
                                    :class="fPrioridad === pri ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'">
                                    actual
                                </span>
                            </button>
                        </div>
                        <div v-if="errPrioridad"
                            class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                            ⚠ {{ errPrioridad }}
                        </div>
                    </div>
                    <!-- Foot -->
                    <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                        <button @click="modalPrioridad = false"
                            class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button @click="cambiarPrioridad"
                            :disabled="guardandoPrioridad || fPrioridad === pqrsAccion?.Prioridad"
                            class="btn-modal-dark">
                            <span v-if="guardandoPrioridad"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                            {{ guardandoPrioridad ? 'Guardando...' : 'Confirmar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ───── MODAL: ASIGNAR PQRS ───── -->
        <Transition name="modal">
            <div v-if="modalAsignar"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalAsignar = false">
                <div class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[440px] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344]">
                                <AppIcon name="manage_accounts" :size="20" />
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">Asignar
                                    PQRS</p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    #{{ pqrsAccion?.Id }} · {{ pqrsAccion?.NombreCliente }}
                                </p>
                            </div>
                        </div>
                        <button @click="modalAsignar = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="px-6 py-5 flex flex-col gap-4 [scrollbar-width:thin]">

                        <!-- Info PQRS -->
                        <div
                            class="flex items-center gap-3 px-4 py-3 bg-[#f0faf4] border-2 border-[#e8f5e9] rounded-2xl">
                            <div class="flex flex-col gap-[2px] min-w-0">
                                <span
                                    class="text-[0.7rem] font-black uppercase tracking-wide text-gray-400">Asunto</span>
                                <span class="text-[0.85rem] font-bold text-[#0D291C] truncate">{{ pqrsAccion?.Asunto ??
                                    '—' }}</span>
                            </div>
                            <span
                                class="ml-auto flex-shrink-0 inline-block px-2 py-[2px] rounded-full text-[0.65rem] font-bold border"
                                :class="{
                                    'bg-red-50 text-red-600 border-red-200': pqrsAccion?.Prioridad === 'ALTA',
                                    'bg-amber-50 text-amber-600 border-amber-200': pqrsAccion?.Prioridad === 'MEDIA',
                                    'bg-gray-50 text-gray-500 border-gray-200': pqrsAccion?.Prioridad === 'BAJA',
                                }">{{ pqrsAccion?.Prioridad }}</span>
                        </div>

                        <!-- Formulario -->
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Documento usuario admin *</label>
                                <input v-model="fAsignar.DocumentoUsuario" type="number" class="field-input"
                                    placeholder="Ej: 1098617878" />
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <label class="field-label">Departamento *</label>
                                <input v-model="fAsignar.Departamento" type="text" class="field-input"
                                    placeholder="Ej: Soporte Técnico" maxlength="50" />
                            </div>
                            <div class="flex flex-col gap-[5px]">
                                <div class="flex items-center justify-between">
                                    <label class="field-label">Observación</label>
                                    <span class="text-[0.58rem] font-semibold text-[#0D291C] opacity-35">{{
                                        fAsignar.Observacion.length }}/250</span>
                                </div>
                                <textarea v-model="fAsignar.Observacion" class="field-input resize-y min-h-[80px]"
                                    placeholder="Ej: Revisar con prioridad..." maxlength="250" />
                            </div>
                        </div>

                        <div v-if="errAsignar"
                            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                            ⚠ {{ errAsignar }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                        <button @click="modalAsignar = false"
                            class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button @click="asignarPqrs" :disabled="guardandoAsignar" class="btn-modal-dark">
                            <span v-if="guardandoAsignar"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                            {{ guardandoAsignar ? 'Asignando...' : 'Asignar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import PqrsService from '@/api/services/pqrs.service'
import TablePaginacion from '@/components/shared/Paginacion.vue'

// ── Estado ─────────────────────────────────────────────────────────
const pqrsList = ref([])
const loading = ref(true)
const busqueda = ref('')
const busquedaDebounced = ref('')
const filtroTipo = ref('')
const filtroEstado = ref('')
const filtroPrioridad = ref('')
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)

// ── Modales ────────────────────────────────────────────────────────
const modalDetalle = ref(false)
const modalEstado = ref(false)
const modalPrioridad = ref(false)
const pqrsAccion = ref(null)
const imagenDetalle = ref(null)
const loadingImagen = ref(false)
const detalleActivo = ref(null)
const loadingDetalle = ref(false)

// ── Formularios ────────────────────────────────────────────────────
const fR = reactive({ Respuesta: '', Estado: 'ABIERTO' })
const fEstado = ref('')
const fPrioridad = ref('')

// ── Loading / errores ──────────────────────────────────────────────
const guardandoR = ref(false)
const guardandoEstado = ref(false)
const guardandoPrioridad = ref(false)
const errResponder = ref('')
const errEstado = ref('')
const errPrioridad = ref('')


// ── Computed ───────────────────────────────────────────────────────
const listaPqrs = computed(() =>
    Array.isArray(pqrsList.value) ? pqrsList.value : (pqrsList.value?.data ?? [])
)

// ── Helpers ────────────────────────────────────────────────────────
const formatFecha = (f) => {
    if (!f) return '—'
    return new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const estadoLabel = (e) => ({ ABIERTO: 'Abierto', EN_PROCESO: 'En proceso', CERRADO: 'Cerrado' })[e] ?? e ?? '—'
const tipoLabel = (t) => ({ PETICION: 'Petición', QUEJA: 'Queja', RECLAMO: 'Reclamo', SUGERENCIA: 'Sugerencia' })[t] ?? t ?? '—'


const cargarImagenPqrs = async (id) => {
    imagenDetalle.value = null
    loadingImagen.value = true
    try {
        const res = await PqrsService.getImagenesPqrs(id)
        imagenDetalle.value = res?.data ?? null
    } catch (e) {
        console.warn('[Imagen PQRS]', e)
    } finally {
        loadingImagen.value = false
    }
}

// ── Carga ──────────────────────────────────────────────────────────
const cargarPqrs = async () => {
    loading.value = true
    try {
        const res = await PqrsService.getAllPqrs({
            page: paginaActual.value,
            limit: limit.value,
            ...(busquedaDebounced.value && { search: busquedaDebounced.value }),
            ...(filtroTipo.value && { tipo: filtroTipo.value }),
            ...(filtroEstado.value && { estado: filtroEstado.value }),
            ...(filtroPrioridad.value && { prioridad: filtroPrioridad.value }),
        })
        const datos = Array.isArray(res) ? res : (res?.data ?? [])
        pqrsList.value = datos
        totalRegistros.value = res?.total ?? res?.count ?? datos.length
        totalPaginas.value = res?.totalPages ?? res?.pages ?? Math.max(1, Math.ceil(totalRegistros.value / limit.value))
    } catch (e) {
        console.error('[PQRS Admin]', e.response?.data ?? e.message)
        pqrsList.value = []
    } finally {
        loading.value = false
    }
}

onMounted(cargarPqrs)

// ── Paginación ─────────────────────────────────────────────────────
const irPagina = (p) => { if (p < 1 || p > totalPaginas.value) return; paginaActual.value = p; cargarPqrs() }
const onLimitChange = (val) => { limit.value = val; paginaActual.value = 1; cargarPqrs() }

// ── Debounce búsqueda ──────────────────────────────────────────────
let debTimer = null
watch(busqueda, val => {
    clearTimeout(debTimer)
    debTimer = setTimeout(() => {
        busquedaDebounced.value = val
        paginaActual.value = 1
        cargarPqrs()
    }, 350)
})

// ── Limpiar filtros ────────────────────────────────────────────────
const limpiarFiltros = () => {
    busqueda.value = ''
    busquedaDebounced.value = ''
    filtroTipo.value = ''
    filtroEstado.value = ''
    filtroPrioridad.value = ''
    paginaActual.value = 1
    cargarPqrs()
}

// ── Detalle / Responder ────────────────────────────────────────────
const abrirDetalle = async (pqrs) => {
    pqrsAccion.value = pqrs
    detalleActivo.value = pqrs        // muestra datos inmediato
    fR.Respuesta = pqrs.Respuesta ?? ''
    fR.Estado = pqrs.Estado ?? 'ABIERTO'
    errResponder.value = ''
    imagenDetalle.value = null
    modalDetalle.value = true

    if (pqrs.Imagen) {
        await cargarImagenPqrs(pqrs.Id)
    }
}

const responderPqrs = async () => {
    errResponder.value = ''
    if (!fR.Respuesta.trim()) { errResponder.value = 'Escribe una respuesta.'; return }
    guardandoR.value = true
    try {
        await PqrsService.responsePqrs(pqrsAccion.value.Id, {
            Respuesta: fR.Respuesta.trim(),
            Estado: fR.Estado,
        })
        // actualizar local
        const idx = listaPqrs.value.findIndex(p => p.Id === pqrsAccion.value.Id)
        if (idx !== -1) {
            pqrsList.value[idx] = { ...pqrsList.value[idx], Respuesta: fR.Respuesta.trim(), Estado: fR.Estado }
            pqrsAccion.value = { ...pqrsAccion.value, Respuesta: fR.Respuesta.trim(), Estado: fR.Estado }
        }
        modalDetalle.value = false
    } catch (e) {
        const msg = e.response?.data?.message
        errResponder.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al enviar la respuesta.')
    } finally {
        guardandoR.value = false
    }
}

// ── Cambio de estado ───────────────────────────────────────────────
const abrirCambioEstado = (pqrs) => {
    pqrsAccion.value = pqrs
    fEstado.value = pqrs.Estado
    errEstado.value = ''
    modalEstado.value = true
}

const cambiarEstado = async () => {
    errEstado.value = ''
    guardandoEstado.value = true
    try {
        await PqrsService.changeStatusPqrs(pqrsAccion.value.Id, fEstado.value)
        const idx = pqrsList.value.findIndex(p => p.Id === pqrsAccion.value.Id)
        if (idx !== -1) pqrsList.value[idx] = { ...pqrsList.value[idx], Estado: fEstado.value }
        modalEstado.value = false
    } catch (e) {
        const msg = e.response?.data?.message
        errEstado.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al cambiar el estado.')
    } finally {
        guardandoEstado.value = false
    }
}

// ── Cambio de prioridad ────────────────────────────────────────────
const abrirCambioPrioridad = (pqrs) => {
    pqrsAccion.value = pqrs
    fPrioridad.value = pqrs.Prioridad
    errPrioridad.value = ''
    modalPrioridad.value = true
}

const cambiarPrioridad = async () => {
    errPrioridad.value = ''
    guardandoPrioridad.value = true
    try {
        await PqrsService.changePriorityPqrs(pqrsAccion.value.Id, fPrioridad.value)
        const idx = pqrsList.value.findIndex(p => p.Id === pqrsAccion.value.Id)
        if (idx !== -1) pqrsList.value[idx] = { ...pqrsList.value[idx], Prioridad: fPrioridad.value }
        modalPrioridad.value = false
    } catch (e) {
        const msg = e.response?.data?.message
        errPrioridad.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al cambiar la prioridad.')
    } finally {
        guardandoPrioridad.value = false
    }
}

// ── Motivos ────────────────────────────────────────────────────────
const modalMotivos = ref(false)
const motivos = ref([])
const loadingMotivos = ref(false)
const motivoEditando = ref(null)
const guardandoMotivo = ref(false)
const errMotivo = ref('')
const fMotivo = reactive({ Nombre: '', Descripcion: '', Estado: true })

const cargarMotivos = async () => {
    loadingMotivos.value = true
    try {
        const res = await PqrsService.getAllMotivos()
        motivos.value = Array.isArray(res) ? res : (res?.data ?? [])
    } catch (e) {
        console.error('[Motivos]', e)
    } finally {
        loadingMotivos.value = false
    }
}

const abrirMotivos = async () => {
    motivoEditando.value = null
    errMotivo.value = ''
    Object.assign(fMotivo, { Nombre: '', Descripcion: '', Estado: true })
    modalMotivos.value = true
    await cargarMotivos()
}

const editarMotivo = (m) => {
    motivoEditando.value = m
    Object.assign(fMotivo, {
        Nombre: m.Nombre ?? '',
        Descripcion: m.Descripcion ?? '',
        Estado: m.Estado ?? true,
    })
    errMotivo.value = ''
}

const cancelarEditarMotivo = () => {
    motivoEditando.value = null
    Object.assign(fMotivo, { Nombre: '', Descripcion: '', Estado: true })
    errMotivo.value = ''
}

const guardarMotivo = async () => {
    errMotivo.value = ''
    if (!fMotivo.Nombre.trim()) { errMotivo.value = 'El nombre es obligatorio.'; return }
    guardandoMotivo.value = true
    try {
        if (motivoEditando.value) {
            await PqrsService.updateMotivo(motivoEditando.value.IdMotivo, {
                Nombre: fMotivo.Nombre.trim(),
                Descripcion: fMotivo.Descripcion.trim() || undefined,
                Estado: fMotivo.Estado,
            })
        } else {
            await PqrsService.createMotivo({
                Nombre: fMotivo.Nombre.trim(),
                Descripcion: fMotivo.Descripcion.trim() || undefined,
                Estado: fMotivo.Estado,
            })
        }
        cancelarEditarMotivo()
        await cargarMotivos()
    } catch (e) {
        const msg = e.response?.data?.message
        errMotivo.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar el motivo.')
    } finally {
        guardandoMotivo.value = false
    }
}

// ── Asignación ─────────────────────────────────────────────────────
const modalAsignar = ref(false)
const guardandoAsignar = ref(false)
const errAsignar = ref('')
const fAsignar = reactive({
    DocumentoUsuario: '',
    Departamento: '',
    Observacion: '',
})

const abrirAsignar = (pqrs) => {
    pqrsAccion.value = pqrs
    errAsignar.value = ''
    Object.assign(fAsignar, { DocumentoUsuario: '', Departamento: '', Observacion: '' })
    modalAsignar.value = true
}

const asignarPqrs = async () => {
    errAsignar.value = ''
    if (!fAsignar.DocumentoUsuario) { errAsignar.value = 'El documento del usuario es obligatorio.'; return }
    if (!fAsignar.Departamento.trim()) { errAsignar.value = 'El departamento es obligatorio.'; return }

    guardandoAsignar.value = true
    try {
        await PqrsService.assignPqrsAdmin({
            IdPQRS: Number(pqrsAccion.value.Id),
            DocumentoUsuario: Number(fAsignar.DocumentoUsuario),
            Departamento: fAsignar.Departamento.trim(),
            ...(fAsignar.Observacion.trim() && { Observacion: fAsignar.Observacion.trim() }),
        })
        modalAsignar.value = false
    } catch (e) {
        const msg = e.response?.data?.message
        errAsignar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al asignar la PQRS.')
    } finally {
        guardandoAsignar.value = false
    }
}
</script>

<style scoped>
.check {
    background-color: #0D291C;
    width: 14px !important;
    height: 14px !important;
    cursor: pointer;
    border-radius: 4px !important;
    border: 1.5px solid #0D291C !important;
    padding: 0 !important;
}

input,
select {
    border-radius: 999px !important;
    background-color: #EAEAEA !important;
    border: 2px solid #299261 !important;
    padding: 10px 15px !important;
    color: black !important;
    box-shadow: none !important;
    outline: none !important;
}

input:focus,
select:focus {
    border-color: #0D291C !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.18) !important;
}

input.search-input {
    padding-right: 45px !important;
    background-image: url(@/assets/img/search.svg);
    background-size: 25px;
    background-position: right 10px center;
    background-repeat: no-repeat;
}

.field-input {
    background-color: white !important;
    border: 2px solid #0D291C !important;
    border-radius: 14px !important;
    padding: 9px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}

.field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.2) !important;
}

.field-label {
    font-size: 0.63rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.6;
    padding-left: 3px;
}

.btn-modal-dark {
    flex: 1;
    background-color: #0D291C;
    color: #7FD344;
    border: 2.5px solid #0D291C;
    border-radius: 14px;
    padding: 12px 20px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 4px 0 #050e09;
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-modal-dark:hover:not(:disabled) {
    background-color: #1a4a2e;
}

.btn-modal-dark:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #050e09;
}

.btn-modal-dark:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-modal-dark--cancel {
    background-color: rgba(13, 41, 28, 0.12);
    color: #0D291C;
    box-shadow: 0 4px 0 rgba(13, 41, 28, 0.2);
}

.btn-modal-dark--cancel:hover {
    background-color: rgba(13, 41, 28, 0.2);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
    transform: scale(0.93) translateY(12px);
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
    transition: transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
}

@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }
}

.th-cell {
    text-align: center;
}
</style>