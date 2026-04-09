<template>
    <BaseModal v-model="isOpen" :title="paso === 1 ? 'Elige tu sede' : 'Añadir mensualidad'"
        :subtitle="paso === 1 ? 'Selecciona donde tienes tu mensualidad' : sedeSeleccionada?.Nombre ?? ''"
        :size="paso === 1 ? 'lg' : 'md'" :confirm-label="paso === 1 ? 'Continuar' : 'Agregar mensualidad'"
        :confirm-disabled="(paso === 1 && !sedeSeleccionada) ||
            (paso === 2 && (!fC.Codigo.trim() || !fC.Placa1.trim() || !fC.NombreApellidos.trim() || !fC.Telefono.trim() || !fC.Email.trim())) ||
            guardando" :loading="guardando" :show-cancel="true" cancel-label="Cancelar"
        @confirm="() => paso === 1 ? irPaso2() : confirmar()" @update:modelValue="v => { if (!v) resetear() }">

        <template #icon>
            <div
                class="w-9 h-9 rounded-xl bg-[#0D291C] border border-[#7FD344]/30 flex items-center justify-center flex-shrink-0">
                <svg v-if="paso === 1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                    viewBox="0 0 24 24">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                    viewBox="0 0 24 24">
                    <path
                        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
                </svg>
            </div>
        </template>

        <!-- ── PASO 1: Selección de sede ── -->
        <template v-if="paso === 1">
            <div class="px-5 py-4">

                <!-- Loading sedes -->
                <div v-if="loadingSedes" class="grid grid-cols-3 gap-2.5">
                    <div v-for="n in 6" :key="n" class="h-[100px] rounded-2xl bg-gray-100 animate-pulse" />
                </div>

                <!-- Grid sedes -->
                <div v-else class="grid grid-cols-3 gap-2.5">
                    <div v-if="sedes.length === 0"
                        class="col-span-3 flex flex-col items-center gap-2 py-10 text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span class="text-sm font-semibold">No hay sedes disponibles</span>
                    </div>

                    <div v-for="sede in sedes" :key="sede.IdEstacionamiento" @click="sedeSeleccionada = sede"
                        class="relative flex flex-col items-center gap-2 px-2 py-4 rounded-2xl border-2 cursor-pointer transition-all"
                        :class="sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento
                            ? 'border-[#299261] bg-[#f0fdf4] shadow-[0_0_0_3px_rgba(41,146,97,0.1)]'
                            : 'border-gray-200 bg-gray-50 hover:border-[#b8e6cc] hover:bg-[#f0fdf4]'">

                        <!-- Check -->
                        <div class="absolute top-2 right-2 w-[18px] h-[18px] rounded-full bg-[#299261] flex items-center justify-center transition-all"
                            :class="sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-50'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white"
                                viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>

                        <!-- Icono -->
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all"
                            :class="sedeSeleccionada?.IdEstacionamiento === sede.IdEstacionamiento
                                ? 'bg-[#299261] border-[#299261] text-white'
                                : 'bg-white border-gray-200 text-gray-400'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>

                        <p class="text-[0.72rem] font-black text-[#232B3A] text-center leading-tight">{{ sede.Nombre }}
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <!-- ── PASO 2: Formulario ── -->
        <template v-else>
            <div class="flex flex-col gap-4 px-5 py-4">

                <!-- Botón volver -->
                <button @click="paso = 1"
                    class="self-start flex items-center gap-1.5 text-[0.7rem] font-black text-gray-400 hover:text-[#299261] transition-colors cursor-pointer border-none bg-transparent p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    Cambiar sede
                </button>

                <!-- Sede seleccionada -->
                <div class="flex items-center gap-2.5 px-3 py-2.5 bg-[#f0fdf4] border-2 border-[#c8e6c9] rounded-xl">
                    <div class="w-7 h-7 rounded-lg bg-[#299261] flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="white" viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                    </div>
                    <span class="text-[0.82rem] font-black text-[#0D291C]">{{ sedeSeleccionada?.Nombre }}</span>
                </div>

                <!-- Código -->
                <div class="flex flex-col gap-[5px]">
                    <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">
                        Código de verificación *
                    </label>
                    <input v-model="fC.Codigo" type="text"
                        class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-base text-center font-mono tracking-[0.1em] text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full uppercase"
                        placeholder="265..." maxlength="30" @input="fC.Codigo = fC.Codigo.toUpperCase()" />
                    <p class="text-[0.7rem] text-gray-500 pl-0.5">El código es entregado por el administrador.</p>
                </div>

                <!-- Datos personales (prellenados del auth, editables) -->
                <p
                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-gray-200 pb-[5px]">
                    Tus datos
                </p>

                <div class="flex flex-col gap-[5px]">
                    <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">Nombre y
                        apellidos *</label>
                    <input v-model="fC.NombreApellidos" type="text"
                        class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                        placeholder="Jua..." maxlength="100" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-[5px]">
                        <label
                            class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">Teléfono
                            *</label>
                        <input v-model="fC.Telefono" type="tel"
                            class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                            placeholder="300..." maxlength="15" />
                    </div>
                    <div class="flex flex-col gap-[5px]">
                        <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">Email
                            *</label>
                        <input v-model="fC.Email" type="email"
                            class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                            placeholder="cor..." maxlength="100" />
                    </div>
                </div>

                <p
                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-gray-200 pb-[5px]">
                    Datos del vehículo
                </p>

                <!-- Placas -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-[5px]">
                        <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">Placa
                            principal *</label>
                        <input v-model="fC.Placa1" type="text" maxlength="7"
                            class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black tracking-[0.1em] text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full uppercase"
                            placeholder="ABC..." @input="fC.Placa1 = fC.Placa1.toUpperCase()" />
                    </div>
                    <div class="flex flex-col gap-[5px]">
                        <label class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">
                            Placa 2 <span class="normal-case opacity-60 font-semibold">(opcional)</span>
                        </label>
                        <input v-model="fC.Placa2" type="text" maxlength="7"
                            class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black tracking-[0.1em] text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full uppercase"
                            placeholder="XYZ..." @input="fC.Placa2 = fC.Placa2.toUpperCase()" />
                    </div>
                </div>

                <!-- Empresa (opcional) -->
                <p
                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#0D291C] opacity-60 border-b border-gray-200 pb-[5px]">
                    Datos empresa <span class="normal-case font-semibold opacity-60">(opcional)</span>
                </p>
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-[5px]">
                        <label
                            class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">NIT</label>
                        <input v-model="fC.Nit" type="text"
                            class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                            placeholder="900...." maxlength="20" />
                    </div>
                    <div class="flex flex-col gap-[5px]">
                        <label
                            class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-gray-700 pl-0.5">Empresa</label>
                        <input v-model="fC.NombreEmpresa" type="text"
                            class="bg-white border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0D291C] outline-none focus:border-[#299261] focus:ring-2 focus:ring-[#299261]/15 transition-all w-full"
                            placeholder="Empr..." maxlength="80" />
                    </div>
                </div>

                <!-- Error / Éxito -->
                <div v-if="error"
                    class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                    ⚠ {{ error }}
                </div>
                <div v-if="exito"
                    class="flex items-center gap-2 px-3 py-2.5 bg-[#f0faf4] border border-[#c8e6c9] rounded-xl text-[0.76rem] font-bold text-[#299261]">
                    ✓ {{ exito }}
                </div>
            </div>
        </template>

    </BaseModal>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { showError, showSuccess } from '@/utils/swal'

