import { apiDelete, apiGet, apiPatch, apiPost } from '../api.js';

const buildQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const fetchUsers = async (params = {}) => {
  const query = buildQuery(params);
  const response = await apiGet(`/users${query ? `?${query}` : ''}`);

  if (Array.isArray(response)) {
    return {
      items: response,
      pagination: {
        page: 1,
        limit: response.length || 10,
        totalItems: response.length,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
      },
    };
  }

  return {
    items: response?.items || [],
    pagination: response?.pagination || {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasPrevPage: false,
      hasNextPage: false,
    },
  };
};
export const fetchUserById = async (userId) => apiGet(`/users/${userId}`);

export const createUser = async (userData) => apiPost('/users', userData);
export const updateUser = async (userId, updates) => apiPatch(`/users/${userId}`, updates);

export const deleteUser = async (userId) => apiDelete(`/users/${userId}`);
