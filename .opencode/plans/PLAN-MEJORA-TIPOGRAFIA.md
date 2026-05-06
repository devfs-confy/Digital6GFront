# Plan de Mejora Tipográfica - Digital6G Front

> **Fecha:** Mayo 2026
> **Estado:** Verificación post-Fase 1-3 completada
> **Objetivo:** Consolidar Funnel Display como única fuente, reducir pesos excesivos, establecer jerarquía visual clara

---

## 1. Diagnóstico Actual

### 1.1 Lo que ya se corrigió ✅

| Cambio | Archivo | Detalle |
|--------|---------|---------|
| Body font-weight 700 → 400 | `src/assets/base.css:69` | Todo texto ya no nace bold |
| Font-family global → Funnel Display | `src/assets/base.css:60,66` | `*` y `body` usan Funnel Display |
| Font-family root → Funnel Display | `src/style.css:2` | Consistente con base.css |
| Imports duplicados eliminados | Todos los `.vue` | 0 imports de Roboto/Plus Jakarta/Nunito |
| Nunito Sans eliminado | `src/assets/style.css` | Import huérfano removido |

### 1.2 Lo que aún falta ⚠️

| Problema | Cantidad | Severidad |
|----------|----------|-----------|
| Font-weight 900 restante | **44 instancias** | Alta |
| Font-weight 800 restante | **83 instancias** | Media-Alta |
| Fallback Roboto residual | **3 archivos** | Baja |
| Import Funnel Display en style.css | **1 archivo** | Baja |

---

## 2. Jerarquía Tipográfica Propuesta

### 2.1 Escala de pesos

| Nivel | Peso | Nombre Tailwind | Uso |
|-------|------|-----------------|-----|
| **Display / H1** | 800 | `font-extrabold` | Títulos de página, logo, KPIs críticos |
| **H2 / Secciones** | 700 | `font-bold` | Subtítulos, headers de modal, nombres de card |
| **Labels / Headers** | 600 | `font-semibold` | Etiquetas de formulario, headers de tabla |
| **Texto cuerpo** | 400 | `font-normal` | Párrafos, descripciones, valores de tabla |
| **Texto secundario** | 500 | `font-medium` | Placeholders, texto helper, badges |
| **Datos técnicos** | 500-600 | `font-medium` / `font-semibold` | IDs, placas, documentos (con font-mono) |

### 2.2 Qué eliminar

| Peso | Razón |
|------|-------|
| **900 (black)** | Demasiado agresivo. Solo aceptable para logo/totales críticos |
| **800 excesivo** | Reservar solo para títulos de página y KPIs del dashboard |

---

## 3. Plan de Ejecución

### Fase 4: Limpiar fallbacks de Roboto

**Archivos a modificar: 3**

| # | Archivo | Línea | Cambio |
|---|---------|-------|--------|
| 1 | `src/views/auth/SeleccionSede.vue` | 12 (inline style) | `'Funnel Display','Roboto',sans-serif` → `"Funnel Display", sans-serif` |
| 2 | `src/views/auth/SeleccionSede.vue` | 554 (CSS block) | `"Funnel Display", "Roboto", sans-serif` → `"Funnel Display", sans-serif` |
| 3 | `src/assets/tutorial.css` | 21, 242 | `"Funnel Display", "Roboto", sans-serif` → `"Funnel Display", sans-serif` |

**Comando de búsqueda para verificar:**
```
grep -r "Roboto" src/
```
**Resultado esperado:** 0 coincidencias

---

### Fase 5: Eliminar import redundante en style.css

| # | Archivo | Línea | Acción |
|---|---------|-------|--------|
| 1 | `src/assets/style.css` | 7 | Eliminar línea `@import url("https://fonts.googleapis.com/css2?family=Funnel+Display...")` |

**Razón:** Funnel Display ya se carga en `index.html` con preload optimizado. Import adicional es redundante.

**Verificación:** `src/assets/style.css` debe mantener sus reglas CSS pero sin el @import.

---

### Fase 6: Reducir font-weight 900 → 700

**Total: 44 instancias en 14 archivos**

#### 6.1 Modals (8 instancias)

| Archivo | Líneas | Contexto | Nuevo peso |
|---------|--------|----------|-----------|
| `ModalInhabilitar.vue` | 227, 428 | Títulos de modal | 700 |
| `ModalCongelar.vue` | 378, 687 | Títulos, montos | 700 |
| `ModalFacturacion.vue` | 555, 709, 819, 860 | Totales, headers | 700 |

