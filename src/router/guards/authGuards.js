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
  if (!auth.user) {
    await auth.restoreSession();
    if (!auth.isAuthenticated) return next("/login");
  }

  // ── 4. Verificación de rol ────────────────────────────────────────
  const rolRequerido = to.meta.role;
  if (rolRequerido && auth.role !== rolRequerido) {
    return next("/unauthorized");
  }

  // ── 5. Verificación de Permiso Específico ──────────────────────────
  // Si la ruta tiene un meta.permission, verificamos el array del usuario
  const permisoRequerido = to.meta.permission;
  if (permisoRequerido) {
    const tienePermiso =
      auth.isAdmin || auth.user?.permisos?.includes(permisoRequerido);

    if (!tienePermiso) {
      console.warn(`Acceso denegado: Falta permiso ${permisoRequerido}`);
      return next("/unauthorized"); // O a auth.redirectTo
    }
  }

  next();
}
