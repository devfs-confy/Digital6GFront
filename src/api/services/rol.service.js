import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class RolService {
  constructor() {
    this.rolesRoute = "v1/roles";
    this.permisosRoute = "v1/permisos";
    this.rolPermisoRoute = "v1/rol-permiso";
  }

  async getAll() {
    try {
      const { data } = await api.get(this.rolesRoute);
      return data;
    } catch (error) {
      handleError(error, "RolService.getAll");
    }
  }

  async getAllPermisos() {
    try {
      const { data } = await api.get(this.permisosRoute);
      return data;
    } catch (error) {
      handleError(error, "RolService.getAllPermisos");
    }
  }

  async getPermisosRol(idRol) {
    try {
      const { data } = await api.get(`${this.rolPermisoRoute}/${idRol}`);
      return data;
    } catch (error) {
      handleError(error, "RolService.getPermisosRol");
    }
  }

  async assignPermisos(idRol, permisosIds) {
    try {
      const { data } = await api.put(this.rolPermisoRoute, {
        IdRol: parseInt(idRol),
        Permisos: permisosIds,
      });
      return data;
    } catch (error) {
      handleError(error, "RolService.assignPermisos");
    }
  }
}

export default new RolService();
