// store/admin/distributor-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api"; //  use centralized api

export const fetchAllDistributors = createAsyncThunk(
  "adminDistributors/fetchAll",
  async () => {
    const res = await api.get("/distributors");
    return res.data.data;
  }
);

export const updateDistributorStatus = createAsyncThunk(
  "adminDistributors/updateStatus",
  async ({ id, status }) => {
    const res = await api.put(`/distributors/${id}/status`, { status });
    return res.data.data;
  }
);

export const withdrawApplication = createAsyncThunk(
  "distributor/withdrawApplication",
  async (id, { getState }) => {
    const { auth } = getState();
    const token = auth?.user?.token;

    const res = await api.delete(`/distributors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }
);

const distributorSlice = createSlice({
  name: "adminDistributors",
  initialState: {
    distributorList: [],
    application: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDistributors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllDistributors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distributorList = action.payload || [];
      })
      .addCase(fetchAllDistributors.rejected, (state) => {
        state.isLoading = false;
        state.distributorList = [];
      })
      .addCase(withdrawApplication.fulfilled, (state) => {
        state.application = null;
      })
      .addCase(updateDistributorStatus.fulfilled, (state, action) => {
        const idx = state.distributorList.findIndex(
          (d) => d._id === action.payload._id
        );
        if (idx !== -1) {
          state.distributorList[idx] = action.payload;
        }
      });
  },
});

export default distributorSlice.reducer;
