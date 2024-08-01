import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const admin = useSelector((state: RootState) => state.admin);
  if (admin === null || admin === undefined) {
    console.error('Admin state is null or undefined');
    return <div>Error: Unable to access admin state</div>;
  }
  const isAuthenticated = admin?.isAuthenticated ?? false;
  const loading = admin?.loading ?? false;

  console.log('PrivateRoute - admin state:', admin);
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;