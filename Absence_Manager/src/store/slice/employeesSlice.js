import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // Adjust as necessary

// Async thunk for fetching employees by department
export const fetchEmployeesByDepartment = createAsyncThunk(
    'employees/fetchByDepartment',
    async (departmentId, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.accessToken; // Use accessToken from auth slice
        
        // Log the token before sending the request
        console.log("Token being used for request:", token);

        try {
            const response = await axios.get(`${API_URL}/departments/${departmentId}/employees/`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data); // Handle error response
        }
    }
);

const employeesSlice = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeesByDepartment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployeesByDepartment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add fetched employees to the state
                state.employees = action.payload;
            })
            .addCase(fetchEmployeesByDepartment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Use the payload for the error message
            });
    },
});

// Selectors
export const selectAllEmployees = (state) => state.employees.employees;

// Export the reducer
export default employeesSlice.reducer;