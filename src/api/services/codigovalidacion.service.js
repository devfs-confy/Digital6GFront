// src/api/services/codigo-validation.services.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

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
      return handleError(error);
    }
  }
}

export default new CodigoValidationService();
