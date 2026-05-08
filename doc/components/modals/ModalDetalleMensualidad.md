# ModalDetalleMensualidad

Modal que muestra el detalle completo de una mensualidad: estado, datos personales, vigencia, vehículos y sede.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `Boolean` | `false` | Visibilidad |
| `mensualidad` | `Object` | `null` | Datos resumidos de la mensualidad |
| `detalle` | `Object` | `null` | Datos detallados (Documento, NombreApellidos, solicitud, T_Estacionamiento) |
| `placas` | `Array` | `[]` | Array de placas del vehículo |
| `placaCambiada` | `Boolean` | `false` | Si ya se cambió placa este mes |
| `loading` | `Boolean` | `false` | Estado de carga |
| `error` | `String` | `''` | Mensaje de error |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Visibilidad |
| `cambiarTipo` | — | Solicitar cambio de placas |

## Estados de mensualidad

| Estado | Color | Badge |
|:---|:---|:---|
| `activa` | Verde | "Activa" |
| `por_vencer` | Ámbar | "Por vencer" |
| `vencida` | Rojo | "Vencida" |
| `congelada` | Azul | "Congelada" |
| `pendiente` | Amarillo | "Pendiente" |

## Secciones

1. **Estado** — badge de color + días restantes
2. **Datos personales** — documento y nombre
3. **Vigencia** — fecha inicio/fin + barra de progreso
4. **Vehículos** — placas con botón "Cambiar placas"
5. **Sede** — nombre de la sede
