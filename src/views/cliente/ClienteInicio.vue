<style scoped>
.opciones h2 {
    font-size: 1.3rem;
}

.opciones p {
    font-size: 1rem;
}
</style>

<template>

    <div class="
        flex-wrap
        flex
        gap-[5%]
        justify-center
        w-full
        p-6
        h-screen       
        align-start
        row-gap-[0.5vw]
        items-start
        ">

        <div :class="[
            'opciones rounded-xl flex flex-col p-[2vw] gap-4 text-[#232B3A] items-center  bg-white  cursor-pointer',
            isOpen ? 'w-[30%]' : 'w-[25%]'
        ]">
            <span v-html="calendarmonth"></span>
            <h2>Mis mensualidades
                <br>
                <p class="text-[#299261]">Al dia</p>

            </h2>
        </div>

        <div :class="[
            'opciones rounded-xl flex flex-col p-[2vw] gap-4 text-[#232B3A] items-center  bg-white  cursor-pointer',
            isOpen ? 'w-[30%]' : 'w-[25%]'
        ]">
            <span v-html="parkingsign"></span>
            <h2>Parqueos recientes
                <br>
                <p class="text-[#299261]">Ultimo: hoy 14:30</p>
            </h2>

        </div>

        <div :class="[
            'opciones rounded-xl flex flex-col p-[2vw] gap-4 text-[#232B3A] items-center  bg-white  cursor-pointer',
            isOpen ? 'w-[30%]' : 'w-[25%]'
        ]">
            <span v-html="stackedemail"></span>
            <h2>Notificaciones pendientes
                <br>
                <p class="text-[#299261]">3 notificaciones</p>

            </h2>
        </div>


        <div :class="[
            'opciones rounded-xl flex flex-col p-[2vw] gap-4 text-[#232B3A] items-center  bg-white  cursor-pointer',
            isOpen ? 'w-[30%]' : 'w-[25%]'
        ]">
            <span v-html="stackedemail"></span>
            <h2>Notificaciones pendientes
                <br>
                <p class="text-[#299261]">3 notificaciones</p>

            </h2>
        </div>


    </div>




</template>

<script setup>
import { ref } from 'vue'

import parkingsign from '../../assets/img/parking_sign.svg?raw'
import stackedemail from '../../assets/img/stacked_email.svg?raw'
import calendarmonth from '../../assets/img/calendar_month.svg?raw'


defineProps({
    isOpen: {
        type: Boolean,
        default: true
    }
})

</script>