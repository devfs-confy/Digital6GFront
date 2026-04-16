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
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Clientes</h2>
            <button @click="abrirNuevo"
                class=" cursor-none pointer-events-none flex items-center gap-1.5 bg-transparent text-transparent text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline"></span>
            </button>
        </div>



        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1 flex-[2] min-w-[200px] max-[600px]:flex-none max-[600px]:w-full">
                <label
                    class="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#232B3A] pl-1">Buscar</label>
                <input v-model="busqueda" type="text" placeholder="Nombre o documento..." class="search-input w-full" />
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
                            <th class="th-cell text-center">Opciones</th>
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
                                    <div class="flex flex-col items-start min-w-0">
                                        <span class="font-semibold text-[#0D291C] leading-tight truncate max-w-[140px]">
                                            {{ cliente.Nombres }} {{ cliente.Apellidos }}
                                        </span>
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
                            <td class="td-cell text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="abrirEditar(cliente)"
                                        class="w-8 h-8 rounded-[10px] flex items-center justify-center border-none cursor-pointer bg-transparent text-gray-400 hover:bg-[#e8f5e9] hover:text-[#299261] transition-all"
                                        title="Editar">
                                        <AppIcon name="person_edit" :size="30" style="color:black;" />
                                    </button>
                                    <button @click="abrirCambioEstado(cliente)"
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

        <!-- MODAL NUEVO CLIENTE -->
        <Transition name="modal">
            <div v-if="modalNuevo"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalNuevo = false">
                <div class="bg-[#B8E19E] border-[2.5px] border-[#0D291C] rounded-[40px] w-full max-w-[660px] max-h-[88vh] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-[26px] pt-[22px] pb-4 border-b-2 border-[rgba(13,41,28,0.14)] flex-shrink-0">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-11 h-11 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-[0.9rem] flex-shrink-0 border-2 border-[rgba(13,41,28,0.4)]">
                                +</div>
                            <div>
                                <p
                                    class="text-[1rem] font-black text-[#0D291C] italic uppercase tracking-[-0.01em] truncate">
                                    Nuevo cliente</p>
                                <p
                                    class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-[#0D291C] opacity-45 mt-0.5">
                                    Completa los datos de registro</p>
                            </div>
                        </div>
                        <button @click="modalNuevo = false"
                            class="text-[1.1rem] font-black text-[#0D291C] opacity-35 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer leading-none flex-shrink-0">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto px-[26px] py-5 flex flex-col gap-3.5 modal-body">
                        <p
                            class="text-[0.62rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-45 border-b-[1.5px] border-[rgba(13,41,28,0.12)] pb-1 mt-0.5">
                            Datos personales</p>
                        <div class="grid grid-cols-2 gap-[11px] max-[500px]:grid-cols-1">
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Documento *</label>
                                <input v-model="fN.Documento" type="text" class="field-input"
                                    placeholder="1098617878" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Sede *</label>
                                <select v-model="fN.IdEstacionamiento" class="field-input">
                                    <option value="">Seleccionar</option>
                                    <option v-for="s in sedes" :key="s.IdEstacionamiento"
                                        :value="Number(s.IdEstacionamiento)">
                                        {{ s.Nombre }}</option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Nombres *</label>
                                <input v-model="fN.Nombres" type="text" class="field-input" placeholder="Juan Felipe" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Apellidos *</label>
                                <input v-model="fN.Apellidos" type="text" class="field-input"
                                    placeholder="García Ospina" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Teléfono *</label>
                                <input v-model="fN.Telefono" type="text" class="field-input" placeholder="3001234567" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Email *</label>
                                <input v-model="fN.Email" type="email" class="field-input"
                                    placeholder="correo@ejemplo.com" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Contraseña *</label>
                                <div class="relative">
                                    <input v-model="fN.Password" :type="verPass ? 'text' : 'password'"
                                        class="field-input pr-10" placeholder="••••••••" />
                                    <button type="button" @click="verPass = !verPass"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 opacity-50 hover:opacity-100 transition-opacity">
                                        <svg v-if="!verPass" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
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
                            <div class="flex flex-col gap-1">
                                <label class="field-label">ID Autorización</label>
                                <input v-model.number="fN.IdAutorizacion" type="number" class="field-input"
                                    placeholder="123" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Fecha inicio</label>
                                <input v-model="fN.FechaInicio" type="date" class="field-input" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="field-label">Fecha fin</label>
                                <input v-model="fN.FechaFin" type="date" class="field-input" />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-x-5 gap-y-2 mt-1">
                            <label
                                class="flex items-center gap-1.5 cursor-pointer text-[0.78rem] font-bold text-[#0D291C]"><input
                                    type="checkbox" v-model="fN.Estado" class="check" /><span>Activo</span></label>
                            <label
                                class="flex items-center gap-1.5 cursor-pointer text-[0.78rem] font-bold text-[#0D291C]"><input
                                    type="checkbox" v-model="fN.EstudianteUcc" class="check" /><span>Estudiante
                                    UCC</span></label>
                            <label
                                class="flex items-center gap-1.5 cursor-pointer text-[0.78rem] font-bold text-[#0D291C]"><input
                                    type="checkbox" v-model="fN.Old" class="check" /><span>Registro
                                    antiguo</span></label>
                            <label
                                class="flex items-center gap-1.5 cursor-pointer text-[0.78rem] font-bold text-[#0D291C]"><input
                                    type="checkbox" v-model="fN.Sincronizacion"
                                    class="check" /><span>Sincronizado</span></label>
                        </div>

                        <div v-if="fN.EstudianteUcc" class="flex flex-col gap-1 mt-2">
                            <label class="field-label">Código estudiante UCC</label>
                            <input v-model="fN.CodigoEstudianteUCC" type="text" class="field-input"
                                placeholder="765432" />
                        </div>

                        <p
                            class="text-[0.62rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-45 border-b-[1.5px] border-[rgba(13,41,28,0.12)] pb-1 mt-0.5">
                            Vehículos</p>
                        <div class="grid grid-cols-2 gap-[11px] max-[500px]:grid-cols-1">
                            <div v-for="(_, idx) in fN.placas" :key="idx" class="flex flex-col gap-1">
                                <label class="field-label">Placa {{ idx + 1 }}{{ idx === 0 ? ' *' : '' }}</label>
                                <div class="flex gap-2 items-center">
                                    <input v-model="fN.placas[idx]" type="text" class="field-input placa-input flex-1"
                                        :placeholder="`ABC${idx + 1}23`" maxlength="6" />
                                    <button v-if="fN.placas.length > 1" type="button" @click="fN.placas.splice(idx, 1)"
                                        class="w-8 h-8 rounded-xl bg-red-100 border-none flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                            viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button v-if="fN.placas.length < 5" type="button" @click="fN.placas.push('')"
                            class="self-start flex items-center gap-1.5 text-[0.75rem] font-bold text-[#0D291C] hover:text-[#299261] transition-colors border-none bg-transparent p-0 cursor-pointer mt-1">
                            <span
                                class="w-5 h-5 rounded-lg bg-[#0D291C] text-[#7FD344] flex items-center justify-center">
                                <AppIcon name="add" :size="30" />
                            </span>
                            Agregar placa
                        </button>

                        <div v-if="errNuevo"
                            class="px-3.5 py-2.5 rounded-xl text-[0.78rem] font-bold bg-red-50 border-[1.5px] border-red-200 text-red-700">
                            ⚠ {{ errNuevo }}</div>
                    </div>

                    <!-- Foot -->
                    <div class="px-[26px] py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                        <button @click="modalNuevo = false"
                            class="btn-modal-dark btn-modal-dark--cancel">Cancelar</button>
                        <button @click="crearCliente" :disabled="guardandoN" class="btn-modal-dark">
                            <span v-if="guardandoN"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin mr-1" />
                            {{ guardandoN ? 'Creando...' : 'Crear cliente' }}
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
import ClientService from '@/api/services/client.service'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'
import ModalInhabilitar from '@/components/modals/ModalInhabilitar.vue'
import TablePaginacion from '@/components/shared/Paginacion.vue'

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
const listaClientes = computed(() =>
    Array.isArray(clientes.value) ? clientes.value : (clientes.value?.data ?? [])
)


// ── Helpers ────────────────────────────────────────────────────────
const iniciales = (nombre = '') =>
    nombre ? nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '??'

// ── Carga ──────────────────────────────────────────────────────────
const cargarClientes = async () => {
    loading.value = true
    try {
        const params = {
            page: paginaActual.value,
            limit: limit.value,
            ...(filtroSede.value && { sede: filtroSede.value }),
            ...(busquedaDebounced.value && { search: busquedaDebounced.value }),
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

// ── Modal Nuevo ────────────────────────────────────────────────────
const abrirNuevo = () => {
    errNuevo.value = ''
    verPass.value = false
    Object.assign(fN, {
        Documento: '', IdEstacionamiento: '', Nombres: '', Apellidos: '',
        Telefono: '', Email: '', Password: '', IdAutorizacion: null,
        FechaInicio: '', FechaFin: '', Estado: true, EstudianteUcc: false,
        CodigoEstudianteUCC: '', Old: false, Sincronizacion: false, placas: [''],
    })
    modalNuevo.value = true
}

const crearCliente = async () => {
    errNuevo.value = ''
    if (!fN.Documento || !fN.Nombres || !fN.Apellidos || !fN.Email || !fN.Telefono || !fN.Password) {
        errNuevo.value = 'Completa todos los campos obligatorios (*).'; return
    }
    guardandoN.value = true
    try {
        const { placas, ...rest } = fN
        await ClientService.createClient({
            ...rest,
            IdEstacionamiento: Number(rest.IdEstacionamiento) || 0,
            Placa1: placas[0] || null, Placa2: placas[1] || null,
            Placa3: placas[2] || null, Placa4: placas[3] || null, Placa5: placas[4] || null,
        })
        paginaActual.value = 1
        await cargarClientes()
        modalNuevo.value = false
    } catch (e) {
        const msg = e.response?.data?.message
        errNuevo.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al crear el cliente.')
    } finally {
        guardandoN.value = false
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
</style>