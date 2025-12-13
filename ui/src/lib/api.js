import axios from "axios";

// Ajuste a porta se necessário (seu backend roda na 5001)
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  // Tenta pegar token de Admin do localStorage
  const token = localStorage.getItem("token");
  
  // SÓ injeta o token do localStorage se a requisição já não tiver um Authorization
  // Isso protege o Forms.jsx que manda o token dele via config
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;