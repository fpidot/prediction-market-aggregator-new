import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { checkAdminAuth, refreshAdminToken, adminLogout } from '../services/auth';
import api from '../services/api';

console.log('adminSlice module loaded');

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Types
export interface Contract {
  _id: string;
  name: string;
  category: string;
  currentPrice: number;
}

export interface Settings {
  bigMoveThreshold: number;
  dailyUpdateTime: string;
  topContractsToDisplay: number;
  dataRefreshFrequency: {
    [key: string]: number;
  };
}

export interface Subscription {
  _id: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface Thresholds {
  hourlyThreshold: number;
  dailyThreshold: number;
}

export interface AdminState {
  contracts: Contract[];
  discoveryResults: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  subscriptions: Subscription[];
  thresholds: Thresholds;
  settings: Settings;
}

console.log('Initializing admin slice');

const initialState: AdminState = {
  contracts: [],
  discoveryResults: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  token: null,
  subscriptions: [],
  thresholds: { hourlyThreshold: 0, dailyThreshold: 0 },
  settings: {
    bigMoveThreshold: 0,
    dailyUpdateTime: '',
    topContractsToDisplay: 0,
    dataRefreshFrequency: {}
  }
};

// Async Thunks
export const login = createAsyncThunk(
  'admin/login',
  async ({ credentials, loginFunction }: { credentials: LoginCredentials; loginFunction: (cred: LoginCredentials) => Promise<AuthResponse> }, { rejectWithValue }) => {
    try {
      const response = await loginFunction(credentials);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'admin/logout',
  async (logoutFunction: () => void, { rejectWithValue }) => {
    try {
      await logoutFunction();
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const checkAuthentication = createAsyncThunk(
  'admin/checkAuth',
  async (checkAuthFunction: () => Promise<boolean>, { rejectWithValue }) => {
    try {
      const isAuthenticated = await checkAuthFunction();
      return isAuthenticated;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'admin/refreshToken',
  async (refreshTokenFunction: () => Promise<string | null>, { rejectWithValue }) => {
    try {
      const newToken = await refreshTokenFunction();
      return newToken;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchContracts = createAsyncThunk('admin/fetchContracts', async () => {
  const response = await api.get('/admin/contracts');
  return response.data;
});

export const createContract = createAsyncThunk('admin/createContract', async (contract: Partial<Contract>) => {
  const response = await api.post('/admin/contracts', contract);
  return response.data;
});

export const updateContract = createAsyncThunk('admin/updateContract', async (contract: Contract) => {
  const response = await api.put(`/admin/contracts/${contract._id}`, contract);
  return response.data;
});

export const deleteContract = createAsyncThunk(
  'admin/deleteContract',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/contracts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const fetchSubscriptions = createAsyncThunk('admin/fetchSubscriptions', async () => {
  const response = await api.get('/admin/subscriptions');
  return response.data;
});

export const updateSubscription = createAsyncThunk('admin/updateSubscription', async (subscription: Subscription) => {
  const response = await api.put(`/admin/subscriptions/${subscription._id}`, subscription);
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

export const fetchSettings = createAsyncThunk('admin/fetchSettings', async () => {
  const response = await api.get('/admin/settings');
  return response.data;
});

export const updateSettings = createAsyncThunk('admin/updateSettings', async (settings: Settings) => {
  const response = await api.put('/admin/settings', settings);
  return response.data;
});

export const triggerDiscovery = createAsyncThunk(
  'admin/triggerDiscovery',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/discovery/trigger');
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const manualDiscovery = createAsyncThunk(
  'admin/manualDiscovery',
  async ({ keyword, category }: { keyword?: string; category?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/discovery/manual', { params: { keyword, category } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      console.log('setAuthenticated reducer called with:', action.payload);
      state.isAuthenticated = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      console.log('loginSuccess reducer called');
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutSuccess: (state) => {
      console.log('logoutSuccess reducer called');
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
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
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuthentication.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthentication.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        state.loading = false;
      })
      .addCase(checkAuthentication.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.contracts = action.payload;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.contracts.push(action.payload);
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        const index = state.contracts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.contracts = state.contracts.filter(c => c._id !== action.payload);
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(fetchThresholds.fulfilled, (state, action) => {
        state.thresholds = action.payload;
      })
      .addCase(updateThresholds.fulfilled, (state, action) => {
        state.thresholds = action.payload;
      })
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch settings';
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update settings';
      })
      .addCase(triggerDiscovery.pending, (state) => {
        state.loading = true;
      })
      .addCase(triggerDiscovery.fulfilled, (state, action) => {
        state.loading = false;
        state.discoveryResults = action.payload;
      })
      .addCase(triggerDiscovery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(manualDiscovery.pending, (state) => {
        state.loading = true;
      })
      .addCase(manualDiscovery.fulfilled, (state, action) => {
        state.loading = false;
        state.discoveryResults = action.payload;
      })
      .addCase(manualDiscovery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAuthenticated, loginSuccess, logoutSuccess } = adminSlice.actions;

api.onUnauthorized = () => {
  import('../store').then((storeModule) => {
    storeModule.default.dispatch(logout(adminLogout));
    window.location.href = '/admin/login';
  });
};

export default adminSlice.reducer;