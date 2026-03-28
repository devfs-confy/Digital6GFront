// src/api/services/pagos.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

const BASE = "v1/payments";
const BASE_MENSUALIDAD = `${BASE}/mensualidad`;

class PagosService {
  // ── Mensualidad ──────────────────────────────────────────

  async getOpcionesPago(idPersona, meses = 1) {
    try {
      const { data } = await api.get(
        `${BASE_MENSUALIDAD}/${idPersona}/opciones-pago`,
        { params: { meses } },
      );
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  async iniciarPago(idPersona, body) {
    try {
      const { data } = await api.post(
        `${BASE_MENSUALIDAD}/iniciar-pago/${idPersona}`,
        body,
      );
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  async consultarEstado(rquid) {
    try {
      const { data } = await api.get(
        `${BASE_MENSUALIDAD}/consultar-estado/${rquid}`,
      );
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // ── Historial ─────────────────────────────────────────────

  async getHistorialPagos() {
    try {
      const { data } = await api.get(`${BASE}/historial`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getHistorialTransacciones() {
    try {
      const { data } = await api.get(`${BASE}/historial-transacciones`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new PagosService();

// ── Flujo de retorno de pasarela (302) ────────────────────
// El backend redirige a: /pago-resultado?referencia={referencia}
// El frontend debe tener esa ruta y leer el query param para
// llamar consultarEstado(referencia) y mostrar el resultado.
