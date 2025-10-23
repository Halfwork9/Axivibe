// src/store/auth-slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://axivibe.onrender.com/api';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`, { withCredentials: true });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      return rejectWithValue(error.response?.data || 'Auth check failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google-login`, { token: credential }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Google login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ userName, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { userName, email, password }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Forgot password failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Reset password failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(checkAuth.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.isAuthenticated = true; })
      .addCase(checkAuth.rejected, (state, action) => { state.isLoading = false; state.isAuthenticated = false; state.user = null; state.error = action.payload; })
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.isAuthenticated = true; })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(loginWithGoogle.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginWithGoogle.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.isAuthenticated = true; })
      .addCase(loginWithGoogle.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.isAuthenticated = true; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(forgotPassword.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(forgotPassword.fulfilled, (state) => { state.isLoading = false; })
      .addCase(forgotPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(resetPassword.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state) => { state.isLoading = false; })
      .addCase(resetPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(logoutUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(logoutUser.fulfilled, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; })
      .addCase(logoutUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
