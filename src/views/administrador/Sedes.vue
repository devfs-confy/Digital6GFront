<template>
    <div class="w-full box-border relative">

        <!-- ── Header ───────────────────────────────────────────── -->
        <div class="flex items-end justify-between mb-7 gap-4 flex-wrap">
            <div>
                <h1 class="text-[1.6rem] font-black text-[#0D291C] leading-none">Administrar Sedes</h1>
                <p class="text-[0.8rem] text-gray-400 font-medium mt-1">
                    {{ sedes.length }} sede{{ sedes.length !== 1 ? 's' : '' }} registrada{{ sedes.length !== 1 ? 's' :
                        '' }}
                </p>
            </div>
            <button v-permission="PERMS.SEDES_CREAR" @click="abrirNueva"
                class="flex items-center gap-1.5 bg-[#0D291C] text-white border-none rounded-xl px-5 py-2.5 text-[0.85rem] font-bold cursor-pointer transition-all hover:bg-[#299261] hover:-translate-y-px active:translate-y-px">
                <AppIcon name="add" :size="18" />

                Nueva sede
            </button>
        </div>

        <!-- ── Skeleton ──────────────────────────────────────────── -->
        <div v-if="loading" class="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
            <div v-for="n in 3" :key="n" class="h-[260px] rounded-[20px] skeleton-shimmer" />
        </div>

        <!-- ── Grid de sedes ─────────────────────────────────────── -->
        <div v-else class="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
            <div v-for="(sede, i) in sedes" :key="sede.IdEstacionamiento"
                class="rounded-[20px] p-5 flex flex-col gap-3.5 transition-all duration-200 hover:-translate-y-1 card-in cursor-default"
                :class="sede.Estado ? 'bg-[#f0faf4] border-2 border-[#c8e6c9]' : 'bg-[#fafafa] border-2 border-gray-200'"
                style="box-shadow: 0 5px 0 #b6d9c2, 0 2px 18px rgba(13,41,28,0.10);"
                :style="{ animationDelay: `${i * 60}ms` }">

                <!-- Card header -->
                <div class="flex items-start justify-between gap-2.5">
                    <div class="flex items-center gap-2.5">
                        <div class="w-[44px] h-[44px] rounded-xl flex items-center justify-center flex-shrink-0 text-[1.1rem] font-black"
                            :class="sede.Estado ? 'bg-[#0D291C] text-[#7FD344]' : 'bg-gray-300 text-white'">
                            {{ sede.Nombre?.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <h2 class="text-base font-extrabold leading-tight"
                                :class="sede.Estado ? 'text-[#0D291C]' : 'text-gray-400'">
                                {{ sede.Nombre }}
                            </h2>
                            <span class="text-[0.68rem] font-semibold"
                                :class="sede.Estado ? 'text-[#299261]' : 'text-gray-400'">
                                #{{ sede.IdEstacionamiento }}
                            </span>
                        </div>
                    </div>
                    <span :class="[
                        'inline-flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0',
                        sede.Estado ? 'bg-[#0D291C] text-[#7FD344]' : 'bg-gray-200 text-gray-400'
                    ]">
                        <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0',
                            sede.Estado ? 'bg-[#7FD344] badge-pulse' : 'bg-gray-400']" />
                        {{ sede.Estado ? 'Activa' : 'Inactiva' }}
                    </span>
                </div>

                <!-- Disponibilidades -->
                <div v-if="sede.T_Disponibilidades?.length" class="flex flex-col gap-2">
                    <div v-for="d in sede.T_Disponibilidades" :key="d.IdTipoVehiculo"
                        class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 border"
                        :class="sede.Estado ? 'bg-white border-[#d1fae5]' : 'bg-gray-50 border-gray-200'">
                        <AppIcon :name="d.IdTipoVehiculo === '1' ? 'car-side' : 'two_wheeler'" :size="18"
                            class="flex-shrink-0 text-[#0D291C]"
                            :class="sede.Estado ? 'text-[#0D291C]' : 'text-gray-400'" />
                        <div class="flex-1 flex flex-col gap-1">
                            <div class="flex items-center justify-between">
                                <span class="text-[0.72rem] font-bold"
                                    :class="sede.Estado ? 'text-[#0D291C]' : 'text-gray-400'">
                                    {{ d.Mensualidades }} / {{ d.Total }}
                                </span>
                                <span class="text-[0.62rem] font-bold"
                                    :class="sede.Estado ? 'text-[#299261]' : 'text-gray-400'">
                                    {{ d.Total > 0 ? Math.round((d.Mensualidades / d.Total) * 100) : 0 }}%
                                </span>
                            </div>
                            <div class="h-[5px] rounded-full overflow-hidden"
                                :class="sede.Estado ? 'bg-[#d1fae5]' : 'bg-gray-200'">
                                <div class="h-full rounded-full transition-all duration-500" :class="pctClass(d)"
                                    :style="{ width: `${d.Total > 0 ? Math.round((d.Mensualidades / d.Total) * 100) : 0}%` }" />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else
                    class="text-[0.72rem] text-gray-400 font-semibold text-center py-2 bg-white/60 rounded-xl border border-dashed border-gray-200">
                    Sin disponibilidades configuradas
                </div>

                <!-- Tarjetas requeridas -->
                <div class="flex gap-1.5 flex-wrap">
                    <span :class="['inline-flex items-center gap-1 text-[0.65rem] font-bold px-2.5 py-1 rounded-full border',
                        sede.RequiereTarjetaCarro
                            ? 'bg-white border-[#a7f3d0] text-[#065f46]'
                            : 'bg-white border-gray-200 text-gray-400']">
                        <AppIcon name="car-side" :size="14" />
                        {{ sede.RequiereTarjetaCarro ? 'Con tarjeta' : 'Sin tarjeta' }}
                    </span>
                    <span :class="['inline-flex items-center gap-1 text-[0.65rem] font-bold px-2.5 py-1 rounded-full border',
                        sede.RequiereTarjetaMoto
                            ? 'bg-white border-[#a7f3d0] text-[#065f46]'
                            : 'bg-white border-gray-200 text-gray-400']">
                        <AppIcon name="two_wheeler" :size="14" />
                        {{ sede.RequiereTarjetaMoto ? 'Con tarjeta' : 'Sin tarjeta' }}
                    </span>
                </div>

                <!-- Host -->
                <div class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 overflow-hidden border"
                    :class="sede.Estado ? 'bg-white border-[#d1fae5]' : 'bg-gray-50 border-gray-200'">
                    <svg class="flex-shrink-0" :class="sede.Estado ? 'fill-[#299261]' : 'fill-gray-400'"
                        xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    <span class="text-[0.65rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
                        :class="sede.Estado ? 'text-[#299261]' : 'text-gray-400'">
                        {{ sede.AppHost ?? '—' }}
                    </span>
                </div>

                <!-- Acciones -->
                <div class="flex gap-2 mt-auto pt-1">
                    <button v-permission="PERMS.SEDES_EDITAR" @click="abrirEdicion(sede)"
                        class="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-[0.78rem] font-bold cursor-pointer transition-all duration-150 border-2"
                        :class="sede.Estado
                            ? 'bg-[#0D291C] text-[#7FD344] border-[#0D291C] hover:bg-[#299261] hover:border-[#299261] hover:text-white'
                            : 'bg-gray-200 text-gray-500 border-gray-200 hover:bg-gray-300'">
                        <AppIcon name="edit_square" :size="20" class="text-[#7FD344] " />

                        Editar
                    </button>
                    <button v-permission="PERMS.SEDES_INACTIVAR" @click="toggleEstado(sede)"
                        class="flex-1 flex items-center justify-center gap-1.5 border-2 rounded-xl py-2.5 px-3 text-[0.78rem] font-bold cursor-pointer transition-all duration-150"
                        :class="sede.Estado
                            ? 'border-red-200 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 hover:border-red-300'
                            : 'border-[#c8e6c9] bg-[#f0faf4] text-[#299261] hover:bg-[#dcfce7]'">
                        <AppIcon :name="sede.Estado ? 'account_circle_off' : 'verified'" :size="15" />

                        {{ sede.Estado ? 'Inactivar' : 'Activar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Panel sede ───────────────────────────────────────── -->
        <AsideEditar v-model="sedeEditando" :titulo="esNueva ? 'Nueva sede' : (sedeEditando?.Nombre ?? 'Sede')"
            :subtitulo="esNueva ? 'Completa los datos requeridos' : `Editando #${sedeEditando?.IdEstacionamiento}`"
            :label-guardar="esNueva ? 'Crear sede' : 'Guardar cambios'" :loading="guardando" :error="errGuardar"
            @guardar="guardar" @update:modelValue="v => { if (!v) cerrarPanel() }">

            <!-- Nombre -->
            <div class="flex flex-col gap-1.5">
                <label class="aside-field-label">Nombre de la sede <span class="text-red-400">*</span></label>
                <input v-model="form.Nombre" type="text" placeholder="Ej: Sede Norte" class="aside-field-input" />
            </div>

            <!-- AppHost -->
            <div class="flex flex-col gap-1.5">
                <label class="aside-field-label">App Host <span class="text-red-400">*</span></label>
                <input v-model="form.AppHost" type="text" placeholder="" class="aside-field-input" />
            </div>

            <!-- ApiKey -->
            <div class="flex flex-col gap-1.5">
                <label class="aside-field-label">API Key</label>
                <div class="relative flex items-center">
                    <input v-model="form.ApiKey" :type="mostrarApiKey ? 'text' : 'password'" placeholder=""
                        class="aside-field-input pr-10" />
                    <button type="button" @click="mostrarApiKey = !mostrarApiKey"
                        class="absolute right-2.5 bg-transparent border-none cursor-pointer p-1 flex items-center [&>svg]:fill-gray-400 hover:[&>svg]:fill-[#299261]">
                        <svg v-if="!mostrarApiKey" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
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

            <!-- ── Solo nueva sede ──────────────────────────────── -->
            <template v-if="esNueva">

                <!-- ID + Dirección -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">ID Estacionamiento <span class="text-red-400">*</span></label>
                        <input v-model.number="form.IdEstacionamiento" type="number" min="1" placeholder=""
                            class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Dirección <span class="text-red-400">*</span></label>
                        <input v-model="form.Direccion" type="text" placeholder="" class="aside-field-input" />
                    </div>
                </div>

                <!-- Requiere tarjeta -->
                <div class="flex flex-col gap-2">
                    <label class="aside-field-label">Requiere tarjeta <span class="text-red-400">*</span></label>
                    <div class="flex gap-3 p-3 bg-white rounded-xl border-2 border-gray-200">
                        <label
                            :class="['flex items-center gap-2 cursor-pointer select-none flex-1 px-3 py-2.5 rounded-xl border-2 transition-all duration-150',
                                form.RequiereTarjetaCarro ? 'bg-[#0D291C] border-[#0D291C]' : 'bg-gray-50 border-gray-200 hover:border-gray-300']">
                            <input type="checkbox" v-model="form.RequiereTarjetaCarro" class="hidden" />
                            <AppIcon name="car-side" :size="14" class="flex-shrink-0"
                                :class="form.RequiereTarjetaCarro ? 'text-[#7FD344]' : 'text-gray-400'" />
                            <span
                                :class="['text-[0.8rem] font-bold', form.RequiereTarjetaCarro ? 'text-[#7FD344]' : 'text-gray-500']">
                                Carros
                            </span>
                            <span v-if="form.RequiereTarjetaCarro"
                                class="ml-auto text-[#7FD344] text-[0.7rem] font-black">✓</span>
                        </label>
                        <label
                            :class="['flex items-center gap-2 cursor-pointer select-none flex-1 px-3 py-2.5 rounded-xl border-2 transition-all duration-150',
                                form.RequiereTarjetaMoto ? 'bg-[#0D291C] border-[#0D291C]' : 'bg-gray-50 border-gray-200 hover:border-gray-300']">
                            <input type="checkbox" v-model="form.RequiereTarjetaMoto" class="hidden" />
                            <AppIcon name="two_wheeler" :size="14" class="flex-shrink-0"
                                :class="form.RequiereTarjetaMoto ? 'text-[#7FD344]' : 'text-gray-400'" />
                            <span
                                :class="['text-[0.8rem] font-bold', form.RequiereTarjetaMoto ? 'text-[#7FD344]' : 'text-gray-500']">
                                Motos
                            </span>
                            <span v-if="form.RequiereTarjetaMoto"
                                class="ml-auto text-[#7FD344] text-[0.7rem] font-black">✓</span>
                        </label>
                    </div>
                </div>

                <!-- Opcionales -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Teléfono</label>
                        <input v-model="form.Telefono" type="text" placeholder="" class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Email</label>
                        <input v-model="form.Email" type="email" placeholder="" class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">Persona contacto</label>
                        <input v-model="form.PersonaContacto" type="text" placeholder="" class="aside-field-input" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="aside-field-label">App Liquidador</label>
                        <input v-model="form.AppLiquidador" type="text" placeholder="http://..."
                            class="aside-field-input" />
                    </div>
                </div>

                <div class="border-t-2 border-dashed border-gray-200" />

            </template>

            <!-- ── Solo edición: tarjeta solo lectura ──────────── -->
            <div v-else class="flex gap-2.5 p-3.5 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <AppIcon name="warning" :size="14" class="flex-shrink-0 mt-0.5 text-amber-500" />

                <div>
                    <p class="text-[0.72rem] font-bold text-amber-700">Requiere tarjeta (solo lectura)</p>
                    <p class="text-[0.68rem] text-amber-600 mt-1 flex items-center gap-2 flex-wrap">
                        <span class="inline-flex items-center gap-1">
                            <AppIcon name="car-side" :size="14" />
                            Carros: {{ sedeEditando?.RequiereTarjetaCarro ? 'Sí' : 'No' }}
                        </span>
                        <span class="opacity-40">·</span>
                        <span class="inline-flex items-center gap-1">
                            <AppIcon name="two_wheeler" :size="14" />
                            Motos: {{ sedeEditando?.RequiereTarjetaMoto ? 'Sí' : 'No' }}
                        </span>
                    </p>
                    <p class="text-[0.65rem] text-amber-500 mt-1">Configurable solo desde el backend.</p>
                </div>
            </div>

            <!-- Disponibilidades -->
            <div class="flex flex-col gap-2">
                <label class="aside-field-label">Disponibilidades</label>
                <div class="flex flex-col gap-2.5">
                    <div v-for="(d, idx) in form.T_Disponibilidades" :key="d.IdTipoVehiculo"
                        class="bg-white border-2 border-gray-200 rounded-xl p-3.5 flex flex-col gap-2.5">

                        <!-- Tipo vehículo -->
                        <div class="flex items-center gap-2 pb-1 border-b border-gray-100">
                            <AppIcon :name="d.IdTipoVehiculo === '1' ? 'car-side' : 'two_wheeler'" :size="18"
                                class="text-[#0D291C]" />
                            <span class="text-[0.78rem] font-black text-[#0D291C]">
                                {{ d.IdTipoVehiculo === '1' ? 'Carros' : 'Motos' }}
                            </span>
                        </div>

                        <!-- Inputs -->
                        <div class="grid grid-cols-2 gap-2.5">
                            <div class="flex flex-col gap-1">
                                <label class="aside-field-label">Total</label>
                                <input v-model.number="form.T_Disponibilidades[idx].Total" type="number" min="0"
                                    class="aside-field-input" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="aside-field-label">Mensualidades</label>
                                <input v-model.number="form.T_Disponibilidades[idx].Mensualidades" type="number" min="0"
                                    :max="form.T_Disponibilidades[idx].Total" class="aside-field-input" />
                            </div>
                        </div>

                        <!-- Barra progreso -->
                        <div class="flex items-center gap-2">
                            <div class="flex-1 h-[5px] bg-[#d1fae5] rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-300" :class="pctClass(d)"
                                    :style="{ width: d.Total > 0 ? `${Math.min(Math.round((d.Mensualidades / d.Total) * 100), 100)}%` : '0%' }" />
                            </div>
                            <span
                                class="text-[0.62rem] font-bold text-gray-400 whitespace-nowrap min-w-[60px] text-right">
                                {{ d.Total > 0 ? Math.min(Math.round((d.Mensualidades / d.Total) * 100), 100) : 0 }}%
                                ocupado
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </AsideEditar>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { PERMS } from '@/constants/permisions'
import SedesService from '@/api/services/sedes.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'

