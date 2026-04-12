// src/api/services/comunidadUcc.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class ComunidadUccService {
  constructor() {
    this.nameRoute = "v1/comunidad-ucc";
  }

  /**
   * GET /v1/comunidad-ucc
   * Query: page, limit, search
   */
  async getAll(params = {}) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * POST /v1/comunidad-ucc
   * Body: Documento, Nombre1, Nombre2?, Apellido1, Apellido2?
   */
  async create(dto) {
    try {
      const payload = {
        Documento: dto.Documento,
        Nombre1: dto.Nombre1,
        Apellido1: dto.Apellido1,
      };
      if (dto.Nombre2) payload.Nombre2 = dto.Nombre2;
      if (dto.Apellido2) payload.Apellido2 = dto.Apellido2;

      const response = await api.post(this.nameRoute, payload);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * POST /v1/comunidad-ucc/upload-excel
   * Body: FormData con archivo Excel
   */
  async uploadExcel(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(`${this.nameRoute}/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ComunidadUccService();
