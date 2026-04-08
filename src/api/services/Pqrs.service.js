import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class PqrsService {
  constructor() {
    this.nameRoute = "v1/pqrs/cliente";
    this.nameRouteAdmin = "v1/pqrs/admin";
  }

  // ── Cliente ───────────────────────────────────────────────

  async getMotivos() {
    try {
      const response = await api.get(`${this.nameRoute}/motivos`);
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return handleError(error);
    }
  }

  // src/api/services/pqrs.service.js
  async create(dto) {
    try {
      const isFormData = dto instanceof FormData;
      const response = await api.post(this.nameRoute, dto, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getMisPqrs(params = {}) {
    try {
      const response = await api.get(`${this.nameRoute}/mis-pqrs`, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data?.data ?? response.data ?? null;
    } catch (error) {
      return handleError(error);
    }
  }

  async getImagenesPqrs(id) {
    try {
      const response = await api.get(`${this.nameRoute}/imagen/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // ── Admin ─────────────────────────────────────────────────

  async getAllPqrs(params = {}) {
    try {
      const response = await api.get(`${this.nameRouteAdmin}`, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getDetailPqrs(id) {
    try {
      const response = await api.get(`${this.nameRouteAdmin}/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async responsePqrs(id, dto) {
    try {
      const response = await api.put(
        `${this.nameRouteAdmin}/${id}/responder`,
        dto,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async changeStatusPqrs(id, estado) {
    try {
      const response = await api.put(
        `${this.nameRouteAdmin}/${id}/estado/${estado}`,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async changePriorityPqrs(id, prioridad) {
    try {
      const response = await api.put(
        `${this.nameRouteAdmin}/${id}/prioridad/${prioridad}`,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async assignPqrsAdmin(dto) {
    try {
      const response = await api.post(`${this.nameRouteAdmin}/asignar`, dto); // ← post
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getHistorialAssignaciones(id) {
    try {
      const response = await api.get(
        `${this.nameRouteAdmin}/${id}/asignaciones`,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // ── Motivos admin ─────────────────────────────────────────

  async getAllMotivos() {
    try {
      const response = await api.get(`${this.nameRouteAdmin}/motivos/all`);
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return handleError(error);
    }
  }

  async createMotivo(dto) {
    try {
      const response = await api.post(`${this.nameRouteAdmin}/motivos`, dto);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async updateMotivo(id, dto) {
    try {
      const response = await api.put(
        `${this.nameRouteAdmin}/motivos/${id}`,
        dto,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new PqrsService();
