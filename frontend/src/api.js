import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'task_manager_token';

let authToken = localStorage.getItem(TOKEN_KEY) || '';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const unwrap = (response) => response.data;

const normalizeError = (error) => {
  if (typeof error.response?.data === 'string') return new Error(error.response.data);
  if (error.response?.data?.message) return new Error(error.response.data.message);
  if (error.message) return new Error(error.message);
  return new Error('Request failed.');
};

const apiRequest = async (request) => {
  try {
    const response = await request;
    return unwrap(response);
  } catch (error) {
    throw normalizeError(error);
  }
};

export const setAuthToken = (token) => {
  authToken = token || '';
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || '';

export const apiGet = (path) => apiRequest(apiClient.get(path));
export const apiPost = (path, body) => apiRequest(apiClient.post(path, body));
export const apiPatch = (path, body) => apiRequest(apiClient.patch(path, body));
export const apiDelete = (path) => apiRequest(apiClient.delete(path));
