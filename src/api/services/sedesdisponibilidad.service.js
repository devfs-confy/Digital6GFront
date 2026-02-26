import { api } from "../axios";

class SedesDisponibilidadService {
  constructor() {
    this.nameRoute = "v1/sedes/disponibilidad/detalle";
  }

  async getDisponibilidadDetalle(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data.data;
    } catch (error) {
      console.error(
        "Error disponibilidad:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

export default new SedesDisponibilidadService();
