// src/store/shop/cart-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

// ✅ Normalize backend response safely
const normalizeCartResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data.cartItems)) return data.cartItems;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data)) return data;
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
  async ({ userId, productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(`/shop/cart/add`, { userId, productId, quantity });
      const normalized = normalizeCartResponse(res.data);

      // 🔁 Immediately refetch full cart for sync
      dispatch(fetchCartItems(userId));

      return normalized;
    } catch (err) {
      console.error("❌ addToCart error:", err);
      return rejectWithValue(err.response?.data || "Error adding item");
    }
  }
);

// ✅ Update quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/shop/cart/update`, { userId, productId, quantity });
      const normalized = normalizeCartResponse(res.data);

      // 🔁 Refetch after update for full consistency
      dispatch(fetchCartItems(userId));

      return normalized;
    } catch (err) {
      console.error("❌ updateCartQuantity error:", err);
      return rejectWithValue(err.response?.data || "Error updating quantity");
    }
  }
);

// ✅ Delete item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.delete(`/shop/cart/delete/${userId}/${productId}`);
      const normalized = normalizeCartResponse(res.data);

      // 🔁 Refetch after deletion
      dispatch(fetchCartItems(userId));

      return normalized;
    } catch (err) {
      console.error("❌ deleteCartItem error:", err);
      return rejectWithValue(err.response?.data || "Error removing item");
    }
  }
);

// ✅ Clear entire cart
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
        const payload = action.payload || [];

        if (Array.isArray(payload) && payload.some((i) => i.productId)) {
          state.cartItems = payload;
        } else {
          const newItem = Array.isArray(payload) ? payload[0] : payload;
          if (newItem && newItem.productId) {
            const existingIndex = state.cartItems.findIndex(
              (i) => i.productId === newItem.productId
            );
            if (existingIndex > -1) state.cartItems[existingIndex] = newItem;
            else state.cartItems.push(newItem);
          }
        }

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
        const payload = action.payload || [];

        if (Array.isArray(payload) && payload.some((i) => i.productId)) {
          state.cartItems = payload;
        } else {
          const updatedItem = Array.isArray(payload) ? payload[0] : payload;
          if (updatedItem && updatedItem.productId) {
            const index = state.cartItems.findIndex(
              (i) => i.productId === updatedItem.productId
            );
            if (index > -1) state.cartItems[index] = updatedItem;
          }
        }

        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑 Delete
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || [];
        if (Array.isArray(payload)) {
          state.cartItems = payload;
        } else {
          const deletedItem = Array.isArray(payload) ? payload[0] : payload;
          if (deletedItem && deletedItem.productId) {
            state.cartItems = state.cartItems.filter(
              (i) => i.productId !== deletedItem.productId
            );
          }
        }
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🧹 Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
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
