import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import { RootState, AppDispatch } from './store';
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
  const admin = useSelector((state: RootState) => state.admin);
  const isAuthenticated = admin?.isAuthenticated ?? false;

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  useEffect(() => {
    console.log('App - Is authenticated:', isAuthenticated);
    console.log('App - Admin state:', admin);
    console.log('App - Token exists:', !!admin?.token);
  }, [isAuthenticated, admin]);

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