# Temas y Modo Oscuro — Referencia Completa

## Sistema de Temas con CSS Custom Properties

### Arquitectura recomendada
```css
/* ─── Paletas base ─────────────────────────────── */
:root {
  /* Colores de marca */
  --brand-50:  #eef2ff;
  --brand-100: #e0e7ff;
  --brand-200: #c7d2fe;
  --brand-300: #a5b4fc;
  --brand-400: #818cf8;
  --brand-500: #6366f1;  /* Primary */
  --brand-600: #4f46e5;
  --brand-700: #4338ca;
  --brand-800: #3730a3;
  --brand-900: #312e81;

  /* Semánticos — modo claro */
  --color-bg:         #ffffff;
  --color-bg-subtle:  #f8fafc;
  --color-bg-muted:   #f1f5f9;
  --color-surface:    #ffffff;
  --color-border:     #e2e8f0;
  --color-border-strong: #cbd5e1;

  --color-text:       #0f172a;
  --color-text-muted: #64748b;
  --color-text-faint: #94a3b8;

  --color-primary:    #6366f1;
  --color-primary-hover: #4f46e5;
  --color-success:    #059669;
  --color-warning:    #d97706;
  --color-danger:     #dc2626;
  --color-info:       #0284c7;

  --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg:  0 10px 25px rgba(0,0,0,0.1);
  --shadow-xl:  0 20px 50px rgba(0,0,0,0.15);

  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-full: 9999px;
}

/* ─── Dark mode ─────────────────────────────────── */
[data-theme="dark"], .dark {
  --color-bg:         #0b0f1a;
  --color-bg-subtle:  #111827;
  --color-bg-muted:   #1f2937;
  --color-surface:    #1a1f2e;
  --color-border:     rgba(255,255,255,0.08);
  --color-border-strong: rgba(255,255,255,0.15);

  --color-text:       #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-text-faint: #475569;

  --shadow-sm:  0 1px 2px rgba(0,0,0,0.3);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg:  0 10px 30px rgba(0,0,0,0.5);
  --shadow-xl:  0 20px 60px rgba(0,0,0,0.6);
}

/* Sistema automático según preferencia del SO */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* copiar valores de [data-theme="dark"] aquí */
  }
}
```

---

## Toggle de Tema (JavaScript)

```javascript
// Cambiar tema
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcon(next);
}

// Leer preferencia guardada al cargar
(function() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

// Botón HTML
// <button onclick="toggleTheme()" class="theme-toggle" id="themeToggle">
//   <span id="themeIcon">🌙</span>
// </button>

function updateToggleIcon(theme) {
  document.getElementById('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
}
```

---

## Paletas Predefinidas de Dark Mode

### Dark Indigo (default — elegante)
```css
--bg-primary:   #0b0f1a;
--bg-secondary: #111827;
--bg-card:      #1a1f2e;
--accent:       #6366f1;
--accent-glow:  rgba(99,102,241,0.3);
```

### Dark Slate (profesional)
```css
--bg-primary:   #0f172a;
--bg-secondary: #1e293b;
--bg-card:      #1e293b;
--accent:       #38bdf8;
--accent-glow:  rgba(56,189,248,0.2);
```

### Dark Emerald (tech/fintech)
```css
--bg-primary:   #0a1628;
--bg-secondary: #0f1f35;
--bg-card:      #162032;
--accent:       #10b981;
--accent-glow:  rgba(16,185,129,0.2);
```

### Dark Amber (gaming/energético)
```css
--bg-primary:   #0c0a00;
--bg-secondary: #1a1500;
--bg-card:      #1f1b00;
--accent:       #f59e0b;
--accent-glow:  rgba(245,158,11,0.3);
```

### Near-white (minimalista)
```css
--bg-primary:   #fafafa;
--bg-secondary: #f4f4f5;
--bg-card:      #ffffff;
--accent:       #18181b;
--border:       #e4e4e7;
```

---

## Transición suave entre temas

```css
/* Aplicar al body o a :root */
*, *::before, *::after {
  transition: 
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Excepciones donde no queremos transición */
.no-transition,
.no-transition * {
  transition: none !important;
}
```

---

## Sistema Multi-tema (más de 2 temas)

```css
[data-theme="ocean"] {
  --color-bg: #0c1b33; --color-primary: #00b4d8;
}
[data-theme="forest"] {
  --color-bg: #0a1628; --color-primary: #52b788;
}
[data-theme="rose"] {
  --color-bg: #1a0a0f; --color-primary: #fb7185;
}
[data-theme="corporate"] {
  --color-bg: #f0f4f8; --color-primary: #1d4ed8; --color-text: #1e293b;
}
```

```javascript
// Selector de temas
const themes = ['light', 'dark', 'ocean', 'forest', 'rose'];
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
```
