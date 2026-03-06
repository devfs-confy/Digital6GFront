<template>
    <div class="h-full flex flex-col gap-4">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <div class="w-16 sm:w-20"></div>
            <h2 class="text-lg sm:text-2xl font-bold text-[#232B3A]">Usuarios</h2>
            <div class="flex items-center gap-2">
                <button @click="abrirCrear"
                    class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                    style="box-shadow: #595858 0px 2px 0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    <span class="hidden sm:inline">Nuevo</span>
                </button>
                <div
                    class="flex items-center bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full border border-black shadow-[0_2px_0_#595858]">
                    <button @click="$router.back()">Volver</button>
                </div>
            </div>
        </div>

        <!-- Layout -->
        <div class="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">

            <!-- ── Tabla ── -->
            <div class="flex flex-col gap-3 flex-1 min-w-0">

                <!-- Buscador -->
                <div class="bg-white rounded-2xl px-4 py-3 flex gap-2 items-center flex-shrink-0 shadow-sm">
                    <input v-model="busqueda" type="text" placeholder="Buscar nombre o documento..."
                        class="flex-1 min-w-0 bg-[#EAEAEA] border-2 border-[#299261] rounded-full px-4 py-2 text-sm text-[#232B3A] outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all" />
                    <button v-if="busqueda" @click="busqueda = ''"
                        class="text-xs font-bold text-gray-500 border border-gray-200 rounded-full px-3 py-2 hover:border-[#299261] hover:text-[#299261] transition-colors whitespace-nowrap flex-shrink-0">
                        ✕
                    </button>
                </div>

                <!-- Tabla + paginación -->
                <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
                    <div class="overflow-x-auto flex-1 scrollbar-thin">
                        <table class="w-full border-collapse" style="min-width:300px">
                            <thead>
                                <tr>
                                    <th
                                        class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344]">
                                        Usuario
                                    </th>
                                    <th
                                        class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden sm:table-cell">
                                        Documento
                                    </th>
                                    <th
                                        class="px-3 sm:px-4 py-3 text-center text-[0.65rem] font-black uppercase tracking-widest text-[white] bg-[#0D291C] border-b-[3px] border-[#7FD344]">
                                        Opciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Loading -->
                                <tr v-if="loading">
                                    <td colspan="3" class="py-16 text-center">
                                        <div class="flex flex-col items-center gap-3">
                                            <div class="loader" />
                                            <span class="text-sm text-gray-400 font-semibold">Cargando
                                                usuarios...</span>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Vacío -->
                                <tr v-else-if="usuariosPaginados.length === 0">
                                    <td colspan="3" class="py-16 text-center text-gray-300">
                                        <div class="flex flex-col items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                            </svg>
                                            <span class="text-sm font-medium">No se encontraron usuarios</span>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Filas -->
                                <tr v-for="u in usuariosPaginados" :key="u.Documento"
                                    class="border-b border-[#e8f5e9] transition-colors last:border-0"
                                    :class="usuarioSeleccionado?.Documento === u.Documento ? 'bg-[#f0faf4]' : 'hover:bg-[#f0faf4]'">

                                    <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                                        <div class="flex items-center gap-2 sm:gap-3">
                                            <div
                                                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-xs border-2 border-[#e8f5e9] flex-shrink-0">
                                                {{ iniciales(u.Nombres) }}
                                            </div>
                                            <div class="flex flex-col min-w-0">
                                                <span
                                                    class="font-semibold text-start text-[#0D291C] truncate text-sm leading-tight">
                                                    {{ u.Nombres }} {{ u.Apellidos }}
                                                </span>
                                                <span class="text-xs text-start text-gray-400 font-mono sm:hidden">{{
                                                    u.Documento }}</span>
                                                <span
                                                    class="text-xs text-start text-gray-400 truncate hidden sm:block">{{
                                                        u.Email }}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td
                                        class="px-3 sm:px-4 py-3 text-sm tracking-wide text-gray-600 whitespace-nowrap hidden sm:table-cell">
                                        {{ u.Documento }}
                                    </td>

                                    <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                                        <div class="flex items-center justify-center gap-2">
                                            <!-- Editar info -->
                                            <button @click="abrirEditar(u)"
                                                class="w-8 h-8 sm:w-8 sm:h-8 rounded-[10px] flex items-center justify-center border-none cursor-pointer transition-all bg-transparent hover:bg-[#e8f5e9]"
                                                title="Editar información" v-html="editarcliente" />
                                            <!-- Permisos -->
                                            <button @click="seleccionarUsuario(u)"
                                                class="w-8 h-8 sm:w-8 sm:h-8 rounded-[10px] flex items-center justify-center border-none cursor-pointer transition-all"
                                                :class="usuarioSeleccionado?.Documento === u.Documento ? '' : 'bg-transparent hover:bg-[#e8f5e9]'"
                                                title="Gestionar permisos" v-html="dashboard_customize" />
                                            <!-- Inhabilitar -->
                                            <button @click="darDeBaja(u)"
                                                class="w-8 h-8 sm:w-8 sm:h-8 rounded-[10px] flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-red-100 transition-all"
                                                title="Inhabilitar" v-html="account_circle_off" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Paginación -->
                    <TablePagination :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                        :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
                </div>
            </div>

            <!-- Overlay móvil permisos -->
            <Transition name="overlay">
                <div v-if="usuarioSeleccionado" class="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    @click="usuarioSeleccionado = null" />
            </Transition>

            <!-- Panel permisos (sin cambios) -->
            <Transition name="panel">
                <div v-if="usuarioSeleccionado" class="
                        fixed bottom-0 left-0 right-0 z-50
                        lg:static lg:z-auto
                        lg:w-[400px] lg:flex-shrink-0
                        bg-white rounded-t-3xl lg:rounded-3xl
                        border-2 border-[#0D291C]
                        flex flex-col overflow-hidden
                        lg:max-h-full panel-mobile-height
                    " style="box-shadow: 0 -4px 0 #000">
                    <!-- Cabecera -->
                    <div class="flex items-center justify-between gap-3 px-4 py-3 bg-[#0D291C] flex-shrink-0">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 bg-[#7FD344] text-[#0D291C] flex items-center justify-center font-black text-xs">
                                {{ iniciales(usuarioSeleccionado.Nombres) }}
                            </div>
                            <div class="min-w-0">
                                <p class="text-sm font-bold text-white truncate">
                                    {{ usuarioSeleccionado.Nombres }} {{ usuarioSeleccionado.Apellidos }}
                                </p>
                                <p class="text-[0.6rem] text-white/50 font-semibold truncate mt-0.5">
                                    {{ usuarioSeleccionado.T_UsuarioRol?.[0]?.T_Roles?.Nombre ?? 'Sin rol' }}
                                    · {{ usuarioSeleccionado.Email }}
                                </p>
                            </div>
                        </div>
                        <button @click="usuarioSeleccionado = null"
                            class="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 border-none cursor-pointer text-white hover:bg-white/20 transition-colors flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Toolbar permisos -->
                    <div class="flex items-center gap-2 px-3 pt-3 pb-0 bg-[#f8faf9] flex-shrink-0">
                        <div
                            class="flex items-center gap-2 flex-    1 min-w-0 bg-white border border-gray-200 rounded-full px-3 py-1.5 focus-within:border-[#299261] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#9ca3af"
                                viewBox="0 0 24 24">
                                <path
                                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                            <input v-model="busquedaPerm" type="text" placeholder="Buscar permiso..."
                                class="flex-1 min-w-0 text-xs text-gray-700 bg-transparent border-none outline-none" />
                            <button v-if="busquedaPerm" @click="busquedaPerm = ''"
                                class="text-[0.6rem] font-black text-gray-400 hover:text-red-500 bg-none border-none cursor-pointer">✕</button>
                        </div>
                        <button @click="selectAll"
                            class="text-[0.65rem] font-black px-2.5 py-1.5 rounded-full border cursor-pointer bg-green-50 text-green-700 border-green-200 hover:bg-green-100 whitespace-nowrap flex-shrink-0">
                            Todos
                        </button>
                        <button @click="clearAll"
                            class="text-[0.65rem] font-black px-2.5 py-1.5 rounded-full border cursor-pointer bg-red-50 text-red-600 border-red-200 hover:bg-red-100 whitespace-nowrap flex-shrink-0">
                            Ninguno
                        </button>
                    </div>

                    <!-- Contador -->
                    <div
                        class="flex items-center gap-3 px-3 py-2 bg-[#f8faf9] border-b-2 border-gray-100 flex-shrink-0">
                        <span
                            class="text-[0.65rem] font-bold text-[#0D291C] bg-[#f0faf4] border border-[#c8e6c9] rounded-full px-3 py-0.5 whitespace-nowrap">
                            <span class="font-black text-[#299261]">{{ seleccionados.size }}</span> / {{ totalPermisos
                            }} activos
                        </span>
                        <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-300"
                                style="background: linear-gradient(90deg, #299261, #7FD344)"
                                :style="{ width: `${(seleccionados.size / totalPermisos) * 100}%` }" />
                        </div>
                    </div>

                    <!-- Grid permisos -->
                    <div
                        class="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start bg-[#f8faf9] scrollbar-thin">
                        <div v-if="loadingPermisos"
                            class="col-span-full flex flex-col items-center justify-center py-10 gap-3">
                            <div class="loader" />
                            <span class="text-xs text-gray-400 font-semibold">Cargando permisos...</span>
                        </div>
                        <div v-else-if="gruposFiltrados.length === 0"
                            class="col-span-full text-center py-8 text-gray-400 text-sm font-semibold">
                            Sin resultados para "<strong>{{ busquedaPerm }}</strong>"
                        </div>
                        <template v-if="!loadingPermisos">
                            <div v-for="grupo in gruposFiltrados" :key="grupo.label"
                                class="bg-white rounded-2xl border-2 flex flex-col transition-all"
                                :class="countActivos(grupo) > 0 ? 'border-[#c8e6c9] shadow-[0_1px_0_#a5d6a7]' : 'border-gray-100 shadow-[0_1px_0_#e8ede9]'">
                                <div class="flex items-center justify-between gap-1 px-2.5 py-2 rounded-t-2xl border-b"
                                    :class="countActivos(grupo) > 0 ? 'bg-[#f0faf4] border-[#d7eeda]' : 'bg-gray-50 border-gray-100'">
                                    <span class="text-[0.72rem] font-black text-[#0D291C] truncate">{{ grupo.label
                                        }}</span>
                                    <div class="flex items-center gap-1.5 flex-shrink-0">
                                        <span class="text-[0.6rem] font-black rounded-full px-1.5 py-0.5"
                                            :class="countActivos(grupo) > 0 ? 'bg-[#0D291C] text-[#7FD344]' : 'bg-gray-200 text-gray-400'">
                                            {{ countActivos(grupo) }}/{{ grupo.permisos.length }}
                                        </span>
                                        <button @click="toggleGrupoPermisos(grupo)"
                                            class="text-[0.6rem] font-black rounded-full px-2 py-0.5 border cursor-pointer hover:opacity-80 transition-opacity"
                                            :class="countActivos(grupo) === grupo.permisos.length ? 'bg-red-50 text-red-600 border-red-200' : 'bg-[#e8f5e9] text-[#299261] border-[#a5d6a7]'">
                                            {{ countActivos(grupo) === grupo.permisos.length ? 'Quitar' : 'Todos' }}
                                        </button>
                                    </div>
                                </div>
                                <div class="p-1.5 flex flex-col gap-0.5">
                                    <div v-for="perm in grupo.permisos" :key="perm.value"
                                        class="flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-lg cursor-pointer select-none transition-colors"
                                        :class="isSelected(perm.value) ? 'bg-[#f0faf4]' : 'hover:bg-[#f0faf4]'"
                                        @click="togglePerm(perm.value)">
                                        <div class="w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center border-2 transition-all"
                                            :class="isSelected(perm.value) ? 'bg-[#0D291C] border-[#0D291C]' : 'bg-white border-gray-300'">
                                            <svg v-if="isSelected(perm.value)" xmlns="http://www.w3.org/2000/svg"
                                                width="9" height="9" fill="white" viewBox="0 0 24 24">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                            </svg>
                                        </div>
                                        <span class="text-[0.75rem] flex-1"
                                            :class="isSelected(perm.value) ? 'font-bold text-[#0D291C]' : 'font-semibold text-gray-500'">
                                            {{ perm.label }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Pie permisos -->
                    <div class="flex gap-2 px-3 pb-4 pt-3 border-t-2 border-gray-100 bg-white flex-shrink-0">
                        <button @click="usuarioSeleccionado = null"
                            class="flex-1 py-3 rounded-full text-xs font-black uppercase tracking-wide cursor-pointer bg-white text-[#232B3A] border-2 border-black hover:bg-gray-50 transition-colors"
                            style="box-shadow: 0 3px 0 #000">
                            Cancelar
                        </button>
                        <button @click="guardarPermisos"
                            class="flex-[2] py-3 rounded-full text-xs font-black uppercase tracking-wide cursor-pointer bg-[#0D291C] text-white border-2 border-black flex items-center justify-center gap-2 hover:bg-[#132e21] transition-colors"
                            style="box-shadow: 0 3px 0 #000">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                            </svg>
                            Guardar permisos
                        </button>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- ── Panel crear/editar usuario ───────────────────────── -->

        <AsideEditar v-model="panelUsuario"
            :titulo="modoPanel === 'crear' ? 'Nuevo usuario' : (formUsuario.Nombres + ' ' + formUsuario.Apellidos).trim()"
            :subtitulo="modoPanel === 'crear' ? 'Completa los campos requeridos' : 'Doc. ' + formUsuario.Documento"
            :label-guardar="modoPanel === 'crear' ? 'Crear usuario' : 'Guardar cambios'" :loading="guardandoUsuario"
            :error="errPanelUsuario" @guardar="guardarUsuario" @update:modelValue="cerrarPanelUsuario">

            <!-- Nombres + Apellidos -->
            <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                    <label class="field-label">Nombres <span class="text-red-400">*</span></label>
                    <input v-model="formUsuario.Nombres" type="text" class="field-input" placeholder="" />
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="field-label">Apellidos <span class="text-red-400">*</span></label>
                    <input v-model="formUsuario.Apellidos" type="text" class="field-input" placeholder="" />
                </div>
            </div>

            <!-- Documento -->
            <div class="flex flex-col gap-1.5">
                <label class="field-label">Documento <span class="text-red-400">*</span></label>
                <input v-model.number="formUsuario.Documento" type="number" class="field-input"
                    :disabled="modoPanel === 'editar'"
                    :class="modoPanel === 'editar' ? 'opacity-50 cursor-not-allowed' : ''" placeholder="" />
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1.5">
                <label class="field-label">Email <span class="text-red-400">*</span></label>
                <input v-model="formUsuario.Email" type="email" class="field-input" placeholder="" />
            </div>

            <!-- Teléfono -->
            <div class="flex flex-col gap-1.5">
                <label class="field-label">Teléfono <span class="text-red-400">*</span></label>
                <input v-model="formUsuario.Telefono" type="text" class="field-input" maxlength="15" placeholder="" />
            </div>

            <!-- Rol -->
            <div class="flex flex-col gap-1.5">
                <label class="field-label">Rol <span class="text-red-400">*</span></label>
                <select v-model.number="formUsuario.IdRol" class="field-input field-select">
                    <option value="" disabled>Seleccionar rol...</option>
                    <option v-for="r in roles" :key="r.Id ?? r.id" :value="r.Id ?? r.id">
                        {{ r.Nombre ?? r.nombre }}
                    </option>
                </select>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1.5">
                <label class="field-label">
                    Contraseña
                    <span v-if="modoPanel === 'crear'" class="text-red-400">*</span>
                    <span v-else class="text-[0.65rem] text-gray-400 font-normal normal-case ml-1">(vacío = no
                        cambia)</span>
                </label>
                <div class="relative flex items-center">
                    <input v-model="formUsuario.Password" :type="mostrarPassword ? 'text' : 'password'"
                        class="field-input pr-10" maxlength="15" placeholder="" />
                    <button type="button" @click="mostrarPassword = !mostrarPassword"
                        class="absolute right-2.5 bg-transparent border-none cursor-pointer p-1 flex items-center [&>svg]:fill-gray-400 hover:[&>svg]:fill-[#299261]">
                        <svg v-if="!mostrarPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Estado (solo edición) -->
            <!-- <div v-if="modoPanel === 'editar'">
                <label
                    class="flex items-center gap-3 cursor-pointer select-none p-3.5 bg-white rounded-xl border-2 transition-all"
                    :class="formUsuario.Estado ? 'border-[#299261]' : 'border-red-300'">
                    <div class="relative flex-shrink-0">
                        <input type="checkbox" v-model="formUsuario.Estado" class="sr-only" />
                        <div class="w-11 h-6 rounded-full transition-colors duration-200"
                            :class="formUsuario.Estado ? 'bg-[#299261]' : 'bg-red-400'">
                            <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                :class="formUsuario.Estado ? 'translate-x-5' : 'translate-x-0'" />
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[0.78rem] font-black"
                            :class="formUsuario.Estado ? 'text-[#299261]' : 'text-red-500'">
                            {{ formUsuario.Estado ? '● Activo' : '● Inactivo' }}
                        </span>
                        <span class="text-[0.65rem] text-gray-400 font-medium">Estado del usuario</span>
                    </div>
                </label>
            </div> -->

        </AsideEditar>

        <!-- Modal inhabilitar -->
        <ModalInhabilitar v-model="modalInhabilitar" :cliente="clienteAccion" @confirmar="inhabilitarCliente" />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import ModalInhabilitar from '@/components/modals/ModalInhabilitar.vue'
import dashboard_customize from '@/assets/img/dashboard_customize.svg?raw'
import account_circle_off from '@/assets/img/account_circle_off.svg?raw'
import editarcliente from '@/assets/img/person_edit.svg?raw'
import adminServices from '@/api/services/admin.service'
import RolService from '@/api/services/rol.service'
import { PERMS } from '@/constants/permisions'
import TablePagination from '@/components/shared/Paginacion.vue'

// ── Catálogo de permisos ───────────────────────────────────────────
const LABEL_MAP = {
    [PERMS.USUARIOS_VER]: 'Ver usuarios',
    [PERMS.USUARIOS_CREAR]: 'Crear usuarios',
    [PERMS.USUARIOS_EDITAR]: 'Editar usuarios',
    [PERMS.USUARIOS_INACTIVAR]: 'Inactivar usuarios',
    [PERMS.ROLES_VER]: 'Ver roles',
    [PERMS.ROLES_CREAR]: 'Crear roles',
    [PERMS.ROLES_EDITAR]: 'Editar roles',
    [PERMS.PERMISOS_VER]: 'Ver permisos',
    [PERMS.PERMISOS_ASIGNAR]: 'Asignar permisos',
    [PERMS.PERMISOS_INACTIVAR]: 'Inactivar permisos',
    [PERMS.MENSUALIDADES_VER]: 'Ver mensualidades',
    [PERMS.MENSUALIDADES_CREAR]: 'Crear mensualidades',
    [PERMS.MENSUALIDADES_EDITAR]: 'Editar mensualidades',
    [PERMS.MENSUALIDADES_INACTIVAR]: 'Inactivar mensualidades',
    [PERMS.SEDES_VER]: 'Ver sedes',
    [PERMS.SEDES_CREAR]: 'Crear sedes',
    [PERMS.SEDES_EDITAR]: 'Editar sedes',
    [PERMS.SEDES_INACTIVAR]: 'Inactivar sedes',
    [PERMS.CODIGOS_CREAR]: 'Crear códigos',
    [PERMS.AUTORIZACIONES_VER]: 'Ver autorizaciones',
}

const GRUPOS = [
    { label: 'Usuarios', permisos: [PERMS.USUARIOS_VER, PERMS.USUARIOS_CREAR, PERMS.USUARIOS_EDITAR, PERMS.USUARIOS_INACTIVAR] },
    { label: 'Roles', permisos: [PERMS.ROLES_VER, PERMS.ROLES_CREAR, PERMS.ROLES_EDITAR] },
    { label: 'Permisos', permisos: [PERMS.PERMISOS_VER, PERMS.PERMISOS_ASIGNAR, PERMS.PERMISOS_INACTIVAR] },
    { label: 'Mensualidades', permisos: [PERMS.MENSUALIDADES_VER, PERMS.MENSUALIDADES_CREAR, PERMS.MENSUALIDADES_EDITAR, PERMS.MENSUALIDADES_INACTIVAR] },
    { label: 'Sedes', permisos: [PERMS.SEDES_VER, PERMS.SEDES_CREAR, PERMS.SEDES_EDITAR, PERMS.SEDES_INACTIVAR] },
    { label: 'Códigos', permisos: [PERMS.CODIGOS_CREAR, PERMS.AUTORIZACIONES_VER] },
].map(g => ({ ...g, permisos: g.permisos.map(n => ({ value: n, label: LABEL_MAP[n] ?? n })) }))

const totalPermisos = GRUPOS.reduce((acc, g) => acc + g.permisos.length, 0)

// ── Estado ─────────────────────────────────────────────────────────
const loading = ref(false)
const usuarios = ref([])
const roles = ref([])
const permisosDisponibles = ref([])

// Tabla / paginación local
const busqueda = ref('')
const busquedaDebounced = ref('')
const paginaActual = ref(1)
const limit = ref(10)

// Panel permisos
const usuarioSeleccionado = ref(null)
const busquedaPerm = ref('')
const seleccionados = ref(new Set())
const loadingPermisos = ref(false)

// Panel crear/editar
const panelUsuario = ref(false)
const modoPanel = ref('crear')
const guardandoUsuario = ref(false)
const errPanelUsuario = ref('')
const mostrarPassword = ref(false)
const formUsuario = ref({
    Documento: null, Nombres: '', Apellidos: '',
    Email: '', Telefono: '', IdRol: '', Password: '', Estado: true,
})

// Modal inhabilitar
const modalInhabilitar = ref(false)
const clienteAccion = ref({})

// ── Mount ──────────────────────────────────────────────────────────
onMounted(async () => {
    loading.value = true
    try {
        const [resU, resP, resR] = await Promise.all([
            adminServices.getAllAdmins(),
            RolService.getAllPermisos(),
            RolService.getAll(),
        ])
        usuarios.value = resU?.data ?? resU ?? []
        permisosDisponibles.value = resP?.data ?? resP ?? []
        roles.value = resR?.data ?? resR ?? []
    } catch (e) {
        console.error('[Usuarios] mount:', e)
    } finally {
        loading.value = false
    }
})

// ── Tabla / paginación ─────────────────────────────────────────────
let debounceTimer = null
watch(busqueda, val => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => { busquedaDebounced.value = val; paginaActual.value = 1 }, 300)
})

const usuariosFiltrados = computed(() => {
    const q = busquedaDebounced.value.toLowerCase()
    if (!q) return usuarios.value
    return usuarios.value.filter(u =>
        u.Nombres?.toLowerCase().includes(q) ||
        u.Apellidos?.toLowerCase().includes(q) ||
        u.Documento?.toString().includes(q)
    )
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(usuariosFiltrados.value.length / limit.value)))
const totalRegistros = computed(() => usuariosFiltrados.value.length)
const usuariosPaginados = computed(() => {
    const ini = (paginaActual.value - 1) * limit.value
    return usuariosFiltrados.value.slice(ini, ini + limit.value)
})

const irPagina = p => { if (p >= 1 && p <= totalPaginas.value) paginaActual.value = p }
const onLimitChange = val => { limit.value = Number(val); paginaActual.value = 1 }

// ── Panel crear/editar ─────────────────────────────────────────────
const abrirCrear = () => {
    modoPanel.value = 'crear'
    mostrarPassword.value = false
    errPanelUsuario.value = ''
    formUsuario.value = { Documento: null, Nombres: '', Apellidos: '', Email: '', Telefono: '', IdRol: '', Password: '', Estado: true }
    panelUsuario.value = true
}

const abrirEditar = (u) => {
    modoPanel.value = 'editar'
    mostrarPassword.value = false
    errPanelUsuario.value = ''
    formUsuario.value = {
        Documento: u.Documento,
        Nombres: u.Nombres ?? '',
        Apellidos: u.Apellidos ?? '',
        Email: u.Email ?? '',
        Telefono: u.Telefono ?? '',
        IdRol: u.T_UsuarioRol?.[0]?.IdRol ?? '',
        Password: '',
        Estado: u.Estado ?? true,
    }
    panelUsuario.value = true
}

const cerrarPanelUsuario = () => {
    panelUsuario.value = false
    errPanelUsuario.value = ''
    guardandoUsuario.value = false
}

const guardarUsuario = async () => {
    errPanelUsuario.value = ''
    const f = formUsuario.value

    if (!f.Nombres || !f.Apellidos || !f.Email || !f.Telefono || !f.IdRol) {
        errPanelUsuario.value = 'Completa todos los campos obligatorios.'; return
    }
    if (modoPanel.value === 'crear' && (!f.Documento || !f.Password)) {
        errPanelUsuario.value = 'Documento y contraseña son obligatorios al crear.'; return
    }

    guardandoUsuario.value = true
    try {
        if (modoPanel.value === 'crear') {
            const nueva = await adminServices.createAdmin({ ...f })
            usuarios.value.unshift(nueva?.data ?? nueva)
        } else {
            const dto = { Nombres: f.Nombres, Apellidos: f.Apellidos, Email: f.Email, Telefono: f.Telefono, IdRol: f.IdRol, Estado: f.Estado }
            if (f.Password) dto.Password = f.Password
            await adminServices.updateAdmin(f.Documento, dto)
            const idx = usuarios.value.findIndex(u => u.Documento === f.Documento)
            if (idx !== -1) usuarios.value[idx] = { ...usuarios.value[idx], ...dto }
        }
        cerrarPanelUsuario()
    } catch (e) {
        const msg = e.response?.data?.message
        errPanelUsuario.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar.')
    } finally {
        guardandoUsuario.value = false
    }
}

// ── Panel permisos ─────────────────────────────────────────────────
const seleccionarUsuario = async (u) => {
    if (usuarioSeleccionado.value?.Documento === u.Documento) { usuarioSeleccionado.value = null; return }
    usuarioSeleccionado.value = u
    busquedaPerm.value = ''

    const idRol = u.T_UsuarioRol?.[0]?.IdRol
    if (!idRol) return

    loadingPermisos.value = true
    try {
        const res = await RolService.getPermisosRol(idRol)
        const data = res?.data ?? res ?? []
        seleccionados.value = new Set(data.map(p => p.T_PermisosAdmin?.Nombre).filter(Boolean))
    } catch (e) {
        console.error('[Permisos] cargar:', e)
    } finally {
        loadingPermisos.value = false
    }
}

const guardarPermisos = async () => {
    const idRol = usuarioSeleccionado.value?.T_UsuarioRol?.[0]?.IdRol
    if (!idRol) return

    const ids = [...seleccionados.value]
        .map(nombre => permisosDisponibles.value.find(p => p.Nombre === nombre)?.Id)
        .filter(Boolean)

    loadingPermisos.value = true
    try {
        await RolService.assignPermisos(idRol, ids)
        usuarioSeleccionado.value = null
    } catch (e) {
        console.error('[Permisos] guardar:', e.response?.data?.message ?? e)
    } finally {
        loadingPermisos.value = false
    }
}

// ── Helpers permisos ───────────────────────────────────────────────
const seleccionadosArr = computed(() => [...seleccionados.value])
const isSelected = v => seleccionadosArr.value.includes(v)
const countActivos = g => g.permisos.filter(p => isSelected(p.value)).length
const gruposFiltrados = computed(() => {
    const q = busquedaPerm.value.toLowerCase().trim()
    if (!q) return GRUPOS
    return GRUPOS
        .map(g => ({ ...g, permisos: g.permisos.filter(p => p.label.toLowerCase().includes(q) || p.value.toLowerCase().includes(q)) }))
        .filter(g => g.permisos.length > 0)
})
const togglePerm = v => {
    const s = new Set(seleccionados.value)
    s.has(v) ? s.delete(v) : s.add(v)
    seleccionados.value = s
}
const toggleGrupoPermisos = g => {
    const s = new Set(seleccionados.value)
    const todosOn = g.permisos.every(p => s.has(p.value))
    g.permisos.forEach(p => todosOn ? s.delete(p.value) : s.add(p.value))
    seleccionados.value = s
}
const selectAll = () => { seleccionados.value = new Set(GRUPOS.flatMap(g => g.permisos.map(p => p.value))) }
const clearAll = () => { seleccionados.value = new Set() }

// ── Inhabilitar ────────────────────────────────────────────────────
const darDeBaja = u => { clienteAccion.value = { ...u }; modalInhabilitar.value = true }
const inhabilitarCliente = async () => {
    try {
        const idx = usuarios.value.findIndex(u => u.Documento === clienteAccion.value.Documento)
        if (idx !== -1) usuarios.value[idx].Estado = false
        modalInhabilitar.value = false
    } catch (e) { console.error(e) }
}

// ── Util ───────────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre ? nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '??'
</script>

<style scoped>
.field-label {
    font-size: 0.72rem;
    font-weight: 800;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-left: 2px;
}

.field-input {
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

.field-input:focus {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15);
}

.field-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
}

input[type="checkbox"].sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
}

.btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.panel-mobile-height {
    max-height: 82vh;
}

@media (min-width: 1024px) {
    .panel-mobile-height {
        max-height: 100%;
    }
}

@media (min-width: 1024px) {
    .panel-enter-active {
        transition: all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
    }

    .panel-leave-active {
        transition: all 0.18s ease-in;
    }

    .panel-enter-from,
    .panel-leave-to {
        opacity: 0;
        transform: translateX(40px);
    }
}

@media (max-width: 1023px) {
    .panel-enter-active {
        transition: all 0.32s cubic-bezier(0.34, 1.1, 0.64, 1);
    }

    .panel-leave-active {
        transition: all 0.2s ease-in;
    }

    .panel-enter-from,
    .panel-leave-to {
        opacity: 0;
        transform: translateY(100%);
    }
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(100%);
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1);
}

@media (max-width: 500px) {

    .slide-panel-enter-from,
    .slide-panel-leave-to {
        transform: translateY(100%);
    }
}

.overlay-enter-active {
    transition: opacity 0.2s ease;
}

.overlay-leave-active {
    transition: opacity 0.15s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

:deep(button[v-html] svg),
:deep(.icon-btn svg) {
    width: 19px;
    height: 19px;
    fill: #9ca3af;
    transition: fill 0.12s;
    display: block;
}

:deep(button.bg-\[\#0D291C\] svg) {
    fill: #7FD344;
}


.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #0D291C22 transparent;
}
</style>