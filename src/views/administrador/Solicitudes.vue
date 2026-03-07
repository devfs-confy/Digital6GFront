<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <h1 class="text-black">Solicitudes</h1>

        <!-- Botón abrir modal -->
        <button @click="mostrarFacturacion = true"
            class="inline-flex items-center gap-2 bg-[#0D291C] text-[#7FD344] border-2 border-black rounded-full px-5 py-3 text-[0.82rem] font-black uppercase tracking-wide cursor-pointer transition-all hover:bg-[#1a4a2e] active:translate-y-[2px]"
            style="box-shadow:0 4px 0 #000">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#7FD344" viewBox="0 0 24 24">
                <path
                    d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
            Datos de facturación
        </button>

        <ModalFacturacion v-model="mostrarFacturacion"
            :datos-iniciales="{ correo: auth.user?.email, telefono: auth.user?.telefono }"
            @confirmar="onConfirmarFactura" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ModalFacturacion from '@/components/modals/ModalFacturacion.vue'

const auth = useAuthStore()
const mostrarFacturacion = ref(false)

const onConfirmarFactura = (datos) => {
    console.log('Datos facturación:', datos)
    // TODO: llamar endpoint de facturación con `datos`
}
</script>