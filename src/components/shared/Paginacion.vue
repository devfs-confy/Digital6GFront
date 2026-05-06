<!-- @/components/shared/TablePagination.vue -->
<template>
    <div
        class="flex items-center justify-between gap-3 px-5 py-3 border-t-2 border-[#f0f9f4] bg-[#fafffe] flex-shrink-0 flex-wrap max-[600px]:px-3.5">
        <span class="text-[0.75rem] text-gray-400 max-[600px]:hidden">
            Pág. <strong class="text-[#0D291C]">{{ paginaActual }}</strong> de
            <strong class="text-[#0D291C]">{{ totalPaginas }}</strong>
            · <strong class="text-[#0D291C]">{{ totalRegistros }}</strong> registros
        </span>

        <div class="flex items-center gap-1">
            <button @click="$emit('pagina', paginaActual - 1)" :disabled="paginaActual === 1" class="page-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <span class="hidden max-[600px]:block text-[0.8rem] font-bold text-[#0D291C] px-2">
                {{ paginaActual }} / {{ totalPaginas }}
            </span>
            <template v-for="p in paginasVisibles" :key="p">
                <button @click="$emit('pagina', p)"
                    :class="['page-btn max-[600px]:hidden', paginaActual === p ? 'bg-[#0D291C] !text-[#0D291C] shadow-[0_2px_0_rgba(13,41,28,0.3)]' : '']">
                    {{ p }}
                </button>
            </template>
            <button @click="$emit('pagina', paginaActual + 1)" :disabled="paginaActual === totalPaginas"
                class="page-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </button>
        </div>

        <div class="flex items-center gap-2 text-xs text-gray-400">
            <span class="hidden sm:inline">Filas:</span>
            <select :value="limit" @change="$emit('limit', Number($event.target.value))"
                class="!rounded-xl !py-1 !px-2.5 !text-[0.75rem] !border !border-gray-200 !bg-gray-50 !text-gray-500 !shadow-none">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
            </select>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    paginaActual: { type: Number, required: true },
    totalPaginas: { type: Number, required: true },
    totalRegistros: { type: Number, required: true },
    limit: { type: Number, required: true },
})

defineEmits(['pagina', 'limit'])

const paginasVisibles = computed(() => {
    const total = props.totalPaginas
    const actual = props.paginaActual
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
    const start = Math.max(1, Math.min(actual - 2, total - 4))
    return Array.from({ length: 5 }, (_, i) => start + i)
})
</script>

<style scoped>
.page-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #6b7280;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
    flex-shrink: 0;
}

.page-btn:hover:not(:disabled) {
    background-color: #e8f5e9;
    color: #0D291C;
}

.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
</style>