---
name: vue-tailwind-pages
description: >
  Create, design, and scaffold production-grade Vue.js template pages with Tailwind CSS, with a strong focus on UI/UX quality, accessibility, and responsive design. Use this skill whenever the user wants to build Vue pages, components, layouts, views, or full screens using Vue 3 + Tailwind. Trigger on any mention of: Vue pages, Vue templates, Vue components, Vue layouts, Tailwind UI, SFC (Single File Components), Vue Router views, dashboard layouts, landing pages, auth pages, settings pages, or any screen/page in a Vue.js project. Also trigger when the user wants to improve, refactor, or make a Vue+Tailwind interface more responsive, accessible, or visually polished.
---

# Vue.js + Tailwind CSS — Template Pages Skill

This skill guides the creation of high-quality **Vue 3 Single File Components (SFC)** with **Tailwind CSS**, with deep attention to:
- **UI/UX design quality** — clear hierarchy, spacing, color, and typography
- **Responsive design** — mobile-first, tested at all breakpoints
- **Accessibility** — semantic HTML, ARIA roles, keyboard nav, focus states
- **Component architecture** — reusable, composable, maintainable

---

## 1. Before Writing Any Code

Understand the context:

1. **What type of page/view?** (auth, dashboard, landing, settings, profile, list, detail, form, error, etc.)
2. **Vue 3 setup?** (Composition API with `<script setup>` preferred)
3. **Tailwind version?** (assume v3 unless told otherwise)
4. **Router?** (Vue Router 4, named routes, route params)
5. **State management?** (Pinia preferred, or Vuex, or local state)
6. **Design system/tokens?** (custom Tailwind config, existing colors, fonts)
7. **Any existing components to reuse?** (BaseButton, BaseInput, etc.)

If the user hasn't specified, ask the most critical question only (don't bombard). Make smart assumptions and state them clearly.

---

## 2. SFC Structure — Always Follow This Pattern

```vue
<script setup lang="ts">
// 1. Imports (vue core, composables, stores, utils, types)
// 2. Props & Emits
// 3. Reactive state
// 4. Computed properties
// 5. Lifecycle hooks
// 6. Methods/handlers
</script>

<template>
  <!-- Single root element OR Fragment (<>) if Vue 3 -->
  <!-- Semantic HTML: <main>, <section>, <article>, <header>, <nav>, <footer>, <aside> -->
  <!-- Tailwind classes: mobile-first, then sm: md: lg: xl: -->
</template>

<style scoped>
/* Only for things Tailwind can't express cleanly */
/* Prefer @apply for reusable patterns */
</style>
```

**Always use `<script setup lang="ts">`** unless the user's project is JavaScript only.

---

## 3. Tailwind Usage Rules

### Mobile-First Responsive
Always write classes mobile-first:
```html
<!-- ✅ Correct -->
<div class="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">

<!-- ❌ Wrong — desktop-first -->
<div class="flex-row md:flex-col">
```

### Breakpoints Reference
| Prefix | Min-width | Device target |
|--------|-----------|---------------|
| (none) | 0px       | Mobile (base) |
| `sm:`  | 640px     | Large phone / small tablet |
| `md:`  | 768px     | Tablet        |
| `lg:`  | 1024px    | Laptop        |
| `xl:`  | 1280px    | Desktop       |
| `2xl:` | 1536px    | Large desktop |

### Spacing System
Use Tailwind's 4px scale consistently:
- **Micro**: `gap-1`, `p-1`, `m-1` (4px) — icon gaps, tight badges
- **Small**: `gap-2`, `p-2` (8px) — inline elements
- **Base**: `gap-4`, `p-4` (16px) — card padding, component gaps
- **Medium**: `gap-6`, `p-6` (24px) — section spacing
- **Large**: `gap-8`, `p-8` (32px) — page sections
- **XL**: `gap-12`, `py-16` (48-64px) — hero sections, major separations

