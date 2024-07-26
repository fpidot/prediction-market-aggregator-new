import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDashboardMetrics } from '../services/api';

interface DashboardMetrics {
  totalSMS: number;
  totalSubscribers: number;
  activeSubscribers: number;
  recentSMS: Array<{ to: string; body: string; createdAt: string }>;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => console.log('WebSocket connected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.dashboardMetrics) {
          setMetrics(data.dashboardMetrics);
        }
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
      }
    };

    ws.onerror = (error) => console.error('WebSocket error:', error);

    ws.onclose = () => {
      console.log('WebSocket disconnected. Attempting to reconnect...');
      setTimeout(connectWebSocket, 3000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error('Error loading metrics:', err);
        setError('Failed to load dashboard metrics. Please try again later.');
      }
    };
    loadMetrics();

    const ws = connectWebSocket();

    return () => {
      ws.close();
    };
  }, [connectWebSocket]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!metrics) {
    return <div>Loading dashboard metrics...</div>;
  }

  const subscriberData = [
    { name: 'Active', value: metrics.activeSubscribers || 0 },
    { name: 'Inactive', value: (metrics.totalSubscribers || 0) - (metrics.activeSubscribers || 0) },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics-summary">
        <div>Total SMS Sent: {metrics.totalSMS || 0}</div>
        <div>Total Subscribers: {metrics.totalSubscribers || 0}</div>
        <div>Active Subscribers: {metrics.activeSubscribers || 0}</div>
      </div>
      <div className="subscriber-chart" style={{ width: '100%', height: 300 }}>
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
      </div>
      <div className="recent-sms">
        <h2>Recent SMS</h2>
        <ul>
          {metrics.recentSMS && metrics.recentSMS.length > 0 ? (
            metrics.recentSMS.map((sms, index) => (
              <li key={index}>
                To: {sms.to}, Message: {sms.body}, Sent: {new Date(sms.createdAt).toLocaleString()}
              </li>
            ))
          ) : (
            <li>No recent SMS</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;