// ── Estado ─────────────────────────────────────────────────────────
const sedes = ref([])
const loading = ref(true)
const guardando = ref(false)
const errGuardar = ref('')
const mostrarApiKey = ref(false)
const sedeEditando = ref(null)
const esNueva = ref(false)

const form = reactive({
    // Compartidos editar + nueva
    Nombre: '',
    AppHost: '',
    ApiKey: '',
    T_Disponibilidades: [],
    // Solo nueva sede (POST)
    IdEstacionamiento: null,
    Direccion: '',
    Telefono: '',
    Email: '',
    PersonaContacto: '',
    AppLiquidador: '',
    RequiereTarjetaCarro: false,
    RequiereTarjetaMoto: false,
})

// ── Helpers ────────────────────────────────────────────────────────
const pctClass = (d) => {
    if (!d.Total) return 'bg-[#7FD344]'
    const p = (d.Mensualidades / d.Total) * 100
    if (p >= 90) return 'bg-[#dc2626]'
    if (p >= 70) return 'bg-[#f59e0b]'
    return 'bg-[#7FD344]'
}

const dispDefaults = (existente = []) => {
    const find = (id) => existente.find(d => String(d.IdTipoVehiculo) === String(id))
    return [
        { IdTipoVehiculo: '1', Total: Number(find('1')?.Total ?? 0), Mensualidades: Number(find('1')?.Mensualidades ?? 0) },
        { IdTipoVehiculo: '2', Total: Number(find('2')?.Total ?? 0), Mensualidades: Number(find('2')?.Mensualidades ?? 0) },
    ]
}

