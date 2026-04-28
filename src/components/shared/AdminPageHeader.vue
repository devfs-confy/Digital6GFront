<template>
    <div
        class="relative flex items-center justify-center bg-white rounded-full p-3 sm:p-4 flex-shrink-0 min-h-[48px] sm:min-h-[56px]">
        <div class="absolute left-3 sm:left-4">
            <slot name="left">
                <button v-if="showBack" @click="$router.back()"
                    class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                    style="box-shadow: #595858 0px 2px 0">
                    <AppIcon name="arrow_left_alt" :size="14" />
                    <span class="hidden sm:inline">Volver</span>
                </button>
            </slot>
        </div>
        <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">{{ title }}</h2>
        <div class="absolute right-3 sm:right-4">
            <slot name="right" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, required: true },
    showBack: { type: Boolean, default: true },
})
</script>
