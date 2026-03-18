// src/api/services/pagos.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";
class PagosService {
  constructor() {
    this.opcionespago = "v1/payments/mensualidad"; // {idPersona}/opciones-pago
    this.iniciarpago = "v1/payments/mensualidad/iniciar-pago"; // {idPersona}
    this.estadopago = "v1/payments/mensualidad/consultar-pago"; // {referencia}
  }

  async getOpcionesPago(idPersona) {
    try {
      const response = await api.get(
        `${this.opcionespago}/${idPersona}/opciones-pago`,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async RegistrarPago() {
    try {
      const response = await api.post(`${this.opcionespago}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async iniciarPago(idPersona, body) {
    try {
      const response = await api.post(`${this.iniciarpago}/${idPersona}`, body);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async consultarPago(referencia) {
    try {
      const response = await api.get(`${this.estadopago}/${referencia}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new PagosService();
