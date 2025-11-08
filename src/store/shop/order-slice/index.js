import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  checkoutUrl: null, // ✅ replaces approvalURL
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

// ✅ Create new order + Stripe session
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await api.post(
      "/shop/order/create",
      orderData
    );

    return response.data;
  }
);

// ✅ Get all orders for a user
export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await api.get(
      `/shop/order/list/${userId}`
    );

    return response.data;
  }
);

// ✅ Get single order details
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await api.get(
      `/shop/order/details/${id}`
    );

    return response.data;
  }
);
export const cancelOrder = createAsyncThunk(
  "/order/cancelOrder",
  async (orderId) => {
    const res = await api.put(`/shop/order/cancel/${orderId}`);
    return res.data;
  }
);

export const returnOrder = createAsyncThunk(
  "/order/returnOrder",
  async (orderId) => {
    const res = await api.put(`/shop/order/return/${orderId}`);
    return res.data;
  }
);
const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Handle Stripe Checkout session creation
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checkoutUrl = action.payload.url; // ✅ Stripe gives us `url`
        state.orderId = action.payload.orderId || null;
        if (action.payload.orderId) {
          sessionStorage.setItem(
            "currentOrderId",
            JSON.stringify(action.payload.orderId)
          );
        }
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.checkoutUrl = null;
        state.orderId = null;
      })

      // ✅ Fetch user orders
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // ✅ Fetch single order
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
    .addCase(cancelOrder.fulfilled, (state, action) => {
    state.orderDetails = action.payload.data;
})
.addCase(returnOrder.fulfilled, (state, action) => {
    state.orderDetails = action.payload.data;
});
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
