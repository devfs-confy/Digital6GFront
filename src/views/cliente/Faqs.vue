<template>
    <div class="flex flex-col gap-5 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <AdminPageHeader title="Preguntas Frecuentes" />

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

        <!-- Categorías (botones) — solo visibles cuando no se busca -->
        <div v-if="!busqueda" class="flex flex-wrap gap-2">
            <button v-for="cat in categorias" :key="cat.id" @click="seleccionarCategoria(cat.id)"
                class="flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.78rem] font-black border-2 transition-all cursor-pointer"
                :class="categoriaActiva === cat.id
                    ? 'bg-[#0D291C] text-[#7FD344] border-[#0D291C] shadow-[0_3px_0_#051510]'
                    : 'bg-white text-[#0D291C] border-[#c8e6c9] shadow-[0_2px_0_#c8e6c9] hover:border-[#299261] hover:bg-[#f0faf4]'">
                {{ cat.nombre }}
                <span class="text-[0.65rem] font-black opacity-60">({{ cat.faqs.length }})</span>
            </button>
        </div>

        <!-- Sin resultados búsqueda -->
        <div v-if="busqueda && faqsBuscadas.length === 0" class="flex flex-col items-center gap-3 py-16 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span class="text-sm font-semibold">Sin resultados para "{{ busqueda }}"</span>
        </div>

        <!-- Resultados búsqueda -->
        <template v-if="busqueda">
            <div class="flex flex-col gap-2">
                <p class="text-[0.62rem] font-black uppercase tracking-[0.1em] text-gray-400 pl-1">
                    {{ faqsBuscadas.length }} resultado{{ faqsBuscadas.length !== 1 ? 's' : '' }}
                </p>
                <div v-for="faq in faqsBuscadas" :key="faq.id"
                    class="bg-white rounded-2xl border-[1.5px] overflow-hidden transition-colors duration-150"
                    :class="abierto === faq.id ? 'border-[#299261]' : 'border-[rgba(13,41,28,0.1)] hover:border-[#299261]'">
                    <div class="flex items-start justify-between gap-3 px-[18px] py-[14px] cursor-pointer select-none"
                        @click="toggleFaq(faq.id)">
                        <div class="flex flex-col gap-1 flex-1 min-w-0">
                            <span class="text-[0.65rem] font-black uppercase tracking-wide text-[#299261] opacity-70">{{
                                faq._cat }}</span>
                            <span class="text-[0.88rem] font-bold text-[#0D291C]">{{ faq.pregunta }}</span>
                        </div>
                        <div class="w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                            :class="abierto === faq.id ? 'bg-[#0D291C] rotate-45' : 'bg-[#f0faf4] border-[1.5px] border-[#c8e6c9]'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                :fill="abierto === faq.id ? '#7FD344' : '#299261'">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                        </div>
                    </div>
                    <div class="overflow-hidden transition-all duration-250 ease-in-out"
                        :style="{ maxHeight: abierto === faq.id ? '400px' : '0px' }">
                        <div
                            class="px-[18px] pb-4 pt-3 text-[0.82rem] text-gray-500 leading-relaxed border-t text-left border-[rgba(13,41,28,0.08)] flex flex-col gap-3">
                            <span>{{ faq.respuesta }}</span>
                            <button v-if="faq.link" @click="router.push(faq.link.route)"
                                class="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.72rem] font-black bg-[#0D291C] text-[#7FD344] border border-[#0D291C] shadow-[0_2px_0_#051510] hover:bg-[#132e21] transition-all active:translate-y-[1px] active:shadow-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M10 6v2H5v11h11v-5h2v7H3V6h7zm11-3v8l-3.29-3.29-5.42 5.42-1.42-1.42 5.42-5.42L13 3h8z" />
                                </svg>
                                {{ faq.link.label }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- FAQs de categoría activa -->
        <template v-else-if="categoriaActiva">
            <div class="flex flex-col gap-2">
                <div v-for="faq in faqsCategoria" :key="faq.id"
                    class="bg-white rounded-2xl border-[1.5px] overflow-hidden transition-colors duration-150"
                    :class="abierto === faq.id ? 'border-[#299261]' : 'border-[rgba(13,41,28,0.1)] hover:border-[#299261]'">
                    <div class="flex items-start justify-between gap-3 px-[18px] py-[14px] cursor-pointer select-none"
                        @click="toggleFaq(faq.id)">
                        <span class="text-[0.88rem] font-bold text-[#0D291C]">{{ faq.pregunta }}</span>
                        <div class="w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                            :class="abierto === faq.id ? 'bg-[#0D291C] rotate-45' : 'bg-[#f0faf4] border-[1.5px] border-[#c8e6c9]'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                :fill="abierto === faq.id ? '#7FD344' : '#299261'">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                        </div>
                    </div>
                    <div class="overflow-hidden transition-all duration-250 ease-in-out"
                        :style="{ maxHeight: abierto === faq.id ? '400px' : '0px' }">
                        <div
                            class="px-[18px] pb-4 pt-3 text-[0.82rem] text-gray-500 leading-relaxed border-t text-left border-[rgba(13,41,28,0.08)] flex flex-col gap-3">
                            <span>{{ faq.respuesta }}</span>
                            <button v-if="faq.link" @click="router.push(faq.link.route)"
                                class="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.72rem] font-black bg-[#0D291C] text-[#7FD344] border border-[#0D291C] shadow-[0_2px_0_#051510] hover:bg-[#132e21] transition-all active:translate-y-[1px] active:shadow-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M10 6v2H5v11h11v-5h2v7H3V6h7zm11-3v8l-3.29-3.29-5.42 5.42-1.42-1.42 5.42-5.42L13 3h8z" />
                                </svg>
                                {{ faq.link.label }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Estado vacío: ninguna categoría seleccionada -->
        <template v-else>
            <div class="flex flex-col items-center gap-3 py-14 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
                <span class="text-sm font-semibold">Selecciona una categoría</span>
            </div>
        </template>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const busqueda = ref('')
const abierto = ref(null)
const categoriaActiva = ref(null)

const toggleFaq = (id) => {
    abierto.value = abierto.value === id ? null : id
}

const seleccionarCategoria = (id) => {
    categoriaActiva.value = categoriaActiva.value === id ? null : id
    abierto.value = null
}

// ── Datos ─────────────────────────────────────────────────────────
const categorias = [
    {
        id: 1,
        nombre: 'Mensualidades',
        faqs: [
            {
                id: 1,
                pregunta: '¿Cómo puedo pagar mis mensualidades en línea?',
                respuesta: 'Una vez registrado en nuestro portal, ingrese a "Mis Mensualidades", oprima el botón "Pagar", seleccione el valor de la mensualidad a cancelar y siga los pasos del proceso de pago.',
                link: { label: 'Ir a Mis Mensualidades', route: '/cliente/mensualidad' },
            },
            {
                id: 2,
                pregunta: '¿Cómo inicio mi mensualidad en el parqueadero?',
                respuesta: 'Una vez esté paga la mensualidad, queda activa desde la fecha de inicio registrada en el portal. Si el acceso a la sede es con tarjeta y no la tiene aún, ingrese al parqueadero retirando una tarjeta del módulo de ingreso y acérquese al punto de pago para que el operador le haga entrega de la tarjeta de mensualidad y le gestione la salida de este primer día.',
            },
            {
                id: 3,
                pregunta: '¿Cómo actualizo mis placas?',
                respuesta: 'Ingrese a "Mis Mensualidades", oprima el botón "Más info" y luego "Cambiar placa". Modifique la placa PRINCIPAL y/o PLACA 2. Solo se permite un cambio de placa por mes. Si tiene un pago activo por Moto e incluye una placa de Carro, el sistema le cobrará un excedente.',
                link: { label: 'Ir a Mis Mensualidades', route: '/cliente/mensualidad' },
            },
            {
                id: 4,
                pregunta: 'Perdí mi tarjeta de acceso, ¿qué hago?',
                respuesta: 'Ingrese a "Mis Mensualidades", oprima el botón "Perdí mi tarjeta" y confirme con "SÍ, PERDÍ MI TARJETA". Siga los pasos del proceso de pago y reclame la nueva tarjeta con el operador en la sede correspondiente.',
                link: { label: 'Ir a Mis Mensualidades', route: '/cliente/mensualidad' },
            },
            {
                id: 5,
                pregunta: '¿Dónde puedo consultar los días disponibles de mi mensualidad?',
                respuesta: 'Ingrese a "Mis Mensualidades". En la parte superior derecha de la pantalla encontrará el número de días que aún tiene disponibles.',
                link: { label: 'Ir a Mis Mensualidades', route: '/cliente/mensualidad' },
            },
        ]
    },
    {
        id: 2,
        nombre: 'Pagos',
        faqs: [
            {
                id: 6,
                pregunta: '¿Cómo consulto mis pagos?',
                respuesta: 'Ingrese a "Pagos Recientes". Aquí encontrará el historial de los últimos tres pagos efectuados con fecha de pago, valor y una opción para descargar la factura en PDF.',
                link: { label: 'Ir a Pagos Recientes', route: '/cliente/pagos' },
            },
            {
                id: 7,
                pregunta: '¿Qué hago si mi pago quedó pendiente?',
                respuesta: 'Al intentar pagar nuevamente, el sistema detectará automáticamente la transacción pendiente y le mostrará un enlace para completarla.',
                link: { label: 'Ir a Mis Mensualidades', route: '/cliente/mensualidad' },
            },
        ]
    },
    {
        id: 3,
        nombre: 'AvalPay',
        faqs: [
            {
                id: 8,
                pregunta: '¿Qué es AvalPay?',
                respuesta: 'AvalPay es la plataforma de pagos electrónicos que usa Parquearse para procesar en línea las transacciones generadas en la tienda virtual con las formas de pago habilitadas para tal fin.',
            },
            {
                id: 9,
                pregunta: '¿Cómo puedo pagar?',
                respuesta: 'En la tienda virtual de Parquearse podrá realizar su pago con los medios habilitados: tarjetas de crédito Visa, cuentas débito de ahorro y corriente mediante PSE y próximamente Bre-V.',
            },
            {
                id: 10,
                pregunta: '¿Es seguro ingresar mis datos bancarios en este sitio web?',
                respuesta: 'Sí. Parquearse delega en AVALPAY la captura de la información sensible. La plataforma cumple con los estándares internacionales PCI DSS y cuenta con certificado de seguridad SSL, garantizando comunicaciones encriptadas.',
            },
            {
                id: 11,
                pregunta: '¿Puedo realizar el pago cualquier día y a cualquier hora?',
                respuesta: 'Sí, en Parquearse podrá realizar sus pagos en línea los 7 días de la semana, las 24 horas del día.',
            },
            {
                id: 12,
                pregunta: '¿Puedo cambiar la forma de pago?',
                respuesta: 'Si aún no ha finalizado su pago, podrá volver al paso inicial y elegir otra forma de pago. Una vez finalizada la compra, no es posible cambiar la forma de pago.',
            },
            {
                id: 13,
                pregunta: '¿Pagar electrónicamente tiene algún costo adicional?',
                respuesta: 'No, los pagos electrónicos realizados a través de AVALPAY no generan costos adicionales para el comprador.',
            },
            {
                id: 14,
                pregunta: '¿Qué debo hacer si el pago no concluyó?',
                respuesta: 'Revise si llegó a su correo un email de confirmación. En caso de no recibirlo, contacte al departamento de contabilidad de Parquearse en contabilidad@parquearse.com.',
            },
            {
                id: 15,
                pregunta: '¿Qué debo hacer si no recibí el comprobante de pago?',
                respuesta: 'Ingrese a "Pagos Recientes" y oprima el botón "FACTURA" del pago correspondiente para descargar el comprobante en PDF. Si el pago no aparece en el historial, contacte a contabilidad al número 6076803042 o al correo contabilidad@parquearse.com.',
                link: { label: 'Ir a Pagos Recientes', route: '/cliente/pagos' },
            },
        ]
    },
    {
        id: 4,
        nombre: 'Cuenta y acceso',
        faqs: [
            {
                id: 16,
                pregunta: '¿Cómo actualizo mis datos personales?',
                respuesta: 'Ingrese a "Información Personal". Allí puede actualizar su nombre, teléfono y correo electrónico.',
                link: { label: 'Ir a Información Personal', route: '/cliente/informacion' },
            },
            {
                id: 17,
                pregunta: '¿Qué hago si registré mal el número de cédula cuando creé el usuario?',
                respuesta: 'Ingrese a "PQRS" y realice la solicitud de cambio de cédula.',
                link: { label: 'Ir a PQRS', route: '/cliente/pqrs' },
            },
            {
                id: 18,
                pregunta: '¿Qué hago si seleccioné mal la sede en el momento del registro?',
                respuesta: 'Ingrese a "PQRS" y realice la solicitud de cambio de sede.',
                link: { label: 'Ir a PQRS', route: '/cliente/pqrs' },
            },
        ]
    },
]

// ── Computed ──────────────────────────────────────────────────────
const faqsCategoria = computed(() => {
    if (!categoriaActiva.value) return []
    return categorias.find(c => c.id === categoriaActiva.value)?.faqs ?? []
})

const faqsBuscadas = computed(() => {
    const q = busqueda.value.trim().toLowerCase()
    if (!q) return []
    return categorias.flatMap(cat =>
        cat.faqs
            .filter(f => f.pregunta.toLowerCase().includes(q) || f.respuesta.toLowerCase().includes(q))
            .map(f => ({ ...f, _cat: cat.nombre }))
    )
})
</script>
