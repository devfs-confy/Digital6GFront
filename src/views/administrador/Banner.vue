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
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Gestión de Publicidad</h2>
            <button @click="abrirModalCrear"
                class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline">Nueva</span>
            </button>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[180px]">
                <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Buscar</label>
                <input v-model="busqueda" type="text" placeholder="Título o descripción..." class="filter-pill" />
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label class="text-[0.62rem] font-black uppercase tracking-[0.08em] text-gray-400 pl-1">Estado</label>
                <select v-model="filtroEstado" class="filter-pill">
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>
            <button v-if="hayFiltros" @click="limpiarFiltros"
                class="self-end text-[0.75rem] font-bold text-red-600 bg-transparent border-2 border-red-300 rounded-full px-[14px] py-[7px] cursor-pointer whitespace-nowrap transition-colors hover:bg-red-50">
                ✕ Limpiar
            </button>
        </div>

        <!-- Resumen -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
                class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 shadow-[0_3px_0_#e2ede7] border-2 border-gray-100">
                <span class="text-[1.3rem] font-black leading-none text-[#0D291C]">{{ total }}</span>
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Total
                    publicidades</span>
            </div>
            <div
                class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 shadow-[0_3px_0_#e2ede7] border-2 border-gray-100">
                <span class="text-[1.3rem] font-black leading-none text-[#299261]">{{ countActivas }}</span>
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Activas</span>
            </div>
            <div
                class="bg-white rounded-[18px] px-[18px] py-4 flex flex-col gap-1 shadow-[0_3px_0_#e2ede7] border-2 border-gray-100">
                <span class="text-[1.3rem] font-black leading-none text-gray-500">{{ countInactivas }}</span>
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-gray-400">Inactivas</span>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center gap-3 py-16">
            <div class="w-8 h-8 rounded-full border-[3px] border-[#e8f5e9] border-t-[#299261] animate-spin" />
            <span class="text-sm font-semibold text-gray-400">Cargando publicidades...</span>
        </div>

        <!-- Grid de cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

            <!-- Empty state -->
            <div v-if="publicidades.length === 0"
                class="col-span-full flex flex-col items-center gap-3 py-20 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03A3.003 3.003 0 0 1 11 18c-1.66 0-3-1.34-3-3z" />
                </svg>
                <span class="text-sm font-semibold">No hay publicidades registradas</span>
            </div>

            <!-- Card publicidad -->
            <div v-for="(p, i) in publicidades" :key="p.IdPublicidad"
                class="bg-white rounded-3xl overflow-hidden border-2 border-[#e8f5e9] shadow-[0_4px_0_#e2ede7] flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#c8ddd1]"
                :style="{ animationDelay: `${i * 0.06}s` }">

                <!-- Imagen -->
                <div class="relative h-44 bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img v-if="imagenes[p.IdPublicidad]" :src="imagenes[p.IdPublicidad]"
                        class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                    </div>
                    <!-- Badge estado -->
                    <span
                        class="absolute top-3 left-3 text-[0.6rem] font-black uppercase tracking-[0.07em] px-2.5 py-1 rounded-full border"
                        :class="p.Estado
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'">
                        {{ p.Estado ? '● Activa' : '○ Inactiva' }}
                    </span>
                </div>

                <!-- Body -->
                <div class="flex flex-col gap-3 p-4 flex-1">
                    <div>
                        <h3 class="text-[0.95rem] font-black text-[#0D291C] leading-tight">{{ p.Titulo }}</h3>
                        <p v-if="p.Descripcion" class="text-[0.75rem] font-semibold text-gray-400 mt-1 line-clamp-2">{{
                            p.Descripcion }}</p>
                    </div>

                    <!-- Fechas -->
                    <div class="flex flex-col gap-1.5 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                        <div class="flex items-center justify-between text-[0.7rem]">
                            <span class="font-bold text-gray-400 uppercase tracking-wide">Inicio</span>
                            <span class="font-black text-[#0D291C]">{{ fmtFecha(p.FechaInicio) }}</span>
                        </div>
                        <div class="flex items-center justify-between text-[0.7rem]">
                            <span class="font-bold text-gray-400 uppercase tracking-wide">Expira</span>
                            <span class="font-black text-[#0D291C]">{{ fmtFecha(p.FechaExpiracion) }}</span>
                        </div>
                    </div>

                    <!-- Sedes asignadas -->
                    <div class="flex flex-wrap gap-1.5">
                        <span v-if="!p.T_PublicidadEstacionamientos?.length"
                            class="text-[0.65rem] font-semibold text-gray-400">Sin sedes asignadas</span>
                        <span v-for="pe in p.T_PublicidadEstacionamientos" :key="pe.IdEstacionamiento"
                            class="text-[0.62rem] font-black px-2 py-[3px] rounded-full" :class="pe.Activo
                                ? 'bg-[#0D291C] text-[#7FD344]'
                                : 'bg-gray-100 text-gray-400'">
                            {{ pe.T_Estacionamientos?.Nombre }}
                        </span>
                    </div>

                    <!-- Enlace -->
                    <a v-if="p.Enlace" :href="p.Enlace" target="_blank"
                        class="text-[0.7rem] font-bold text-[#299261] underline truncate">
                        {{ p.Enlace }}
                    </a>
                </div>

                <!-- Acciones -->
                <div class="flex gap-2 px-4 pb-4">
                    <button @click="abrirModalEditar(p)"
                        class="flex-1 flex items-center justify-center gap-1.5 py-[9px] px-3 rounded-[12px] text-[0.74rem] font-black cursor-pointer border-2 transition-all active:translate-y-[1px] bg-white text-[#0D291C] border-[#e8f5e9] shadow-[0_2px_0_#e2ede7] hover:bg-[#f0faf4]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Editar
                    </button>
                    <button @click="abrirModalSedes(p)"
                        class="flex-1 flex items-center justify-center gap-1.5 py-[9px] px-3 rounded-[12px] text-[0.74rem] font-black cursor-pointer border-2 transition-all active:translate-y-[1px] bg-[#0D291C] text-[#7FD344] border-[#0D291C] shadow-[0_2px_0_#051510] hover:bg-[#132e21]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Sedes
                    </button>
                </div>
            </div>
        </div>

        <!-- Paginación -->
        <div v-if="!loading && totalPaginas > 1"
            class="flex items-center justify-between flex-wrap gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <span class="text-xs text-gray-400">
                Página <strong>{{ page }}</strong> de <strong>{{ totalPaginas }}</strong> · <strong>{{ total }}</strong>
                publicidades
            </span>
            <div class="flex items-center gap-1">
                <button @click="page--" :disabled="page === 1" class="page-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>
                <template v-for="p in totalPaginas" :key="p">
                    <button @click="page = p" class="page-btn hidden sm:flex"
                        :class="page === p ? 'bg-[#0D291C] border-[#0D291C] text-[#7FD344]' : ''">
                        {{ p }}
                    </button>
                </template>
                <button @click="page++" :disabled="page === totalPaginas" class="page-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- ── MODAL CREAR/EDITAR ── -->
        <Transition name="modal">
            <div v-if="modalForm"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div
                    class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[480px] flex flex-col overflow-hidden max-h-[calc(100vh-32px)]">
                    <!-- Head -->
                    <div
                        class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15] flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-xl bg-[#7FD344]/20 border border-[#7FD344]/30 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[0.9rem] font-extrabold text-white">{{ modoEditar ? 'Editar publicidad'
                                    : 'Nueva publicidad' }}</p>
                                <p class="text-[0.65rem] text-white/50 font-semibold">
                                    {{ modoEditar ? `ID:${formData.IdPublicidad}` : 'Completa los datos' }}</p>
                            </div>
                        </div>
                        <button @click="modalForm = false"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto flex flex-col gap-4 px-5 py-4 [scrollbar-width:thin]">

                        <!-- Título -->
                        <div class="flex flex-col gap-1">
                            <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">Título
                                *</label>
                            <input v-model="formData.Titulo" type="text" maxlength="100"
                                class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                                placeholder="Nombre de la publicidad" />
                        </div>

                        <!-- Descripción -->
                        <div class="flex flex-col gap-1">
                            <label
                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">Descripción</label>
                            <textarea v-model="formData.Descripcion" rows="3" maxlength="500"
                                class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full resize-none"
                                placeholder="Descripción opcional..." />
                        </div>

                        <!-- Enlace -->
                        <div class="flex flex-col gap-1">
                            <label
                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">Enlace</label>
                            <input v-model="formData.Enlace" type="url"
                                class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                                placeholder="https://..." />
                        </div>

                        <!-- Fechas -->
                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-1">
                                <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">Fecha
                                    inicio
                                    *</label>
                                <input v-model="formData.FechaInicio" type="date"
                                    class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">Fecha
                                    expiración *</label>
                                <input v-model="formData.FechaExpiracion" type="date"
                                    class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full" />
                            </div>
                        </div>

                        <!-- Estado (solo editar) -->
                        <div v-if="modoEditar"
                            class="flex items-center justify-between px-3.5 py-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <span class="text-[0.82rem] font-black text-[#0D291C]">Estado</span>
                            <button @click="formData.Estado = !formData.Estado"
                                class="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                                :class="formData.Estado ? 'bg-[#299261]' : 'bg-gray-300'">
                                <span
                                    class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                                    :class="formData.Estado ? 'left-6' : 'left-1'" />
                            </button>
                        </div>

                        <!-- Imagen (solo crear) -->
                        <div v-if="!modoEditar" class="flex flex-col gap-1">
                            <label
                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700">Imagen</label>
                            <input ref="inputImagen" type="file" accept="image/*" @change="onImagenChange"
                                class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] transition-all w-full cursor-pointer" />
                            <div v-if="previewImagen"
                                class="mt-2 rounded-xl overflow-hidden border-2 border-gray-200 h-36">
                                <img :src="previewImagen" class="w-full h-full object-cover" />
                            </div>
                        </div>

                        <!-- Error -->
                        <div v-if="errForm"
                            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                            ⚠ {{ errForm }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200 flex-shrink-0">
                        <button @click="modalForm = false"
                            class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            Cancelar
                        </button>
                        <button @click="guardarPublicidad" :disabled="guardando"
                            class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <div v-if="guardando"
                                class="w-[13px] h-[13px] flex-shrink-0 border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin" />
                            {{ guardando ? 'Guardando...' : modoEditar ? 'Guardar cambios' : 'Crear publicidad' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ── MODAL SEDES ── -->
        <Transition name="modal">
            <div v-if="modalSedes"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div
                    class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[400px] flex flex-col overflow-hidden max-h-[calc(100vh-32px)]">
                    <!-- Head -->
                    <div
                        class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15] flex-shrink-0">
                        <div>
                            <p class="text-[0.9rem] font-extrabold text-white">Asignar sedes</p>
                            <p class="text-[0.65rem] text-white/50 font-semibold">{{ publicidadSedes?.Titulo }}</p>
                        </div>
                        <button @click="modalSedes = false"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 [scrollbar-width:thin]">
                        <p class="text-[0.72rem] font-semibold text-gray-400">Activa o desactiva la publicidad por sede.
                        </p>

                        <div v-if="!publicidadSedes?.T_PublicidadEstacionamientos?.length"
                            class="text-center py-8 text-gray-300 text-sm font-semibold">
                            Sin sedes asignadas
                        </div>

                        <div v-for="pe in publicidadSedes?.T_PublicidadEstacionamientos" :key="pe.IdEstacionamiento"
                            class="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 transition-colors"
                            :class="pe.Activo ? 'border-[#c8e6c9] bg-[#f0fdf4]' : ''">
                            <div class="flex items-center gap-2.5">
                                <div
                                    class="w-8 h-8 rounded-[9px] bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-[0.68rem] flex-shrink-0">
                                    {{ pe.T_Estacionamientos?.Nombre?.slice(0, 2).toUpperCase() }}
                                </div>
                                <span class="text-[0.82rem] font-black text-[#0D291C]">{{ pe.T_Estacionamientos?.Nombre
                                    }}</span>
                            </div>
                            <button @click="toggleSede(pe)"
                                class="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                                :class="pe.Activo ? 'bg-[#299261]' : 'bg-gray-300'">
                                <span
                                    class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                                    :class="pe.Activo ? 'left-6' : 'left-1'" />
                            </button>
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200 flex-shrink-0">
                        <button @click="modalSedes = false"
                            class="w-full py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { showError } from '@/utils/swal'
import bannerService from '@/api/services/banner.service'

// ── Estado ────────────────────────────────────────────────────────
const publicidades = ref([])
const imagenes = ref({})
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const limit = ref(12)

// ── Filtros ───────────────────────────────────────────────────────
const busqueda = ref('')
const filtroEstado = ref('')
const hayFiltros = computed(() => busqueda.value || filtroEstado.value)
const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))
const countActivas = computed(() => publicidades.value.filter(p => p.Estado).length)
const countInactivas = computed(() => publicidades.value.filter(p => !p.Estado).length)

