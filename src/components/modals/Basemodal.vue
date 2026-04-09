<template>
    <Teleport to="body">
        <Transition name="base-modal">
            <div v-if="modelValue"
                class="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                @click.self="closeOnBackdrop && emit('update:modelValue', false)">
                <div class="bg-white border-2 border-[#0D291C] rounded-3xl w-full flex flex-col overflow-hidden"
                    :class="[sizeClass, maxHeightClass]" style="box-shadow: 0 6px 0 #000">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between px-5 py-4 bg-[#0D291C] border-b-2 border-[#0a1f15] flex-shrink-0">
                        <div class="flex items-center gap-3 min-w-0">
                            <!-- Icono o avatar slot -->
                            <slot name="icon">
                                <div
                                    class="w-9 h-9 rounded-xl bg-[#0D291C] border border-[#7FD344]/30 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7FD344"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                </div>
                            </slot>
                            <div class="min-w-0">
                                <p class="text-[0.9rem] font-extrabold text-white truncate">{{ title }}</p>
                                <p v-if="subtitle" class="text-[0.65rem] text-white/50 font-semibold truncate mt-[1px]">
                                    {{ subtitle }}</p>
                            </div>
                        </div>
                        <button @click="emit('update:modelValue', false)"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.82rem] font-black cursor-pointer border-2 border-white/25 bg-white/10 text-white/70 hover:bg-white/22 hover:text-white hover:border-white/45 transition-all flex-shrink-0">
                            ✕
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto bg-white [scrollbar-width:thin] [scrollbar-color:#c8e6c9_transparent]"
                        :class="bodyClass">
                        <slot />
                    </div>

                    <!-- Footer -->
                    <slot name="footer">
                        <div v-if="showFooter"
                            class="flex gap-2.5 px-5 py-3 pb-[18px] bg-white border-t-2 border-gray-200 flex-shrink-0">
                            <button v-if="showCancel" @click="emit('update:modelValue', false)"
                                class="flex-1 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-black bg-white text-[#232B3A] shadow-[0_1px_0_#000] active:translate-y-0.5 transition-all">
                                {{ cancelLabel }}
                            </button>
                            <button v-if="showConfirm" @click="emit('confirm')" :disabled="confirmDisabled || loading"
                                class="flex-1 flex items-center justify-center gap-1.5 py-[11px] px-3.5 rounded-full text-[0.78rem] font-extrabold uppercase tracking-[0.05em] cursor-pointer border-2 border-[#0D291C] bg-[#0D291C] text-[#7FD344] shadow-[0_1px_0_#051510] hover:bg-[#132e21] active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                <div v-if="loading"
                                    class="w-[13px] h-[13px] flex-shrink-0 border-2 border-[#7FD344]/30 border-t-[#7FD344] rounded-full animate-spin" />
                                {{ loading ? loadingLabel : confirmLabel }}
                            </button>
                        </div>
                    </slot>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    closeOnBackdrop: { type: Boolean, default: true },

    // Tamaño
    size: {
        type: String, default: 'md',
        validator: v => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
    },
    maxHeightClass: { type: String, default: 'max-h-[calc(100vh-32px)]' },
    bodyClass: { type: String, default: '' },

    // Footer
    showFooter: { type: Boolean, default: true },
    showCancel: { type: Boolean, default: true },
    showConfirm: { type: Boolean, default: true },
    cancelLabel: { type: String, default: 'Cancelar' },
    confirmLabel: { type: String, default: 'Aceptar' },
    loadingLabel: { type: String, default: 'Cargando...' },
    confirmDisabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const sizeClass = {
    xs: 'max-w-[320px]',
    sm: 'max-w-[380px]',
    md: 'max-w-[420px]',
    lg: 'max-w-[520px]',
    xl: 'max-w-[660px]',
}[props.size]
</script>

<style scoped>
.base-modal-enter-active {
    transition: opacity 0.2s ease
}

.base-modal-leave-active {
    transition: opacity 0.15s ease
}

.base-modal-enter-from,
.base-modal-leave-to {
    opacity: 0
}
</style>