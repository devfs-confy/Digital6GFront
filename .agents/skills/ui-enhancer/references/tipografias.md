# Tipografía — Referencia Completa

## Regla de Oro
**NUNCA** usar: Inter, Roboto, Arial, sans-serif genérico como primera opción.
**SIEMPRE** elegir fuentes con personalidad acorde al contexto del proyecto.

---

## Fuentes por Personalidad / Contexto

### Moderno / Tech / SaaS
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
/* Display: Space Grotesk — Body: Space Grotesk — Code: JetBrains Mono */

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono&display=swap');
/* Display: DM Sans — Limpia y moderna */

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
/* Outfit — Muy geométrica, perfecta para dashboards */
```

### Editorial / Noticias / Contenido
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Source+Serif+4:wght@300;400;600&display=swap');
/* Display: Playfair Display — Body: Source Serif 4 */

@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:wght@300;400;600&display=swap');
```

### Luxury / Moda / Portfolio
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@200;300;400;500&display=swap');
/* Cormorant — Elegante, refinado */

@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;1,400&family=Lato:wght@300;400&display=swap');
```

### Creativo / Agencia / Startup
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Nunito:wght@300;400;600&display=swap');
/* Syne — Muy distintiva para títulos */

@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&display=swap');
/* Solo disponible via bunny fonts o fontsource */
```

### Gaming / Futurista
```css
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700&display=swap');
/* Orbitron para títulos, Rajdhani para body */

@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&display=swap');
```

### Humanista / Orgánico / Bienestar
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500&display=swap');
```

### Minimalista / Clean
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
/* Plus Jakarta Sans — La alternativa premium a Inter */

@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap');
/* Figtree — Redonda, amigable */
```

---

## Escala Tipográfica (CSS Custom Properties)

```css
:root {
  /* Escala modular — ratio 1.25 (Major Third) */
  --text-xs:   0.64rem;   /* 10px */
  --text-sm:   0.8rem;    /* 13px */
  --text-base: 1rem;      /* 16px */
  --text-md:   1.25rem;   /* 20px */
  --text-lg:   1.563rem;  /* 25px */
  --text-xl:   1.953rem;  /* 31px */
  --text-2xl:  2.441rem;  /* 39px */
  --text-3xl:  3.052rem;  /* 49px */
  --text-4xl:  3.815rem;  /* 61px */
  --text-hero: clamp(3rem, 8vw, 6rem); /* Fluido para hero */

  /* Line heights */
  --leading-tight:  1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Letter spacing */
  --tracking-tight:  -0.02em;
  --tracking-normal: 0;
  --tracking-wide:   0.06em;
  --tracking-wider:  0.12em;
}
```

---

## Jerarquía Tipográfica Completa

```css
h1, .display {
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

h2, .heading {
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

h3, .subheading {
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1.4;
}

p, .body {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  font-weight: 400;
}

.caption, .label {
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.7;
}

.overline {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  font-weight: 600;
}
```

---

## Pares de Fuentes Probados

| Display | Body | Estilo |
|---------|------|--------|
| Playfair Display | Lato | Clásico editorial |
| Syne | Nunito Sans | Moderno creativo |
| Fraunces | Jost | Orgánico premium |
| Cormorant Garamond | Raleway | Luxury/Moda |
| Orbitron | Rajdhani | Sci-fi/Gaming |
| Space Grotesk | DM Sans | Tech/SaaS |
| Outfit | Outfit | Minimalista (una fuente) |
| Plus Jakarta Sans | Plus Jakarta Sans | Clean (una fuente) |

---

## Técnica: Variable Fonts con animación

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&display=swap');

@keyframes fontMorph {
  0%   { font-weight: 300; font-variation-settings: 'opsz' 9; }
  50%  { font-weight: 900; font-variation-settings: 'opsz' 144; }
  100% { font-weight: 300; font-variation-settings: 'opsz' 9; }
}
.morphing-text { animation: fontMorph 3s ease-in-out infinite; }
```

---

## Fluid Typography (responsive automático)

```css
/* Sin media queries — escala suave entre viewports */
h1 { font-size: clamp(2rem, 5vw + 1rem, 5rem); }
h2 { font-size: clamp(1.5rem, 3vw + 0.75rem, 3rem); }
p  { font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem); }
```
