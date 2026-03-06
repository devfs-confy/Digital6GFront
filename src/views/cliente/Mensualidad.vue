<template>

    <!-- Loading -->


    <div class="flex flex-col gap-6 min-h-full overflow-y-auto pb-6">

        <!-- Header -->
        <div class="header-bar">
            <div class="header-bar__desktop">
                <button @click="$router.back()" class="add-btn">Volver</button>
                <h2 class="header-bar__title">Mis Mensualidades</h2>
                <button @click="modalCodigo = true" class="add-btn">+ Añadir</button>
            </div>
            <div class="header-bar__mobile">
                <h2 class="header-bar__title">Mis Mensualidades</h2>
                <div class="header-bar__actions">
                    <button @click="$router.back()" class="add-btn">← Volver</button>
                    <button @click="modalCodigo = true" class="add-btn">+ Añadir</button>
                </div>
            </div>
        </div>

        <!-- Grid de tarjetas -->
        <div class="mensualidades-grid">

            <div v-if="loading" class="mensualidades-grid">
                <div v-for="n in 2" :key="n" class="h-[320px] rounded-[24px]"
                    style="background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite" />
            </div>

            <div v-for="(m, i) in mensualidades" :key="m.id" class="mensualidad-card" :class="estadoClase(m)"
                :style="{ animationDelay: `${i * 0.08}s` }">

                <div class="card-band" :class="`card-band--${m.estado}`" />

                <!-- HEAD: sede grande, persona pequeña -->
                <div class="card-head">
                    <div class="card-avatar">{{ iniciales(m.nombre) }}</div>
                    <div class="card-head__info">
                        <h3 class="card-nombre">{{ m.sede }}</h3>
                        <p class="text-[0.72rem] font-semibold text-gray-400 truncate mt-0.5">{{ m.nombre }}</p>
                        <span class="card-estado-badge" :class="`badge--${m.estado}`">
                            {{ estadoLabel(m.estado) }}
                        </span>
                    </div>
                    <div class="card-dias" :class="`card-dias--${m.estado}`">
                        <span class="card-dias__num">{{ diasRestantes(m.fechaFin) }}</span>
                        <span class="card-dias__label">días</span>
                    </div>
                </div>

                <!-- DATOS: solo si tiene fechas -->
                <template v-if="m.fechaInicio && m.fechaFin">
                    <div class="card-data">
                        <div class="card-data__item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                            </svg>
                            <span class="card-data__label">Inicia</span>
                            <span class="card-data__val">{{ formatFecha(m.fechaInicio) }}</span>
                        </div>
                        <div class="card-data__item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                            </svg>
                            <span class="card-data__label">Vence</span>
                            <span class="card-data__val">{{ formatFecha(m.fechaFin) }}</span>
                        </div>
                    </div>

                    <div class="card-progress-wrap">
                        <div class="card-progress-bar">
                            <div class="card-progress-fill" :class="`fill--${m.estado}`"
                                :style="{ width: `${porcentajeVigencia(m)}%` }" />
                        </div>
                        <span class="card-progress-label">{{ porcentajeVigencia(m) }}% del periodo</span>
                    </div>
                </template>

                <!-- Sin fechas: aviso -->
                <div v-else class="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-amber-50 border border-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d97706" viewBox="0 0 24 24"
                        class="shrink-0">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span class="text-[0.72rem] font-bold text-amber-700 leading-snug">
                        Pago pendiente — sin fechas de vigencia aún
                    </span>
                </div>

                <!-- ACCIONES -->
                <div class="card-actions">
                    <button @click="abrirPago(m)" class="btn-pagar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        Pagar
                    </button>
                    <button @click="abrirDetalle(m)" class="btn-editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Ver
                    </button>
                    <!-- Congelar: solo si tiene fechas válidas y vigencia futura -->
                    <button v-if="m.conPago" @click="abrirCongelar(m)" class="btn-congelar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z" />
                        </svg>
                        Congelar
                    </button>
                </div>

            </div>

        </div>


        <!-- ══════════════════════════════════════════
             MODAL — CÓDIGO
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalCodigo" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card">
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
                                </svg>
                            </div>
                            <div>
                                <p class="modal-head__name">Añadir mensualidad</p>
                                <p class="modal-head__sub">Ingresa el código que te proporcionó la sede</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="field-group">
                            <label class="field-label">Código de verificación</label>
                            <input v-model="codigoInput" type="text" class="field-input field-input--code"
                                placeholder="Ej: PARK-2024-XXXX" maxlength="20" @keyup.enter="confirmarCodigo"
                                autofocus />
                            <p class="field-hint">El código es entregado por el administrador de la sede.</p>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarCodigo" class="btn-modal btn-modal--confirm"
                            :disabled="!codigoInput.trim()">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>


        <!-- ══════════════════════════════════════════
             MODAL — PAGAR
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalPago" class="modal-overlay" @click.self="cerrarModales">
                <div class="modal-card">
                    <div class="modal-head">
                        <div class="modal-head__left">
                            <div class="modal-avatar-sm">{{ iniciales(mensualidadAccion?.nombre) }}</div>
                            <div>
                                <p class="modal-head__name">Renovar mensualidad</p>
                                <p class="modal-head__sub">{{ mensualidadAccion?.nombre }} · {{ mensualidadAccion?.sede
                                    }}</p>
                            </div>
                        </div>
                        <button @click="cerrarModales" class="modal-close">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="pago-resumen">
                            <div class="pago-resumen__item">
                                <span class="pago-resumen__label">Sede</span>
                                <span class="pago-resumen__val">{{ mensualidadAccion?.sede }}</span>
                            </div>
                            <div class="pago-sep" />
                            <div class="pago-resumen__item">
                                <span class="pago-resumen__label">Vence</span>
                                <span class="pago-resumen__val">{{ formatFecha(mensualidadAccion?.fechaFin) }}</span>
                            </div>
                            <div class="pago-sep" />
                            <div class="pago-resumen__item">
                                <span class="pago-resumen__label">Valor</span>
                                <span class="pago-resumen__val pago-resumen__val--price">{{ mensualidadAccion?.valor
                                    }}</span>
                            </div>
                        </div>
                        <p class="field-hint" style="margin-top:8px">Al confirmar serás redirigido a la pasarela de
                            pago.</p>
                    </div>
                    <div class="modal-foot">
                        <button @click="cerrarModales" class="btn-modal btn-modal--cancel">Cancelar</button>
                        <button @click="confirmarPago" class="btn-modal btn-modal--confirm">Ir a pagar</button>
                    </div>
                </div>
            </div>
        </Transition>


        <!-- Modal congelar -->
        <ModalCongelar v-model="modalCongelar" :cliente="mensualidadAccion?._raw" @confirmar="confirmarCongelar" />


        <!-- ══════════════════════════════════════════
             MODAL — DETALLE
        ══════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalDetalle" class="modal-overlay" @click.self="modalDetalle = false">
                <div class="modal-card modal-card--detalle">

                    <div class="modal-head" style="background-color:#0a1f15">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                                style="background:#7FD344;color:#0D291C">
                                {{ iniciales(mensualidadAccion?.nombre) }}
                            </div>
                            <div>
                                <p class="modal-head__name">{{ mensualidadAccion?.nombre }}</p>
                                <p class="modal-head__sub">{{ mensualidadAccion?.sede }}</p>
                            </div>
                        </div>
                        <button @click="modalDetalle = false" class="modal-close">✕</button>
                    </div>

                    <div class="modal-body" style="background-color:#0D291C">

                        <!-- Badge + días -->
                        <div class="flex items-center justify-between gap-2">
                            <span class="card-estado-badge" :class="`badge--${mensualidadAccion?.estado}`">
                                {{ estadoLabel(mensualidadAccion?.estado) }}
                            </span>
                            <span class="text-xs font-semibold" style="color:rgba(127,211,68,0.7)">
                                <strong class="font-black" style="color:white">
                                    {{ diasRestantes(mensualidadAccion?.fechaFin) }}
                                </strong> días restantes
                            </span>
                        </div>

                        <!-- Datos personales -->
                        <p class="det-section">Datos personales</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-0.5">
                                <span class="det-label">Documento</span>
                                <span class="det-val font-mono">{{ mensualidadAccion?._raw?.Documento ?? '—' }}</span>
                            </div>
                            <div class="flex flex-col gap-0.5">
                                <span class="det-label">Nombre</span>
                                <span class="det-val" style="font-size:0.78rem">{{
                                    mensualidadAccion?._raw?.NombreApellidos ?? '—' }}</span>
                            </div>
                        </div>

                        <!-- Vigencia -->
                        <p class="det-section">Vigencia</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-0.5">
                                <span class="det-label">Inicio</span>
                                <span class="det-val">{{ formatFecha(mensualidadAccion?.fechaInicio) }}</span>
                            </div>
                            <div class="flex flex-col gap-0.5">
                                <span class="det-label">Fin</span>
                                <span class="det-val">{{ formatFecha(mensualidadAccion?.fechaFin) }}</span>
                            </div>
                        </div>

                        <!-- Barra progreso -->
                        <div class="flex flex-col gap-1.5">
                            <div class="h-1.5 rounded-full overflow-hidden" style="background:rgba(127,211,68,0.15)">
                                <div class="h-full rounded-full transition-all duration-500"
                                    :class="`fill--${mensualidadAccion?.estado}`"
                                    :style="{ width: `${porcentajeVigencia(mensualidadAccion)}%` }" />
                            </div>
                            <span class="text-right"
                                style="font-size:0.62rem;font-weight:600;color:rgba(127,211,68,0.5)">
                                {{ porcentajeVigencia(mensualidadAccion) }}% del periodo
                            </span>
                        </div>

                        <!-- Vehículos -->
                        <p class="det-section">Vehículos registrados</p>

                        <!-- Placa principal editable -->
                        <div class="flex flex-col gap-1.5">
                            <div class="flex items-center justify-between">
                                <span class="det-label">Placa principal</span>
                                <button v-if="!editandoPlaca" @click="editandoPlaca = true"
                                    class="text-[0.65rem] font-black cursor-pointer rounded-full px-2.5 py-0.5 transition-colors"
                                    style="color:#0D291C;background:#7FD344;border:1px solid #5ab32a">
                                    ✏ Editar
                                </button>
                                <button v-else @click="guardarPlaca"
                                    class="text-[0.65rem] font-black cursor-pointer rounded-full px-2.5 py-0.5 transition-colors"
                                    style="color:white;background:#299261;border:1px solid #166534">
                                    ✓ Guardar
                                </button>
                            </div>

                            <div v-if="!editandoPlaca"
                                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit"
                                style="background:rgba(127,211,68,0.12);border:1.5px solid rgba(127,211,68,0.3)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#7FD344"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                </svg>
                                <span class="text-[0.72rem] font-black tracking-widest uppercase" style="color:#7FD344">
                                    {{ mensualidadAccion?._raw?.Placa1 ?? '—' }}
                                </span>
                            </div>

                            <div v-else class="flex items-center gap-2">
                                <input v-model="placaEditada" type="text" maxlength="7"
                                    class="uppercase tracking-widest font-black text-center text-sm rounded-xl px-3 py-2 outline-none w-32"
                                    style="background:rgba(127,211,68,0.08);border:2px solid #7FD344;color:#7FD344" />
                                <button @click="editandoPlaca = false"
                                    class="text-xs cursor-pointer bg-transparent border-none transition-colors"
                                    style="color:rgba(127,211,68,0.4)">
                                    Cancelar
                                </button>
                            </div>
                        </div>

                        <!-- Otras placas -->
                        <div v-if="mensualidadAccion?.placas?.slice(1).length" class="flex flex-col gap-1.5">
                            <span class="det-label">Otras placas</span>
                            <div class="flex gap-1.5 flex-wrap">
                                <span v-for="p in mensualidadAccion.placas.slice(1)" :key="p"
                                    class="text-[0.65rem] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg"
                                    style="background:rgba(127,211,68,0.1);color:rgba(127,211,68,0.8);border:1px solid rgba(127,211,68,0.2)">
                                    {{ p }}
                                </span>
                            </div>
                        </div>

                        <p v-else-if="!mensualidadAccion?.placas?.length" class="text-xs font-semibold"
                            style="color:rgba(127,211,68,0.4)">
                            Sin vehículos registrados
                        </p>

                        <!-- Sede -->
                        <p class="det-section">Sede</p>
                        <div class="flex items-center gap-3 rounded-xl px-3.5 py-3"
                            style="background:rgba(127,211,68,0.07);border:1.5px solid rgba(127,211,68,0.2)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#7FD344"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <div>
                                <p class="det-val">{{ mensualidadAccion?._raw?.T_Estacionamiento?.Nombre ?? '—' }}</p>
                                <p class="det-label">ID {{ mensualidadAccion?._raw?.T_Estacionamiento?.IdEstacionamiento
                                    ?? '—' }}</p>
                            </div>
                        </div>

                    </div>

                    <div class="modal-foot" style="border-top:1.5px solid rgba(127,211,68,0.2);background:#0D291C">
                        <button @click="modalDetalle = false" class="btn-modal btn-modal--cancel">Cerrar</button>
                        <button @click="() => { modalDetalle = false; abrirPago(mensualidadAccion) }"
                            class="btn-modal btn-modal--confirm"
                            style="display:flex;align-items:center;justify-content:center;gap:6px">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                            Pagar
                        </button>
                        <button v-if="mensualidadAccion?.conPago"
                            @click="() => { modalDetalle = false; abrirCongelar(mensualidadAccion) }"
                            class="btn-modal btn-modal--freeze-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z" />
                            </svg>
                            Congelar
                        </button>
                    </div>

                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MensualidadesService from '@/api/services/mensualidades.service'