import BaseModal from '@/components/modals/BaseModal.vue'
import MensualidadesService from '@/api/services/mensualidades.service'
import SedesService from '@/api/services/sedes.service'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
    modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'confirmado'])

const authStore = useAuthStore()

// ── Estado ─────────────────────────────────────
const paso = ref(1)
const sedes = ref([])
const loadingSedes = ref(false)
const sedeSeleccionada = ref(null)
const guardando = ref(false)
const error = ref('')
const exito = ref('')

const isOpen = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const fC = reactive({
    Codigo: '',
    NombreApellidos: '',
    Telefono: '',
    Email: '',
    Placa1: '',
    Placa2: '',
    Nit: '',
    NombreEmpresa: '',
})


// ── Cargar sedes al abrir ──────────────────────
watch(() => props.modelValue, async (v) => {
    if (v) {
        await cargarSedes()
    } else {
        resetear()
    }
})

const cargarSedes = async () => {
    if (sedes.value.length) return  // ya cargadas
    loadingSedes.value = true
    try {
        const res = await SedesService.getAll()
        sedes.value = (Array.isArray(res) ? res : []).filter(s => s.Estado)
    } catch {
        sedes.value = []
    } finally {
        loadingSedes.value = false
    }
}

// ── Navegación entre pasos ─────────────────────
const irPaso2 = () => {
    if (!sedeSeleccionada.value) return
    error.value = ''
    // Prellenar con datos del auth
    const u = authStore.user
    fC.NombreApellidos = `${u?.nombres ?? u?.Nombres ?? ''} ${u?.apellidos ?? u?.Apellidos ?? ''}`.trim()
    fC.Telefono = String(u?.telefono ?? u?.Telefono ?? '')
    fC.Email = String(u?.email ?? u?.Email ?? '')
    paso.value = 2
}
// ── Reset ──────────────────────────────────────
const resetear = () => {
    paso.value = 1
    sedeSeleccionada.value = null
    Object.assign(fC, { Codigo: '', NombreApellidos: '', Telefono: '', Email: '', Placa1: '', Placa2: '', Nit: '', NombreEmpresa: '' })
    error.value = ''
    exito.value = ''
}

