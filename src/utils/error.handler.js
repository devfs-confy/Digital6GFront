import axios from "axios";
import { showError } from "@/utils/swal";

export function handleError(error, context = "") {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (context) console.error(`[${context}]`, status, data);
    else console.error("Ocurrió un error:", status, data);

    showError({ status, data });

    return { error: true, status, data };
  } else {
    console.error("Error desconocido", error);
    showError({});
  }
}
