# Setup — Digital6G Frontend

## Requisitos

- **Node.js** >= 18
- **npm** >= 9

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Digital6GFront

# 2. Instalar dependencias
npm install
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto (o usar `.env.development`):

```env
# URL base de la API
VITE_API_URL=http://localhost:3000/api
```

| Variable | Descripción | Ejemplo |
|:---|:---|:---|
| `VITE_API_URL` | URL base del backend. Todas las peticiones Axios usan este valor. | `http://localhost:3000/api` |


> **Importante:** Las variables de Vite deben tener el prefijo `VITE_`. Cualquier otra variable no será inyectada en el bundle del cliente.

### Entornos

| Archivo | Uso |
|:---|:---|
| `.env.development` | Valores por defecto para desarrollo local |
| `.env` | Override local (no commitear al repo) |

## Scripts

```bash
# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción (genera dist/)
npm run build

# Preview del build de producción
npm run preview

# Compilar Tailwind CSS (watch mode)
npm run style
```

### `npm run dev`

- Inicia Vite dev server en `0.0.0.0:5173` (accesible desde la red local)
- Hot Module Replacement (HMR) activado
- Alias `@` resuelve a `./src`

### `npm run build`

- Genera bundle optimizado en `dist/`
- Tree-shaking, minificación, code splitting automático
- Para servir: `npm run preview`

### `npm run style`

- Lee `src/assets/style.css` (directivas Tailwind)
- Genera `src/assets/main.css` (CSS compilado)
- Watch mode: recompila al cambiar clases en `.vue`

## Estructura de Archivos Clave

```
.
├── src/
│   ├── main.js              # Punto de entrada: crea app, registra Pinia, Router, directivas
│   ├── App.vue              # Raíz: RouterView + restoreSession() en onMounted
│   ├── style.css            # Estilos globales
│   ├── api/                 # Axios + servicios
│   ├── assets/              # CSS, SVGs, imágenes
│   ├── components/          # Componentes reutilizables
│   ├── composables/         # Lógica reutilizable (Composition API)
│   ├── constants/           # Constantes (PERMS)
│   ├── directives/          # Directivas globales (v-permission)
│   ├── layouts/             # Layouts por rol
│   ├── router/              # Rutas + guards
│   ├── stores/              # Pinia stores
│   ├── utils/               # Utilidades (error handler, fechas, swal)
│   └── views/               # Vistas por rol (auth, admin, cliente)
├── doc/                     # Documentación del proyecto
├── .env                     # Variables de entorno (no commitear)
├── .env.development         # Variables por defecto
├── package.json
└── vite.config.js
```

## Vite Config

```js
// vite.config.js
export default defineConfig({
  base: "/",
  plugins: [vue()],
  server: { host: true },        // accesible en red local
  resolve: {
    alias: { "@": "./src" }     // import { x } from "@/stores/auth"
  },
});
```

## Verificación

Después de `npm run dev`, abre `http://localhost:5173`:

- Deberías ver la página de **Login**
- Si la API no está disponible, el login mostrará error de conexión
- Las credenciales de prueba dependen del backend configurado
