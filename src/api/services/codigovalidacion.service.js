// src/api/services/codigo-validation.services.js
import { api } from "../axios";

class CodigoValidationService {
  constructor() {
    this.nameRoute = "v1/codigo-validation";
  }

  // POST /v1/codigo-validation
  async validate(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      console.error(
        "CodigoValidationService.validate:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

export default new CodigoValidationService();
