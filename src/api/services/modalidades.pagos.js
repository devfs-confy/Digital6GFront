import { api } from "@/api/axios";
import { handleError } from "@/utils/error.handler";

const ModalidadesPagosService = {
  nameRoute: "/v1/modalidades-pagos",

  async getAutorizaciones(idEstacionamiento) {
    try {
      const response = await api.get(`/v1/autorizaciones/sede/${idEstacionamiento}`);
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      handleError(error, "ModalidadesPagosService.getAutorizaciones");
    }
  },

  async getTiposPagos(idEstacionamiento, idAutorizacion) {
    try {
      const response = await api.get(`/v1/modalidades-pagos/sede/${idEstacionamiento}/autorizacion/${idAutorizacion}`);
      // Response shape: { data: { autorizacion_base: {...}, reglas: [...] } }
      return response.data?.data ?? response.data ?? { autorizacion_base: null, reglas: [] };
    } catch (error) {
      handleError(error, "ModalidadesPagosService.getTiposPagos");
    }
  },

  async habilitarQuincena(idEstacionamiento, estado) {
    try {
      const response = await api.put(
        `/v1/autorizaciones/habilitar-quincena/${idEstacionamiento}`,
        { Estado: estado }
      );
      return response.data;
    } catch (error) {
      handleError(error, "ModalidadesPagosService.habilitarQuincena");
    }
  },

  async agregarTiposPagos(idEstacionamiento, idAutorizacion, modalidades) {
    try {
      const response = await api.post(
        `/v1/modalidades-pagos/sede/${idEstacionamiento}/autorizacion/${idAutorizacion}`,
        { Modalidades: modalidades }
      );
      return response.data;
    } catch (error) {
      handleError(error, "ModalidadesPagosService.agregarTiposPagos");
    }
  },
};

export default ModalidadesPagosService;
