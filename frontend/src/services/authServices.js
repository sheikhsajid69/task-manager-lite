import { apiGet, apiPost } from '../api.js';

export const signup = async (payload) => apiPost('/auth/signup', payload);
export const login = async (payload) => apiPost('/auth/login', payload);
export const logoutRequest = async () => apiPost('/auth/logout', {});
export const fetchMe = async () => apiGet('/auth/me');

