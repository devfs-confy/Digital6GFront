import axios from "axios";

export function handleError(error) {
    if(axios.isAxiosError(error)){
          // Captura el response data del error
      const status = error.response?.status
      const data = error.response?.data
      console.error('Ocurrió un error:', status, data)
      return { error: true, status, data }
    } else {
        console.error('Error desconocido', error)
    }
}