### Color Usage
```html
<!-- Surface hierarchy -->
bg-white dark:bg-gray-900          <!-- Page background -->
bg-gray-50 dark:bg-gray-800        <!-- Card/panel -->
bg-gray-100 dark:bg-gray-700       <!-- Nested content -->

<!-- Text hierarchy -->
text-gray-900 dark:text-white      <!-- Primary text -->
text-gray-600 dark:text-gray-400   <!-- Secondary text -->
text-gray-400 dark:text-gray-500   <!-- Muted/placeholder -->

<!-- Brand (use project's primary color) -->
bg-primary-600 hover:bg-primary-700
text-primary-600 dark:text-primary-400
```

### Typography Scale
```html
<!-- Page title -->
<h1 class="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">

<!-- Section title -->
<h2 class="text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">

<!-- Card title -->
<h3 class="text-base font-semibold text-gray-900 dark:text-white md:text-lg">

<!-- Body text -->
<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed md:text-base">

<!-- Label / caption -->
<span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
```

---

## 4. Page Layout Patterns

### App Shell (with sidebar)
```vue
<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="hidden w-64 flex-shrink-0 overflow-y-auto md:block">
      <AppSidebar />
    </aside>

    <!-- Main content area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
```

### Centered Auth Layout
```vue
<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <img src="/logo.svg" alt="Logo" class="mx-auto h-10 w-auto" />
        <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          {{ pageTitle }}
        </h1>
      </div>
      <!-- Card -->
      <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
        <slot />
      </div>
    </div>
  </div>
</template>
```

### Dashboard Grid
```vue
<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Welcome back, {{ user.name }}</p>
      </div>
      <BaseButton variant="primary">New item</BaseButton>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard v-for="stat in stats" :key="stat.id" v-bind="stat" />
    </div>

    <!-- Main content grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2"><!-- Main panel --></div>
      <div><!-- Side panel --></div>
    </div>
  </div>
</template>
```

---

## 5. Common UI Patterns

### Base Button Component
```vue
<!-- BaseButton.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  secondary: 'bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600',
  ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}
const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <Spinner v-if="loading" class="h-4 w-4" />
    <slot />
  </button>
</template>
```

### Base Input Component
```vue
<!-- BaseInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  type?: string
  required?: boolean
  disabled?: boolean
}
defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        error
          ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/10'
          : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-red-600 dark:text-red-400">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>
```

### Base Card Component
```vue
<!-- BaseCard.vue -->
<template>
  <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
    <div v-if="$slots.header" class="mb-4 flex items-center justify-between">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>
```

---

## 6. Page Types — Reference

For detailed patterns by page type, see `references/page-types.md`:

- **Auth pages**: Login, Register, Forgot Password, Reset Password
- **Dashboard**: Stats, charts, activity feed, quick actions
- **Data lists**: Tables, cards grid, filters, pagination, empty states
- **Detail views**: Hero header, tabbed content, sidebar info
- **Forms**: Multi-step, validation, file upload, settings panels
- **Error pages**: 404, 500, maintenance, empty states
- **Onboarding**: Step wizard, feature tour, welcome screens

---

## 7. Accessibility Checklist

Every page/component MUST:

- [ ] Use semantic HTML elements (`<main>`, `<nav>`, `<header>`, `<button>`, `<a>`, etc.)
- [ ] All interactive elements are keyboard-navigable (Tab, Enter, Space, Escape)
- [ ] Focus states are visible (`focus-visible:ring-2`) — never remove outline without replacing
- [ ] Images have `alt` text; decorative images have `alt=""`
- [ ] Form inputs have associated `<label>` elements (via `for`/`id` or wrapping)
- [ ] Error messages are announced (use `role="alert"` or `aria-describedby`)
- [ ] Color is not the only indicator (add icons or text alongside color cues)
- [ ] Modals/dialogs trap focus and restore on close
- [ ] Loading states announced with `aria-busy="true"` or `role="status"`
- [ ] Contrast ratio meets WCAG AA minimum (4.5:1 text, 3:1 UI components)

---

## 8. UX Patterns — Must Implement

### Loading States
```vue
<!-- Skeleton loader for cards -->
<div v-if="loading" class="animate-pulse space-y-4">
  <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
  <div class="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
</div>

<!-- Full page loading -->
<div v-if="loading" class="flex h-64 items-center justify-center">
  <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
</div>
```

