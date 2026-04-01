import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

const UrlBase = "v1/notificaciones";

class NotificacionesService {
  async GetNotifiaciones() {
    try {
      const { data } = await api.get(`${UrlBase}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  async GetNotifiacionesById(id) {
    try {
      const { data } = await api.get(`${UrlBase}/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new NotificacionesService();
