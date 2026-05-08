# ModalCodigoMensualidad

Modal de 2 pasos para agregar una mensualidad mediante código de verificación.

## Props

| Prop | Tipo | Default | Descripción |
|:---|:---|:---|:---|
| `modelValue` | `Boolean` | `false` | Visibilidad |

## Emits

| Emit | Payload | Descripción |
|:---|:---|:---|
| `update:modelValue` | `Boolean` | Visibilidad |
| `confirmado` | — | Mensualidad agregada exitosamente |

## Flujo de 2 pasos

### Paso 1: Selección de sede
- Grid de sedes activas (3 columnas)
- Carga sedes vía `SedesService.getAll()`
- Click en sede para seleccionar

### Paso 2: Formulario
- Código de verificación (obligatorio, se convierte a uppercase)
- Datos personales (prellenados del auth store, editables): documento, nombre, teléfono, email
- Placas: Placa1 (obligatoria), Placa2 (opcional)
- Empresa (opcional): NIT, NombreEmpresa

## Validaciones

- Código, documento, Placa1, nombre, teléfono, email son obligatorios
- Documento: solo números
- Teléfono: solo números
- Placas: uppercase automático

## Uso

```vue
<ModalCodigoMensualidad
  v-model="showAgregar"
  @confirmado="recargarMensualidades"
/>
```
