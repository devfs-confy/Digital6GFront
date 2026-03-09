# Componentes UI — Referencia Completa

## Cards

### Card Glassmorphism con hover
```css
.card {
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, #6366f1, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.card:hover {
  transform: translateY(-6px);
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 20px 60px rgba(99,102,241,0.15);
}
.card:hover::before { opacity: 1; }
```

### Stat Card / KPI Card
```html
<div class="stat-card">
  <div class="stat-icon">📈</div>
  <div class="stat-body">
    <p class="stat-label">Ingresos Totales</p>
    <h2 class="stat-value">$128,450</h2>
    <span class="stat-change positive">+12.5% vs mes anterior</span>
  </div>
</div>
```
```css
.stat-card {
  display: flex; gap: 16px; align-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px; padding: 24px;
}
.stat-icon { font-size: 2.5rem; }
.stat-label { color: #94a3b8; font-size: 0.85rem; margin-bottom: 4px; }
.stat-value { font-size: 2rem; font-weight: 700; color: #fff; margin: 0; }
.stat-change.positive { color: #34d399; font-size: 0.8rem; }
.stat-change.negative { color: #f87171; font-size: 0.8rem; }
```

---

## Botones

### Sistema completo de botones
```css
/* Base */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; border-radius: 10px;
  font-weight: 600; font-size: 0.95rem;
  border: none; cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none; white-space: nowrap;
}

/* Primary */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 15px rgba(99,102,241,0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99,102,241,0.5);
}
.btn-primary:active { transform: translateY(0); }

/* Secondary / Outline */
.btn-outline {
  background: transparent;
  color: #6366f1;
  border: 1.5px solid #6366f1;
}
.btn-outline:hover {
  background: rgba(99,102,241,0.1);
  transform: translateY(-2px);
}

/* Ghost */
.btn-ghost {
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
  border: 1px solid rgba(255,255,255,0.1);
}
.btn-ghost:hover { background: rgba(255,255,255,0.1); }

/* Danger */
.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 15px rgba(239,68,68,0.3);
}

/* Tamaños */
.btn-sm { padding: 8px 16px; font-size: 0.85rem; border-radius: 8px; }
.btn-lg { padding: 16px 32px; font-size: 1.1rem; border-radius: 12px; }

/* Con ícono */
.btn-icon { width: 44px; height: 44px; padding: 0; justify-content: center; border-radius: 10px; }

/* Loading state */
.btn.loading { pointer-events: none; opacity: 0.7; }
.btn.loading::after {
  content: '';
  width: 16px; height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-left: 8px;
}
```

---

## Inputs / Formularios

```css
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.875rem; font-weight: 500; color: #94a3b8; }

.input {
  background: rgba(255,255,255,0.05);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  outline: none;
  width: 100%;
}
.input:focus {
  border-color: #6366f1;
  background: rgba(99,102,241,0.05);
  box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
}
.input::placeholder { color: #475569; }
.input.error { border-color: #ef4444; }
.input.success { border-color: #34d399; }

.input-with-icon { position: relative; }
.input-with-icon .input { padding-left: 44px; }
.input-with-icon .input-icon {
  position: absolute; left: 14px; top: 50%;
  transform: translateY(-50%); color: #64748b;
}
```

---

## Tablas

```css
.table-container {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}
table {
  width: 100%; border-collapse: collapse;
  background: rgba(255,255,255,0.03);
}
thead { background: rgba(99,102,241,0.1); }
th {
  padding: 14px 20px;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
td {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: #e2e8f0;
  font-size: 0.9rem;
}
tr:hover td { background: rgba(99,102,241,0.05); }
tr:last-child td { border-bottom: none; }

.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  font-size: 0.78rem; font-weight: 600;
}
.badge-success { background: rgba(52,211,153,0.15); color: #34d399; }
.badge-warning { background: rgba(251,191,36,0.15); color: #fbbf24; }
.badge-danger  { background: rgba(248,113,113,0.15); color: #f87171; }
.badge-info    { background: rgba(99,102,241,0.15); color: #818cf8; }
```

---

## Modal

```html
<div class="modal-overlay" id="modal" onclick="closeModal(event)">
  <div class="modal-content">
    <button class="modal-close" onclick="document.getElementById('modal').classList.remove('active')">✕</button>
    <h2 class="modal-title">Título del Modal</h2>
    <p>Contenido del modal...</p>
    <div class="modal-actions">
      <button class="btn btn-ghost">Cancelar</button>
      <button class="btn btn-primary">Confirmar</button>
    </div>
  </div>
</div>
```
```css
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: grid; place-items: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1000;
}
.modal-overlay.active { opacity: 1; pointer-events: auto; }
.modal-content {
  background: #1a1a2e;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 32px;
  width: 90%; max-width: 480px;
  position: relative;
  transform: scale(0.9);
  transition: transform 0.3s;
}
.modal-overlay.active .modal-content { transform: scale(1); }
.modal-close {
  position: absolute; top: 16px; right: 16px;
  background: rgba(255,255,255,0.08);
  border: none; border-radius: 8px;
  width: 32px; height: 32px;
  cursor: pointer; color: #94a3b8;
  transition: background 0.2s;
}
.modal-close:hover { background: rgba(255,255,255,0.15); }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
```

---

## Navigation / Navbar

```css
.navbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: rgba(15,12,41,0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s ease;
}
.navbar.scrolled {
  padding: 12px 32px;
  background: rgba(15,12,41,0.95);
  box-shadow: 0 4px 30px rgba(0,0,0,0.3);
}
.nav-logo { font-weight: 700; font-size: 1.3rem; color: white; }
.nav-links { display: flex; gap: 8px; list-style: none; }
.nav-link {
  padding: 8px 16px; border-radius: 8px;
  color: #94a3b8; text-decoration: none;
  font-weight: 500; font-size: 0.9rem;
  transition: all 0.2s;
}
.nav-link:hover, .nav-link.active {
  color: white; background: rgba(255,255,255,0.08);
}
```

---

## Sidebar / Dashboard Layout

```css
.app-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}
.sidebar {
  background: rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.07);
  padding: 24px 16px;
  display: flex; flex-direction: column; gap: 4px;
}
.sidebar-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 10px;
  color: #64748b; cursor: pointer;
  transition: all 0.2s; font-size: 0.9rem;
}
.sidebar-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
.sidebar-item.active {
  background: rgba(99,102,241,0.15);
  color: #818cf8; font-weight: 600;
}
.main-content { padding: 32px; overflow-y: auto; }
```

---

## Toast / Notifications

```css
.toast-container {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; flex-direction: column; gap: 8px;
  z-index: 9999;
}
.toast {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; border-radius: 12px;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  min-width: 280px;
  animation: slideInRight 0.3s ease;
}
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
.toast-success { border-left: 3px solid #34d399; }
.toast-error   { border-left: 3px solid #f87171; }
.toast-warning { border-left: 3px solid #fbbf24; }
.toast-info    { border-left: 3px solid #818cf8; }
```

---

## Progress Bar

```css
.progress-track {
  background: rgba(255,255,255,0.08);
  border-radius: 100px;
  height: 8px; overflow: hidden;
}
.progress-bar {
  height: 100%;
  border-radius: 100px;
  background: linear-gradient(90deg, #6366f1, #a78bfa);
  position: relative;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.progress-bar::after {
  content: '';
  position: absolute;
  top: 0; left: -100%; right: -100%; bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  animation: shimmerBar 1.5s ease infinite;
}
@keyframes shimmerBar {
  to { transform: translateX(200%); }
}
```
