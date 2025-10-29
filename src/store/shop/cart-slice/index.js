import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";
import { toast } from "@/components/ui/use-toast";

// 🧠 Thunk: Fetch all cart items for the logged-in user
export const fetchCartItems = createAsyncThunk(
  "shopCart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User not logged in");
      const { data } = await api.get(`/shop/cart/get/${userId}`);
      if (data?.success) return data.data.cartItems || [];
      throw new Error(data?.message || "Failed to fetch cart items");
    } catch (error) {
      console.error("❌ fetchCartItems error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 🛒 Thunk: Add item to cart
export const addToCart = createAsyncThunk(
  "shopCart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/shop/cart/add`, {
        userId,
        productId,
        quantity,
      });
      if (data?.success) {
        toast({ title: "Added to cart successfully" });
        return data.data;
      }
      throw new Error(data?.message || "Failed to add to cart");
    } catch (error) {
      console.error("❌ addToCart error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ♻️ Thunk: Update quantity
export const updateCartQuantity = createAsyncThunk(
  "shopCart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/shop/cart/update`, {
        userId,
        productId,
        quantity,
      });
      if (data?.success) return data.data;
      throw new Error(data?.message || "Failed to update quantity");
    } catch (error) {
      console.error("❌ updateCartQuantity error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 🗑️ Thunk: Delete cart item
export const deleteCartItem = createAsyncThunk(
  "shopCart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/shop/cart/delete`, {
        data: { userId, productId },
      });
      if (data?.success) return productId;
      throw new Error(data?.message || "Failed to delete item");
    } catch (error) {
      console.error("❌ deleteCartItem error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 🧹 Thunk: Clear all cart items
export const clearCart = createAsyncThunk(
  "shopCart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/shop/cart/clear/${userId}`);
      if (data?.success) return [];
      throw new Error(data?.message || "Failed to clear cart");
    } catch (error) {
      console.error("❌ clearCart error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Slice
const cartSlice = createSlice({
  name: "shopCart",
  initialState: {
    cartItems: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload) {
          const existing = state.cartItems.find(
            (item) => item.productId === action.payload.productId
          );
          if (!existing) {
            state.cartItems.push(action.payload);
          } else {
            existing.quantity = action.payload.quantity;
          }
        }
      })

      // Update
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.cartItems.findIndex(
            (item) => item.productId === action.payload.productId
          );
          if (index > -1) {
            state.cartItems[index].quantity = action.payload.quantity;
          }
        }
      })

      // Delete
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.productId !== action.payload
        );
      })

      // Clear
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
