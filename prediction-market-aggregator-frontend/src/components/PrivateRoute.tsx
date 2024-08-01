import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { checkAuthentication } from '../store/adminSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const adminState = useSelector((state: RootState) => state.admin);
  console.log('Admin state in PrivateRoute:', adminState);

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    console.log('PrivateRoute useEffect triggered');
    if (!adminState.isAuthenticated && !adminState.loading) {
      dispatch(checkAuthentication());
    }
  }, [dispatch, adminState.isAuthenticated, adminState.loading]);

  console.log('PrivateRoute - isAuthenticated:', adminState.isAuthenticated);
  console.log('PrivateRoute - loading:', adminState.loading);
  console.log('PrivateRoute - error:', adminState.error);
  console.log('PrivateRoute - current location:', location.pathname);

  if (adminState.loading) {
    return <div>Loading...</div>;
  }

  if (adminState.error) {
    console.error('Authentication error:', adminState.error);
    return <div>Error: {adminState.error}</div>;
  }

  if (!adminState.isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering children');
  return <>{children}</>;
};

export default PrivateRoute;