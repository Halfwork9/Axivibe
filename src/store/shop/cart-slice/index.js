import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api';

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

export const addToCart = createAsyncThunk(
  'shopCart/addToCart',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post('/shop/cart/add', {
        userId,
        productId,
        quantity,
      });
      console.log('addToCart: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('addToCart: Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  'shopCart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/cart/get/${userId}`);
      console.log('fetchCartItems: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('fetchCartItems: Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'shopCart/deleteCartItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/shop/cart/${userId}/${productId}`);
      console.log('deleteCartItem: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('deleteCartItem: Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to delete cart item');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'shopCart/updateCartQuantity',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put('/shop/cart/update-cart', {
        userId,
        productId,
        quantity,
      });
      console.log('updateCartQuantity: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('updateCartQuantity: Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to update cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'shopCart/clearCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/shop/cart/clear/${userId}`);
      console.log('clearCart: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('clearCart: Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to clear cart');
    }
  }
);

const shoppingCartSlice = createSlice({
  name: 'shopCart',
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.cartItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = Array.isArray(action.payload.data?.items) ? action.payload.data.items : [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add to cart';
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = Array.isArray(action.payload.data?.items) ? action.payload.data.items : [];
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart';
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = Array.isArray(action.payload.data?.items) ? action.payload.data.items : [];
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update cart';
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = Array.isArray(action.payload.data?.items) ? action.payload.data.items : [];
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete cart item';
      })
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to clear cart';
      });
  },
});

export const { clearCartLocal } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
