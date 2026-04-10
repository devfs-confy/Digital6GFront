<template>
    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Preguntas Frecuentes</h2>
            <div class="w-[72px] sm:w-[88px]" />
        </div>

        <!-- Buscador -->
        <div class="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border-2 border-gray-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0D291C" viewBox="0 0 24 24"
                class="shrink-0 opacity-35">
                <path
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input v-model="busqueda" type="text" placeholder="Buscar pregunta..."
                class="flex-1 border-none outline-none text-sm text-[#0D291C] bg-transparent placeholder:text-gray-400" />
            <button v-if="busqueda" @click="busqueda = ''" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>

        <!-- Sin resultados -->
        <div v-if="busqueda && categoriasFiltradas.length === 0"
            class="flex flex-col items-center gap-3 py-16 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span class="text-sm font-semibold">Sin resultados para "{{ busqueda }}"</span>
        </div>

        <!-- Categorías y FAQs -->
        <div v-for="cat in categoriasFiltradas" :key="cat.id" class="flex flex-col gap-2">

            <!-- Label categoría -->
            <p
                class="text-[0.6rem] font-black uppercase tracking-[0.12em] text-[#0D291C] opacity-45 border-b border-[rgba(13,41,28,0.1)] pb-1.5">
                {{ cat.nombre }}
            </p>

            <!-- Items FAQ -->
            <div v-for="faq in cat.faqs" :key="faq.id"
                class="bg-white rounded-2xl border-[1.5px] overflow-hidden transition-colors duration-150"
                :class="abierto === faq.id ? 'border-[#299261]' : 'border-[rgba(13,41,28,0.1)] hover:border-[#299261]'">

                <!-- Pregunta -->
                <div class="flex items-center justify-between gap-3 px-[18px] py-[14px] cursor-pointer select-none"
                    @click="toggleFaq(faq.id)">
                    <span class="text-[0.88rem] font-bold text-[#0D291C]">{{ faq.pregunta }}</span>
                    <div class="w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        :class="abierto === faq.id
                            ? 'bg-[#0D291C] rotate-45'
                            : 'bg-[#f0faf4] border-[1.5px] border-[#c8e6c9]'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            :fill="abierto === faq.id ? '#7FD344' : '#299261'">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                    </div>
                </div>

                <!-- Respuesta con animación -->
                <div class="overflow-hidden transition-all duration-250 ease-in-out"
                    :style="{ maxHeight: abierto === faq.id ? '400px' : '0px' }">
                    <div
                        class="px-[18px] pb-4 pt-3 text-[0.82rem] text-gray-500 leading-relaxed border-t border-[rgba(13,41,28,0.08)]">
                        {{ faq.respuesta }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const busqueda = ref('')
const abierto = ref(null)

const toggleFaq = (id) => {
    abierto.value = abierto.value === id ? null : id
}

// ── Datos ─────────────────────────────────────────────────────────
const categorias = [
    {
        id: 1,
        nombre: 'Mensualidades',
        faqs: [
            {
                id: 1,
                pregunta: '¿Cómo agrego una mensualidad?',
                respuesta: 'Dirígete a "Mis Mensualidades" y haz clic en el botón "Añadir". Selecciona la sede y completa el formulario con el código de verificación que te entregó el administrador.'
            },
            {
                id: 2,
                pregunta: '¿Cómo renuevo mi mensualidad?',
                respuesta: 'En la tarjeta de tu mensualidad, haz clic en el botón "Pagar". Selecciona el plan y el número de meses, luego confirma para ser redirigido a la pasarela de pago.'
            },
            {
                id: 3,
                pregunta: '¿Puedo congelar mi mensualidad?',
                respuesta: 'Sí. En la tarjeta de tu mensualidad activa, haz clic en "Congelar", selecciona la fecha de regreso y escribe una observación. El periodo se pausará y la fecha de vencimiento se extenderá automáticamente.'
            },
            {
                id: 4,
                pregunta: '¿Cómo cambio mis placas?',
                respuesta: 'Ingresa al detalle de tu mensualidad y haz clic en "Cambiar placa". Solo se permite un cambio por mes. Si deseas cambiar de tipo de vehículo (moto a carro o viceversa), usa la opción "Cambiar tipo".'
            },
        ]
    },
    {
        id: 2,
        nombre: 'Pagos',
        faqs: [
            {
                id: 5,
                pregunta: '¿Cómo consulto mis pagos?',
                respuesta: 'En el menú principal selecciona "Pagos Recientes" para ver el historial de tus últimas transacciones con su estado y valor.'
            },
            {
                id: 6,
                pregunta: '¿Qué hago si mi pago quedó pendiente?',
                respuesta: 'Al intentar pagar nuevamente, el sistema detectará automáticamente la transacción pendiente y te mostrará un enlace para completarla.'
            },
        ]
    },
    {
        id: 3,
        nombre: 'Cuenta y acceso',
        faqs: [
            {
                id: 7,
                pregunta: '¿Cómo actualizo mis datos personales?',
                respuesta: 'Ve a "Información Personal" desde el menú principal. Allí podrás actualizar tu nombre, teléfono y correo electrónico.'
            },
            {
                id: 8,
                pregunta: 'Perdí mi tarjeta de acceso, ¿qué hago?',
                respuesta: 'En la tarjeta de tu mensualidad activa verás el botón "Perdí mi tarjeta". Al confirmarlo, se habilitará el cobro de tarjeta y podrás tramitar una nueva desde el botón "Pagar".'
            },
        ]
    },
]

// ── Filtrado ──────────────────────────────────────────────────────
const categoriasFiltradas = computed(() => {
    if (!busqueda.value.trim()) return categorias
    const q = busqueda.value.toLowerCase()
    return categorias
        .map(cat => ({
            ...cat,
            faqs: cat.faqs.filter(f =>
                f.pregunta.toLowerCase().includes(q) ||
                f.respuesta.toLowerCase().includes(q)
            )
        }))
        .filter(cat => cat.faqs.length > 0)
})
</script>