// ── Carga ──────────────────────────────────────────────────────────
const cargarSedes = async () => {
    loading.value = true
    try {
        sedes.value = await SedesService.getAll()
    } catch (e) {
        console.error('Error cargando sedes:', e)
    } finally {
        loading.value = false
    }
}

onMounted(cargarSedes)

// ── Panel ──────────────────────────────────────────────────────────
const abrirEdicion = (sede) => {
    esNueva.value = false
    sedeEditando.value = sede
    mostrarApiKey.value = false
    errGuardar.value = ''
    form.Nombre = sede.Nombre ?? ''
    form.AppHost = sede.AppHost ?? ''
    form.ApiKey = sede.ApiKey ?? ''
    form.T_Disponibilidades = dispDefaults(sede.T_Disponibilidades)
}

const abrirNueva = () => {
    esNueva.value = true
    sedeEditando.value = { IdEstacionamiento: null }
    mostrarApiKey.value = true
    errGuardar.value = ''
    Object.assign(form, {
        Nombre: '', AppHost: '', ApiKey: '',
        T_Disponibilidades: dispDefaults(),
        IdEstacionamiento: null,
        Direccion: '',
        Telefono: '',
        Email: '',
        PersonaContacto: '',
        AppLiquidador: '',
        RequiereTarjetaCarro: false,
        RequiereTarjetaMoto: false,
    })
}

