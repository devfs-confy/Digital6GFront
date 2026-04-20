// src/api/services/arqueos.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class ArqueoServices {
  constructor() {
    this.nameRoute = "v1/consignaciones";
  }

  async getAllArqueos({
    page = 1,
    limit = 10,
    search = "",
    IdEstacionamiento = "",
  } = {}) {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (IdEstacionamiento) params.IdEstacionamiento = IdEstacionamiento;
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async generarConsignaciones(Fecha) {
    try {
      const response = await api.post(this.nameRoute, { Fecha });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ArqueoServices();
