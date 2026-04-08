import { api } from "@/api/axios";
import { handleError } from "vue";

class TarifasService {
  constructor() {
    this.nameRoute = "v1/tarifas";
  }

  /** Retorna el listado paginado de tarifas */
  async getAll(params = {}) {
    try {
      // params: { page, limit, search, idSede, idTipoPago, idTipoVehiculo, idAutorizacion }
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /** Actualiza el valor de una tarifa específica */
  async update(id, valor) {
    try {
      const response = await api.put(`${this.nameRoute}/${id}`, {
        Valor: valor,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new TarifasService();
