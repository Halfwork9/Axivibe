import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate ,useLocation} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';

import { Skeleton } from '@/components/ui/skeleton';

// Global actions
import { checkAuth } from './store/auth-slice';
import { fetchAllCategories } from './store/admin/category-slice';
import { fetchAllBrands } from './store/admin/brand-slice';
import { fetchCartItems } from './store/shop/cart-slice';

// Layouts
import AuthLayout from './components/auth/layout';
import AdminLayout from './components/admin-view/layout';
import ShoppingLayout from './components/shopping-view/layout';

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

// --- Lazy pages ---
const ShoppingHome = lazy(() => import('./pages/shopping-view/home'));
const AuthLogin = lazy(() => import('./pages/auth/login'));
const AuthRegister = lazy(() => import('./pages/auth/register'));
const ForgotPassword = lazy(() => import('./pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('./pages/auth/reset-password'));
const AdminDashboard = lazy(() => import('./pages/admin-view/dashboard'));
const AdminProducts = lazy(() => import('./pages/admin-view/products'));
const AdminOrders = lazy(() => import('./pages/admin-view/orders'));
const AdminFeatures = lazy(() => import('./pages/admin-view/features'));
const Brands = lazy(() => import('./pages/admin-view/brands'));
const AdminCategoriesPage = lazy(() => import('./components/admin-view/categories-page'));
const AdminDistributorsPage = lazy(() => import('./components/admin-view/distributors-page'));
const ShoppingListing = lazy(() => import('./pages/shopping-view/listing'));
const ShoppingCheckout = lazy(() => import('./pages/shopping-view/checkout'));
const ShoppingAccount = lazy(() => import('./pages/shopping-view/account'));
const PaypalReturnPage = lazy(() => import('./pages/shopping-view/StripeReturnPage'));
const PaymentSuccessPage = lazy(() => import('./pages/shopping-view/payment-success'));
const SearchProducts = lazy(() => import('./pages/shopping-view/search'));
const HelpPage = lazy(() => import('./pages/shopping-view/customer-service/help'));
const ContactPage = lazy(() => import('./pages/shopping-view/customer-service/contact'));
const ProductSupportPage = lazy(() => import('./pages/shopping-view/customer-service/product-support'));
const TechnicalSupportPage = lazy(() => import('./pages/shopping-view/customer-service/technical-support'));
const DistributorPage = lazy(() => import('./components/shopping-view/distributor'));
const UnauthPage = lazy(() => import('./pages/unauth-page'));
const NotFound = lazy(() => import('./pages/not-found'));

// --- Separate inner component that uses navigate ---
function AppRoutes() {
 const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth()).catch(console.error);
    dispatch(fetchAllCategories()).catch(console.error);
    dispatch(fetchAllBrands()).catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    const isAuthRoute = location.pathname.startsWith('/auth');

    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id)).catch(console.error);
    } else if (!authLoading && !isAuthenticated && !isAuthRoute) {
      navigate('/auth/login');
    }
  }, [dispatch, isAuthenticated, user?.id, authLoading, navigate, location]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-80 h-96" />
      </div>
    );
  }

  return (
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
