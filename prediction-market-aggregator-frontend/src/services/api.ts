import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface CustomAxiosInstance extends AxiosInstance {
  onUnauthorized?: () => void;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = axiosInstance as CustomAxiosInstance;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Instead of dispatching an action, we'll use a callback
      if (api.onUnauthorized) {
        api.onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

api.onUnauthorized = () => {};

export const submitSubscription = async (subscriptionData: {
  phoneNumber: string;
  categories: string[];
  alertTypes: string[];
}) => {
  try {
    const response = await api.post('/subscriptions/subscribe', subscriptionData);
    return response.data;
  } catch (error) {
    console.error('Error submitting subscription:', error);
    throw error;
  }
};

export const confirmSubscription = async (confirmationData: {
  phoneNumber: string;
  confirmationCode: string;
}) => {
  try {
    const response = await api.post('/subscriptions/confirm', confirmationData);
    return response.data;
  } catch (error) {
    console.error('Error confirming subscription:', error);
    throw error;
  }
};

export const fetchContracts = async () => {
  try {
    const response = await api.get('/contracts');
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};

export const fetchSubscriptions = async () => {
  try {
    const response = await api.get('/subscriptions');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', (error as AxiosError).response?.data || (error as Error).message);
    throw error;
  }
};

export const loginAdmin = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', (error as AxiosError).response?.data || (error as Error).message);
    throw error;
  }
};

export const fetchDashboardMetrics = async () => {
  try {
    const response = await api.get('/admin/dashboard-metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', (error as AxiosError).response?.data || (error as Error).message);
    throw error;
  }
};

export default api;