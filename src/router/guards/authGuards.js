import { useAuthStore } from "@/stores/auth";

const rutasPublicas = [
  "/login",
  "/forgot-password",
  "/registro",
  "/seleccionsede",
  "/unauthorized",
];

export async function authGuard(to, from, next) {
  const auth = useAuthStore();

  // ── 1. Ruta pública ───────────────────────────────────────────────
  const esPublica = to.meta.public === true || rutasPublicas.includes(to.path);
  if (esPublica) {
    if (auth.isAuthenticated) return next(auth.redirectTo);
    return next();
  }

  // ── 2. Sin token → login ──────────────────────────────────────────
  if (!auth.isAuthenticated) return next("/login");

  // ── 3. Restaurar sesión si user se perdió (recarga) ───────────────
  if (!auth.user) {
    await auth.restoreSession();
    if (!auth.isAuthenticated) return next("/login");
  }

  // ── 4. Verificación de rol ────────────────────────────────────────
  const rolRequerido = to.meta.role;
  if (rolRequerido) {
    const rolesValidos = Array.isArray(rolRequerido)
      ? rolRequerido
      : [rolRequerido];
    const tieneRol = rolesValidos.some(
      (r) =>
        auth.role === r || (auth.role === "administrador" && r === "admin"),
    );
    if (!tieneRol) return next("/unauthorized");
  }

  // ── 5. Verificación de permiso ────────────────────────────────────
  const permisoRequerido = to.meta.permission;
  if (permisoRequerido && !auth.hasPermiso(permisoRequerido)) {
    console.warn(
      `[Guard] Acceso denegado: falta permiso "${permisoRequerido}"`,
    );
    return next("/unauthorized");
  }

  next();
}
