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
                        <button @click="emit('update:modelValue', false)" class="modal-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Cuerpo -->
                    <div class="modal-body">
                        <slot />
                    </div>

                    <!-- Pie -->
                    <div class="modal-foot">
                        <button @click="emit('update:modelValue', false)" class="btn-modal btn-cancel">
                            Cancelar
                        </button>
                        <button @click="emit('guardar')" class="btn-modal btn-save">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                            </svg>
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
</style>

<style scoped>
/* ── Overlay ──────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(9, 28, 19, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
}

/* ── Card ─────────────────────────────────────────── */
.modal-card {
    background: #ffffff;
    border: 2px solid #0D291C;
    border-radius: 24px;
    box-shadow:
        0 8px 0 #0D291C,
        0 24px 60px rgba(13, 41, 28, 0.25);
    width: 100%;
    max-width: 500px;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.modal-card--wide {
    max-width: 660px;
}

/* ── Head ─────────────────────────────────────────── */
.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 24px 18px;
    background: linear-gradient(135deg, #122e1e 0%, #0D291C 100%);
    flex-shrink: 0;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.modal-avatar {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1a5c36, #0a2516);
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.88rem;
    flex-shrink: 0;
    border: 1.5px solid rgba(127, 211, 68, 0.3);
    box-shadow: 0 0 0 3px rgba(127, 211, 68, 0.1);
    letter-spacing: 0.02em;
}

.modal-head__name {
    font-size: 0.98rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
}

.modal-head__sub {
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(127, 211, 68, 0.7);
    margin-top: 3px;
}

.modal-close {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
}

/* ── Body ─────────────────────────────────────────── */
.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(13, 41, 28, 0.15) transparent;
    background: #f8faf8;
}

.modal-body::-webkit-scrollbar {
    width: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(13, 41, 28, 0.18);
    border-radius: 99px;
}

/* ── Foot ─────────────────────────────────────────── */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 14px 24px 20px;
    border-top: 1.5px solid #e8ede8;
    flex-shrink: 0;
    background: #ffffff;
}

/* ── Buttons ──────────────────────────────────────── */
.btn-modal {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 18px;
    border-radius: 12px;
    font-weight: 800;
    font-size: 0.8rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
}

.btn-cancel {
    background: #f4f6f4;
    color: #374151;
    border: 1.5px solid #d1d9d1;
    box-shadow: none;
}

.btn-cancel:hover {
    background: #eaefea;
}

.btn-save {
    background: #0D291C;
    color: #ffffff;
    border: 1.5px solid #0D291C;
    box-shadow: 0 4px 14px rgba(13, 41, 28, 0.25);
}

.btn-save:hover {
    background: #1a4a2e;
    box-shadow: 0 6px 20px rgba(13, 41, 28, 0.35);
    transform: translateY(-1px);
}

.btn-save:active,
.btn-cancel:active {
    transform: translateY(0);
}

/* ── Animations ───────────────────────────────────── */
.modal-enter-active {
    transition: opacity 0.22s ease;
}

.modal-leave-active {
    transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-card {
    animation: popIn 0.3s cubic-bezier(0.34, 1.5, 0.64, 1) both;
}

.modal-leave-active .modal-card {
    animation: popOut 0.18s ease-in both;
}

@keyframes popIn {
    from {
        transform: scale(0.88) translateY(20px);
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
        transform: scale(0.93) translateY(10px);
        opacity: 0;
    }
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 500px) {
    .modal-card {
        border-radius: 20px;
    }

    .modal-head {
        padding: 16px 18px 14px;
    }

    .modal-body {
        padding: 14px 18px;
    }

    .modal-foot {
        padding: 12px 18px 18px;
    }
}
</style>
