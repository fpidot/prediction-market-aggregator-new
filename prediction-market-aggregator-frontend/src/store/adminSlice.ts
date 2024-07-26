import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';



export interface Contract {
    _id: string;
    name: string;
    description: string;
    category: string;
    currentPrice: number;
    outcomes: {
      name: string;
      price: number;
    }[];
    displayOutcomes: number;
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


export const fetchContracts = createAsyncThunk('admin/fetchContracts', async () => {
    const response = await api.get('/admin/contracts');
    return response.data;
  });
  
  export const createContract = createAsyncThunk('admin/createContract', 
    async (contractData: Omit<Contract, 'id'>) => {
      const response = await api.post('/admin/contracts', contractData);
      return response.data;
    }
  );
  
  export const updateContract = createAsyncThunk('admin/updateContract', 
  async ({ _id, ...contractData }: Contract) => {
    const response = await api.put(`/admin/contracts/${_id}`, contractData);
    return response.data;
  }
);
  
  export const deleteContract = createAsyncThunk('admin/deleteContract', 
    async (id: string) => {
      await api.del(`/admin/contracts/${id}`);
      return id;
    }
  );
  
  export const fetchSubscriptions = createAsyncThunk('admin/fetchSubscriptions', async () => {
    const response = await api.get('/admin/subscriptions');
    return response.data;
  });
  
  export const updateSubscription = createAsyncThunk('admin/updateSubscription', 
  async ({ _id, ...subscriptionData }: Subscription) => {
    const response = await api.put(`/admin/subscriptions/${_id}`, subscriptionData);
    return response.data;
  }
);
  
  export const fetchThresholds = createAsyncThunk('admin/fetchThresholds', async () => {
    const response = await api.get('/admin/thresholds');
    return response.data;
  });
  
  export const updateThresholds = createAsyncThunk('admin/updateThresholds', 
    async (thresholdData: Thresholds) => {
      const response = await api.put('/admin/thresholds', thresholdData);
      return response.data;
    }
  );

interface AdminState {
  contracts: Contract[];
  subscriptions: Subscription[];
  thresholds: Thresholds;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  contracts: [],
  subscriptions: [],
  thresholds: { hourlyThreshold: 0, dailyThreshold: 0 },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add cases for each async thunk
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContracts.fulfilled, (state, action: PayloadAction<Contract[]>) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
    // Add similar cases for other async thunks
  },
});

export default adminSlice.reducer;