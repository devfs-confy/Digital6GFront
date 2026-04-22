// src/api/services/factura.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";
class FacturaService {
  constructor() {
    this.facturapos = "v1/facturas/pos"; // ?token=${token}
    this.estadoget = "v1/payments/mensualidad/consultar-estado/";
    this.facturadmin = "v1/facturas/admin/pagos";
  }

  async GetFacturasAdmin({
    page = 1,
    limit = 10,
    IdSede = "",
    IdModulo = "",
    NumeroFactura = "",
    IdTransaccion = "",
  } = {}) {
    try {
      const params = { page, limit };
      if (IdSede) params.IdSede = IdSede;
      if (IdModulo) params.IdModulo = IdModulo;
      if (NumeroFactura) params.NumeroFactura = NumeroFactura;
      if (IdTransaccion) params.IdTransaccion = IdTransaccion;
      const response = await api.get(this.facturadmin, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
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