#### 6.2 Admin Views (18 instancias)

| Archivo | Líneas | Contexto | Nuevo peso |
|---------|--------|----------|-----------|
| `Codigo.vue` | 519, 591, 630, 653, 683, 717, 811, 863, 878, 906, 950 | Códigos generados, IDs | 700 |
| `Consignacion.vue` | 487, 515 | Valores de arqueo | 700 |
| `Facturacion.vue` | 421 | Prefijos | 700 |
| `AdministrarTarifas.vue` | 519 | Valores de tarifa | 700 |
| `Autorizaciones.vue` | 570 | IDs | 700 |
| `ModalidadesPagos.vue` | 635 | Headers | 700 |

#### 6.3 Cliente Views (2 instancias)

| Archivo | Líneas | Contexto | Nuevo peso |
|---------|--------|----------|-----------|
| `PQRS.vue` | 786, 814 | IDs de radicado | 700 |

#### 6.4 Componentes Compartidos (5 instancias)

| Archivo | Líneas | Contexto | Nuevo peso |
|---------|--------|----------|-----------|
| `Navbar.vue` | 178, 237 | Logo/nombre app | **800 (mantener)** - es logo |
| `NotificacionesBtn.vue` | 410, 589, 850 | Contadores, headers | 700 |

#### 6.5 Assets CSS (11 instancias)

| Archivo | Líneas | Contexto | Nuevo peso |
|---------|--------|----------|-----------|
| `tutorial.css` | 111, 134, 174, 217, 241 | Títulos de tutorial | 700 |
| `table-system.css` | 29, 94, 133 | Headers de tabla | 700 |
| `swal.css` | 22, 55, 85 | Títulos de alertas | 700 |
| `main.css` | 3972 | (Tailwind generado - **no tocar**) | N/A |

**Nota:** `main.css` es generado por Tailwind. No editar manualmente.

---

### Fase 7: Reducir font-weight 800 → según contexto

**Total: 83 instancias en 20+ archivos**

#### 7.1 Mantener en 800 (excepciones justificadas)

| Archivo | Líneas | Contexto | Razón |
|---------|--------|----------|-------|
| `Dashboard.vue` | 279, 352, 369, 403, 410, 541 | KPIs del dashboard | Son métricas críticas |
| `Navbar.vue` | 178, 237 | Logo de la app | Identidad visual |

**Total a mantener: ~8 instancias**

#### 7.2 Reducir 800 → 700 (títulos de sección)

| Archivo | Líneas | Contexto |
|---------|--------|----------|
| `VerFactura.vue` | 472 | Título de factura |
| `EstadoTransaccion.vue` | 138 (inline), 501, 760 | Headers de estado |
| `SeleccionSede.vue` | 334, 484 | Títulos de cards |
| `Solicitudes.vue` (cliente) | 308 | Header |
| `Peticiones.vue` | 161 | Header |
| `Notificaciones.vue` | 159 | Header |
| `ComunidadUCC.vue` | 386 | Header |
| `Usuarios.vue` | 330 | Header |
| `Sedes.vue` | 532 | Header de card |
| `AsideEditar.vue` | 121 | Título de panel |
| `Notifiteminner.vue` | 116 | Título de item |

**Total: ~15 instancias**

#### 7.3 Reducir 800 → 600 (labels, valores intermedios)

| Archivo | Líneas | Contexto |
|---------|--------|----------|
| `PagosRecientes.vue` | 319 | Labels de resumen |
| `ModalInhabilitar.vue` | 247, 349, 372, 440, 454, 478 | Labels de modal |
| `ModalCongelar.vue` | 385, 484, 517, 525, 573, 618, 657, 696, 776 | Labels y valores |
| `ModalFacturacion.vue` | 533, 653, 826, 903, 952 | Labels de formulario |
| `NotificacionesBtn.vue` | 471, 491, 536, 634, 729, 923 | Labels de notificación |
| `Codigo.vue` | 526, 799 | Labels |
| `Autorizaciones.vue` | 587 | Label |

**Total: ~30 instancias**

#### 7.4 Reducir 800 → 400 (texto cuerpo mal ponderado)

Buscar casos donde `font-weight: 800` se aplica a texto que debería ser cuerpo normal:
- Descripciones en cards
- Valores de tabla que no son totales
- Texto de formulario que no es label