const limpiarFiltros = () => {
    busqueda.value = ''
    filtroEstado.value = ''
}

// ── Modales ───────────────────────────────────────────────────────
const modalForm = ref(false)
const modalSedes = ref(false)
const modoEditar = ref(false)
const guardando = ref(false)
const errForm = ref('')
const publicidadSedes = ref(null)
const inputImagen = ref(null)
const previewImagen = ref('')
const imagenFile = ref(null)

const formData = ref({
    IdPublicidad: null,
    Titulo: '',
    Descripcion: '',
    Enlace: '',
    FechaInicio: '',
    FechaExpiracion: '',
    Estado: true,
})

// ── Carga ─────────────────────────────────────────────────────────
const cargarPublicidades = async () => {
    loading.value = true
    const res = await bannerService.getallPublicidad()
    loading.value = false

    if (res?.error) {
        showError({ status: res.status, data: res.data })
        return
    }

    const raw = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
    total.value = res?.total ?? raw.length
    publicidades.value = raw

    // Cargar imágenes en paralelo
    raw.forEach(p => cargarImagen(p.IdPublicidad))
}

const cargarImagen = async (id) => {
    const blob = await bannerService.getimgpublicidad(id)
    if (blob && blob instanceof Blob) {
        imagenes.value[id] = URL.createObjectURL(blob)
    }
}

