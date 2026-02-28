import { api } from "../axios";

class RolService {
  constructor() {
    this.rolesRoute = "v1/roles";
    this.permisosRoute = "v1/permisos";
    this.rolPermisoRoute = "v1/rol-permiso";
  }

  async getAll() {
    try {
      const response = await api.get(this.rolesRoute);
      return response.data;
    } catch (error) {
      console.error("RolService.getAll:", error);
    }
  }

  async getOne(id) {
    try {
      const response = await api.get(`${this.rolesRoute}/${id}`);
      return response.data;
    } catch (error) {
      console.error("RolService.getOne:", error);
    }
  }

  async create(dto) {
    try {
      const response = await api.post(this.rolesRoute, dto);
      return response.data;
    } catch (error) {
      console.error("RolService.create:", error);
    }
  }

  async getAllPermisos() {
    try {
      const response = await api.get(this.permisosRoute);
      return response.data;
    } catch (error) {
      console.error("RolService.getAllPermisos:", error);
    }
  }

  async getPermisosRol(idRol) {
    try {
      const response = await api.get(`${this.rolPermisoRoute}/${idRol}`);
      return response.data;
    } catch (error) {
      console.error("RolService.getPermisosRol:", error);
    }
  }

  async assignPermisos(dto) {
    try {
      const response = await api.put(this.rolPermisoRoute, dto);
      return response.data;
    } catch (error) {
      console.error("RolService.assignPermisos:", error);
    }
  }
}

export default new RolService();
