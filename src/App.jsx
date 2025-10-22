import React, { useEffect, Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';

// --- Global Actions ---
// ✅ FIX: Corrected all import paths to use the '@/ alias
import { checkAuth } from '@/store/auth-slice';
import { fetchAllCategories } from '@/store/admin/category-slice';
import { fetchAllBrands } from '@/store/admin/brand-slice';
import { fetchCartItems } from '@/store/shop/cart-slice';

// --- Layouts ---
import AuthLayout from '@/components/auth/layout';
import AdminLayout from '@/components/admin-view/layout';
import ShoppingLayout from '@/components/shopping-view/layout';

// --- Components ---
import { Skeleton } from '@/components/ui/skeleton';

// --- Page Imports (Lazy Loaded) ---
const ShoppingHome = lazy(() => import('@/pages/shopping-view/home'));
const AuthLogin = lazy(() => import('@/pages/auth/login'));
const AuthRegister = lazy(() => import('@/pages/auth/register'));
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('@/pages/auth/reset-password'));
const AdminDashboard = lazy(() => import('@/pages/admin-view/dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin-view/products'));
const AdminOrders = lazy(() => import('@/pages/admin-view/orders'));
const AdminFeatures = lazy(() => import('@/pages/admin-view/features'));
const Brands = lazy(() => import('@/pages/admin-view/brands'));
const AdminCategoriesPage = lazy(() => import('@/components/admin-view/categories-page'));
const AdminDistributorsPage = lazy(() => import('@/components/admin-view/distributors-page'));
const ShoppingListing = lazy(() => import('@/pages/shopping-view/listing'));
const ShoppingCheckout = lazy(() => import('@/pages/shopping-view/checkout'));
const ShoppingAccount = lazy(() => import('@/pages/shopping-view/account'));
const PaypalReturnPage = lazy(() => import('@/pages/shopping-view/StripeReturnPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/shopping-view/payment-success'));
const SearchProducts = lazy(() => import('@/pages/shopping-view/search'));
const HelpPage = lazy(() => import('@/pages/shopping-view/customer-service/help'));
const ContactPage = lazy(() => import('@/pages/shopping-view/customer-service/contact'));
const ProductSupportPage = lazy(() => import('@/pages/shopping-view/customer-service/product-support'));
const TechnicalSupportPage = lazy(() => import('@/pages/shopping-view/customer-service/technical-support'));
const DistributorPage = lazy(() => import('@/components/shopping-view/distributor'));
const UnauthPage = lazy(() => import('@/pages/unauth-page'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Error Boundary
class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
            <p>{this.state.error.message || 'Unknown error'}</p>
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

function App() {
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-80 h-96" />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-white">
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
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

                <Route path="/auth" element={<AuthLayout />}>
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
            </Suspense>{/* ✅ FIX: Removed stray closing </NetworkStatusHandler> tag */}
          </Router>
        </div>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}

export default App;

