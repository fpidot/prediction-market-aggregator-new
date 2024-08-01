import { configureStore } from '@reduxjs/toolkit';
import contractsReducer from './contractsSlice';
import adminReducer from './adminSlice';

console.log('adminReducer:', adminReducer); // Add this line for debugging

export const store = configureStore({
  reducer: {
    contracts: contractsReducer,
    admin: adminReducer
  }
});

console.log('Configured store:', store);
console.log('Store state:', store.getState());
console.log('Store reducers:', store.getState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;