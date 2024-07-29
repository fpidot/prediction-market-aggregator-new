import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import { RootState } from './store';
import AdminLayout from './components/admin/AdminLayout';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  React.useEffect(() => {
    console.log('App - Is authenticated:', isAuthenticated);
  }, [isAuthenticated]);
  return (
    <Container>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="contracts" element={<ContractManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="thresholds" element={<ThresholdManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Container>
  );
};

export default App;