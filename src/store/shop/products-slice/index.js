import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  productList: [],
  productDetails: null,
  pagination: null,
  isLoading: false,
  error: null,
};

/**
 * 🛒 Fetch all products with filters, sort, pagination
 */
export const fetchShopProducts = createAsyncThunk(
  "shopProducts/fetchAll",
  async ({ filterParams = {}, sortParams = "", page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
        page,
        limit,
      }).toString();

      const response = await api.get(`/shop/products/get?${params}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 📦 Fetch single product details
 */
export const fetchProductDetails = createAsyncThunk(
  "shopProducts/fetchDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/products/product-details/${productId}`);
      return response?.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * ⭐ Add review to a product
 */
export const addReviewToProduct = createAsyncThunk(
  "shopProducts/addReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/shop/products/${productId}/reviews`, {
        rating,
        comment,
      });
      return response.data.data; // Backend returns updated product
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const shopProductsSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟦 Fetch all products
      .addCase(fetchShopProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShopProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
        state.pagination = action.payload?.pagination || null;
      })
      .addCase(fetchShopProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload;
      })

      // 🟩 Fetch single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = action.payload;
      })

      // 🟨 Add review
      .addCase(addReviewToProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReviewToProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload; // update with new review
      })
      .addCase(addReviewToProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails } = shopProductsSlice.actions;
export default shopProductsSlice.reducer;
