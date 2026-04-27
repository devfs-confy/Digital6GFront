<template>
    <div class="flex flex-col gap-4 min-h-full pb-6">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="handleBack()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">{{ categoriaActiva ? 'Temas' : 'Volver' }}</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">
                {{ categoriaActiva ? categoriaActivaObj.label : 'Tutorial' }}
            </h2>
            <div class="w-[70px]" />
        </div>

        <!-- ── GRID DE CATEGORÍAS ── -->
        <template v-if="!categoriaActiva">

            <!-- Intro banner -->
            <div class="bg-[#0D291C] rounded-2xl px-5 py-4 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-[#7FD344]"
                    style="background: rgba(127,211,68,0.12); border: 1.5px solid rgba(127,211,68,0.25)">
                    <AppIcon name="contact_support" :size="26" />
                </div>
                <div>
                    <p class="text-white font-black text-sm leading-tight">¿Primera vez en Parquearse?</p>
                    <p class="text-white/50 text-[11px] mt-0.5 leading-snug">Elige un tema para aprender paso a paso
                        cómo usar la plataforma.</p>
                </div>
            </div>

            <!-- Label -->
            <p class="text-[0.62rem] font-black uppercase tracking-[0.1em] text-gray-400 pl-1">Elige un tema</p>

            <!-- Grid 2 columnas -->
            <div class="grid grid-cols-2 gap-3">
                <button v-for="cat in categorias" :key="cat.id" @click="seleccionarCategoria(cat.id)"
                    class="bg-white rounded-2xl border-[1.5px] border-[#e8f5e9] p-4 flex flex-col items-start gap-3 text-left hover:border-[#7FD344] hover:bg-[#f0faf4] transition-all group active:scale-95"
                    style="box-shadow: 0 2px 0 #e8f5e9">
                    <!-- Icono -->
                    <div
                        class="w-11 h-11 rounded-xl bg-[#f0faf4] border border-[#c8e6c9] flex items-center justify-center flex-shrink-0 text-[#0D291C] group-hover:bg-[#0D291C] group-hover:text-[#7FD344] group-hover:border-[#0D291C] transition-all">
                        <AppIcon :name="cat.icon" :size="22" />
                    </div>
                    <!-- Texto -->
                    <div class="flex-1 min-w-0 w-full">
                        <p class="text-[13px] font-black text-[#0D291C] leading-tight">{{ cat.label }}</p>
                        <p class="text-[10.5px] text-gray-400 mt-0.5">{{ cat.pasos.length }} pasos</p>
                    </div>
                    <!-- Dots preview + flecha -->
                    <div class="w-full flex items-center justify-between">
                        <div class="flex gap-0.5">
                            <div v-for="(_, i) in cat.pasos" :key="i" class="h-1 rounded-full"
                                :class="i === 0 ? 'w-4 bg-[#7FD344]' : 'w-1.5 bg-[#c8e6c9]'" />
                        </div>
                        <div
                            class="w-6 h-6 rounded-lg bg-[#f0faf4] border border-[#c8e6c9] flex items-center justify-center text-[#299261] group-hover:bg-[#7FD344] group-hover:border-[#7FD344] group-hover:text-[#0D291C] transition-all">
                            <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 17l5-5-5-5v10z" />
                            </svg>
                        </div>
                    </div>
                </button>
            </div>
        </template>

        <!-- ── TUTORIAL GUIADO ── -->
        <template v-if="categoriaActiva">

            <!-- Progreso -->
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <span class="text-[10.5px] font-black text-[#299261] uppercase tracking-wide">
                        Paso {{ pasoActual + 1 }} de {{ categoriaActivaObj.pasos.length }}
                    </span>
                    <span class="text-[10.5px] font-black text-gray-400">
                        {{ Math.round(((pasoActual + 1) / categoriaActivaObj.pasos.length) * 100) }}% completado
                    </span>
                </div>
                <div class="h-2 bg-[#e8f5e9] rounded-full overflow-hidden">
                    <div class="h-full bg-[#7FD344] rounded-full transition-all duration-500"
                        :style="{ width: ((pasoActual + 1) / categoriaActivaObj.pasos.length * 100) + '%' }" />
                </div>
                <!-- Step dots clicables -->
                <div class="flex gap-1.5 justify-center mt-0.5">
                    <button v-for="(_, i) in categoriaActivaObj.pasos" :key="i" @click="irAPaso(i)"
                        class="h-1.5 rounded-full transition-all duration-300" :class="i === pasoActual
                            ? 'w-6 bg-[#0D291C]'
                            : i < pasoActual ? 'w-2 bg-[#7FD344]' : 'w-2 bg-[#c8e6c9]'" />
                </div>
            </div>

            <!-- Card del paso (con transición dinámica) -->
            <transition :name="transicion" mode="out-in">
                <div :key="pasoActual"
                    class="bg-white rounded-2xl border-[1.5px] border-[#e8f5e9] overflow-hidden flex flex-col"
                    style="box-shadow: 0 3px 0 #e8f5e9">

                    <!-- Header oscuro con ícono -->
                    <div class="bg-[#0D291C] px-5 py-5 flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#7FD344]"
                            style="background: rgba(127,211,68,0.15); border: 1.5px solid rgba(127,211,68,0.3)">
                            <AppIcon :name="pasoActualObj.icon" :size="30" />
                        </div>
                        <div>
                            <p class="text-white font-black text-base leading-tight">{{ pasoActualObj.titulo }}</p>
                            <p class="text-white/45 text-[11px] mt-1">{{ pasoActualObj.subtitulo }}</p>
                        </div>
                    </div>

                    <!-- Carousel de imágenes -->
                    <div v-if="pasoActualObj.imgs?.length" class="relative overflow-hidden select-none bg-[#0A1F13]"
                        style="height: 290px" @touchstart.passive="swipeStart" @touchend.passive="swipeEnd">

                        <!-- Imagen con fade -->
                        <transition name="img-fade" mode="out-in">
                            <img :key="carouselIdx" :src="pasoActualObj.imgs[carouselIdx]" :alt="pasoActualObj.titulo"
                                class="absolute inset-0 w-full h-full object-contain cursor-zoom-in"
                                style="padding: 10px" @click="abrirLightbox(pasoActualObj.imgs[carouselIdx])" />
                        </transition>

                        <!-- Top bar: counter izq + ampliar der -->
                        <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-2.5 pointer-events-none"
                            style="background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%); padding-bottom: 18px">
                            <div v-if="pasoActualObj.imgs.length > 1"
                                class="bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-white text-[11px] font-black pointer-events-none">
                                {{ carouselIdx + 1 }} / {{ pasoActualObj.imgs.length }}
                            </div>
                            <div v-else class="w-1" />
                            <button
                                class="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[#7FD344] text-[10px] font-black pointer-events-auto"
                                @click="abrirLightbox(pasoActualObj.imgs[carouselIdx])">
                                <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                    <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
                                </svg>
                                Ampliar
                            </button>
                        </div>

                        <!-- Flechas + dots (solo si >1 imagen) -->
                        <template v-if="pasoActualObj.imgs.length > 1">
                            <button @click.stop="carouselPrev"
                                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 text-white flex items-center justify-center active:scale-90 transition-transform">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                            </button>
                            <button @click.stop="carouselNext"
                                class="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 text-white flex items-center justify-center active:scale-90 transition-transform">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                                </svg>
                            </button>
                            <!-- Dots bottom con gradiente -->
                            <div class="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-3"
                                style="background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%); padding-top: 20px">
                                <div class="flex items-center gap-1.5">
                                    <button v-for="(_, i) in pasoActualObj.imgs" :key="i" @click.stop="carouselIdx = i"
                                        class="rounded-full transition-all duration-250"
                                        :class="i === carouselIdx ? 'w-6 h-1.5 bg-[#7FD344]' : 'w-1.5 h-1.5 bg-white/45'" />
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Cuerpo -->
                    <div class="p-5 flex flex-col gap-4 text-left">

                        <!-- Descripción principal -->
                        <p class="text-[13px] leading-relaxed text-gray-600">{{ pasoActualObj.desc }}</p>

                        <!-- Bloques de información (icon + titulo + desc) -->
                        <div v-if="pasoActualObj.info?.length" class="flex flex-col gap-2">
                            <p class="text-[10px] font-black uppercase tracking-widest text-[#0D291C]/40">Información
                            </p>
                            <div v-for="(item, i) in pasoActualObj.info" :key="i"
                                class="flex items-center gap-3 bg-[#f0faf4] rounded-xl px-3.5 py-3 border border-[#c8e6c9]">
                                <div
                                    class="w-7 h-7 rounded-lg bg-[#0D291C] flex items-center justify-center flex-shrink-0 text-[#7FD344]">
                                    <AppIcon :name="item.icon || 'fact_check'" :size="15" />
                                </div>
                                <div>
                                    <p class="text-[12px] font-bold text-[#0D291C]">{{ item.titulo }}</p>
                                    <p class="text-[11px] text-gray-500 leading-snug mt-0.5">{{ item.desc }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Tips -->
                        <div v-if="pasoActualObj.tips?.length" class="flex flex-col gap-1.5">
                            <p class="text-[10px] font-black uppercase tracking-widest text-[#0D291C]/40">Consejos</p>
                            <div v-for="(tip, i) in pasoActualObj.tips" :key="i"
                                class="flex items-start gap-2 bg-[#f0faf4] rounded-xl px-3 py-2.5 border border-[#c8e6c9]">
                                <div class="w-1.5 h-1.5 rounded-full bg-[#299261] flex-shrink-0 mt-1.5" />
                                <span class="text-[11.5px] leading-snug text-[#0D291C]">{{ tip }}</span>
                            </div>
                        </div>

                        <!-- Nota de aviso (string o array) -->
                        <div v-if="pasoActualObj.nota" class="flex flex-col gap-2">
                            <p class="text-[10px] font-black uppercase tracking-widest text-amber-600/70">Importante</p>
                            <div v-for="(n, i) in (Array.isArray(pasoActualObj.nota) ? pasoActualObj.nota : [pasoActualObj.nota])"
                                :key="i"
                                class="flex items-start gap-2.5 bg-amber-50 rounded-xl px-3.5 py-3 border border-amber-200">
                                <div class="text-amber-500 flex-shrink-0 mt-0.5">
                                    <AppIcon name="gpp_maybe" :size="17" />
                                </div>
                                <span class="text-[11.5px] leading-snug text-amber-800">{{ n }}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </transition>
            <!-- Navegación Anterior / Siguiente -->
            <div class="flex gap-3">
                <button @click="anterior()"
                    class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm border-2 border-[#0D291C] text-[#0D291C] bg-white hover:bg-[#f0faf4] transition-all active:scale-95"
                    style="box-shadow: 0 3px 0 #c8e6c9">
                    <AppIcon name="arrow_left_alt" :size="16" />
                    {{ pasoActual === 0 ? 'Temas' : 'Anterior' }}
                </button>
                <button @click="siguiente()"
                    class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-[#0D291C] text-[#7FD344] hover:bg-[#1a4a2e] transition-all active:scale-95"
                    style="box-shadow: 0 3px 0 #051510">
                    {{ pasoActual === categoriaActivaObj.pasos.length - 1 ? '¡Listo!' : 'Siguiente' }}
                    <AppIcon :name="pasoActual === categoriaActivaObj.pasos.length - 1 ? 'verified' : 'event_available'"
                        :size="16" />
                </button>
            </div>
        </template>
    </div>

    <!-- ── LIGHTBOX ── -->
    <Teleport to="body">
        <Transition name="lb-fade">
            <div v-if="lightboxOpen" class="fixed inset-0 z-[9999] bg-gray-900/90 backdrop-blur-sm flex flex-col"
                @click.self="cerrarLightbox">

                <!-- Top bar con gradiente -->
                <div class="flex-shrink-0 flex items-center justify-between px-4 pt-5 pb-8"
                    style="background: linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)">
                    <div>
                        <p class="text-white font-black text-[13px] leading-tight">{{ pasoActualObj?.titulo }}</p>
                        <p v-if="pasoActualObj?.imgs?.length > 1" class="text-[#7FD344] text-[11px] font-black mt-0.5">
                            {{ carouselIdx + 1 }} / {{ pasoActualObj.imgs.length }}
                        </p>
                        <p v-else class="text-white/40 text-[10px] mt-0.5">Pellizca para hacer zoom</p>
                    </div>
                    <button @click="cerrarLightbox"
                        class="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all flex-shrink-0">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <!-- Imagen con zoom nativo -->
                <div class="flex-1 flex items-center justify-center px-3 overflow-auto"
                    style="touch-action: pinch-zoom;" @click.self="cerrarLightbox" @touchstart.passive="swipeStart"
                    @touchend.passive="swipeEndLightbox">
                    <transition name="img-fade" mode="out-in">
                        <img :key="carouselIdx" :src="lightboxImg" class="rounded-2xl object-contain"
                            style="max-width: 96vw; max-height: calc(100vh - 160px); touch-action: pinch-zoom;" />
                    </transition>
                </div>

                <!-- Bottom nav con gradiente -->
                <div class="flex-shrink-0 flex items-center justify-center gap-4 px-4 pb-8 pt-8"
                    style="background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)">
                    <template v-if="pasoActualObj?.imgs?.length > 1">
                        <button @click="lightboxPrev"
                            class="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all hover:bg-white/20">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                        </button>
                        <div class="flex gap-2 items-center">
                            <div v-for="(_, i) in pasoActualObj.imgs" :key="i"
                                class="rounded-full transition-all duration-200 cursor-pointer"
                                :class="i === carouselIdx ? 'w-6 h-1.5 bg-[#7FD344]' : 'w-1.5 h-1.5 bg-white/35'"
                                @click="saltoLightbox(i)" />
                        </div>
                        <button @click="lightboxNext"
                            class="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all hover:bg-white/20">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                            </svg>
                        </button>
                    </template>
                    <template v-else>
                        <p class="text-white/30 text-[11px]">Pellizca para hacer zoom</p>
                    </template>
                </div>

            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import pago1 from '@/assets/img/tutorial/pago1.png'
import pago2 from '@/assets/img/tutorial/pago2.png'
import pago3 from '@/assets/img/tutorial/pago3.png'


const router = useRouter()

// ── Estado ────────────────────────────────────────────────
const categoriaActiva = ref(null)
const pasoActual = ref(0)
const transicion = ref('slide-forward')
const carouselIdx = ref(0)
const lightboxOpen = ref(false)
const lightboxImg = ref(null)
const swipeTouchStartX = ref(0)

watch(pasoActual, () => { carouselIdx.value = 0 })
watch(lightboxOpen, val => { document.body.style.overflow = val ? 'hidden' : '' })

// ── Data ──────────────────────────────────────────────────
const categorias = [
    {
        id: 'inicio', label: 'Inicio Tutorial', icon: 'home',
        pasos: [
            {
                titulo: 'Tu pantalla de inicio o en tu menú de navegación',
                subtitulo: 'Lo primero que ves al entrar',
                icon: 'home', imgs: [],
                desc: 'Al ingresar al aplicativo podras visualizar 6 opciones de navegación: Inicio, Mis Mensualidades, Pagos Recientes, Parqueos, PQRS y más, donde puedes acceder a tus servicios y recibir ayuda.',
                info: [
                    { icon: 'home', titulo: 'Inicio', desc: 'Accede a la sección de inicio para ver tus opciones de navegación.' },
                    { icon: 'event_available', titulo: 'Mis mensualidades', desc: 'Verás cuántas mensualidades tienes vigentes y su fecha de vencimiento.' },
                    { icon: 'receipt_long', titulo: 'Pagos recientes', desc: 'Los pagos más recientes aparecen en el inicio para acceso rápido.' },
                    { icon: 'parking_sign', titulo: 'Parqueos', desc: 'Verás el historial de tus parqueos recientes.' },
                    { icon: 'contract_edit', titulo: 'PQRS', desc: 'Accede a la sección de PQRS para reportar cualquier problema.' },
                    { icon: 'info_i', titulo: 'Tutorial', desc: 'Puedes encontrar las respuestas a tus dudas en la sección de ayuda.' },
                    { icon: 'account_circle', titulo: 'Información', desc: 'Accede a la sección de información para obtener información importante.' },
                ],
                tips: [
                    'El ícono de campana muestra notificaciones pendientes',
                    'Toca el ícono de la sección activa para volver al inicio de esa sección',
                    'Puedes colapsar el menú lateral en pantallas grandes',
                ],
            },
        ],
    },
    {
        id: 'mensualidades', label: 'Mensualidades Tutorial', icon: 'event_available',
        pasos: [

            {
                titulo: 'Pagar mensualidad',
                subtitulo: 'Renovar o saldar una deuda',
                icon: 'payment_card',
                imgs: [pago1, pago2, pago3],
                desc: 'Toca tu mensualidad en el listado y selecciona "Pagar". Si es renovación elige la nueva fecha de inicio y serás dirigido a la pasarela AvalPay para completar el pago.',
                info: [
                    { icon: 'credit_score', titulo: 'Métodos aceptados', desc: 'Tarjeta Visa, Mastercard, débito y otros métodos habilitados en AvalPay.' },
                ],
                tips: [
                    'Recibirás confirmación por correo al finalizar',
                    'El estado se actualiza de inmediato al aprobar el pago',
                ],
            },
            {
                titulo: 'Cambiar Placa',
                subtitulo: 'Poder cambiar la placa de tu mensualidad 1 vez al mes',
                icon: 'payment_card', imgs: [],
                desc: 'Busca tu mensualidad en el listado y selecciona "Más info". Buscas la opcion de "Cambiar Placa" y escribe la nueva placa.',

                tips: [
                    'Solo podrás cambiar la placa 1 vez al mes',
                ],
                nota: ['Si haces un cambio de mensualidad de moto a carro, se te cobrará un excedente del costo de la mensualidad de carro.',
                    'Si vas ha realizar el cambio y pagarás el excedente, ten en cuenta que la fecha de vencimiento no se actualizará, será la vigente.',],
            },
            {
                titulo: 'Ver mis mensualidades',
                subtitulo: 'Listado y estados',
                icon: 'event_available', imgs: [],
                desc: 'En "Mis Mensualidades" verás todas tus mensualidades registradas con su estado actual, sede, placa y fecha de vencimiento.',
                info: [
                    { icon: 'offline_pin_green', titulo: 'Activa', desc: 'La mensualidad está vigente y puedes usar el parqueadero sin problema.' },
                    { icon: 'snowflake_green', titulo: 'Congelada', desc: 'La mensualidad está pausada hasta la nueva fecha de inicio.' },
                    { icon: 'explosion_green', titulo: 'Vencida', desc: 'Debes pagar para renovarla y continuar usando el servicio.' },
                    { icon: 'brightness_alert_green', titulo: 'Por_vencer', desc: 'Puedes pagar con anticipación para continuar usando el servicio.' },
                ],
                tips: ['Desliza hacia abajo para refrescar la lista'],
            },
            {
                titulo: 'Registrar nueva mensualidad',
                subtitulo: 'Los siguienetes 2 pasos',
                icon: 'add', imgs: [],
                desc: 'Toca el botón verde "+" en la esquina superior. Se abrirá el flujo de registro: elegir sede → ingresar código de verificación → confirmar.',
                info: [
                    { icon: 'fact_check', titulo: 'Requisito previo', desc: 'El operario del parqueadero de la sede que quieras agregar debe darte un código de verificación antes de comenzar.' },
                ],
                tips: [
                    'El botón "+" solo aparece si hay cupos disponibles en alguna sede',
                    'Puedes tener varias mensualidades en diferentes sedes',
                ],
                nota: 'El código de verificación lo genera el operario del parqueadero y expira en 15 Minutos.',
            },
            {
                titulo: 'Seleccionar la sede',
                subtitulo: 'Elige el parqueadero',
                icon: 'parking_sign', imgs: [],
                desc: 'Se desplegará el listado de sedes disponibles. Busca la sede de tu parqueadero por nombre y tócala para seleccionarla. Solo aparecen sedes con cupos activos.',
                tips: [
                    'Verifica la dirección antes de confirmar',
                ],
            },
            {
                titulo: 'Código de verificación',
                subtitulo: 'Ingresa el código del operario',
                icon: 'fact_check', imgs: [],
                desc: 'Escribe el código único que te dio el operario en el campo habilitado. Toca "Confirmar" y tu mensualidad quedará activa de inmediato.',
                tips: [
                    'El código distingue mayúsculas y minúsculas — escríbelo exactamente',
                    'Si no funciona, pide al operario que genere uno nuevo',
                ],
                nota: 'El código expira a los 15 Minutos de ser generado por el operario.',
            },

        ],
    },
    {
        id: 'pagos', label: 'Historial de Pagos Tutorial', icon: 'receipt_long',
        pasos: [
            {
                titulo: 'Historial de pagos',
                subtitulo: 'Todas tus transacciones',
                icon: 'receipt_long', imgs: [],
                desc: 'En "Pagos Recientes" encontrarás un listado cronológico de todas tus transacciones: del más reciente al más antiguo, fecha de pago y valor de cada una.',
                tips: [
                    'Se ordenan del más reciente al más antiguo',
                    'Desliza hacia abajo para refrescar',
                ],
            },


            {
                titulo: 'Descargar comprobante',
                subtitulo: 'Guardar PDF',
                icon: 'assignment', imgs: [],
                desc: 'En el detalle de un pago aprobado toca "Factura" para guardar el PDF y poder compartirlo por WhatsApp o correo electrónico.',
                tips: [
                    'El comprobante incluye número de transacción, fecha y valor exacto',
                    'Es válido como soporte ante el parqueadero o tu banco',
                ],
            },
        ],
    },
    {
        id: 'parqueos', label: 'Parqueos Tutorial', icon: 'parking_sign',
        pasos: [
            {
                titulo: 'Parqueos recientes',
                subtitulo: 'Historial de entradas y salidas',
                icon: 'parking_sign', imgs: [],
                desc: 'En "Parqueos Recientes" está el historial de cada vez que ingresaste: fecha, hora de entrada y salida y duración total del turno.',
                tips: [
                    'Se ordenan del más reciente al más antiguo',
                    'Desliza hacia abajo para refrescar',
                ],
            },

        ],
    },
    {
        id: 'pqrs', label: 'PQRS Tutorial', icon: 'contract_edit',
        pasos: [
            {
                titulo: '¿Qué es una PQRS?',
                subtitulo: 'Peticiones, Quejas, Reclamos y Sugerencias',
                icon: 'contact_support', imgs: [],
                desc: 'PQRS es el canal oficial de comunicación entre tú y Parquearse. Úsalo para hacer peticiones formales, reportar problemas, presentar reclamos o dar sugerencias de mejora.',
                info: [
                    { icon: 'contract_edit', titulo: 'Petición', desc: 'Solicitar información o un servicio específico.' },
                    { icon: 'gpp_maybe', titulo: 'Queja', desc: 'Expresar inconformidad con el servicio recibido.' },
                    { icon: 'fact_check', titulo: 'Reclamo', desc: 'Exigir una solución a un problema concreto.' },
                    { icon: 'assignment', titulo: 'Sugerencia', desc: 'Proponer mejoras al servicio o la plataforma.' },
                ],
            },
            {
                titulo: 'Crear una solicitud',
                subtitulo: 'Paso a paso',
                icon: 'edit_square', imgs: [],
                desc: 'Toca "Nueva o +", selecciona el tipo, describe tu caso con detalle y adjunta evidencia si es necesario. Luego toca "Enviar" para radicar tu solicitud.',
                tips: [
                    'Incluye fecha, sede y número de transacción si aplica — agiliza la respuesta',
                    'La descripción acepta hasta 500 caracteres',
                    'Puedes adjuntar fotos o capturas de pantalla como evidencia',
                ],
            },
            {
                titulo: 'Seguimiento de tu PQRS',
                subtitulo: 'Cómo saber el estado de tu solicitud',
                icon: 'content_paste_search', imgs: [],
                desc: 'En el listado de PQRS verás el estado de cada solicitud: pendiente, en revisión o resuelto. Toca cualquiera para leer la respuesta del equipo de Parquearse.',
                tips: [
                    'Recibirás una notificación cuando haya actualización',
                ],
            },
        ],
    },
    {
        id: 'perfil', label: 'Mi Perfil Tutorial', icon: 'account_circle',
        pasos: [
            {
                titulo: 'Ver mi información personal',
                subtitulo: 'Tus datos registrados',
                icon: 'account_circle', imgs: [],
                desc: 'En "Información Personal" puedes ver todos los datos de tu cuenta: nombre completo, número de documento, correo electrónico y teléfono de contacto.',
                tips: [
                    'Solo tú puedes ver y modificar tus datos',
                    'Mantén tu correo actualizado para recibir confirmaciones de pago',
                ],
            },
            {
                titulo: 'Editar mis datos',
                subtitulo: 'Actualizar nombre, teléfono o correo',
                icon: 'person_edit', imgs: [],
                desc: 'Toca el campo que deseas cambiar, escribe el nuevo valor y toca "Guardar". El cambio de documento requiere una solicitud de verificación.',
                tips: [
                    'Los demás cambios se guardan de inmediato',
                ],
                nota: 'Al cambiar el correo recibirás un mensaje de confirmación antes de que el cambio sea efectivo.',
            },
            {
                titulo: 'Cambiar contraseña',
                subtitulo: 'Cambiar tu contraseña',
                icon: 'visibility_off', imgs: [],
                desc: 'Toca "Cambiar contraseña" y escribe tu contraseña actual y la nueva. Toca "Guardar contraseña" para confirmar.',
            },
        ],
    },
]

// ── Computed ──────────────────────────────────────────────
const categoriaActivaObj = computed(() =>
    categorias.find(c => c.id === categoriaActiva.value)
)
const pasoActualObj = computed(() =>
    categoriaActivaObj.value?.pasos[pasoActual.value]
)

// ── Métodos ───────────────────────────────────────────────
function seleccionarCategoria(id) {
    categoriaActiva.value = id
    pasoActual.value = 0
    transicion.value = 'slide-forward'
}

function siguiente() {
    const total = categoriaActivaObj.value.pasos.length
    if (pasoActual.value < total - 1) {
        transicion.value = 'slide-forward'
        pasoActual.value++
    } else {
        categoriaActiva.value = null
        pasoActual.value = 0
    }
}

function anterior() {
    if (pasoActual.value > 0) {
        transicion.value = 'slide-back'
        pasoActual.value--
    } else {
        categoriaActiva.value = null
        pasoActual.value = 0
    }
}

function irAPaso(idx) {
    transicion.value = idx > pasoActual.value ? 'slide-forward' : 'slide-back'
    pasoActual.value = idx
}

function handleBack() {
    if (categoriaActiva.value) {
        categoriaActiva.value = null
        pasoActual.value = 0
    } else {
        router.back()
    }
}

function carouselPrev() {
    const len = pasoActualObj.value.imgs.length
    carouselIdx.value = (carouselIdx.value - 1 + len) % len
}

function carouselNext() {
    const len = pasoActualObj.value.imgs.length
    carouselIdx.value = (carouselIdx.value + 1) % len
}

function abrirLightbox(src) {
    lightboxImg.value = src
    lightboxOpen.value = true
}

function cerrarLightbox() {
    lightboxOpen.value = false
}

function lightboxPrev() {
    const len = pasoActualObj.value.imgs.length
    carouselIdx.value = (carouselIdx.value - 1 + len) % len
    lightboxImg.value = pasoActualObj.value.imgs[carouselIdx.value]
}

function lightboxNext() {
    const len = pasoActualObj.value.imgs.length
    carouselIdx.value = (carouselIdx.value + 1) % len
    lightboxImg.value = pasoActualObj.value.imgs[carouselIdx.value]
}

function saltoLightbox(i) {
    carouselIdx.value = i
    lightboxImg.value = pasoActualObj.value.imgs[i]
}

function swipeStart(e) {
    swipeTouchStartX.value = e.touches[0].clientX
}

function swipeEnd(e) {
    const delta = swipeTouchStartX.value - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? carouselNext() : carouselPrev()
}

function swipeEndLightbox(e) {
    const delta = swipeTouchStartX.value - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? lightboxNext() : lightboxPrev()
}
</script>

<style scoped>
.slide-forward-enter-active,
.slide-forward-leave-active {
    transition: all 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-forward-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-forward-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

.slide-back-enter-active,
.slide-back-leave-active {
    transition: all 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-back-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.slide-back-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.lb-fade-enter-active,
.lb-fade-leave-active {
    transition: opacity 0.2s ease;
}

.lb-fade-enter-from,
.lb-fade-leave-to {
    opacity: 0;
}

.img-fade-enter-active,
.img-fade-leave-active {
    transition: opacity 0.15s ease;
}

.img-fade-enter-from,
.img-fade-leave-to {
    opacity: 0;
}

@media (max-width: 767px) {

    .lb-fade-enter-active,
    .lb-fade-leave-active {
        transition-duration: 0ms !important;
    }

    .img-fade-enter-active,
    .img-fade-leave-active {
        transition-duration: 0ms !important;
    }
}
</style>
