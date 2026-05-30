<template>
    <div class="privacy-root">
        <div class="privacy-card">
            <div class="loader" />
            <p class="privacy-text">Redirigiendo a la Política de Privacidad...</p>
            <a :href="pdfUrl" target="_blank" class="privacy-link">
                Abrir PDF directamente
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pdfUrl = ref('https://parquearse.com/pdf/politicadetratamientosdedatos.pdf')

onMounted(() => {
    window.open(pdfUrl.value, '_blank')
})
</script>

<style scoped>
.privacy-root {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0faf4;
    font-family: "Funnel Display", sans-serif;
    padding: 24px;
}

.privacy-card {
    background: #fff;
    border: 2px solid #e8f5e9;
    border-radius: 20px;
    padding: 40px 32px;
    text-align: center;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 16px rgba(13, 41, 28, 0.06);
}

.loader {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid #e8f5e9;
    border-top-color: #0D291C;
    animation: spin 0.7s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.privacy-text {
    font-size: 0.88rem;
    font-weight: 700;
    color: #0D291C;
    margin: 0 0 16px;
}

.privacy-link {
    display: inline-block;
    font-size: 0.78rem;
    font-weight: 800;
    color: #299261;
    background: #f0faf4;
    border: 2px solid #c8e6c9;
    border-radius: 12px;
    padding: 10px 20px;
    text-decoration: none;
    transition: background 0.2s;
}

.privacy-link:hover {
    background: #e0f8ec;
}
</style>
