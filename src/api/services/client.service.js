// src/api/services/users.services.js
import { api } from "../axios";

class UsersService {
  constructor() {
    this.nameRoute = "v1/usuarios/clientes";
  }

  async getAllClients(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      console.error("UsersService.getAllClients:", error);
      throw error;
    }
  }

  // POST /v1/usuarios/clientes — crear cliente
  async createClient(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      console.error("UsersService.createClient:", error);
      throw error;
    }
  }

  // POST /v1/usuarios/clientes/with-codigo — crear cliente con código de verificación
  async createClientWithCodigo(dto) {
    try {
      const response = await api.post(`${this.nameRoute}/with-codigo`, dto);
      return response.data;
    } catch (error) {
      console.error("UsersService.createClientWithCodigo:", error);
      throw error;
    }
  }
}

export default new UsersService();
