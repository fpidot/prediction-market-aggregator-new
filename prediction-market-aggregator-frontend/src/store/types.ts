import { ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from './index';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;