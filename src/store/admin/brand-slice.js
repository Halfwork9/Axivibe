import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  brandList: [],
  status: "idle",
  error: null,
};

// Thunks
export const fetchAllBrands = createAsyncThunk(
  "adminBrands/fetchAllBrands",
  async () => {
    const response = await api.get("/admin/brands");
    return response.data.data;
  }
);

export const createBrand = createAsyncThunk(
  "adminBrands/createBrand",
  async (formData) => {
    const response = await api.post("/admin/brands", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

// ✅ NEW: Thunk for editing a brand
export const editBrand = createAsyncThunk(
  "adminBrands/editBrand",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/brands/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // returns { success, data, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const deleteBrand = createAsyncThunk(
  "adminBrands/deleteBrand",
  async (id) => {
    await api.delete(`/admin/brands/${id}`);
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
        if (action.payload.success) {
          state.brandList.push(action.payload.data);
        }
      })
      // ✅ NEW: Handle edit success
      .addCase(editBrand.fulfilled, (state, action) => {
  if (action.payload?.success && action.payload?.data) {
    const updated = action.payload.data;
    const idx = state.brandList.findIndex(b => b._id === updated._id);
    if (idx !== -1) {
      state.brandList[idx] = updated;
    }
  }
})
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brandList = state.brandList.filter(
          (brand) => brand._id !== action.payload
        );
      });
  },
});

export default brandSlice.reducer;

