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

export const fetchTasks = async (params = {}) => {
  const query = buildQuery(params);
  const response = await apiGet(`/tasks${query ? `?${query}` : ''}`);

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
export const fetchTaskById = async (taskId) => apiGet(`/tasks/${taskId}`);

export const createTask = async (taskData) => apiPost('/tasks', taskData);

export const updateTask = async (taskId, updates) => apiPatch(`/tasks/${taskId}`, updates);

export const deleteTask = async (taskId) => apiDelete(`/tasks/${taskId}`);
