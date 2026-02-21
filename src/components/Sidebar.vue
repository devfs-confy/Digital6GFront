<template>

    <div class="flex h-screen w-screen bg-[#F0F0F0] overflow-hidden">

        <aside :class="[
            'flex flex-col gap-[10%] items-center h-screen bg-[#0D291C] transition-all duration-300 overflow-hidden relative',
            isOpen ? 'w-[18%]' : 'w-[0%]'
        ]">

            <span v-html="iconaside2"></span>
            <span class="cursor-pointer absolute right-[0.5%] top-[12%]" @click="isOpen = !isOpen"
                v-html="colapsenormal"></span>


            <div class=" w-[75%]">
                <ul class="flex flex-col items-start gap-4 w-full">
                    <li v-for="item in menuItems" :key="item.id" @click="selectedItem = item.id" :class="['flex items-center gap-[5%] w-full h-[50px] cursor-pointer transition-all duration-200',
                        { selected: selectedItem === item.id }]">
                        <span v-html="colorearSVG(item.icon, selectedItem === item.id ? '#232B3A' : '#ffffff')" />
                        <p v-html="item.label" class="text-white whitespace-nowrap"
                            :class="{ '!text-[#232B3A]': selectedItem === item.id }" />
                    </li>
                </ul>
            </div>
        </aside>

        <div class="flex flex-col flex-1 h-screen transition-all duration-300">

            <div
                class="flex justify-between items-center text-white bg-[#0D291C] mx-4 mt-4 px-4 rounded-[5vw] p-[0.5%] h-[10%]">

                <div class="flex items-center gap-4">
                    <span class="" v-html="colapsenobg" @click="isOpen = !isOpen" :class="[
                        'cursor-pointer transition-all animate-slide-in-left ease-out delay-100 duration-800 block',
                        isOpen ? 'w-0 opacity-0 pointer-events-none hidden' : 'w-8 opacity-100'
                    ]" />
                    <h1 class="font-bold text-2xl md:text-3xl p-[1vw]" @click="activo = !activo">Dashboard</h1>
                </div>

                <div class="flex items-center gap-4">
                    <p>Jean Carlos</p>
                    <span v-html="icoaccount"></span>
                </div>
            </div>

            <main class="flex-1 overflow-auto p-6">
                <cliente-inicio :isOpen="isOpen" />
            </main>

        </div>
    </div>
</template>



<script setup>
import { ref } from 'vue'


const isOpen = ref(true)

import iconaside2 from '../assets/img/confylogo.svg?raw'
import colapsenormal from '../assets/img/colapsenormal.svg?raw'
import colapsenobg from '../assets/img/colapsenobg.svg?raw'
import icoaccount from '../assets/img/account_circle.svg?raw'
import icoInicio from '../assets/img/home.svg?raw'
import icoMensualidad from '../assets/img/event_available.svg?raw'
import icoNotificacion from '../assets/img/notifications.svg?raw'
import icoContrato from '../assets/img/contract.svg?raw'
import icoDisponible from '../assets/img/event_available.svg?raw'
import icoVerificado from '../assets/img/verified.svg?raw'
import icoTarifas from '../assets/img/car_tag.svg?raw'
import icoTarjetas from '../assets/img/credit_card_gear.svg?raw'
import icoClientes from '../assets/img/account_box.svg?raw'
import icoValidar from '../assets/img/calendar_check.svg?raw'
import icoSolicitudes from '../assets/img/receipt_long.svg?raw'
import icoReportes from '../assets/img/assignment.svg?raw'
import icoSedes from '../assets/img/emoji_transportation.svg?raw'
import icoMensual2 from '../assets/img/calendar_add_on.svg?raw'
import icoUsuarios from '../assets/img/manage_accounts.svg?raw'
import ClienteInicio from '../views/cliente/ClienteInicio.vue'

const selectedItem = ref(1)

const colorearSVG = (svgRaw, color) => {
    return svgRaw
        .replace(/fill="[^"]*"/g, `fill="${color}"`)
        .replace(/fill:[^;"]*/g, `fill:${color}`)
}

const menuItems = ref([
    { id: 1, label: 'Inicio', icon: icoInicio },
    { id: 2, label: 'Mensualidad', icon: icoMensualidad },
    { id: 3, label: 'Notificaciones<br>Pendientes', icon: icoNotificacion },
    { id: 4, label: 'Cambios y<br>peticiones', icon: icoContrato },
    { id: 5, label: 'Ver disponibilidad', icon: icoDisponible },
    { id: 6, label: 'Código<br>verificación', icon: icoVerificado },
    { id: 7, label: 'Ver tarifas', icon: icoTarifas },
    { id: 8, label: 'Tarjetas', icon: icoTarjetas },
    { id: 9, label: 'Clientes', icon: icoClientes },
    { id: 10, label: 'Validar<br>Mensualidades', icon: icoValidar },
    { id: 11, label: 'Solicitudes', icon: icoSolicitudes },
    { id: 12, label: 'Reportes', icon: icoReportes },
    { id: 13, label: 'Administrar<br>sedes', icon: icoSedes },
    { id: 14, label: 'Mensualidades', icon: icoMensual2 },
    { id: 15, label: 'Usuarios', icon: icoUsuarios },
])
</script>

<style scoped>
.selected {
    background-color: white;
    color: #232B3A;
    border-radius: 25px;
    padding-left: 15px;
}
</style>