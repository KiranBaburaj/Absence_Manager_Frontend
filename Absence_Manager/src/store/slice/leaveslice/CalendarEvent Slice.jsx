import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Async thunk for fetching calendar events
export const fetchCalendarEvents = createAsyncThunk(
    'calendarEvents/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken;

        try {
            const response = await axios.get(`${API_URL}/calendar-events/`, {
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

// Async thunk for creating a new calendar event
export const createCalendarEvent = createAsyncThunk(
    'calendarEvents/create',
    async (eventData, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken;

        try {
            const response = await axios.post(`${API_URL}/calendar-events/`, eventData, {
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

const calendarEventsSlice = createSlice({
    name: 'calendarEvents',
    initialState: {
        events: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCalendarEvents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.events = action.payload;
            })
            .addCase(fetchCalendarEvents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createCalendarEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            });
    },
});

// Selectors
export const selectAllCalendarEvents = (state) => state.calendarEvents.events;

// Export the reducer
export default calendarEventsSlice.reducer;