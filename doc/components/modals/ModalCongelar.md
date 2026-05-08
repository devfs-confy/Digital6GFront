# ModalCongelar

Modal para congelar una mensualidad con calendario de selección de fecha de regreso.

## Props

| Prop | Tipo | Descripción |
|:---|:---|:---|
| `modelValue` | `Boolean` | Visibilidad |
| `cliente` | `Object` | Datos del cliente (NombreApellidos, T_Estacionamiento) |
| `infoCongelamiento` | `Object` | Info del estado de congelamiento (DiasRestantes, FechaInicio, FechaFin, DiasUsados, DiasTotalPeriodo, EstadoCongelamiento) |
| `errExterno` | `String` | Error del backend |
| `guardandoExterno` | `Boolean` | Estado de carga externo |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Visibilidad |
| `confirmar` | `{ FechaInicioPeriodoNvo, Observacion }` | Datos del congelamiento |
| `cerrar` | — | Modal cerrado |

## Reglas de negocio

- Solo puede congelar si `EstadoCongelamiento === 'PUEDE CONGELAR'`
- Fecha de regreso: entre hoy y hoy + 2 meses
- Observación es obligatoria (máx 200 chars)

## Uso

```vue
<ModalCongelar
  v-model="showCongelar"
  :cliente="clienteSeleccionado"
  :infoCongelamiento="infoCongelamiento"
  :errExterno="errExterno"
  :guardandoExterno="guardando"
  @confirmar="handleCongelar"
/>
```
