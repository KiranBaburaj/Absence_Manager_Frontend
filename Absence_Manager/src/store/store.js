// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import employeesReducer from './slice/employeesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
  },
});
