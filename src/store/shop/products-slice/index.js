// src/store/shop-products-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  productList: [],
  productDetails: null,

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },

  listLoading: false,       // ✔ separate loader for product list
  detailsLoading: false,    // ✔ separate loader for product details
  reviewSubmitting: false,  // ✔ separate loader for reviews

  error: null,
};

/**
 * 🛒 Fetch all products (cached, sorted, paginated)
 */
export const fetchShopProducts = createAsyncThunk(
  "shopProducts/fetchAll",
  async (
    { filterParams = {}, sortParams = "", page = 1, limit = 20 } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
        page,
        limit,
      });

      const response = await api.get(`/shop/products/get?${params.toString()}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 📦 Fetch single product details (cached)
 */
export const fetchProductDetails = createAsyncThunk(
  "shopProducts/fetchDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/products/product-details/${productId}`);
      return response?.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * ⭐ Add Review (Auto-updates productDetails)
 */
export const addReviewToProduct = createAsyncThunk(
  "shopProducts/addReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/shop/products/${productId}/reviews`, {
        rating,
        comment,
      });

      return response.data.data; // The updated product returned by backend
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
      // 🟦 Product list fetch
      .addCase(fetchShopProducts.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchShopProducts.fulfilled, (state, action) => {
        state.listLoading = false;

        state.productList = action.payload?.data || [];

        state.pagination = action.payload?.pagination || {
          page: 1,
          limit: 20,
          total: action.payload?.data?.length || 0,
        };
      })
      .addCase(fetchShopProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      // 🟩 Product details fetch
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.productDetails = null;
        state.error = action.payload;
      })

      // 🟨 Add Review
      .addCase(addReviewToProduct.pending, (state) => {
        state.reviewSubmitting = true;
      })
      .addCase(addReviewToProduct.fulfilled, (state, action) => {
        state.reviewSubmitting = false;
        state.productDetails = action.payload; // Updated product with review
      })
      .addCase(addReviewToProduct.rejected, (state, action) => {
        state.reviewSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails } = shopProductsSlice.actions;
export default shopProductsSlice.reducer;
