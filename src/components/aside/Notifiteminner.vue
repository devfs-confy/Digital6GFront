<template>
    <div class="notif-icon-wrap" :class="iconClass[notif.Tipo] ?? 'notif-icon-wrap--sistema'">
        <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" v-html="iconPath[notif.Tipo] ?? iconPath.Sistema" />
    </div>

    <div class="min-w-0 flex-1">
        <div class="flex items-center flex-wrap gap-1.5 mb-1">
            <span class="text-[0.78rem] font-extrabold text-[#0D291C]">{{ notif.Titulo }}</span>
            <span v-if="!notif.EsLeida" class="unread-dot" />
            <span class="notif-cat-badge" :class="badgeClass[notif.Tipo] ?? 'badge-sistema'">
                {{ notif.Categoria }}
            </span>
        </div>
        <p class="text-[0.72rem] font-semibold text-slate-500 leading-snug truncate">
            {{ notif.Mensaje }}
        </p>
        <span class="text-[0.6rem] font-bold text-slate-400 mt-1 block">{{ timeAgo }}</span>
    </div>
</template>

<script setup>
defineProps({
    notif: { type: Object, required: true },
    timeAgo: { type: String, required: true },
})

const iconClass = {
    Pago: 'notif-icon-wrap--pago',
    Sistema: 'notif-icon-wrap--sistema',
    Alerta: 'notif-icon-wrap--alerta',
}
const badgeClass = {
    Pago: 'badge-pago',
    Sistema: 'badge-sistema',
    Alerta: 'badge-alerta',
}
const iconPath = {
    Pago: `<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
    Sistema: `<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>`,
    Alerta: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
}
</script>

<style scoped>
/* ── Ícono contenedor ──────────────────────────── */
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

.notif-icon-wrap svg {
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.notif-icon-wrap--pago {
    background: #f0fdf4;
    border-color: #bbf7d0;
}

.notif-icon-wrap--pago svg {
    stroke: #16a34a;
}

.notif-icon-wrap--sistema {
    background: #eff6ff;
    border-color: #bfdbfe;
}

.notif-icon-wrap--sistema svg {
    stroke: #2563eb;
}

.notif-icon-wrap--alerta {
    background: #fef3c7;
    border-color: #fde68a;
}

.notif-icon-wrap--alerta svg {
    stroke: #d97706;
}

/* ── Punto no leído ────────────────────────────── */
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

/* ── Badge de categoría ────────────────────────── */
.notif-cat-badge {
    font-size: 0.55rem;
    font-weight: 700;
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
</style>