### Empty States
```vue
<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
    <Icon name="inbox" class="h-8 w-8 text-gray-400" />
  </div>
  <h3 class="text-base font-semibold text-gray-900 dark:text-white">No items yet</h3>
  <p class="mt-1 text-sm text-gray-500">Get started by creating your first item.</p>
  <BaseButton class="mt-6" variant="primary">Create item</BaseButton>
</div>
```

### Error States
```vue
<div role="alert" class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
  <div class="flex gap-3">
    <Icon name="alert-circle" class="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
    <div>
      <p class="text-sm font-medium text-red-800 dark:text-red-300">{{ error.title }}</p>
      <p class="mt-1 text-sm text-red-700 dark:text-red-400">{{ error.message }}</p>
    </div>
  </div>
</div>
```

### Toast/Notification Pattern
```vue
<!-- Use Teleport to render at body level -->
<Teleport to="body">
  <div class="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 p-4 sm:p-6">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2 items-end">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl bg-white p-4 shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
      >
        <!-- icon, message, close button -->
      </div>
    </TransitionGroup>
  </div>
</Teleport>
```

---

## 9. Vue 3 Composables — Reuse Patterns

```typescript
// useAsync.ts — wraps async operations with loading/error state
export function useAsync<T>(fn: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await fn()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}

// useMediaQuery.ts — reactive breakpoint detection
export function useMediaQuery(query: string) {
  const matches = ref(window.matchMedia(query).matches)
  const mq = window.matchMedia(query)
  const handler = (e: MediaQueryListEvent) => { matches.value = e.matches }
  mq.addEventListener('change', handler)
  onUnmounted(() => mq.removeEventListener('change', handler))
  return { matches }
}
```

---

## 10. Quality Checklist — Before Delivering Code

- [ ] Mobile view looks great at 375px width
- [ ] Tablet view tested at 768px
- [ ] Desktop view tested at 1280px+
- [ ] Dark mode works (all colors have `dark:` variants)
- [ ] Loading, empty, and error states implemented
- [ ] All interactive elements have hover AND focus styles
- [ ] No hardcoded colors — using Tailwind utilities or CSS variables
- [ ] TypeScript types for all props and emits
- [ ] `v-for` loops always have `:key`
- [ ] No inline styles unless absolutely necessary
- [ ] Semantic HTML (no `div` soup)
- [ ] ARIA attributes on custom interactive components

---

## 11. File & Folder Conventions

```
src/
├── views/                    # Route-level pages (Vue Router)
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── dashboard/
│   │   └── DashboardView.vue
│   └── settings/
│       └── SettingsView.vue
├── layouts/                  # App shell layouts
│   ├── AppLayout.vue         # Authenticated layout (sidebar + header)
│   └── AuthLayout.vue        # Centered auth layout
├── components/
│   ├── base/                 # Design system primitives
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseCard.vue
│   │   └── BaseModal.vue
│   ├── ui/                   # Composed UI blocks
│   │   ├── DataTable.vue
│   │   ├── StatCard.vue
│   │   └── EmptyState.vue
│   └── [feature]/            # Feature-specific components
├── composables/
│   ├── useAsync.ts
│   ├── useToast.ts
│   └── useMediaQuery.ts
└── stores/                   # Pinia stores
    ├── auth.ts
    └── ui.ts
```

---

## 12. Common Mistakes to Avoid

| ❌ Anti-pattern | ✅ Correct approach |
|---|---|
| `style="color: red"` | `class="text-red-600"` |
| `<div @click="...">` for buttons | `<button @click="...">` |
| Removing focus outline | `focus-visible:ring-2 focus-visible:ring-primary-500` |
| `v-for` without `:key` | Always `:key="item.id"` |
| Hardcoded pixel widths | Tailwind responsive utilities |
| `<Options API>` in new code | `<script setup>` with Composition API |
| Desktop-first CSS | Mobile-first (base → `md:` → `lg:`) |
| `margin: auto` centering | `mx-auto` + `max-w-*` |
| No loading/empty states | Always handle all UI states |
| No dark mode | Always add `dark:` variants |

---

> **See `references/page-types.md`** for full page-by-page implementation examples (login, dashboard, tables, forms, settings, etc.)