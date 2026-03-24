// src/api/services/factura.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";
class FacturaService {
  constructor() {
    this.facturapos = "v1/facturas/pos"; // ?token=${token}
  }

  async GetFacturaPos(token) {
    try {
      const response = await api.post(
        `${this.facturapos}?token=${encodeURIComponent(token)}`,
        {},
        { responseType: "blob" },
      );

      // Extraer filename del header Content-Disposition
      console.log('[Factura] headers:', response.headers)
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
}

export default new FacturaService();
