// src/api/services/pqrs.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class PqrsService {
  constructor() {
    this.nameRoute = "v1/pqrs/cliente";
  }

  // GET /v1/pqrs/cliente/motivos (público, sin token)
  async getMotivos() {
    try {
      const response = await api.get(`${this.nameRoute}/motivos`);
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/pqrs/cliente
  async create(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/pqrs/cliente/mis-pqrs
  async getMisPqrs(params = {}) {
    try {
      const response = await api.get(`${this.nameRoute}/mis-pqrs`, { params });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/pqrs/cliente/:id
  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data?.data ?? response.data ?? null;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new PqrsService();
