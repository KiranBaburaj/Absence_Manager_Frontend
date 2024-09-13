import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Async thunk for fetching leave summary
export const fetchLeaveSummary = createAsyncThunk(
    'leaveSummary/fetch',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken;

        try {
            const response = await axios.get(`${API_URL}/leave-summary/`, {
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

const leaveSummarySlice = createSlice({
    name: 'leaveSummary',
    initialState: {
        summary: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaveSummary.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLeaveSummary.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.summary = action.payload;
            })
            .addCase(fetchLeaveSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Selector
export const selectLeaveSummary = (state) => state.leaveSummary.summary;

// Export the reducer
export default leaveSummarySlice.reducer;