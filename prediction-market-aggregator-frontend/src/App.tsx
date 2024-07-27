import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import HomePage from './pages/HomePage';
import SubscribePage from './pages/SubscribePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './components/admin/Login';
import PrivateRoute from './components/PrivateRoute';
import ContractManagement from './pages/admin/ContractManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import ThresholdManagement from './pages/admin/ThresholdManagement';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/contracts"
          element={
            <PrivateRoute>
              <ContractManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/subscriptions"
          element={
            <PrivateRoute>
              <SubscriptionManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/thresholds"
          element={
            <PrivateRoute>
              <ThresholdManagement />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Container>
  );
};

export default App;