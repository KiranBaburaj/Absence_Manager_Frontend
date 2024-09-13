// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import employeesReducer from './slice/employeesSlice';
import leaveRequestsReducer from './slice/leaveslice/LeaveRequestSlice';
import leaveSummaryReducer from './slice/leaveslice/LeaveSummarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    leaveRequests: leaveRequestsReducer,
    leaveSummary:leaveSummaryReducer,
  },
});