import ModalCongelar from '@/components/modals/ModalCongelar.vue'
const modalDetalle = ref(false)
const modalCodigo = ref(false)
const modalPago = ref(false)
const modalCongelar = ref(false)
const codigoInput = ref('')
const mensualidadAccion = ref(null)
const loading = ref(false)
const mensualidades = ref([])

const resolverEstado = (m) => {
    if (!m.Estado) return 'vencida'
    if (!m.FechaFin) return 'activa'
    const diff = new Date(m.FechaFin) - new Date()
    const dias = diff / (1000 * 60 * 60 * 24)
    if (dias < 0) return 'vencida'
    if (dias <= 7) return 'por_vencer'
    return 'activa'
}

const cargarMisMensualidades = async () => {
    loading.value = true
    try {
        const res = await MensualidadesService.getMisMensualidades()
        const raw = Array.isArray(res) ? res : (res?.data ?? [])

        console.log('Mis mensualidades:', raw)

        mensualidades.value = raw.map(m => ({
            _raw: m,
            id: m.IdPersonaAutorizada,
            nombre: m.NombreApellidos ?? '—',
            fechaInicio: m.FechaInicio ? m.FechaInicio.slice(0, 10) : null,
            fechaFin: m.FechaFin ? m.FechaFin.slice(0, 10) : null,
            sede: m.T_Estacionamiento?.Nombre ?? '—',
            placas: ['Placa1', 'Placa2', 'Placa3', 'Placa4', 'Placa5'].map(k => m[k]).filter(Boolean),
            estado: resolverEstado(m),
            valor: '—',
            // true solo si tiene fechaFin futura (pago realizado)
            conPago: !!(m.FechaFin && new Date(m.FechaFin) > new Date()),
        }))
    } catch (e) {
        console.error('[MisMensualidades]', e.response?.data ?? e.message)
        mensualidades.value = []
    } finally {
        loading.value = false
    }
}

