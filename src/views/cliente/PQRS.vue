<template>
    <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
        <button @click="$router.back()"
            class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
            style="box-shadow: #595858 0px 2px 0">
            <AppIcon name="arrow_left_alt" :size="14" />
            <span class="hidden sm:inline">Volver</span>
        </button>
        <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">PQRS</h2>
        <button
            class=" cursor-none pointer-events-none flex items-center gap-1.5 bg-transparent text-transparent text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full">
            <AppIcon name="add" :size="14" />
            <span class="hidden sm:inline"></span>
        </button>
    </div>
</template>
