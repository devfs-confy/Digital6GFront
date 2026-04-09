// src/api/services/sedes-disponibilidad.services.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

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
      handleError(error, "SedesDisponibilidadService.getDisponibilidadDetalle");
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
      handleError(error, "SedesDisponibilidadService.updateDisponibilidad");
    }
  }
}

export default new SedesDisponibilidadService();
