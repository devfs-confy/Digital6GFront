import { api } from "../axios";
import { handleError } from "@/utils/error.handler";

class AuthService {
  async sendCode(documento) {
    try {
      const response = await api.post("auth/forgot-password", { Documento: documento });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async verifyCode(documento, codigo) {
    try {
      const response = await api.post("/v1/auth/verify-code", { Documento: documento, Codigo: codigo });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async resetPassword(documento, codigo, newPassword) {
    try {
      const response = await api.post("/auth/reset-password", {
        Documento: documento,
        Codigo: codigo,
        NewPassword: newPassword,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new AuthService();
