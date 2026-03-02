// src/api/services/sedes-disponibilidad.services.js
import { api } from "../axios";

class SedesDisponibilidadService {
  constructor() {
    this.baseRoute = "v1/sedes/disponibilidad";
    this.detalleRoute = "v1/sedes/disponibilidad/detalle";
  }

  // GET /v1/sedes/disponibilidad/detalle
  async getDisponibilidadDetalle(params) {
    try {
      const response = await api.get(this.detalleRoute, { params });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error(
        "SedesDisponibilidadService.getDisponibilidadDetalle:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  // PUT /v1/sedes/disponibilidad/{idsede}/{idtipovehiculo}
  async updateDisponibilidad(idSede, idTipoVehiculo, dto) {
    try {
      const response = await api.put(
        `${this.baseRoute}/${idSede}/${idTipoVehiculo}`,
        dto,
      );
      return response.data;
    } catch (error) {
      console.error(
        "SedesDisponibilidadService.updateDisponibilidad:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

export default new SedesDisponibilidadService();
