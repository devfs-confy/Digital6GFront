<template>
    <Transition name="modal">
        <div v-if="modelValue"
            class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                class="bg-white border-2 border-[#0D291C] rounded-3xl shadow-[0_6px_0_#000] w-full max-w-[440px] flex flex-col overflow-y-auto">

                <!-- Head -->
                <div class="flex items-center justify-between px-5 py-4 bg-gray-50 border-b-2 border-gray-200">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-sm flex-shrink-0">
                            {{ iniciales(mensualidad?.nombre) }}
                        </div>
                        <div>
                            <p class="text-[0.92rem] font-black text-[#0D291C]">{{ mensualidad?.nombre }}</p>
                            <p class="text-[0.65rem] font-semibold text-gray-400">{{ mensualidad?.sede }} - {{
                                mensualidad?.mensualidad }}</p>
                        </div>
                    </div>
                    <button @click="emit('update:modelValue', false)"
                        class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 bg-gray-100 text-gray-500 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all">✕</button>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-14">
                    <div class="w-8 h-8 rounded-full border-[3px] border-[#e8f5e9] border-t-[#299261] animate-spin" />
                    <span class="text-xs text-gray-400 font-semibold">Cargando información...</span>
                </div>

                <template v-else>
                    <div v-if="error"
                        class="mx-5 mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[0.72rem] font-semibold text-amber-700">
                        {{ error }}
                    </div>

                    <div
                        class="flex flex-col bg-white max-h-[62vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#c8e6c9_transparent]">
                        <!-- Estado -->
                        <div class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                            <div class="flex items-center justify-between gap-2">
                                <span
                                    class="inline-block text-[0.6rem] font-extrabold uppercase tracking-[0.07em] px-2 py-[2px] rounded-full border"
                                    :class="{
                                        'bg-green-100 text-green-700 border-green-200': mensualidad?.estado === 'activa',
                                        'bg-amber-100 text-amber-600 border-amber-200': mensualidad?.estado === 'por_vencer',
                                        'bg-red-100 text-red-600 border-red-200': mensualidad?.estado === 'vencida',
                                        'bg-blue-100 text-blue-600 border-blue-200': mensualidad?.estado === 'congelada',
                                        'bg-[#fde68a] text-[#b45309] border-[#b45309]': mensualidad?.estado === 'pendiente'
                                    }">
                                    {{ estadoLabel(mensualidad?.estado) }}
                                </span>
                                <span class="text-xs font-semibold text-gray-400">
                                    <strong class="font-black text-[#0D291C]">{{ diasRestantes(mensualidad) }}</strong>
                                    días restantes
                                </span>
                            </div>
                        </div>

                        <!-- Datos personales -->
                        <div class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                Datos personales
                            </p>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="flex flex-col gap-[3px]">
                                    <span
                                        class="text-[0.6rem] font-extrabold uppercase tracking-[0.07em] text-gray-400">Documento</span>
                                    <span class="text-[0.85rem] font-bold text-[#0D291C] font-mono">{{
                                        detalle?.Documento ?? mensualidad?._raw?.Documento ?? '—' }}</span>
                                </div>
                                <div class="flex flex-col gap-[3px]">
                                    <span
                                        class="text-[0.6rem] font-extrabold uppercase tracking-[0.07em] text-gray-400">Nombre</span>
                                    <span class="text-[0.78rem] font-bold text-[#0D291C]">{{ detalle?.NombreApellidos ??
                                        mensualidad?._raw?.NombreApellidos ?? '—' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Vigencia -->
                        <div class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                Vigencia
                            </p>
                            <div class="grid grid-cols-2 gap-3 mb-3">
                                <div class="flex flex-col gap-[3px]">
                                    <span
                                        class="text-[0.6rem] font-extrabold uppercase tracking-[0.07em] text-gray-400">Inicio</span>
                                    <span class="text-[0.85rem] font-bold text-[#0D291C]">{{
                                        formatFecha(mensualidad?.fechaInicio) }}</span>
                                </div>
                                <div class="flex flex-col gap-[3px]">
                                    <span
                                        class="text-[0.6rem] font-extrabold uppercase tracking-[0.07em] text-gray-400">Fin</span>
                                    <span class="text-[0.85rem] font-bold text-[#0D291C]">{{
                                        formatFecha(mensualidad?.fechaFin) }}</span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <div class="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                    <div class="h-full rounded-full transition-all duration-500" :class="{
                                        'bg-[#7FD344]': mensualidad?.estado === 'activa',
                                        'bg-amber-400': mensualidad?.estado === 'por_vencer',
                                        'bg-red-600': mensualidad?.estado === 'vencida',
                                        'bg-blue-400': mensualidad?.estado === 'congelada',
                                    }" :style="{ width: `${porcentajeVigencia(mensualidad)}%` }" />
                                </div>
                                <span class="text-right text-[0.62rem] font-semibold text-gray-400">
                                    {{ porcentajeVigencia(mensualidad) }}% del periodo
                                </span>
                            </div>
                        </div>

                        <!-- Vehículos -->
                        <div class="px-5 py-4 border-b border-gray-100 flex flex-col gap-2.5">
                            <div class="flex flex-col gap-2">
                                <p
                                    class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                    Vehículos registrados
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <button @click="emit('cambiarPlaca')"
                                        class="flex items-center gap-1.5 text-[0.65rem] font-black px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all"
                                        :class="placaCambiada
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'bg-[#0D291C] text-[#7FD344] border-[#0D291C] hover:opacity-80'"
                                        :disabled="placaCambiada">
                                        {{ placaCambiada ? 'Cambio realizado este mes' : 'Cambiar placa' }}
                                    </button>
                                    <button @click="emit('cambiarTipo')"
                                        class="flex items-center gap-1.5 text-[0.65rem] font-black px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all bg-[#7FD344] text-[#0D291C] border-[#7FD344] hover:opacity-80">
                                        <AppIcon name="swap_driving_apps" :size="12" />
                                        Cambiar tipo
                                    </button>
                                </div>
                            </div>
                            <div v-if="placas.length" class="flex flex-col gap-2 mt-1">
                                <div v-for="(placa, idx) in placas" :key="idx"
                                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl border-2"
                                    :class="idx === 0 ? 'bg-[#f0fdf4] border-[#c8e6c9]' : 'bg-gray-50 border-gray-200'">
                                    <AppIcon :name="mensualidad?.esMoto ? 'two_wheeler' : 'car-side'" :size="14"
                                        :style="{ color: idx === 0 ? '#299261' : '#9ca3af' }" />
                                    <span class="text-[0.8rem] font-black tracking-widest uppercase flex-1"
                                        :class="idx === 0 ? 'text-[#0D291C]' : 'text-gray-500'">{{ placa }}</span>
                                    <span v-if="idx === 0"
                                        class="text-[0.55rem] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#0D291C] text-[#7FD344]">
                                        Principal
                                    </span>
                                </div>
                            </div>
                            <p v-else class="text-xs font-semibold text-gray-400 mt-1">Sin vehículos registrados</p>
                        </div>

                        <!-- Sede -->
                        <div class="px-5 py-4 flex flex-col gap-2.5">
                            <p
                                class="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#299261] flex items-center gap-2 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-gradient-to-r after:from-[#c8e6c9] after:to-transparent after:rounded-full">
                                Sede
                            </p>
                            <div
                                class="flex items-center gap-3 rounded-xl px-3.5 py-3 bg-white border-2 border-gray-200">
                                <div
                                    class="w-8 h-8 rounded-lg bg-[#0D291C] flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#7FD344"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                                <p class="text-[0.85rem] font-bold text-[#0D291C]">
                                    {{ detalle?.T_Estacionamiento?.Nombre ??
                                        mensualidad?._raw?.T_Estacionamiento?.Nombre ?? '—' }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-[#e8f5e9]">
                        <button @click="emit('update:modelValue', false)"
                            class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                            Cerrar
                        </button>
                    </div>
                </template>
            </div>
        </div>
    </Transition>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    mensualidad: { type: Object, default: null },
    detalle: { type: Object, default: null },
    placas: { type: Array, default: () => [] },
    placaCambiada: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'cambiarPlaca', 'cambiarTipo'])

const parseLocal = (f) => f ? new Date(f.length === 10 ? f + 'T00:00:00' : f) : null
const formatFecha = (f) => {
    if (!f) return '—'
    const d = parseLocal(f)
    return d ? d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}
const iniciales = (n = '') => n.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
const estadoLabel = (e) => ({ activa: 'Activa', por_vencer: 'Por vencer', vencida: 'Vencida', congelada: 'Congelada', pendiente: 'Pendiente' })[e] ?? e
const diasRestantes = (m) => {
    if (!m?.fechaFin) return 0
    const fin = parseLocal(m.fechaFin)
    const ini = m.fechaInicio ? parseLocal(m.fechaInicio) : null
    if (!fin) return 0
    if (ini) return Math.max(0, Math.round((fin - ini) / 86400000))
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    return Math.max(0, Math.round((fin - hoy) / 86400000))
}
const porcentajeVigencia = (m) => {
    if (!m?.fechaInicio || !m?.fechaFin) return 0
    const ini = parseLocal(m.fechaInicio)
    const fin = parseLocal(m.fechaFin)
    if (!ini || !fin) return 0
    return Math.min(100, Math.max(0, Math.round(((new Date() - ini) / (fin - ini)) * 100)))
}
</script>

<style scoped>
.modal-enter-active {
    transition: opacity 0.2s ease
}

.modal-leave-active {
    transition: opacity 0.15s ease
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0
}
</style>