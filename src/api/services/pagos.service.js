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

  // pagos.service.js
  async iniciarPago(idPersona, body) {
    const {
      Email,
      Telefono,
      CantidadMeses,
      ModalidadPago,
      FechaInicio,
      IdentificacionCliente,
      IdAutorizacionNueva,
      PlacasNuevas,
      Placas,
    } = body;

    const payload = {
      Email,
      Telefono,
      CantidadMeses,
      ModalidadPago,
      ...(FechaInicio && { FechaInicio }),
      ...(IdentificacionCliente && { IdentificacionCliente }),
      ...(IdAutorizacionNueva && { IdAutorizacionNueva }),
      ...(PlacasNuevas && { PlacasNuevas }),
      ...(Placas && { Placas }),
    };

    const { data } = await api.post(
      `${BASE_MENSUALIDAD}/iniciar-pago/${idPersona}`,
      payload,
    );
    return data;
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

  async getEstadoReferencia(requestId) {
    try {
      const { data } = await api.get(
        `${BASE}/mensualidad/consultar-estado/${requestId}`,
      );
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
