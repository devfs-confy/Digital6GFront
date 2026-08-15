# Microinteracciones — Referencia Completa

Las microinteracciones son pequeños feedbacks visuales que hacen que una UI se sienta viva y responsiva.

---

## Botones con Feedback

### Ripple effect (Material Design)
```css
.btn-ripple { position: relative; overflow: hidden; }
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  transform: scale(0);
  animation: rippleAnim 0.6s linear;
  pointer-events: none;
}
@keyframes rippleAnim {
  to { transform: scale(4); opacity: 0; }
}
```
```javascript
document.querySelectorAll('.btn-ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top:  ${e.clientY - rect.top  - size/2}px;
    `;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
```

### Botón con estado de éxito
```javascript
function setSuccess(btn) {
  const original = btn.innerHTML;
  btn.innerHTML = '✓ ¡Listo!';
  btn.classList.add('success');
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove('success');
    btn.disabled = false;
  }, 2000);
}
```
```css
.btn.success {
  background: linear-gradient(135deg, #059669, #10b981) !important;
  box-shadow: 0 4px 15px rgba(16,185,129,0.4) !important;
}
```

### Botón con loading spinner
```css
.btn.loading {
  color: transparent !important;
  pointer-events: none;
  position: relative;
}
.btn.loading::after {
  content: '';
  position: absolute;
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
```

---

## Inputs con Feedback Visual

### Input con validación en tiempo real
```javascript
const emailInput = document.querySelector('#email');
emailInput.addEventListener('input', function() {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
  this.classList.toggle('valid', valid && this.value.length > 0);
  this.classList.toggle('invalid', !valid && this.value.length > 0);
});
```
```css
.input { transition: all 0.2s ease; }
.input.valid   { border-color: #34d399; box-shadow: 0 0 0 3px rgba(52,211,153,0.15); }
.input.invalid { border-color: #f87171; box-shadow: 0 0 0 3px rgba(248,113,113,0.15); }
/* Shake para error */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.input.shake { animation: shake 0.4s ease; }
```

### Password strength meter
```javascript
function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score; // 0-4
}
```
```css
.strength-bar { height: 4px; border-radius: 2px; transition: all 0.3s; }
.strength-0 { width: 0%;   background: transparent; }
.strength-1 { width: 25%;  background: #f87171; }
.strength-2 { width: 50%;  background: #fbbf24; }
.strength-3 { width: 75%;  background: #60a5fa; }
.strength-4 { width: 100%; background: #34d399; }
```

---

## Toggle / Switch

```html
<label class="toggle">
  <input type="checkbox" id="myToggle">
  <span class="toggle-track">
    <span class="toggle-thumb"></span>
  </span>
  <span class="toggle-label">Modo activo</span>
</label>
```
```css
.toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.toggle input { display: none; }
.toggle-track {
  width: 52px; height: 28px;
  background: rgba(255,255,255,0.15);
  border-radius: 14px;
  position: relative;
  transition: background 0.3s ease;
}
.toggle-thumb {
  width: 22px; height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute; top: 3px; left: 3px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.toggle input:checked ~ .toggle-track { background: #6366f1; }
.toggle input:checked ~ .toggle-track .toggle-thumb { transform: translateX(24px); }
```

---

## Checkbox Personalizado

```css
.checkbox-custom { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.checkbox-custom input { display: none; }
.checkbox-box {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.checkbox-box::after {
  content: '✓';
  position: absolute; inset: 0;
  display: grid; place-items: center;
  color: white; font-size: 13px; font-weight: 700;
  opacity: 0; transform: scale(0);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.checkbox-custom input:checked ~ .checkbox-box {
  background: #6366f1; border-color: #6366f1;
}
.checkbox-custom input:checked ~ .checkbox-box::after {
  opacity: 1; transform: scale(1);
}
```

---

## Tooltip

```css
[data-tooltip] { position: relative; }
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: #1e293b;
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s ease;
  transform-origin: bottom center;
  border: 1px solid rgba(255,255,255,0.1);
}
[data-tooltip]::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px); left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1e293b;
  opacity: 0; transition: opacity 0.2s;
}
[data-tooltip]:hover::after {
  opacity: 1; transform: translateX(-50%) scale(1);
}
[data-tooltip]:hover::before { opacity: 1; }
```
```html
<button data-tooltip="Eliminar elemento">🗑️</button>
```

---

## Contador / Number Ticker

```javascript
function animateCounter(el, target, duration = 1500) {
  const start = parseInt(el.textContent) || 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Uso: animateCounter(document.querySelector('.counter'), 128450);
```

---

## Drag & Drop Visual

```css
.draggable {
  cursor: grab;
  transition: all 0.2s ease;
}
.draggable:active { cursor: grabbing; }
.draggable.dragging {
  opacity: 0.5;
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.drop-zone { transition: all 0.2s ease; }
.drop-zone.drag-over {
  border-color: #6366f1;
  background: rgba(99,102,241,0.1);
  transform: scale(1.01);
}
```

---

## Cursor Personalizado

```css
* { cursor: none; } /* ocultar cursor nativo */

.cursor {
  width: 12px; height: 12px;
  background: #6366f1;
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease, width 0.3s, height 0.3s, background 0.3s;
}
.cursor-ring {
  width: 36px; height: 36px;
  border: 2px solid rgba(99,102,241,0.5);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, width 0.3s, height 0.3s;
}
/* Cursor expandido en hover de links */
a:hover ~ .cursor-ring, button:hover ~ .cursor-ring {
  width: 60px; height: 60px;
  background: rgba(99,102,241,0.1);
  border-color: transparent;
}
```
```javascript
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  }, 80);
});
```
