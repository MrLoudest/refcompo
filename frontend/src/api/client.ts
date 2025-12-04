import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL
});


