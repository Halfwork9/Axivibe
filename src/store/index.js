import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import categoryReducer from './category-slice'; // Add this import
import cartReducer from './cart-slice'; // Add this import
// Import other reducers as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer, // Add this
    cart: cartReducer, // Add this
    // Add other reducers here, e.g., brands, products, orders
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
