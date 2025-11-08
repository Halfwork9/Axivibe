import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';

import { Skeleton } from '@/components/ui/skeleton';
import ProductDetailsPage from "./components/shopping-view/product-details-page";

// Global actions
import { checkAuth } from './store/auth-slice';
import { fetchAllCategories } from './store/admin/category-slice';
import { fetchAllBrands } from './store/admin/brand-slice';
import { fetchCartItems } from './store/shop/cart-slice';

// Layouts
import AuthLayout from './components/auth/layout';
import AdminLayout from './components/admin-view/layout';
import ShoppingLayout from './components/shopping-view/layout';

// Pages (non-lazy imports)
import ShoppingHome from './pages/shopping-view/home';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminProducts from './pages/admin-view/products';
import AdminOrders from './pages/admin-view/orders';
import AdminOrderDetails from "./components/admin-view/order-details";
import AdminFeatures from './pages/admin-view/features';
import Brands from './pages/admin-view/brands';
import AdminCategoriesPage from './components/admin-view/categories-page';
import AdminDistributorsPage from './components/admin-view/distributors-page';
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
import OrderDetailsPage from "@/components/admin-view/OrderDetailsPage";
import OrderDetailsPage from "@/components/shopping-view/order-details";

// --- Error Boundary ---
class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught at:', this.props.routePath, error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="text-red-500">{this.state.error.message || 'Unknown error'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Separate inner component that uses navigate ---
function AppRoutes() {
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: Single useEffect to handle initial auth check and data fetching
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Dispatch checkAuth and wait for it to complete
        const result = await dispatch(checkAuth());
        
        // If checkAuth was successful, fetch initial data
        if (result.meta.requestStatus === 'fulfilled') {
          console.log("User is authenticated, fetching data...");
          dispatch(fetchAllCategories());
          dispatch(fetchAllBrands());
          // Fetch cart items if user object is available
          if (result.payload?.id) {
            dispatch(fetchCartItems(result.payload.id));
          }
        } else {
          console.log("User is not authenticated.");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    initializeApp();
  }, [dispatch]); // ✅ This effect now only runs once on mount

  // ✅ FIX: Remove the problematic useEffect. Routing logic is now handled in the render.
  
 if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-80 h-96" />
      </div>
    );
  }

  return (
    <Routes>
      {/* ✅ FIX: The root path now renders the ShoppingLayout directly */}
      <Route path="/" element={<ShoppingLayout />}>
        {/* ✅ FIX: The index route inside the layout now renders the home page */}
        <Route index element={<ShoppingHome />} />
        <Route path="home" element={<Navigate to="/shop/home" replace />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="account" element={
          isAuthenticated ? <ShoppingAccount /> : <Navigate to="/auth/login" state={{ from: location }} replace />
        } />
        <Route path="paypal-return" element={<PaypalReturnPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="search" element={<SearchProducts />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="product-support" element={<ProductSupportPage />} />
        <Route path="technical-support" element={<TechnicalSupportPage />} />
        <Route path="distributor" element={<DistributorPage />} />
      </Route>

      <Route path="/shop" element={<ShoppingLayout />}>
        <Route index element={<Navigate to="/shop/home" replace />} />
        <Route path="home" element={<ShoppingHome />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="/shop/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="account" element={
          isAuthenticated ? <ShoppingAccount /> : <Navigate to="/auth/login" state={{ from: location }} replace />
        } />
        <Route path="paypal-return" element={<PaypalReturnPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="search" element={<SearchProducts />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="product-support" element={<ProductSupportPage />} />
        <Route path="technical-support" element={<TechnicalSupportPage />} />
        <Route path="distributor" element={<DistributorPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={
          !isAuthenticated ? <AuthLogin /> : <Navigate to="/shop/home" replace />
        } />
        <Route path="register" element={
          !isAuthenticated ? <AuthRegister /> : <Navigate to="/shop/home" replace />
        } />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route path="/admin" element={
        isAuthenticated && user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/auth/login" state={{ from: location }} replace />
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/details/:id" element={<AdminOrderDetails />} />
        <Route path="features" element={<AdminFeatures />} />
        <Route path="brands" element={<Brands />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="distributor" element={<AdminDistributorsPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
      </Route>

      <Route path="/unauth-page" element={<UnauthPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


// --- Main wrapper ---
export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <Router>
          <AppRoutes />
        </Router>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}
