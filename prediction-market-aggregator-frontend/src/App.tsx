import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { store } from './store';
import HomePage from './pages/HomePage';
import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';

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
              </Routes>
            </Box>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;