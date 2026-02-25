import { api } from "../axios";
class AdminServices {
  constructor() {
    this.nameRoute = "v1/usuarios/admin";
  }

  async getAllClients(params) {
    try {
      const response = await api.get(`${this.nameRoute}`, { params });

      console.log("Hola", response);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new AdminServices();