onMounted(cargarPublicidades)
watch(page, () => cargarPublicidades())

// ── Crear ─────────────────────────────────────────────────────────
const abrirModalCrear = () => {
    modoEditar.value = false
    errForm.value = ''
    previewImagen.value = ''
    imagenFile.value = null
    formData.value = { IdPublicidad: null, Titulo: '', Descripcion: '', Enlace: '', FechaInicio: '', FechaExpiracion: '', Estado: true }
    modalForm.value = true
}

const onImagenChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    imagenFile.value = file
    previewImagen.value = URL.createObjectURL(file)
}

// ── Editar ────────────────────────────────────────────────────────
const abrirModalEditar = (p) => {
    modoEditar.value = true
    errForm.value = ''
    formData.value = {
        IdPublicidad: p.IdPublicidad,
        Titulo: p.Titulo ?? '',
        Descripcion: p.Descripcion ?? '',
        Enlace: p.Enlace ?? '',
        FechaInicio: p.FechaInicio ? p.FechaInicio.slice(0, 10) : '',
        FechaExpiracion: p.FechaExpiracion ? p.FechaExpiracion.slice(0, 10) : '',
        Estado: p.Estado,
    }
    modalForm.value = true
}

// ── Guardar ───────────────────────────────────────────────────────
const guardarPublicidad = async () => {
    errForm.value = ''
    if (!formData.value.Titulo.trim()) { errForm.value = 'El título es obligatorio.'; return }
    if (!formData.value.FechaInicio) { errForm.value = 'La fecha de inicio es obligatoria.'; return }
    if (!formData.value.FechaExpiracion) { errForm.value = 'La fecha de expiración es obligatoria.'; return }

    guardando.value = true

    if (modoEditar.value) {
        const payload = {
            Titulo: formData.value.Titulo.trim(),
            Descripcion: formData.value.Descripcion?.trim() || null,
            Enlace: formData.value.Enlace?.trim() || null,
            FechaInicio: formData.value.FechaInicio,
            FechaExpiracion: formData.value.FechaExpiracion,
            Estado: formData.value.Estado,
        }
        const res = await bannerService.updatePublicidad(formData.value.IdPublicidad, payload)
        guardando.value = false
        if (res?.error) { showError({ status: res.status, data: res.data }); return }
        modalForm.value = false
        await showSuccess('¡Publicidad actualizada!', 'Los cambios fueron guardados.')
        await cargarPublicidades()
    } else {
        // Crear con FormData si hay imagen
        const payload = new FormData()
        payload.append('Titulo', formData.value.Titulo.trim())
        if (formData.value.Descripcion?.trim()) payload.append('Descripcion', formData.value.Descripcion.trim())
        if (formData.value.Enlace?.trim()) payload.append('Enlace', formData.value.Enlace.trim())
        payload.append('FechaInicio', formData.value.FechaInicio)
        payload.append('FechaExpiracion', formData.value.FechaExpiracion)
        if (imagenFile.value) payload.append('Imagen', imagenFile.value)

        const res = await bannerService.createPublicidad(payload)
        guardando.value = false
        if (res?.error) { showError({ status: res.status, data: res.data }); return }
        modalForm.value = false
        await showSuccess('¡Publicidad creada!', 'Ya aparece en el listado.')
        await cargarPublicidades()
    }
}

