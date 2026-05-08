# Layouts — Digital6G Frontend

Sistema de layouts con jerarquía, Suspense y skeletons de carga.

## Jerarquía

```
App.vue (RouterView)
  └── AdminLayout / ClienteLayout / OperadorLayout
        └── AppLayout
              ├── Sidebar
              ├── Navbar
              └── <router-view>  (vista actual)
```

## Layouts

### AppLayout

**Archivo:** `src/layouts/AppLayout.vue`

Layout base que contiene Sidebar + Navbar + router-view.

**Props:**
- `menuItems` — Array de items del menú
- `titulo` — Título mostrado en el Navbar

**Responsivo:**
- `≥ 1024px`: sidebar visible por defecto
- `< 1024px`: sidebar oculto, se abre con overlay oscuro
- Escucha `resize` para cambiar entre modos

```vue
<AppLayout :menuItems="misItems" titulo="Mi Panel" />
```

---

### AdminLayout

**Archivo:** `src/layouts/AdminLayout.vue`

Envuelve `AppLayout` con `Suspense` y filtra el menú por permisos.

**Filtrado de menú:**

```js
const menuFiltrado = computed(() => {
  return adminMenuItems.filter(item => {
    if (!item.permission) return true  // Sin permiso → visible

    const nombreRol = authStore.user?.rol?.nombre?.toUpperCase()
    const esSuperAdmin = nombreRol === 'SUPER-ADMIN' || nombreRol === 'ADMIN'
    if (esSuperAdmin) return true  // Bypass

    return authStore.user?.permisos?.includes(item.permission) ?? false
  })
})
```

**Suspense:** Muestra `AppLayoutSkeleton` mientras las vistas hijas cargan datos asíncronos.

---

### ClienteLayout

**Archivo:** `src/layouts/ClienteLayout.vue`

Simple wrapper. No filtra menú — todos los items son visibles para el rol cliente.

```vue
<AppLayout :menuItems="clienteMenuItems" titulo="Dashboard" />
```

---

### AppLayoutSkeleton

**Archivo:** `src/layouts/AppLayout.skeleton.vue`

Versión "fantasma" del layout con animación shimmer. Se muestra durante `Suspense`.

**Elementos skeleton:**
- Sidebar: logo placeholder + 2 items con iconos
- Navbar: título pill + avatar pill
- Contenido: 3 cards skeleton + 6 grid items skeleton

**Animación:** shimmer con gradiente `#e5e7eb → #efefef → #e5e7eb`

---

### OperadorLayout

**Archivo:** `src/layouts/OperadorLayout.vue`

Definido pero **inactivo** (rutas de operador comentadas en `router/index.js`).

## Fondo de la app

Todas las vistas usan fondo `#F0F0F0` definido en `AppLayout`.
