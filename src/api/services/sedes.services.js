// src/api/services/sedes.services.js
import { api } from "../axios";

class SedesService {
  constructor() {
    this.nameRoute = "v1/sedes";
  }

  async getAll(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error("SedesService.getAll:", error);
      return [];
    }
  }

  // GET /v1/sedes/{id}
  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      console.error("SedesService.getById:", error);
      throw error;
    }
  }

  // POST /v1/sedes
  async create(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      console.error("SedesService.create:", error);
      throw error;
    }
  }

  // PUT /v1/sedes/{id}
  async update(id, dto) {
    try {
      const response = await api.put(`${this.nameRoute}/${id}`, dto);
      return response.data;
    } catch (error) {
      console.error("SedesService.update:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      console.error("SedesService.delete:", error);
      throw error;
    }
  }
}

export default new SedesService();
