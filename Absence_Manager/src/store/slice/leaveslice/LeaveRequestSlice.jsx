import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // Adjust as necessary

// Async thunk for fetching leave requests
export const fetchLeaveRequests = createAsyncThunk(
    'leaveRequests/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken; // Use accessToken from auth slice
        
        try {
            const response = await axios.get(`${API_URL}/leave-requests/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Async thunk for creating a new leave request
export const createLeaveRequest = createAsyncThunk(
    'leaveRequests/create',
    async (leaveRequestData, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken;

        try {
            const response = await axios.post(`${API_URL}/leave-requests/`, leaveRequestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Async thunk for editing a leave request
export const editLeaveRequest = createAsyncThunk(
    'leaveRequests/edit',
    async ({ leaveRequestId, leaveRequestData }, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken;

        try {
            const response = await axios.put(`${API_URL}/leave-requests/${leaveRequestId}/`, leaveRequestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Async thunk for deleting a leave request
export const deleteLeaveRequest = createAsyncThunk(
    'leaveRequests/delete',
    async (leaveRequestId, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken;

        try {
            await axios.delete(`${API_URL}/leave-requests/${leaveRequestId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return leaveRequestId; // Return the ID for removal from state
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const leaveRequestsSlice = createSlice({
    name: 'leaveRequests',
    initialState: {
        leaveRequests: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaveRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.leaveRequests = action.payload;
            })
            .addCase(fetchLeaveRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createLeaveRequest.fulfilled, (state, action) => {
                state.leaveRequests.push(action.payload);
            })
            .addCase(editLeaveRequest.fulfilled, (state, action) => {
                const updatedRequest = action.payload;
                const index = state.leaveRequests.findIndex(request => request.id === updatedRequest.id);
                if (index !== -1) {
                    state.leaveRequests[index] = updatedRequest; // Update the specific leave request
                }
            })
            .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
                const leaveRequestId = action.payload;
                state.leaveRequests = state.leaveRequests.filter(request => request.id !== leaveRequestId);
            });
    },
});

// Selectors
export const selectAllLeaveRequests = (state) => state.leaveRequests.leaveRequests;

// Export the reducer
export default leaveRequestsSlice.reducer;