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

  async getBySede(idSede) {
    try {
      const response = await api.get(this.nameRoute, {
        params: { idSede, limit: 100 },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default AutorizacionesService;
