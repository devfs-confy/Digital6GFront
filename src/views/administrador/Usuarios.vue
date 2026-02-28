<template>
    <div class="h-full flex flex-col gap-4">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <div class="w-16 sm:w-20"></div>
            <h2 class="text-lg sm:text-2xl font-bold text-[#232B3A]">Usuarios</h2>
            <div
                class="flex items-center bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full border border-black shadow-[0_2px_0_#595858]">
                <button @click="$router.back()">Volver</button>
            </div>
        </div>

        <!-- Layout: en desktop split, en móvil columna única -->
        <div class="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">

            <!-- ── Tabla ── -->
            <div class="flex flex-col gap-3 flex-1 min-w-0" :class="usuarioSeleccionado ? 'lg:flex-1' : ''">

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
                                        class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344]">
                                        Usuario
                                    </th>
                                    <th
                                        class="px-3 sm:px-4 py-3 text-left text-[0.65rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344] hidden sm:table-cell">
                                        Documento
                                    </th>
                                    <th
                                        class="px-3 sm:px-4 py-3 text-center text-[0.65rem] font-black uppercase tracking-widest text-[#7FD344] bg-[#0D291C] border-b-[3px] border-[#7FD344]">
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
                                                    class="font-semibold text-[#0D291C] truncate text-sm leading-tight">
                                                    {{ u.Nombres }} {{ u.Apellidos }}
                                                </span>
                                                <!-- Documento visible solo en móvil debajo del nombre -->
                                                <span class="text-xs text-start text-gray-400 font-mono sm:hidden">{{
                                                    u.Documento
                                                    }}</span>
                                                <span class="text-xs  text-gray-400 truncate hidden sm:block">{{ u.Email
                                                }}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Documento — oculto en móvil (se muestra debajo del nombre) -->
                                    <td
                                        class="px-3 sm:px-4 py-3 text-sm  tracking-wide text-gray-600 whitespace-nowrap hidden sm:table-cell">
                                        {{ u.Documento }}
                                    </td>

                                    <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                                        <div class="flex items-center justify-center gap-1">
                                            <button @click="seleccionarUsuario(u)"
                                                class="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center border-none cursor-pointer transition-all"
                                                :class="usuarioSeleccionado?.Documento === u.Documento
                                                    ? ''
                                                    : 'bg-transparent hover:bg-[#e8f5e9]'" title="Gestionar permisos"
                                                v-html="dashboard_customize" />
                                            <button @click="darDeBaja(u)"
                                                class="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-red-100 transition-all"
                                                title="Inhabilitar" v-html="account_circle_off" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Paginación -->
                    <div
                        class="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-t-2 border-[#f0f9f4] bg-[#fafffe] flex-shrink-0">
                        <span class="text-[0.72rem] text-gray-400 hidden sm:block">
                            <strong class="text-[#0D291C]">{{ rangoInicio }}–{{ rangoFin }}</strong>
                            de <strong class="text-[#0D291C]">{{ usuariosFiltrados.length }}</strong>
                        </span>
                        <div class="flex items-center gap-1">
                            <button @click="pagina--" :disabled="pagina === 1" class="page-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                            </button>
                            <span class="text-xs font-bold text-[#0D291C] px-2">{{ pagina }} / {{ totalPaginas }}</span>
                            <template v-for="p in totalPaginas" :key="p">
                                <button @click="pagina = p" class="page-btn hidden md:flex"
                                    :class="pagina === p ? 'bg-[#0D291C] text-[#7FD344]' : ''">
                                    {{ p }}
                                </button>
                            </template>
                            <button @click="pagina++" :disabled="pagina === totalPaginas" class="page-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                </svg>
                            </button>
                        </div>
                        <select v-model.number="porPagina" @change="pagina = 1"
                            class="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 cursor-pointer">
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="15">15</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Overlay móvil -->
            <Transition name="overlay">
                <div v-if="usuarioSeleccionado" class="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    @click="usuarioSeleccionado = null" />
            </Transition>

            <!-- Panel -->
            <Transition name="panel">
                <div v-if="usuarioSeleccionado" class="
                        fixed bottom-0 left-0 right-0 z-50
                        lg:static lg:z-auto
                        lg:w-[400px] lg:flex-shrink-0
                        bg-white
                        rounded-t-3xl lg:rounded-3xl
                        border-2 border-[#0D291C]
                        flex flex-col overflow-hidden
                        lg:max-h-full
                        panel-mobile-height
                    " style="box-shadow: 0 -4px 0 #000; --tw-shadow: none;"
                    :style="{ boxShadow: 'var(--panel-shadow, 0 -4px 0 #000)' }">
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

                    <!-- Toolbar: buscador + botones en una fila -->
                    <div class="flex items-center gap-2 px-3 pt-3 pb-0 bg-[#f8faf9] flex-shrink-0">
                        <div
                            class="flex items-center gap-2 flex-1 min-w-0 bg-white border border-gray-200 rounded-full px-3 py-1.5 focus-within:border-[#299261] transition-colors">
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

                    <!-- Grid de tarjetas: 1 col en móvil, 2 en desktop -->
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

                                <!-- Cabecera tarjeta -->
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
                                            :class="countActivos(grupo) === grupo.permisos.length
                                                ? 'bg-red-50 text-red-600 border-red-200'
                                                : 'bg-[#e8f5e9] text-[#299261] border-[#a5d6a7]'">
                                            {{ countActivos(grupo) === grupo.permisos.length ? 'Quitar' : 'Todos' }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Permisos -->
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

                    <!-- Pie -->
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

        <!-- Modal inhabilitar -->
        <ModalInhabilitar v-model="modalInhabilitar" :cliente="clienteAccion" @confirmar="inhabilitarCliente" />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ModalInhabilitar from '@/components/modals/ModalInhabilitar.vue'
import dashboard_customize from '@/assets/img/dashboard_customize.svg?raw'
import account_circle_off from '@/assets/img/account_circle_off.svg?raw'
import adminServices from '@/api/services/admin.services'
import RolService from '@/api/services/rol.services'

const LABEL_MAP = {
    'VER-USUARIOS': 'Ver usuarios',
    'CREAR-USUARIOS': 'Crear usuarios',
    'EDITAR-USUARIOS': 'Editar usuarios',
    'INACTIVAR-USUARIOS': 'Inactivar usuarios',
    'VER-ROLES': 'Ver roles',
    'CREAR-ROLES': 'Crear roles',
    'EDITAR-ROLES': 'Editar roles',
    'VER-PERMISOS': 'Ver permisos',
    'ASIGNAR-PERMISOS': 'Asignar permisos',
    'INACTIVAR-PERMISOS': 'Inactivar permisos',
    'VER-MENSUALIDADES': 'Ver mensualidades',
    'CREAR-MENSUALIDADES': 'Crear mensualidades',
    'EDITAR-MENSUALIDADES': 'Editar mensualidades',
    'INACTIVAR-MENSUALIDADES': 'Inactivar mensualidades',
    'VER-SEDES': 'Ver sedes',
    'CREAR-SEDES': 'Crear sedes',
    'EDITAR-SEDES': 'Editar sedes',
    'INACTIVAR-SEDES': 'Inactivar sedes',
    'CREAR-CODIGOS': 'Crear códigos',
}

const GRUPOS = [
    { label: 'Usuarios', permisos: ['VER-USUARIOS', 'CREAR-USUARIOS', 'EDITAR-USUARIOS', 'INACTIVAR-USUARIOS'] },
    { label: 'Roles', permisos: ['VER-ROLES', 'CREAR-ROLES', 'EDITAR-ROLES'] },
    { label: 'Permisos', permisos: ['VER-PERMISOS', 'ASIGNAR-PERMISOS', 'INACTIVAR-PERMISOS'] },
    { label: 'Mensualidades', permisos: ['VER-MENSUALIDADES', 'CREAR-MENSUALIDADES', 'EDITAR-MENSUALIDADES', 'INACTIVAR-MENSUALIDADES'] },
    { label: 'Sedes', permisos: ['VER-SEDES', 'CREAR-SEDES', 'EDITAR-SEDES', 'INACTIVAR-SEDES'] },
    { label: 'Códigos', permisos: ['CREAR-CODIGOS'] },
].map(g => ({
    ...g,
    permisos: g.permisos.map(nombre => ({
        value: nombre,
        label: LABEL_MAP[nombre] ?? nombre,
    }))
}))

const totalPermisos = GRUPOS.reduce((acc, g) => acc + g.permisos.length, 0)

const loading = ref(false)
const usuarios = ref([])
const permisosDisponibles = ref([])
const busqueda = ref('')
const busquedaDebounced = ref('')
const pagina = ref(1)
const porPagina = ref(10)

const usuarioSeleccionado = ref(null)
const busquedaPerm = ref('')
const seleccionados = ref(new Set())
const loadingPermisos = ref(false)

const modalInhabilitar = ref(false)
const clienteAccion = ref({})

onMounted(async () => {
    loading.value = true
    try {
        const [resUsuarios, resPermisos] = await Promise.all([
            adminServices.getAllClients(),
            RolService.getAllPermisos(),
        ])
        usuarios.value = resUsuarios?.data ?? resUsuarios ?? []
        permisosDisponibles.value = resPermisos?.data ?? resPermisos ?? []
    } catch (e) {
        console.error('Error cargando datos:', e)
    } finally {
        loading.value = false
    }
})

let debounceTimer = null
watch(busqueda, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        busquedaDebounced.value = val
        pagina.value = 1
    }, 300)
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
const totalPaginas = computed(() =>
    Math.max(1, Math.ceil(usuariosFiltrados.value.length / porPagina.value))
)
const usuariosPaginados = computed(() => {
    const ini = (pagina.value - 1) * porPagina.value
    return usuariosFiltrados.value.slice(ini, ini + porPagina.value)
})
const rangoInicio = computed(() =>
    usuariosFiltrados.value.length === 0 ? 0 : (pagina.value - 1) * porPagina.value + 1
)
const rangoFin = computed(() =>
    Math.min(pagina.value * porPagina.value, usuariosFiltrados.value.length)
)

const seleccionadosArr = computed(() => [...seleccionados.value])
const isSelected = (value) => seleccionadosArr.value.includes(value)

const seleccionarUsuario = async (u) => {
    if (usuarioSeleccionado.value?.Documento === u.Documento) {
        usuarioSeleccionado.value = null
        return
    }
    usuarioSeleccionado.value = u
    busquedaPerm.value = ''
    seleccionados.value = new Set()

    const idRol = u.T_UsuarioRol?.[0]?.IdRol
    if (!idRol) {
        console.warn('El usuario no tiene rol asignado')
        return
    }

    loadingPermisos.value = true
    try {
        const response = await RolService.getPermisosRol(idRol)
        const data = response?.data ?? response ?? []
        const nombresActivos = data
            .map(p => p.T_PermisosAdmin?.Nombre)
            .filter(Boolean)
        seleccionados.value = new Set(nombresActivos)
        console.log(`Permisos del rol ${idRol}:`, nombresActivos)
    } catch (e) {
        console.error('Error cargando permisos del rol:', e)
    } finally {
        loadingPermisos.value = false
    }
}

const gruposFiltrados = computed(() => {
    const q = busquedaPerm.value.toLowerCase().trim()
    if (!q) return GRUPOS
    return GRUPOS.map(g => ({
        ...g,
        permisos: g.permisos.filter(p =>
            p.label.toLowerCase().includes(q) || p.value.toLowerCase().includes(q)
        ),
    })).filter(g => g.permisos.length > 0)
})

const countActivos = (grupo) =>
    grupo.permisos.filter(p => seleccionadosArr.value.includes(p.value)).length

const togglePerm = (value) => {
    const s = new Set(seleccionados.value)
    s.has(value) ? s.delete(value) : s.add(value)
    seleccionados.value = new Set(s)
}
const toggleGrupoPermisos = (grupo) => {
    const s = new Set(seleccionados.value)
    const todosOn = grupo.permisos.every(p => s.has(p.value))
    grupo.permisos.forEach(p => todosOn ? s.delete(p.value) : s.add(p.value))
    seleccionados.value = new Set(s)
}
const selectAll = () => {
    seleccionados.value = new Set(GRUPOS.flatMap(g => g.permisos.map(p => p.value)))
}
const clearAll = () => { seleccionados.value = new Set() }

const guardarPermisos = async () => {
    const idRol = usuarioSeleccionado.value?.T_UsuarioRol?.[0]?.IdRol
    if (!idRol) { console.warn('Usuario sin rol asignado'); return }

    const idsSeleccionados = [...seleccionados.value]
        .map(nombre => {
            const found = permisosDisponibles.value.find(p => p.Nombre === nombre)
            return found?.Id ?? null
        })
        .filter(id => id !== null)

    // console.log('Guardando:', { IdRol: idRol, Permisos: idsSeleccionados })
    try {
        const response = await RolService.assignPermisos({
            IdRol: parseInt(idRol),
            Permisos: idsSeleccionados,
        })
        console.log('Guardado:', response?.message)
        usuarioSeleccionado.value = null
    } catch (e) {
        console.error('Error guardando permisos:', e)
    }
}

const darDeBaja = (u) => {
    clienteAccion.value = { ...u }
    modalInhabilitar.value = true
}
const inhabilitarCliente = async ({ motivo, observaciones }) => {
    try {
        console.log('Inhabilitando:', clienteAccion.value.Documento, motivo, observaciones)
        const idx = usuarios.value.findIndex(u => u.Documento === clienteAccion.value.Documento)
        if (idx !== -1) usuarios.value[idx].Estado = false
        modalInhabilitar.value = false
    } catch (e) { console.error(e) }
}

const iniciales = (nombre = '') => {
    if (!nombre) return '??'
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}
</script>

<style scoped>
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

.page-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #6b7280;
    border: none;
    background: none;
    cursor: pointer;
    transition: background-color 0.12s;
}

.page-btn:hover:not(:disabled) {
    background-color: #e8f5e9;
    color: #0D291C;
}

.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.loader {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid #e8f5e9;
    border-top-color: #0D291C;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #0D291C22 transparent;
}
</style>