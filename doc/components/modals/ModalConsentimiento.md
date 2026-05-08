# ModalConsentimiento

Modal de consentimiento de política de tratamiento de datos personales antes de realizar un pago. Usa `BaseModal` internamente.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `Boolean` | `false` | Visibilidad |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Visibilidad |
| `confirmar` | — | Usuario aceptó y quiere continuar al pago |

## Contenido

- Logo de AvalPay (pasarela de pagos)
- Política de tratamiento de datos (Ley 1581 de 2012)
- Link a PDF de política completa
- Checkbox obligatorio: "He leído y acepto la Política de Tratamiento de Datos Personales"
- Botón confirmar deshabilitado hasta aceptar

## Uso

```vue
<ModalConsentimiento
  v-model="showConsentimiento"
  @confirmar="procederAlPago"
/>
```
