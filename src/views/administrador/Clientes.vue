<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <AdminPageHeader title="Clientes">
             <template #right>
                <button @click="abrirCrearCliente"
                    class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-[#0D291C]"
                    style="box-shadow: #051510 0px 2px 0">
                    <AppIcon name="add" :size="16" />
                    <span class="hidden sm:inline">Nuevo cliente</span>
                </button>
            </template>
        </AdminPageHeader>



        <!-- Sin permiso VER -->
        <div v-if="!hasPermission('VER-USUARIOS')"
            class="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-3 py-20 text-gray-300">
            <AppIcon name="lock" :size="48" />
            <span class="text-sm font-medium text-gray-400">No tienes permiso para ver clientes</span>
        </div>

        <template v-if="hasPermission('VER-USUARIOS')">

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[200px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Buscar</label>
                <input v-model="busqueda" type="text" placeholder="Nombre, documento o #ID mensualidad..."
                    class="search-input w-full" />
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[140px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Sede</label>
                <select v-model="filtroSede" @change="cargarClientes">
                    <option value="">Todas las sedes</option>
                    <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">{{ s.Nombre }}
                    </option>
                </select>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-[140px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Estado</label>
                <select v-model="filtroEstado" @change="() => { paginaActual = 1; cargarClientes() }">
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>
            <button v-if="busqueda || filtroSede || filtroEstado" @click="limpiarFiltros"
                class="self-end px-[18px] py-[10px] text-[0.8rem] font-bold text-gray-500 bg-gray-50 border-[1.5px] border-gray-200 rounded-full cursor-pointer transition-colors whitespace-nowrap hover:border-[#299261] hover:text-[#299261] max-[600px]:w-full max-[600px]:text-center">
                ✕ Limpiar
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="table-scroll-wrapper">
                <table class="border-collapse min-w-[700px] w-full">
                    <thead>
                        <tr>
                            <th class="th-cell ">Cliente</th>
                            <th class="th-cell th-cell--sticky">Documento</th>
                            <th class="th-cell">Correo</th>
                            <th class="th-cell">Teléfono</th>
                            <th class="th-cell">Estado</th>
                            <th class="th-cell th-cell--center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando clientes...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="listaClientes.length === 0">
                            <td colspan="6" class="text-center py-20 text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron clientes</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="cliente in listaClientes" :key="cliente.Documento"
                            class="border-b border-[#e8f5e9] last:border-b-0 transition-colors duration-150 hover:bg-[#f0faf4] group">

                            <td class="td-cell  group-hover:bg-[#f0faf4] max-w-[155px]">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-9 h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-[0.75rem] flex-shrink-0 border-2 border-[#e8f5e9]">
                                        {{ iniciales(cliente.Nombres) }}
                                    </div>
                                    <div class="flex flex-col items-start min-w-0 gap-0.5">
                                        <span class="font-semibold text-[#0D291C] leading-tight truncate max-w-[140px]">
                                            {{ cliente.Nombres }} {{ cliente.Apellidos }}
                                        </span>
                                        <div v-if="cliente.tPersonasAutorizadas?.length" class="flex flex-wrap gap-1">
                                            <span v-for="p in cliente.tPersonasAutorizadas" :key="p.IdPersonaAutorizada"
                                                class="text-[0.58rem] font-black px-1.5 py-[1px] rounded-md bg-[#0D291C] text-[#7FD344]">
                                                #{{ p.IdPersonaAutorizada }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-cell td-cell--sticky font-mono tracking-wide">{{ cliente.Documento }}</td>
                            <td class="td-cell">
                                <span
                                    class="inline-block px-[10px] py-[3px] rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                                    {{ cliente.Email }}
                                </span>
                            </td>
                            <td class="td-cell">{{ cliente.Telefono ?? '—' }}</td>
                            <td class="td-cell">
                                <span v-if="cliente.Estado" class="text-[#299261] font-extrabold text-[0.8rem]">●
                                    Activo</span>
                                <span v-else class="text-[#dc2626] font-extrabold text-[0.8rem]">● Inactivo</span>
                            </td>
                            <td class="td-cell td-cell--center">
                                <div class="flex items-center justify-center gap-2">
                                    <button v-permission="'EDITAR-USUARIOS'" @click="abrirEditar(cliente)"
                                        class="w-8 h-8 rounded-[10px] flex items-center justify-center border-none cursor-pointer bg-transparent text-gray-400 hover:bg-[#e8f5e9] hover:text-[#299261] transition-all"
                                        title="Editar">
                                        <AppIcon name="person_edit" :size="30" style="color:black;" />
                                    </button>
                                    <button v-permission="'INACTIVAR-USUARIOS'" @click="abrirCambioEstado(cliente)"
                                        class="w-8 h-8 rounded-[10px] flex items-center justify-center border-none cursor-pointer bg-transparent transition-all"
                                        :class="cliente.Estado
                                            ? 'text-gray-400 hover:bg-red-100 hover:text-red-500'
                                            : 'text-gray-400 hover:bg-green-100 hover:text-[#299261]'"
                                        :title="cliente.Estado ? 'Inhabilitar' : 'Activar'">
                                        <AppIcon :name="cliente.Estado ? 'account_circle_off' : 'how_to_reg'" :size="30"
                                            style="color:black;" />
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

        </template><!-- /VER-USUARIOS -->

        <!-- ───────────────── MODAL: CREAR CLIENTE ───────────────── -->
        <Transition name="modal-fade">
            <div v-if="modalCrearCliente"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
                <div
                    class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[460px] flex flex-col overflow-hidden max-h-[calc(100vh-32px)]">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15] flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-xl bg-[#7FD344] flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0D291C"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[0.9rem] font-extrabold text-white">Registrar cliente</p>
                                <p class="text-[0.65rem] text-white/50 font-semibold">Completa los campos obligatorios
                                    *</p>
                            </div>
                        </div>
                        <button @click="modalCrearCliente = false"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div
                        class="flex flex-col gap-4 px-5 py-5 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#c8e6c9_transparent]">

                        <!-- Datos personales -->
                        <p
                            class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                            Datos personales
                        </p>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Documento
                                    <span class="text-red-400">*</span></label>
                                <input v-model="fCrear.Documento" type="text" placeholder="1122334455"
                                    class="crear-input" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Teléfono
                                    <span class="text-red-400">*</span></label>
                                <input v-model="fCrear.Telefono" type="text" maxlength="15" placeholder="3001234567"
                                    class="crear-input" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Nombres
                                    <span class="text-red-400">*</span></label>
                                <input v-model="fCrear.Nombres" type="text" maxlength="50" placeholder="Andrés Felipe"
                                    class="crear-input" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Apellidos
                                    <span class="text-red-400">*</span></label>
                                <input v-model="fCrear.Apellidos" type="text" maxlength="50"
                                    placeholder="García Ospina" class="crear-input" />
                            </div>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label
                                class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Correo
                                electrónico <span class="text-red-400">*</span></label>
                            <input v-model="fCrear.Email" type="email" maxlength="100"
                                placeholder="correo@ejemplo.com" class="crear-input" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label
                                class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Contraseña
                                <span class="text-red-400">*</span></label>
                            <div class="relative">
                                <input v-model="fCrear.Password" :type="verPassCrear ? 'text' : 'password'"
                                    maxlength="50" placeholder="••••••••"
                                    class="crear-input pr-10" />
                                <button type="button" @click="verPassCrear = !verPassCrear"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 opacity-50 hover:opacity-100 transition-opacity">
                                    <svg v-if="!verPassCrear" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24" fill="#0D291C">
                                        <path
                                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24" fill="#0D291C">
                                        <path
                                            d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Sede y vehículos -->
                        <p
                            class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                            Sede y vehículos
                        </p>

                        <div class="flex flex-col gap-1">
                            <label
                                class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Sede
                                <span class="text-red-400">*</span></label>
                            <select v-model="fCrear.IdEstacionamiento" class="crear-select">
                                <option value="">Seleccionar sede</option>
                                <option v-for="s in sedes" :key="s.IdEstacionamiento"
                                    :value="Number(s.IdEstacionamiento)">{{ s.Nombre }}</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Placa
                                    1 <span class="text-red-400">*</span></label>
                                <div
                                    class="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#299261] focus-within:shadow-[0_0_0_3px_rgba(41,146,97,0.12)] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#9ca3af"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                                        <circle cx="7.5" cy="14.5" r="1.5" />
                                        <circle cx="16.5" cy="14.5" r="1.5" />
                                    </svg>
                                    <input v-model="fCrear.Placa1" type="text" maxlength="6" placeholder="ABC123"
                                        class="crear-placa-input"
                                        @input="fCrear.Placa1 = fCrear.Placa1.toUpperCase()" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Placa
                                    2</label>
                                <div
                                    class="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#299261] focus-within:shadow-[0_0_0_3px_rgba(41,146,97,0.12)] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#9ca3af"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                                        <circle cx="7.5" cy="14.5" r="1.5" />
                                        <circle cx="16.5" cy="14.5" r="1.5" />
                                    </svg>
                                    <input v-model="fCrear.Placa2" type="text" maxlength="6" placeholder="DEF456"
                                        class="crear-placa-input"
                                        @input="fCrear.Placa2 = fCrear.Placa2.toUpperCase()" />
                                </div>
                            </div>
                        </div>

                        <!-- Opciones -->
                        <p
                            class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                            Opciones
                        </p>

                        <div class="flex flex-wrap gap-x-5 gap-y-2.5">
                            <label
                                class="flex items-center gap-1.5 cursor-pointer text-[0.78rem] font-bold text-[#0D291C]">
                                <input type="checkbox" v-model="fCrear.Old"
                                    class="w-3.5 h-3.5 accent-[#299261] cursor-pointer" />
                                <span>Registro antiguo</span>
                            </label>
                            <label
                                class="flex items-center gap-1.5 cursor-pointer text-[0.78rem] font-bold text-[#0D291C]">
                                <input type="checkbox" v-model="fCrear.EstudianteUcc"
                                    class="w-3.5 h-3.5 accent-[#299261] cursor-pointer" />
                                <span>Estudiante UCC</span>
                            </label>
                            <label
                                class="flex items-center gap-1.5 cursor-pointer text-[0.78rem] font-bold text-[#0D291C]">
                                <input type="checkbox" v-model="fCrear.Estado"
                                    class="w-3.5 h-3.5 accent-[#299261] cursor-pointer" />
                                <span>Activo</span>
                            </label>
                        </div>

                        <template v-if="fCrear.Old">
                            <div class="grid grid-cols-2 gap-3">
                                <div class="flex flex-col gap-1">
                                    <label
                                        class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">ID
                                        Tarjeta <span class="text-red-400">*</span></label>
                                    <input v-model="fCrear.IdTarjeta" type="text" placeholder="ABD1214"
                                        class="crear-input" />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label
                                        class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">ID
                                        Autorización <span class="text-red-400">*</span></label>
                                    <input v-model.number="fCrear.IdAutorizacion" type="number" placeholder="123"
                                        class="crear-input" />
                                </div>
                            </div>
                        </template>

                        <div v-if="fCrear.EstudianteUcc" class="flex flex-col gap-1">
                            <label
                                class="text-[0.68rem] font-extrabold text-gray-500 uppercase tracking-[0.05em]">Código
                                estudiante UCC</label>
                            <input v-model="fCrear.CodigoEstudianteUCC" type="text" placeholder="765432"
                                class="crear-input" />
                        </div>

                        <div v-if="errCrear"
                            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.72rem] font-semibold text-red-600">
                            ⚠ {{ errCrear }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200 flex-shrink-0">
                        <button @click="modalCrearCliente = false"
                            class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            Cancelar
                        </button>
                        <button @click="crearClienteNuevo" :disabled="guardandoCrear"
                            class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <div v-if="guardandoCrear"
                                class="w-[13px] h-[13px] flex-shrink-0 border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin" />
                            {{ guardandoCrear ? 'Creando...' : 'Crear cliente' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ASIDE EDITAR CLIENTE -->
        <AsideEditar v-model="modalEditar" :titulo="`${fE.Nombres} ${fE.Apellidos}`.trim() || 'Cliente'"
            subtitulo="Editando información" label-guardar="Guardar cambios" :loading="guardandoE" :error="errEditar"
            @guardar="editarCliente" @update:modelValue="v => { if (!v) { modalEditar = false; errEditar = '' } }">
            <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                    <label
                        class="text-[0.72rem] font-extrabold text-gray-600 uppercase tracking-[0.05em] pl-0.5">Nombres
                        <span class="text-red-400">*</span></label>
                    <input v-model="fE.Nombres" type="text" placeholder="Jua..." class="aside-field-input" />
                </div>
                <div class="flex flex-col gap-1.5">
                    <label
                        class="text-[0.72rem] font-extrabold text-gray-600 uppercase tracking-[0.05em] pl-0.5">Apellidos
                        <span class="text-red-400">*</span></label>
                    <input v-model="fE.Apellidos" type="text" placeholder="Gar..." class="aside-field-input" />
                </div>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-[0.72rem] font-extrabold text-gray-600 uppercase tracking-[0.05em] pl-0.5">Correo
                    electrónico
                    <span class="text-red-400">*</span></label>
                <input v-model="fE.Email" type="email" placeholder="cor@..." class="aside-field-input" />
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-[0.72rem] font-extrabold text-gray-600 uppercase tracking-[0.05em] pl-0.5">Teléfono
                    <span class="text-red-400">*</span></label>
                <input v-model="fE.Telefono" type="text" placeholder="310..." class="aside-field-input"
                    @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" />
            </div>

            <div class="flex flex-col gap-2 pt-3 border-t border-gray-100">
                <div class="flex flex-col gap-[3px] px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span class="text-[0.6rem] font-black uppercase tracking-wide text-gray-400">Documento actual</span>
                    <span class="text-[1rem] font-black text-[#0D291C] font-mono tracking-widest">{{
                        clienteAccion?.Documento }}</span>
                </div>
                <p class="text-[0.65rem] font-black uppercase tracking-[0.08em] text-gray-400">Cambiar documento</p>
                <div class="flex flex-col gap-1.5">
                    <label class="text-[0.72rem] font-extrabold text-gray-600 uppercase tracking-[0.05em] pl-0.5">
                        Nuevo documento
                    </label>
                    <input v-model="fE.DocumentoNuevo" type="number" placeholder="1098..." class="aside-field-input"
                        @keypress="(e) => !/\d/.test(e.key) && e.preventDefault()" />
                </div>
                <div class="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#d97706" viewBox="0 0 24 24"
                        class="shrink-0 mt-[1px]">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    <span class="text-[0.68rem] font-semibold text-amber-800 leading-relaxed">
                        Solo completa este campo si deseas cambiar el documento. Se actualizará en todas las tablas.
                    </span>
                </div>
            </div>

        </AsideEditar>

        <!-- MODAL INHABILITAR / ACTIVAR -->
        <ModalInhabilitar v-model="modalEstado" :cliente="clienteAccion" @confirmar="cambiarEstado" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { showSuccess } from '@/utils/swal'
import ClientService from '@/api/services/client.service'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import ModalInhabilitar from '@/components/modals/ModalInhabilitar.vue'
import TablePaginacion from '@/components/shared/Paginacion.vue'

const { hasPermission } = useAuth()

// ── Estado ─────────────────────────────────────────────────────────
const clientes = ref([])
const sedes = ref([])
const loading = ref(true)
const busqueda = ref('')
const busquedaDebounced = ref('')
const filtroSede = ref('')
const filtroEstado = ref('')
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalRegistros = ref(0)
const limit = ref(10)

// Modales
const modalNuevo = ref(false)
const modalEditar = ref(false)
const modalEstado = ref(false)
const clienteAccion = ref(null)
const verPass = ref(false)

// Guardado
const guardandoN = ref(false)
const guardandoE = ref(false)
const errNuevo = ref('')
const errEditar = ref('')

// ── Formularios ────────────────────────────────────────────────────
const fN = reactive({
    Documento: '', IdEstacionamiento: '', Nombres: '', Apellidos: '',
    Telefono: '', Email: '', Password: '', IdAutorizacion: null,
    FechaInicio: '', FechaFin: '', Estado: true, EstudianteUcc: false,
    CodigoEstudianteUCC: '', Old: false, Sincronizacion: false,
    placas: [''],
})

const fE = reactive({
    Nombres: '', Apellidos: '', Email: '', Telefono: '', Estado: true,
    DocumentoNuevo: '',
})

// ── Computed ───────────────────────────────────────────────────────
const listaClientes = computed(() => {
    const raw = Array.isArray(clientes.value) ? clientes.value : (clientes.value?.data ?? [])
    const raw2 = busquedaDebounced.value?.trim()
    if (!raw2) return raw
    if (raw2.startsWith('#')) {
        const id = raw2.slice(1)
        return raw.filter(c => c.tPersonasAutorizadas?.some(p => String(p.IdPersonaAutorizada).includes(id)))
    }
    const ql = raw2.toLowerCase()
    return raw.filter(c =>
        String(c.Documento).toLowerCase().includes(ql) ||
        `${c.Nombres} ${c.Apellidos}`.toLowerCase().includes(ql)
    )
})


// ── Helpers ────────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre ? nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '??'

// ── Carga ──────────────────────────────────────────────────────────
const cargarClientes = async () => {
    loading.value = true
    const buscarPorId = busquedaDebounced.value?.trim().startsWith('#')
    try {
        const params = {
            page: buscarPorId ? 1 : paginaActual.value,
            limit: buscarPorId ? 9999 : limit.value,
            ...(filtroSede.value && { sede: filtroSede.value }),
            ...(!buscarPorId && busquedaDebounced.value && { search: busquedaDebounced.value }),
        }

        // Si hay filtro de estado, traemos todo para filtrar localmente
        if (filtroEstado.value !== '') {
            const resAll = await ClientService.getAllClients({
                ...params,
                page: 1,
                limit: 9999,
            })
            const todos = resAll?.data ?? (Array.isArray(resAll) ? resAll : [])
            const filtrados = todos.filter(c => String(c.Estado) === filtroEstado.value)

            totalRegistros.value = filtrados.length
            totalPaginas.value = Math.max(1, Math.ceil(filtrados.length / limit.value))

            const desde = (paginaActual.value - 1) * limit.value
            clientes.value = filtrados.slice(desde, desde + limit.value)
            return
        }

        // Sin filtro de estado → paginación normal del backend
        const res = await ClientService.getAllClients(params)
        const todos = res?.data ?? (Array.isArray(res) ? res : [])
        clientes.value = todos
        totalRegistros.value = res?.total ?? res?.count ?? todos.length
        totalPaginas.value = res?.totalPages ?? res?.pages ??
            Math.max(1, Math.ceil(totalRegistros.value / limit.value))

    } catch (e) {
        console.error('[Clientes]', e.response?.data ?? e.message)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await Promise.all([
        cargarClientes(),
        SedesService.getAll().then(r => { sedes.value = Array.isArray(r) ? r : (r?.data ?? []) }),
    ])
})

// ── Paginación ─────────────────────────────────────────────────────
const irPagina = (p) => {
    if (p < 1 || p > totalPaginas.value) return
    paginaActual.value = p
    cargarClientes()
}

const onLimitChange = (val) => {
    limit.value = val
    paginaActual.value = 1
    cargarClientes()
}

// ── Debounce búsqueda ──────────────────────────────────────────────
let debTimer = null
watch(busqueda, val => {
    clearTimeout(debTimer)
    debTimer = setTimeout(() => {
        busquedaDebounced.value = val
        paginaActual.value = 1
        cargarClientes()
    }, 300)
})


// ── Limpiar filtros ────────────────────────────────────────────────
const limpiarFiltros = () => {
    busqueda.value = ''
    busquedaDebounced.value = ''
    filtroSede.value = ''
    filtroEstado.value = ''
    paginaActual.value = 1
    cargarClientes()
}


// ── Crear cliente ─────────────────────────────────────────────────
const modalCrearCliente = ref(false)
const guardandoCrear = ref(false)
const errCrear = ref('')
const verPassCrear = ref(false)
const fCrear = ref({
    Documento: '', Nombres: '', Apellidos: '', Email: '', Telefono: '',
    Password: '', IdEstacionamiento: '', Placa1: '', Placa2: '',
    Old: false, Estado: true, IdTarjeta: '', IdAutorizacion: null,
    EstudianteUcc: false, CodigoEstudianteUCC: '',
})

const abrirCrearCliente = () => {
    errCrear.value = ''
    verPassCrear.value = false
    fCrear.value = {
        Documento: '', Nombres: '', Apellidos: '', Email: '', Telefono: '',
        Password: '', IdEstacionamiento: '', Placa1: '', Placa2: '',
        Old: false, Estado: true, IdTarjeta: '', IdAutorizacion: null,
        EstudianteUcc: false, CodigoEstudianteUCC: '',
    }
    modalCrearCliente.value = true
}

const crearClienteNuevo = async () => {
    errCrear.value = ''
    const f = fCrear.value
    if (!f.Documento || !f.Nombres || !f.Apellidos || !f.Email || !f.Telefono || !f.Password || !f.IdEstacionamiento || !f.Placa1) {
        errCrear.value = 'Completa todos los campos obligatorios (*).'
        return
    }
    if (f.Old && (!f.IdTarjeta || !f.IdAutorizacion)) {
        errCrear.value = 'IdTarjeta e IdAutorizacion son requeridos en modo Registro antiguo.'
        return
    }
    guardandoCrear.value = true
    try {
        await ClientService.createClient({
            Documento: f.Documento,
            Nombres: f.Nombres,
            Apellidos: f.Apellidos,
            Email: f.Email,
            Telefono: f.Telefono,
            Password: f.Password,
            IdEstacionamiento: Number(f.IdEstacionamiento),
            Placa1: f.Placa1 || null,
            Placa2: f.Placa2 || null,
            Old: f.Old,
            Estado: f.Estado,
            ...(f.Old && { IdTarjeta: f.IdTarjeta, IdAutorizacion: f.IdAutorizacion }),
            EstudianteUcc: f.EstudianteUcc,
            ...(f.EstudianteUcc && { CodigoEstudianteUCC: f.CodigoEstudianteUCC }),
        })
        modalCrearCliente.value = false
        showSuccess('¡Cliente registrado!', 'El cliente ha sido creado exitosamente.')
    } catch (e) {
        const msg = e?.response?.data?.message
        errCrear.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al crear el cliente.')
    } finally {
        guardandoCrear.value = false
    }
}
// ── Modal Editar ───────────────────────────────────────────────────

const abrirEditar = (c) => {
    clienteAccion.value = c
    Object.assign(fE, {
        Nombres: c.Nombres ?? '',
        Apellidos: c.Apellidos ?? '',
        Email: c.Email ?? '',
        Telefono: String(c.Telefono ?? ''),
        Estado: c.Estado ?? true,
        DocumentoNuevo: '',  // ← siempre vacío al abrir
    })
    errEditar.value = ''
    modalEditar.value = true
}

const editarCliente = async () => {
    errEditar.value = ''
    if (!fE.Nombres || !fE.Apellidos || !fE.Email || !fE.Telefono) {
        errEditar.value = 'Nombres, Apellidos, Email y Teléfono son obligatorios.'; return
    }
    if (fE.DocumentoNuevo && String(fE.DocumentoNuevo) === String(clienteAccion.value?.Documento)) {
        errEditar.value = 'El nuevo documento debe ser diferente al actual.'; return
    }

    guardandoE.value = true
    try {
        const doc = clienteAccion.value?.Documento

        // ── 1. Editar datos básicos ──
        await ClientService.updateClientByDoc(doc, {
            Nombres: fE.Nombres,
            Apellidos: fE.Apellidos,
            Email: fE.Email,
            Telefono: fE.Telefono,
            Estado: fE.Estado,
        })

        // ── 2. Cambiar documento si se indicó ──
        if (fE.DocumentoNuevo) {
            await ClientService.updateDocClientByDoc({
                DocumentoActual: Number(doc),
                DocumentoNuevo: Number(fE.DocumentoNuevo),
            })
            // actualizar local con nuevo documento
            const idx = clientes.value.findIndex(c => c.Documento === doc)
            if (idx !== -1) {
                clientes.value[idx] = {
                    ...clientes.value[idx],
                    ...fE,
                    Documento: String(fE.DocumentoNuevo),
                }
            }
        } else {
            const idx = clientes.value.findIndex(c => c.Documento === doc)
            if (idx !== -1) clientes.value[idx] = { ...clientes.value[idx], ...fE }
        }

        modalEditar.value = false
    } catch (e) {
        const status = e.response?.status
        const msg = e.response?.data?.message
        if (status === 409) errEditar.value = 'El nuevo documento ya existe en el sistema.'
        else if (status === 404) errEditar.value = 'Cliente no encontrado.'
        else errEditar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al editar el cliente.')
    } finally {
        guardandoE.value = false
    }
}

// ── Modal Cambio de Estado ─────────────────────────────────────────
const abrirCambioEstado = (c) => {
    clienteAccion.value = c
    modalEstado.value = true
}

const cambiarEstado = async ({ nuevoEstado }) => {
    try {
        const doc = clienteAccion.value?.Documento
        await ClientService.updateClientEstado(doc, nuevoEstado)
        const idx = listaClientes.value.findIndex(c => c.Documento === doc)
        if (idx !== -1) listaClientes.value[idx].Estado = nuevoEstado
        modalEstado.value = false
    } catch (e) {
        console.error('[cambiarEstado]', e.response?.data ?? e.message)
    }
}
</script>

<style scoped>
/* ── Reset global inputs/selects ── */
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

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}



/* ── field-input modal nuevo (sobreescribe reset) ── */
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

.placa-input {
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    font-weight: 700 !important;
}

.check {
    accent-color: #0D291C;
    width: 14px !important;
    height: 14px !important;
    cursor: pointer;
    border-radius: 4px !important;
    border: 1.5px solid #0D291C !important;
    padding: 0 !important;
    background-color: transparent !important;
}

/* ── aside-field-input (sobreescribe reset) ── */
.aside-field-input {
    border: 2px solid #d1d5db !important;
    border-radius: 0.75rem !important;
    padding: 0.625rem 0.75rem !important;
    font-size: 0.88rem !important;
    color: #0D291C !important;
    outline: none !important;
    width: 100%;
    box-sizing: border-box;
    background-color: white !important;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.aside-field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15) !important;
}

/* ── Botones modal ── */
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


.modal-body {
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.2) transparent;
}

.modal-body::-webkit-scrollbar {
    width: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.2);
    border-radius: 99px;
}

/* ── Transición modal ── */
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
}

/* ── inputs / select del modal crear cliente (sobreescribe reset) ── */
.crear-input {
    background-color: white !important;
    border: 2px solid #e5e7eb !important;
    border-radius: 12px !important;
    padding: 8px 12px !important;
    font-size: 0.82rem !important;
    font-weight: 600 !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}

.crear-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12) !important;
}

.crear-select {
    background-color: white !important;
    border: 2px solid #e5e7eb !important;
    border-radius: 12px !important;
    padding: 8px 12px !important;
    font-size: 0.82rem !important;
    font-weight: 600 !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
}

.crear-select:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.12) !important;
}

.crear-placa-input {
    background-color: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    font-family: 'Courier New', monospace !important;
    font-weight: 900 !important;
    font-size: 0.9rem !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    min-width: 0;
}
</style>