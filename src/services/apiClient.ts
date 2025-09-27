import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Helpful logging and a consistent error surface
    if (error?.response) {
      console.error('API error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
      return Promise.reject(error);
    }
    if (error?.request) {
      console.error('Network/CORS error (no response):', {
        url: error.config?.url,
      });
      return Promise.reject(new Error('Network error. Check server and CORS.'));
    }
    return Promise.reject(error);
  }
);
