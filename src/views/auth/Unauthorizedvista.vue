<template>
    <div class="unauth-wrap">
        <div class="unauth-card">

            <!-- Ícono -->
            <div class="unauth-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
            </div>

            <!-- Texto -->
            <h1 class="unauth-title">Acceso denegado</h1>
            <p class="unauth-sub">
                No tienes permisos para ver esta página.<br>
                Estás autenticado como <strong>{{ rolLabel }}</strong>.
            </p>

            <!-- Acciones -->
            <div class="unauth-actions">
                <button @click="irAMiDashboard" class="btn-primary">
                    Ir a mi dashboard
                </button>
                <button @click="auth.logout(); router.push('/login')" class="btn-secondary">
                    Cerrar sesión
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const rolLabel = computed(() => {
    const labels = {
        administrador: 'Administrador',
        admin: 'Administrador',
        cliente: 'Cliente',
    }
    return labels[auth.role] ?? auth.role ?? 'Usuario'
})

function irAMiDashboard() {
    router.push(auth.redirectTo)
}
</script>

<style scoped>
.unauth-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0D291C;
    padding: 1rem;
}

.unauth-card {
    background-color: #B8E19E;
    border: 2.5px solid #0D291C;
    border-radius: 36px;
    box-shadow: 0 7px 0 #000;
    width: 100%;
    max-width: 420px;
    padding: 40px 32px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
}

.unauth-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #7FD344;
}

.unauth-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0D291C;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
}

.unauth-sub {
    font-size: 0.88rem;
    color: #0D291C;
    opacity: 0.7;
    line-height: 1.6;
}

.unauth-sub strong {
    opacity: 1;
    font-weight: 600;
    color: #0D291C;
}

.unauth-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 8px;
}

.btn-primary {
    width: 100%;
    padding: 13px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #232B3A;
    color: white;
    border: 2px solid #000;
    box-shadow: 0 4px 0 #000;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-primary:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #000;
}

.btn-secondary {
    width: 100%;
    padding: 12px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: white;
    color: #232B3A;
    border: 2px solid #000;
    box-shadow: 0 4px 0 #000;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-secondary:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #000;
}
</style>