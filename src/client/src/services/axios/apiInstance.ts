import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const MAX_TIME = 60000; // 60 segundos

if (!BACKEND_URI) {
  console.error("Error: VITE_BACKEND_URI no está definido en el entorno.");
}

// Mi instancia base de Axios para peticiones a la API del backend
const apiInstance = axios.create({
  baseURL: BACKEND_URI,
  timeout: MAX_TIME,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // CORS
  },
});

export default apiInstance;