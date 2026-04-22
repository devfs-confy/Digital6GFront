// src/api/services/admin.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class ParqueosServices {
  constructor() {
    this.nameRoute = "v1/transacciones/mensualidad/mis-transacciones";
    this.secondRoute = "v1/transacciones/mensualidad/admin";
  }

  async getallParqueos(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

   async getAllAdmin(idsede, documento) {
    try {
      const response = await api.get(`${this.secondRoute}?IdSede=${idsede}&Documento=${documento}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
}

export default new ParqueosServices();
