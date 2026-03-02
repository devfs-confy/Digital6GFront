// src/api/services/payments.services.js
import { api } from "../axios";

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
      console.error("PaymentsService.getAll:", error);
      throw error;
    }
  }

  // POST /v1/payments/mensualidad
  async create(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      console.error("PaymentsService.create:", error);
      throw error;
    }
  }
}

export default new PaymentsService();
