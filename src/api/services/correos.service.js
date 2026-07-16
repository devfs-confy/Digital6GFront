// src/api/services/correos.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class CorreosService {
  constructor() {
    this.nameRoute = "v1/correos-info";
  }

  async enviarMasivo(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      handleError(error, "CorreosService.enviarMasivo");
    }
  }
}

export default new CorreosService();
