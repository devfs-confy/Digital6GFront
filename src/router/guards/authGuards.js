import { useAuthStore } from "@/stores/auth";

const rutasPublicas = ["/login", "/registro", "/unauthorized"];

export async function authGuard(to, from, next) {
  const auth = useAuthStore();

  // ── 1. Ruta pública ───────────────────────────────────────────────
  const esPublica = to.meta.public === true || rutasPublicas.includes(to.path);
  if (esPublica) {
    if (auth.isAuthenticated) return next(auth.redirectTo);
    return next();
  }

  // ── 2. Sin token → login ──────────────────────────────────────────
  if (!auth.isAuthenticated) {
    return next("/login");
  }

  // ── 3. Token existe pero user se perdió (recarga de página) ───────
  // Pinia restore el token del localStorage pero user puede ser null
  // si el JWT venció. restoreSession() lo verifica y renueva si hace falta.
  if (!auth.user) {
    await auth.restoreSession();
    if (!auth.isAuthenticated) return next("/login");
  }

  // ── 4. Verificación de rol ────────────────────────────────────────
  // Las rutas usan meta.role (singular) — lo comparamos con auth.role
  const rolRequerido = to.meta.role;
  if (rolRequerido && auth.role !== rolRequerido) {
    return next("/unauthorized"); // autenticado pero rol incorrecto
  }

  next();
}
