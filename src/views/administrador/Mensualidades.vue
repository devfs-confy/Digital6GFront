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
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Mensualidades</h2>
            <div class="w-[72px] sm:w-[88px]" />
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">

            <div class="flex flex-col gap-1 flex-[2] min-w-[200px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Buscar</label>
                <div class="relative">
                    <input v-model="filtros.search" type="text" placeholder="Nombre, documento, placa o #ID..."
                        class="w-full rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all"
                        @input="onFiltroChange" />
                    <AppIcon name="search" :size="20"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[150px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Sede <span
                        class="text-red-400">*</span></label>
                <select v-model="filtros.sede" @change="onSedeChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option value="">Seleccionar sede</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
                        {{ s.Nombre }}
                    </option>
                </select>
            </div>

            <div class="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">Estado</label>
                <select v-model="filtros.estado" @change="onFiltroChange"
                    class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>

        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto flex-1 table-scroll-wrapper">
                <table class="border-collapse min-w-[700px] w-full">
                    <thead>
                        <tr>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Titular</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] sticky left-0 z-10 shadow-[3px_0_8px_rgba(0,0,0,0.12)]">
                                Documento</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Sede
                            </th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Placas</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Vigencia</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Estado</th>
                            <th
                                class="px-5 py-3.5 text-center text-[0.68rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Opciones</th>
                        </tr>
                    </thead>
                    <tbody>



                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="6" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin">
                                    </div>
                                    <span class="text-sm font-medium text-gray-400">Cargando mensualidades...</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Vacío -->
                        <tr v-else-if="mensualidades.length === 0">
                            <td colspan="6" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="manage_accounts" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium">No se encontraron mensualidades</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas -->
                        <tr v-else v-for="m in mensualidadesFiltradas" :key="m.IdPersonaAutorizada"
                            class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors group">

                            <!-- Titular -->
                            <td class="px-5 py-3 shadow-[3px_0_8px_rgba(0,0,0,0.07)] transition-colors">
                                <div class="flex items-center gap-3  max-w-[155px]">
                                    <div
                                        class="w-9 h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-sm flex-shrink-0">
                                        {{ iniciales(m.NombreApellidos) }}
                                    </div>
                                    <div class="flex flex-col gap-0.5 min-w-0">
                                        <span
                                            class="text-sm font-semibold text-[#0D291C] leading-tight max-w-[160px] truncate">
                                            {{ m.NombreApellidos }}
                                        </span>
                                        <span
                                            class="text-[0.6rem] font-black px-1.5 py-[1px] rounded-md bg-[#0D291C] text-[#7FD344] self-start">
                                            #{{ m.IdPersonaAutorizada }}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <!-- Documento -->
                            <td
                                class="sticky left-0 bg-white group-hover:bg-[#f0faf4] px-5 py-3 font-mono text-sm text-gray-600 whitespace-nowrap">
                                {{ m.Documento }}
                            </td>

                            <td class="px-5 py-3 whitespace-nowrap">
                                <span
                                    class="text-[0.72rem] font-bold text-[#299261] bg-[#f0faf4] border border-[#c8e6c9] px-2 py-0.5 rounded-full">
                                    {{ m._sedeName || sedeNombre || '—' }}
                                </span>
                            </td>
                            <!-- Placas -->
                            <td class="px-5 py-3">
                                <div class="flex gap-1 flex-wrap">
                                    <span v-for="p in placas(m)" :key="p"
                                        class="inline-block text-[0.6rem] font-black tracking-widest bg-[#0D291C] text-[white] px-2 py-0.5 rounded-md">
                                        {{ p }}
                                    </span>
                                    <span v-if="!placas(m).length" class="text-gray-300 text-sm">—</span>
                                </div>
                            </td>



                            <!-- Vigencia -->
                            <td class="px-5 py-3 whitespace-nowrap">
                                <div v-if="m.FechaInicio || m.FechaFin" class="flex flex-col gap-0.5">

                                    <span :class="['text-[0.65rem] font-bold', vigenciaClass(m)]">
                                        {{ vigenciaLabel(m) }}
                                    </span>
                                </div>
                                <span v-else class="text-gray-300 text-sm">Sin fechas</span>
                            </td>

                            <!-- Estado -->
                            <td class="px-5 py-3 whitespace-nowrap">
                                <span v-if="m.Estado" class="text-[#299261] font-extrabold text-[0.8rem]">●
                                    Activo</span>
                                <span v-else class="text-red-600 font-extrabold text-[0.8rem]">● Inactivo</span>
                            </td>

                            <!-- Opciones -->
                            <td class="px-3 py-3 text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <button @click="abrirVerDetalle(m)" title="Ver detalles"
                                        class="w-8 h-8 inline-flex items-center justify-center rounded-xl cursor-pointer border-none bg-transparent text-black hover:text-blue-500 hover:bg-blue-50 transition-all">
                                        <AppIcon name="visibility" :size="30" />
                                    </button>
                                    <button @click="abrirDetalle(m)" title="Editar"
                                        class="w-8 h-8 inline-flex items-center justify-center rounded-xl cursor-pointer border-none bg-transparent text-black hover:text-[#299261] hover:bg-[#e8f5e9] transition-all">
                                        <AppIcon name="edit_square" :size="30" />
                                    </button>
                                    <button @click="abrirModalPagos(m)" title="Últimos pagos"
                                        class="w-8 h-8 inline-flex items-center justify-center rounded-xl cursor-pointer border-none bg-transparent text-black hover:text-amber-500 hover:bg-amber-50 transition-all">
                                        <AppIcon name="receipt_long" :size="30" />
                                    </button>
                                    <button @click="abrirModalTransacciones(m)" title="Transacciones"
                                        class="w-8 h-8 inline-flex items-center justify-center rounded-xl cursor-pointer border-none bg-transparent text-black hover:text-purple-500 hover:bg-purple-50 transition-all">
                                        <AppIcon name="car_tag" :size="30" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <TablePaginacion :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- ── Aside Ver Detalle (read-only) ────────────────────────── -->
        <AsideEditar v-model="panelVer" :titulo="detalleVer?.NombreApellidos ?? '—'"
            :subtitulo="(detalleVer?.T_Estacionamiento?.Nombre ?? '') + (detalleVer?.Documento ? ' · Doc. ' + detalleVer.Documento : '')"
            label-guardar="Editar" :loading="loadingVer" @guardar="panelVer = false; abrirDetalle(detalleVerSource)"
            @update:modelValue="panelVer = false">

            <div v-if="loadingVer" class="flex flex-col items-center py-10 gap-3">
                <div class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                <span class="text-sm text-gray-400">Cargando detalle...</span>
            </div>

            <template v-else-if="detalleVer">
                <!-- Badges estado -->
                <div class="flex gap-2 flex-wrap">
                    <span class="text-[0.7rem] font-black px-3 py-1 rounded-full"
                        :class="detalleVer.Estado ? 'bg-[#e8f5e9] text-[#299261] border border-[#c8e6c9]' : 'bg-red-50 text-red-600 border border-red-200'">
                        ● {{ detalleVer.Estado ? 'Activo' : 'Inactivo' }}
                    </span>
                    <span class="text-[0.7rem] font-black px-3 py-1 rounded-full"
                        :class="detalleVer.CobroTarjeta ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-500 border border-gray-200'">
                        {{ detalleVer.CobroTarjeta ? '💳 Con tarjeta' : 'Sin tarjeta' }}
                    </span>
                    <span class="text-[0.7rem] font-black px-3 py-1 rounded-full"
                        :class="detalleVer.solicitud ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gray-100 text-gray-500 border border-gray-200'">
                        {{ detalleVer.solicitud ? 'Con solicitud' : 'Sin solicitud' }}
                    </span>
                </div>

                <!-- Datos titular -->
                <div class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C]/60 border-b border-[#e8f5e9] pb-1">
                        Titular</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="detail-pill col-span-2">
                            <span class="dp-label">Nombre</span>
                            <span class="dp-value">{{ detalleVer.NombreApellidos ?? '—' }}</span>
                        </div>
                        <div class="detail-pill">
                            <span class="dp-label">Documento</span>
                            <span class="dp-value font-mono">{{ detalleVer.Documento ?? '—' }}</span>
                        </div>
                        <div class="detail-pill">
                            <span class="dp-label">Sede</span>
                            <span class="dp-value">{{ detalleVer.T_Estacionamiento?.Nombre ?? '—' }}</span>
                        </div>
                        <div class="detail-pill">
                            <span class="dp-label">NIT</span>
                            <span class="dp-value font-mono">{{ detalleVer.Nit ?? '—' }}</span>
                        </div>
                        <div class="detail-pill">
                            <span class="dp-label">Empresa</span>
                            <span class="dp-value">{{ detalleVer.NombreEmpresa ?? '—' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Autorización y vigencia -->
                <div class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C]/60 border-b border-[#e8f5e9] pb-1">
                        Autorización y vigencia</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="detail-pill col-span-2">
                            <span class="dp-label">Autorización</span>
                            <span class="dp-value">{{ detalleVer.T_Autorizaciones?.NombreAutorizacion ?? '—' }}</span>
                        </div>
                        <div class="detail-pill">
                            <span class="dp-label">Tipo</span>
                            <span class="dp-value">{{ detalleVer.T_Estacionamiento?.Nombre ?? '—' }}</span>
                        </div>
                        <div class="detail-pill">
                            <span class="dp-label">ID Autorización</span>
                            <span class="dp-value font-mono">{{ detalleVer.T_Autorizaciones?.IdAutorizacion ?? '—'
                            }}</span>
                        </div>
                        <div class="detail-pill">
                            <span class="dp-label">Fecha inicio</span>
                            <span class="dp-value">{{ formatFecha(detalleVer.FechaInicio) }}</span>
                        </div>
                        <div class="detail-pill"
                            :class="vigenciaClass(detalleVer) === 'text-red-500' ? 'border-red-200 bg-red-50' : ''">
                            <span class="dp-label">Fecha fin</span>
                            <span class="dp-value" :class="vigenciaClass(detalleVer)">
                                {{ formatFecha(detalleVer.FechaFin) }}
                                <span v-if="detalleVer.FechaFin" class="ml-1 text-[0.6rem]">({{
                                    vigenciaLabel(detalleVer) }})</span>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Vehículos -->
                <div class="flex flex-col gap-2">
                    <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C]/60 border-b border-[#e8f5e9] pb-1">
                        Vehículos</p>
                    <div class="flex gap-2 flex-wrap">
                        <span v-for="p in placas(detalleVer)" :key="p"
                            class="text-[0.72rem] font-black tracking-widest bg-[#0D291C] text-white px-3 py-1.5 rounded-lg">
                            {{ p }}
                        </span>
                        <span v-if="!placas(detalleVer).length" class="text-sm text-gray-400">Sin vehículos
                            registrados</span>
                    </div>
                </div>
            </template>

        </AsideEditar>

        <!-- ── Overlay ───────────────────────────────────────────── -->
        <!-- ── Panel mensualidad ─────────────────────────────────────────── -->
        <AsideEditar v-model="panelAbierto" :titulo="detalle?.NombreApellidos ?? '—'"
            :subtitulo="(detalle?.T_Estacionamiento?.Nombre ?? sedeNombre) + ' · Doc. ' + (detalle?.Documento ?? '')"
            label-guardar="Guardar cambios" :loading="guardando || loadingDetalle" :error="errGuardar"
            @guardar="guardar" @update:modelValue="cerrarPanel">

            <!-- Loading skeleton mientras carga el detalle -->
            <template v-if="loadingDetalle">
                <div v-for="i in 5" :key="i" class="h-12 bg-gray-200 rounded-xl animate-pulse" />
            </template>

            <template v-else>

                <!-- Estado + CobroTarjeta -->
                <div class="flex gap-3">
                    <!-- Toggle Estado -->
                    <label
                        class="flex items-center gap-3 cursor-pointer select-none flex-1 p-3.5 bg-white rounded-xl border-2 transition-all"
                        :class="form.Estado ? 'border-[#299261]' : 'border-red-300'">
                        <div class="relative flex-shrink-0">
                            <input type="checkbox" v-model="form.Estado" class="sr-only" />
                            <div class="w-11 h-6 rounded-full transition-colors duration-200"
                                :class="form.Estado ? 'bg-[#299261]' : 'bg-red-400'">
                                <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                    :class="form.Estado ? 'translate-x-5' : 'translate-x-0'" />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[0.78rem] font-black"
                                :class="form.Estado ? 'text-[#299261]' : 'text-red-500'">
                                {{ form.Estado ? '● Activo' : '● Inactivo' }}
                            </span>
                            <span class="text-[0.65rem] text-gray-400 font-medium">Estado mensualidad</span>
                        </div>
                    </label>

                    <!-- CobroTarjeta toggle -->
                    <label @click.prevent="toggleCobroTarjeta"
                        class="flex items-center gap-3 cursor-pointer select-none flex-1 p-3.5 bg-white rounded-xl border-2 transition-all"
                        :class="form.CobroTarjeta ? 'border-[#299261]' : 'border-gray-200'">
                        <div class="relative flex-shrink-0">
                            <input type="checkbox" :checked="form.CobroTarjeta" class="sr-only" />
                            <div class="w-11 h-6 rounded-full transition-colors duration-200"
                                :class="form.CobroTarjeta ? 'bg-[#299261]' : 'bg-gray-300'">
                                <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                    :class="form.CobroTarjeta ? 'translate-x-5' : 'translate-x-0'" />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[0.78rem] font-black"
                                :class="form.CobroTarjeta ? 'text-[#299261]' : 'text-gray-400'">
                                {{ form.CobroTarjeta ? 'Con tarjeta' : 'Sin tarjeta' }}
                            </span>
                            <span class="text-[0.65rem] text-gray-400 font-medium">Cobro tarjeta</span>
                        </div>
                    </label>
                </div>

                <!-- Nombre titular -->
                <div class="flex flex-col gap-1.5">
                    <label class="aside-field-label">Nombre completo</label>
                    <input v-model="form.NombreApellidos" type="text" placeholder="JUAN..." class="aside-field-input" />
                </div>

                <!-- NIT + Empresa -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">NIT</label>
                        <input v-model="form.Nit" type="text" placeholder="901..." class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Empresa</label>
                        <input v-model="form.NombreEmpresa" type="text" placeholder="Empr..."
                            class="aside-field-input" />
                    </div>
                </div>

                <!-- Fechas -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Fecha inicio</label>
                        <input v-model="form.FechaInicio" type="datetime-local" class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Fecha fin</label>
                        <input v-model="form.FechaFin" type="datetime-local" class="aside-field-input" />
                    </div>
                </div>

                <!-- Placas -->
                <div class="flex flex-col gap-2">
                    <label class="aside-field-label">Vehículos</label>
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="(_, idx) in form.placas" :key="idx" class="flex flex-col gap-1">
                            <label class="text-[0.62rem] font-bold text-gray-400 uppercase tracking-wider pl-1">
                                Placa {{ idx + 1 }}
                            </label>
                            <input v-model="form.placas[idx]" type="text" maxlength="7"
                                class="aside-field-input aside-field-mini uppercase tracking-widest font-bold text-center" />
                        </div>
                    </div>
                </div>
                <!-- Autorización -->
                <div class="flex flex-col gap-1.5">
                    <label class="aside-field-label">Autorización</label>
                    <select v-model="form.IdAutorizacion" class="aside-field-input cursor-pointer">
                        <option :value="null" disabled>Selecciona una autorización</option>
                        <option v-for="a in autorizaciones" :key="a.IdAutorizacion" :value="Number(a.IdAutorizacion)">
                            {{ a.NombreAutorizacion }}
                        </option>
                    </select>
                    <p class="text-[0.65rem] text-gray-400 pl-0.5">
                        Actual: <strong class="text-[#0D291C]">{{ detalle?.T_Autorizaciones?.NombreAutorizacion ?? '—'
                            }}</strong>
                    </p>
                </div>

            </template>

        </AsideEditar>

        <!-- ── Modal Últimos Pagos ───────────────────────────────────────── -->
        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="modalPagos" class="modal-overlay" @click.self="modalPagos = false">
                    <div class="modal-box">
                        <!-- Header -->
                        <div class="modal-header">
                            <div class="flex flex-col">
                                <h3 class="text-lg font-black text-[#0D291C]">Últimos Pagos</h3>
                                <p class="text-xs text-gray-400 font-medium mt-0.5">
                                    {{ selectedMensual?.NombreApellidos }} · #{{ selectedMensual?.IdPersonaAutorizada }}
                                </p>
                            </div>
                            <button @click="modalPagos = false"
                                class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-all text-gray-500 flex-shrink-0">
                                <AppIcon name="close" :size="20" />
                            </button>
                        </div>
                        <!-- Body -->
                        <div class="modal-body">
                            <!-- Loading -->
                            <div v-if="loadingPagos" class="flex flex-col items-center py-16 gap-3">
                                <div class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                <span class="text-sm text-gray-400">Cargando pagos...</span>
                            </div>

                            <!-- Vacío -->
                            <div v-else-if="!pagosData.length" class="flex flex-col items-center justify-center py-16 gap-3 text-gray-300">
                                <AppIcon name="receipt_long" :size="56" />
                                <span class="text-sm font-medium">Sin pagos registrados</span>
                            </div>

                            <!-- Tabla -->
                            <div v-else class="overflow-x-auto overflow-y-auto max-h-[55vh]">
                                <table class="w-full border-collapse min-w-[540px]">
                                    <thead>
                                        <tr>
                                            <th class="modal-th">Sede</th>
                                            <th class="modal-th">Módulo</th>
                                            <th class="modal-th">N° Factura</th>
                                            <th class="modal-th text-right">Total</th>
                                            <th class="modal-th">Tipo Pago</th>
                                            <th class="modal-th">Fecha Pago</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="p in pagosData" :key="p.idPago"
                                            class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors">
                                            <td class="modal-td font-mono text-xs text-gray-500">{{ p.idEstacionamiento }}</td>
                                            <td class="modal-td">
                                                <span class="text-[0.7rem] font-black tracking-wider bg-[#0D291C] text-[#7FD344] px-2 py-0.5 rounded-md">
                                                    {{ p.idModulo }}
                                                </span>
                                            </td>
                                            <td class="modal-td font-mono font-bold text-[#0D291C]"># {{ p.numeroFactura }}</td>
                                            <td class="modal-td text-right font-black text-[#299261]">
                                                {{ Number(p.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) }}
                                            </td>
                                            <td class="modal-td">
                                                <span class="text-[0.7rem] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                                                    {{ p.idTipoPago }}
                                                </span>
                                            </td>
                                            <td class="modal-td text-xs text-gray-500 whitespace-nowrap">{{ formatFecha(p.fechaPago) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ── Modal Transacciones ───────────────────────────────────────── -->
        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="modalTransacciones" class="modal-overlay" @click.self="modalTransacciones = false">
                    <div class="modal-box">
                        <!-- Header -->
                        <div class="modal-header">
                            <div class="flex flex-col">
                                <h3 class="text-lg font-black text-[#0D291C]">Transacciones</h3>
                                <p class="text-xs text-gray-400 font-medium mt-0.5">
                                    {{ selectedMensual?.NombreApellidos }} · #{{ selectedMensual?.IdPersonaAutorizada }}
                                </p>
                            </div>
                            <button @click="modalTransacciones = false"
                                class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-all text-gray-500 flex-shrink-0">
                                <AppIcon name="close" :size="20" />
                            </button>
                        </div>
                        <!-- Body -->
                        <div class="modal-body flex flex-col gap-4">

                            <!-- Loading sedes -->
                            <div v-if="loadingSedesTransacciones" class="flex flex-col items-center py-10 gap-3">
                                <div class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                <span class="text-sm text-gray-400">Cargando sedes...</span>
                            </div>

                            <template v-else>
                                <!-- Cards sedes -->
                                <div>
                                    <p class="text-[0.62rem] font-black uppercase tracking-widest text-[#0D291C]/50 mb-2">Selecciona una sede</p>
                                    <div class="flex flex-wrap gap-2">
                                        <button v-for="s in sedesTransacciones" :key="s.IdEstacionamiento"
                                            @click="seleccionarSedeTransaccion(s)"
                                            class="flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all"
                                            :class="selectedSedeTransaccion?.IdEstacionamiento === s.IdEstacionamiento
                                                ? 'border-[#299261] bg-[#e8f5e9] text-[#0D291C]'
                                                : 'border-gray-200 bg-white text-gray-500 hover:border-[#299261] hover:text-[#0D291C]'">
                                            <AppIcon name="location_on" :size="16" />
                                            {{ s.Nombre.trim() }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Loading tabla -->
                                <div v-if="loadingTransaccionesTable" class="flex flex-col items-center py-10 gap-3">
                                    <div class="w-7 h-7 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm text-gray-400">Cargando transacciones...</span>
                                </div>

                                <!-- Sin sede seleccionada -->
                                <div v-else-if="!selectedSedeTransaccion"
                                    class="flex flex-col items-center py-12 gap-3 text-gray-300">
                                    <AppIcon name="swap_horiz" :size="48" />
                                    <span class="text-sm font-medium">Selecciona una sede para ver transacciones</span>
                                </div>

                                <!-- Vacío -->
                                <div v-else-if="!transaccionesTable.length"
                                    class="flex flex-col items-center py-12 gap-3 text-gray-300">
                                    <AppIcon name="inbox" :size="48" />
                                    <span class="text-sm font-medium">Sin transacciones en esta sede</span>
                                </div>

                                <!-- Tabla -->
                                <div v-else class="overflow-x-auto overflow-y-auto max-h-[45vh]">
                                    <table class="w-full border-collapse min-w-[640px]">
                                        <thead>
                                            <tr>
                                                <th class="modal-th">Módulo entrada</th>
                                                <th class="modal-th">Placa entrada</th>
                                                <th class="modal-th">Fecha entrada</th>
                                                <th class="modal-th">Módulo salida</th>
                                                <th class="modal-th">Placa salida</th>
                                                <th class="modal-th">Fecha salida</th>
                                                <th class="modal-th">Tipo veh.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(t, i) in transaccionesTable" :key="i"
                                                class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors">
                                                <td class="modal-td">
                                                    <span class="text-[0.7rem] font-black tracking-wider bg-[#0D291C] text-[#7FD344] px-2 py-0.5 rounded-md">
                                                        {{ t.moduloEntrada }}
                                                    </span>
                                                </td>
                                                <td class="modal-td font-mono font-bold text-[#0D291C] tracking-widest">{{ t.placaEntrada }}</td>
                                                <td class="modal-td text-xs text-gray-500 whitespace-nowrap">{{ formatFecha(t.fechaEntrada) }}</td>
                                                <td class="modal-td">
                                                    <span class="text-[0.7rem] font-black tracking-wider bg-purple-900 text-purple-200 px-2 py-0.5 rounded-md">
                                                        {{ t.moduloSalida }}
                                                    </span>
                                                </td>
                                                <td class="modal-td font-mono font-bold text-[#0D291C] tracking-widest">{{ t.placaSalida }}</td>
                                                <td class="modal-td text-xs text-gray-500 whitespace-nowrap">{{ formatFecha(t.fechaSalida) }}</td>
                                                <td class="modal-td text-center">
                                                    <span class="text-[0.7rem] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                                                        {{ t.idTipoVehiculo }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </template>

                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import MensualidadesService from '@/api/services/mensualidades.service'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import FacturaService from '@/api/services/factura.service'
import ReglasEstacionamientoService from '@/api/services/reglas.estacionamiento.service'
import ParqueosService from '@/api/services/parqueos.service'
import TablePaginacion from '@/components/shared/Paginacion.vue'
import { showConfirm } from '@/utils/swal'
import formatsDate from '@/utils/formats.date'
import SwalBase, { showError, showSuccess } from '@/utils/swal'
import AutorizacionesService from '@/api/services/autorizaciones.service'
// ── Estado ─────────────────────────────────────────────────────────
const mensualidades = ref([])
const sedes = ref([])
const loading = ref(false)
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)
const autorizaciones = ref([])
// Panel
const panelAbierto = ref(false)
const loadingDetalle = ref(false)
const guardando = ref(false)
const errGuardar = ref('')
const detalle = ref(null)

// Filtros
const filtros = reactive({ search: '', sede: '', estado: '' })

const form = reactive({
    NombreApellidos: '',
    Nit: '',
    NombreEmpresa: '',
    FechaInicio: '',
    FechaFin: '',
    Estado: true,
    CobroTarjeta: false,
    IdAutorizacion: null,
    placas: ['', '', '', '', ''],
})

// ── Computed ───────────────────────────────────────────────────────
const sedeNombre = computed(() =>
    sedes.value.find(s => String(s.IdEstacionamiento) === String(filtros.sede))?.Nombre ?? ''
)

// Reemplaza mensualidadesFiltradas
const mensualidadesFiltradas = computed(() => {
    let lista = mensualidades.value

    // Filtro estado
    if (filtros.estado)
        lista = lista.filter(m => String(m.Estado) === filtros.estado)

    // Filtro búsqueda local (solo cuando no hay sede, porque con sede lo hace el backend)
    if (!filtros.sede && filtros.search) {
        const raw = filtros.search.trim()
        if (raw.startsWith('#')) {
            const id = raw.slice(1)
            lista = lista.filter(m => String(m.IdPersonaAutorizada).includes(id))
        } else {
            const q = raw.toLowerCase()
            lista = lista.filter(m =>
                m.NombreApellidos?.toLowerCase().includes(q) ||
                m.Documento?.toLowerCase().includes(q) ||
                placas(m).some(p => p.toLowerCase().includes(q))
            )
        }
    }

    // Actualiza contadores reactivamente
    totalRegistros.value = lista.length
    totalPaginas.value = Math.max(1, Math.ceil(lista.length / limit.value))

    // Paginar localmente
    const desde = (paginaActual.value - 1) * limit.value
    return lista.slice(desde, desde + limit.value)
})

// ── Helpers ────────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre ? nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '??'

const placas = (m) =>
    ['Placa1', 'Placa2', 'Placa3', 'Placa4', 'Placa5'].map(k => m[k]).filter(Boolean)

const formatFecha = (f) => {
    if (!f) return '—'
    return formatsDate.fechaSinDate(f)
    //new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const vigenciaClass = (m) => {
    if (!m.FechaFin) return 'text-gray-400'
    const diff = new Date(m.FechaFin) - new Date()
    if (diff < 0) return 'text-red-500'
    if (diff < 86400000 * 7) return 'text-amber-500'
    return 'text-[#299261]'
}

const vigenciaLabel = (m) => {
    if (!m.FechaFin) return ''
    const diff = new Date(m.FechaFin) - new Date()
    if (diff < 0) return 'Vencida'
    if (diff < 86400000 * 7) return 'Por vencer'
    return 'Vigente'
}

// ── Carga todas las sedes (sin filtro activo) ──────────────────────
const cargarTodasLasMensualidades = async () => {
    if (!sedes.value.length) return
    loading.value = true
    try {
        const resultados = await Promise.all(
            sedes.value.map(s =>
                MensualidadesService.getAllBySede({ sede: s.IdEstacionamiento, page: 1, limit: 999 })
            )
        )

        mensualidades.value = resultados.flatMap((res, idx) => {
            const items = res?.data?.data ?? res?.data ?? []
            return items.map(m => ({
                ...m,
                _sedeName: sedes.value[idx]?.Nombre ?? '',
                _sedeId: sedes.value[idx]?.IdEstacionamiento ?? '',
            }))
        })
    } catch (e) {
        console.error('[Mensualidades todas]', e.response?.data ?? e.message)
        mensualidades.value = []
    } finally {
        loading.value = false
    }
}

// ── Carga por sede seleccionada ────────────────────────────────────
const cargarMensualidades = async () => {
    if (!filtros.sede) { await cargarTodasLasMensualidades(); return }

    loading.value = true
    try {
        const res = await MensualidadesService.getAllBySede({
            sede: filtros.sede,
            page: paginaActual.value,
            limit: limit.value,
            search: filtros.search || undefined,
        })

        mensualidades.value = (res?.data?.data ?? res?.data ?? [])
            .map(m => ({
                ...m,
                _sedeName: sedeNombre.value,
                _sedeId: filtros.sede,
            }))
        totalRegistros.value = res?.data?.total ?? res?.total ?? mensualidades.value.length
        totalPaginas.value = res?.data?.totalPages ?? res?.totalPages ??
            Math.max(1, Math.ceil(totalRegistros.value / limit.value))

    } catch (e) {
        console.error('[Mensualidades]', e.response?.data ?? e.message)
        mensualidades.value = []
    } finally {
        loading.value = false
    }
}

// ── Paginación ─────────────────────────────────────────────────────
const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    paginaActual.value = p
    cargarMensualidades()
}

const onLimitChange = (val) => {
    limit.value = Number(val)
    paginaActual.value = 1
}

// ── Filtros ────────────────────────────────────────────────────────
let debTimer = null
const onFiltroChange = () => {
    clearTimeout(debTimer)
    debTimer = setTimeout(() => { paginaActual.value = 1; cargarMensualidades() }, 350)
}

const onSedeChange = () => {
    paginaActual.value = 1
    mensualidades.value = []
    cargarMensualidades()
}

// ── Mount ──────────────────────────────────────────────────────────
onMounted(async () => {
    sedes.value = await SedesService.getAll()
    await cargarTodasLasMensualidades()
})


// ── Modales Pagos / Transacciones ─────────────────────────────────
const modalPagos = ref(false)
const modalTransacciones = ref(false)
const selectedMensual = ref(null)
const pagosData = ref([])
const loadingPagos = ref(false)

const abrirModalPagos = async (m) => {
    selectedMensual.value = m
    pagosData.value = []
    loadingPagos.value = true
    modalPagos.value = true
    try {
        const res = await FacturaService.getUltimosPagos(m.Documento)
        pagosData.value = res?.data ?? []
    } catch (e) {
        console.error('[Últimos pagos]', e)
    } finally {
        loadingPagos.value = false
    }
}

const sedesTransacciones = ref([])
const loadingSedesTransacciones = ref(false)
const selectedSedeTransaccion = ref(null)
const transaccionesTable = ref([])
const loadingTransaccionesTable = ref(false)

const abrirModalTransacciones = async (m) => {
    selectedMensual.value = m
    sedesTransacciones.value = []
    selectedSedeTransaccion.value = null
    transaccionesTable.value = []
    loadingSedesTransacciones.value = true
    modalTransacciones.value = true
    try {
        const res = await ReglasEstacionamientoService.getEstacionamientoAcceso(m._sedeId)
        sedesTransacciones.value = res?.data ?? []
    } catch (e) {
        console.error('[Transacciones sedes]', e)
    } finally {
        loadingSedesTransacciones.value = false
    }
}

const seleccionarSedeTransaccion = async (sede) => {
    if (selectedSedeTransaccion.value?.IdEstacionamiento === sede.IdEstacionamiento) return
    selectedSedeTransaccion.value = sede
    transaccionesTable.value = []
    loadingTransaccionesTable.value = true
    try {
        const res = await ParqueosService.getAllAdmin(sede.IdEstacionamiento, selectedMensual.value.Documento)
        transaccionesTable.value = res?.data ?? []
    } catch (e) {
        console.error('[Transacciones tabla]', e)
    } finally {
        loadingTransaccionesTable.value = false
    }
}

// ── Aside ver detalle (read-only) ────────────────────────────────
const panelVer = ref(false)
const loadingVer = ref(false)
const detalleVer = ref(null)
const detalleVerSource = ref(null)

const abrirVerDetalle = async (m) => {
    detalleVerSource.value = m
    detalleVer.value = null
    loadingVer.value = true
    panelVer.value = true
    try {
        const res = await MensualidadesService.getDetalleById(m.IdPersonaAutorizada)
        detalleVer.value = res?.data ?? res
    } catch (e) {
        console.error('[Ver detalle]', e)
    } finally {
        loadingVer.value = false
    }
}

// ── Panel detalle ──────────────────────────────────────────────────
const abrirDetalle = async (m) => {
    panelAbierto.value = true
    loadingDetalle.value = true
    errGuardar.value = ''
    detalle.value = null
    autorizaciones.value = []

    try {
        // 1. Cargar detalle primero para obtener IdEstacionamiento correcto
        const resDetalle = await MensualidadesService.getDetalleById(m.IdPersonaAutorizada)
        const d = resDetalle?.data ?? resDetalle
        detalle.value = d

        // 2. Cargar autorizaciones de la sede correspondiente
        const idSede = String(d.T_Estacionamiento?.IdEstacionamiento ?? d.IdEstacionamiento ?? '')
        const resAuth = await AutorizacionesService.listarPorSede(idSede)
        const authData = Array.isArray(resAuth) ? resAuth : (resAuth?.data ?? [])
        autorizaciones.value = authData

        const toInputDate = (f) => {
            if (!f) return ''
            // separa fecha y hora directamente
            return formatsDate.DateOfString(f)

        }

        Object.assign(form, {
            NombreApellidos: d.NombreApellidos ?? '',
            Nit: d.Nit ?? '',
            NombreEmpresa: d.NombreEmpresa ?? '',
            FechaInicio: toInputDate(d.FechaInicio),
            FechaFin: toInputDate(d.FechaFin),
            Estado: d.Estado ?? true,
            CobroTarjeta: d.CobroTarjeta ?? false,
            IdAutorizacion: Number(d.T_Autorizaciones?.IdAutorizacion) ?? null,
            placas: [d.Placa1 ?? '', d.Placa2 ?? '', d.Placa3 ?? '', d.Placa4 ?? '', d.Placa5 ?? ''],
        })

    } catch (e) {
        console.error('[Mensualidades detalle]', e.response?.data ?? e.message)
    } finally {
        loadingDetalle.value = false
    }
}

const cerrarPanel = () => {
    panelAbierto.value = false
    detalle.value = null
    errGuardar.value = ''
    guardando.value = false
    form.IdAutorizacion = null
}

const toggleCobroTarjeta = async () => {
    const quitando = form.CobroTarjeta
    const { isConfirmed } = await showConfirm({
        title: quitando ? '¿Quitar cobro de tarjeta?' : '¿Activar cobro de tarjeta?',
        text: quitando
            ? 'El cliente dejará de tener cobro de tarjeta asociado.'
            : 'Se habilitará el cobro de tarjeta para este cliente.',
        confirmText: 'Sí, confirmar',
        cancelText: 'Cancelar',
        icon: 'warning',
    })
    if (!isConfirmed) return
    form.CobroTarjeta = !form.CobroTarjeta
}

// ── Guardar ────────────────────────────────────────────────────────
const guardar = async () => {
    errGuardar.value = ''
    guardando.value = true
    try {
        const id = detalle.value?.IdPersonaAutorizada

        // Convertir fecha a "YYYY-MM-DD HH:mm:ss"
        const toApiDate = (f) => {
            if (!f) return undefined
            const d = new Date(f)
            if (isNaN(d)) return undefined
            const pad = n => String(n).padStart(2, '0')
            const result = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
            return result
        }


        const dto = {
            NombreApellidos: form.NombreApellidos || undefined,
            Estado: form.Estado,
            CobroTarjeta: form.CobroTarjeta,
            Placa1: form.placas[0] || null,
            Placa2: form.placas[1] || null,
            Placa3: form.placas[2] || null,
            Placa4: form.placas[3] || null,
            Placa5: form.placas[4] || null,
            ...(form.Nit && { Nit: form.Nit }),
            ...(form.NombreEmpresa && { NombreEmpresa: form.NombreEmpresa }),
            ...(form.FechaInicio && { FechaInicio: toApiDate(form.FechaInicio) }),
            ...(form.FechaFin && { FechaFin: toApiDate(form.FechaFin) }),
            ...(form.IdAutorizacion && { IdAutorizacion: form.IdAutorizacion }), // ← agregar
        }



        const response = await MensualidadesService.updateById(id, dto)
        if (response?.error) {
            return showError({ data: response })
        }
        showSuccess('Mensualidad', response.message)
        await cargarMensualidades()
        cerrarPanel()
    } catch (e) {
        console.error('[Mensualidades guardar]', e.response?.data ?? e.message)
        const msg = e.response?.data?.message
        errGuardar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar.')
    } finally {
        guardando.value = false
    }
}
</script>

<style scoped>
.detail-pill {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: #f8fffe;
    border: 1px solid #e8f5e9;
    border-radius: 0.75rem;
    padding: 0.5rem 0.75rem;
}

.dp-label {
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #299261;
}

.dp-value {
    font-size: 0.82rem;
    font-weight: 600;
    color: #232B3A;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* ── Field helpers para usar dentro del slot del AsideEditar ─────── */
.aside-field-label {
    font-size: 0.72rem;
    font-weight: 800;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-left: 2px;
}

.aside-field-input {
    border: 2px solid #d1d5db;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.88rem;
    color: #0D291C;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.aside-field-input:focus {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15);
}

.aside-field-mini {
    padding-top: 7px;
    padding-bottom: 7px;
    font-size: 0.82rem;
}

/* ── Toggle switch ────────────────────────────────────────────────── */
input[type="checkbox"].sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
}

@media (max-width:780px) {
    .shadow-sm {
        height: auto;
    }

    .maincontainer {
        height: auto;
    }

    .td-cell--sticky {
        min-width: auto;
    }

    .orden {
        display: flex;
        flex-direction: column;
    }
}

/* ── Tabla mobile: max 5 filas visibles con scroll ────────────────── */
@media (max-width: 640px) {


    .td-nombre-truncate {
        max-width: 100px !important;
    }
}

/* ── Transición overlay del aside (ya la maneja el componente) ────── */
.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.25s;
}

/* ── Modales grandes ─────────────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    backdrop-filter: blur(2px);
}

.modal-box {
    background: white;
    border-radius: 1.25rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 860px;
    max-height: 88vh;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 2px solid #e8f5e9;
    flex-shrink: 0;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}

/* Transición modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box {
    transition: transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
    transform: translateY(12px) scale(0.98);
}

.modal-th {
    padding: 0.625rem 1rem;
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: white;
    background: #0D291C;
    border-bottom: 3px solid #7FD344;
    white-space: nowrap;
    text-align: left;
}

.modal-td {
    padding: 0.625rem 1rem;
    font-size: 0.82rem;
    color: #232B3A;
}

@media (max-width: 640px) {
    .modal-overlay {
        align-items: flex-end;
        padding: 0;
    }

    .modal-box {
        max-width: 100%;
        max-height: 85vh;
        border-radius: 1.25rem 1.25rem 0 0;
    }
}
</style>