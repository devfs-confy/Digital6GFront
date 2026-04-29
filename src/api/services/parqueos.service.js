// src/api/services/admin.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class ParqueosServices {
  constructor() {
    this.nameRoute = "v1/transacciones/mensualidad/mis-transacciones";
    this.secondRoute = "v1/transacciones/mensualidad/admin";
  }

  async getallParqueos(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  // http://localhost:3001/api/v1/transacciones/mensualidad/admin/paginated?IdSede=32&FechaInicio=2026-01-01&FechaFin=2026-06-01&search=1097493230

  async getAllAdmin({
    page = 1,
    limit = 10,
    IdSede = "",
    search = "",
    FechaInicio = "",
    FechaFin = "",
  } = {}) {
    try {
      const params = { page, limit, IdSede };
      if (search) params.search = search;
      if (FechaInicio) params.FechaInicio = FechaInicio;
      if (FechaFin) params.FechaFin = FechaFin;
      const { data } = await api.get(`${this.secondRoute}/paginated`, {
        params,
      });
      return data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ParqueosServices();
