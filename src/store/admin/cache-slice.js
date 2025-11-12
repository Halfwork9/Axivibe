import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const clearAnalyticsCache = createAsyncThunk(
  "admin/clearAnalyticsCache",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete("/api/admin/analytics/cache", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Error clearing cache" });
    }
  }
);
