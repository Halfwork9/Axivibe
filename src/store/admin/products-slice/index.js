import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  isLoading: false,
  productList: [],
  pagination: null, // ✅ added pagination
};

export const addNewProduct = createAsyncThunk(
  "adminProducts/addNewProduct",
  async (formData) => {
    const result = await api.post("/admin/products/add", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "adminProducts/fetchAllProducts",
  async ({ page = 1, limit = 20, categoryId = "", brandId = "", isOnSale = "" } = {}) => {
    const query = new URLSearchParams({
      page,
      limit,
      ...(categoryId && { categoryId }),
      ...(brandId && { brandId }),
      ...(isOnSale && { isOnSale }),
    }).toString();

    const result = await api.get(`/admin/products/get?${query}`, { withCredentials: true });
    return result.data;
  }
);

export const editProduct = createAsyncThunk(
  "adminProducts/editProduct",
  async ({ id, formData }) => {
    const result = await api.put(`/admin/products/edit/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id) => {
    const result = await api.delete(`/admin/products/delete/${id}`);
    return result?.data;
  }
);

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
        state.pagination = action.payload.pagination || null; // ✅ pagination handled here
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default adminProductsSlice.reducer;
