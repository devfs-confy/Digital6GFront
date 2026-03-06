// codigos.service.js
import { api } from "@/api/axios";
import { handleError } from "@/utils/error.handler";

const CodigosService = {
  nameRoute: "/v1/codigo-validation",

  async generarCodigo(idSede, idAutorizacion) {
    try {
      const response = await api.post(this.nameRoute, {
        IdSede: idSede,
        IdAutorizacion: idAutorizacion,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default CodigosService;
