// src/api/services/arqueos.service.js
import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class ReglasEstacionamientoServices {
    constructor() {
        this.nameRoute = "v1/reglas-estacionamiento";
    }

    async getEstacionamientoAcceso(idSede) {
        try {
            const response = await api.get(`${this.nameRoute}/pago/${idSede}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }


}

export default new ReglasEstacionamientoServices();
