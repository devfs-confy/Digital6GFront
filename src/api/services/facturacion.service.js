// src/api/services/facturacion.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class FacturacionService {
  constructor() {
    this.base = "v1/facturacion";
  }

  async getAll({ page = 1, limit = 10, search = "", IdEstacionamiento = "" } = {}) {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (IdEstacionamiento) params.IdEstacionamiento = IdEstacionamiento;
      const response = await api.get(this.base, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.base}/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async update(id, dto) {
    try {
      const response = await api.put(`${this.base}/${id}`, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new FacturacionService();
