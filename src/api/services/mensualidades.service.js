// src/api/services/mensualidades.service.js
import { api } from "../axios";

class MensualidadesService {
  constructor() {
    this.nameRoute = "v1/mensualidades";
  }

  // GET /v1/mensualidades?sede={id}  — admin, requiere sede obligatorio
  async getAllBySede(sede) {
    try {
      const response = await api.get(this.nameRoute, { params: { sede } });
      return response.data;
    } catch (error) {
      console.error(
        "MensualidadesService.getAllBySede:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // GET /v1/mensualidades/detalle/{id}  — admin, detalle completo por ID
  async getDetalleById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/detalle/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "MensualidadesService.getDetalleById:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // GET /v1/mensualidades/mis-mensualidades  — usuario autenticado
  async getMisMensualidades() {
    try {
      const response = await api.get(`${this.nameRoute}/mis-mensualidades`);
      return response.data;
    } catch (error) {
      console.error(
        "MensualidadesService.getMisMensualidades:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // GET /v1/mensualidades/mis-mensualidades/{id}  — detalle de una mensualidad propia
  async getMiMensualidadById(id) {
    try {
      const response = await api.get(
        `${this.nameRoute}/mis-mensualidades/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "MensualidadesService.getMiMensualidadById:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // GET /v1/mensualidades/api-sede/{idsede}/{documento}  — consulta local en sede
  async getDesdeApiSede(idsede, documento) {
    try {
      const response = await api.get(
        `${this.nameRoute}/api-sede/${idsede}/${documento}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "MensualidadesService.getDesdeApiSede:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }
}

export default new MensualidadesService();
