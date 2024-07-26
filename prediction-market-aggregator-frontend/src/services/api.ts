import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('API_BASE_URL in api.ts:', API_BASE_URL);

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

export const fetchContracts = async () => {
  try {
    const response = await axiosInstance.get('/contracts');
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};

export const subscribeUser = async (phoneNumber: string, categories: string[], alertTypes: string[]) => {
  const url = `/subscription/subscribe`;
  console.log('Sending subscription request to:', API_BASE_URL + url);
  const response = await axiosInstance.post(url, { phoneNumber, categories, alertTypes });
  return response.data;
};

export const confirmSubscription = async (phoneNumber: string, confirmationCode: string) => {
  const response = await axiosInstance.post('/subscription/confirm', { phoneNumber, confirmationCode });
  return response.data;
};  

export const fetchDashboardMetrics = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

export const get = (url: string) => axiosInstance.get(url);
export const post = (url: string, data: any) => axiosInstance.post(url, data);
export const put = (url: string, data: any) => axiosInstance.put(url, data);
export const del = (url: string) => axiosInstance.delete(url);

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