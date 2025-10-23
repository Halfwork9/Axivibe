import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';

// --- Global Actions ---
import { checkAuth } from './store/auth-slice';
import { fetchAllCategories } from './store/admin/category-slice';
import { fetchAllBrands } from './store/admin/brand-slice';
import { fetchCartItems } from './store/shop/cart-slice';

// --- Layouts ---
import AuthLayout from './components/auth/layout';
import AdminLayout from './components/admin-view/layout';
import ShoppingLayout from './components/shopping-view/layout';

// --- Components ---
import { Skeleton } from '@/components/ui/skeleton';

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

// --- Page Imports (Lazy Loaded) ---
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

function App() {
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('App: Dispatching global thunks (once)');
    dispatch(checkAuth())
      .unwrap()
      .catch((error) => console.error('checkAuth failed:', error));
    dispatch(fetchAllCategories())
      .unwrap()
      .catch((error) => console.error('fetchAllCategories failed:', error));
    dispatch(fetchAllBrands())
      .unwrap()
      .catch((error) => console.error('fetchAllBrands failed:', error));
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log(`App: Dispatching fetchCartItems for user: ${user.id}`);
      dispatch(fetchCartItems(user.id))
        .unwrap()
        .catch((error) => console.error('fetchCartItems failed:', error));
    } else if (!authLoading && !isAuthenticated) {
      navigate('/auth/login');
    }
  }, [dispatch, isAuthenticated, user?.id, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-80 h-96" />
      </div>
    );
  }

  console.log('App render - isAuthenticated:', isAuthenticated, 'user:', user);

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
                  <Route
                    index
                    element={
                      <ErrorBoundary routePath="/auth">
                        <Navigate to="/auth/login" replace />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="login"
                    element={
                      <ErrorBoundary routePath="/auth/login">
                        <AuthLogin />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="register"
                    element={
                      <ErrorBoundary routePath="/auth/register">
                        <AuthRegister />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="forgot-password"
                    element={
                      <ErrorBoundary routePath="/auth/forgot-password">
                        <ForgotPassword />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="reset-password/:token"
                    element={
                      <ErrorBoundary routePath="/auth/reset-password">
                        <ResetPassword />
                      </ErrorBoundary>
                    }
                  />
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
