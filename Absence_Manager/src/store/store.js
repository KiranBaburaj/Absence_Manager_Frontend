// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import employeesReducer from './slice/employeesSlice';
import leaveRequestsReducer from './slice/leaveslice/LeaveRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    leaveRequests: leaveRequestsReducer,
  },
});
