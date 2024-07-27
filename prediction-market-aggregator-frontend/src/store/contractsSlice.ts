import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchContracts } from '../services/api';


export interface Contract {
  _id: string;
  name: string;
  currentPrice: number;
  oneHourChange: number;
  twentyFourHourChange: number;
  category: string;
}

interface ContractsState {
  items: Contract[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ContractsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchContractsAsync = createAsyncThunk(
  'contracts/fetchContracts',
  async () => {
    const response = await fetchContracts();
    return response;
  }
);

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    updateContracts: (state, action: PayloadAction<Contract[]>) => {
      console.log('Updating contracts in Redux store:', action.payload);
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
      } else {
        console.error('Invalid payload for updateContracts:', action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContractsAsync.fulfilled, (state, action: PayloadAction<Contract[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchContractsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { updateContracts } = contractsSlice.actions;
export default contractsSlice.reducer;

export const selectAllContracts = (state: { contracts: ContractsState }) => state.contracts.items;
export const selectContractsStatus = (state: { contracts: ContractsState }) => state.contracts.status;
export const selectContractsError = (state: { contracts: ContractsState }) => state.contracts.error;