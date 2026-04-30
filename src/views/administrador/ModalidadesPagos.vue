<template>
  <div class="h-full flex flex-col gap-6 maincontainer-mp ">

    <!-- ── Header ── -->
    <AdminPageHeader title="Modalidades de Pago" />

    <!-- ── Selector de sede ── -->
    <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
        <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">
          Estacionamiento / Sede
        </label>
        <select v-model="idSedeSeleccionada" @change="onSedeChange"
          class="rounded-full bg-[#EAEAEA] border-2 border-[#299261] px-4 py-2.5 text-sm text-black outline-none focus:border-[#0D291C] focus:ring-2 focus:ring-[#299261]/20 transition-all cursor-pointer">
          <option :value="null">Selecciona una sede…</option>
          <option v-for="s in sedes" :key="s.IdEstacionamiento" :value="s.IdEstacionamiento">
            {{ s.Nombre }}
          </option>
        </select>
      </div>
      <!-- Loading sedes -->
      <div v-if="loadingSedes" class="flex items-center gap-2 text-sm text-gray-400 pb-1">
        <div class="w-4 h-4 border-2 border-[#299261] border-t-transparent rounded-full animate-spin" />
        Cargando sedes…
      </div>

      <!-- Botón abrir modal quincenas -->
      <Transition v-permission="'HABILITAR-QUINCENAS'" name="fade-up">
        <div v-if="idSedeSeleccionada" class="flex flex-col gap-1 flex-shrink-0">
          <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A] pl-1">
            Quincenas
          </label>
          <button v-permission="'HABILITAR-QUINCENAS'" @click="abrirModalQuincena" :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-black transition-all',
            quincenaHabilitada === true
              ? 'bg-[#e8f5e9] border-[#299261] text-[#0D291C] hover:bg-[#d4edda]'
              : quincenaHabilitada === false
                ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                : 'bg-[#EAEAEA] border-[#299261] text-[#0D291C] hover:bg-[#d4edda]'
          ]" style="box-shadow: 0 2px 0 rgba(0,0,0,0.12)">
            <span
              :class="['w-2 h-2 rounded-full flex-shrink-0', quincenaHabilitada === true ? 'bg-[#299261]' : ' bg-red-500']" />
            <span>
              {{ quincenaHabilitada === true ? 'Quincenas' : quincenaHabilitada === false ? 'Quincenas' :
                'Quincenas' }}
            </span>
          </button>
        </div>
      </Transition>
    </div>

    <!-- ── Dos columnas ── -->
    <div v-if="idSedeSeleccionada" class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">

      <!-- Columna izquierda: Autorizaciones disponibles -->
      <div class="bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div class="px-5 py-4 border-b-2 border-[#7FD344] bg-[#0D291C] flex items-center justify-between">
          <h3 class="text-sm font-black uppercase tracking-widest text-white">Autorizaciones disponibles</h3>
          <span class="text-[0.65rem] font-bold text-[#7FD344]/70">
            {{ autorizaciones.length }} total
          </span>
        </div>

        <!-- Skeleton -->
        <div v-if="loadingAutorizaciones" class="p-4 flex flex-col gap-2">
          <div v-for="i in 5" :key="i"
            class="animate-pulse flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div class="flex flex-col gap-1.5">
              <div class="h-3.5 w-36 bg-gray-200 rounded-full" />
              <div class="h-2.5 w-20 bg-gray-100 rounded-full" />
            </div>
            <div class="h-5 w-8 bg-gray-200 rounded-full" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="autorizaciones.length === 0"
          class="flex flex-col items-center justify-center py-12 text-center">
          <AppIcon name="lock" :size="36" class="text-gray-200 mb-2" />
          <p class="text-sm font-semibold text-gray-400">Sin autorizaciones</p>
          <p class="text-xs text-gray-300 mt-0.5">Esta sede no tiene autorizaciones registradas</p>
        </div>

        <!-- Lista -->
        <ul v-else class="divide-y divide-[#f0faf4] overflow-y-auto max-h-80">
          <li v-for="auth in autorizaciones" :key="auth.IdAutorizacion" @click="seleccionarBase(auth)" :class="[
            'flex items-center justify-between px-5 py-3.5 cursor-pointer transition-all group',
            baseSeleccionada?.IdAutorizacion === auth.IdAutorizacion
              ? 'bg-[#0D291C]'
              : 'hover:bg-[#f0faf4]'
          ]">
            <div class="flex flex-col min-w-0">
              <span :class="[
                'text-sm font-bold truncate',
                baseSeleccionada?.IdAutorizacion === auth.IdAutorizacion ? 'text-[#7FD344]' : 'text-[#232B3A]'
              ]">
                {{ auth.NombreAutorizacion }}
              </span>
              <span :class="[
                'text-[0.68rem] font-mono mt-0.5',
                baseSeleccionada?.IdAutorizacion === auth.IdAutorizacion ? 'text-[#7FD344]/60' : 'text-gray-400'
              ]">
                ID: {{ auth.IdAutorizacion }}
              </span>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0 ml-3">
              <!-- Badge conteo modalidades asignadas -->
              <span v-if="conteoModalidades[auth.IdAutorizacion] > 0" :class="[
                'inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[0.65rem] font-black',
                baseSeleccionada?.IdAutorizacion === auth.IdAutorizacion
                  ? 'bg-[#7FD344] text-[#0D291C]'
                  : 'bg-[#0D291C] text-[#7FD344]'
              ]">
                {{ conteoModalidades[auth.IdAutorizacion] }}
              </span>
              <span v-else :class="[
                'inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[0.65rem] font-semibold',
                baseSeleccionada?.IdAutorizacion === auth.IdAutorizacion
                  ? 'bg-white/10 text-white/40'
                  : 'bg-gray-100 text-gray-400'
              ]">
                0
              </span>
              <!-- Indicador seleccionado -->
              <div v-if="baseSeleccionada?.IdAutorizacion === auth.IdAutorizacion"
                class="w-2 h-2 rounded-full bg-[#7FD344] flex-shrink-0" />
            </div>
          </li>
        </ul>
      </div>

      <!-- Columna derecha: Asignar modalidades -->
      <div ref="formRef" class="bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div class="px-5 py-4 border-b-2 border-[#7FD344] bg-[#0D291C] flex items-center justify-between">
          <h3 class="text-sm font-black uppercase tracking-widest text-white">Asignar modalidades</h3>
          <span v-if="baseSeleccionada" class="text-[0.65rem] font-bold text-[#7FD344]/70 truncate max-w-[140px]">
            Base: {{ baseSeleccionada.NombreAutorizacion }}
          </span>
        </div>

        <!-- Vacío sin base seleccionada -->
        <div v-if="!baseSeleccionada" class="flex flex-col items-center justify-center py-14 text-center px-6">
          <div
            class="w-14 h-14 rounded-2xl bg-[#f0faf4] border-2 border-[#e8f5e9] flex items-center justify-center mb-3">
            <AppIcon name="touch_app" :size="28" class="text-[#299261]" />
          </div>
          <p class="text-sm font-bold text-[#0D291C]">Selecciona una autorización base</p>
          <p class="text-xs text-gray-400 mt-1">Haz clic en una autorización de la columna izquierda para configurar sus
            modalidades de pago</p>
        </div>

        <!-- Skeleton cargando modalidades -->
        <div v-else-if="loadingModalidades" class="p-4 flex flex-col gap-2">
          <div v-for="i in 4" :key="i" class="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div class="w-5 h-5 bg-gray-200 rounded" />
            <div class="h-3.5 flex-1 bg-gray-200 rounded-full" />
            <div class="h-8 w-28 bg-gray-100 rounded-xl" />
          </div>
        </div>

        <!-- Lista de autorizaciones con checkboxes -->
        <div v-else class="flex flex-col flex-1 overflow-hidden">
          <ul class="divide-y divide-[#f0faf4] overflow-y-auto max-h-64">
            <li v-for="auth in autorizaciones" :key="auth.IdAutorizacion"
              class="flex items-center gap-3 px-5 py-3 hover:bg-[#f0faf4] transition-colors cursor-pointer"
              @click="toggleAsignacion(auth.IdAutorizacion)">
              <!-- Checkbox custom -->
              <button type="button" :class="[
                'w-5 h-5 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-all',
                asignaciones[auth.IdAutorizacion]?.activo
                  ? 'bg-[#299261] border-[#299261]'
                  : 'bg-white border-gray-300 hover:border-[#299261]'
              ]">
                <svg v-if="asignaciones[auth.IdAutorizacion]?.activo" class="w-3 h-3 text-white" viewBox="0 0 12 10"
                  fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
              <!-- Nombre -->
              <span :class="[
                'text-sm flex-1 min-w-0 truncate',
                asignaciones[auth.IdAutorizacion]?.activo ? 'font-bold text-[#0D291C]' : 'text-gray-400'
              ]">
                {{ auth.NombreAutorizacion }}
              </span>
              <!-- Select modalidad -->
              <select :disabled="!asignaciones[auth.IdAutorizacion]?.activo"
                v-model="asignaciones[auth.IdAutorizacion].modalidad" @click.stop :class="[
                  'text-xs rounded-xl px-2.5 py-1.5 border-2 outline-none transition-all flex-shrink-0',
                  asignaciones[auth.IdAutorizacion]?.activo
                    ? 'border-[#299261] bg-white text-[#0D291C] cursor-pointer focus:ring-2 focus:ring-[#299261]/20'
                    : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                ]">
                <option value="MENSUALIDAD">MENSUALIDAD</option>
                <option value="QUINCENA">QUINCENA</option>
                <option v-if="idSedeSeleccionada == 24" value="RECARGA">RECARGA</option>

              </select>
            </li>
          </ul>

          <!-- Footer guardar -->
          <div
            class="px-5 py-4 border-t-2 border-[#f0faf4] bg-[#f9fffe] flex items-center justify-between gap-3 flex-shrink-0">
            <span class="text-xs text-gray-400 font-medium">
              {{ cantidadActivos }} autorización(es) seleccionada(s)
            </span>
            <button @click="guardarCambios" :disabled="guardando"
              class="flex items-center gap-2 bg-[#0D291C] text-[#7FD344] text-sm font-black px-5 py-2.5 rounded-full border-2 border-[#0D291C] transition-all hover:bg-[#1a4a2e] disabled:opacity-50 disabled:cursor-not-allowed"
              style="box-shadow: 0 3px 0 #050e09">
              <span v-if="guardando"
                class="inline-block w-3.5 h-3.5 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
              <AppIcon v-else name="save" :size="25" />
              {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder cuando no hay sede -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-sm">
      <div class="w-16 h-16 rounded-2xl bg-[#f0faf4] border-2 border-[#e8f5e9] flex items-center justify-center mb-4">
        <AppIcon name="emoji_transportation" :size="32" class="text-[#299261]" />
      </div>
      <p class="text-base font-bold text-[#0D291C]">Selecciona un estacionamiento</p>
      <p class="text-sm text-gray-400 mt-1">Elige una sede en el selector de arriba para gestionar sus modalidades de
        pago</p>
    </div>

    <!-- ── Tabla inferior: Reglas actuales ── -->
    <div v-if="idSedeSeleccionada && baseSeleccionada"
      class="bg-white rounded-2xl shadow-sm overflow-hidden flex-shrink-0 mb-5">
      <div class="px-5 py-4 border-b-2 border-[#7FD344] bg-[#0D291C] flex items-center justify-between">
        <h3 class="text-sm font-black uppercase tracking-widest text-white">Reglas actuales</h3>
        <span class="text-[0.65rem] font-bold text-[#7FD344]/70">
          Base: {{ baseSeleccionada.NombreAutorizacion }}
        </span>
      </div>

      <div class="overflow-x-auto ">
        <table class="border-collapse min-w-[600px] w-full">
          <thead>
            <tr>
              <th class="mp-th">ID Regla</th>
              <th class="mp-th">Autorización base</th>
              <th class="mp-th">Autorización pago</th>
              <th class="mp-th">Modalidad</th>
              <th class="mp-th text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            <!-- Skeleton tabla -->
            <tr v-if="loadingModalidades">
              <td colspan="5" class="py-10 text-center">
                <div class="flex flex-col items-center gap-2">
                  <div class="w-7 h-7 border-4 border-[#0D291C] border-t-[#7FD344] rounded-full animate-spin" />
                  <span class="text-xs text-gray-400">Cargando reglas…</span>
                </div>
              </td>
            </tr>
            <!-- Vacío -->
            <tr v-else-if="reglas.length === 0">
              <td colspan="5" class="py-12 text-center">
                <div class="flex flex-col items-center gap-2">
                  <AppIcon name="rule" :size="36" class="text-gray-200" />
                  <span class="text-sm text-gray-300 font-semibold">Sin reglas asignadas</span>
                </div>
              </td>
            </tr>
            <!-- Filas -->
            <!-- r shape: { IdEstacionamiento, IdAutorizacionBase, IdAutorizacionPago, Modalidad, Estado, AutorizacionPago: { IdAutorizacion, NombreAutorizacion } } -->
            <tr v-else v-for="r in reglas" :key="`${r.IdAutorizacionBase}-${r.IdAutorizacionPago}`"
              class="border-b border-[#e8f5e9] last:border-0 hover:bg-[#f0faf4] transition-colors">
              <td class="px-5 py-3 font-mono font-bold text-sm text-[#0D291C]">
                {{ r.IdAutorizacionPago }}
              </td>
              <td class="px-5 py-3 text-sm whitespace-nowrap">
                <span
                  class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                  {{ baseSeleccionada.NombreAutorizacion }}
                </span>
              </td>
              <td class="px-5 py-3 text-sm whitespace-nowrap">
                <span
                  class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-violet-50 text-violet-800 border border-violet-200">
                  {{ r.AutorizacionPago?.NombreAutorizacion ?? `ID ${r.IdAutorizacionPago}` }}
                </span>
              </td>
              <td class="px-5 py-3 text-sm whitespace-nowrap">
                <span
                  class="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {{ r.Modalidad }}
                </span>
              </td>
              <td class="px-5 py-3 text-sm whitespace-nowrap text-center">
                <span v-if="r.Estado"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#299261]" />
                  Activo
                </span>
                <span v-else
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-gray-100 text-gray-400 border border-gray-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Inactivo
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="h-[30px] bg-transparent">
      <p></p>
    </div>

  </div>

  <!-- ── Botón scroll al formulario (solo mobile) ── -->
  <Transition name="scroll-hint">
    <button v-if="mostrarScrollHint" @click="scrollAlFormulario"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden flex items-center gap-2 px-5 py-3 rounded-full bg-[#0D291C] text-[#7FD344] text-sm font-black shadow-xl border-2 border-[#7FD344] animate-bounce-slow"
      style="box-shadow: 0 6px 24px rgba(13,41,28,0.45)">
      <AppIcon name="arrow_downward" :size="18" />
      Ver formulario de asignación
    </button>
  </Transition>

  <!-- ── Modal Quincenas ── -->
  <Transition name="modal-fade">
    <div v-if="modalQuincena.visible" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.45);" @click.self="modalQuincena.visible = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <!-- Header -->
        <div class="bg-[#0D291C] px-6 py-4 flex items-center justify-between">
          <h3 class="text-sm font-black uppercase tracking-widest text-white">Configurar quincenas</h3>
          <button @click="modalQuincena.visible = false"
            class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <AppIcon name="close" :size="14" class="text-white" />
          </button>
        </div>
        <!-- Body -->
        <div class="px-6 py-5 flex flex-col gap-4">
          <p class="text-xs text-gray-500">
            Sede: <span class="font-bold text-[#0D291C]">{{sedes.find(s => s.IdEstacionamiento ===
              idSedeSeleccionada)?.Nombre}}</span>
          </p>
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#232B3A]">
              Estado de quincenas
            </label>
            <div class="flex gap-3">
              <!-- Opción Habilitar -->
              <button type="button" @click="modalQuincena.nuevoEstado = true" :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-black transition-all',
                modalQuincena.nuevoEstado === true
                  ? 'bg-[#e8f5e9] border-[#299261] text-[#0D291C]'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#299261]/50'
              ]">
                <span class="w-2.5 h-2.5 rounded-full bg-[#299261]" />
                Habilitado
              </button>
              <!-- Opción Deshabilitar -->
              <button type="button" @click="modalQuincena.nuevoEstado = false" :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-black transition-all',
                modalQuincena.nuevoEstado === false
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-red-200'
              ]">
                <span class="w-2.5 h-2.5 rounded-full bg-red-400" />
                Deshabilitado
              </button>
            </div>
          </div>
          <p v-if="modalQuincena.nuevoEstado !== null" class="text-xs text-gray-400 text-center">
            {{ modalQuincena.nuevoEstado ? 'Se permitirá el pago por quincena en esta sede.'
              : 'No se permitirá el pago por quincena en esta sede.' }}
          </p>
        </div>
        <!-- Footer -->
        <div class="px-6 pb-5 flex gap-3">
          <button @click="modalQuincena.visible = false"
            class="flex-1 py-2.5 rounded-full border-2 border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button @click="enviarQuincena" :disabled="modalQuincena.nuevoEstado === null || habilitandoQuincena"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#0D291C] text-[#7FD344] text-sm font-black border-2 border-[#0D291C] transition-all hover:bg-[#1a4a2e] disabled:opacity-40 disabled:cursor-not-allowed"
            style="box-shadow: 0 3px 0 #050e09">
            <span v-if="habilitandoQuincena"
              class="inline-block w-3.5 h-3.5 border-2 border-[#7FD344] border-t-transparent rounded-full animate-spin" />
            <AppIcon v-else name="check" :size="14" />
            {{ habilitandoQuincena ? 'Aplicando…' : 'Aplicar' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppIcon from '@/components/shared/AppIcon.vue'
import SedesService from '@/api/services/sedes.service'
import ModalidadesPagosService from '@/api/services/modalidades.pagos.js'
import { showSuccess, showError } from '@/utils/swal'
import { _limitValue } from 'chart.js/helpers'

// ── Estado global ──────────────────────────────────────────────────
const sedes = ref([])
const loadingSedes = ref(true)
const idSedeSeleccionada = ref(null)

const autorizaciones = ref([])
const loadingAutorizaciones = ref(false)

const baseSeleccionada = ref(null)
const loadingModalidades = ref(false)
const guardando = ref(false)

// Reglas de la tabla inferior
const reglas = ref([])

// Map: IdAutorizacion → { activo: boolean, modalidad: string }
const asignaciones = reactive({})

// Map: IdAutorizacion → conteo de modalidades asignadas (para el badge)
const conteoModalidades = reactive({})

// Quincenas
const quincenaHabilitada = ref(null)   // null = desconocido, true = habilitada, false = deshabilitada
const habilitandoQuincena = ref(false)

// Modal quincenas
const modalQuincena = reactive({ visible: false, nuevoEstado: null })

// Scroll hint mobile
const formRef = ref(null)
const mostrarScrollHint = ref(false)

const scrollAlFormulario = () => {
  formRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  mostrarScrollHint.value = false
}

// ── Computed ───────────────────────────────────────────────────────
const cantidadActivos = computed(
  () => Object.values(asignaciones).filter(a => a.activo).length
)

// ── Métodos ────────────────────────────────────────────────────────
const cargarSedes = async () => {
  loadingSedes.value = true
  try {
    const data = await SedesService.getAll({ _limitValue: 100 })
    sedes.value = Array.isArray(data) ? data : []
  } catch {
    sedes.value = []
  } finally {
    loadingSedes.value = false
  }
}

const onSedeChange = async () => {
  // Resetear estado
  baseSeleccionada.value = null
  reglas.value = []
  quincenaHabilitada.value = null
  Object.keys(asignaciones).forEach(k => delete asignaciones[k])
  Object.keys(conteoModalidades).forEach(k => delete conteoModalidades[k])

  if (!idSedeSeleccionada.value) {
    autorizaciones.value = []
    return
  }
  await Promise.all([cargarAutorizaciones(), cargarEstadoQuincena()])
}

const cargarEstadoQuincena = async () => {
  try {
    const res = await ModalidadesPagosService.getByIdStatus(idSedeSeleccionada.value)
    quincenaHabilitada.value = res?.data?.Estado ?? null
  } catch {
    quincenaHabilitada.value = null
  }
}

const cargarAutorizaciones = async () => {
  loadingAutorizaciones.value = true
  try {
    const data = await ModalidadesPagosService.getAutorizaciones(idSedeSeleccionada.value)
    autorizaciones.value = Array.isArray(data) ? data : []
    // Para cada autorización, cargar su conteo de modalidades asignadas
    await cargarConteos()
  } catch {
    autorizaciones.value = []
  } finally {
    loadingAutorizaciones.value = false
  }
}

const cargarConteos = async () => {
  // Cargar en paralelo el conteo de cada autorización
  await Promise.allSettled(
    autorizaciones.value.map(async (auth) => {
      try {
        const data = await ModalidadesPagosService.getTiposPagos(
          idSedeSeleccionada.value,
          auth.IdAutorizacion
        )
        conteoModalidades[auth.IdAutorizacion] = Array.isArray(data?.reglas) ? data.reglas.length : 0
      } catch {
        conteoModalidades[auth.IdAutorizacion] = 0
      }
    })
  )
}

const seleccionarBase = async (auth) => {
  if (baseSeleccionada.value?.IdAutorizacion === auth.IdAutorizacion) return
  baseSeleccionada.value = auth
  // Mostrar hint solo en mobile (lg = 1024px)
  if (window.innerWidth < 1024) {
    mostrarScrollHint.value = true
    setTimeout(() => { mostrarScrollHint.value = false }, 6000)
  }
  await cargarModalidadesBase()
}

const cargarModalidadesBase = async () => {
  loadingModalidades.value = true
  // Inicializar asignaciones con todas las autorizaciones desactivadas
  Object.keys(asignaciones).forEach(k => delete asignaciones[k])
  autorizaciones.value.forEach(a => {
    asignaciones[a.IdAutorizacion] = { activo: false, modalidad: 'MENSUALIDAD' }
  })

  try {
    const res = await ModalidadesPagosService.getTiposPagos(
      idSedeSeleccionada.value,
      baseSeleccionada.value.IdAutorizacion
    )
    // res = { autorizacion_base: {...}, reglas: [...] }
    reglas.value = Array.isArray(res?.reglas) ? res.reglas : []

    // Pre-cargar checks y modalidades actuales usando IdAutorizacionPago como key
    reglas.value.forEach(r => {
      const id = r.IdAutorizacionPago
      if (id && asignaciones[id] !== undefined) {
        asignaciones[id].activo = true
        asignaciones[id].modalidad = r.Modalidad ?? 'MENSUALIDAD'
      }
    })
  } catch {
    reglas.value = []
  } finally {
    loadingModalidades.value = false
  }
}

const toggleAsignacion = (idAutorizacion) => {
  if (asignaciones[idAutorizacion]) {
    asignaciones[idAutorizacion].activo = !asignaciones[idAutorizacion].activo
  }
}

const guardarCambios = async () => {
  if (!idSedeSeleccionada.value || !baseSeleccionada.value) return
  guardando.value = true
  try {
    const modalidades = Object.entries(asignaciones)
      .filter(([, v]) => v.activo)
      .map(([idAuth, v]) => ({
        IdAutorizacion: Number(idAuth),
        Modalidad: v.modalidad,
      }))

    await ModalidadesPagosService.agregarTiposPagos(
      idSedeSeleccionada.value,
      baseSeleccionada.value.IdAutorizacion,
      modalidades
    )

    showSuccess('¡Guardado!', 'Las modalidades de pago se actualizaron correctamente.')

    // Recargar reglas y conteos
    await cargarModalidadesBase()
    conteoModalidades[baseSeleccionada.value.IdAutorizacion] = reglas.value.length

  } catch (e) {
    showError({ status: e?.response?.status, data: e?.response?.data })
  } finally {
    guardando.value = false
  }
}

const abrirModalQuincena = () => {
  modalQuincena.nuevoEstado = quincenaHabilitada.value  // pre-seleccionar el estado actual
  modalQuincena.visible = true
}

const enviarQuincena = async () => {
  if (modalQuincena.nuevoEstado === null) return
  const nombreSede = sedes.value.find(s => s.IdEstacionamiento === idSedeSeleccionada.value)?.Nombre ?? 'esta sede'
  habilitandoQuincena.value = true
  try {
    await ModalidadesPagosService.habilitarQuincena(idSedeSeleccionada.value, modalQuincena.nuevoEstado)
    quincenaHabilitada.value = modalQuincena.nuevoEstado
    modalQuincena.visible = false
    showSuccess(
      modalQuincena.nuevoEstado ? '¡Quincenas habilitadas!' : '¡Quincenas deshabilitadas!',
      `El cambio se aplicó correctamente para ${nombreSede}.`
    )
  } catch (e) {
    showError({ status: e?.response?.status, data: e?.response?.data })
  } finally {
    habilitandoQuincena.value = false
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────
onMounted(() => {
  cargarSedes()
})
</script>

<style>
.mp-th {
  padding: 12px 20px;
  text-align: left;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
  background-color: #0D291C;
  border-bottom: 3px solid #7FD344;
  white-space: nowrap;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 780px) {
  .maincontainer-mp {
    height: auto;
  }
}

/* ── Scroll hint button ──────────────────────────────────────────── */
.scroll-hint-enter-active,
.scroll-hint-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-hint-enter-from,
.scroll-hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}

@keyframes bounce-slow {

  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(-6px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 1.6s ease-in-out infinite;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
