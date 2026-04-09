// src/api/services/arqueos.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class ArqueoServices {
  constructor() {
    this.nameRoute = "v1/arqueos";
  }

  async getAllArqueos(params = {}) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getArqueoById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // ← Fecha en formato YYYY-MM-DD
  async createArqueo(fecha) {
    try {
      const response = await api.post(this.nameRoute, { Fecha: fecha });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ArqueoServices();
