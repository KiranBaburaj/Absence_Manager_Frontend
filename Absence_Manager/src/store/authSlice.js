import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:8000/api';  // Adjust as necessary

// Utility function to load from localStorage safely
const loadFromLocalStorage = (key, defaultValue = null) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Async Thunks for Register and Login
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register/`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login/`, loginData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      id: localStorage.getItem('userId') || null,
      name: localStorage.getItem('userName') || null,
      email: localStorage.getItem('userEmail') || null, // Add email field
      role: localStorage.getItem('userRole') || null,   // Add role field
    },
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = {
        id: null,
        name: null,
        email: null,
        role: null,
      };
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail'); // Remove email from localStorage
      localStorage.removeItem('userRole');   // Remove role from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.user = {
          id: payload.user.id,
          name: payload.user.username,
          email: payload.user.email, // Save email on registration
          role: payload.user.role,    // Save role on registration
        };
        state.accessToken = payload.access;
        state.refreshToken = payload.refresh;
        state.loading = false;

        // Save user id, name, email, role, and tokens to localStorage
        localStorage.setItem('userId', payload.user.id);
        localStorage.setItem('userName', payload.user.username);
        localStorage.setItem('userEmail', payload.user.email); // Save email to localStorage
        localStorage.setItem('userRole', payload.user.role);    // Save role to localStorage
        localStorage.setItem('accessToken', payload.access);
        localStorage.setItem('refreshToken', payload.refresh);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = {
          id: payload.user.id,
          name: payload.user.username,
          email: payload.user.email, // Save email on login
          role: payload.user.role,    // Save role on login
        };
        state.accessToken = payload.access;
        state.refreshToken = payload.refresh;
        state.loading = false;

        // Save user id, name, email, role, and tokens to localStorage
        localStorage.setItem('userId', payload.user.id);
        localStorage.setItem('userName', payload.user.username);
        localStorage.setItem('userEmail', payload.user.email); // Save email to localStorage
        localStorage.setItem('userRole', payload.user.role);    // Save role to localStorage
        localStorage.setItem('accessToken', payload.access);
        localStorage.setItem('refreshToken', payload.refresh);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;