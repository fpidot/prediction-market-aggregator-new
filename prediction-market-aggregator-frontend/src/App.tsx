import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { store } from './store';
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContractManagement from './pages/admin/ContractManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import ThresholdManagement from './pages/admin/ThresholdManagement';
import Login from './components/admin/Login';
import PrivateRoute from './components/PrivateRoute';
import logo from './logo.svg';
import './App.css';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <header className="App-header" style={{ height: '20vh', minHeight: 'auto' }}>
              <img src={logo} className="App-logo" alt="logo" style={{ height: '10vmin' }} />
            </header>
            <Box mt={4} style={{ padding: '20px' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/login" element={<Login />} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute>
                      <AdminLayout>
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                          <Route path="contracts" element={<ContractManagement />} />
                          <Route path="subscriptions" element={<SubscriptionManagement />} />
                          <Route path="thresholds" element={<ThresholdManagement />} />
                        </Routes>
                      </AdminLayout>
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;