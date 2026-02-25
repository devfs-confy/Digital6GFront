<!-- layouts/AppLayout.skeleton.vue — versión fantasma mientras carga -->
<template>
    <div class="flex h-screen w-full bg-[#F0F0F0] overflow-hidden">

        <div class="flex flex-col gap-3 p-4 bg-[#0D291C] h-screen w-[20%] flex-shrink-0 gap-4">

            <div class="sk sk--rounded mb-4" style="height:48px" />

            <div v-for="i in 2" :key="i" class="flex items-center gap-3 px-2">
                <div class="sk sk--circle" style="width:28px;height:28px;flex-shrink:0" />
                <div class="sk" style="height:14px;flex:1" />
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="flex flex-col flex-1 h-screen overflow-hidden">

            <div class="flex items-center justify-between mx-4 mt-4 p-4 py-3 bg-white rounded-full">
                <div class="sk sk--pill" style="height:32px;width:80px" />
                <div class="sk sk--pill" style="height:28px;width:140px" />
                <div class="flex items-center gap-3">
                    <div class="sk" style="height:14px;width:80px;border-radius:6px" />
                    <div class="sk sk--circle" style="width:36px;height:36px" />
                </div>
            </div>

            <main class="flex-1 overflow-hidden p-6">

                <div class="grid grid-cols-3 gap-4 mb-4">
                    <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-5 flex flex-col gap-3">
                        <div class="flex justify-between">
                            <div class="flex flex-col gap-2">
                                <div class="sk sk--pill" style="height:18px;width:60px" />
                                <div class="sk" style="height:14px;width:120px;border-radius:6px" />
                                <div class="sk" style="height:11px;width:80px;border-radius:4px" />
                            </div>
                            <div class="sk" style="height:40px;width:50px;border-radius:8px" />
                        </div>
                        <div class="sk sk--rounded" style="height:120px" />
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div v-for="i in 6" :key="i" class="bg-white rounded-2xl p-5 flex flex-col items-center gap-3">
                        <div class="sk sk--rounded" style="width:60px;height:60px" />
                        <div class="sk" style="height:14px;width:80px;border-radius:6px" />
                        <div class="sk" style="height:11px;width:60px;border-radius:4px" />
                    </div>
                </div>

            </main>
        </div>
    </div>
</template>

<style scoped>
.sk {
    background: linear-gradient(90deg,
            #e5e7eb 25%,
            #efefef 50%,
            #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite linear;
}

/* Variantes de forma */
.sk--rounded {
    border-radius: 12px;
}

.sk--circle {
    border-radius: 50%;
}

.sk--pill {
    border-radius: 999px;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.bg-\[#0D291C\] .sk {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.08) 25%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.08) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite linear;
}
</style>