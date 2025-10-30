import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const normalizeCartResponse = (data) =>
  data?.cartItems && Array.isArray(data.cartItems)
    ? data.cartItems
    : data?.data || [];

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/shop/cart/get/${userId}`);
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("❌ fetchCartItems error:", err);
      return rejectWithValue(err.response?.data || "Error fetching cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/shop/cart/add`, { userId, productId, quantity });
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("❌ addToCart error:", err);
      return rejectWithValue(err.response?.data || "Error adding item");
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/shop/cart/update`, { userId, productId, quantity });
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("❌ updateCartQuantity error:", err);
      return rejectWithValue(err.response?.data || "Error updating quantity");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/shop/cart/remove/${userId}/${productId}`);
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
      return rejectWithValue(err.response?.data || "Error removing item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/shop/cart/clear/${userId}`);
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("❌ clearCart error:", err);
      return rejectWithValue(err.response?.data || "Error clearing cart");
    }
  }
);

const cartSlice = createSlice({
  name: "shopCart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
