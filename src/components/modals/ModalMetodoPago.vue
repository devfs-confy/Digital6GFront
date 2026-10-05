<template>
    <Transition name="modal">
        <div v-if="modelValue" class="metodo-overlay" @click.self="cerrar">
            <div class="metodo-card">
                <!-- Head -->
                <div class="metodo-head">
                    <div class="metodo-head__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344" viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="metodo-head__title">Elige tu método de pago</p>
                        <p class="metodo-head__sub">Selecciona cómo quieres pagar tu mensualidad</p>
                    </div>
                    <button @click="cerrar" class="metodo-close">✕</button>
                </div>

                <!-- Body -->
                <div class="metodo-body">
                    <button @click="seleccionar('PLACETOPAY')" class="metodo-opcion" aria-label="Pagar con PlaceToPay">
                        <img src="@/assets/img/logo-pse-tarjeta.webp" alt="Pagar con PlaceToPay" class="metodo-logo" />
                    </button>

                    <button @click="seleccionar('BREB')" class="metodo-opcion" aria-label="Pagar con BREB">
                        <img src="@/assets/img/breb.png" alt="Pagar con BREB" class="metodo-logo" />
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'seleccionar'])

const cerrar = () => {
    emit('update:modelValue', false)
}

const seleccionar = (metodo) => {
    emit('seleccionar', metodo)
    emit('update:modelValue', false)
}
</script>

<style scoped>
/* Overlay */
.metodo-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 70;
    padding: 16px;
}

/* Card */
.metodo-card {
    background: white;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 8px 0 #000;
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: metodoIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

@keyframes metodoIn {
    from {
        opacity: 0;
        transform: scale(0.88) translateY(28px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Head */
.metodo-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px 14px;
    background: #0D291C;
    border-bottom: 2px solid #0a1f15;
    position: relative;
}

.metodo-head__icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: rgba(127, 211, 68, 0.15);
    border: 1.5px solid rgba(127, 211, 68, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.metodo-head__title {
    font-size: 0.92rem;
    font-weight: 600;
    color: white;
    line-height: 1.2;
}

.metodo-head__sub {
    font-size: 0.64rem;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 600;
    margin-top: 1px;
}

.metodo-close {
    margin-left: auto;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.12s;
}

.metodo-close:hover {
    background: rgba(255, 255, 255, 0.18);
    color: white;
}

/* Body */
.metodo-body {
    padding: 24px 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    background: white;
}

.metodo-opcion {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    padding: 18px 16px;
    border-radius: 20px;
    border: 2px solid #e2e8f0;
    background: #f8fafb;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 3px 0 #e2e8f0;
}

.metodo-opcion:hover {
    border-color: #c8e6c9;
    background: #f0fdf4;
    transform: translateY(-1px);
    box-shadow: 0 4px 0 #c8e6c9;
}

.metodo-opcion:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #c8e6c9;
}

.metodo-logo {
    max-width: 100%;
    max-height: 80px;
    height: auto;
    object-fit: contain;
}

/* Transitions */
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

.modal-enter-active .metodo-card {
    animation: metodoIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
</style>
