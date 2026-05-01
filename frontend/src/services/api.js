import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const analyzeAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze-audio/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeText = async (text) => {
  const response = await api.post('/analyze-text/', { text });
  return response.data;
};

export const calculateRisk = async (audio_score, text_score) => {
  const response = await api.post('/calculate-risk/', { audio_score, text_score });
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get('/alerts/');
  return response.data;
};

export const createAlert = async (alert) => {
  const response = await api.post('/alerts/', alert);
  return response.data;
};

export const getReports = async () => {
  const response = await api.get('/reports/');
  return response.data;
};

export const createReport = async (report) => {
  const response = await api.post('/reports/', report);
  return response.data;
};

export default api;
