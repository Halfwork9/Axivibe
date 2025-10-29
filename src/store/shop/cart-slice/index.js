import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

// ✅ Fetch Cart
export const fetchCartItems = createAsyncThunk(
  "shopCart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/shop/cart/get/${userId}`);
      return data.cartItems || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching cart");
    }
  }
);

// ✅ Add Item
export const addToCart = createAsyncThunk(
  "shopCart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/shop/cart/add", {
        userId,
        productId,
        quantity,
      });
      return data.cartItems || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error adding to cart");
    }
  }
);

// ✅ Update Qty
export const updateCartQuantity = createAsyncThunk(
  "shopCart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/shop/cart/update-cart", {
        userId,
        productId,
        quantity,
      });
      return data.cartItems || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating qty");
    }
  }
);

// ✅ Delete
export const deleteCartItem = createAsyncThunk(
  "shopCart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/shop/cart/${userId}/${productId}`);
      return data.cartItems || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error deleting item");
    }
  }
);

// ✅ Clear
export const clearCart = createAsyncThunk(
  "shopCart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/shop/cart/clear/${userId}`);
      return data.cartItems || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error clearing cart");
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shopCart",
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("shopCart/") && action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("shopCart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.isLoading = false;
          state.cartItems = action.payload || [];
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("shopCart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearCartLocal } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