onMounted(cargarMisMensualidades)

const iniciales = (nombre = '') =>
    nombre.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

const diasRestantes = (fechaFin) => {
    if (!fechaFin) return 0
    const diff = new Date(fechaFin) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const porcentajeVigencia = (m) => {
    if (!m.fechaInicio || !m.fechaFin) return 0
    const total = new Date(m.fechaFin) - new Date(m.fechaInicio)
    const usado = new Date() - new Date(m.fechaInicio)
    return Math.min(100, Math.max(0, Math.round((usado / total) * 100)))
}

const estadoClase = (m) => ({
    'card--activa': m.estado === 'activa',
    'card--por_vencer': m.estado === 'por_vencer',
    'card--vencida': m.estado === 'vencida',
    'card--congelada': m.estado === 'congelada',
})

const estadoLabel = (estado) => ({
    activa: 'Activa',
    por_vencer: 'Por vencer',
    vencida: 'Vencida',
    congelada: 'Congelada',
})[estado] ?? estado

const abrirPago = (m) => { mensualidadAccion.value = m; modalPago.value = true }
const abrirCongelar = (m) => { mensualidadAccion.value = m; modalCongelar.value = true }

const cerrarModales = () => {
    modalCodigo.value = false
    modalPago.value = false
    modalCongelar.value = false
    codigoInput.value = ''
    mensualidadAccion.value = null
}

const confirmarCodigo = () => {
    if (!codigoInput.value.trim()) return
    console.log('Código:', codigoInput.value)
    cerrarModales()
}

const confirmarPago = () => {
    console.log('Pagar:', mensualidadAccion.value)
    cerrarModales()
}

const confirmarCongelar = ({ fecha, motivo }) => {
    // TODO: llamar al API
    console.log('Congelar desde:', fecha, '| Motivo:', motivo, '| ID:', mensualidadAccion.value?.id)
    cerrarModales()
}

const editandoPlaca = ref(false)
const placaEditada = ref('')

// Al abrir el detalle precarga la placa
const abrirDetalle = (m) => {
    mensualidadAccion.value = m
    placaEditada.value = m._raw?.Placa1 ?? ''
    editandoPlaca.value = false
    modalDetalle.value = true
}

const guardarPlaca = async () => {
    if (!placaEditada.value.trim()) return
    const placa = placaEditada.value.trim().toUpperCase()
    // TODO: llamar al API cuando esté disponible
    // await MensualidadesService.updatePlaca(mensualidadAccion.value.id, { Placa1: placa })

    // Actualizar local optimistamente
    if (mensualidadAccion.value?._raw) {
        mensualidadAccion.value._raw.Placa1 = placa
        mensualidadAccion.value.placas[0] = placa
        // Actualizar también en la lista principal
        const idx = mensualidades.value.findIndex(m => m.id === mensualidadAccion.value.id)
        if (idx !== -1) {
            mensualidades.value[idx]._raw.Placa1 = placa
            mensualidades.value[idx].placas[0] = placa
        }
    }
    editandoPlaca.value = false
}
</script>

<style scoped>
/* ── Solo lo que Tailwind no puede hacer inline ────────────────── */

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
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

@keyframes popIn {
    from {
        transform: scale(0.86) translateY(24px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@keyframes popOut {
    from {
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    to {
        transform: scale(0.92) translateY(12px);
        opacity: 0;
    }
}

/* Cards */
.mensualidad-card {
    background-color: white;
    border-radius: 24px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 2px solid #e8f5e9;
    box-shadow: 0 4px 0 #e2ede7, 0 2px 16px rgba(13, 41, 28, 0.06);
    position: relative;
    overflow: hidden;
    animation: cardIn 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
    transition: box-shadow 0.18s, transform 0.18s;
}

.mensualidad-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #c8ddd1, 0 4px 20px rgba(13, 41, 28, 0.1);
}

/* Banda superior */
.card-band {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 24px 24px 0 0;
}

.card-band--activa {
    background-color: #7FD344;
}

.card-band--por_vencer {
    background-color: #f59e0b;
}

.card-band--vencida {
    background-color: #dc2626;
}

.card-band--congelada {
    background-color: #60a5fa;
}

/* Badges */
.card-estado-badge {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 2px 8px;
    border-radius: 999px;
    margin-top: 3px;
}

.badge--activa {
    background-color: #dcfce7;
    color: #16a34a;
}

.badge--por_vencer {
    background-color: #fef3c7;
    color: #d97706;
}

.badge--vencida {
    background-color: #fee2e2;
    color: #dc2626;
}

.badge--congelada {
    background-color: #dbeafe;
    color: #2563eb;
}

/* Días restantes */
.card-dias--activa .card-dias__num {
    color: #299261;
}

.card-dias--por_vencer .card-dias__num {
    color: #d97706;
}

.card-dias--vencida .card-dias__num {
    color: #dc2626;
}

.card-dias--congelada .card-dias__num {
    color: #3b82f6;
}

/* Barras de progreso */
.fill--activa {
    background-color: #7FD344;
}

.fill--por_vencer {
    background-color: #f59e0b;
}

.fill--vencida {
    background-color: #dc2626;
}

.fill--congelada {
    background-color: #60a5fa;
}

/* Modales */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 16px;
}

.modal-card {
    background-color: #B8E19E;
    border: 2px solid #0D291C;
    border-radius: 28px;
    box-shadow: 0 7px 0 #000;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-card--detalle {
    background-color: #0D291C;
    border-color: #7FD344;
    box-shadow: 0 7px 0 #051510;
    max-width: 440px;
}

.modal-head--detalle {
    background-color: #0a1f15;
}

.modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 14px;
    background-color: #0D291C;
}

.modal-head--detalle {
    background-color: #0D291C;
}

.modal-head__left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-head__name {
    font-size: 0.9rem;
    font-weight: 800;
    color: white;
}

.modal-head__sub {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 600;
}

.modal-close {
    font-size: 1rem;
    font-weight: 900;
    color: white;
    opacity: 0.4;
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
}

.modal-close:hover {
    opacity: 1;
}

.modal-body {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.modal-foot {
    display: flex;
    gap: 10px;
    padding: 12px 22px 20px;
    border-top: 2px solid rgba(13, 41, 28, 0.1);
}

.btn-modal {
    flex: 1;
    padding: 11px 18px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 2px solid;
    box-shadow: 0 3px 0;
    transition: transform 0.1s, box-shadow 0.1s;
}

.btn-modal:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important;
}

.btn-modal:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-modal--cancel {
    background: white;
    color: #232B3A;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-modal--confirm {
    background: #232B3A;
    color: white;
    border-color: #000;
    box-shadow: 0 3px 0 #000;
}

.btn-modal--freeze-sm {
    background: #0369a1;
    color: white;
    border-color: #0c4a6e;
    box-shadow: 0 3px 0 #0c4a6e;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-modal--freeze-sm:hover {
    background: #0284c7;
}

/* Detalle */
.det-section {
    font-size: 0.58rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #7FD344;
    border-bottom: 1.5px solid rgba(127, 211, 68, 0.25);
    padding-bottom: 5px;
    margin-top: 6px;
}

.det-label {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: rgba(127, 211, 68, 0.6);
}

.det-val {
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
}

/* Modal animaciones */
.modal-enter-active {
    transition: opacity 0.2s ease;
}

.modal-leave-active {
    transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-card {
    animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.modal-leave-active .modal-card {
    animation: popOut 0.18s ease-in both;
}

/* Botones de tarjeta */
.btn-pagar,
.btn-editar,
.btn-congelar {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px;
    border-radius: 14px;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
    border: 2px solid;
    transition: transform 0.1s, box-shadow 0.1s, background-color 0.15s;
}

.btn-pagar:active,
.btn-editar:active,
.btn-congelar:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 !important;
}

.btn-pagar {
    background: #0D291C;
    color: #7FD344;
    border-color: #0D291C;
    box-shadow: 0 3px 0 #051510;
}

.btn-pagar:hover {
    background: #132e21;
}

.btn-editar {
    background: white;
    color: #299261;
    border-color: #c8e6c9;
    box-shadow: 0 3px 0 #c8e6c9;
}

.btn-editar:hover {
    background: #f0faf4;
}

.btn-congelar {
    background: white;
    color: #3b82f6;
    border-color: #bfdbfe;
    box-shadow: 0 3px 0 #bfdbfe;
}

.btn-congelar:hover {
    background: #eff6ff;
}

/* Modal pago */
.pago-resumen {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.6);
    border: 2px solid #0D291C;
    border-radius: 18px;
    padding: 14px 18px;
    gap: 8px;
    flex-wrap: wrap;
}

.pago-resumen__label {
    font-size: 0.58rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.5;
}

.pago-resumen__val {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D291C;
}

.pago-resumen__val--price {
    color: #299261;
    font-size: 1rem;
}

.pago-sep {
    width: 1.5px;
    height: 30px;
    background: rgba(13, 41, 28, 0.15);
    border-radius: 99px;
}

/* Campos de modal */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field-label {
    font-size: 0.63rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0D291C;
    opacity: 0.6;
    padding-left: 3px;
}

.field-input {
    background: white !important;
    border: 2px solid #0D291C !important;
    border-radius: 14px !important;
    padding: 10px 14px !important;
    font-size: 0.875rem !important;
    color: #0D291C !important;
    outline: none !important;
    box-shadow: none !important;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
    border-color: #299261 !important;
    box-shadow: 0 0 0 3px rgba(41, 146, 97, 0.2) !important;
}

.field-input--code {
    font-family: monospace;
    letter-spacing: 0.1em;
    font-size: 1rem !important;
    text-align: center;
}

.field-hint {
    font-size: 0.7rem;
    color: #0D291C;
    opacity: 0.5;
    line-height: 1.5;
    padding-left: 3px;
}

/* Modal icono */
.modal-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(127, 211, 68, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-avatar-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #7FD344;
    color: #0D291C;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.75rem;
    flex-shrink: 0;
}

/* Grid y misc */
.mensualidades-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    align-content: start;
}

@media (max-width: 700px) {
    .mensualidades-grid {
        grid-template-columns: 1fr;
    }
}

.card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
}

