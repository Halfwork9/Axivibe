import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};
// REGISTER
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await api.post(
      "/auth/register",
      formData,
      { withCredentials: true }
    );
    return response.data;
  }
);
// LOGIN
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await api.post(
      "/auth/login",
      formData,
      { withCredentials: true }
    );
    return response.data;
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await api.post(
    "/auth/logout",
    {},
    { withCredentials: true }
  );
  return response.data;
});

// ✅ Google Login Action
export const loginWithGoogle = createAsyncThunk(
  "auth/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google-login", { token: credential });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false, message: "Google login failed." });
    }
  }
);

// CHECK AUTH
export const checkAuth = createAsyncThunk("/auth/check-auth", async () => {
  const response = await api.get(
    "/auth/check-auth",
    {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
   initialState: { user: null, isLoggedIn: false },
  reducers: {
    // Remove unused args
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
  extraReducers: (builder) => {
    const handleAuthSuccess = (state, action) => {
      if (action.payload?.success) {
        state.user = action.payload.user;
        state.isLoggedIn = true;
      }
    };

    builder
      .addCase(loginUser.fulfilled, handleAuthSuccess)
      .addCase(loginWithGoogle.fulfilled, handleAuthSuccess); // ✅ Handle Google success
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
