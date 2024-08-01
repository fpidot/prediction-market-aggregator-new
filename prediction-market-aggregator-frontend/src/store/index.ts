import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contractsReducer from './contractsSlice';
import adminReducer, { AdminState } from './adminSlice';

console.log('adminReducer imported:', adminReducer);

const initialAdminState: AdminState = {
  contracts: [],
  discoveryResults: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  token: null,
  subscriptions: [],
  thresholds: {
    hourlyThreshold: 0,
    dailyThreshold: 0
  },
  settings: {
    bigMoveThreshold: 0,
    dailyUpdateTime: '',
    topContractsToDisplay: 0,
    dataRefreshFrequency: {}
  }
};

export const store = configureStore({
  reducer: {
    contracts: contractsReducer,
    admin: adminReducer
  },
  preloadedState: {
    admin: initialAdminState
  }
});

console.log('Configured store:', store);
console.log('Store state:', store.getState());
console.log('Admin reducer in store:', store.getState().admin);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;