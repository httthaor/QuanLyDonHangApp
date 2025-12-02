import axios from 'axios';

const api = axios.create({
  baseURL: 'https://c58x3567-8080.asse.devtunnels.ms/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;