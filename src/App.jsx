import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

// --- Layouts ---
import AuthLayout from "@/components/auth/layout";
import AdminLayout from "@/components/admin-view/layout";
import ShoppingLayout from "@/components/shopping-view/layout";

// --- Pages ---
import ShoppingHome from "@/pages/shopping-view/home";
import AuthLogin from "@/pages/auth/login";
import AuthRegister from "@/pages/auth/register";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import AdminDashboard from "@/pages/admin-view/dashboard";
import AdminProducts from "@/pages/admin-view/products";
import AdminOrders from "@/pages/admin-view/orders";
import AdminFeatures from "@/pages/admin-view/features";
import Brands from "@/pages/admin-view/brands";
import AdminCategoriesPage from "@/components/admin-view/categories-page";
import AdminDistributorsPage from "@/components/admin-view/distributors-page";
import ShoppingListing from "@/pages/shopping-view/listing";
import ShoppingCheckout from "@/pages/shopping-view/checkout";
import ShoppingAccount from "@/pages/shopping-view/account";
import PaypalReturnPage from "@/pages/shopping-view/StripeReturnPage";
import PaymentSuccessPage from "@/pages/shopping-view/payment-success";
import SearchProducts from "@/pages/shopping-view/search";
import HelpPage from "@/pages/shopping-view/customer-service/help";
import ContactPage from "@/pages/shopping-view/customer-service/contact";
import ProductSupportPage from "@/pages/shopping-view/customer-service/product-support";
import TechnicalSupportPage from "@/pages/shopping-view/customer-service/technical-support";
import DistributorPage from "@/components/shopping-view/distributor";
import UnauthPage from "@/pages/unauth-page";
import NotFound from "@/pages/not-found";

// --- Redux Actions ---
import { checkAuth } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllCategories } from "./store/admin/category-slice";
import { fetchAllBrands } from "./store/admin/brand-slice";

// --- Components ---
import { Skeleton } from "@/components/ui/skeleton";

// This is the main component for your application.
// It handles routing and initial auth state.
function App() {
  const dispatch = useDispatch();
  const { isLoading: authLoading, isAuthenticated, user } = useSelector((state) => state.auth || {});

  // ✅ FIX 1: This effect runs ONLY ONCE when the app first loads.
  // It checks if the user is already logged in (via their cookie).
  useEffect(() => {
    console.log("App: Dispatching checkAuth (once)");
    dispatch(checkAuth());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  // ✅ FIX 2: This effect runs ONLY when isAuthenticated changes from false to true.
  // It fetches user-specific data *after* they are confirmed to be logged in.
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log(`App: Auth confirmed. Fetching cart for user ${user.id}`);
      dispatch(fetchCartItems(user.id));
    }
  }, [isAuthenticated, user, dispatch]);

  // While checking auth, show a full-screen loader to prevent the app
  // from rendering prematurely. This also stops the infinite loop.
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-80 h-96" />
      </div>
    );
  }

  // Once auth is checked, render the routes.
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* ✅ FIX: All shop routes are now wrapped in ShoppingLayout */}
          <Route path="/" element={<ShoppingLayout />}>
            <Route index element={<ShoppingHome />} />
            <Route path="shop/home" element={<ShoppingHome />} />
            <Route path="shop/listing" element={<ShoppingListing />} />
            <Route path="shop/checkout" element={<ShoppingCheckout />} />
            <Route path="shop/account" element={<ShoppingAccount />} />
            <Route path="shop/paypal-return" element={<PaypalReturnPage />} />
            <Route path="shop/payment-success" element={<PaymentSuccessPage />} />
            <Route path="shop/search" element={<SearchProducts />} />
            <Route path="shop/help" element={<HelpPage />} />
            <Route path="shop/contact" element={<ContactPage />} />
            <Route path="shop/product-support" element={<ProductSupportPage />} />
            <Route path="shop/technical-support" element={<TechnicalSupportPage />} />
            <Route path="shop/distributors" element={<DistributorPage />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="brands" element={<Brands />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="distributors" element={<AdminDistributorsPage />} />
          </Route>

          {/* Fallback/Other Routes */}
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

