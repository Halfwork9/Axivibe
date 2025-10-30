// src/store/shop/cart-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

// ✅ Normalize backend response safely
const normalizeCartResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data.cartItems)) return data.cartItems;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

// ✅ Fetch all items
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

// ✅ Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      console.log("Adding to cart:", { userId, productId, quantity });
      const res = await api.post(`/shop/cart/add`, { userId, productId, quantity });
      console.log("Add to cart response:", res.data);
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("❌ addToCart error:", err);
      return rejectWithValue(err.response?.data || "Error adding item");
    }
  }
);

// ✅ Update cart quantity
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

// ✅ Remove a product - Fixed the URL path
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      console.log("Deleting cart item:", { userId, productId });
      // Changed from /shop/cart/delete/:userId/:productId to /shop/cart/delete/:userId/:productId
      const res = await api.delete(`/shop/cart/delete/${userId}/${productId}`);
      console.log("Delete cart item response:", res.data);
      return normalizeCartResponse(res.data);
    } catch (err) {
      console.error("❌ deleteCartItem error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error config:", err.config);
      return rejectWithValue(err.response?.data || "Error removing item");
    }
  }
);

// ✅ Clear full cart
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

// ✅ Slice
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
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🛒 Add
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Update
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ Delete
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ Clear
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
