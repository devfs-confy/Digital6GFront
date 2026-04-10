// src/api/services/admin.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class ParqueosServices {
  constructor() {
    this.nameRoute = "v1/transacciones/mensualidad/mis-transacciones";
  }

  async getallParqueos(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
}

export default new ParqueosServices();
