// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { checkAuth, logoutUser } from './store/auth-slice';
import { fetchAllCategories, fetchAllBrands } from './store/admin/category-slice';
import { fetchCartItems } from './store/shop/cart-slice';
import ShoppingLayout from './components/shopping-view/layout';
import AuthLayout from './components/auth/layout';
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import PaypalReturnPage from "./pages/shopping-view/StripeReturnPage";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import Brands from "@/pages/admin-view/brands";// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

// --- Global Actions ---
import { checkAuth } from './store/auth-slice';
import { fetchAllCategories } from './store/admin/category-slice';
import { fetchAllBrands } from './store/admin/brand-slice';
import { fetchCartItems } from './store/shop/cart-slice';

// --- Layouts ---
import AuthLayout from './components/auth/layout';
import AdminLayout from './components/admin-view/layout';
import ShoppingLayout from './components/shopping-view/layout';

// --- Pages ---
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import PaypalReturnPage from './pages/shopping-view/StripeReturnPage';
import PaymentSuccessPage from './pages/shopping-view/payment-success';
import SearchProducts from './pages/shopping-view/search';
import HelpPage from './pages/shopping-view/customer-service/help';
import ContactPage from './pages/shopping-view/customer-service/contact';
import ProductSupportPage from './pages/shopping-view/customer-service/product-support';
import TechnicalSupportPage from './pages/shopping-view/customer-service/technical-support';
import DistributorPage from './components/shopping-view/distributor';
import UnauthPage from './pages/unauth-page';
import NotFound from './pages/not-found';

// --- Auth Pages ---
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';

// --- Admin Pages ---
import AdminDashboard from './pages/admin-view/dashboard';
import AdminProducts from './pages/admin-view/products';
import AdminOrders from './pages/admin-view/orders';
import AdminFeatures from './pages/admin-view/features';
import Brands from './pages/admin-view/brands';
import AdminCategoriesPage from './components/admin-view/categories-page';
import AdminDistributorsPage from './components/admin-view/distributors-page';

// --- Components ---
import ErrorBoundary from './components/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ← Properly imported and used

  // Run once on mount
  useEffect(() => {
    console.log('App: Dispatching global thunks (once)');
    dispatch(checkAuth());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  // Fetch cart only when logged in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log(`App: Dispatching fetchCartItems for user: ${user.id}`);
      dispatch(fetchCartItems(user.id));
    } else if (!isLoading && !isAuthenticated) {
      navigate('/auth/login');
    }
  }, [dispatch, isAuthenticated, user?.id, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-[800px] h-[600px]" />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="554858497538-5lglbrrcec9n5qd25tpicvi2q1lcf.apps.googleusercontent.com">
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-white">
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                {/* Root Redirect */}
                <Route path="/" element={<Navigate to="/shop/home" replace />} />

                {/* Shopping Routes */}
                <Route path="/shop" element={<ShoppingLayout />}>
                  <Route index element={<Navigate to="/shop/home" replace />} />
                  <Route path="home" element={<ShoppingHome />} />
                  <Route path="listing" element={<ShoppingListing />} />
                  <Route path="checkout" element={<ShoppingCheckout />} />
                  <Route path="account" element={<ShoppingAccount />} />
                  <Route path="paypal-return" element={<PaypalReturnPage />} />
                  <Route path="payment-success" element={<PaymentSuccessPage />} />
                  <Route path="search" element={<SearchProducts />} />
                  <Route path="help" element={<HelpPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="product-support" element={<ProductSupportPage />} />
                  <Route path="technical-support" element={<TechnicalSupportPage />} />
                  <Route path="distributors" element={<DistributorPage />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route index element={<Navigate to="/auth/login" replace />} />
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

                <Route path="/unauth-page" element={<UnauthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </div>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}

export default App;
import AdminCategoriesPage from "@/components/admin-view/categories-page";
import HelpPage from "@/pages/shopping-view/customer-service/help";
import ContactPage from "@/pages/shopping-view/customer-service/contact";
import ProductSupportPage from "@/pages/shopping-view/customer-service/product-support";
import TechnicalSupportPage from "@/pages/shopping-view/customer-service/technical-support";
import DistributorPage from "@/components/shopping-view/distributor";
import AdminDistributorsPage from "@/components/admin-view/distributors-page";
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import UnauthPage from './pages/unauth-page';
import NotFound from './pages/not-found';
import ErrorBoundary from './components/error-boundary'; // Import the separate component

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Ensure useNavigate is imported and used

  React.useEffect(() => {
    console.log('App: Dispatching global thunks (once)');
    dispatch(checkAuth());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log(`App: Dispatching fetchCartItems for user: ${user.id}`);
      dispatch(fetchCartItems(user.id));
    } else if (!isLoading && !isAuthenticated) {
      navigate('/auth/login');
    }
  }, [dispatch, isAuthenticated, user?.id, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="554858497538-5lglbrrcecarc9n5qd25tpicvi2q1lcf.apps.googleusercontent.com">
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-white">
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/shop/home" replace />} />
                <Route path="/shop" element={<ShoppingLayout />}>
                  <Route index element={<Navigate to="/shop/home" replace />} />
                  <Route path="home" element={<ShoppingHome />} />
                  <Route path="listing" element={<ShoppingListing />} />
                  <Route path="checkout" element={<ShoppingCheckout />} />
                  <Route path="account" element={<ShoppingAccount />} />
                  <Route path="paypal-return" element={<PaypalReturnPage />} />
                  <Route path="payment-success" element={<PaymentSuccessPage />} />
                  <Route path="search" element={<SearchProducts />} />
                  <Route path="help" element={<HelpPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="product-support" element={<ProductSupportPage />} />
                  <Route path="technical-support" element={<TechnicalSupportPage />} />
                  <Route path="distributors" element={<DistributorPage />} />
                </Route>
                <Route path="/auth" element={<AuthLayout />}>
                  <Route index element={<Navigate to="/auth/login" replace />} />
                  <Route path="login" element={<AuthLogin />} />
                  <Route path="register" element={<AuthRegister />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                </Route>
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
                <Route path="/unauth-page" element={<UnauthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </div>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}

export default App;