// ── Confirmar ──────────────────────────────────
const confirmar = async () => {
    error.value = ''
    exito.value = ''

    if (!fC.Codigo.trim()) { error.value = 'El código es obligatorio.'; return }
    if (!fC.Placa1.trim()) { error.value = 'La placa principal es obligatoria.'; return }
    if (!fC.NombreApellidos.trim()) { error.value = 'El nombre es obligatorio.'; return }
    if (!fC.Telefono.trim()) { error.value = 'El teléfono es obligatorio.'; return }
    if (!fC.Email.trim()) { error.value = 'El email es obligatorio.'; return }

    const u = authStore.user
    const payload = {
        Codigo: fC.Codigo.trim().toUpperCase(),
        Documento: Number(u?.documento ?? u?.Documento),
        Email: fC.Email.trim(),
        IdEstacionamiento: Number(sedeSeleccionada.value.IdEstacionamiento),
        NombreApellidos: fC.NombreApellidos.trim(),
        Placa1: fC.Placa1.trim().toUpperCase(),
        Telefono: fC.Telefono.trim(),
        ...(fC.Placa2.trim() && { Placa2: fC.Placa2.trim().toUpperCase() }),
        ...(fC.Nit.trim() && { Nit: fC.Nit.trim() }),
        ...(fC.NombreEmpresa.trim() && { NombreEmpresa: fC.NombreEmpresa.trim() }),
    }

    console.log('Payload a enviar:', payload)

    guardando.value = true
    try {
        const res = await MensualidadesService.agregarMensualidad(payload)

        if (res?.error) {
            showError({ status: res.status, data: res.data })
            return
        }

        await showSuccess('¡Mensualidad agregada!', 'Ya aparece en tu listado.')
        emit('confirmado')
        isOpen.value = false

    } catch (e) {
        showError({ status: e?.response?.status, data: e?.response?.data })
    } finally {
        guardando.value = false
    }
}
</script>