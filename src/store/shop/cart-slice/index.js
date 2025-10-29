import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// ✅ Helper to normalize responses
const normalizeCartResponse = (data) => data?.cartItems || data?.data || [];

// 🛒 Fetch Cart Items
export const fetchCartItems = createAsyncThunk(
  "shopCart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/shop/cart/get/${userId}`);
      return normalizeCartResponse(data);
    } catch (err) {
      console.error("❌ fetchCartItems error:", err);
      return rejectWithValue(err.response?.data || "Error fetching cart");
    }
  }
);

// ➕ Add Item to Cart
export const addToCart = createAsyncThunk(
  "shopCart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/shop/cart/add`, { userId, productId, quantity });
      return normalizeCartResponse(data);
    } catch (err) {
      console.error("❌ addToCart error:", err);
      return rejectWithValue(err.response?.data || "Error adding item");
    }
  }
);

// 🔄 Update Quantity
export const updateCartQuantity = createAsyncThunk(
  "shopCart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/shop/cart/update`, { userId, productId, quantity });
      return normalizeCartResponse(data);
    } catch (err) {
      console.error("❌ updateCartQuantity error:", err);
      return rejectWithValue(err.response?.data || "Error updating quantity");
    }
  }
);

// ❌ Remove from Cart
export const removeFromCart = createAsyncThunk(
  "shopCart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/shop/cart/remove/${userId}/${productId}`);
      return normalizeCartResponse(data);
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
      return rejectWithValue(err.response?.data || "Error removing item");
    }
  }
);

// 🧹 Clear Cart
export const clearCart = createAsyncThunk(
  "shopCart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/shop/cart/clear/${userId}`);
      return normalizeCartResponse(data);
    } catch (err) {
      console.error("❌ clearCart error:", err);
      return rejectWithValue(err.response?.data || "Error clearing cart");
    }
  }
);

const shopCartSlice = createSlice({
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
      // ✅ Fetch
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

      // ✅ Add
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })

      // ✅ Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })

      // ✅ Remove Item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })

      // ✅ Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      });
  },
});

export const { resetCart } = shopCartSlice.actions;
export default shopCartSlice.reducer;