const cerrarPanel = () => {
    sedeEditando.value = null
    guardando.value = false
    errGuardar.value = ''
}

// ── Guardar ────────────────────────────────────────────────────────
const guardar = async () => {
    errGuardar.value = ''

    // Validación mínima
    if (!form.Nombre || !form.AppHost) {
        errGuardar.value = 'Nombre y App Host son obligatorios.'
        return
    }
    if (esNueva.value && (!form.IdEstacionamiento || !form.Direccion)) {
        errGuardar.value = 'ID Estacionamiento y Dirección son obligatorios.'
        return
    }

    guardando.value = true
    try {
        const id = sedeEditando.value?.IdEstacionamiento

        if (esNueva.value) {
            const dtoNueva = {
                IdEstacionamiento: Number(form.IdEstacionamiento),
                Nombre: form.Nombre,
                AppHost: form.AppHost,
                Direccion: form.Direccion,
                RequiereTarjetaCarro: form.RequiereTarjetaCarro,
                RequiereTarjetaMoto: form.RequiereTarjetaMoto,
                ...(form.ApiKey && { ApiKey: form.ApiKey }),
                ...(form.AppLiquidador && { AppLiquidador: form.AppLiquidador }),
                ...(form.Email && { Email: form.Email }),
                ...(form.PersonaContacto && { PersonaContacto: form.PersonaContacto }),
                ...(form.Telefono && { Telefono: form.Telefono }),
            }
            await SedesService.create(dtoNueva)

            const newId = Number(form.IdEstacionamiento)
            for (const d of form.T_Disponibilidades) {
                await SedesService.updateDisponibilidad(newId, d.IdTipoVehiculo, {
                    Total: Number(d.Total),
                    Mensualidades: Number(d.Mensualidades),
                })
            }

            await cargarSedes()
            cerrarPanel()
            return
        }

        // ── Edición ───────────────────────────────────────────────
        await SedesService.update(id, {
            Nombre: form.Nombre,
            AppHost: form.AppHost,
            ApiKey: form.ApiKey,
        })

        for (const d of form.T_Disponibilidades) {
            await SedesService.updateDisponibilidad(id, d.IdTipoVehiculo, {
                Total: Number(d.Total),
                Mensualidades: Number(d.Mensualidades),
            })
        }

        // Actualización local optimista
        const idx = sedes.value.findIndex(s => s.IdEstacionamiento === id)
        if (idx !== -1) {
            sedes.value[idx] = {
                ...sedes.value[idx],
                Nombre: form.Nombre,
                AppHost: form.AppHost,
                ApiKey: form.ApiKey,
                T_Disponibilidades: form.T_Disponibilidades.map(d => ({ ...d })),
            }
        }

        cerrarPanel()
    } catch (e) {
        const msg = e.response?.data?.message
        errGuardar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar. Revisa la consola.')
        console.error('[Sedes] error:', e.response?.data ?? e.message)
    } finally {
        guardando.value = false
    }
}

