import { api } from "../axios";

class RolService {
  constructor() {
    this.rolesRoute = "v1/roles";
    this.permisosRoute = "v1/permisos";
    this.rolPermisoRoute = "v1/rol-permiso";
  }

  // Obtener todos los roles (1-8, etc.)
  async getAll() {
    const { data } = await api.get(this.rolesRoute);
    return data;
  }

  // Obtener el catálogo completo de permisos disponibles
  async getAllPermisos() {
    const { data } = await api.get(this.permisosRoute);
    return data;
  }

  // Obtener permisos de la "plantilla" del rol
  async getPermisosRol(idRol) {
    const { data } = await api.get(`${this.rolPermisoRoute}/${idRol}`);
    return data;
  }

  // ASIGNAR A ROL: Solo usar si quieres cambiar el permiso globalmente
  async assignPermisos(idRol, permisosIds) {
    try {
      const response = await api.put(this.rolPermisoRoute, {
        IdRol: parseInt(idRol),
        Permisos: permisosIds,
      });
      return response.data;
    } catch (error) {
      console.error(
        "RolService.assignPermisos:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

export default new RolService();
