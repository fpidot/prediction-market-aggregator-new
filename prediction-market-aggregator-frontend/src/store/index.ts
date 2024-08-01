import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contractsReducer from './contractsSlice';
import adminReducer, { AdminState } from './adminSlice';

export const store = configureStore({
  reducer: {
    contracts: contractsReducer,
    admin: adminReducer
  }
});

console.log('Configured store:', store);
console.log('Store state:', store.getState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;