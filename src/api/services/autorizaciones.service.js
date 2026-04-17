// src/api/services/autorizaciones.service.js
import { api } from "@/api/axios";
import { handleError } from "@/utils/error.handler";

const AutorizacionesService = {
  nameRoute: "/v1/autorizaciones-mensuales",
  nameRouteAdmin: "/v1/autorizaciones",

  async getAll(params = {}) {
    try {
      const response = await api.get(this.nameRoute, { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async create(data) {
    try {
      const response = await api.post(this.nameRoute, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async get(idpersona) {
    try {
      const response = await api.get(`${this.nameRoute}/changes`, {
        params: { IdPersona: idpersona },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async modify(idAutorizacion, idEstacionamiento, data) {
    try {
      const response = await api.put(
        `${this.nameRoute}/${idAutorizacion}/${idEstacionamiento}`,
        data,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getRules() {
    try {
      const response = await api.get(`${this.nameRoute}/reglas`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // CONFIGURACION DE AUTORIZACIONES
  async getBySede(IdEstacionamiento) {
    try {
      const response = await api.get(
        `${this.nameRoute}/sede/${IdEstacionamiento}`,
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async enableAutorizacion(IdEstacionamiento, Estado) {
    try {
      const response = await api.put(
        `${this.nameRoute}/habilitar-quincena/${IdEstacionamiento}`,
        { Estado },
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`${this.nameRoute}/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // ── Admin /v1/autorizaciones ───────────────────────────────────────

  // GET /v1/autorizaciones?page&limit&search&idSede
  async listar({ page = 1, limit = 10, search = '', idSede } = {}) {
    try {
      const params = { page, limit }
      if (search) params.search = search
      if (idSede) params.idSede = idSede
      const response = await api.get(this.nameRouteAdmin, { params })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  // GET /v1/autorizaciones/sede/{IdEstacionamiento}
  async listarPorSede(IdEstacionamiento) {
    try {
      const response = await api.get(`${this.nameRouteAdmin}/sede/${IdEstacionamiento}`)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  // PUT /v1/autorizaciones/habilitar-quincena/{IdEstacionamiento}
  async habilitarQuincena(IdEstacionamiento, Estado) {
    try {
      const response = await api.put(
        `${this.nameRouteAdmin}/habilitar-quincena/${IdEstacionamiento}`,
        { Estado },
      )
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

};

export default AutorizacionesService;
