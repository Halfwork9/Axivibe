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
      const response = await api.post('/shop/cart/add', { userId, productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  'shopCart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/cart/get/${userId}`);
      console.log('fetchCartItems: Success →', response.data);
      return response.data; // Must be: { success: true, data: { items: [...] } }
    } catch (error) {
      console.error('fetchCartItems: Failed →', error.response?.data);
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'shopCart/deleteCartItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/shop/cart/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete item');
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update cart');
    }
  }
);

const shoppingCartSlice = createSlice({
  name: 'shopCart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
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
        state.error = action.payload?.message || 'Failed to load cart';
        state.cartItems = [];
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = Array.isArray(action.payload.data?.items) ? action.payload.data.items : [];
      })

      // Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = Array.isArray(action.payload.data?.items) ? action.payload.data.items : [];
      })

      // Delete Item
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = Array.isArray(action.payload.data?.items) ? action.payload.data.items : [];
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