// ── Sedes ─────────────────────────────────────────────────────────
const abrirModalSedes = (p) => {
    publicidadSedes.value = JSON.parse(JSON.stringify(p))  // copia profunda
    modalSedes.value = true
}

const toggleSede = async (pe) => {
    const res = await bannerService.enablePublicidad(
        publicidadSedes.value.IdPublicidad,
        pe.IdEstacionamiento
    )
    if (res?.error) {
        showError({ status: res.status, data: res.data })
        return
    }
    // Toggle local
    pe.Activo = !pe.Activo
    // Actualizar en el listado principal
    const idx = publicidades.value.findIndex(p => p.IdPublicidad === publicidadSedes.value.IdPublicidad)
    if (idx !== -1) {
        const sedeIdx = publicidades.value[idx].T_PublicidadEstacionamientos.findIndex(
            s => s.IdEstacionamiento === pe.IdEstacionamiento
        )
        if (sedeIdx !== -1) publicidades.value[idx].T_PublicidadEstacionamientos[sedeIdx].Activo = pe.Activo
    }
}

// ── Helpers ───────────────────────────────────────────────────────
const fmtFecha = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.filter-pill {
    background-color: #f3f4f6 !important;
    border: 2px solid #e5e7eb !important;
    border-radius: 999px !important;
    padding: 8px 14px !important;
    font-size: 0.82rem !important;
    color: #232B3A !important;
    outline: none !important;
    width: 100%;
    transition: border-color 0.15s;
}

.filter-pill:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12) !important;
}

.page-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    background: white;
    color: #374151;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s;
}

.page-btn:hover:not(:disabled) {
    border-color: #299261;
    color: #299261;
}

.page-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
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
</style>