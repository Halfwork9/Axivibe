import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  cartItems: [], // ✅ store flat array only
  isLoading: false,
  error: null,
};

// ✅ ADD item to cart
export const addToCart = createAsyncThunk(
  "shopCart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/cart/add", {
        userId,
        productId,
        quantity,
      });
      console.log("addToCart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("addToCart error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to add to cart");
    }
  }
);

// ✅ FETCH user cart
export const fetchCartItems = createAsyncThunk(
  "shopCart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/cart/get/${userId}`);
      console.log("fetchCartItems response:", response.data);
      return response.data;
    } catch (error) {
      console.error("fetchCartItems error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

// ✅ UPDATE quantity
export const updateCartQuantity = createAsyncThunk(
  "shopCart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put("/shop/cart/update-cart", {
        userId,
        productId,
        quantity,
      });
      console.log("updateCartQuantity response:", response.data);
      return response.data;
    } catch (error) {
      console.error("updateCartQuantity error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to update cart");
    }
  }
);

// ✅ DELETE item
export const deleteCartItem = createAsyncThunk(
  "shopCart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/shop/cart/${userId}/${productId}`);
      console.log("deleteCartItem response:", response.data);
      return response.data;
    } catch (error) {
      console.error("deleteCartItem error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to delete item");
    }
  }
);

// ✅ CLEAR cart
export const clearCart = createAsyncThunk(
  "shopCart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/shop/cart/clear/${userId}`);
      console.log("clearCart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("clearCart error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to clear cart");
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shopCart",
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.cartItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- ADD ---
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- FETCH ---
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- UPDATE ---
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- DELETE ---
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- CLEAR ---
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartLocal } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
