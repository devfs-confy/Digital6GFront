// src/api/services/autorizaciones.service.js
import { api } from "@/api/axios";
import { handleError } from "@/utils/error.handler";

const AutorizacionesService = {
  nameRoute: "/v1/autorizaciones",

  async getAll(params = {}) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getBySede(IdEstacionamiento) {
    try {
      const response = await api.get(
        `${this.nameRoute}/sede/${IdEstacionamiento}`,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async enableAutorizacion(IdEstacionamiento, Estado) {
    try {
      const response = await api.put(
        `${this.nameRoute}/habilitar-quincena/${IdEstacionamiento}`,
        { Estado },
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default AutorizacionesService;
