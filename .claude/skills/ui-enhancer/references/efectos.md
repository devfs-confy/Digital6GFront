# Efectos Visuales — Referencia Completa

## Glassmorphism

El efecto de "vidrio esmerilado". Requiere fondo con color o imagen visible detrás.

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --glass-blur: blur(20px);
}

.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: 16px;
}

/* Versión intensidad media */
.glass-medium {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

/* Glassmorphism oscuro */
.glass-dark {
  background: rgba(15, 15, 30, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05);
}
```

**Fondo recomendado para glassmorphism:**
```css
body {
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  /* O con blob shapes */
  position: relative; overflow: hidden;
}
body::before, body::after {
  content: '';
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: -1;
}
body::before {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(99,102,241,0.3), transparent);
  top: -200px; left: -200px;
}
body::after {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(168,85,247,0.2), transparent);
  bottom: -150px; right: -150px;
}
```

---

## Neomorfismo (Neumorphism)

Efecto de relieve suave. Funciona mejor en fondos monocromáticos claros o grises.

```css
:root {
  --neo-bg: #e0e5ec;
  --neo-shadow-dark: #a3b1c6;
  --neo-shadow-light: #ffffff;
}

/* Elemento elevado */
.neo {
  background: var(--neo-bg);
  border-radius: 16px;
  box-shadow: 
    8px 8px 16px var(--neo-shadow-dark),
    -8px -8px 16px var(--neo-shadow-light);
}

/* Elemento presionado (activo) */
.neo-pressed {
  background: var(--neo-bg);
  border-radius: 16px;
  box-shadow: 
    inset 6px 6px 12px var(--neo-shadow-dark),
    inset -6px -6px 12px var(--neo-shadow-light);
}

/* Botón neomórfico */
.neo-btn {
  background: var(--neo-bg);
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  cursor: pointer;
  box-shadow: 
    6px 6px 12px var(--neo-shadow-dark),
    -6px -6px 12px var(--neo-shadow-light);
  transition: box-shadow 0.15s ease;
}
.neo-btn:active {
  box-shadow: 
    inset 4px 4px 8px var(--neo-shadow-dark),
    inset -4px -4px 8px var(--neo-shadow-light);
}
```

---

## Efectos de Texto

### Texto con gradiente
```css
.gradient-text {
  background: linear-gradient(135deg, #6366f1, #a78bfa, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animado */
@keyframes gradientFlow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.gradient-text-animated {
  background: linear-gradient(270deg, #6366f1, #a78bfa, #ec4899, #f59e0b);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientFlow 4s ease infinite;
}
```

### Texto neón
```css
.neon-text {
  color: #fff;
  text-shadow:
    0 0 10px #00f5ff,
    0 0 20px #00f5ff,
    0 0 40px #00f5ff,
    0 0 80px #00f5ff;
}

@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow: 0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff;
  }
  20%, 24%, 55% { text-shadow: none; }
}
.neon-flicker { animation: neonFlicker 3s infinite; }
```

### Texto con clip de imagen/video
```css
.text-clip {
  font-size: 6rem; font-weight: 900;
  background: url('https://source.unsplash.com/random/1200x600') center/cover;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Partículas (particles.js — CDN)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"></script>
<div id="particles-js" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;"></div>

<script>
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#6366f1" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: {
      enable: true, distance: 150,
      color: "#6366f1", opacity: 0.3, width: 1
    },
    move: { enable: true, speed: 2, random: false, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { particles_nb: 4 }
    }
  }
});
</script>
```

---

## Gradientes Modernos

```css
/* Mesh gradient */
.mesh-gradient {
  background-color: #0f0c29;
  background-image:
    radial-gradient(at 40% 20%, rgba(99,102,241,0.4) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(168,85,247,0.3) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(236,72,153,0.2) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(59,130,246,0.2) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(99,102,241,0.3) 0px, transparent 50%);
}

/* Conic gradient (muy moderno) */
.conic-bg {
  background: conic-gradient(from 180deg at 50% 50%, #6366f1 0deg, #a78bfa 90deg, #ec4899 180deg, #6366f1 360deg);
  filter: blur(60px);
  opacity: 0.4;
}

/* Aurora */
@keyframes aurora {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.aurora {
  background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f3460, #16213e);
  background-size: 400% 400%;
  animation: aurora 12s ease infinite;
}
```

---

## Borders y Outlines

```css
/* Border con gradiente */
.gradient-border {
  position: relative;
  border-radius: 12px;
  background: #1a1a2e;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  background: linear-gradient(135deg, #6366f1, #a78bfa, #ec4899);
  z-index: -1;
}

/* Animated border */
@keyframes borderSpin {
  to { transform: rotate(360deg); }
}
.animated-border {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}
.animated-border::before {
  content: '';
  position: absolute;
  width: 200%; height: 200%;
  top: -50%; left: -50%;
  background: conic-gradient(transparent 270deg, #6366f1, transparent);
  animation: borderSpin 3s linear infinite;
}
.animated-border::after {
  content: '';
  position: absolute;
  inset: 1px;
  background: #1a1a2e;
  border-radius: 11px;
}

/* Dashed animado */
@keyframes dash { to { stroke-dashoffset: -100; } }
```

---

## Three.js — Fondo 3D básico

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<canvas id="bg3d" style="position:fixed;top:0;left:0;z-index:-1;"></canvas>

<script>
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg3d'), alpha: true });
renderer.setSize(innerWidth, innerHeight);

// Esfera con wireframe
const geometry = new THREE.IcosahedronGeometry(2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.003;
  mesh.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
</script>
```

---

## Hover Effects en Cards

```css
/* Tilt 3D en hover */
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}
/* Aplicar con JS: */
/* card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width  - 0.5;
  const y = (e.clientY - rect.top)  / rect.height - 0.5;
  card.style.transform = `perspective(600px) rotateY(${x*20}deg) rotateX(${-y*20}deg)`;
}); */

/* Shine effect en hover */
.shine {
  position: relative; overflow: hidden;
}
.shine::after {
  content: '';
  position: absolute;
  top: -50%; left: -75%;
  width: 50%; height: 200%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
  transform: skewX(-20deg);
  transition: left 0.5s ease;
}
.shine:hover::after { left: 125%; }
```
