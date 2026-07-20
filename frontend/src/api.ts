import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5248/api', // Será ajustado conforme a porta do backend
});

export default api;