**Requiere revisión manual archivo por archivo.**

---

### Fase 8: Font-mono racional

**Objetivo:** Mantener `font-mono` para datos técnicos pero con pesos adecuados

| Elemento | Peso actual típico | Peso nuevo | Clase Tailwind equivalente |
|----------|-------------------|-----------|---------------------------|
| Placas | `font-mono font-black` (900) | `font-mono font-semibold` (600) | `font-mono font-semibold` |
| IDs (#123) | `font-mono font-black` (900) | `font-mono font-medium` (500) | `font-mono font-medium` |
| Documentos | `font-mono font-black` (900) | `font-mono font-medium` (500) | `font-mono font-medium` |
| Facturas | `font-mono font-black` (900) | `font-mono font-medium` (500) | `font-mono font-medium` |
| Códigos | `font-mono font-black` (900) | `font-mono font-semibold` (600) | `font-mono font-semibold` |

**Archivos con font-mono + peso excesivo:**
- `Mensualidades.vue` (admin) - líneas 111, 225, 233, 258, 480, 486, 637, 644
- `HistorialCambioPlacas.vue` - líneas 82, 90, 103, 108, 171, 217, 230
- `HistorialPagos.vue` - líneas 95, 107, 178, 182
- `Clientes.vue` - líneas 117, 429
- `Facturacion.vue` - líneas 85, 94, 97, 163
- `Solicitudes.vue` (admin) - líneas 100, 264, 316, 319
- `Mensualidad.vue` (cliente) - líneas 292, 711
- `ParqueosReciente.vue` - línea 143
- `Transacciones.vue` - línea 110
- `ModalDetalleMensualidad.vue` - línea 70

---

## 4. Resumen de Cambios por Archivo

### Prioridad Alta (más cambios)

| Archivo | Cambios 900→700 | Cambios 800→X | Font-family | Font-mono | Total cambios |
|---------|-----------------|---------------|-------------|-----------|---------------|
| `Codigo.vue` | 11 | 2 | - | - | **13** |
| `ModalCongelar.vue` | 2 | 11 | - | - | **13** |
| `NotificacionesBtn.vue` | 3 | 6 | - | - | **9** |
| `ModalFacturacion.vue` | 4 | 5 | - | - | **9** |
| `Dashboard.vue` | 0 | 6 (mantener) | - | - | **0** |
| `EstadoTransaccion.vue` | 0 | 3 | - | - | **3** |
| `ModalInhabilitar.vue` | 2 | 6 | - | - | **8** |

### Prioridad Media

| Archivo | Cambios 900→700 | Cambios 800→X | Font-family | Font-mono | Total cambios |
|---------|-----------------|---------------|-------------|-----------|---------------|
| `PQRS.vue` | 2 | 0 | - | - | **2** |
| `Consignacion.vue` | 2 | 0 | - | - | **2** |
| `tutorial.css` | 5 | 0 | 2 | - | **7** |
| `table-system.css` | 3 | 0 | - | - | **3** |
| `swal.css` | 3 | 0 | - | - | **3** |
| `SeleccionSede.vue` | 0 | 2 | 2 | - | **4** |
| `Navbar.vue` | 2 (mantener) | 0 | - | - | **0** |

### Prioridad Baja

| Archivo | Cambios 900→700 | Cambios 800→X | Font-family | Font-mono | Total cambios |
|---------|-----------------|---------------|-------------|-----------|---------------|
| `Facturacion.vue` | 1 | 0 | - | ~4 | **5** |
| `AdministrarTarifas.vue` | 1 | 0 | - | - | **1** |
| `Autorizaciones.vue` | 1 | 1 | - | - | **2** |
| `ModalidadesPagos.vue` | 1 | 0 | - | - | **1** |
| `VerFactura.vue` | 0 | 1 | - | - | **1** |
| `PagosRecientes.vue` | 0 | 1 | - | - | **1** |
| `Solicitudes.vue` (cliente) | 0 | 1 | - | - | **1** |
| `Peticiones.vue` | 0 | 1 | - | - | **1** |
| `Notificaciones.vue` | 0 | 1 | - | - | **1** |
| `ComunidadUCC.vue` | 0 | 1 | - | - | **1** |
| `Usuarios.vue` | 0 | 1 | - | - | **1** |
| `Sedes.vue` | 0 | 1 | - | - | **1** |
| `AsideEditar.vue` | 0 | 1 | - | - | **1** |
| `Notifiteminner.vue` | 0 | 1 | - | - | **1** |
| `style.css` | - | - | - | - | **1** (eliminar import) |

---

## 5. Métricas Esperadas

### Antes vs Después

| Métrica | Antes del plan | Después Fase 1-3 | Después completo |
|---------|---------------|------------------|------------------|
| Fuentes importadas | 4 | 1 | 1 |
| Imports duplicados | 6+ | 0 | 0 |
| Fallbacks Roboto | 6+ | 3 | 0 |
| Body font-weight | 700 | 400 | 400 |
| Instancias font-weight 900 | ~25 | 44 | **2** (solo logo) |
| Instancias font-weight 800 | ~20 | 83 | **~8** (KPIs + logo) |
| Instancias font-weight 700 | - | - | **~25** (títulos) |
| Instancias font-weight 600 | - | - | **~35** (labels) |
| Instancias font-weight 500 | - | - | **~15** (datos técnicos) |
| Instancias font-weight 400 | - | - | **~100+** (cuerpo) |
| Jerarquía visual | Plana (todo bold) | Parcial | **Clara (400→800)** |

---

## 6. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Texto se ve muy delgado en 400 | Baja | Medio | Funnel Display tiene buen cuerpo en 400. Si es problema, subir base a 500 |
| Algunos títulos pierden impacto | Media | Bajo | Mantener 800 en KPIs y logo. Usar color para énfasis adicional |
| Componentes de terceros (SweetAlert) | Baja | Bajo | `swal.css` se modifica en Fase 6.5 con 900→700 |
| Tailwind classes hardcodeadas | Media | Medio | Buscar `font-black`, `font-extrabold` inline y reemplazar |
| Regresión visual en producción | Media | Alto | Revisar cada vista en dev antes de deploy. Screenshots comparativos |

---

## 7. Orden de Ejecución Recomendado

```
1. Fase 4 → Limpiar fallbacks Roboto (3 cambios rápidos)
2. Fase 5 → Eliminar import style.css (1 cambio)
3. Fase 6 → Reducir 900→700 (44 cambios, mayor impacto visual)
4. Fase 7 → Reducir 800→contexto (83 cambios, requiere criterio)
5. Fase 8 → Font-mono racional (revisión manual de ~10 archivos)
6. Verificación → grep final + revisión visual en dev
```

**Tiempo estimado:** 2-3 horas de trabajo manual cuidadoso

---

## 8. Comandos de Verificación

### Después de cada fase

```bash
# Verificar Roboto eliminado
grep -r "Roboto" src/

# Verificar imports duplicados
grep -r "@import.*googleapis" src/

# Contar font-weight 900 restante
grep -r "font-weight: 900" src/ --include="*.vue" --include="*.css" | wc -l

# Contar font-weight 800 restante
grep -r "font-weight: 800" src/ --include="*.vue" --include="*.css" | wc -l

# Verificar font-family consistente
grep -r "font-family" src/ --include="*.vue" --include="*.css"
```

### Verificación visual

- [ ] Login page
- [ ] Dashboard admin
- [ ] Dashboard cliente
- [ ] Mensualidades (admin)
- [ ] Mensualidades (cliente)
- [ ] Tablas con font-mono
- [ ] Modals (Congelar, Inhabilitar, Facturación)
- [ ] PQRS
- [ ] Códigos
- [ ] Sidebar/Navbar

---

## 9. Notas Adicionales

### Sobre `main.css`
El archivo `src/assets/main.css` parece ser el output compilado de Tailwind (4900+ líneas). **No editar manualmente.** Los cambios deben hacerse en `tailwind.config.js` o en los componentes `.vue`.

### Sobre `table-system.css`
Este archivo define estilos para tablas. Los `font-weight: 900` aquí afectan todas las tablas del sistema. Cambiar a 700 tendrá impacto global positivo.

### Sobre `swal.css`
Estilos para SweetAlert2. Los `font-weight: 900 !important` son agresivos pero aceptables para diálogos de confirmación. Reducir a 700 mantiene legibilidad sin ser tan pesado.

### Font-mono y legibilidad
`font-mono` con peso 900 es particularmente difícil de leer porque las fuentes monospace ya tienen trazos gruesos. Reducir a 500-600 mejora significativamente la legibilidad de IDs, placas y documentos.
