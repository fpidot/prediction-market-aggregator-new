import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { checkAuthentication } from '../store/adminSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - loading:', loading);
  console.log('PrivateRoute - error:', error);
  console.log('PrivateRoute - current location:', location.pathname);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      console.log('Dispatching checkAuthentication');
      dispatch(checkAuthentication());
    }
  }, [dispatch, isAuthenticated, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Authentication error:', error);
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering children');
  return <>{children}</>;
};

export default PrivateRoute;