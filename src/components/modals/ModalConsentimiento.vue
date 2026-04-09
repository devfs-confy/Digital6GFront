<template>
    <BaseModal v-model="isOpen" title="Antes de continuar" subtitle="Tratamiento de datos personales" size="sm"
        confirm-label="Continuar al pago" :confirm-disabled="!aceptado"
        @update:modelValue="emit('update:modelValue', $event)" @confirm="emit('confirmar')">

        <template #icon>
            <div class="w-9 h-9 rounded-xl bg-[#7FD344] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0D291C" viewBox="0 0 24 24">
                    <path
                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z" />
                </svg>
            </div>
        </template>

        <!-- Logo AvalPay -->
        <div class="px-5 py-6 border-b border-gray-100 flex flex-col items-center gap-1">
            <img src="@/assets/img/logo-avalpay-center.webp" alt="AvalPay" class="h-12 object-contain"
                @error="$event.target.style.display = 'none'" />
            <p class="text-[0.72rem] text-gray-500 font-semibold text-center leading-relaxed mt-1">
                El proceso de pago es gestionado de forma segura por
                <strong class="text-[#0D291C]">AvalPay</strong>
            </p>
        </div>

        <!-- Policy -->
        <div class="px-5 py-4 border-b border-gray-100">
            <div class="flex items-start gap-3 p-4 bg-[#f0fdf4] border border-[1.5px] border-[#c8e6c9] rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#299261" viewBox="0 0 24 24"
                    class="shrink-0 mt-[1px]">
                    <path
                        d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
                <div>
                    <p class="text-[0.8rem] font-extrabold text-[#0D291C] mb-[3px]">Política de Tratamiento de Datos</p>
                    <p class="text-[0.7rem] text-gray-500 font-semibold leading-[1.55]">
                        Al realizar este pago, tus datos personales serán tratados conforme a nuestra política
                        de privacidad y las normas de la Ley 1581 de 2012.
                    </p>
                    <a href="https://parquearse.com/pdf/politicadetratamientosdedatos.pdf" target="_blank"
                        class="inline-flex items-center gap-[5px] mt-2 text-[0.7rem] font-extrabold text-[#299261] no-underline px-2.5 py-[5px] rounded-lg border border-[1.5px] border-[#c8e6c9] bg-[#f0fdf4] hover:bg-[#e0f8ec] transition-colors">
                        Ver política completa (PDF)
                    </a>
                </div>
            </div>
        </div>

        <!-- Checkbox -->
        <div class="px-5 py-4">
            <label
                class="flex items-start gap-2.5 p-3 rounded-[14px] border-2 cursor-pointer text-[0.78rem] font-semibold text-gray-700 leading-relaxed transition-all select-none"
                :class="aceptado ? 'border-[#299261] bg-[#f0fdf4]' : 'border-gray-200 bg-gray-50'">
                <input type="checkbox" v-model="aceptado" class="hidden" />
                <div class="w-5 h-5 rounded-[6px] border-2 flex items-center justify-center flex-shrink-0 mt-[1px] transition-all"
                    :class="aceptado ? 'bg-[#0D291C] border-[#0D291C]' : 'bg-white border-gray-300'">
                    <svg v-if="aceptado" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#7FD344"
                        viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                </div>
                <span>He leído y acepto la <strong>Política de Tratamiento de Datos Personales</strong></span>
            </label>
        </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'confirmar'])

// ← computed con getter/setter en lugar de pasar el prop directo
const isOpen = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const aceptado = ref(false)
watch(() => props.modelValue, v => { if (!v) aceptado.value = false })
</script>