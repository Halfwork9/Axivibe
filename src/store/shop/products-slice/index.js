import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  productList: [],
  productDetails: null,
  isLoading: false, // was 'status', use isLoading for clarity
  error: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });
    const result = await api.get(`/shop/products/get?${query}`);
    // Defensive: return array, or empty if missing
    return Array.isArray(result?.data?.data)
      ? result.data.data
      : [];
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/product-details/${productId}`);
      // Defensive: always return object
      return response?.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload && typeof action.payload === "object"
          ? action.payload
          : {};
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
