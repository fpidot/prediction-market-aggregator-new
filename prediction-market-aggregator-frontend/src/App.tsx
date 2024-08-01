import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import { AppDispatch, RootState } from './store';
import { checkAuthentication } from './store/adminSlice';
import { refreshAdminToken } from './services/auth';
import HomePage from './pages/HomePage';
import SubscribePage from './pages/SubscribePage';
import Login from './components/admin/Login';
import Dashboard from './components/Dashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContractManagement from './pages/admin/ContractManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import ThresholdManagement from './pages/admin/ThresholdManagement';
import PrivateRoute from './components/PrivateRoute';


const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  useEffect(() => {
    console.log('App - Is authenticated:', isAuthenticated);
    console.log('App - User:', user);
    console.log('App - Token exists:', !!token);
  }, [isAuthenticated, user, token]);

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