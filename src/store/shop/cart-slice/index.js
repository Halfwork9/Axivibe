import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  cartItems: [],
  isLoading: false,
};

// ADD TO CART
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await api.post("/shop/cart/add", {
      userId,
      productId,
      quantity,
    });

    // ✅ Defensive fallback
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }
);

// FETCH CART ITEMS
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await api.get(`/shop/cart/get/${userId}`);
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }
);

// DELETE CART ITEM
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await api.delete(`/shop/cart/${userId}/${productId}`);
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }
);

// UPDATE CART QUANTITY
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await api.put("/shop/cart/update-cart", {
      userId,
      productId,
      quantity,
    });
    return Array.isArray(response.data?.data) ? response.data.data : [];
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
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
