import api from './api';

export const login = async (username: string, password: string) => {
  const response = await api.post('/admin/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
};

export const getToken = () => {
  return localStorage.getItem('adminToken');
};

export const isAuthenticated = () => {
  return !!getToken();
};