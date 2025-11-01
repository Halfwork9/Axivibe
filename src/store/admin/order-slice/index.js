// src/store/admin/order-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
  pagination: null,
};

export const fetchOrdersForAdmin = createAsyncThunk(
  'adminOrder/fetchOrdersForAdmin',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/get?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async ({ sortBy, page }) => {
    const response = await api.get(
      `/admin/orders/get?sortBy=${sortBy}&page=${page}`
    );

    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await api.get(
      `/admin/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await api.put(
      `/admin/orders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

// ✅ NEW: Add the async thunk for updating payment status
export const updatePaymentStatus = createAsyncThunk(
  'adminOrder/updatePaymentStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/payment-status`, {
        paymentStatus: status,
      });
      return response.data; // This will be { success: true, data: updatedOrder }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
        state.pagination = action.payload.pagination; // Save pagination info
      })
      .addCase(fetchOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        // Don't clear the list on error, just stop loading
      })
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
        state.pagination = null;
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the order in the list if it exists
        if (state.orderList && state.orderList.length > 0) {
          const index = state.orderList.findIndex(
            (order) => order._id === action.payload.data._id
          );
          if (index !== -1) {
            state.orderList[index] = action.payload.data;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })
      // ✅ NEW: Add extraReducers for the new updatePaymentStatus thunk
      .addCase(updatePaymentStatus.pending, (state) => {
        // You could add a specific loading state here if needed
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        if (action.payload.success) {
          const updatedOrder = action.payload.data;
          // Find the order in the list and update it
          const index = state.orderList.findIndex(order => order._id === updatedOrder._id);
          if (index !== -1) {
            state.orderList[index] = updatedOrder;
          }
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        // Handle error, maybe show a toast notification
        console.error("Failed to update payment status:", action.payload);
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
