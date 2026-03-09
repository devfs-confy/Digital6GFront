# Animaciones — Referencia Completa

## CSS Puro (sin librerías)

### Fade + Slide al cargar
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
.elemento { animation: fadeSlideUp 0.6s ease forwards; }

/* Stagger para listas */
.item:nth-child(1) { animation-delay: 0.1s; }
.item:nth-child(2) { animation-delay: 0.2s; }
.item:nth-child(3) { animation-delay: 0.3s; }
```

### Pulse (notificaciones, badges)
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.08); opacity: 0.8; }
}
.badge { animation: pulse 2s ease-in-out infinite; }
```

### Shimmer / Skeleton Loading
```css
@keyframes shimmer {
  0%   { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 8px;
}
/* Dark mode skeleton */
.dark .skeleton {
  background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
  background-size: 1000px 100%;
}
```

### Bounce de entrada (alertas, modales)
```css
@keyframes bounceIn {
  0%   { transform: scale(0.3); opacity: 0; }
  50%  { transform: scale(1.05); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}
.modal { animation: bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
```

### Rotate continuo (loaders, íconos)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loader { animation: spin 0.8s linear infinite; }
```

### Glow pulsante (botones CTA, destacados)
```css
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.4); }
  50%       { box-shadow: 0 0 25px rgba(99, 102, 241, 0.8), 0 0 50px rgba(99, 102, 241, 0.3); }
}
.btn-cta { animation: glowPulse 2s ease-in-out infinite; }
```

### Typing cursor
```css
@keyframes blink { 50% { border-color: transparent; } }
.typing-cursor {
  border-right: 3px solid currentColor;
  animation: blink 0.75s step-end infinite;
  padding-right: 4px;
}
```

---

## Scroll Reveal (sin librería, Intersection Observer)

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
[data-reveal].visible {
  opacity: 1;
  transform: translateY(0);
}
[data-reveal="left"]  { transform: translateX(-40px); }
[data-reveal="right"] { transform: translateX(40px); }
[data-reveal="scale"] { transform: scale(0.8); }
```

```html
<div data-reveal>Aparece al hacer scroll</div>
<div data-reveal="left">Entra desde la izquierda</div>
```

---

## GSAP (para HTML con CDN de cdnjs)

```javascript
// Importar en HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js">
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js">

gsap.registerPlugin(ScrollTrigger);

// Animación de entrada staggered
gsap.from('.card', {
  duration: 0.8,
  y: 60,
  opacity: 0,
  stagger: 0.15,
  ease: 'power3.out'
});

// Scroll trigger
gsap.from('.section-title', {
  scrollTrigger: {
    trigger: '.section-title',
    start: 'top 80%',
  },
  y: 50,
  opacity: 0,
  duration: 0.9,
  ease: 'expo.out'
});

// Timeline (secuencia)
const tl = gsap.timeline({ delay: 0.3 });
tl.from('.hero-title', { y: -30, opacity: 0, duration: 0.6 })
  .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
  .from('.hero-btn', { scale: 0.8, opacity: 0, duration: 0.4 }, '-=0.2');
```

---

## AOS (Animate on Scroll — CDN)

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
<script>AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });</script>

<!-- Uso en HTML -->
<div data-aos="fade-up">...</div>
<div data-aos="fade-right" data-aos-delay="200">...</div>
<div data-aos="zoom-in" data-aos-duration="500">...</div>
```

Efectos disponibles: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`, `zoom-out`, `flip-left`, `flip-right`

---

## Accesibilidad — prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Animaciones React (CSS + estado)

```jsx
// Con CSS modules o Tailwind
const [visible, setVisible] = useState(false);

// Usando clases dinámicas (Tailwind)
<div className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
  Contenido animado
</div>

// Lista con stagger via index
{items.map((item, i) => (
  <div
    key={item.id}
    style={{ 
      animationDelay: `${i * 100}ms`,
      animation: 'fadeSlideUp 0.5s ease forwards',
      opacity: 0 
    }}
  >
    {item.name}
  </div>
))}
```
