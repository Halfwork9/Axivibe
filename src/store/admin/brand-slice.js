import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  brandList: [],
  isLoading: false,
};

// Create a new brand
export const createBrand = createAsyncThunk(
  "admin/brands/createBrand",
  async ({ name, icon }) => {
    const response = await axios.post("http://localhost:5000/api/admin/brands", {
      name,
      icon,
    });
    return response.data;
  }
);

// Fetch all brands
export const fetchAllBrands = createAsyncThunk(
  "admin/brands/fetchAllBrands",
  async () => {
    const response = await axios.get("http://localhost:5000/api/admin/brands");
    return response.data;
  }
);

export const deleteBrand = createAsyncThunk(
  'adminBrands/deleteBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/brands/${brandId}`);
      return brandId; // Return the ID on success
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const brandSlice = createSlice({
  name: "adminBrands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create brand
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success && action.payload?.data) {
          state.brandList.push(action.payload.data);
        }
      })
      .addCase(createBrand.rejected, (state) => {
        state.isLoading = false;
      })

      // Fetch brands
      .addCase(fetchAllBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = action.payload?.data || [];
      })
      .addCase(fetchAllBrands.rejected, (state) => {
        state.isLoading = false;
        state.brandList = [];
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brandList = state.brandList.filter(
          (brand) => brand._id !== action.payload
        );
      });
  },
});

export default brandSlice.reducer;