.card-head__info {
    flex: 1;
    min-width: 0;
}

.card-nombre {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D291C;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #0D291C;
    color: #7FD344;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.85rem;
    flex-shrink: 0;
    border: 2px solid #e8f5e9;
}

.card-dias {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    background: #f9fafb;
    border-radius: 12px;
    padding: 8px 12px;
}

.card-dias__num {
    font-size: 1.4rem;
    font-weight: 900;
    line-height: 1;
}

.card-dias__label {
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.5;
}

.card-data {
    display: flex;
    flex-direction: column;
    gap: 7px;
    background: #f9fafb;
    border-radius: 14px;
    padding: 12px 14px;
}

.card-data__item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.card-data__item svg {
    color: #9ca3af;
    flex-shrink: 0;
}

.card-data__label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    min-width: 44px;
}

.card-data__val {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D291C;
}

.card-progress-wrap {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card-progress-bar {
    height: 6px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.card-progress-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.6s ease;
}

.card-progress-label {
    font-size: 0.62rem;
    font-weight: 600;
    color: #9ca3af;
    text-align: right;
}

.card-actions {
    display: flex;
    gap: 10px;
}

.header-bar {
    background: white;
    border-radius: 24px;
    padding: 16px 20px;
}

.header-bar__desktop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.header-bar__mobile {
    display: none;
}

.header-bar__title {
    font-size: 1.4rem;
    font-weight: 900;
    color: #232B3A;
    text-align: center;
}

.add-btn {
    font-size: 0.82rem;
    font-weight: 800;
    color: #232B3A;
    background: #7FD344;
    cursor: pointer;
    padding: 8px 18px;
    border-radius: 999px;
    border: 2px solid #000;
    box-shadow: 0 3px 0 #000;
    transition: transform 0.1s, box-shadow 0.1s;
}

.add-btn:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #000;
}

.empty-state {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 60px 20px;
    color: #d1d5db;
    font-size: 0.9rem;
    font-weight: 600;
}

@media (max-width: 560px) {
    .header-bar__desktop {
        display: none;
    }

    .header-bar__mobile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
    }

    .header-bar__actions {
        display: flex;
        gap: 12px;
        width: 100%;
        justify-content: center;
    }

    .header-bar__actions .add-btn {
        flex: 1;
        max-width: 160px;
    }
}
</style>