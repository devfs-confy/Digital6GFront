// src/api/services/mensualidades.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class MensualidadesService {
  constructor() {
    this.nameRoute = "v1/mensualidades";
    this.adminRoute = "v1/mensualidades/admin";
    this.clientRoute = "v1/mensualidades/clientes/mis-mensualidades";
  }

  // ── ADMIN ──────────────────────────────────────────────────────────
  // GET /v1/mensualidades/admin?sede={id}&page&limit&search
  async getAllBySede({ sede, page = 1, limit = 10, search = "" } = {}) {
    try {
      const params = { sede, page, limit };
      if (search) params.search = search;
      const response = await api.get(this.adminRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/mensualidades/admin/detalle/{id}
  async getDetalleById(id) {
    try {
      const response = await api.get(`${this.adminRoute}/detalle/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/mensualidades/admin/api-sede/{idsede}/{documento}
  async getDesdeApiSede(idsede, documento) {
    try {
      const response = await api.get(
        `${this.adminRoute}/api-sede/${idsede}/${documento}`,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // PUT /v1/mensualidades/admin/{id}
  async updateById(id, dto) {
    try {
      const response = await api.put(`${this.adminRoute}/${id}`, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // ── USUARIO AUTENTICADO ────────────────────────────────────────────

  // GET /v1/mensualidades/mis-mensualidades
  async getMisMensualidades() {
    try {
      const response = await api.get(`${this.clientRoute}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/mensualidades/mis-mensualidades/{id}
  async getMiMensualidadById(id) {
    try {
      const response = await api.get(`${this.clientRoute}/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new MensualidadesService();
