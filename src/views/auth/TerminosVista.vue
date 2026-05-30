<template>
    <div class="terminos-root">
        <header class="terminos-header">
            <div class="header-inner">
                <button class="btn-back" @click="goBack">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    Volver
                </button>
                <div class="header-brand">
                    <img src="@/assets/img/confy.png" alt="Confy" class="header-logo" />
                    <span class="header-title">Términos y Condiciones</span>
                </div>
            </div>
        </header>

        <main class="terminos-main">
            <div class="pdf-container">
                <iframe
                    :src="pdfUrl"
                    class="pdf-iframe"
                    title="Términos y Condiciones"
                    loading="lazy"
                />
            </div>
        </main>

        <footer class="terminos-footer">
            <p class="footer-text">
                Al usar nuestros servicios aceptas estos términos y condiciones.
            </p>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pdfUrl = ref('/pdfs/TERMINOS_Y_CONDICIONES_MENSUALIDADES.pdf')

function goBack() {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/registro')
    }
}
</script>

<style scoped>
.terminos-root {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #f0faf4;
    font-family: "Funnel Display", sans-serif;
}

/* ── Header ─────────────────────────── */
.terminos-header {
    background: #0D291C;
    padding: 14px 24px;
    flex-shrink: 0;
    border-bottom: 2px solid #0a1f15;
}

.header-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
}

.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 8px 14px;
    color: #7FD344;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
}

.btn-back:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
}

.btn-back:active {
    transform: translateY(0);
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
}

.header-logo {
    height: 30px;
    width: auto;
    object-fit: contain;
}

.header-title {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
    opacity: 0.85;
}

/* ── Main ───────────────────────────── */
.terminos-main {
    flex: 1;
    display: flex;
    padding: 24px;
    min-height: 0;
}

.pdf-container {
    flex: 1;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    background: #fff;
    border: 2px solid #e8f5e9;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 16px rgba(13, 41, 28, 0.06);
}

.pdf-iframe {
    width: 100%;
    height: 100%;
    min-height: 75vh;
    border: none;
    display: block;
}

/* ── Footer ─────────────────────────── */
.terminos-footer {
    background: #fff;
    border-top: 2px solid #e8f5e9;
    padding: 14px 24px;
    flex-shrink: 0;
    text-align: center;
}

.footer-text {
    font-size: 0.72rem;
    font-weight: 600;
    color: #9ca3af;
    margin: 0;
}

/* ── Responsive ─────────────────────── */
@media (max-width: 640px) {
    .terminos-header {
        padding: 10px 16px;
    }

    .header-title {
        display: none;
    }

    .btn-back {
        padding: 6px 10px;
        font-size: 0.72rem;
    }

    .terminos-main {
        padding: 12px;
    }

    .pdf-iframe {
        min-height: 60vh;
    }
}

@media (prefers-reduced-motion: reduce) {
    .btn-back {
        transition: none;
    }
}
</style>
