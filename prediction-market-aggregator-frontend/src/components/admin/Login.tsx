import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { login } from '../../store/adminSlice';
import { RootState, AppDispatch } from '../../store';
import { adminLogin } from '../../services/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.admin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit function called');
    try {
      console.log('Attempting login with:', { email, password: '[REDACTED]' });
      const resultAction = await dispatch(login({ credentials: { email, password }, loginFunction: adminLogin }));
      console.log('Login result action:', resultAction);
      if (login.fulfilled.match(resultAction)) {
        console.log('Login successful');
        console.log('Current Redux State:', JSON.stringify(dispatch(state => state), null, 2));
      } else if (login.rejected.match(resultAction)) {
        console.error('Login failed:', resultAction.error);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to /admin/dashboard');
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;