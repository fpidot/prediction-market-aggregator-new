import axios from 'axios';

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