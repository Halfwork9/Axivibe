import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await api.get(
      `/shop/products/get?${query}`
    );

    console.log(result);

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await api.get(
      `/shop/products/get/${id}`
    );

    return result?.data;
  }
);

export const addReviewToProduct = createAsyncThunk(
  'products/addReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/shop/products/${productId}/reviews`, {
        rating,
        comment,
      });
      // The backend should return the fully updated product details
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not submit review.');
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
      state.productList = action.payload.data;
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
      state.productDetails = action.payload.data;
    })
    .addCase(fetchProductDetails.rejected, (state) => {
      state.isLoading = false;
      state.productDetails = null;
    })
    .addCase(addReviewToProduct.pending, (state) => {
        state.isLoading = true; // Or a specific loading state like 'isReviewLoading'
      })
      .addCase(addReviewToProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // Replace the product details with the updated version from the server
        state.productDetails = action.payload;
      })
      .addCase(addReviewToProduct.rejected, (state, action) => {
        state.isLoading = false;
        // Optionally handle the error message
        state.error = action.payload;
      });
}

});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