// ── Toggle estado ──────────────────────────────────────────────────
const toggleEstado = async (sede) => {
    try {
        await SedesService.update(sede.IdEstacionamiento, { Estado: !sede.Estado })
        sede.Estado = !sede.Estado
    } catch (e) {
        console.error('Error cambiando estado:', e)
    }
}
</script>

<style scoped>
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

.svg-icon :deep(svg) {
    width: 14px;
    height: 14px;
    display: inline-block;
    vertical-align: middle;
    fill: currentColor;
    flex-shrink: 0;
}

.svg-icon-lg :deep(svg) {
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: middle;
    fill: currentColor;
    flex-shrink: 0;
}

.field-input {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.88rem;
    color: #0D291C;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    background-color: #f9fafb;
    transition: border-color 0.15s, background-color 0.15s;
}

.field-input:focus {
    border-color: #299261;
    background-color: white;
}

.field-input-mini {
    padding-top: 7px;
    padding-bottom: 7px;
    font-size: 0.82rem;
}

.skeleton-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.card-in {
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.badge-pulse {
    animation: pulseDot 1.5s infinite;
}

@keyframes pulseDot {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
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

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.25s;
}

.panel-enter-from,
.panel-leave-to {
    transform: translateX(100%);
}

.panel-enter-active,
.panel-leave-active {
    transition: transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1);
}

@media (max-width: 500px) {

    .panel-enter-from,
    .panel-leave-to {
        transform: translateY(100%);
    }
}
</style>