<template>
    <Teleport to="body">
        <!-- Overlay -->
        <Transition name="overlay">
            <div v-if="modelValue" class="fixed inset-0 bg-[rgba(13,41,28,0.45)] backdrop-blur-[3px] z-40"
                @click.self="emit('update:modelValue', false)" />
        </Transition>

        <!-- Panel -->
        <Transition name="aside">
            <div v-if="modelValue"
                class="fixed top-0 right-0 w-[440px] h-dvh z-50 bg-white border-l-[2.5px] border-[#0D291C] flex flex-col overflow-hidden aside-panel"
                @click.stop>

                <!-- Cabecera -->
                <div
                    class="flex items-center justify-between gap-3 px-[26px] pt-[22px] pb-[18px] border-b-[2.5px] border-[#0D291C] flex-shrink-0 bg-white">
                    <div class="flex items-center gap-3 min-w-0">
                        <div
                            class="w-11 h-11 rounded-full bg-[#0D291C] text-[#7FD344] flex items-center justify-center font-black text-[0.9rem] flex-shrink-0 border-2 border-[rgba(13,41,28,0.35)]">
                            {{ iniciales(titulo) }}
                        </div>
                        <div class="min-w-0">
                            <p
                                class="text-[1rem] font-black text-[#0D291C] italic uppercase tracking-[-0.01em] truncate">
                                {{ titulo }}</p>
                            <p
                                class="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-[#0D291C] opacity-45 mt-0.5">
                                {{ subtitulo }}</p>
                        </div>
                    </div>
                    <button @click="emit('update:modelValue', false)"
                        class="w-[34px] h-[34px] rounded-[10px] border-2 border-[#0D291C] bg-white flex items-center justify-center cursor-pointer flex-shrink-0 text-[#0D291C] transition-all duration-150 aside-close"
                        style="box-shadow: 0 3px 0 #0D291C;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <!-- Cuerpo -->
                <div class="flex-1 overflow-y-auto px-[26px] py-[22px] flex flex-col gap-4 bg-[#f5f7f5] aside-body">
                    <slot />
                </div>

                <!-- Error -->
                <div v-if="error"
                    class="flex items-start gap-2 mx-[26px] px-3.5 py-2.5 bg-red-50 border-2 border-red-200 rounded-[14px] flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#dc2626"
                        class="flex-shrink-0 mt-0.5">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <p class="text-[0.75rem] font-bold text-red-600 m-0">{{ error }}</p>
                </div>

                <!-- Pie -->
                <div
                    class="flex gap-3 px-[26px] pt-3.5 pb-[22px] border-t-[2.5px] border-[#0D291C] flex-shrink-0 bg-white">
                    <button @click="emit('update:modelValue', false)" class="aside-btn aside-btn--cancel">
                        Cancelar
                    </button>
                    <button @click="emit('guardar')" :disabled="loading" class="aside-btn aside-btn--confirm">
                        <span v-if="loading" class="aside-spinner" />
                        {{ loading ? 'Guardando...' : labelGuardar }}
                    </button>
                </div>

            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    titulo: { type: String, default: 'Editar' },
    subtitulo: { type: String, default: 'Editando información' },
    labelGuardar: { type: String, default: 'Guardar cambios' },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const iniciales = (texto = '') => {
    if (!texto) return '??'
    return texto.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}
</script>

<style scoped>
/* box-shadow con offset negativo y hover con cambio de color — no soportado en Tailwind puro */
.aside-panel {
    box-shadow: -7px 0 0 #0D291C;
}

.aside-close:hover {
    background-color: #fee2e2;
    border-color: #dc2626;
    box-shadow: 0 3px 0 #dc2626;
    color: #dc2626;
}

.aside-close:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #dc2626;
}

/* Botones del pie */
.aside-btn {
    flex: 1;
    padding: 13px 20px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 2px solid #000;
    box-shadow: 0 4px 0 #000;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s, background-color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.aside-btn:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #000;
}

.aside-btn--cancel {
    background-color: white;
    color: #232B3A;
}

.aside-btn--cancel:hover {
    background-color: #f3f4f6;
}

.aside-btn--confirm {
    background-color: #0D291C;
    color: white;
    flex: 2;
}

.aside-btn--confirm:hover:not(:disabled) {
    background-color: #299261;
}

.aside-btn--confirm:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Spinner */
.aside-spinner {
    display: inline-block;
    width: 13px;
    height: 13px;
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

/* Scrollbar cuerpo */
.aside-body {
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.2) transparent;
}

.aside-body::-webkit-scrollbar {
    width: 5px;
}

.aside-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.25);
    border-radius: 99px;
}

/* Transiciones */
.overlay-enter-active {
    transition: opacity 0.22s ease;
}

.overlay-leave-active {
    transition: opacity 0.16s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.aside-enter-active {
    transition: transform 0.32s cubic-bezier(0.34, 1.1, 0.64, 1), opacity 0.22s ease;
}

.aside-leave-active {
    transition: transform 0.2s ease-in, opacity 0.16s ease;
}

.aside-enter-from,
.aside-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

/* Mobile: bottom sheet */
@media (max-width: 500px) {
    .aside-panel {
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 92dvh;
        border-left: none;
        border-top: 2.5px solid #0D291C;
        box-shadow: 0 -7px 0 #0D291C;
        border-radius: 28px 28px 0 0;
    }

    .aside-enter-from,
    .aside-leave-to {
        transform: translateY(100%);
        opacity: 0;
    }

    .aside-panel .aside-head {
        padding: 18px 20px 14px;
    }

    .aside-body {
        padding: 16px 20px;
    }

    .aside-panel .aside-foot {
        padding: 12px 20px 20px;
    }

    .aside-panel .aside-error {
        margin: 0 20px;
    }
}
</style>