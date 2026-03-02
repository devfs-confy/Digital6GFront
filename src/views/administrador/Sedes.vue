<template>
    <div class="p-7 w-full box-border relative">

        <!-- ── Header ───────────────────────────────────────────── -->
        <div class="flex items-end justify-between mb-7 gap-4 flex-wrap">
            <div>
                <h1 class="text-[1.6rem] font-black text-[#0D291C] leading-none">Administrar Sedes</h1>
                <p class="text-[0.8rem] text-gray-400 font-medium mt-1">
                    {{ sedes.length }} sede{{ sedes.length !== 1 ? 's' : '' }} registrada{{ sedes.length !== 1 ? 's' :
                        '' }}
                </p>
            </div>
            <button v-permission="PERMS.SEDES_CREAR" @click="abrirNueva"
                class="flex items-center gap-1.5 bg-[#0D291C] text-white border-none rounded-xl px-5 py-2.5 text-[0.85rem] font-bold cursor-pointer transition-all hover:bg-[#299261] hover:-translate-y-px active:translate-y-px">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Nueva sede
            </button>
        </div>

        <!-- ── Skeleton ──────────────────────────────────────────── -->
        <div v-if="loading" class="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
            <div v-for="n in 3" :key="n" class="h-[260px] rounded-[20px] skeleton-shimmer" />
        </div>

        <!-- ── Grid de sedes ─────────────────────────────────────── -->
        <div v-else class="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
            <div v-for="(sede, i) in sedes" :key="sede.IdEstacionamiento"
                class="bg-white rounded-[20px] p-5 border-2 border-transparent flex flex-col gap-3.5 transition-all duration-200 hover:border-[#d1fae5] hover:-translate-y-0.5 card-in"
                style="box-shadow: 0 4px 0 #e2ede7, 0 2px 12px rgba(13,41,28,0.07);"
                :style="{ animationDelay: `${i * 60}ms` }">
                <!-- Card header -->
                <div class="flex items-start justify-between gap-2.5">
                    <div class="flex items-center gap-2.5">
                        <div
                            class="w-[42px] h-[42px] rounded-xl bg-[#0D291C] text-[#7FD344] text-[1.1rem] font-black flex items-center justify-center flex-shrink-0">
                            {{ sede.Nombre?.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <h2 class="text-base font-extrabold text-[#0D291C] leading-tight">{{ sede.Nombre }}</h2>
                            <span class="text-[0.68rem] text-gray-400 font-semibold">#{{ sede.IdEstacionamiento
                                }}</span>
                        </div>
                    </div>
                    <span :class="[
                        'inline-flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0',
                        sede.Estado ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-gray-100 text-gray-400'
                    ]">
                        <span
                            :class="['w-1.5 h-1.5 rounded-full', sede.Estado ? 'bg-[#16a34a] badge-pulse' : 'bg-gray-400']" />
                        {{ sede.Estado ? 'Activa' : 'Inactiva' }}
                    </span>
                </div>

                <!-- Disponibilidades -->
                <div v-if="sede.T_Disponibilidades?.length" class="flex flex-col gap-2">
                    <div v-for="d in sede.T_Disponibilidades" :key="d.IdTipoVehiculo"
                        class="flex items-center gap-2 bg-gray-50 rounded-xl px-2.5 py-2 border border-gray-100">
                        <span class="text-base leading-none flex-shrink-0">{{ d.IdTipoVehiculo === '1' ? '🚗' : '🏍️'
                            }}</span>
                        <div class="flex-1 flex flex-col gap-1">
                            <span class="text-[0.72rem] font-bold text-gray-700">{{ d.Mensualidades }} / {{ d.Total
                                }}</span>
                            <div class="h-[5px] bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500" :class="pctClass(d)"
                                    :style="{ width: `${d.Total > 0 ? Math.round((d.Mensualidades / d.Total) * 100) : 0}%` }" />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-[0.72rem] text-gray-300 font-semibold text-center py-2">
                    Sin disponibilidades configuradas
                </div>

                <!-- Tarjetas requeridas -->
                <div class="flex gap-1.5 flex-wrap">
                    <span
                        :class="['text-[0.65rem] font-bold px-2 py-1 rounded-full', sede.RequiereTarjetaCarro ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-gray-100 text-gray-400']">
                        🚗 {{ sede.RequiereTarjetaCarro ? 'Con tarjeta' : 'Sin tarjeta' }}
                    </span>
                    <span
                        :class="['text-[0.65rem] font-bold px-2 py-1 rounded-full', sede.RequiereTarjetaMoto ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-gray-100 text-gray-400']">
                        🏍️ {{ sede.RequiereTarjetaMoto ? 'Con tarjeta' : 'Sin tarjeta' }}
                    </span>
                </div>

                <!-- Host -->
                <div class="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 overflow-hidden">
                    <svg class="flex-shrink-0 fill-gray-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    <span
                        class="text-[0.65rem] text-gray-400 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                        {{ sede.AppHost ?? '—' }}
                    </span>
                </div>

                <!-- Acciones -->
                <div class="flex gap-2 mt-auto">
                    <button v-permission="PERMS.SEDES_EDITAR" @click="abrirEdicion(sede)"
                        class="flex-1 flex items-center justify-center gap-1.5 border border-[#299261] rounded-xl py-2.5 px-3 text-[0.78rem] font-bold cursor-pointer transition-all duration-150 bg-[#299261] text-white hover:bg-[#0D291C] hover:border-[#0D291C]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Editar
                    </button>
                    <button v-permission="PERMS.SEDES_INACTIVAR" @click="toggleEstado(sede)"
                        class="flex-1 flex items-center justify-center gap-1.5 border-none rounded-xl py-2.5 px-3 text-[0.78rem] font-bold cursor-pointer transition-all duration-150 bg-gray-100 text-gray-500 hover:bg-[#fee2e2] hover:text-[#dc2626]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {{ sede.Estado ? 'Inactivar' : 'Activar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Overlay ───────────────────────────────────────────── -->
        <Transition name="overlay">
            <div v-if="sedeEditando" class="fixed inset-0 bg-[rgba(13,41,28,0.4)] backdrop-blur-[2px] z-40"
                @click.self="cerrarPanel" />
        </Transition>

        <!-- ── Panel lateral ─────────────────────────────────────── -->
        <Transition name="panel">
            <div v-if="sedeEditando"
                class="fixed top-0 right-0 w-[420px] h-dvh bg-white z-50 flex flex-col max-[500px]:w-full max-[500px]:top-auto max-[500px]:bottom-0 max-[500px]:h-[90dvh] max-[500px]:rounded-t-[24px]"
                style="box-shadow: -8px 0 40px rgba(13,41,28,0.15);">
                <!-- Panel header -->
                <div class="flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 class="text-[1.1rem] font-black text-[#0D291C]">{{ esNueva ? 'Nueva sede' : 'Editar sede' }}
                        </h2>
                        <p class="text-[0.75rem] text-gray-400 font-medium mt-0.5">
                            {{ esNueva ? 'Completa los datos de la nueva sede' : `Editando: ${sedeEditando.Nombre}` }}
                        </p>
                    </div>
                    <button @click="cerrarPanel"
                        class="bg-gray-100 border-none rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors hover:bg-[#fee2e2] [&>svg]:fill-gray-500 hover:[&>svg]:fill-[#dc2626]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <!-- Panel body -->
                <div class="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-[18px] first-letter:styled-scrollbar">

                    <!-- Nombre -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[0.75rem] font-extrabold text-gray-700 uppercase tracking-wider">Nombre de la
                            sede</label>
                        <input v-model="form.Nombre" type="text" placeholder="Ej: Sede Norte" class="field-input" />
                    </div>

                    <!-- AppHost -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[0.75rem] font-extrabold text-gray-700 uppercase tracking-wider">App
                            Host</label>
                        <input v-model="form.AppHost" type="text" placeholder="http://..." class="field-input" />
                    </div>

                    <!-- ApiKey -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[0.75rem] font-extrabold text-gray-700 uppercase tracking-wider">API
                            Key</label>
                        <div class="relative flex items-center">
                            <input v-model="form.ApiKey" :type="mostrarApiKey ? 'text' : 'password'"
                                placeholder="D6G-Secret-Key-..." class="field-input pr-10" />
                            <button type="button" @click="mostrarApiKey = !mostrarApiKey"
                                class="absolute right-2.5 bg-transparent border-none cursor-pointer p-1 flex items-center [&>svg]:fill-gray-400 hover:[&>svg]:fill-[#299261]">
                                <svg v-if="!mostrarApiKey" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- RequiereTarjeta: solo lectura — el backend no acepta estos campos en PUT /v1/sedes -->
                    <div class="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                            viewBox="0 0 24 24" fill="#d97706">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <div>
                            <p class="text-[0.72rem] font-bold text-amber-700">Requiere tarjeta (solo lectura)</p>
                            <p class="text-[0.68rem] text-amber-600 mt-0.5">
                                🚗 Carros: {{ sedeEditando?.RequiereTarjetaCarro ? 'Sí' : 'No' }} &nbsp;·&nbsp;
                                🏍️ Motos: {{ sedeEditando?.RequiereTarjetaMoto ? 'Sí' : 'No' }}
                            </p>
                            <p class="text-[0.65rem] text-amber-500 mt-1">Configurable solo desde el backend.</p>
                        </div>
                    </div>

                    <!-- Disponibilidades -->
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[0.75rem] font-extrabold text-gray-700 uppercase tracking-wider">Disponibilidades</label>
                        <div class="flex flex-col gap-2.5">
                            <div v-for="(d, idx) in form.T_Disponibilidades" :key="d.IdTipoVehiculo"
                                class="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-2.5">
                                <span class="text-[0.82rem] font-extrabold text-[#0D291C]">
                                    {{ d.IdTipoVehiculo === '1' ? '🚗 Carros' : '🏍️ Motos' }}
                                </span>
                                <div class="grid grid-cols-2 gap-2.5">
                                    <div class="flex flex-col gap-1">
                                        <label
                                            class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">Total</label>
                                        <input v-model.number="form.T_Disponibilidades[idx].Total" type="number" min="0"
                                            class="field-input field-input-mini" />
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <label
                                            class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">Mensualidades</label>
                                        <input v-model.number="form.T_Disponibilidades[idx].Mensualidades" type="number"
                                            min="0" :max="form.T_Disponibilidades[idx].Total"
                                            class="field-input field-input-mini" />
                                    </div>
                                </div>
                                <!-- Barra preview en tiempo real -->
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 h-[5px] bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full rounded-full transition-all duration-300"
                                            :class="pctClass(d)" :style="{
                                                width: d.Total > 0
                                                    ? `${Math.min(Math.round((d.Mensualidades / d.Total) * 100), 100)}%`
                                                    : '0%'
                                            }" />
                                    </div>
                                    <span
                                        class="text-[0.62rem] font-bold text-gray-400 whitespace-nowrap min-w-[60px] text-right">
                                        {{ d.Total > 0 ? Math.min(Math.round((d.Mensualidades / d.Total) * 100), 100) :
                                            0 }}% ocupado
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Panel footer -->
                <div class="px-6 py-4 border-t border-gray-100 flex gap-2.5 flex-shrink-0">
                    <button @click="cerrarPanel"
                        class="flex-1 bg-gray-100 text-gray-500 border-none rounded-xl py-3 text-[0.85rem] font-bold cursor-pointer transition-colors hover:bg-gray-200">
                        Cancelar
                    </button>
                    <button @click="guardar" :disabled="guardando"
                        class="flex-[2] bg-[#0D291C] text-white border-none rounded-xl py-3 text-[0.85rem] font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 hover:bg-[#299261] disabled:opacity-60 disabled:cursor-not-allowed">
                        <span v-if="guardando" class="btn-spinner" />
                        {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
                    </button>
                </div>

            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { PERMS } from '@/constants/permisions'
import SedesService from '@/api/services/sedes.services'
import SedesDisponibilidadService from '@/api/services/sedesdisponibilidad.service'

// ── Estado ─────────────────────────────────────────────────────────
const sedes = ref([])
const loading = ref(true)
const guardando = ref(false)
const mostrarApiKey = ref(false)
const sedeEditando = ref(null)
const esNueva = ref(false)

const form = reactive({
    Nombre: '',
    AppHost: '',
    ApiKey: '',
    T_Disponibilidades: [],
    // RequiereTarjetaCarro y RequiereTarjetaMoto no son editables via PUT /v1/sedes/{id}
    // El backend los rechaza (whitelist estricta). Se muestran en la card como solo lectura.
})

// ── Helpers ────────────────────────────────────────────────────────
const pctClass = (d) => {
    if (!d.Total) return 'bg-[#7FD344]'
    const p = (d.Mensualidades / d.Total) * 100
    if (p >= 90) return 'bg-[#dc2626]'
    if (p >= 70) return 'bg-[#f59e0b]'
    return 'bg-[#7FD344]'
}

const dispDefaults = (existente = []) => {
    // String(x) === String(y) evita mismatch entre "1" (API) y 1 (número)
    const find = (id) => existente.find(d => String(d.IdTipoVehiculo) === String(id))
    return [
        find('1')
            ? { IdTipoVehiculo: '1', Total: Number(find('1').Total ?? 0), Mensualidades: Number(find('1').Mensualidades ?? 0) }
            : { IdTipoVehiculo: '1', Total: 0, Mensualidades: 0 },
        find('2')
            ? { IdTipoVehiculo: '2', Total: Number(find('2').Total ?? 0), Mensualidades: Number(find('2').Mensualidades ?? 0) }
            : { IdTipoVehiculo: '2', Total: 0, Mensualidades: 0 },
    ]
}

// ── Carga inicial ──────────────────────────────────────────────────
onMounted(async () => {
    try {
        sedes.value = await SedesService.getAll()
    } catch (e) {
        console.error('Error cargando sedes:', e)
    } finally {
        loading.value = false
    }
})

// ── Panel ──────────────────────────────────────────────────────────
const abrirEdicion = (sede) => {
    esNueva.value = false
    sedeEditando.value = sede
    mostrarApiKey.value = false
    form.Nombre = sede.Nombre ?? ''
    form.AppHost = sede.AppHost ?? ''
    form.ApiKey = sede.ApiKey ?? ''
    form.T_Disponibilidades = dispDefaults(sede.T_Disponibilidades)
}

const abrirNueva = () => {
    esNueva.value = true
    sedeEditando.value = { IdEstacionamiento: null }
    mostrarApiKey.value = true
    form.Nombre = ''
    form.AppHost = ''
    form.ApiKey = ''
    form.T_Disponibilidades = dispDefaults()
}

const cerrarPanel = () => {
    sedeEditando.value = null
    guardando.value = false
}

// ── Guardar ────────────────────────────────────────────────────────
const guardar = async () => {
    guardando.value = true
    try {
        const id = sedeEditando.value?.IdEstacionamiento

        // ⚠️ Backend whitelist estricta: RequiereTarjetaCarro/Moto NO están en el DTO del PUT /v1/sedes
        // Enviar esos campos causa 400. Solo Nombre, AppHost y ApiKey son editables por este endpoint.
        const dtoSede = {
            Nombre: form.Nombre,
            AppHost: form.AppHost,
            ApiKey: form.ApiKey,
        }

        console.log('[Sedes] PUT /v1/sedes dto:', JSON.stringify(dtoSede))

        if (esNueva.value) {
            const nueva = await SedesService.create(dtoSede)
            sedes.value.push(nueva?.data ?? nueva)
        } else {
            // PUT sede principal
            await SedesService.update(id, dtoSede)

            // PUT disponibilidades — separado del dto principal
            for (const d of form.T_Disponibilidades) {
                console.log(`[Sedes] PUT disponibilidad sede=${id} tipo=${d.IdTipoVehiculo}`, d)
                await SedesDisponibilidadService.updateDisponibilidad(
                    id,
                    d.IdTipoVehiculo,
                    { Total: Number(d.Total), Mensualidades: Number(d.Mensualidades) }
                )
            }

            // Actualizar estado local sin recargar
            const idx = sedes.value.findIndex(s => s.IdEstacionamiento === id)
            if (idx !== -1) {
                sedes.value[idx] = {
                    ...sedes.value[idx],
                    ...dtoSede,
                    T_Disponibilidades: form.T_Disponibilidades.map(d => ({ ...d })),
                }
            }
        }
        cerrarPanel()
    } catch (e) {
        const errData = e.response?.data
        console.error('[Sedes] 400 message:', errData?.message)
        console.error('[Sedes] 400 full response:', errData)
        console.error('[Sedes] Status:', e.response?.status)
    } finally {
        guardando.value = false
    }
}

// ── Toggle estado ──────────────────────────────────────────────────
const toggleEstado = async (sede) => {
    try {
        await SedesService.update(sede.IdEstacionamiento, { Estado: !sede.Estado })
        sede.Estado = !sede.Estado
    } catch (e) {
        console.error('Error cambiando estado:', e)
    }
}
</script>

<style scoped>
/* ── Solo lo que Tailwind no puede hacer ─────────────────────────── */

/* Input / Select base */
.field-input {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.88rem;
    color: #0D291C;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    background-color: #f9fafb;
    transition: border-color 0.15s, background-color 0.15s;
}

.field-input:focus {
    border-color: #299261;
    background-color: white;
}

.field-input-mini {
    padding-top: 7px;
    padding-bottom: 7px;
    font-size: 0.82rem;
}

.field-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
}

/* Skeleton shimmer */
.skeleton-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* Card entrance */
.card-in {
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

/* Badge pulse activo */
.badge-pulse {
    animation: pulseDot 1.5s infinite;
}

@keyframes pulseDot {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
}

/* Spinner botón guardar */
.btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Transiciones overlay y panel */
.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.25s;
}

.panel-enter-from,
.panel-leave-to {
    transform: translateX(100%);
}

.panel-enter-active,
.panel-leave-active {
    transition: transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1);
}

@media (max-width: 500px) {

    .panel-enter-from,
    .panel-leave-to {
        transform: translateY(100%);
    }
}
</style>