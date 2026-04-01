import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

const BASE_CLIENT = "v1/mensualidades/clientes";
const BASE_ADMIN = "v1/mensualidades/admin";

class MensualidadesService {
  // ── Cliente ───────────────────────────────────────────────

  // GET /v1/mensualidades/clientes/mis-mensualidades
  async getMisMensualidades() {
    try {
      const { data } = await api.get(`${BASE_CLIENT}/mis-mensualidades`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/mensualidades/clientes/mis-mensualidades/{id}
  // 404 si no existe o no pertenece al usuario autenticado
  async getMiMensualidadById(id) {
    try {
      const { data } = await api.get(`${BASE_CLIENT}/mis-mensualidades/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/mensualidades/clientes/cambio-placas
  // Body: { IdPersonaAutorizada, Detalles: [{ ColumnaPlaca, PlacaNueva }] }
  // 202 sin body | 400 tipo incompatible | 404 no encontrada | 409 límite mensual o placa duplicada
  async cambiarPlacas(payload) {
    const { data } = await api.post(`${BASE_CLIENT}/cambio-placas`, payload);
    return data;
  }

  // POST /v1/mensualidades/clientes/cambio-autorizacion
  // Body: { IdPersonaAutorizada, Placas, Email?, IdentificacionCliente?, Telefono? }
  // 200 con datos de pago si es upgrade (moto→carro) | 200 aplicado si es downgrade (carro→moto)
  // 400 validación fallida | 404 persona no encontrada | 409 placas duplicadas
  // mensualidades.service.js
  async cambiarAutorizacion({ IdPersonaAutorizada, Placas }) {
    const { data } = await api.post(`${BASE_CLIENT}/cambio-autorizacion`, {
      IdPersonaAutorizada,
      Placas,
    });
    return data;
  }

  // GET /v1/autorizaciones-mensuales/changes?IdPersona={id}
  // 200 con autorización actual y complementaria
  // GET /v1/autorizaciones-mensuales/changes?IdPersona={id}
  async getChangesByPersona(idPersona) {
    const { data } = await api.get("v1/autorizaciones-mensuales/changes", {
      params: { IdPersona: idPersona },
    });
    return data;
  }

  // GET /v1/mensualidades/clientes/congelamientos/{idPersona}
  // 400 si no existe la persona autorizada
  async getCongelamiento(idPersona) {
    try {
      const { data } = await api.get(
        `${BASE_CLIENT}/congelamientos/${idPersona}`,
      );
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /v1/mensualidades/clientes/congelamientos/{idPersona}
  // Body: { FechaInicioPeriodoNvo: ISO date-time, Observacion }
  // 201 sin body | 400 no se puede congelar | 409 congelamiento activo solapado
  async crearCongelamiento(idPersona, { FechaInicioPeriodoNvo, Observacion }) {
    try {
      const { data } = await api.post(
        `${BASE_CLIENT}/congelamientos/${idPersona}`,
        {
          FechaInicioPeriodoNvo: new Date(FechaInicioPeriodoNvo).toISOString(),
          Observacion,
        },
      );
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // ── Admin ─────────────────────────────────────────────────

  // GET /v1/mensualidades/admin?sede={id}&page&limit&search
  // sede es obligatorio — 400 si no se envía | 403 sin permiso VER-MENSUALIDADES
  async getAllBySede({ sede, page = 1, limit = 10, search = "" } = {}) {
    try {
      const params = { sede, page, limit };
      if (search) params.search = search;
      const { data } = await api.get(BASE_ADMIN, { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/mensualidades/admin/detalle/{id}
  // 403 sin permiso | 404 no encontrada
  async getDetalleById(id) {
    try {
      const { data } = await api.get(`${BASE_ADMIN}/detalle/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /v1/mensualidades/admin/api-sede/{idsede}/{documento}
  // Consulta directa a la API local de la sede vía gateway
  // 404 si la persona no existe en la sede
  async getDesdeApiSede(idsede, documento) {
    try {
      const { data } = await api.get(
        `${BASE_ADMIN}/api-sede/${idsede}/${documento}`,
      );
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // PUT /v1/mensualidades/admin/{id}
  // Body: todos los campos opcionales — NombreApellidos, IdAutorizacion, Nit,
  //       NombreEmpresa, Placa1-5, Estado, FechaInicio, FechaFin
  // Fechas en formato "YYYY-MM-DD HH:mm:ss"
  // 403 sin permiso | 404 no encontrada
  async updateById(id, dto) {
    try {
      const { data } = await api.put(`${BASE_ADMIN}/${id}`, dto);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new MensualidadesService();
