// src/api/services/admin.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class AdminServices {
  constructor() {
    this.nameRoute = "v1/usuarios/admin";
  }

  /**
   * GET /v1/usuarios/admin
   * Query: page, limit, search, rol
   */
  async getAllAdmins(params = {}) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * POST /v1/usuarios/admin
   * Requiere: Documento, Nombres, Apellidos, Password, Telefono, Email, IdRol
   * Opcional: Estado (default true)
   */
  async createAdmin(dto) {
    try {
      const response = await api.post(this.nameRoute, {
        Documento: Number(dto.Documento),
        Nombres: dto.Nombres,
        Apellidos: dto.Apellidos,
        Password: dto.Password,
        Telefono: dto.Telefono,
        Email: dto.Email,
        IdRol: Number(dto.IdRol),
        Estado: dto.Estado ?? true,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * PUT /v1/usuarios/admin/{Documento}
   * Todos los campos son opcionales en el body
   */
  async updateAdmin(documento, dto) {
    try {
      const payload = {};
      if (dto.Nombres !== undefined) payload.Nombres = dto.Nombres;
      if (dto.Apellidos !== undefined) payload.Apellidos = dto.Apellidos;
      if (dto.Email !== undefined) payload.Email = dto.Email;
      if (dto.Telefono !== undefined) payload.Telefono = dto.Telefono;
      if (dto.Password !== undefined) payload.Password = dto.Password;
      if (dto.IdRol !== undefined) payload.IdRol = Number(dto.IdRol);
      if (dto.Estado !== undefined) payload.Estado = dto.Estado;
      if (dto.Documento !== undefined)
        payload.Documento = Number(dto.Documento);

      const response = await api.put(
        `${this.nameRoute}/${Number(documento)}`,
        payload,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // Alias para compatibilidad con código existente que use updateAdminPermissions
  async updateAdminPermissions(documento, data) {
    return this.updateAdmin(documento, data);
  }
}

export default new AdminServices();
