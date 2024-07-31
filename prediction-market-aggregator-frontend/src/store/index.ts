import { configureStore } from '@reduxjs/toolkit';
import contractsReducer from './contractsSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    contracts: contractsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;