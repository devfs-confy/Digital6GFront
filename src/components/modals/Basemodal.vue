<template>
    <!-- Backdrop -->
    <Teleport to="body">
        <Transition name="modal-backdrop">
            <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                :class="backdropClass || 'bg-black/50 backdrop-blur-sm'" @click.self="closeOnBackdrop && close()">
                <!-- Modal Panel -->
                <Transition name="modal-panel">
                    <div v-if="modelValue" class="relative flex flex-col w-full overflow-hidden rounded-2xl shadow-2xl"
                        :class="[
                            panelClass || 'bg-white dark:bg-gray-900',
                            sizeClasses[size],
                            maxHeightClass || 'max-h-[90vh]',
                        ]" role="dialog" aria-modal="true" :aria-labelledby="title ? 'modal-title' : undefined">

                        <!-- ───── HEADER ───── -->
                        <div v-if="$slots.header || title !== undefined"
                            class="flex items-center justify-between shrink-0 px-6 py-4 border-b"
                            :class="headerClass || 'border-gray-200 dark:border-gray-700'">
                            <slot name="header">
                                <h2 id="modal-title" class="text-lg font-semibold tracking-tight"
                                    :class="titleClass || 'text-gray-900 dark:text-white'">
                                    {{ title }}
                                </h2>
                            </slot>

                            <button v-if="showCloseButton" type="button"
                                class="ml-4 shrink-0 rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                                :class="closeButtonClass || 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'"
                                :aria-label="closeAriaLabel || 'Cerrar'" @click="close">
                                <slot name="close-icon">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </slot>
                            </button>
                        </div>

                        <!-- ───── BODY ───── -->
                        <div class="flex-1 overflow-y-auto"
                            :class="bodyClass || 'px-6 py-5 text-gray-700 dark:text-gray-300'">
                            <slot />
                        </div>

                        <!-- ───── FOOTER ───── -->
                        <div v-if="$slots.footer || showDefaultFooter"
                            class="shrink-0 flex items-center gap-3 px-6 py-4 border-t"
                            :class="[footerClass || 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50', footerAlign]">
                            <slot name="footer">
                                <!-- Default footer: extra buttons + cancel -->
                                <template v-if="footerButtons && footerButtons.length">
                                    <button v-for="btn in footerButtons" :key="btn.label" type="button"
                                        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                                        :class="btn.class || 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'"
                                        :disabled="btn.disabled" @click="btn.action">
                                        {{ btn.label }}
                                    </button>
                                </template>

                                <button type="button"
                                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                                    :class="cancelButtonClass || 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'"
                                    @click="close">
                                    {{ cancelLabel || 'Cancelar' }}
                                </button>
                            </slot>
                        </div>

                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { watch } from 'vue'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
    /** v-model para abrir/cerrar */
    modelValue: {
        type: Boolean,
        default: false,
    },

    // ── Contenido ──
    title: {
        type: String,
        default: undefined,
    },

    // ── Comportamiento ──
    closeOnBackdrop: {
        type: Boolean,
        default: true,
    },
    closeOnEsc: {
        type: Boolean,
        default: true,
    },
    showCloseButton: {
        type: Boolean,
        default: true,
    },
    showDefaultFooter: {
        type: Boolean,
        default: true,
    },

    // ── Tamaño ──
    /** 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' */
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(v),
    },

    // ── Footer ──
    cancelLabel: {
        type: String,
        default: 'Cancelar',
    },
    /**
     * Array de botones extra en el footer por defecto.
     * Cada item: { label, action, class?, disabled? }
     */
    footerButtons: {
        type: Array,
        default: () => [],
    },
    /** 'justify-end' | 'justify-start' | 'justify-between' | 'justify-center' */
    footerAlign: {
        type: String,
        default: 'justify-end',
    },

    // ── Accesibilidad ──
    closeAriaLabel: {
        type: String,
        default: 'Cerrar',
    },

    // ── Estilos personalizables ──
    backdropClass: { type: String, default: '' },
    panelClass: { type: String, default: '' },
    headerClass: { type: String, default: '' },
    titleClass: { type: String, default: '' },
    closeButtonClass: { type: String, default: '' },
    bodyClass: { type: String, default: '' },
    footerClass: { type: String, default: '' },
    cancelButtonClass: { type: String, default: '' },
    maxHeightClass: { type: String, default: '' },
})

// ─── Emits ────────────────────────────────────────────────────────────────────
const emit = defineEmits(['update:modelValue', 'close', 'open'])

// ─── Tamaños ─────────────────────────────────────────────────────────────────
const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full mx-4',
}

// ─── Lógica ──────────────────────────────────────────────────────────────────
function close() {
    emit('update:modelValue', false)
    emit('close')
}

// ESC key
watch(
    () => props.modelValue,
    (isOpen) => {
        if (isOpen) {
            emit('open')
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleEsc)
        } else {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleEsc)
        }
    },
)

function handleEsc(e) {
    if (props.closeOnEsc && e.key === 'Escape') close()
}
</script>

<style scoped>
/* ── Backdrop ── */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
    transition: opacity 0.25s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
    opacity: 0;
}

/* ── Panel ── */
.modal-panel-enter-active {
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-panel-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-panel-enter-from,
.modal-panel-leave-to {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
}
</style>