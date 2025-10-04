import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  productList: [],
  productDetails: null,
  isLoading: false,
  error: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({ ...filterParams, sortBy: sortParams });
    const result = await api.get(`/shop/products/get?${query}`);
    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/product-details/${productId}`);
      return response?.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ NEW: Thunk to add a review
export const addReviewToProduct = createAsyncThunk(
  'products/addReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      // This API path matches your backend route structure
      const response = await api.post(`/shop/products/${productId}/reviews`, { rating, comment });
      return response.data.data; // The backend returns the updated product
    } catch (error) {
      // Handle errors, e.g., not logged in
      return rejectWithValue(error.response?.data?.message || error.message);
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
      // Cases for fetching products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      // Cases for fetching product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      // ✅ NEW: Cases for adding a review
      .addCase(addReviewToProduct.pending, (state) => {
        state.isLoading = true; // You can add a loading state for the review form
      })
      .addCase(addReviewToProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // IMPORTANT: Update productDetails with the new data from the server
        state.productDetails = action.payload;
      })
      .addCase(addReviewToProduct.rejected, (state, action) => {
        state.isLoading = false;
        // Optionally store the error message to display in the UI
        state.error = action.payload;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
