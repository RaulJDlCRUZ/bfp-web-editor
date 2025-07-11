import axios from "axios";

const BASE_BACKEND_URI = import.meta.env.VITE_BACKEND_BS_URI;
const MAX_TIME = 60000; // 60 segundos

if (!BASE_BACKEND_URI) {
  console.error("Error: VITE_BACKEND_URI no está definido en el entorno.");
}

// Mi instancia base de Axios para recursos estáticos
const baseInstance = axios.create({
  baseURL: BASE_BACKEND_URI,
  timeout: MAX_TIME,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // CORS
  },
});

export default baseInstance;
