// src/api/services/sedes.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class SedesService {
  constructor() {
    this.nameRoute = "v1/sedes";
  }

  async getAll(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      handleError(error, "SedesService.getAll");
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, "SedesService.getById");
    }
  }

  async create(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      handleError(error, "SedesService.create");
    }
  }

  async update(id, dto) {
    try {
      const response = await api.put(`${this.nameRoute}/${id}`, dto);
      return response.data;
    } catch (error) {
      handleError(error, "SedesService.update");
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, "SedesService.delete");
    }
  }

  async getDisponibilidad({ IdSede, IdTipoVehiculo } = {}) {
    try {
      const params = {};
      if (IdSede) params.IdSede = IdSede;
      if (IdTipoVehiculo) params.IdTipoVehiculo = IdTipoVehiculo;
      const response = await api.get(
        `${this.nameRoute}/disponibilidad/detalle`,
        { params },
      );
      return response.data;
    } catch (error) {
      handleError(error, "SedesService.getDisponibilidad");
    }
  }

  async updateDisponibilidad(idsede, idtipovehiculo, dto) {
    try {
      const response = await api.put(
        `${this.nameRoute}/disponibilidad/${idsede}/${idtipovehiculo}`,
        dto,
      );
      return response.data;
    } catch (error) {
      handleError(error, "SedesService.updateDisponibilidad");
    }
  }
}

export default new SedesService();
