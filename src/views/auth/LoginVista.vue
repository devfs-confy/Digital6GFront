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
                        type="text" id="document" />

                    <label class="self-start font-bold text-sm md:text-base" for="password">Contraseña</label>
                    <input v-model="password"
                        class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                        type="password" id="password" @keyup.enter="handleLogin" />

                    <!-- mensaje de error -->
                    <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

                    <p class="text-sm">
                        ¿No tienes cuenta?
                        <router-link to="/registro" class="text-[#299261] hover:underline">Regístrate</router-link>
                    </p>

                    <button @click="handleLogin" :disabled="cargando"
                        class="mt-4 bg-[#232B3A] text-white rounded-full py-2 px-6 w-[80%] md:w-[60%] hover:bg-[#299261] transition-colors disabled:opacity-50">
                        {{ cargando ? 'Ingresando...' : 'Ingresar' }}
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
const error = ref('')
const cargando = ref(false)

async function handleLogin() {
    error.value = ''
    cargando.value = true

    try {
        auth.login(documento.value, password.value)
        router.push(auth.redirectTo)  // redirige según el rol
    } catch (e) {
        error.value = e.message       // muestra "Documento o contraseña incorrectos"
    } finally {
        cargando.value = false
    }
}
</script>