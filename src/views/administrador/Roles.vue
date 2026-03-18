<template>
    <div class="h-full flex flex-col gap-4">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <div class="w-16 sm:w-20"></div>
            <h2 class="text-lg sm:text-2xl font-bold text-[#232B3A]">Roles</h2>
            <div class="flex items-center gap-2">
                <div
                    class="flex items-center bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full border border-black shadow-[0_2px_0_#595858]">
                    <button @click="$router.back()">Volver</button>
                </div>
            </div>
        </div>

        <!-- Layout -->
        <div class="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">

            <!-- ── Lista de roles ── -->
            <div class="lg:w-[280px] flex-shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="px-4 py-3 border-b-2 border-[#e8f5e9] flex-shrink-0">
                    <p class="text-[0.65rem] font-black uppercase tracking-widest text-[#0D291C] opacity-50">
                        Selecciona un rol
                    </p>
                </div>

                <div v-if="loadingRoles" class="flex-1 flex items-center justify-center py-10">
                    <div class="flex flex-col items-center gap-3">
                        <div class="loader" />
                        <span class="text-xs text-gray-400 font-semibold">Cargando roles...</span>
                    </div>
                </div>

                <div v-else class="flex-1 overflow-y-auto p-2 flex flex-col gap-1 scrollbar-thin">
                    <button v-for="rol in roles" :key="rol.Id" @click="seleccionarRol(rol)"
                        class="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-left transition-all border-2 cursor-pointer"
                        :class="rolSeleccionado?.Id === rol.Id
                            ? 'bg-[#0D291C] border-[#0D291C] text-white'
                            : 'bg-white border-transparent hover:border-[#e8f5e9] hover:bg-[#f8fdf9] text-[#0D291C]'">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[0.7rem] font-black"
                                :class="rolSeleccionado?.Id === rol.Id ? 'bg-[#7FD344] text-[#0D291C]' : 'bg-[#e8f5e9] text-[#299261]'">
                                {{ rol.Nombre?.slice(0, 2).toUpperCase() }}
                            </div>
                            <div class="min-w-0">
                                <p class="text-[0.82rem] font-black truncate leading-tight"
                                    :class="rolSeleccionado?.Id === rol.Id ? 'text-white' : 'text-[#0D291C]'">
                                    {{ rol.Nombre }}
                                </p>
                                <p class="text-[0.62rem] font-semibold truncate"
                                    :class="rolSeleccionado?.Id === rol.Id ? 'text-white/50' : 'text-gray-400'">
                                    {{ permisosCount[rol.Id] ?? '—' }} permisos
                                </p>
                            </div>
                        </div>
                        <svg v-if="rolSeleccionado?.Id === rol.Id" xmlns="http://www.w3.org/2000/svg" width="14"
                            height="14" fill="#7FD344" viewBox="0 0 24 24" class="flex-shrink-0">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- ── Panel permisos ── -->
            <div class="flex-1 min-w-0 flex flex-col gap-3">

                <!-- Sin selección -->
                <div v-if="!rolSeleccionado"
                    class="flex-1 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-3 py-16 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z" />
                    </svg>
                    <p class="text-sm font-semibold">Selecciona un rol para gestionar sus permisos</p>
                </div>

                <!-- Con selección -->
                <template v-else>
                    <!-- Cabecera del panel -->
                    <div
                        class="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-xl bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-sm flex-shrink-0">
                                {{ rolSeleccionado.Nombre?.slice(0, 2).toUpperCase() }}
                            </div>
                            <div class="min-w-0">
                                <p class="text-[0.92rem] font-black text-[#0D291C] leading-tight truncate">
                                    {{ rolSeleccionado.Nombre }}
                                </p>
                                <p class="text-[0.65rem] font-semibold text-gray-400">
                                    <span class="font-black text-[#299261]">{{ seleccionados.size }}</span>
                                    / {{ totalPermisos }} permisos activos
                                </p>
                            </div>
                        </div>
                        <!-- Barra progreso -->
                        <div class="flex-1 max-w-[180px] hidden sm:block">
                            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-300"
                                    style="background:linear-gradient(90deg,#299261,#7FD344)"
                                    :style="{ width: `${(seleccionados.size / totalPermisos) * 100}%` }" />
                            </div>
                        </div>
                    </div>

                    <!-- Toolbar -->
                    <div class="bg-white rounded-2xl shadow-sm px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
                        <div
                            class="flex items-center gap-2 flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 focus-within:border-[#299261] transition-colors">
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

                    <!-- Grid permisos -->
                    <div class="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                        <div v-if="loadingPermisos" class="flex flex-col items-center justify-center py-16 gap-3">
                            <div class="loader" />
                            <span class="text-xs text-gray-400 font-semibold">Cargando permisos...</span>
                        </div>

                        <div v-else-if="gruposFiltrados.length === 0"
                            class="text-center py-12 text-gray-400 text-sm font-semibold">
                            Sin resultados para "<strong>{{ busquedaPerm }}</strong>"
                        </div>

                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                            <div v-for="grupo in gruposFiltrados" :key="grupo.label"
                                class="bg-white rounded-2xl border-2 flex flex-col transition-all"
                                :class="countActivos(grupo) > 0 ? 'border-[#c8e6c9] shadow-[0_1px_0_#a5d6a7]' : 'border-gray-100 shadow-[0_1px_0_#e8ede9]'">
                                <!-- Cabecera grupo -->
                                <div class="flex items-center justify-between gap-1 px-2.5 py-2 rounded-t-2xl border-b"
                                    :class="countActivos(grupo) > 0 ? 'bg-[#f0faf4] border-[#d7eeda]' : 'bg-gray-50 border-gray-100'">
                                    <span class="text-[0.72rem] font-black text-[#0D291C] truncate">{{ grupo.label
                                        }}</span>
                                    <div class="flex items-center gap-1.5 flex-shrink-0">
                                        <span class="text-[0.6rem] font-black rounded-full px-1.5 py-0.5"
                                            :class="countActivos(grupo) > 0 ? 'bg-[#0D291C] text-[#7FD344]' : 'bg-gray-200 text-gray-400'">
                                            {{ countActivos(grupo) }}/{{ grupo.permisos.length }}
                                        </span>
                                        <button @click="toggleGrupo(grupo)"
                                            class="text-[0.6rem] font-black rounded-full px-2 py-0.5 border cursor-pointer hover:opacity-80 transition-opacity"
                                            :class="countActivos(grupo) === grupo.permisos.length
                                                ? 'bg-red-50 text-red-600 border-red-200'
                                                : 'bg-[#e8f5e9] text-[#299261] border-[#a5d6a7]'">
                                            {{ countActivos(grupo) === grupo.permisos.length ? 'Quitar' : 'Todos' }}
                                        </button>
                                    </div>
                                </div>
                                <!-- Items -->
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
                        </div>
                    </div>

                    <!-- Footer guardar -->
                    <div class="flex gap-2 pt-1 flex-shrink-0">
                        <button @click="rolSeleccionado = null"
                            class="flex-1 py-3 rounded-full text-xs font-black uppercase tracking-wide cursor-pointer bg-white text-[#232B3A] border-2 border-black hover:bg-gray-50 transition-colors"
                            style="box-shadow:0 3px 0 #000">
                            Cancelar
                        </button>
                        <button @click="guardarPermisos" :disabled="loadingPermisos"
                            class="flex-[3] py-3 rounded-full text-xs font-black uppercase tracking-wide cursor-pointer bg-[#0D291C] text-white border-2 border-black flex items-center justify-center gap-2 hover:bg-[#132e21] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style="box-shadow:0 3px 0 #000">
                            <div v-if="loadingPermisos" class="btn-spinner" />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                            </svg>
                            Guardar permisos de {{ rolSeleccionado.Nombre }}
                        </button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RolService from '@/api/services/rol.service'
import { PERMS } from '@/constants/permisions'

// ── Catálogo ───────────────────────────────────────────────────────
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
const loadingRoles = ref(false)
const loadingPermisos = ref(false)
const roles = ref([])
const permisosDisponibles = ref([])
const rolSeleccionado = ref(null)
const seleccionados = ref(new Set())
const busquedaPerm = ref('')

// Cuántos permisos activos tiene cada rol (para el listado)
const permisosCount = ref({})

onMounted(async () => {
    loadingRoles.value = true
    try {
        const [resR, resP] = await Promise.all([
            RolService.getAll(),
            RolService.getAllPermisos(),
        ])
        roles.value = resR?.data ?? resR ?? []
        permisosDisponibles.value = resP?.data ?? resP ?? []

        // Precargar conteo de permisos por rol
        await Promise.all(roles.value.map(async rol => {
            try {
                const res = await RolService.getPermisosRol(rol.Id)
                const data = res?.data ?? res ?? []
                permisosCount.value[rol.Id] = data.length
            } catch { permisosCount.value[rol.Id] = 0 }
        }))
    } catch (e) {
        console.error('[Roles] mount:', e)
    } finally {
        loadingRoles.value = false
    }
})

// ── Seleccionar rol → cargar sus permisos ──────────────────────────
const seleccionarRol = async (rol) => {
    if (rolSeleccionado.value?.Id === rol.Id) { rolSeleccionado.value = null; return }
    rolSeleccionado.value = rol
    busquedaPerm.value = ''
    loadingPermisos.value = true
    try {
        const res = await RolService.getPermisosRol(rol.Id)
        const data = res?.data ?? res ?? []
        seleccionados.value = new Set(data.map(p => p.T_PermisosAdmin?.Nombre).filter(Boolean))
    } catch (e) {
        console.error('[Roles] cargar permisos:', e)
    } finally {
        loadingPermisos.value = false
    }
}

// ── Guardar ────────────────────────────────────────────────────────
const guardarPermisos = async () => {
    if (!rolSeleccionado.value) return
    const ids = [...seleccionados.value]
        .map(nombre => permisosDisponibles.value.find(p => p.Nombre === nombre)?.Id)
        .filter(Boolean)

    loadingPermisos.value = true
    try {
        await RolService.assignPermisos(rolSeleccionado.value.Id, ids)
        permisosCount.value[rolSeleccionado.value.Id] = seleccionados.value.size
        rolSeleccionado.value = null
    } catch (e) {
        console.error('[Roles] guardar:', e.response?.data?.message ?? e)
    } finally {
        loadingPermisos.value = false
    }
}

// ── Helpers permisos ───────────────────────────────────────────────
const isSelected = v => seleccionados.value.has(v)
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

const toggleGrupo = g => {
    const s = new Set(seleccionados.value)
    const todosOn = g.permisos.every(p => s.has(p.value))
    g.permisos.forEach(p => todosOn ? s.delete(p.value) : s.add(p.value))
    seleccionados.value = s
}

const selectAll = () => { seleccionados.value = new Set(GRUPOS.flatMap(g => g.permisos.map(p => p.value))) }
const clearAll = () => { seleccionados.value = new Set() }
</script>

<style scoped>
.loader {
    width: 28px;
    height: 28px;
    border: 3px solid #e8f5e9;
    border-top-color: #299261;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
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
        transform: rotate(360deg)
    }
}

.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #0D291C22 transparent;
}
</style>