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
   * GET /v1/comunidad-ucc/estudiantes-universidad
   * Query: page, limit, search
   */
  async getEstudiantesUniversidad(params = {}) {
    try {
      const response = await api.get(`${this.nameRoute}/estudiantes-universidad`, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * GET /v1/comunidad-ucc/empleados-universidad
   * Query: page, limit, search
   */
  async getEmpleadosUniversidad(params = {}) {
    try {
      const response = await api.get(`${this.nameRoute}/empleados-universidad`, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * POST /v1/comunidad-ucc/import
   * Body: FormData con archivo Excel de estudiantes
   */
  async uploadExcelEstudiantes(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(`${this.nameRoute}/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * POST /v1/comunidad-ucc/personal/import
   * Body: FormData con archivo Excel de personal
   */
  async uploadExcelPersonal(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(`${this.nameRoute}/personal/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * PUT /v1/comunidad-ucc/estudiantes/desactivar
   */
  async desactivarEstudiantes(desactivados) {
    try {
      const response = await api.put(`${this.nameRoute}/estudiantes/desactivar`, { desactivados });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * PUT /v1/comunidad-ucc/personal/desactivar
   */
  async desactivarPersonal(personal) {
    try {
      const response = await api.put(`${this.nameRoute}/personal/desactivar`, { personal });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ComunidadUccService();
