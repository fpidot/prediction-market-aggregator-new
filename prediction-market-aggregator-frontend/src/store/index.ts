import { configureStore } from '@reduxjs/toolkit';
import contractsReducer from './contractsSlice';
import adminReducer, { AdminState } from './adminSlice';

console.log('adminReducer in store:', adminReducer);

if (!adminReducer) {
  console.error('adminReducer is undefined. Check the import from ./adminSlice');
}

const fallbackAdminState: AdminState = {
  contracts: [],
  discoveryResults: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  token: null,
  subscriptions: [],
  thresholds: {},
  settings: {}
};

const fallbackAdminReducer = (state: AdminState = fallbackAdminState) => state;

export const store = configureStore({
  reducer: {
    contracts: contractsReducer,
    admin: adminReducer || fallbackAdminReducer,
  },
});


console.log('Configured store:', store);
console.log('Store state:', store.getState());
console.log('Admin reducer in store:', store.getState().admin);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;