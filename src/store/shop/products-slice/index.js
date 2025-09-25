import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  productList: [], // Add this
  productDetails: null,
  status: "idle",
  error: null,
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
  'products/fetchProductDetails',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/product-details/${productId}`);
      console.log('fetchProductDetails response:', response.data);
      return response?.data?.data || {};
    } catch (error) {
      console.error('fetchProductDetails error:', error);
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
    });
}

});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
