// src/api/services/clientBill.service.js
import { handleError } from "@/utils/error.handler";
import { api } from "../axios";

class ClientBillService {
  constructor() {
    this.baseRoute = "v1/usuarios/clientes/facturacion/";
  }

  // GET /v1/usuarios/clientes/facturacion/{id}
  async GetFacturacionCliente(id) {
    try {
      const response = await api.get(this.baseRoute + id);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/usuarios/clientes/facturacion/{documento}
  async CreateFacturacionCliente(documento, dto) {
    try {
      const response = await api.post(this.baseRoute + documento, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ClientBillService();
