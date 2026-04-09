<template>
    <div class="notif-wrapper" ref="wrapperRef">

        <!-- ── Botón campana ── -->
        <button class="notif-btn" @click="togglePanel">
            <svg class="notif-btn__icon" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span v-if="unreadCount > 0" class="notif-badge-pill">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
        </button>

        <Transition name="overlay">
            <div v-if="isOpen" class="fixed inset-0 bg-black/40 z-[998] sm:hidden" @click="isOpen = false" />
        </Transition>

        <!-- ── Panel dropdown ── -->
        <Transition name="panel">
            <div v-if="isOpen" class="notif-panel">

                <div class="notif-panel__head">
                    <div class="flex items-center gap-3">
                        <div class="panel-head-icon">
                            <svg class="head-svg" viewBox="0 0 24 24">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div class="flex flex-col">
                            <p class="head-title">Notificaciones</p>
                            <p class="head-sub">{{ unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día' }}</p>
                        </div>
                    </div>
                    <button v-if="unreadCount > 0" class="btn-mark-all" @click="markAllRead">
                        Marcar todo leído
                    </button>
                </div>

                <div class="flex gap-1 px-[18px] pt-3 pb-1">
                    <button v-for="t in tabs" :key="t.key" class="notif-tab"
                        :class="tabActual === t.key ? 'notif-tab--active' : 'notif-tab--inactive'"
                        @click="tabActual = t.key">
                        {{ t.label }}
                    </button>
                </div>

                <div class="notif-list">
                    <div v-if="loading" class="flex flex-col items-center gap-2 py-7">
                        <span class="confy-spinner" />
                        <p class="text-[0.68rem] font-bold text-slate-400">Cargando...</p>
                    </div>

                    <template v-else-if="itemsFiltrados.length">
                        <template v-if="noLeidos.length">
                            <div class="section-label">Nuevas</div>
                            <div v-for="(n, i) in noLeidos" :key="n.Id" class="notif-item notif-item--unread"
                                :style="{ '--band-color': bandColor[n.Tipo] ?? '#7FD344', animationDelay: `${i * 0.05}s` }"
                                @click="abrirDetalle(n)">
                                <div class="notif-icon-wrap" :class="iconClass[n.Tipo] ?? 'notif-icon-wrap--sistema'">
                                    <svg class="notif-icon-wrap__svg" viewBox="0 0 24 24">
                                        <template v-if="n.Tipo === 'Pago'">
                                            <rect x="1" y="4" width="22" height="16" rx="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </template>
                                        <template v-else-if="n.Tipo === 'Alerta'">
                                            <path
                                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                            <line x1="12" y1="9" x2="12" y2="13" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </template>
                                        <template v-else>
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                            <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                                        </template>
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center flex-wrap gap-1.5 mb-1">
                                        <span class="item-title">{{ n.Titulo }}</span>
                                        <span class="unread-dot" />
                                        <span class="notif-cat-badge" :class="badgeClass[n.Tipo] ?? 'badge-sistema'">{{
                                            n.Categoria }}</span>
                                    </div>
                                    <p class="item-msg">{{ n.Mensaje }}</p>
                                    <span class="item-time">{{ timeAgo(n.FechaCreacion) }}</span>
                                </div>
                            </div>
                        </template>
                        <template v-if="leidos.length">
                            <div class="section-label">Anteriores</div>
                            <div v-for="(n, i) in leidos" :key="n.Id" class="notif-item"
                                :style="{ animationDelay: `${i * 0.05}s` }" @click="abrirDetalle(n)">
                                <div class="notif-icon-wrap" :class="iconClass[n.Tipo] ?? 'notif-icon-wrap--sistema'">
                                    <svg class="notif-icon-wrap__svg" viewBox="0 0 24 24">
                                        <template v-if="n.Tipo === 'Pago'">
                                            <rect x="1" y="4" width="22" height="16" rx="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </template>
                                        <template v-else-if="n.Tipo === 'Alerta'">
                                            <path
                                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                            <line x1="12" y1="9" x2="12" y2="13" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </template>
                                        <template v-else>
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                            <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                                        </template>
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center flex-wrap gap-1.5 mb-1">
                                        <span class="item-title">{{ n.Titulo }}</span>
                                        <span class="notif-cat-badge" :class="badgeClass[n.Tipo] ?? 'badge-sistema'">{{
                                            n.Categoria }}</span>
                                    </div>
                                    <p class="item-msg">{{ n.Mensaje }}</p>
                                    <span class="item-time">{{ timeAgo(n.FechaCreacion) }}</span>
                                </div>
                            </div>
                        </template>
                    </template>

                    <div v-else class="flex flex-col items-center py-8">
                        <div class="notif-empty__icon">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                <line x1="12" y1="2" x2="12" y2="4" />
                            </svg>
                        </div>
                        <p class="text-[0.78rem] font-extrabold text-[#0D291C] mt-3 mb-1">Sin notificaciones</p>
                        <p class="text-[0.68rem] font-semibold text-slate-400">Estás al día con todo</p>
                    </div>
                </div>

                <!-- <div class="flex justify-center bg-[#f8fafb] border-t-[1.5px] border-[#f1f5f9] px-[18px] py-3">
                    <button class="btn-confy btn-confy--confirm w-full" @click="$router.push('/notificaciones')">
                        Ver todas las notificaciones
                    </button>
                </div> -->

            </div>
        </Transition>

        <!-- ── Modal detalle ── -->
        <Transition name="modal">
            <div v-if="notifDetalle" class="modal-overlay" @click.self="cerrarDetalle">
                <div class="modal-card">

                    <div class="modal-head">
                        <div class="flex items-center gap-3">
                            <div class="modal-head__icon"
                                :class="iconClass[notifDetalle.Tipo] ?? 'notif-icon-wrap--sistema'">
                                <svg class="notif-icon-wrap__svg" viewBox="0 0 24 24">
                                    <template v-if="notifDetalle.Tipo === 'Pago'">
                                        <rect x="1" y="4" width="22" height="16" rx="2" />
                                        <line x1="1" y1="10" x2="23" y2="10" />
                                    </template>
                                    <template v-else-if="notifDetalle.Tipo === 'Alerta'">
                                        <path
                                            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </template>
                                    <template v-else>
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                                    </template>
                                </svg>
                            </div>
                            <div>
                                <p class="head-title">{{ notifDetalle.Titulo }}</p>
                                <p class="head-sub">{{ notifDetalle.Tipo }} · {{ notifDetalle.Categoria }}</p>
                            </div>
                        </div>
                        <button class="modal-close-btn" @click="cerrarDetalle">✕</button>
                    </div>

                    <div class="modal-body">

                        <div class="modal-section">
                            <p class="modal-section__label">Mensaje</p>
                            <p class="modal-section__text">{{ notifDetalle.Mensaje }}</p>
                        </div>

                        <div class="modal-section">
                            <p class="modal-section__label">Detalles</p>
                            <div class="flex flex-col gap-2">
                                <div class="modal-detail-row">
                                    <span class="modal-detail-key">Estado</span>
                                    <span class="notif-cat-badge"
                                        :class="notifDetalle.EsLeida ? 'badge-leida' : (badgeClass[notifDetalle.Tipo] ?? 'badge-sistema')">
                                        {{ notifDetalle.EsLeida ? 'Leída' : 'Sin leer' }}
                                    </span>
                                </div>
                                <div class="modal-detail-row">
                                    <span class="modal-detail-key">Recibida</span>
                                    <span class="modal-detail-val">{{ formatFecha(notifDetalle.FechaCreacion) }}</span>
                                </div>
                                <div v-if="notifDetalle.FechaLectura" class="modal-detail-row">
                                    <span class="modal-detail-key">Leída el</span>
                                    <span class="modal-detail-val">{{ formatFecha(notifDetalle.FechaLectura) }}</span>
                                </div>
                                <div v-if="notifDetalle.FechaExpiracion" class="modal-detail-row">
                                    <span class="modal-detail-key">Expira</span>
                                    <span class="modal-detail-val">{{ formatFecha(notifDetalle.FechaExpiracion)
                                    }}</span>
                                </div>
                                <div v-if="notifDetalle.DocumentoUsuario" class="modal-detail-row">
                                    <span class="modal-detail-key">Usuario</span>
                                    <span class="modal-detail-val">{{ notifDetalle.DocumentoUsuario }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="notifDetalle.UrlAccion" class="modal-notice">
                            Esta notificación tiene una acción disponible. Haz clic en <strong>"Ir a la acción"</strong>
                            para
                            continuar.
                        </div>

                    </div>

                    <div class="modal-foot">
                        <button class="btn-confy btn-confy--cancel" @click="cerrarDetalle">Cerrar</button>
                        <button v-if="notifDetalle.UrlAccion" class="btn-confy btn-confy--confirm" @click="irAccion">
                            Ir a la acción
                        </button>
                    </div>

                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import NotificacionesService from '@/api/services/notificaciones.service'

// ── Estado ──────────────────────────────────────
const isOpen = ref(false)
const loading = ref(false)
const notificaciones = ref([])
const wrapperRef = ref(null)
const tabActual = ref('todas')
const notifDetalle = ref(null)

// ── Config ──────────────────────────────────────
const tabs = [
    { key: 'todas', label: 'Todas' },
    { key: 'pago', label: 'Pagos' },
    { key: 'sistema', label: 'Sistema' },
    { key: 'pqrs', label: 'pqrs' },
]

const bandColor = { Pago: '#7FD344', Alerta: '#f59e0b', Sistema: '#60a5fa' }
const iconClass = { Pago: 'notif-icon-wrap--pago', Sistema: 'notif-icon-wrap--sistema', Alerta: 'notif-icon-wrap--alerta' }
const badgeClass = { Pago: 'badge-pago', Sistema: 'badge-sistema', Alerta: 'badge-alerta' }

// ── Computed ─────────────────────────────────────
const unreadCount = computed(() => notificaciones.value.filter(n => !n.EsLeida).length)
const itemsFiltrados = computed(() => {
    if (tabActual.value === 'pago') return notificaciones.value.filter(n => n.Tipo === 'Pago')
    if (tabActual.value === 'pqrs') return notificaciones.value.filter(n => n.Tipo === 'RESPUESTA_PQRS')
    if (tabActual.value === 'sistema') return notificaciones.value.filter(n => n.Tipo === 'Sistema' || n.Tipo === 'Alerta')

    return notificaciones.value
})

const noLeidos = computed(() => itemsFiltrados.value.filter(n => !n.EsLeida))
const leidos = computed(() => itemsFiltrados.value.filter(n => n.EsLeida))

// ── Métodos ──────────────────────────────────────
async function fetchNotificaciones() {
    loading.value = true
    const res = await NotificacionesService.GetNotifiaciones()
    if (res?.success) notificaciones.value = res.data
    loading.value = false
}

async function abrirDetalle(notif) {
    if (!notif.EsLeida) {
        await NotificacionesService.GetNotifiacionesById(notif.Id)
        notif.EsLeida = true
    }
    notifDetalle.value = notif
    isOpen.value = false
}

function cerrarDetalle() { notifDetalle.value = null }

function irAccion() {
    if (notifDetalle.value?.UrlAccion) window.open(notifDetalle.value.UrlAccion, '_blank')
    cerrarDetalle()
}

function markAllRead() {
    notificaciones.value.forEach(n => {
        if (!n.EsLeida) {
            NotificacionesService.GetNotifiacionesById(n.Id)
            n.EsLeida = true
        }
    })
}

function togglePanel() {
    isOpen.value = !isOpen.value
    if (isOpen.value) fetchNotificaciones()
}

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 60) return 'hace un momento'
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
    return `hace ${Math.floor(diff / 86400)} d`
}

function formatFecha(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

function onClickOutside(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target)) isOpen.value = false
}

