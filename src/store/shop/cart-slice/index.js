// store/shop/cart-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  cartItems: [],
  isLoading: false,
};

// ✅ Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity }) => {
    try {
      const response = await api.post('/shop/cart/add', { userId, productId, quantity });
      return response?.data?.data || response?.data || []; // Fallback to response.data
    } catch (error) {
      console.error('addToCart API error:', error);
      throw error; // Let RTK handle rejection
    }
  }
);

// ✅ Fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    try {
      const response = await api.get(`/shop/cart/get/${userId}`);
      return response?.data?.data || [];
    } catch (error) {
      console.error("fetchCartItems API error:", error);
      return [];
    }
  }
);

// ✅ Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    try {
      const response = await api.delete(`/shop/cart/${userId}/${productId}`);
      return response?.data?.data || [];
    } catch (error) {
      console.error("deleteCartItem API error:", error);
      return [];
    }
  }
);

// ✅ Update cart quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    try {
      const response = await api.put("/shop/cart/update-cart", {
        userId,
        productId,
        quantity,
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error("updateCartQuantity API error:", error);
      return [];
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => { state.isLoading = true; })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCart.rejected, (state) => { state.isLoading = false; state.cartItems = []; })

      .addCase(fetchCartItems.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state) => { state.isLoading = false; state.cartItems = []; })

      .addCase(updateCartQuantity.pending, (state) => { state.isLoading = true; })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state) => { state.isLoading = false; state.cartItems = []; })

      .addCase(deleteCartItem.pending, (state) => { state.isLoading = true; })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state) => { state.isLoading = false; state.cartItems = []; });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
