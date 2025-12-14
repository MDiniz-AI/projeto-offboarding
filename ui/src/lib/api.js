// src/lib/api.js

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
    
  // 1. Verifica se a requisição JÁ possui um cabeçalho de Autorização (o token do usuário/Form.jsx)
  const existingAuth = config.headers.Authorization;
  
  // 2. Se a requisição NÃO tiver um cabeçalho de Autorização,
  //    tenta injetar o token de Admin do localStorage.
  if (!existingAuth) {
    const adminToken = localStorage.getItem("token");
    
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;