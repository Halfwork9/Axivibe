import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  brandList: [],
  status: "idle",
  error: null,
  isLoading: false,
};

// Create a new brand
export const createBrand = createAsyncThunk(
  "admin/brands/createBrand",
  async ({ name, icon }) => {
    const response = await api.post("/admin/brands", {
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
    const response = await api.get("/admin/brands");
    return response.data;
  }
);

export const deleteBrand = createAsyncThunk(
  'adminBrands/deleteBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/brands/${brandId}`);
      return brandId; // Return the ID on success
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editBrand = createAsyncThunk(
  "admin/brands/editBrand",
  async ({ id, formData }) => {
    const response = await api.put(`/admin/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
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
      })
    .addCase(editBrand.fulfilled, (state, action) => {
  const updated = action.payload?.data;
  if (updated) {
    const index = state.brandList.findIndex((b) => b._id === updated._id);
    if (index !== -1) state.brandList[index] = updated;
  }
});
    
  },
});

export default brandSlice.reducer;




