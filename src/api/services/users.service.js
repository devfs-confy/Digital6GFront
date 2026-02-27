import { api } from "../axios";
class UsersService {
  constructor() {
    this.nameRoute = "v1/usuarios";
  }

  async getAllClients(params) {
    try {
      const response = await api.get(`${this.nameRoute}/clientes`, { params });

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UsersService();
  