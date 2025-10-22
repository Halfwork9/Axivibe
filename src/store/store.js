import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import adminProductsSlice from './admin/products-slice';
import adminOrderSlice from './admin/order-slice';
import adminBrandsReducer from './admin/brand-slice';
import shopProductsSlice from './shop/products-slice';
import shopCartSlice from './shop/cart-slice';
import shopAddressSlice from './shop/address-slice';
import shopOrderSlice from './shop/order-slice';
import shopSearchSlice from './shop/search-slice';
import shopReviewSlice from './shop/review-slice';
import commonFeatureSlice from './common-slice';
import adminCategoriesReducer from './admin/category-slice';
import adminDistributorsReducer from './admin/distributor-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminCategories: adminCategoriesReducer, // Matches category-slice.js
    shopCart: shopCartSlice, // Matches cart-slice.js
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminBrands: adminBrandsReducer,
    shopProducts: shopProductsSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    commonFeature: commonFeatureSlice,
    adminDistributors: adminDistributorsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
