import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

// Helper function to get token
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // or Clerk session if using Clerk
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const initialState = {
  brandList: [],
  status: "idle",
  error: null,
};

// Fetch All Brands
export const fetchAllBrands = createAsyncThunk(
  "adminBrands/fetchAllBrands",
  async () => {
    const response = await api.get("/admin/brands");
    return response.data.data;
  }
);

// ✅ Create Brand with Token
export const createBrand = createAsyncThunk(
  "adminBrands/createBrand",
  async (formData) => {
    const response = await api.post("/admin/brands", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    });
    return response.data;
  }
);

// ✅ Edit Brand with Token
export const editBrand = createAsyncThunk(
  "adminBrands/editBrand",
  async ({ id, formData }) => {
    const response = await api.put(`/admin/brands/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    });
    return response.data;
  }
);

// Delete Brand
export const deleteBrand = createAsyncThunk(
  "adminBrands/deleteBrand",
  async (id) => {
    await api.delete(`/admin/brands/${id}`, {
      headers: getAuthHeader(),
    });
    return id;
  }
);

const brandSlice = createSlice({
  name: "adminBrands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.brandList = action.payload;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        if (action.payload.success) state.brandList.push(action.payload.data);
      })
      .addCase(editBrand.fulfilled, (state, action) => {
        if (action.payload.success) {
          const index = state.brandList.findIndex(
            (b) => b._id === action.payload.data._id
          );
          if (index !== -1) state.brandList[index] = action.payload.data;
        }
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brandList = state.brandList.filter(
          (b) => b._id !== action.payload
        );
      });
  },
});

export default brandSlice.reducer;
