import axios from 'axios';


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

const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const subscribeUser = async (phoneNumber: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/subscribe`, { phoneNumber });
  return response.data;
};

export const unsubscribeUser = async (phoneNumber: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/unsubscribe`, { phoneNumber });
  return response.data;
};

export const adminLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/admin/login`, credentials);
  const { token, user } = response.data;
  localStorage.setItem('adminToken', token);
  setAuthToken(token);
  return { token, user };
};

export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  setAuthToken('');
};

export const checkAdminAuth = async (): Promise<boolean> => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    adminLogout(); // Ensure we're logged out if there's no token
    return false;
  }

  try {
    setAuthToken(token);
    const response = await axios.get(`${API_URL}/admin/check-auth`);
    return response.data.isAuthenticated;
  } catch (error) {
    console.error('Admin auth check failed:', error);
    adminLogout();
    return false;
  }
};

export const refreshAdminToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(`${API_URL}/admin/refresh-token`);
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