// src/api/services/correos.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class CorreosService {
  constructor() {
    this.nameRoute = "v1/correos-info";
  }

  async enviarMasivo(dto) {
    try {
      const isFormData = dto instanceof FormData;
      const response = await api.post(this.nameRoute, dto, {
        headers: isFormData ? { "Content-Type": undefined } : {},
      });
      return response.data;
    } catch (error) {
      handleError(error, "CorreosService.enviarMasivo");
    }
  }
}

export default new CorreosService();
