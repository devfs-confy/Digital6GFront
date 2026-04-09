<template>
    <div class="h-full flex flex-col gap-6 maincontainer">

        <!-- Header -->
        <div class="flex items-center justify-between bg-white rounded-full p-3 sm:p-4 flex-shrink-0">
            <button @click="$router.back()"
                class="flex items-center gap-1.5 bg-[#7FD344] text-[#232B3A] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="arrow_left_alt" :size="14" />
                <span class="hidden sm:inline">Volver</span>
            </button>
            <h2 class="text-base sm:text-2xl font-bold text-[#232B3A]">Arqueos</h2>
            <button @click="abrirGenerarArqueo"
                class="flex items-center gap-1.5 bg-[#0D291C] text-[#7FD344] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full border border-black"
                style="box-shadow: #595858 0px 2px 0">
                <AppIcon name="add" :size="14" />
                <span class="hidden sm:inline">Generar</span>
            </button>
        </div>

        <!-- Arqueos -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div class="px-5 py-3.5 bg-[#0D291C] border-b-[3px] border-[#7FD344] flex items-center justify-between">
                <span class="text-[0.68rem] font-black uppercase tracking-widest text-white">Arqueos</span>
                <span class="text-[0.65rem] font-bold text-[#7FD344]/70">{{ arqueos.length }} registros</span>
            </div>

            <div class="overflow-x-auto table-scroll-wrapper">
                <table class="border-collapse min-w-[600px] w-full">
                    <thead>
                        <tr>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                #</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Sede</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Fecha apertura</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Fecha cierre</th>
                            <th
                                class="px-5 py-3.5 text-left text-[0.68rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Valor</th>
                            <th
                                class="px-5 py-3.5 text-center text-[0.68rem] font-black uppercase tracking-widest text-white bg-[#0D291C] border-b-[3px] border-[#7FD344] whitespace-nowrap">
                                Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingArqueos">
                            <td colspan="6" class="py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="w-8 h-8 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                                    <span class="text-sm font-medium text-gray-400">Cargando arqueos...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="arqueos.length === 0">
                            <td colspan="6" class="py-20 text-center text-gray-300">
                                <div class="flex flex-col items-center gap-3">
                                    <AppIcon name="receipt_long" :size="48" class="text-gray-300" />
                                    <span class="text-sm font-medium">No se encontraron arqueos</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="a in arqueos" :key="a.IdArqueo"
                            class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors">
                            <td class="px-5 py-3 font-mono font-bold text-sm text-[#0D291C]">#{{ a.IdArqueo }}</td>
                            <td class="px-5 py-3 whitespace-nowrap">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                                    {{ a.T_Estacionamiento?.Nombre ?? `Sede ${a.IdEstacionamiento}` }}
                                </span>
                            </td>
                            <td class="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">{{ formatFecha(a.FechaInicio)
                                }}</td>
                            <td class="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">{{ a.FechaFin ?
                                formatFecha(a.FechaFin) : '—' }}</td>
                            <td class="px-5 py-3 text-sm font-bold text-[#0D291C] whitespace-nowrap">{{
                                formatPrecio(a.Valor) }}</td>
                            <td class="px-5 py-3 text-center">
                                <button @click="verArqueo(a)"
                                    class="w-8 h-8 inline-flex items-center justify-center rounded-xl cursor-pointer border-none bg-transparent text-gray-400 hover:text-[#299261] hover:bg-[#e8f5e9] transition-all"
                                    title="Ver detalle">
                                    <AppIcon name="visibility" :size="20" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ───── ASIDE: DETALLE ARQUEO ───── -->
        <AsideEditar v-model="asideDetalle" :titulo="`Arqueo #${arqueoActivo?.IdArqueo ?? ''}`"
            :subtitulo="arqueoActivo?.T_Estacionamiento?.Nombre ?? ''" label-guardar="Cerrar" :loading="loadingDetalle"
            @guardar="asideDetalle = false" @update:modelValue="v => { if (!v) asideDetalle = false }">

            <div v-if="loadingDetalle" class="flex items-center justify-center py-10 gap-3">
                <div class="w-6 h-6 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                <span class="text-sm text-gray-400 font-semibold">Cargando...</span>
            </div>

            <template v-else-if="arqueoActivo">
                <!-- Fechas -->
                <div class="flex flex-col gap-1.5">
                    <p class="text-[0.65rem] font-black uppercase tracking-[0.08em] text-gray-400">Período</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <span
                                class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Apertura</span>
                            <span class="text-[0.8rem] font-bold text-[#0D291C]">{{
                                formatFecha(arqueoActivo.FechaInicio) }}</span>
                        </div>
                        <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <span class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Cierre</span>
                            <span class="text-[0.8rem] font-bold text-[#0D291C]">{{ arqueoActivo.FechaFin ?
                                formatFecha(arqueoActivo.FechaFin) : '—' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Totales -->
                <div class="flex flex-col gap-1.5">
                    <p class="text-[0.65rem] font-black uppercase tracking-[0.08em] text-gray-400">Totales</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div
                            class="flex flex-col gap-[3px] px-3 py-2.5 bg-[#f0faf4] rounded-xl border-2 border-[#c8e6c9]">
                            <span class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Valor
                                total</span>
                            <span class="text-[0.95rem] font-black text-[#0D291C]">{{ formatPrecio(arqueoActivo.Valor)
                                }}</span>
                        </div>
                        <div
                            class="flex flex-col gap-[3px] px-3 py-2.5 bg-[#f0faf4] rounded-xl border-2 border-[#c8e6c9]">
                            <span
                                class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Producido</span>
                            <span class="text-[0.95rem] font-black text-[#0D291C]">{{
                                formatPrecio(arqueoActivo.Producido) }}</span>
                        </div>
                        <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <span
                                class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Datafono</span>
                            <span class="text-[0.85rem] font-bold text-[#0D291C]">{{
                                formatPrecio(arqueoActivo.ValorDatafono) }}</span>
                        </div>
                        <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <span
                                class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Efectivo</span>
                            <span class="text-[0.85rem] font-bold text-[#0D291C]">{{
                                formatPrecio(arqueoActivo.ValorEfectivo) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Transacciones -->
                <div class="flex flex-col gap-1.5">
                    <p class="text-[0.65rem] font-black uppercase tracking-[0.08em] text-gray-400">Transacciones</p>
                    <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <AppIcon name="receipt_long" :size="20" class="text-[#299261] flex-shrink-0" />
                        <div class="flex flex-col">
                            <span class="text-[1.1rem] font-black text-[#0D291C]">{{ arqueoActivo.CantTransacciones ?? 0
                                }}</span>
                            <span class="text-[0.65rem] font-semibold text-gray-400">transacciones registradas</span>
                        </div>
                    </div>
                </div>

                <!-- Info adicional -->
                <div class="flex flex-col gap-1.5">
                    <p class="text-[0.65rem] font-black uppercase tracking-[0.08em] text-gray-400">Información</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <span class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Tipo</span>
                            <span class="text-[0.8rem] font-bold text-[#0D291C]">{{ arqueoActivo.Tipo ?? '—' }}</span>
                        </div>
                        <div class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <span class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Módulo</span>
                            <span class="text-[0.8rem] font-bold text-[#0D291C]">{{ arqueoActivo.IdModulo ?? '—'
                                }}</span>
                        </div>
                        <div
                            class="flex flex-col gap-[3px] px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 col-span-2">
                            <span
                                class="text-[0.58rem] font-black uppercase tracking-wide text-gray-400">Sincronización</span>
                            <span class="text-[0.8rem] font-bold"
                                :class="arqueoActivo.Sincronizacion ? 'text-[#299261]' : 'text-gray-400'">
                                {{ arqueoActivo.Sincronizacion ? '● Sincronizado' : '● Sin sincronizar' }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </AsideEditar>

        <!-- ───── MODAL: GENERAR ARQUEO ───── -->
        <Transition name="modal">
            <div v-if="modalGenerar"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(13,41,28,0.5)] backdrop-blur-[10px]"
                @click.self="modalGenerar = false">
                <div class="bg-white border-[2.5px] border-[#0D291C] rounded-[28px] w-full max-w-[380px] flex flex-col overflow-hidden modal-card"
                    style="box-shadow: 0 7px 0 #0D291C">

                    <!-- Head -->
                    <div
                        class="flex items-center justify-between gap-3 px-6 pt-5 pb-4 flex-shrink-0 bg-gradient-to-br from-[#0D291C] to-[#1a4a2e] border-b-2 border-[#0D291C]/30">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#7FD344]/15 border border-[#7FD344]/30 text-[#7FD344]">
                                <AppIcon name="calendar_add_on" :size="20" />
                            </div>
                            <div>
                                <p class="text-[0.95rem] font-black text-white italic uppercase leading-none">Generar
                                    arqueo</p>
                                <p
                                    class="text-[0.62rem] font-semibold uppercase tracking-[0.07em] mt-[3px] text-white/45">
                                    Selecciona la fecha</p>
                            </div>
                        </div>
                        <button @click="modalGenerar = false"
                            class="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center font-black cursor-pointer flex-shrink-0 bg-white/10 border border-white/18 text-white/55 hover:bg-white/22 hover:text-white transition-all">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="px-6 py-5 flex flex-col gap-4">
                        <div class="flex flex-col gap-[5px]">
                            <label
                                class="text-[0.63rem] font-black uppercase tracking-[0.08em] text-[#0D291C] opacity-60">Fecha
                                *</label>
                            <input v-model="fechaGenerar" type="date" class="aside-field-input" :max="hoyISO" />
                            <p class="text-[0.68rem] font-semibold text-gray-400 pl-1">
                                Se generarán los arqueos de todas las sedes para esta fecha si tienen movimientos.
                            </p>
                        </div>
                        <div v-if="errGenerar"
                            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-[0.76rem] font-bold text-red-700">
                            ⚠ {{ errGenerar }}
                        </div>
                        <div v-if="msgGenerar"
                            class="flex items-center gap-2 px-3 py-2.5 bg-[#f0faf4] border border-[#c8e6c9] rounded-xl text-[0.76rem] font-bold text-[#299261]">
                            ✓ {{ msgGenerar }}
                        </div>
                    </div>

                    <!-- Foot -->
                    <div class="px-6 py-4 border-t-2 border-[rgba(13,41,28,0.1)] flex gap-2.5 flex-shrink-0">
                        <button @click="modalGenerar = false" class="btn-cancel">Cancelar</button>
                        <button @click="generarArqueo" :disabled="!fechaGenerar || generando" class="btn-confirm">
                            <span v-if="generando"
                                class="inline-block w-4 h-4 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
                            {{ generando ? 'Generando...' : 'Generar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ArqueosService from '@/api/services/arqueos.service'
import AsideEditar from '@/components/aside/AsideEditar.vue'

// ── Estado ─────────────────────────────────────────────────────────
const arqueos = ref([])
const loadingArqueos = ref(false)

// ── Aside detalle ──────────────────────────────────────────────────
const asideDetalle = ref(false)
const arqueoActivo = ref(null)
const loadingDetalle = ref(false)

// ── Modal generar ──────────────────────────────────────────────────
const modalGenerar = ref(false)
const fechaGenerar = ref('')
const generando = ref(false)
const errGenerar = ref('')
const msgGenerar = ref('')
const hoyISO = new Date().toISOString().slice(0, 10)

// ── Helpers ────────────────────────────────────────────────────────
const formatFecha = (f) => {
    if (!f) return '—'
    return new Date(f).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const formatPrecio = (v) =>
    (!v && v !== 0) ? '—' : new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(v)

// ── Carga ──────────────────────────────────────────────────────────
const cargarArqueos = async () => {
    loadingArqueos.value = true
    try {
        const res = await ArqueosService.getAllArqueos()
        arqueos.value = Array.isArray(res) ? res : (res?.data ?? [])
    } catch (e) {
        console.error('[Arqueos]', e)
        arqueos.value = []
    } finally {
        loadingArqueos.value = false
    }
}

onMounted(cargarArqueos)

// ── Ver detalle ────────────────────────────────────────────────────
const verArqueo = async (a) => {
    arqueoActivo.value = a          // muestra datos inmediato
    asideDetalle.value = true
    loadingDetalle.value = true
    try {
        const res = await ArqueosService.getArqueoById(a.IdArqueo)
        arqueoActivo.value = res?.data ?? res
    } catch (e) {
        console.error('[Arqueo detalle]', e)
    } finally {
        loadingDetalle.value = false
    }
}

// ── Generar arqueo ─────────────────────────────────────────────────
const abrirGenerarArqueo = () => {
    fechaGenerar.value = hoyISO
    errGenerar.value = ''
    msgGenerar.value = ''
    modalGenerar.value = true
}

const generarArqueo = async () => {
    errGenerar.value = ''
    msgGenerar.value = ''
    if (!fechaGenerar.value) { errGenerar.value = 'Selecciona una fecha.'; return }
    generando.value = true
    try {
        await ArqueosService.createArqueo(fechaGenerar.value)
        msgGenerar.value = `Arqueos generados para ${fechaGenerar.value}.`
        await cargarArqueos()
    } catch (e) {
        const msg = e.response?.data?.message
        errGenerar.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al generar el arqueo.')
    } finally {
        generando.value = false
    }
}
</script>

<style scoped>
.aside-field-input {
    border: 2px solid #d1d5db;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.88rem;
    color: #0D291C;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.aside-field-input:focus {
    border-color: #299261;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.15);
}

.btn-cancel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    font-family: inherit;
    background: rgba(13, 41, 28, 0.12);
    color: #0D291C;
    border: 2.5px solid rgba(13, 41, 28, 0.25);
    box-shadow: 0 4px 0 rgba(13, 41, 28, 0.2);
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
}

.btn-cancel:hover {
    background: rgba(13, 41, 28, 0.2);
}

.btn-cancel:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 rgba(13, 41, 28, 0.2);
}

.btn-confirm {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 900;
    cursor: pointer;
    font-family: inherit;
    background: #0D291C;
    color: #7FD344;
    border: 2.5px solid #0D291C;
    box-shadow: 0 4px 0 #050e09;
    transition: background-color 0.15s, transform 0.1s, box-shadow 0.1s;
}

.btn-confirm:hover:not(:disabled) {
    background: #1a4a2e;
}

.btn-confirm:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #050e09;
}

.btn-confirm:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
    transform: scale(0.93) translateY(12px);
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
    transition: transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
}

@media (max-width: 780px) {
    .maincontainer {
        height: auto;
    }
}
</style>