onMounted(() => {
    fetchNotificaciones()
    document.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
/* ── Wrapper ─────────────────────────────────── */
.notif-wrapper {
    position: relative;
}

/* ── Botón campana ───────────────────────────── */
.notif-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.07);
    border: 1.5px solid rgba(127, 211, 68, 0.2);
    box-shadow: 0 3px 0 #051510;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
}

.notif-btn:hover {
    background: rgba(255, 255, 255, 0.12);
}

.notif-btn:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #051510;
}

.notif-btn__icon {
    width: 20px;
    height: 20px;
    stroke: #7FD344;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* ── Badge contador ──────────────────────────── */
.notif-badge-pill {
    position: absolute;
    top: 5px;
    right: 5px;
    min-width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #dc2626;
    border: 2px solid #0D291C;
    font-size: 9px;
    font-weight: 900;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
}

/* ── Panel dropdown ──────────────────────────── */
.notif-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 340px;
    background: white;
    border-radius: 24px;
    border: 2px solid #0D291C;
    box-shadow: 0 6px 0 #051510;
    overflow: hidden;
    z-index: 999;
}

/* ── Header oscuro — panel y modal comparten ─── */
.notif-panel__head,
.modal-head {
    background: #0D291C;
    border-bottom: 2px solid #0a1f15;
    padding: 14px 18px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* ── Ícono en header — panel y modal comparten ─ */
.panel-head-icon,
.modal-head__icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    flex-shrink: 0;
    background: rgba(127, 211, 68, 0.15);
    border: 1.5px solid rgba(127, 211, 68, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
}

.head-svg {
    width: 16px;
    height: 16px;
    stroke: #7FD344;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* ── Textos de header — panel y modal comparten  */
.head-title {
    color: white;
    font-size: 0.88rem;
    font-weight: 800;
}

.head-sub {
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 1px;
}

/* ── Botón marcar todo leído ─────────────────── */
.btn-mark-all {
    background: transparent;
    color: #7FD344;
    border: 1.5px solid rgba(127, 211, 68, 0.3);
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    cursor: pointer;
    box-shadow: 0 2px 0 rgba(5, 21, 16, 0.6);
    transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
    white-space: nowrap;
}

.btn-mark-all:hover {
    background: rgba(127, 211, 68, 0.1);
}

.btn-mark-all:active {
    transform: translateY(2px);
    box-shadow: 0 0 0;
}

/* ── Botón cerrar modal ──────────────────────── */
.modal-close-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.08);
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.modal-close-btn:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #dc2626;
}

