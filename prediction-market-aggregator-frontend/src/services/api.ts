import axios from 'axios';
import { getToken } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('API_BASE_URL in api.ts:', API_BASE_URL);

export const fetchContracts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};

export const subscribeUser = async (phoneNumber: string, categories: string[], alertTypes: string[]) => {
  const url = `${API_BASE_URL}/subscription/subscribe`;
  console.log('Sending subscription request to:', url);
  const response = await axios.post(`${API_BASE_URL}/subscription/subscribe`, { phoneNumber, categories, alertTypes });
  return response.data;
};

export const confirmSubscription = async (phoneNumber: string, confirmationCode: string) => {
  const response = await axios.post(`${API_BASE_URL}/subscription/confirm`, { phoneNumber, confirmationCode });
  return response.data;
};  

export const fetchDashboardMetrics = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/metrics');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

const instance = axios.create({
  baseURL: API_BASE_URL, // adjust this as needed
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const get = (url: string) => instance.get(url);
export const post = (url: string, data: any) => instance.post(url, data);
export const put = (url: string, data: any) => instance.put(url, data);
export const del = (url: string) => instance.delete(url);

const api = {
  get,
  post,
  put,
  del
};

export default api;