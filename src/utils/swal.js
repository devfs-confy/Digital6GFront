import Swal from "sweetalert2";

// ── Instancia base con el diseño del sistema ───────────────────────
const SwalBase = Swal.mixin({
  customClass: {
    popup: "swal-popup",
    title: "swal-title",
    htmlContainer: "swal-text",
    confirmButton: "swal-btn-confirm",
    cancelButton: "swal-btn-cancel",
    icon: "swal-icon",
  },
  buttonsStyling: false,
  showClass: {
    popup: "swal-show",
  },
  hideClass: {
    popup: "swal-hide",
  },
});

// ── Mensajes según status HTTP ─────────────────────────────────────
const mensajePorStatus = (status) => {
  const map = {
    400: "Los datos enviados no son válidos.",
    401: "No estás autorizado. Inicia sesión nuevamente.",
    403: "No tienes permisos para realizar esta acción.",
    404: "El recurso solicitado no fue encontrado.",
    409: "Ya existe un registro con estos datos.",
    422: "Los datos enviados no pudieron ser procesados.",
    500: "Error interno del servidor. Intenta más tarde.",
    503: "Servicio no disponible. Intenta más tarde.",
  };
  return map[status] ?? "Ocurrió un error inesperado.";
};

// ── Función principal: muestra el error del handleError ────────────
export const showError = ({ status, data } = {}) => {
  const msg = (() => {
    // Caso 1: data es el objeto response completo { message: "...", statusCode: 400 }
    // Caso 2: data tiene data anidado { data: { message: "..." } }
    const raw =
      typeof data?.message === "string" && data.message.trim()
        ? data.message
        : (data?.data?.message ?? null);

    if (!raw) return mensajePorStatus(status ?? data?.statusCode);

    if (Array.isArray(raw)) return raw.join("\n");
    return raw;
  })();

  return SwalBase.fire({
    icon: "error",
    title: "Ocurrió un error",
    text: msg,
    confirmButtonText: "Entendido",
  });
};

// ── Éxito ──────────────────────────────────────────────────────────
export const showSuccess = (title = "¡Listo!", text = "") => {
  return SwalBase.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Aceptar",
    timer: 2200,
    timerProgressBar: true,
  });
};

// ── Confirmación ───────────────────────────────────────────────────
export const showConfirm = ({
  title = "¿Estás seguro?",
  text = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon = "warning",
} = {}) => {
  return SwalBase.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
};

// ── Info ───────────────────────────────────────────────────────────
export const showInfo = (title = "", text = "") => {
  return SwalBase.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: "Entendido",
  });
};

export default SwalBase;
