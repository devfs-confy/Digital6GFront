<template>
    <div class="relative" ref="container">
        <input :value="displayValue" readonly :placeholder="placeholder" @click="toggle"
            class="w-full rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer select-none" />
        <AppIcon name="calendar_month" :size="18"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

        <Transition name="dp-fade">
            <div v-if="open"
                class="absolute z-50 top-[calc(100%+6px)] left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-[280px]">

                <!-- Header mes/año -->
                <div class="flex items-center justify-between mb-3">
                    <button @click="prevMonth" type="button"
                        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e8f5e9] text-[#0D291C] font-bold text-lg transition-colors cursor-pointer">
                        ‹
                    </button>
                    <span class="text-sm font-extrabold text-[#0D291C] capitalize select-none">
                        {{ MESES[viewMonth] }} {{ viewYear }}
                    </span>
                    <button @click="nextMonth" type="button"
                        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e8f5e9] text-[#0D291C] font-bold text-lg transition-colors cursor-pointer">
                        ›
                    </button>
                </div>

                <!-- Días semana -->
                <div class="grid grid-cols-7 mb-1">
                    <span v-for="d in DIAS" :key="d"
                        class="text-center text-[0.6rem] font-black uppercase tracking-wider text-gray-400 py-1 select-none">
                        {{ d }}
                    </span>
                </div>

                <!-- Grid días -->
                <div class="grid grid-cols-7 gap-y-0.5">
                    <span v-for="_ in startOffset" :key="'e' + _" />
                    <button v-for="day in daysInMonth" :key="day" type="button" @click="selectDay(day)"
                        :class="[
                            'h-8 w-full flex items-center justify-center rounded-full text-sm font-semibold transition-colors cursor-pointer select-none',
                            isSelected(day)
                                ? 'bg-[#299261] text-white font-black'
                                : isToday(day)
                                    ? 'border-2 border-[#299261] text-[#0D291C] hover:bg-[#e8f5e9]'
                                    : isDisabled(day)
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-[#0D291C] hover:bg-[#e8f5e9]'
                        ]"
                        :disabled="isDisabled(day)">
                        {{ day }}
                    </button>
                </div>

                <!-- Acciones rápidas -->
                <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button type="button" @click="selectToday"
                        class="flex-1 text-[0.72rem] font-bold py-1.5 rounded-full border border-[#299261] text-[#299261] hover:bg-[#e8f5e9] transition-colors cursor-pointer">
                        Hoy
                    </button>
                    <button v-if="modelValue" type="button" @click="clear"
                        class="flex-1 text-[0.72rem] font-bold py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors cursor-pointer">
                        Limpiar
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import AppIcon from '@/components/shared/AppIcon.vue'

const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Seleccionar fecha' },
    min: { type: String, default: '' },
    max: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'change'])

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

const container = ref(null)
const open = ref(false)

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

watch(() => props.modelValue, (v) => {
    if (v) {
        const [y, m] = v.split('-').map(Number)
        viewYear.value = y
        viewMonth.value = m - 1
    }
})

const displayValue = computed(() => {
    if (!props.modelValue) return ''
    const [y, m, d] = props.modelValue.split('-')
    return `${d}/${m}/${y}`
})

const daysInMonth = computed(() => {
    return new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
})

const startOffset = computed(() => {
    let day = new Date(viewYear.value, viewMonth.value, 1).getDay()
    return day === 0 ? 6 : day - 1
})

const pad = n => String(n).padStart(2, '0')
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

const isSelected = (day) => props.modelValue === toISO(viewYear.value, viewMonth.value, day)
const isToday = (day) =>
    day === today.getDate() &&
    viewMonth.value === today.getMonth() &&
    viewYear.value === today.getFullYear()

const isDisabled = (day) => {
    const iso = toISO(viewYear.value, viewMonth.value, day)
    if (props.min && iso < props.min) return true
    if (props.max && iso > props.max) return true
    return false
}

const toggle = () => { open.value = !open.value }
onClickOutside(container, () => { open.value = false })

const prevMonth = () => {
    if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
    else viewMonth.value--
}
const nextMonth = () => {
    if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
    else viewMonth.value++
}

const selectDay = (day) => {
    if (isDisabled(day)) return
    const val = toISO(viewYear.value, viewMonth.value, day)
    emit('update:modelValue', val)
    emit('change', val)
    open.value = false
}

const selectToday = () => {
    const val = toISO(today.getFullYear(), today.getMonth(), today.getDate())
    viewYear.value = today.getFullYear()
    viewMonth.value = today.getMonth()
    emit('update:modelValue', val)
    emit('change', val)
    open.value = false
}

const clear = () => {
    emit('update:modelValue', '')
    emit('change', '')
    open.value = false
}
</script>

<style scoped>
.dp-fade-enter-active,
.dp-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.dp-fade-enter-from,
.dp-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
