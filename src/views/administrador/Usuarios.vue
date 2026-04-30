<template>
    <div class="h-full flex flex-col gap-4">

        <!-- Header -->
        <AdminPageHeader title="Usuarios">
            <template #right>
                <button @click="abrirCrear"
                    class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                    style="box-shadow: #595858 0px 2px 0">
                    <AppIcon name="add" :size="14" />
                    <span class="hidden sm:inline">Nuevo</span>
                </button>
            </template>
        </AdminPageHeader>

        <!-- Buscador -->
        <div class="bg-white rounded-2xl px-4 py-3 flex gap-2 items-center flex-shrink-0 shadow-sm">
            <input v-model="busqueda" type="text" placeholder="Buscar nombre o documento..."
                class="flex-1 min-w-0 bg-[#EAEAEA] border-2 border-[#299261] rounded-full px-4 py-2 text-sm text-[#232B3A] outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all" />
            <button v-if="busqueda" @click="busqueda = ''"
                class="text-xs font-bold text-gray-500 border border-gray-200 rounded-full px-3 py-2 hover:border-[#299261] hover:text-[#299261] transition-colors whitespace-nowrap flex-shrink-0">
                ✕
            </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div class="table-scroll-wrapper">
                <table class="w-full border-collapse" style="min-width:300px">
                    <thead>
                        <tr>
                            <th class="th-cell">Usuario</th>
                            <th class="th-cell hidden sm:table-cell">Documento</th>
                            <th class="th-cell hidden md:table-cell">Rol</th>
                            <th class="th-cell th-cell--center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="4" class="py-16 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div class="loader" />
                                    <span class="text-sm text-gray-400 font-semibold">Cargando usuarios...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="usuariosPaginados.length === 0">
                            <td colspan="4" class="py-16 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                    <span class="text-sm font-medium">No se encontraron usuarios</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="u in usuariosPaginados" :key="u.Documento"
                            class="border-b border-[#e8f5e9] hover:bg-[#f0faf4] transition-colors last:border-0">
                            <td class="td-cell">
                                <div class="flex items-center gap-2 sm:gap-3">
                                    <div
                                        class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-xs border-2 border-[#e8f5e9] flex-shrink-0">
                                        {{ iniciales(u.Nombres) }}
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-semibold text-[#0D291C] truncate text-sm leading-tight">
                                            {{ u.Nombres }} {{ u.Apellidos }}
                                        </span>
                                        <span class="text-xs text-gray-400 font-mono sm:hidden">{{ u.Documento }}</span>
                                        <span class="text-xs text-gray-400 truncate hidden sm:block">{{ u.Email
                                        }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="td-cell font-mono hidden sm:table-cell">
                                {{ u.Documento }}
                            </td>
                            <td class="td-cell hidden md:table-cell">
                                <span
                                    class="text-[0.72rem] font-bold px-2.5 py-1 rounded-full bg-[#f0faf4] text-[#299261] border border-[#c8e6c9]">
                                    {{ u.T_UsuarioRol?.[0]?.T_Roles?.Nombre ?? 'Sin rol' }}
                                </span>
                            </td>
                            <td class="td-cell td-cell--center">
                                <div class="flex items-center justify-center gap-1">
                                <button @click="abrirEditar(u)"
                                    class="w-8 h-8 rounded-[10px] flex items-center justify-center border-none cursor-pointer transition-all bg-transparent hover:bg-[#e8f5e9] text-gray-400 hover:text-[#299261]"
                                    title="Editar información">
                                    <AppIcon name="person_edit" :size="30" style="color:black;" />
                                </button>
                                <button @click="darDeBaja(u)"
                                    class="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-red-100 transition-all text-gray-400 hover:text-red-500"
                                    title="Inhabilitar">
                                    <AppIcon name="account_circle_off" :size="30" style="color:black;" />
                                </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <TablePagination :pagina-actual="paginaActual" :total-paginas="totalPaginas"
                :total-registros="totalRegistros" :limit="limit" @pagina="irPagina" @limit="onLimitChange" />
        </div>

        <!-- Panel crear/editar -->
        <AsideEditar v-model="panelUsuario"
            :titulo="modoPanel === 'crear' ? 'Nuevo usuario' : (formUsuario.Nombres + ' ' + formUsuario.Apellidos).trim()"
            :subtitulo="modoPanel === 'crear' ? 'Completa los campos requeridos' : 'Doc. ' + formUsuario.Documento"
            :label-guardar="modoPanel === 'crear' ? 'Crear usuario' : 'Guardar cambios'" :loading="guardandoUsuario"
            :error="errPanelUsuario" @guardar="guardarUsuario" @update:modelValue="cerrarPanelUsuario">

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

            <div class="flex flex-col gap-1.5">
                <label class="field-label">Documento <span class="text-red-400">*</span></label>
                <input v-model.number="formUsuario.Documento" type="number" class="field-input"
                    :disabled="modoPanel === 'editar'"
                    :class="modoPanel === 'editar' ? 'opacity-50 cursor-not-allowed' : ''" placeholder="" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label class="field-label">Email <span class="text-red-400">*</span></label>
                <input v-model="formUsuario.Email" type="email" class="field-input" placeholder="" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label class="field-label">Teléfono <span class="text-red-400">*</span></label>
                <input v-model="formUsuario.Telefono" type="text" class="field-input" maxlength="15" placeholder="" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label class="field-label">Rol <span class="text-red-400">*</span></label>
                <select v-model.number="formUsuario.IdRol" class="field-input field-select">
                    <option value="" disabled>Seleccionar rol...</option>
                    <option v-for="r in roles" :key="r.Id ?? r.id" :value="r.Id ?? r.id">
                        {{ r.Nombre ?? r.nombre }}
                    </option>
                </select>
            </div>

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
                        class="absolute right-2.5 bg-transparent border-none cursor-pointer p-1 flex items-center text-gray-400 hover:text-[#299261] transition-colors">
                        <AppIcon v-if="!mostrarPassword" name="visibility" :size="16" />
                        <AppIcon v-else name="visibility_off" :size="16" />
                    </button>
                </div>
            </div>
        </AsideEditar>

        <!-- Modal inhabilitar -->
        <ModalInhabilitar v-model="modalInhabilitar" :cliente="clienteAccion" @confirmar="inhabilitarCliente" />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import ModalInhabilitar from '@/components/modals/ModalInhabilitar.vue'
import adminServices from '@/api/services/admin.service'
import RolService from '@/api/services/rol.service'
import TablePagination from '@/components/shared/Paginacion.vue'

const loading = ref(false)
const usuarios = ref([])
const roles = ref([])

const busqueda = ref('')
const busquedaDebounced = ref('')
const paginaActual = ref(1)
const limit = ref(10)

const panelUsuario = ref(false)
const modoPanel = ref('crear')
const guardandoUsuario = ref(false)
const errPanelUsuario = ref('')
const mostrarPassword = ref(false)
const formUsuario = ref({
    Documento: null, Nombres: '', Apellidos: '',
    Email: '', Telefono: '', IdRol: '', Password: '', Estado: true,
})

const modalInhabilitar = ref(false)
const clienteAccion = ref({})

onMounted(async () => {
    loading.value = true
    try {
        const [resU, resR] = await Promise.all([
            adminServices.getAllAdmins(),
            RolService.getAll(),
        ])
        usuarios.value = resU?.data ?? resU ?? []
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

// ── Inhabilitar ────────────────────────────────────────────────────
const darDeBaja = u => { clienteAccion.value = { ...u }; modalInhabilitar.value = true }
const inhabilitarCliente = async () => {
    try {
        const idx = usuarios.value.findIndex(u => u.Documento === clienteAccion.value.Documento)
        if (idx !== -1) usuarios.value[idx].Estado = false
        modalInhabilitar.value = false
    } catch (e) { console.error(e) }
}

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


.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #0D291C22 transparent;
}

.loader {
    width: 28px;
    height: 28px;
    border: 3px solid #e8f5e9;
    border-top-color: #299261;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}
</style>