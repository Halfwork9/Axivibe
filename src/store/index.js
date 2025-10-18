import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/auth-slice";
import productsReducer from "@/store/shop/products-slice";
import cartReducer from "@/store/shop/cart-slice";

// ✅ Create your central Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;
