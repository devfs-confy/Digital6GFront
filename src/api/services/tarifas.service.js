import { api } from "@/api/axios";
import { handleError } from "vue";

class TarifasService {
  constructor() {
    this.nameRoute = "v1/tarifas";
  }
  async getAll(params = {}) {
    try {
      const response = await api.get(this.nameRoute, { params });

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new TarifasService();
