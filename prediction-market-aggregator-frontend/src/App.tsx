import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './components/admin/Login';
import PrivateRoute from './components/PrivateRoute';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import SubscribePage from './pages/SubscribePage';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;