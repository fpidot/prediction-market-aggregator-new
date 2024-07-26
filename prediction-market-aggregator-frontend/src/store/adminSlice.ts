import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminLogin, adminLogout, checkAdminAuth, refreshAdminToken, AuthResponse } from '../services/auth';
import api from '../services/api';

export interface Contract {
    id: string;
    _id: string;
    name: string;
    category: string;
    currentPrice: number;
    // Add other contract properties
  }
  
  export interface Subscription {
    id: string;
    _id: string;
    phoneNumber: string;
    isActive: boolean;
  }
  
  export interface Thresholds {
    hourlyThreshold: number;
    dailyThreshold: number;
  }
  
  interface AdminState {
    user: AuthResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    contracts: Contract[];
    subscriptions: Subscription[];
    thresholds: Thresholds | null;
  }

  const initialState: AdminState = {
    user: null,
    token: localStorage.getItem('adminToken'),
    isAuthenticated: false,
    loading: false,
    error: null,
    contracts: [],
    subscriptions: [],
    thresholds: null,
  };

export const login = createAsyncThunk(
  'admin/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await adminLogin(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk('admin/logout', async () => {
  adminLogout();
});

export const checkAuthentication = createAsyncThunk('admin/checkAuth', async () => {
  const isAuthenticated = await checkAdminAuth();
  return isAuthenticated;
});

export const refreshAuthToken = createAsyncThunk('admin/refreshToken', async () => {
  const newToken = await refreshAdminToken();
  return newToken;
});

export const fetchContracts = createAsyncThunk('admin/fetchContracts', async () => {
    const response = await api.get('/admin/contracts');
    return response.data;
  });
  
  export const createContract = createAsyncThunk('admin/createContract', async (contract: Partial<Contract>) => {
    const response = await api.post('/admin/contracts', contract);
    return response.data;
  });
  
  export const updateContract = createAsyncThunk('admin/updateContract', async (contract: Contract) => {
    const response = await api.put(`/admin/contracts/${contract.id}`, contract);
    return response.data;
  });
  
  export const deleteContract = createAsyncThunk('admin/deleteContract', async (id: string) => {
    await api.delete(`/admin/contracts/${id}`);
    return id;
  });
  
  export const fetchSubscriptions = createAsyncThunk('admin/fetchSubscriptions', async () => {
    const response = await api.get('/admin/subscriptions');
    return response.data;
  });
  
  export const updateSubscription = createAsyncThunk('admin/updateSubscription', async (subscription: Subscription) => {
    const response = await api.put(`/admin/subscriptions/${subscription.id}`, subscription);
    return response.data;
  });
  
  export const fetchThresholds = createAsyncThunk('admin/fetchThresholds', async () => {
    const response = await api.get('/admin/thresholds');
    return response.data;
  });
  
  export const updateThresholds = createAsyncThunk('admin/updateThresholds', async (thresholds: Thresholds) => {
    const response = await api.put('/admin/thresholds', thresholds);
    return response.data;
  });

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuthentication.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
        
      })
      
      ;
      
  },
});

export default adminSlice.reducer;