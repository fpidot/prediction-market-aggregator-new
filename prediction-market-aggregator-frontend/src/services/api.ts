import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const get = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

const post = async (url: string, data: any) => {
  const response = await axiosInstance.post(url, data);
  return response.data;
};

const put = async (url: string, data: any) => {
  const response = await axiosInstance.put(url, data);
  return response.data;
};

const del = async (url: string) => {
  const response = await axiosInstance.delete(url);
  return response.data;
};

export const fetchContracts = () => get('/contracts');
export const subscribeUser = (phoneNumber: string, categories: string[], alertTypes: string[]) => 
  post('/subscription/subscribe', { phoneNumber, categories, alertTypes });
export const confirmSubscription = (phoneNumber: string, confirmationCode: string) => 
  post('/subscription/confirm', { phoneNumber, confirmationCode });
export const fetchDashboardMetrics = () => get('/dashboard/metrics');

const api = {
  get,
  post,
  put,
  del,
  fetchContracts,
  subscribeUser,
  confirmSubscription,
  fetchDashboardMetrics,
};

export default api;