import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import categoryReducer from './category-slice';
import cartReducer from './cart-slice';
import productReducer from './product-slice'; // Add product reducer
import brandReducer from './brand-slice'; // Add brand reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    cart: cartReducer,
    products: productReducer, // Add product reducer
    brands: brandReducer, // Add brand reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
