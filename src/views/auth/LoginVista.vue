<template>
    <div class="flex flex-col justify-center items-center w-screen h-screen overflow-hidden bg-[#0D291C]">

        <div class="
      flex flex-col items-center justify-center p-6 gap-6
      lg:flex-row lg:w-[65%] lg:h-[70%] lg:gap-[7vw] lg:p-12 
      md:flex-row md:w-[85%] md:h-[70%] md:gap-[7vw] md:p-12 
      max-md:w-[60%] max-md:h-[70%] max-md:gap-[7vw] max-md:p-5
      max-md:flex-row max-sm:w-[85%] max-sm:h-[65%] max-sm:gap-[7vw] max-sm:p-5
      bg-white overflow-hidden rounded-2xl shadow-[2px_2px_18px_#299261] relative
    ">
            <img class="absolute top-0 right-0 lg:w-[25%] max-md:w-[40%] max-sm:w-[30%]"
                src="@/assets/img/confy-verde.png" alt="" />
            <img class="absolute bottom-0 left-0 lg:w-[18%] w-[25%] max-md:w-[40%] max-sm:w-[30%]"
                src="@/assets/img/confy-negro.png" alt="" />

            <div class="
        flex flex-col justify-between items-center
        p-6 rounded-2xl w-full h-auto
        md:w-[350px] md:h-[450px]
        border border-[#7FD344] text-[#232B3A] shadow-md
      ">
                <h1 class="text-2xl md:text-3xl font-bold text-black">Inicio de Sesión</h1>

                <div class="flex flex-col justify-center items-center gap-4 w-[80%] mt-4 md:mt-0 md:h-[90%]">

                    <label class="self-start font-bold text-sm md:text-base" for="document">Documento</label>
                    <input v-model="documento"
                        class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                        :class="{ 'border-red-400': auth.errorMsg }" type="text" id="document"
                        placeholder="Número de documento" @keyup.enter="handleLogin" />

                    <label class="self-start font-bold text-sm md:text-base" for="password">Contraseña</label>
                    <input v-model="password"
                        class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                        :class="{ 'border-red-400': auth.errorMsg }" type="password" id="password"
                        placeholder="••••••••" @keyup.enter="handleLogin" />

                    <!-- Error del store — viene directo del backend en español -->
                    <Transition name="error">
                        <div v-if="auth.errorMsg"
                            class="flex items-center gap-2 w-full bg-red-50 border border-red-300 rounded-lg px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc2626"
                                viewBox="0 0 24 24" class="flex-shrink-0">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <p class="text-red-600 text-xs font-medium">{{ auth.errorMsg }}</p>
                        </div>
                    </Transition>

                    <p class="text-sm">
                        ¿No tienes cuenta?
                        <router-link to="/seleccionsede" class="text-[#299261] hover:underline">Regístrate</router-link>
                    </p>

                    <button @click="handleLogin" :disabled="auth.loading || !documento || !password"
                        class="mt-4 bg-[#232B3A] text-white rounded-full py-2 px-6 w-[80%] md:w-[60%] hover:bg-[#299261] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <!-- Spinner -->
                        <span v-if="auth.loading" class="spinner" />
                        <span>{{ auth.loading ? 'Ingresando...' : 'Ingresar' }}</span>
                    </button>

                </div>
            </div>

            <img class="hidden md:block md:w-[45%]" src="@/assets/img/image 3.png" alt="login image" />
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const documento = ref('')
const password = ref('')


async function handleLogin() {
    if (!documento.value || !password.value) return

    const ruta = await auth.login(documento.value, password.value)

    if (ruta) router.push(ruta)
}
</script>

<style scoped>
.spinner {
    width: 16px;
    height: 16px;
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

.error-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.error-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.error-enter-from {
    opacity: 0;
    transform: translateY(-4px);
}

.error-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>