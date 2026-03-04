// src/api/services/sedes.service.js
import { api } from "../axios";

class SedesService {
  constructor() {
    this.nameRoute = "v1/sedes";
  }

  // GET /v1/sedes
  async getAll(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error(
        "SedesService.getAll:",
        error.response?.data ?? error.message,
      );
      return [];
    }
  }

  // GET /v1/sedes/{id}
  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "SedesService.getById:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // POST /v1/sedes — requiere CREAR-SEDES
  // dto: { IdEstacionamiento*, Nombre*, AppHost*, Direccion*,
  //        RequiereTarjetaCarro*, RequiereTarjetaMoto*,
  //        ApiKey?, AppLiquidador?, Email?, PersonaContacto?, Telefono? }
  async create(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      console.error(
        "SedesService.create:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // PUT /v1/sedes/{id} — requiere EDITAR-SEDES
  // dto: cualquier subconjunto de los campos de create + Estado?
  async update(id, dto) {
    try {
      const response = await api.put(`${this.nameRoute}/${id}`, dto);
      return response.data;
    } catch (error) {
      console.error(
        "SedesService.update:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // DELETE /v1/sedes/{id}
  async delete(id) {
    try {
      const response = await api.delete(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "SedesService.delete:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // ── DISPONIBILIDAD ─────────────────────────────────────────────────

  // GET /v1/sedes/disponibilidad/detalle?IdSede=&IdTipoVehiculo=
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
      console.error(
        "SedesService.getDisponibilidad:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }

  // PUT /v1/sedes/disponibilidad/{idsede}/{idtipovehiculo} — requiere EDITAR-SEDES
  // dto: { IdEstacionamiento?, IdTipoVehiculo?, Total?, Mensualidades? }
  async updateDisponibilidad(idsede, idtipovehiculo, dto) {
    try {
      const response = await api.put(
        `${this.nameRoute}/disponibilidad/${idsede}/${idtipovehiculo}`,
        dto,
      );
      return response.data;
    } catch (error) {
      console.error(
        "SedesService.updateDisponibilidad:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  }
}

export default new SedesService();
