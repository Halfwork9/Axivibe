// src/store/admin/cache-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to clear cache
export const clearAnalyticsCache = createAsyncThunk(
  "admin/clearAnalyticsCache",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete("/admin/analytics/cache", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Error clearing cache" });
    }
  }
);

// Optional small slice to track cache clearing status
const cacheSlice = createSlice({
  name: "cache",
  initialState: {
    clearing: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clearAnalyticsCache.pending, (state) => {
        state.clearing = true;
        state.error = null;
        state.success = false;
      })
      .addCase(clearAnalyticsCache.fulfilled, (state) => {
        state.clearing = false;
        state.success = true;
      })
      .addCase(clearAnalyticsCache.rejected, (state, action) => {
        state.clearing = false;
        state.error = action.payload?.message || "Error clearing cache";
      });
  },
});

export default cacheSlice.reducer;
