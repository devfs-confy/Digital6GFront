// src/api/services/payments.services.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";
class PaymentsService {
  constructor() {
    this.nameRoute = "v1/payments/mensualidad";
  }

  // GET /v1/payments/mensualidad
  async getAll(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/payments/mensualidad
  async create(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new PaymentsService();
