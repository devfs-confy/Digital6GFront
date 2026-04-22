// src/api/services/factura.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";
class FacturaService {
  constructor() {
    this.facturapos = "v1/facturas/pos"; // ?token=${token}
    this.estadoget = "v1/payments/mensualidad/consultar-estado/"
  }


  async GetEstado(rquid) {
    try {
      const response = await api.get(`${this.estadoget}${rquid}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async GetFacturaPos(token) {
    try {
      const response = await api.post(
        `${this.facturapos}?token=${encodeURIComponent(token)}`,
        {},
        { responseType: "blob" },
      );

      // Extraer filename del header Content-Disposition
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "factura.pdf"; // fallback

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (match?.[1]) {
          fileName = match[1].replace(/['"]/g, "");
        }
      }

      return {
        blob: response.data,
        fileName,
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async getUltimosPagos(documento){
    try{
      const response = await api.get(`/v1/facturas/admin/ultimos/${documento}`);
      return response.data;
    }
    catch (error) {
      return handleError(error);
    }
  }
}

export default new FacturaService();
