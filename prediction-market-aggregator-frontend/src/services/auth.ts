import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Token set in axios defaults:', axios.defaults.headers.common['Authorization']);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    console.log('Token removed from axios defaults');
  }
};

export const subscribeUser = async (phoneNumber: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/subscribe`, { phoneNumber });
    return response.data;
  } catch (error) {
    console.error('User subscription failed:', error);
    throw error;
  }
};

export const unsubscribeUser = async (phoneNumber: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/unsubscribe`, { phoneNumber });
    return response.data;
  } catch (error) {
    console.error('User unsubscription failed:', error);
    throw error;
  }
};

export const adminLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('adminLogin function called');
  try {
    console.log('Sending login request to:', `${API_URL}/admin/login`);
    const response = await axios.post<AuthResponse>(`${API_URL}/admin/login`, credentials);
    console.log('Login response:', response.data);
    const { token, user } = response.data;
    console.log('Received token:', token);
    localStorage.setItem('adminToken', token);
    setAuthToken(token);
    console.log('Token set in localStorage:', localStorage.getItem('adminToken'));
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
      console.error('Axios error status:', error.response?.status);
    }
    throw error;
  }
};

export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  setAuthToken('');
};

const logTokenContent = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
  }
};

export const checkAdminAuth = async (): Promise<{ isAuthenticated: boolean; user: any | null }> => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    console.log('No token found in localStorage');
    return { isAuthenticated: false, user: null };
  }

  console.log('Token found in localStorage:', token);
  setAuthToken(token);

  try {
    console.log('Sending check-auth request');
    const response = await axios.get<{ isAuthenticated: boolean; user: any }>(`${API_URL}/admin/check-auth`);
    console.log('Check-auth response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Admin auth check failed:', error);
    localStorage.removeItem('adminToken');
    setAuthToken('');
    return { isAuthenticated: false, user: null };
  }
};

export const refreshAdminToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post<{ token: string }>(`${API_URL}/admin/refresh-token`);
    const { token } = response.data;
    localStorage.setItem('adminToken', token);
    setAuthToken(token);
    return token;
  } catch (error) {
    console.error('Admin token refresh failed:', error);
    adminLogout();
    return null;
  }
};