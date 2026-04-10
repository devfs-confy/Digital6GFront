import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class PublicidadService {
  constructor() {
    this.nameRoute = "v1/publicidad";
  }

  // GET /v1/publicidad - Solo para admin, devuelve toda la publicidad
  async getallPublicidad() {
    try {
      const { data } = await api.get(`${this.nameRoute}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/publicidad - Solo para admin, crea una nueva publicidad
  async createPublicidad(payload) {
    try {
      const { data } = await api.post(`${this.nameRoute}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // PATCH /v1/publicidad/{id} - Solo para admin, actualiza una publicidad existente

  async updatePublicidad(id, payload) {
    try {
      const { data } = await api.patch(`${this.nameRoute}/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // PATCH /v1/publicidad/{id}/estacionamiento/{idEstacionamiento} - Solo para admin, actualiza una publicidad existente
  async enablePublicidad(id, idEstacionamiento) {
    try {
      const { data } = await api.patch(
        `${this.nameRoute}/${id}/estacionamiento/${idEstacionamiento}`,
      );
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getimgpublicidad(id) {
    try {
      const { data } = await api.get(`${this.nameRoute}/imagen/${id}`);
      return data; // ← sin responseType: 'blob'
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/publicidad/mi-publicidad
  // Publicidad para el usuario logueado
  async getMiPublicidad() {
    try {
      const { data } = await api.get(`${this.nameRoute}/mi-publicidad`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new PublicidadService();
