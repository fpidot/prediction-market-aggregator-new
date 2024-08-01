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

export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
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
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/admin/login`, credentials);
    const { token, user } = response.data;
    console.log('Received token:', token);
    localStorage.setItem('adminToken', token);
    setAuthToken(token);
    console.log('Token set in localStorage:', localStorage.getItem('adminToken'));
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
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

export const checkAdminAuth = async (): Promise<boolean> => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    console.log('No token found in localStorage');
    return false;
  }

  logTokenContent(token); 

  try {
    console.log('Sending check-auth request with token:', token);
    const response = await axios.get<{ isAuthenticated: boolean }>(`${API_URL}/admin/check-auth`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Check-auth response:', response.data);
    return response.data.isAuthenticated;
  } catch (error) {
    console.error('Admin auth check failed:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response:', error.response?.data);
    }
    return false;
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