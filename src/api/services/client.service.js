// src/api/services/client.service.js
import { handleError } from "@/utils/error.handler";

import { api } from "../axios";

class ClientService {
  constructor() {
    this.nameRoute = "v1/usuarios/clientes";
  }

  // GET /v1/usuarios/clientes?sede={id} — admin, requiere VER-USUARIOS
  async getAllClients(params) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/usuarios/clientes — público, crear cliente
  async createClient(dto) {
    try {
      const response = await api.post(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/usuarios/clientes/with-codigo — público, crear con código de validación
  async createClientWithCodigo(dto) {
    try {
      const response = await api.post(`${this.nameRoute}/with-codigo`, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // PUT /v1/usuarios/clientes — cliente autenticado, actualiza su propio Email y Telefono
  async updateOwnProfile(dto) {
    try {
      const response = await api.put(this.nameRoute, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // PUT /v1/usuarios/clientes/{doc} — admin, actualiza Nombres/Apellidos/Email/Telefono/Estado
  async updateClientByDoc(doc, dto) {
    try {
      const response = await api.put(`${this.nameRoute}/${doc}`, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // PUT /v1/usuarios/clientes/{doc}/estado — admin, activa o inactiva, requiere INACTIVAR-USUARIOS
  async updateClientEstado(doc, estado) {
    try {
      const response = await api.put(`${this.nameRoute}/${doc}/estado`, {
        Estado: estado,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new ClientService();
