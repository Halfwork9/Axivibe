// src/store/admin/order-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  orderList: [],
  orderDetails: null,
  salesOverview: [],
  orderStats: {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    revenueGrowthPercentage: 0,
    topProducts: [],
    ordersChange: { value: 0, percentage: 0 },
    pendingChange: { value: 0, percentage: 0 },
    deliveredChange: { value: 0, percentage: 0 },
    customersChange: { value: 0, percentage: 0 },
    lowStock: [],
    confirmedOrders: 0,
    shippedOrders: 0,
  },
  isLoading: false,
  pagination: null,
};

// THUNKS
export const fetchOrdersForAdmin = createAsyncThunk(
  "adminOrder/fetchOrdersForAdmin",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/get?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllOrdersForAdmin = createAsyncThunk(
  "adminOrder/getAllOrdersForAdmin",
  async ({ sortBy, page }) => {
    const response = await api.get(`/admin/orders/get?sortBy=${sortBy}&page=${page}`);
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "adminOrder/getOrderDetailsForAdmin",
  async (id) => {
    const response = await api.get(`/admin/orders/details/${id}`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await api.put(`/admin/orders/update/${id}`, { orderStatus });
    return response.data;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "adminOrder/updatePaymentStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/payment-status`, {
        paymentStatus: status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchSalesOverview = createAsyncThunk(
  "adminOrder/fetchSalesOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/orders/sales-overview");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch sales overview");
    }
  }
);

export const fetchOrderStats = createAsyncThunk(
  "adminOrder/fetchOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/orders/stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch stats");
    }
  }
);

// SLICE
const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrdersForAdmin
      .addCase(fetchOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
      })

      // getAllOrdersForAdmin
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
        state.pagination = null;
      })

      // getOrderDetailsForAdmin
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data && state.orderList) {
          const index = state.orderList.findIndex((o) => o._id === action.payload.data._id);
          if (index !== -1) state.orderList[index] = action.payload.data;
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })

      // fetchSalesOverview
      .addCase(fetchSalesOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSalesOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesOverview = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSalesOverview.rejected, (state) => {
        state.isLoading = false;
        state.salesOverview = [];
      })

      // fetchOrderStats (FIXED)
      .addCase(fetchOrderStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderStats = {
          ...initialState.orderStats,
          ...action.payload,
        };
      })
      .addCase(fetchOrderStats.rejected, (state) => {
        state.isLoading = false;
        state.orderStats = initialState.orderStats;
      })

      // updatePaymentStatus
      .addCase(updatePaymentStatus.pending, () => {})
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        if (action.payload?.success && state.orderList) {
          const updated = action.payload.data;
          const idx = state.orderList.findIndex((o) => o._id === updated._id);
          if (idx !== -1) state.orderList[idx] = updated;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        console.error("Payment update failed:", action.payload);
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
