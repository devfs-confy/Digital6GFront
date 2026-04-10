<template>
    <div class="flex flex-col gap-6 min-h-full pb-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Información Personal</h2>
            <button
                class="cursor-none pointer-events-none flex items-center gap-1.5 bg-transparent text-transparent text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline"></span>
            </button>
        </div>

        <!-- Avatar + nombre -->
        <div
            class="relative overflow-hidden bg-[#0D291C] rounded-3xl p-7 flex items-center gap-5 flex-wrap
                    before:content-[''] before:absolute before:-top-10 before:-right-10 before:w-[180px] before:h-[180px] before:rounded-full before:bg-[rgba(127,211,68,0.07)]
                    after:content-[''] after:absolute after:-bottom-[60px] after:-left-5 after:w-[200px] after:h-[200px] after:rounded-full after:bg-[rgba(127,211,68,0.05)]">
            <div class="relative flex-shrink-0">
                <span
                    class="w-[72px] h-[72px] rounded-[22px] bg-[#7FD344] text-[#0D291C] text-[1.6rem] font-black flex items-center justify-center relative z-10">
                    {{ iniciales }}
                </span>
                <div
                    class="absolute -inset-1 rounded-[26px] border-2 border-[rgba(127,211,68,0.3)] pointer-events-none" />
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-xl font-black text-white leading-tight">{{ form.nombre }} {{ form.apellido }}</h3>
                <span class="block text-xs font-bold text-white/45 mt-1">{{ form.tipoDoc }} · {{ form.documento
                    }}</span>
            </div>
            <div
                class="inline-flex items-center gap-1.5 bg-[rgba(127,211,68,0.12)] border border-[rgba(127,211,68,0.25)] rounded-full px-3.5 py-1.5 text-[0.72rem] font-extrabold text-[#7FD344] whitespace-nowrap">
                <span class="w-1.5 h-1.5 rounded-full bg-[#7FD344] animate-pulse" />
                Cliente activo
            </div>
        </div>

        <!-- Secciones -->
        <div class="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">

            <!-- Datos personales -->
            <div class="bg-white rounded-[22px] p-[22px] flex flex-col gap-[18px] border-2 border-gray-100"
                style="box-shadow: 0 4px 0 #e8f5e9; animation: card-anim-kf 0.35s cubic-bezier(0.34,1.2,0.64,1) both; animation-delay: 0s">
                <div class="flex items-center gap-3.5">
                    <div
                        class="w-[42px] h-[42px] rounded-[14px] bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="text-[0.95rem] font-black text-[#0D291C]">Datos personales</h4>
                        <p class="text-[0.68rem] text-gray-400 font-semibold mt-0.5">Nombre, apellido e identificación
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3.5 max-[560px]:grid-cols-1">
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Nombre</label>
                        <div class="flex items-center bg-gray-50 border-2 border-gray-200 rounded-[14px] px-3.5 py-0.5 transition-all duration-200"
                            :class="editing.nombre ? 'border-[#299261] bg-white shadow-[0_0_0_3px_rgba(41,146,97,0.1)]' : ''">
                            <input v-model="form.nombre" :disabled="!editing.nombre"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 min-w-0 w-full disabled:text-gray-500 disabled:cursor-default"
                                placeholder="Tu nombre" />
                            <button @click="toggleEdit('nombre')"
                                class="w-[34px] h-[34px] rounded-[10px] border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors">
                                <span v-if="!editing.nombre" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Apellido</label>
                        <div class="flex items-center bg-gray-50 border-2 border-gray-200 rounded-[14px] px-3.5 py-0.5 transition-all duration-200"
                            :class="editing.apellido ? 'border-[#299261] bg-white shadow-[0_0_0_3px_rgba(41,146,97,0.1)]' : ''">
                            <input v-model="form.apellido" :disabled="!editing.apellido"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 min-w-0 w-full disabled:text-gray-500 disabled:cursor-default"
                                placeholder="Tu apellido" />
                            <button @click="toggleEdit('apellido')"
                                class="w-[34px] h-[34px] rounded-[10px] border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors">
                                <span v-if="!editing.apellido" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Número de
                            documento</label>
                        <div class="flex items-center bg-gray-50 border-2 border-gray-200 rounded-[14px] px-3.5 py-0.5">
                            <input v-model="form.documento" :disabled="!editing.documento"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 min-w-0 w-full disabled:text-gray-500 disabled:cursor-default"
                                placeholder="Número de documento" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contacto -->
            <div class="bg-white rounded-[22px] p-[22px] flex flex-col gap-[18px] border-2 border-gray-100"
                style="box-shadow: 0 4px 0 #e8f5e9; animation: card-anim-kf 0.35s cubic-bezier(0.34,1.2,0.64,1) both; animation-delay: 0.08s">
                <div class="flex items-center gap-3.5">
                    <div
                        class="w-[42px] h-[42px] rounded-[14px] bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="text-[0.95rem] font-black text-[#0D291C]">Contacto</h4>
                        <p class="text-[0.68rem] text-gray-400 font-semibold mt-0.5">Correo electrónico y teléfono</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3.5 max-[560px]:grid-cols-1">
                    <div class="flex flex-col gap-1.5 col-span-2">
                        <label class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Correo
                            electrónico</label>
                        <div class="flex items-center bg-gray-50 border-2 border-gray-200 rounded-[14px] px-3.5 py-0.5 transition-all duration-200"
                            :class="editing.correo ? 'border-[#299261] bg-white shadow-[0_0_0_3px_rgba(41,146,97,0.1)]' : ''">
                            <input v-model="form.correo" :disabled="!editing.correo" type="email"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 min-w-0 w-full disabled:text-gray-500 disabled:cursor-default"
                                placeholder="correo@ejemplo.com" />
                            <button @click="toggleEdit('correo')"
                                class="w-[34px] h-[34px] rounded-[10px] border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors">
                                <span v-if="!editing.correo" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5 col-span-2">
                        <label
                            class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Teléfono</label>
                        <div class="flex items-center bg-gray-50 border-2 border-gray-200 rounded-[14px] px-3.5 py-0.5 transition-all duration-200"
                            :class="editing.telefono ? 'border-[#299261] bg-white shadow-[0_0_0_3px_rgba(41,146,97,0.1)]' : ''">
                            <span
                                class="text-[0.82rem] font-extrabold text-gray-400 pr-2 border-r border-r-gray-200 flex-shrink-0">+57</span>
                            <input v-model="form.telefono" :disabled="!editing.telefono" type="tel"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 pl-1.5 min-w-0 w-full disabled:text-gray-500 disabled:cursor-default"
                                placeholder="300 000 0000" maxlength="10" />
                            <button @click="toggleEdit('telefono')"
                                class="w-[34px] h-[34px] rounded-[10px] border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors">
                                <span v-if="!editing.telefono" v-html="icoeditsquare"></span>
                                <span v-else class="text-[#299261] font-black text-sm">✓</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contraseña -->
            <div class="col-span-2 bg-white rounded-[22px] p-[22px] flex flex-col gap-[18px] border-2 border-[#e8f5e9] max-[700px]:col-span-1"
                style="box-shadow: 0 4px 0 #c8e6c9; animation: card-anim-kf 0.35s cubic-bezier(0.34,1.2,0.64,1) both; animation-delay: 0.16s">
                <div class="flex items-center gap-3.5">
                    <div
                        class="w-[42px] h-[42px] rounded-[14px] bg-[#0D291C] text-[#7FD344] flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="text-[0.95rem] font-black text-[#0D291C]">Contraseña</h4>
                        <p class="text-[0.68rem] text-gray-400 font-semibold mt-0.5">Cambia tu contraseña de acceso</p>
                    </div>
                </div>

                <!-- Locked -->
                <div v-if="!showPassForm"
                    class="flex items-center justify-between gap-4 bg-gray-50 rounded-2xl px-5 py-4 flex-wrap">
                    <p class="text-[1.4rem] tracking-[0.15em] text-gray-400 font-black">••••••••••••</p>
                    <button @click="showPassForm = true"
                        class="text-[0.78rem] font-extrabold text-[#0D291C] bg-[#7FD344] border-2 border-black rounded-full px-5 py-2.5 cursor-pointer transition-all active:translate-y-0.5"
                        style="box-shadow: 0 3px 0 #000">
                        Cambiar contraseña
                    </button>
                </div>

                <!-- Formulario -->
                <div v-else class="grid grid-cols-2 gap-3.5 max-[560px]:grid-cols-1">
                    <div class="flex flex-col gap-1.5 col-span-2">
                        <label class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Contraseña
                            actual</label>
                        <div
                            class="flex items-center bg-white border-2 border-[#299261] rounded-[14px] px-3.5 py-0.5 shadow-[0_0_0_3px_rgba(41,146,97,0.1)]">
                            <input v-model="passForm.actual" :type="showPass.actual ? 'text' : 'password'"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 min-w-0 w-full"
                                placeholder="Tu contraseña actual" />
                            <button @click="showPass.actual = !showPass.actual"
                                class="w-[34px] h-[34px] rounded-[10px] border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors">
                                <span v-if="showPass.actual" v-html="visibility"></span>
                                <span v-else v-html="visibilityoff"></span>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5 col-span-2">
                        <label class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Nueva
                            contraseña</label>
                        <div
                            class="flex items-center bg-white border-2 border-[#299261] rounded-[14px] px-3.5 py-0.5 shadow-[0_0_0_3px_rgba(41,146,97,0.1)]">
                            <input v-model="passForm.nueva" :type="showPass.nueva ? 'text' : 'password'"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 min-w-0 w-full"
                                placeholder="Mínimo 8 caracteres" />
                            <button @click="showPass.nueva = !showPass.nueva"
                                class="w-[34px] h-[34px] rounded-[10px] border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors">
                                <span v-if="showPass.nueva" v-html="visibility"></span>
                                <span v-else v-html="visibilityoff"></span>
                            </button>
                        </div>
                        <div v-if="passForm.nueva" class="flex items-center gap-2 pt-1 px-0.5">
                            <div class="flex gap-1 flex-1">
                                <div v-for="n in 4" :key="n"
                                    class="flex-1 h-[5px] rounded-full transition-colors duration-300"
                                    :class="passStrength >= n ? passBarClass : 'bg-gray-200'" />
                            </div>
                            <span class="text-[0.65rem] font-extrabold whitespace-nowrap" :class="passLabelClass">
                                {{ passStrengthLabel.text }}
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5 col-span-2">
                        <label class="text-[0.62rem] font-black uppercase tracking-widest text-gray-400 pl-1">Confirmar
                            contraseña</label>
                        <div class="flex items-center rounded-[14px] px-3.5 py-0.5 border-2 transition-all duration-200"
                            :class="passForm.confirmar && !passMatch
                                ? 'border-red-600 bg-white shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                                : 'border-[#299261] bg-white shadow-[0_0_0_3px_rgba(41,146,97,0.1)]'">
                            <input v-model="passForm.confirmar" :type="showPass.confirmar ? 'text' : 'password'"
                                class="flex-1 border-none bg-transparent outline-none text-[0.88rem] font-bold text-[#0D291C] py-2.5 min-w-0 w-full"
                                placeholder="Repite la nueva contraseña" />
                            <button @click="showPass.confirmar = !showPass.confirmar"
                                class="w-[34px] h-[34px] rounded-[10px] border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors">
                                <span v-if="showPass.confirmar" v-html="visibility"></span>
                                <span v-else v-html="visibilityoff"></span>
                            </button>
                        </div>
                        <p v-if="passForm.confirmar && !passMatch" class="text-[0.65rem] font-bold text-red-600 pl-1">
                            Las contraseñas no coinciden
                        </p>
                    </div>

                    <Transition name="err-slide">
                        <div v-if="passError"
                            class="col-span-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#dc2626"
                                viewBox="0 0 24 24" class="shrink-0">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <span class="text-red-600 text-[0.75rem] font-medium">{{ passError }}</span>
                        </div>
                    </Transition>

                    <div class="col-span-2 flex gap-3">
                        <button @click="cancelarPass"
                            class="text-[0.78rem] font-extrabold text-gray-700 bg-white border-2 border-black rounded-full px-5 py-2.5 cursor-pointer transition-all hover:bg-gray-100 active:translate-y-0.5"
                            style="box-shadow: 0 1px 0 #000">
                            Cancelar
                        </button>
                        <button @click="guardarPass" :disabled="!passValida || passLoading"
                            class="text-[0.78rem] font-extrabold text-[#0D291C] bg-[#7FD344] border-2 border-black rounded-full px-5 py-2.5 cursor-pointer transition-all hover:bg-[#6fc23a] active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                            style="box-shadow: 0 3px 0 #000">
                            <span v-if="passLoading">Guardando...</span>
                            <span v-else>Guardar contraseña</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>

        <!-- Barra guardar cambios -->
        <div v-if="hayCambios"
            class="sticky bottom-0 bg-[#0D291C] rounded-[20px] px-[22px] py-4 flex items-center justify-between gap-4 flex-wrap border-2 border-[rgba(127,211,68,0.2)]"
            style="box-shadow: 0 -4px 24px rgba(13,41,28,0.25); animation: card-anim-kf 0.35s cubic-bezier(0.34,1.2,0.64,1) both">
            <div class="flex items-center gap-2 text-[0.82rem] font-bold text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {{ errCambios || 'Tienes cambios sin guardar' }}
            </div>
            <div class="flex gap-3">
                <button @click="descartarCambios" :disabled="guardandoCambios"
                    class="text-[0.78rem] font-extrabold text-gray-700 bg-white border-2 border-black rounded-full px-5 py-2.5 cursor-pointer transition-all hover:bg-gray-100 active:translate-y-0.5 disabled:opacity-50"
                    style="box-shadow: 0 1px 0 #000">
                    Descartar
                </button>
                <button @click="guardarCambios" :disabled="guardandoCambios"
                    class="text-[0.78rem] font-extrabold text-[#0D291C] bg-[#7FD344] border-2 border-black rounded-full px-5 py-2.5 cursor-pointer transition-all hover:bg-[#6fc23a] active:translate-y-0.5 disabled:opacity-50"
                    style="box-shadow: 0 3px 0 #000">
                    <span v-if="guardandoCambios">Guardando...</span>
                    <span v-else>Guardar cambios</span>
                </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import icoeditsquare from '@/assets/img/edit_square.svg?raw'
import visibility from '@/assets/img/visibility.svg?raw'
import visibilityoff from '@/assets/img/visibility_off.svg?raw'
import ClientService from '@/api/services/client.service'
import AuthService from '@/api/services/auth.service'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const form = reactive({
    nombre: '',
    apellido: '',
    tipoDoc: 'CC',
    documento: '',
    correo: '',
    telefono: '',
})

const original = reactive({ ...form })

onMounted(() => {
    const u = auth.user
    if (!u) return
    Object.assign(form, {
        nombre: u.nombres ?? '',
        apellido: u.apellidos ?? '',
        tipoDoc: 'CC',
        documento: u.documento ?? '',
        correo: u.email ?? '',
        telefono: u.telefono ?? '',
    })
    Object.assign(original, { ...form })
})

const editing = reactive({
    nombre: false, apellido: false,
    tipoDoc: false, documento: false,
    correo: false, telefono: false,
})

const toggleEdit = (campo) => { editing[campo] = !editing[campo] }

const iniciales = computed(() =>
    `${form.nombre?.[0] ?? ''}${form.apellido?.[0] ?? ''}`.toUpperCase()
)

const hayCambios = computed(() =>
    form.correo !== original.correo ||
    form.telefono !== original.telefono ||
    form.nombre !== original.nombre ||
    form.apellido !== original.apellido
)

const guardandoCambios = ref(false)
const errCambios = ref('')

const descartarCambios = () => {
    form.correo = original.correo
    form.telefono = original.telefono
    form.apellido = original.apellido
    form.nombre = original.nombre
    editing.correo = false
    editing.telefono = false
    editing.apellido = false
    editing.nombre = false
    errCambios.value = ''
}

const guardarCambios = async () => {
    errCambios.value = ''
    guardandoCambios.value = true
    try {
        const dto = {
            Email: form.correo,
            Telefono: form.telefono,
            Nombres: form.nombre,
            Apellidos: form.apellido,
        }
        const res = await ClientService.updateOwnProfile(dto)

        if (res?.error === true || res?.success === false) {
            const msg = res?.data?.message ?? res?.message ?? 'Error al guardar.'
            errCambios.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }

        original.correo = form.correo
        original.telefono = form.telefono
        original.apellido = form.apellido
        original.nombre = form.nombre

        // Refrescar token para que el JWT contenga los datos actualizados
        await auth.refreshAccessToken()

        editing.correo = false
        editing.telefono = false
        editing.apellido = false
        editing.nombre = false
    } catch (e) {
        const msg = e.response?.data?.message
        errCambios.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar.')
    } finally {
        guardandoCambios.value = false
    }
}

// ── Contraseña
const showPassForm = ref(false)
const passForm = reactive({ actual: '', nueva: '', confirmar: '' })
const showPass = reactive({ actual: false, nueva: false, confirmar: false })
const passLoading = ref(false)
const passError = ref('')

const passMatch = computed(() => passForm.nueva === passForm.confirmar)
const passValida = computed(() =>
    passForm.actual.length > 0 && passForm.nueva.length >= 8 && passMatch.value
)

const passStrength = computed(() => {
    const p = passForm.nueva
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
})

const passStrengthLabel = computed(() => {
    const map = [
        { key: 'weak', text: 'Muy débil' },
        { key: 'weak', text: 'Débil' },
        { key: 'fair', text: 'Regular' },
        { key: 'good', text: 'Buena' },
        { key: 'strong', text: 'Muy segura' },
    ]
    return map[passStrength.value] ?? map[0]
})

const passBarClass = computed(() => ({
    weak: 'bg-red-600',
    fair: 'bg-amber-400',
    good: 'bg-blue-500',
    strong: 'bg-green-600',
}[passStrengthLabel.value.key] ?? 'bg-red-600'))

const passLabelClass = computed(() => ({
    weak: 'text-red-600',
    fair: 'text-amber-600',
    good: 'text-blue-600',
    strong: 'text-green-600',
}[passStrengthLabel.value.key] ?? 'text-red-600'))

const cancelarPass = () => {
    showPassForm.value = false
    Object.assign(passForm, { actual: '', nueva: '', confirmar: '' })
    Object.assign(showPass, { actual: false, nueva: false, confirmar: false })
    passError.value = ''
    passLoading.value = false
}

const guardarPass = async () => {
    if (!passValida.value || passLoading.value) return
    passLoading.value = true
    passError.value = ''
    try {
        const res = await AuthService.changePassword(passForm.actual, passForm.nueva)
        if (res?.error === true || res?.success === false) {
            const msg = res?.data?.message ?? res?.message ?? 'Error al cambiar la contraseña.'
            passError.value = Array.isArray(msg) ? msg.join(', ') : msg
            return
        }
        cancelarPass()
    } catch (e) {
        const msg = e.response?.data?.message
        passError.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al cambiar la contraseña.')
    } finally {
        passLoading.value = false
    }
}
</script>

<style scoped>
@keyframes card-anim-kf {
    from {
        opacity: 0;
        transform: translateY(14px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>