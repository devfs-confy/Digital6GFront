import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class PublicidadService {
  constructor() {
    this.nameRoute = "v1/publicidad";
  }
  async getMiPublicidad() {
    try {
      const { data } = await api.get(`${this.nameRoute}/mi-publicidad`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new PublicidadService();
