<template>
    <div class="dashboard-grid">

        <div v-for="opcion in opciones" :key="opcion.id" class="opcion-card card-animation"
            @click="router.push(opcion.route)">

            <!-- Ícono -->
            <div class="opcion-icon">
                <span v-html="opcion.icon" />
            </div>

            <!-- Texto -->
            <div class="opcion-text">
                <h2 class="opcion-title">{{ opcion.titulo }}</h2>
                <p class="opcion-sub">{{ opcion.sub }}</p>
            </div>

        </div>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import estado from '@/assets/img/stacked_email_green.svg?raw'
import parqueos from '@/assets/img/parking_sign_green.svg?raw'
import pagos from '@/assets/img/receipt_long_green.svg?raw'


const router = useRouter()

const opciones = [
    {
        id: 1,
        icon: estado,
        titulo: 'Mis Solicitudes',
        sub: '',
        route: "/cliente/solicitudes"
    },
    {
        id: 2,
        icon: parqueos,
        titulo: 'Parqueos Recientes',
        sub: 'Ultimo: Hoy 14:20',
        route: "/cliente/parqueos",
    },
    {
        id: 3,
        icon: pagos,
        titulo: 'Pagos Recientes',
        sub: '',
        route: "/cliente/pagos",

    },
]
</script>

<style scoped>
.card-animation {
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes cardIn {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    padding: 24px;
    align-content: start;
    width: 100%;
}

@media (max-width: 900px) {
    .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 520px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
        padding: 14px;
        gap: 12px;
    }
}

/* ── Tarjeta ─────────────────────────────────────────────────────── */
.opcion-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background-color: white;
    border-radius: 20px;
    padding: 20px 20px 20px 18px;
    cursor: pointer;
    border: 2px solid transparent;
    box-shadow: 0 2px 8px rgba(13, 41, 28, 0.06);
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.15s;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 12px rgba(13, 41, 28, 0.07);
    transition: opacity 0.2s ease;

}

.opcion-card:hover {
    border-color: #299261;
    box-shadow: 0 4px 0 #0D291C, 0 2px 16px rgba(13, 41, 28, 0.12);
    transform: translateY(-2px);
}

.opcion-card:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #0D291C, 0 1px 6px rgba(13, 41, 28, 0.1);
}

@media (max-width: 520px) {
    .opcion-card {
        padding: 16px;
        border-radius: 16px;
    }
}

/* ── Ícono ───────────────────────────────────────────────────────── */
.opcion-icon {
    width: 72px;
    height: 72px;
    border-radius: 14px;
    background-color: #e8f5e9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.18s;
}

.opcion-card:hover .opcion-icon {
    background-color: #0D291C;
}

/* SVG inyectado vía v-html */
:deep(.opcion-icon svg) {
    width: 40px;
    height: 40px;
    fill: #0D291C;
    transition: fill 0.18s;
    display: block;
}

.opcion-card:hover :deep(.opcion-icon svg) {
    fill: #7FD344;
}

@media (max-width: 520px) {
    .opcion-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
    }

    :deep(.opcion-icon svg) {
        width: 22px;
        height: 22px;
    }
}

/* ── Texto ───────────────────────────────────────────────────────── */
.opcion-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.opcion-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0D291C;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.opcion-sub {
    font-size: 0.85rem;
    font-weight: 600;
    color: #299261;
}
</style>
