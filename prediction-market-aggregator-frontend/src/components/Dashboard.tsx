import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { selectAllContracts } from '../store/contractsSlice';
import { Box, Typography } from '@mui/material';
import api from '../services/api';

interface DashboardMetrics {
  totalSMS: number;
  totalSubscribers: number;
  activeSubscribers: number;
  recentSMS: Array<{ to: string; body: string; createdAt: string }>;
}

const Dashboard: React.FC = () => {
  const contracts = useSelector(selectAllContracts);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSMS: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
    recentSMS: [],
  });

  const fetchDashboardMetrics = useCallback(async () => {
    try {
      const response = await api.get('/admin/dashboard-metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    }
  }, []);


  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  const subscriberData = [
    { name: 'Active', value: metrics.activeSubscribers },
    { name: 'Inactive', value: metrics.totalSubscribers - metrics.activeSubscribers },
  ];

  return (
    <Box className="dashboard">
      <Typography variant="h4">Dashboard</Typography>
      <Box className="metrics-summary">
        <Typography>Total SMS Sent: {metrics.totalSMS}</Typography>
        <Typography>Total Subscribers: {metrics.totalSubscribers}</Typography>
        <Typography>Active Subscribers: {metrics.activeSubscribers}</Typography>
      </Box>
      <Box className="subscriber-chart" sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={subscriberData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box className="recent-sms">
        <Typography variant="h6">Recent SMS</Typography>
        <ul>
          {metrics.recentSMS.length > 0 ? (
            metrics.recentSMS.map((sms, index) => (
              <li key={index}>
                To: {sms.to}, Message: {sms.body}, Sent: {new Date(sms.createdAt).toLocaleString()}
              </li>
            ))
          ) : (
            <li>No recent SMS</li>
          )}
        </ul>
      </Box>
      <Box className="contracts-summary">
        <Typography variant="h6">Contracts Summary</Typography>
        <ul>
          {contracts.map((contract) => (
            <li key={contract._id}>
              {contract.name}: Current Price: {contract.currentPrice.toFixed(2)}
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default Dashboard;