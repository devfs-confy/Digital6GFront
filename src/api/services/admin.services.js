// src/api/services/admin.services.js
import { api } from "../axios";

class AdminServices {
  constructor() {
    this.nameRoute = "v1/usuarios/admin";
  }

  async getAllAdmins(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      console.error("AdminServices.getAllAdmins:", error);
      throw error;
    }
  }

  /**
   * ACTUALIZACIÓN INDIVIDUAL (Solución al dilema de permisos)
   * Según la imagen, existe un PUT en /v1/usuarios/admin/{Documento}
   */
  async updateAdminPermissions(documento, data) {
    try {
      const docNum = Number(documento);
      const response = await api.put(`${this.nameRoute}/${docNum}`, data);
      return response.data;
    } catch (error) {
      console.error(
        "Error en la respuesta del servidor:",
        error.response?.data,
      );
      throw error;
    }
  }

  async createAdmin(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      console.error("AdminServices.createAdmin:", error);
      throw error;
    }
  }
}

export default new AdminServices();