/* ── Tabs ────────────────────────────────────── */
.notif-tab {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1.5px solid;
    cursor: pointer;
    transition: all 0.15s, transform 0.1s, box-shadow 0.1s;
}

.notif-tab--active {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 2px 0 #051510;
}

.notif-tab--inactive {
    background: white;
    color: #64748b;
    border-color: #e2e8f0;
    box-shadow: 0 2px 0 #e2e8f0;
}

.notif-tab--inactive:hover {
    background: #f8fafb;
}

.notif-tab:active {
    transform: translateY(2px);
    box-shadow: 0 0 0 !important;
}

/* ── Lista ───────────────────────────────────── */
.notif-list {
    max-height: 320px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.notif-list::-webkit-scrollbar {
    width: 3px;
}

.notif-list::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 99px;
}

/* ── Section label ───────────────────────────── */
.section-label {
    font-size: 0.58rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #299261;
    padding: 10px 18px 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-label::after {
    content: '';
    flex: 1;
    height: 1.5px;
    background: linear-gradient(90deg, #c8e6c9, transparent);
}

/* ── Item ────────────────────────────────────── */
.notif-item {
    display: flex;
    gap: 12px;
    padding: 12px 18px;
    cursor: pointer;
    border-bottom: 1.5px solid #f1f5f9;
    border-left: 4px solid transparent;
    transition: background 0.15s;
    animation: itemIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

.notif-item:last-child {
    border-bottom: none;
}

.notif-item:hover {
    background: #f0fdf4;
}

.notif-item--unread {
    background: rgba(240, 253, 244, 0.7);
    border-left-color: var(--band-color, #7FD344);
}

/* ── Textos del item ─────────────────────────── */
.item-title {
    font-size: 0.78rem;
    font-weight: 800;
    color: #0D291C;
}

.item-msg {
    font-size: 0.72rem;
    font-weight: 600;
    color: #64748b;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-time {
    font-size: 0.6rem;
    font-weight: 700;
    color: #94a3b8;
    margin-top: 3px;
    display: block;
}

/* ── Ícono del item ──────────────────────────── */
.notif-icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid;
}

.notif-icon-wrap__svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.notif-icon-wrap--pago {
    background: #f0fdf4;
    border-color: #bbf7d0;
}

.notif-icon-wrap--pago .notif-icon-wrap__svg {
    stroke: #16a34a;
}

.notif-icon-wrap--sistema {
    background: #eff6ff;
    border-color: #bfdbfe;
}

.notif-icon-wrap--sistema .notif-icon-wrap__svg {
    stroke: #2563eb;
}

.notif-icon-wrap--alerta {
    background: #fef3c7;
    border-color: #fde68a;
}

.notif-icon-wrap--alerta .notif-icon-wrap__svg {
    stroke: #d97706;
}

/* ── Punto no leído ──────────────────────────── */
.unread-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7FD344;
    flex-shrink: 0;
    animation: dotPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes dotPop {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

/* ── Badge categoría ─────────────────────────── */
.notif-cat-badge {
    font-size: 0.55rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 2px 7px;
    border-radius: 999px;
    border: 1px solid;
}

.badge-pago {
    background: #dcfce7;
    color: #16a34a;
    border-color: #bbf7d0;
}

.badge-sistema {
    background: #dbeafe;
    color: #2563eb;
    border-color: #bfdbfe;
}

.badge-alerta {
    background: #fef3c7;
    color: #d97706;
    border-color: #fde68a;
}

.badge-leida {
    background: #f1f5f9;
    color: #64748b;
    border-color: #cbd5e1;
}

/* ── Empty ───────────────────────────────────── */
.notif-empty__icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #f0fdf4;
    border: 1.5px solid #c8e6c9;
    display: flex;
    align-items: center;
    justify-content: center;
    stroke: #299261;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* ── Spinner ─────────────────────────────────── */
.confy-spinner {
    display: block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2.5px solid rgba(127, 211, 68, 0.2);
    border-top-color: #7FD344;
    animation: spin 0.7s linear infinite;
}

/* ── Modal overlay ───────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
    z-index: 9999;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ── Modal card ──────────────────────────────── */
.modal-card {
    background: white;
    border: 2px solid #0D291C;
    border-radius: 24px;
    box-shadow: 0 6px 0 #000;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ── Modal ícono en header ───────────────────── */
.modal-head__icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    flex-shrink: 0;
    background: rgba(127, 211, 68, 0.15);
    border: 1.5px solid rgba(127, 211, 68, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ── Modal body ──────────────────────────────── */
.modal-body {
    background: #f8fafb;
    display: flex;
    flex-direction: column;
}

/* ── Modal sección ───────────────────────────── */
.modal-section {
    padding: 16px 20px;
    border-bottom: 1.5px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.modal-section:last-child {
    border-bottom: none;
}

.modal-section__label {
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #299261;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-section__label::after {
    content: '';
    flex: 1;
    height: 1.5px;
    background: linear-gradient(90deg, #c8e6c9, transparent);
}

.modal-section__text {
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
    line-height: 1.6;
}

/* ── Fila de detalle ─────────────────────────── */
.modal-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.modal-detail-key {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    white-space: nowrap;
}

.modal-detail-val {
    font-size: 0.72rem;
    font-weight: 700;
    color: #0D291C;
    text-align: right;
}

/* ── Modal notice ────────────────────────────── */
.modal-notice {
    margin: 0 20px 16px;
    background: #f0fdf4;
    border: 1.5px solid #c8e6c9;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #166534;
    line-height: 1.5;
}

/* ── Modal footer ────────────────────────────── */
.modal-foot {
    display: flex;
    gap: 10px;
    padding: 14px 20px;
    border-top: 1.5px solid #f1f5f9;
    background: white;
}

/* ── Botones — panel y modal comparten ──────── */
.btn-confy {
    flex: 1;
    border-radius: 999px;
    border: 2px solid;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 9px 20px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
}

.btn-confy:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important;
}

.btn-confy--confirm {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 3px 0 #051510;
}

.btn-confy--confirm:hover {
    background: #132e21;
}

.btn-confy--cancel {
    background: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-confy--cancel:hover {
    background: #f1f5f9;
}

/* ── Animaciones ─────────────────────────────── */
@keyframes itemIn {
    from {
        opacity: 0;
        transform: translateX(-8px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes popIn {
    from {
        transform: scale(0.86) translateY(24px);
        opacity: 0;
    }
}

@keyframes popOut {
    to {
        transform: scale(0.92) translateY(12px);
        opacity: 0;
    }
}

/* ── Transición panel ────────────────────────── */
.panel-enter-active {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.panel-leave-active {
    animation: popOut 0.18s ease-in both;
}

/* ── Transición modal ────────────────────────── */
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

.modal-enter-active .modal-card {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.modal-leave-active .modal-card {
    animation: popOut 0.18s ease-in both;
}

/* Después de .panel-enter-active / .panel-leave-active */

@media (max-width: 600px) {
    .panel-enter-active {
        animation: slideUp 0.32s cubic-bezier(0.34, 1.1, 0.64, 1) both;
    }

    .panel-leave-active {
        animation: slideDown 0.2s ease-in both;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0
    }

    to {
        transform: translateY(0);
        opacity: 1
    }
}

@keyframes slideDown {
    from {
        transform: translateY(0);
        opacity: 1
    }

    to {
        transform: translateY(100%);
        opacity: 0
    }
}

@media (max-width: 600px) {
    .notif-panel {
        position: fixed;
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        max-height: 85dvh;
        border-radius: 28px 28px 0 0;
        border-left: none;
        border-right: none;
        border-bottom: none;
        border-top: 2px solid #0D291C;
        box-shadow: 0 -1px 0 #051510;
        z-index: 999;
    }

    .notif-list {
        max-height: 55dvh;
    }
}
</style>