<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="modal-overlay" @click.self="emit('update:modelValue', false)">
                <div class="modal-card modal-card--wide">

                    <!-- Cabecera -->
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-avatar">{{ iniciales(cliente?.Nombres) }}</div>
                            <div>
                                <p class="modal-head__name">{{ cliente?.Nombres }}</p>
                                <p class="modal-head__sub">Editando información</p>
                            </div>
                        </div>
                        <button @click="emit('update:modelValue', false)" class="modal-close">✕</button>
                    </div>

                    <!-- Cuerpo -->
                    <div class="modal-body">
                        <slot />
                    </div>

                    <!-- Pie -->
                    <div class="modal-foot">
                        <button @click="emit('update:modelValue', false)" class="btn-modal-dark btn-modal-dark--cancel">
                            Cancelar
                        </button>
                        <button @click="emit('guardar')" class="btn-modal-dark">
                            Actualizar datos
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    cliente: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const iniciales = (nombre = '') => {
    if (!nombre) return '??'
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: rgba(13, 41, 28, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.modal-card {
    background-color: #B8E19E;
    border: 2.5px solid #0D291C;
    border-radius: 40px;
    box-shadow: 0 7px 0 #0D291C;
    width: 100%;
    max-width: 500px;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-card--wide {
    max-width: 660px;
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 22px 26px 16px;
    border-bottom: 2px solid rgba(13, 41, 28, 0.14);
    flex-shrink: 0;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.modal-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.9rem;
    flex-shrink: 0;
    border: 2px solid rgba(13, 41, 28, 0.4);
}

.modal-head__name {
    font-size: 1rem;
    font-weight: 900;
    color: #0D291C;
    font-style: italic;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.modal-head__sub {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #0D291C;
    opacity: 0.45;
    margin-top: 2px;
}

.modal-close {
    font-size: 1.1rem;
    font-weight: 900;
    color: #0D291C;
    opacity: 0.35;
    transition: opacity 0.15s;
    flex-shrink: 0;
    line-height: 1;
}

.modal-close:hover {
    opacity: 1;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 26px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.2) transparent;
}

.modal-body::-webkit-scrollbar {
    width: 5px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.25);
    border-radius: 99px;
}

.modal-foot {
    display: flex;
    gap: 12px;
    padding: 12px 26px 22px;
    border-top: 2px solid rgba(13, 41, 28, 0.12);
    flex-shrink: 0;
}

.btn-modal-dark {
    flex: 1;
    padding: 12px 20px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 2px solid #000;
    box-shadow: 0 4px 0px #000;
    background-color: #232B3A;
    color: white;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-modal-dark:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0px #000;
}

.btn-modal-dark--cancel {
    background-color: white;
    color: #232B3A;
}

/* Animación */
.modal-enter-active {
    transition: opacity 0.2s ease;
}

.modal-leave-active {
    transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-card {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.modal-leave-active .modal-card {
    animation: popOut 0.18s ease-in both;
}

@keyframes popIn {
    from {
        transform: scale(0.86) translateY(24px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@keyframes popOut {
    from {
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    to {
        transform: scale(0.92) translateY(12px);
        opacity: 0;
    }
}

@media (max-width: 500px) {
    .modal-card {
        border-radius: 26px;
    }

    .modal-head {
        padding: 16px 18px 14px;
    }

    .modal-body {
        padding: 14px 18px;
    }

    .modal-foot {
        padding: 10px 18px 18px;
    }
}
</style>