import { api } from "../axios";
class SedesSerivce {
  constructor() {
    this.nameRoute = "v1/sedes";
  }

  async getAll(params) {
    try {
      const response = await api.get(`${this.nameRoute}`, { params });

      return response.data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new SedesSerivce();
