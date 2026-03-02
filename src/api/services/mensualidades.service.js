// src/api/services/mensualidades.services.js
import { api } from "../axios";

class MensualidadesService {
  constructor() {
    this.nameRoute = "v1/mensualidades";
  }

  // GET /v1/mensualidades
  async getAll(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error("MensualidadesService.getAll:", error);
      throw error;
    }
  }

  // GET /v1/mensualidades/detalle/{one}
  async getDetalle(id) {
    try {
      const response = await api.get(`${this.nameRoute}/detalle/${id}`);
      return response.data;
    } catch (error) {
      console.error("MensualidadesService.getDetalle:", error);
      throw error;
    }
  }

  // GET /v1/mensualidades/mis-mensualidades — mensualidades del usuario logueado
  async getMisMensualidades(params) {
    try {
      const response = await api.get(`${this.nameRoute}/mis-mensualidades`, {
        params,
      });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error("MensualidadesService.getMisMensualidades:", error);
      throw error;
    }
  }

  // GET /v1/mensualidades/mis-mensualidades/{id}
  async getMiMensualidadById(id) {
    try {
      const response = await api.get(
        `${this.nameRoute}/mis-mensualidades/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("MensualidadesService.getMiMensualidadById:", error);
      throw error;
    }
  }
}

export default new MensualidadesService();
