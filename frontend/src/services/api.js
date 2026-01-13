import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export const getRequests = (city = '') => {
  return api.get('/requests', { params: { city } });
};

export const getCities = () => {
  return api.get('/requests/cities');
};

export const createRequest = (data) => {
  return api.post('/requests', data);
};

export const updateRequest = (id, data) => {
  return api.put(`/requests/${id}`, data);
};

export default api;
