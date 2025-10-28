// src/store/auth-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api"; // ✅ axios instance with baseURL + withCredentials

// Update the checkAuth function
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/check-auth", {
        withCredentials: true,
        // Add timeout to prevent hanging
        timeout: 5000,
      });
      return res.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Not authenticated");
      }
      return rejectWithValue(error.response?.data?.message || "Auth check failed");
    }
  }
);

// --- EMAIL + PASSWORD LOGIN ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", payload, { withCredentials: true });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.user; // ✅ only return clean user object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// --- GOOGLE LOGIN ---
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/google-login", { token });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Google login failed");
    }
  }
);

// --- REGISTER USER ---
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ userName, email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", { userName, email, password });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.user || null; // backend returns only message for register
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// --- FORGOT PASSWORD ---
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Forgot password failed");
    }
  }
);

// --- RESET PASSWORD ---
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset password failed");
    }
  }
);

// --- LOGOUT ---
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/logout");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

// --- INITIAL STATE ---
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// --- SLICE ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
  state.isLoading = false;
  state.user = null;
  state.isAuthenticated = false;
  if (action.payload !== "Not authenticated") {
    state.error = action.payload;
  }
})

      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Register
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
