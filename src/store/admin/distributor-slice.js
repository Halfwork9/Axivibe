// store/admin/distributor-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllDistributors = createAsyncThunk(
  "adminDistributors/fetchAll",
  async () => {
    const res = await axios.get("http://localhost:5000/api/distributors");
    return res.data.data;
  }
);

export const updateDistributorStatus = createAsyncThunk(
  "adminDistributors/updateStatus",
  async ({ id, status }) => {
    const res = await axios.put(
      `http://localhost:5000/api/distributors/${id}/status`,
      { status }
    );
    return res.data.data;
  }
);

export const withdrawApplication = createAsyncThunk(
  "distributor/withdrawApplication",
  async (id, { getState }) => {
    const { auth } = getState();
    console.log("DEBUG TOKEN:", auth?.user?.token); // 👈 add this
    const token = auth?.user?.token;

    const res = await fetch(`http://localhost:5000/api/distributors/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include", // 👈 also send cookies
    });

    return await res.json();
  }
);


const distributorSlice = createSlice({
  name: "adminDistributors",
  initialState: {
    distributorList: [],
    application: null, // <-- added so withdraw can clear it
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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

      // Withdraw
      .addCase(withdrawApplication.fulfilled, (state) => {
        state.application = null; // ✅ clear withdrawn app
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
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
